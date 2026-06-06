import { create } from 'zustand';
import type { Application, UploadedMaterial, ApprovalRecord } from '@/types';
import { mockApplications } from '@/mock/applications';
import { serviceItems } from '@/mock/items';

interface ApplicationStore {
  applications: Application[];
  currentApplication: Application | null;
  fetchApplications: () => void;
  fetchApplicationDetail: (id: string) => Application | undefined;
  createApplication: (itemId: string, userId: string, userName: string, userPhone: string) => Application;
  updateApplication: (id: string, data: Partial<Application>) => void;
  submitApplication: (id: string) => void;
  addMaterial: (appId: string, material: UploadedMaterial) => void;
  addApprovalRecord: (appId: string, record: ApprovalRecord) => void;
  setCurrentApplication: (app: Application | null) => void;
}

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  applications: mockApplications,
  currentApplication: null,

  fetchApplications: () => {
    set({ applications: mockApplications });
  },

  fetchApplicationDetail: (id: string) => {
    const app = get().applications.find((a) => a.id === id);
    if (app) {
      set({ currentApplication: app });
    }
    return app;
  },

  createApplication: (itemId: string, userId: string, userName: string, userPhone: string) => {
    const item = serviceItems.find((i) => i.id === itemId);
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
      approvalRecords: []
    };
    set((state) => ({
      applications: [newApp, ...state.applications],
      currentApplication: newApp
    }));
    return newApp;
  },

  updateApplication: (id: string, data: Partial<Application>) => {
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, ...data, updateTime: new Date().toLocaleString() } : app
      ),
      currentApplication:
        state.currentApplication?.id === id
          ? { ...state.currentApplication, ...data, updateTime: new Date().toLocaleString() }
          : state.currentApplication
    }));
  },

  submitApplication: (id: string) => {
    const record: ApprovalRecord = {
      id: `ar-${Date.now()}`,
      nodeName: '提交申请',
      department: '综合窗口',
      handler: '系统',
      opinion: '申请已提交',
      status: 'approved',
      time: new Date().toLocaleString()
    };
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id
          ? {
              ...app,
              status: 'submitted',
              currentNode: '提交申请',
              approvalRecords: [...app.approvalRecords, record],
              updateTime: new Date().toLocaleString()
            }
          : app
      )
    }));
  },

  addMaterial: (appId: string, material: UploadedMaterial) => {
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === appId
          ? { ...app, materials: [...app.materials, material], updateTime: new Date().toLocaleString() }
          : app
      ),
      currentApplication:
        state.currentApplication?.id === appId
          ? {
              ...state.currentApplication,
              materials: [...state.currentApplication.materials, material],
              updateTime: new Date().toLocaleString()
            }
          : state.currentApplication
    }));
  },

  addApprovalRecord: (appId: string, record: ApprovalRecord) => {
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === appId
          ? {
              ...app,
              approvalRecords: [...app.approvalRecords, record],
              currentNode: record.nodeName,
              updateTime: new Date().toLocaleString()
            }
          : app
      )
    }));
  },

  setCurrentApplication: (app: Application | null) => {
    set({ currentApplication: app });
  }
}));
