import type { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user-001',
    name: '张三',
    idCard: '110101199001011234',
    phone: '13800138001',
    role: 'citizen',
    avatar: ''
  },
  {
    id: 'user-002',
    name: '李窗口',
    idCard: '110101198501011234',
    phone: '13800138002',
    role: 'worker',
    department: '政务服务中心',
    avatar: ''
  },
  {
    id: 'user-003',
    name: '王审批',
    idCard: '110101198001011234',
    phone: '13800138003',
    role: 'approver',
    department: '市场监督管理局',
    avatar: ''
  },
  {
    id: 'user-004',
    name: '赵管理员',
    idCard: '110101197501011234',
    phone: '13800138004',
    role: 'admin',
    department: '政务服务管理局',
    avatar: ''
  }
];

export const currentUser: User = mockUsers[0];
