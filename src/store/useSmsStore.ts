import { create } from 'zustand';
import type { SmsRecord, SmsType } from '@/types';

const STORAGE_KEY = 'sms_records';

interface SmsStore {
  smsRecords: SmsRecord[];
  sendSms: (phone: string, type: SmsType, applicationId?: string) => SmsRecord;
  sendVerificationCode: (phone: string) => { record: SmsRecord; code: string };
  verifyCode: (phone: string, code: string) => boolean;
  getSmsByPhone: (phone: string) => SmsRecord[];
  getSmsByApplication: (applicationId: string) => SmsRecord[];
  loadFromStorage: () => void;
}

const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const getSmsContent = (type: SmsType, code?: string): string => {
  switch (type) {
    case 'login_code':
      return `【政务服务平台】您的登录验证码是${code}，5分钟内有效，请勿泄露给他人。`;
    case 'submit_success':
      return '【政务服务平台】您的办件申请已提交成功，我们将尽快为您办理，请关注办件进度。';
    case 'correction':
      return '【政务服务平台】您的办件需要补正材料，请登录平台查看详情并重新提交。';
    case 'overdue':
      return '【政务服务平台】您的办件即将超时，请相关部门尽快处理。';
    case 'completed':
      return '【政务服务平台】您的办件已办结，请登录平台查看结果或预约取件。';
    default:
      return '';
  }
};

export const useSmsStore = create<SmsStore>((set, get) => ({
  smsRecords: [],

  loadFromStorage: () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        set({ smsRecords: JSON.parse(stored) });
      } catch (e) {
        console.error('Failed to parse SMS records from storage');
      }
    }
  },

  sendSms: (phone: string, type: SmsType, applicationId?: string) => {
    const code = type === 'login_code' ? generateCode() : undefined;
    const record: SmsRecord = {
      id: `sms-${Date.now()}`,
      phone,
      type,
      content: getSmsContent(type, code),
      status: 'pending',
      createTime: new Date().toLocaleString(),
      applicationId,
      verificationCode: code
    };

    setTimeout(() => {
      set((state) => ({
        smsRecords: state.smsRecords.map((r) =>
          r.id === record.id ? { ...r, status: 'sent' as const, sendTime: new Date().toLocaleString() } : r
        )
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(get().smsRecords));
    }, 1000);

    set((state) => {
      const newRecords = [record, ...state.smsRecords];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
      return { smsRecords: newRecords };
    });

    return record;
  },

  sendVerificationCode: (phone: string) => {
    const code = generateCode();
    const record: SmsRecord = {
      id: `sms-${Date.now()}`,
      phone,
      type: 'login_code',
      content: getSmsContent('login_code', code),
      status: 'pending',
      createTime: new Date().toLocaleString(),
      verificationCode: code
    };

    setTimeout(() => {
      set((state) => ({
        smsRecords: state.smsRecords.map((r) =>
          r.id === record.id ? { ...r, status: 'sent' as const, sendTime: new Date().toLocaleString() } : r
        )
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(get().smsRecords));
    }, 1000);

    set((state) => {
      const newRecords = [record, ...state.smsRecords];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
      return { smsRecords: newRecords };
    });

    return { record, code };
  },

  verifyCode: (phone: string, code: string) => {
    const records = get().smsRecords.filter(
      (r) => r.phone === phone && r.type === 'login_code' && r.verificationCode
    );
    if (records.length === 0) return false;
    const latest = records[0];
    return latest.verificationCode === code;
  },

  getSmsByPhone: (phone: string) => {
    return get().smsRecords.filter((r) => r.phone === phone);
  },

  getSmsByApplication: (applicationId: string) => {
    return get().smsRecords.filter((r) => r.applicationId === applicationId);
  }
}));
