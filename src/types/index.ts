export type UserRole = 'citizen' | 'worker' | 'approver' | 'admin';

export interface User {
  id: string;
  name: string;
  idCard: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  required: boolean;
  format: string[];
  maxSize: number;
  description: string;
}

export interface ProcessStep {
  id: string;
  name: string;
  department: string;
  duration: number;
  description: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  department: string;
  promiseTime: number;
  description: string;
  conditions: string[];
  materials: MaterialItem[];
  process: ProcessStep[];
  fee: string;
  icon?: string;
  hot?: boolean;
}

export type ApplicationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'processing' 
  | 'correction' 
  | 'approved' 
  | 'rejected' 
  | 'completed';

export type MaterialStatus = 'pending' | 'approved' | 'rejected';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'correction';

export interface UploadedMaterial {
  id: string;
  materialId: string;
  name: string;
  url: string;
  size: number;
  uploadTime: string;
  status: MaterialStatus;
}

export interface ApprovalRecord {
  id: string;
  nodeName: string;
  department: string;
  handler: string;
  opinion: string;
  status: ApprovalStatus;
  time: string;
}

export interface Application {
  id: string;
  itemId: string;
  itemName: string;
  applicantId: string;
  applicantName: string;
  applicantPhone: string;
  status: ApplicationStatus;
  formData: Record<string, any>;
  materials: UploadedMaterial[];
  createTime: string;
  updateTime: string;
  currentNode: string;
  approvalRecords: ApprovalRecord[];
  deadline?: string;
  isOverdue?: boolean;
  correctionNotice?: string;
}

export interface Evaluation {
  id: string;
  applicationId: string;
  itemName: string;
  rating: number;
  content: string;
  createTime: string;
  applicantName: string;
}

export interface GuideQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'text';
  options?: { label: string; value: string }[];
  required: boolean;
}

export interface GuideScene {
  id: string;
  name: string;
  description: string;
  icon: string;
  itemId: string;
  questions: GuideQuestion[];
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface StatisticsData {
  totalApplications: number;
  todayApplications: number;
  completedApplications: number;
  averageTime: number;
  satisfactionRate: number;
  overdueCount: number;
  departmentStats: { department: string; count: number }[];
  monthlyTrend: { month: string; count: number }[];
  categoryStats: { category: string; count: number }[];
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'system' | 'application' | 'policy';
  time: string;
  read: boolean;
}
