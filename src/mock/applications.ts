import type { Application, Evaluation, StatisticsData, Notification } from '@/types';

export const mockApplications: Application[] = [
  {
    id: 'app-001',
    itemId: 'item-001',
    itemName: '开便利店一件事',
    applicantId: 'user-001',
    applicantName: '张三',
    applicantPhone: '13800138001',
    status: 'processing',
    formData: {
      shopName: '阳光便利店',
      businessScope: '日用品、预包装食品',
      address: 'XX区XX路XX号',
      area: '80'
    },
    materials: [
      {
        id: 'umat-001',
        materialId: 'mat-001',
        name: '个体工商户登记申请书.pdf',
        url: '#',
        size: 2048000,
        uploadTime: '2024-01-15 10:30:00',
        status: 'approved'
      },
      {
        id: 'umat-002',
        materialId: 'mat-002',
        name: '经营者身份证.jpg',
        url: '#',
        size: 1024000,
        uploadTime: '2024-01-15 10:32:00',
        status: 'approved'
      },
      {
        id: 'umat-003',
        materialId: 'mat-003',
        name: '经营场所证明.pdf',
        url: '#',
        size: 3072000,
        uploadTime: '2024-01-15 10:35:00',
        status: 'pending'
      }
    ],
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-01-16 14:30:00',
    currentNode: '材料初审',
    assignedDepartment: '市场监督管理局',
    approvalRecords: [
      {
        id: 'ar-001',
        nodeName: '提交申请',
        department: '综合窗口',
        handler: '李窗口',
        opinion: '申请材料已提交',
        status: 'approved',
        time: '2024-01-15 10:00:00'
      },
      {
        id: 'ar-002',
        nodeName: '材料初审',
        department: '市场监督管理局',
        handler: '王审批',
        opinion: '正在审核中',
        status: 'pending',
        time: '2024-01-15 14:00:00'
      }
    ],
    deadline: '2024-01-20',
    isOverdue: false
  },
  {
    id: 'app-002',
    itemId: 'item-002',
    itemName: '入学报名一件事',
    applicantId: 'user-001',
    applicantName: '张三',
    applicantPhone: '13800138001',
    status: 'completed',
    formData: {
      childName: '张小明',
      childBirthday: '2018-05-10',
      schoolDistrict: '第一学区',
      guardianName: '张三'
    },
    materials: [
      {
        id: 'umat-004',
        materialId: 'mat-005',
        name: '入学报名表.pdf',
        url: '#',
        size: 1536000,
        uploadTime: '2024-06-01 09:00:00',
        status: 'approved'
      },
      {
        id: 'umat-005',
        materialId: 'mat-006',
        name: '户口本.pdf',
        url: '#',
        size: 2048000,
        uploadTime: '2024-06-01 09:05:00',
        status: 'approved'
      }
    ],
    createTime: '2024-06-01 09:00:00',
    updateTime: '2024-06-10 16:00:00',
    currentNode: '录取通知',
    assignedDepartment: '教育局',
    approvalRecords: [
      {
        id: 'ar-003',
        nodeName: '网上报名',
        department: '教育局',
        handler: '系统',
        opinion: '报名信息已提交',
        status: 'approved',
        time: '2024-06-01 09:00:00'
      },
      {
        id: 'ar-004',
        nodeName: '材料审核',
        department: '教育局',
        handler: '陈老师',
        opinion: '材料齐全，审核通过',
        status: 'approved',
        time: '2024-06-03 10:00:00'
      },
      {
        id: 'ar-005',
        nodeName: '学区划分',
        department: '教育局',
        handler: '陈老师',
        opinion: '分配至第一小学',
        status: 'approved',
        time: '2024-06-07 14:00:00'
      },
      {
        id: 'ar-006',
        nodeName: '录取通知',
        department: '教育局',
        handler: '陈老师',
        opinion: '已发放录取通知书',
        status: 'approved',
        time: '2024-06-10 16:00:00'
      }
    ],
    deadline: '2024-06-11',
    isOverdue: false
  },
  {
    id: 'app-003',
    itemId: 'item-003',
    itemName: '退休手续一件事',
    applicantId: 'user-001',
    applicantName: '张三',
    applicantPhone: '13800138001',
    status: 'correction',
    formData: {
      name: '张三',
      birthday: '1964-01-15',
      workYears: '35',
      pensionAccount: '88888888'
    },
    materials: [
      {
        id: 'umat-006',
        materialId: 'mat-009',
        name: '退休申请表.pdf',
        url: '#',
        size: 1024000,
        uploadTime: '2024-01-10 11:00:00',
        status: 'approved'
      },
      {
        id: 'umat-007',
        materialId: 'mat-010',
        name: '身份证.jpg',
        url: '#',
        size: 800000,
        uploadTime: '2024-01-10 11:02:00',
        status: 'rejected'
      }
    ],
    createTime: '2024-01-10 11:00:00',
    updateTime: '2024-01-12 09:30:00',
    currentNode: '档案审核',
    assignedDepartment: '人力资源和社会保障局',
    approvalRecords: [
      {
        id: 'ar-007',
        nodeName: '退休申请',
        department: '社保局',
        handler: '刘科员',
        opinion: '申请已提交',
        status: 'approved',
        time: '2024-01-10 11:00:00'
      },
      {
        id: 'ar-008',
        nodeName: '档案审核',
        department: '社保局',
        handler: '刘科员',
        opinion: '身份证照片不清晰，请重新上传',
        status: 'correction',
        time: '2024-01-12 09:30:00'
      }
    ],
    deadline: '2024-01-25',
    isOverdue: false,
    correctionNotice: '您上传的身份证照片模糊不清，请重新上传清晰的身份证正反面照片。'
  },
  {
    id: 'app-004',
    itemId: 'item-006',
    itemName: '住房公积金提取一件事',
    applicantId: 'user-001',
    applicantName: '张三',
    applicantPhone: '13800138001',
    status: 'draft',
    formData: {},
    materials: [],
    createTime: '2024-01-18 15:00:00',
    updateTime: '2024-01-18 15:00:00',
    currentNode: '填写信息',
    approvalRecords: []
  },
  {
    id: 'app-005',
    itemId: 'item-004',
    itemName: '开办餐馆一件事',
    applicantId: 'user-001',
    applicantName: '张三',
    applicantPhone: '13800138001',
    status: 'submitted',
    formData: {
      shopName: '家乡味餐馆',
      businessType: '中餐',
      address: 'XX区XX街XX号',
      area: '150'
    },
    materials: [
      {
        id: 'umat-008',
        materialId: 'mat-013',
        name: '公司设立登记申请书.pdf',
        url: '#',
        size: 2048000,
        uploadTime: '2024-01-17 10:00:00',
        status: 'pending'
      }
    ],
    createTime: '2024-01-17 10:00:00',
    updateTime: '2024-01-17 10:00:00',
    currentNode: '名称核准',
    assignedDepartment: '市场监督管理局',
    approvalRecords: [
      {
        id: 'ar-009',
        nodeName: '提交申请',
        department: '综合窗口',
        handler: '李窗口',
        opinion: '申请已提交，等待审核',
        status: 'approved',
        time: '2024-01-17 10:00:00'
      }
    ],
    deadline: '2024-01-24',
    isOverdue: false
  }
];

export const mockEvaluations: Evaluation[] = [
  {
    id: 'eval-001',
    applicationId: 'app-002',
    itemName: '入学报名一件事',
    rating: 5,
    content: '办理流程很顺畅，工作人员态度很好，材料审核也很快，孩子顺利入学了，非常感谢！',
    createTime: '2024-06-12 10:00:00',
    applicantName: '张三'
  },
  {
    id: 'eval-002',
    applicationId: 'app-006',
    itemName: '开便利店一件事',
    rating: 4,
    content: '整体流程还不错，就是材料要求有点多，希望能再简化一些。',
    createTime: '2024-01-05 14:30:00',
    applicantName: '李四'
  },
  {
    id: 'eval-003',
    applicationId: 'app-007',
    itemName: '退休手续一件事',
    rating: 5,
    content: '网上就能办理退休，不用跑窗口，太方便了！养老金核算也很清楚。',
    createTime: '2024-01-08 09:15:00',
    applicantName: '王五'
  }
];

export const mockStatistics: StatisticsData = {
  totalApplications: 12586,
  todayApplications: 42,
  completedApplications: 10245,
  averageTime: 3.2,
  satisfactionRate: 96.8,
  overdueCount: 12,
  departmentStats: [
    { department: '市场监督管理局', count: 3856 },
    { department: '教育局', count: 2145 },
    { department: '人力资源和社会保障局', count: 2890 },
    { department: '公安局', count: 1520 },
    { department: '住房公积金管理中心', count: 1280 },
    { department: '医保局', count: 895 }
  ],
  monthlyTrend: [
    { month: '1月', count: 980 },
    { month: '2月', count: 1050 },
    { month: '3月', count: 1200 },
    { month: '4月', count: 1180 },
    { month: '5月', count: 1350 },
    { month: '6月', count: 1520 },
    { month: '7月', count: 1450 },
    { month: '8月', count: 1380 },
    { month: '9月', count: 1200 },
    { month: '10月', count: 1150 },
    { month: '11月', count: 1080 },
    { month: '12月', count: 1046 }
  ],
  categoryStats: [
    { category: '开店经营', count: 4230 },
    { category: '教育服务', count: 2145 },
    { category: '社会保障', count: 2890 },
    { category: '户籍服务', count: 1520 },
    { category: '住房服务', count: 1801 }
  ]
};

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    title: '办件进度提醒',
    content: '您的"开便利店一件事"申请已进入材料初审环节，请耐心等待。',
    type: 'application',
    time: '2024-01-16 14:30:00',
    read: false
  },
  {
    id: 'notif-002',
    title: '材料补正通知',
    content: '您的"退休手续一件事"申请需要补正材料，请登录查看详情。',
    type: 'application',
    time: '2024-01-12 09:30:00',
    read: false
  },
  {
    id: 'notif-003',
    title: '系统维护通知',
    content: '系统将于本周六（1月20日）22:00-次日6:00进行维护升级，届时将暂停服务。',
    type: 'system',
    time: '2024-01-15 16:00:00',
    read: true
  },
  {
    id: 'notif-004',
    title: '新政策发布',
    content: '关于优化营商环境的若干措施已发布，开店经营事项办理时限进一步压缩。',
    type: 'policy',
    time: '2024-01-10 10:00:00',
    read: true
  }
];
