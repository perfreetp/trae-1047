import { create } from 'zustand';
import type {
  Application,
  UploadedMaterial,
  ApprovalRecord,
  Signature,
  Appointment,
  ResultFile,
  Evaluation
} from '@/types';
import { mockApplications } from '@/mock/applications';
import { serviceItems } from '@/mock/items';
import { useSmsStore } from './useSmsStore';

const STORAGE_KEY = 'applications';

interface ApplicationStore {
  applications: Application[];
  currentApplication: Application | null;
  initialized: boolean;
  init: () => void;
  fetchApplications: () => void;
  fetchApplicationDetail: (id: string) => Application | undefined;
  createApplication: (itemId: string, userId: string, userName: string, userPhone: string) => Application;
  updateApplication: (id: string, data: Partial<Application>) => void;
  submitApplication: (id: string) => void;
  addMaterial: (appId: string, material: UploadedMaterial) => void;
  updateMaterial: (appId: string, materialId: string, data: Partial<UploadedMaterial>) => void;
  addApprovalRecord: (appId: string, record: ApprovalRecord) => void;
  setCurrentApplication: (app: Application | null) => void;
  setSignature: (appId: string, signature: Signature) => void;
  resubmitAfterCorrection: (appId: string) => void;
  setAppointment: (appId: string, appointment: Appointment) => void;
  addResultFile: (appId: string, file: ResultFile) => void;
  assignDepartment: (appId: string, department: string) => void;
  completeApplication: (appId: string) => void;
  rejectApplication: (appId: string, opinion: string) => void;
  requestCorrection: (appId: string, notice: string, materialIds: string[]) => void;
  submitEvaluation: (appId: string, evaluation: Evaluation) => void;
}

const saveToStorage = (applications: Application[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
};

const loadFromStorage = (): Application[] | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse applications from storage');
    }
  }
  return null;
};

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  applications: [],
  currentApplication: null,
  initialized: false,

  init: () => {
    if (get().initialized) return;
    const stored = loadFromStorage();
    if (stored && stored.length > 0) {
      set({ applications: stored, initialized: true });
    } else {
      set({ applications: mockApplications, initialized: true });
      saveToStorage(mockApplications);
    }
  },

  fetchApplications: () => {
    get().init();
  },

  fetchApplicationDetail: (id: string) => {
    get().init();
    const app = get().applications.find((a) => a.id === id);
    if (app) {
      set({ currentApplication: app });
    }
    return app;
  },

  createApplication: (itemId: string, userId: string, userName: string, userPhone: string) => {
    get().init();
    const item = serviceItems.find((i) => i.id === itemId);
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + (item?.promiseTime || 5));
    
    const newApp: Application = {
      id: `app-${Date.now()}`,
      itemId,
      itemName: item?.name || '',
      applicantId: userId,
      applicantName: userName,
      applicantPhone: userPhone,
      status: 'draft',
      formData: {},
      materials: [],
      createTime: new Date().toLocaleString(),
      updateTime: new Date().toLocaleString(),
      currentNode: '填写信息',
      approvalRecords: [],
      deadline: deadline.toLocaleDateString(),
      isOverdue: false
    };
    
    set((state) => {
      const newApps = [newApp, ...state.applications];
      saveToStorage(newApps);
      return { applications: newApps, currentApplication: newApp };
    });
    return newApp;
  },

  updateApplication: (id: string, data: Partial<Application>) => {
    set((state) => {
      const newApps = state.applications.map((app) =>
        app.id === id ? { ...app, ...data, updateTime: new Date().toLocaleString() } : app
      );
      saveToStorage(newApps);
      return {
        applications: newApps,
        currentApplication:
          state.currentApplication?.id === id
            ? { ...state.currentApplication, ...data, updateTime: new Date().toLocaleString() }
            : state.currentApplication
      };
    });
  },

  submitApplication: (id: string) => {
    const app = get().applications.find((a) => a.id === id);
    if (!app) return;

    const record: ApprovalRecord = {
      id: `ar-${Date.now()}`,
      nodeName: '提交申请',
      department: '综合窗口',
      handler: '系统',
      opinion: '申请已提交，等待受理',
      status: 'approved',
      time: new Date().toLocaleString()
    };

    const smsStore = useSmsStore.getState();
    smsStore.sendSms(app.applicantPhone, 'submit_success', id);

    set((state) => {
      const newApps = state.applications.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'submitted',
              currentNode: '提交申请',
              approvalRecords: [...a.approvalRecords, record],
              updateTime: new Date().toLocaleString()
            }
          : a
      );
      saveToStorage(newApps);
      return { applications: newApps };
    });
  },

  addMaterial: (appId: string, material: UploadedMaterial) => {
    set((state) => {
      const newApps = state.applications.map((app) =>
        app.id === appId
          ? { ...app, materials: [...app.materials, material], updateTime: new Date().toLocaleString() }
          : app
      );
      saveToStorage(newApps);
      return {
        applications: newApps,
        currentApplication:
          state.currentApplication?.id === appId
            ? {
                ...state.currentApplication,
                materials: [...state.currentApplication.materials, material],
                updateTime: new Date().toLocaleString()
              }
            : state.currentApplication
      };
    });
  },

  updateMaterial: (appId: string, materialId: string, data: Partial<UploadedMaterial>) => {
    set((state) => {
      const newApps = state.applications.map((app) =>
        app.id === appId
          ? {
              ...app,
              materials: app.materials.map((m) =>
                m.id === materialId ? { ...m, ...data } : m
              ),
              updateTime: new Date().toLocaleString()
            }
          : app
      );
      saveToStorage(newApps);
      return {
        applications: newApps,
        currentApplication:
          state.currentApplication?.id === appId
            ? {
                ...state.currentApplication,
                materials: state.currentApplication.materials.map((m) =>
                  m.id === materialId ? { ...m, ...data } : m
                ),
                updateTime: new Date().toLocaleString()
              }
            : state.currentApplication
      };
    });
  },

  addApprovalRecord: (appId: string, record: ApprovalRecord) => {
    set((state) => {
      const newApps = state.applications.map((app) =>
        app.id === appId
          ? {
              ...app,
              approvalRecords: [...app.approvalRecords, record],
              currentNode: record.nodeName,
              updateTime: new Date().toLocaleString()
            }
          : app
      );
      saveToStorage(newApps);
      return { applications: newApps };
    });
  },

  setCurrentApplication: (app: Application | null) => {
    set({ currentApplication: app });
  },

  setSignature: (appId: string, signature: Signature) => {
    set((state) => {
      const newApps = state.applications.map((app) =>
        app.id === appId
          ? { ...app, signature, updateTime: new Date().toLocaleString() }
          : app
      );
      saveToStorage(newApps);
      return {
        applications: newApps,
        currentApplication:
          state.currentApplication?.id === appId
            ? { ...state.currentApplication, signature, updateTime: new Date().toLocaleString() }
            : state.currentApplication
      };
    });
  },

  resubmitAfterCorrection: (appId: string) => {
    const app = get().applications.find((a) => a.id === appId);
    if (!app) return;

    const record: ApprovalRecord = {
      id: `ar-${Date.now()}`,
      nodeName: '材料补正重提',
      department: '综合窗口',
      handler: app.applicantName,
      opinion: '已补正材料，重新提交审核',
      status: 'approved',
      time: new Date().toLocaleString()
    };

    set((state) => {
      const newApps = state.applications.map((a) =>
        a.id === appId
          ? {
              ...a,
              status: 'processing',
              currentNode: '材料补正重提',
              correctionNotice: undefined,
              approvalRecords: [...a.approvalRecords, record],
              materials: a.materials.map((m) => ({ ...m, status: 'pending' as const })),
              updateTime: new Date().toLocaleString()
            }
          : a
      );
      saveToStorage(newApps);
      return { applications: newApps };
    });
  },

  setAppointment: (appId: string, appointment: Appointment) => {
    set((state) => {
      const newApps = state.applications.map((app) =>
        app.id === appId
          ? { ...app, appointment, updateTime: new Date().toLocaleString() }
          : app
      );
      saveToStorage(newApps);
      return {
        applications: newApps,
        currentApplication:
          state.currentApplication?.id === appId
            ? { ...state.currentApplication, appointment, updateTime: new Date().toLocaleString() }
            : state.currentApplication
      };
    });
  },

  addResultFile: (appId: string, file: ResultFile) => {
    set((state) => {
      const newApps = state.applications.map((app) =>
        app.id === appId
          ? {
              ...app,
              resultFiles: [...(app.resultFiles || []), file],
              updateTime: new Date().toLocaleString()
            }
          : app
      );
      saveToStorage(newApps);
      return {
        applications: newApps,
        currentApplication:
          state.currentApplication?.id === appId
            ? {
                ...state.currentApplication,
                resultFiles: [...(state.currentApplication.resultFiles || []), file],
                updateTime: new Date().toLocaleString()
              }
            : state.currentApplication
      };
    });
  },

  assignDepartment: (appId: string, department: string) => {
    const record: ApprovalRecord = {
      id: `ar-${Date.now()}`,
      nodeName: '部门分派',
      department: '政务服务中心',
      handler: '系统',
      opinion: `已分派至${department}处理`,
      status: 'approved',
      time: new Date().toLocaleString()
    };

    set((state) => {
      const newApps = state.applications.map((app) =>
        app.id === appId
          ? {
              ...app,
              assignedDepartment: department,
              status: 'processing',
              currentNode: '部门分派',
              approvalRecords: [...app.approvalRecords, record],
              updateTime: new Date().toLocaleString()
            }
          : app
      );
      saveToStorage(newApps);
      return { applications: newApps };
    });
  },

  completeApplication: (appId: string) => {
    const app = get().applications.find((a) => a.id === appId);
    if (!app) return;

    const record: ApprovalRecord = {
      id: `ar-${Date.now()}`,
      nodeName: '办结',
      department: app.assignedDepartment || '综合窗口',
      handler: '审批员',
      opinion: '审批通过，予以办结',
      status: 'approved',
      time: new Date().toLocaleString()
    };

    const resultFile: ResultFile = {
      id: `result-${Date.now()}`,
      name: `${app.itemName}_办理结果.pdf`,
      url: '#',
      type: 'application/pdf',
      createTime: new Date().toLocaleString()
    };

    const smsStore = useSmsStore.getState();
    smsStore.sendSms(app.applicantPhone, 'completed', appId);

    set((state) => {
      const newApps = state.applications.map((a) =>
        a.id === appId
          ? {
              ...a,
              status: 'completed',
              currentNode: '办结',
              approvalRecords: [...a.approvalRecords, record],
              resultFiles: [...(a.resultFiles || []), resultFile],
              updateTime: new Date().toLocaleString()
            }
          : a
      );
      saveToStorage(newApps);
      return { applications: newApps };
    });
  },

  rejectApplication: (appId: string, opinion: string) => {
    const app = get().applications.find((a) => a.id === appId);
    if (!app) return;

    const record: ApprovalRecord = {
      id: `ar-${Date.now()}`,
      nodeName: '审批驳回',
      department: app.assignedDepartment || '综合窗口',
      handler: '审批员',
      opinion,
      status: 'rejected',
      time: new Date().toLocaleString()
    };

    set((state) => {
      const newApps = state.applications.map((a) =>
        a.id === appId
          ? {
              ...a,
              status: 'rejected',
              currentNode: '审批驳回',
              approvalRecords: [...a.approvalRecords, record],
              updateTime: new Date().toLocaleString()
            }
          : a
      );
      saveToStorage(newApps);
      return { applications: newApps };
    });
  },

  requestCorrection: (appId: string, notice: string, materialIds: string[]) => {
    const app = get().applications.find((a) => a.id === appId);
    if (!app) return;

    const record: ApprovalRecord = {
      id: `ar-${Date.now()}`,
      nodeName: '材料补正通知',
      department: app.assignedDepartment || '综合窗口',
      handler: '审批员',
      opinion: notice,
      status: 'correction',
      time: new Date().toLocaleString()
    };

    const smsStore = useSmsStore.getState();
    smsStore.sendSms(app.applicantPhone, 'correction', appId);

    set((state) => {
      const newApps = state.applications.map((a) =>
        a.id === appId
          ? {
              ...a,
              status: 'correction',
              currentNode: '材料补正通知',
              correctionNotice: notice,
              approvalRecords: [...a.approvalRecords, record],
              materials: a.materials.map((m) =>
                materialIds.includes(m.id) ? { ...m, status: 'rejected' as const } : m
              ),
              updateTime: new Date().toLocaleString()
            }
          : a
      );
      saveToStorage(newApps);
      return { applications: newApps };
    });
  },

  submitEvaluation: (appId: string, evaluation: Evaluation) => {
    set((state) => {
      const newApps = state.applications.map((app) =>
        app.id === appId
          ? { ...app, evaluation, updateTime: new Date().toLocaleString() }
          : app
      );
      saveToStorage(newApps);
      return {
        applications: newApps,
        currentApplication:
          state.currentApplication?.id === appId
            ? { ...state.currentApplication, evaluation, updateTime: new Date().toLocaleString() }
            : state.currentApplication
      };
    });
  }
}));
