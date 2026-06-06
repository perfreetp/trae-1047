import type { ServiceItem, GuideScene } from '@/types';

export const serviceItems: ServiceItem[] = [
  {
    id: 'item-001',
    name: '开便利店一件事',
    category: '开店经营',
    department: '市场监督管理局',
    promiseTime: 5,
    description: '整合个体工商户设立登记、食品经营许可等多个事项，实现开便利店一站式办理',
    hot: true,
    icon: 'Store',
    conditions: [
      '有符合规定的名称和章程',
      '有与经营规模相适应的经营场所',
      '有与经营项目相适应的资金和设备',
      '有符合规定的从业人员'
    ],
    materials: [
      {
        id: 'mat-001',
        name: '个体工商户登记申请书',
        required: true,
        format: ['pdf', 'doc', 'docx'],
        maxSize: 10,
        description: '填写完整并签字确认的登记申请书'
      },
      {
        id: 'mat-002',
        name: '经营者身份证明',
        required: true,
        format: ['jpg', 'jpeg', 'png', 'pdf'],
        maxSize: 5,
        description: '身份证正反面照片或扫描件'
      },
      {
        id: 'mat-003',
        name: '经营场所证明',
        required: true,
        format: ['pdf', 'jpg', 'jpeg', 'png'],
        maxSize: 10,
        description: '房产证或租赁合同等场地使用证明'
      },
      {
        id: 'mat-004',
        name: '食品经营许可申请书',
        required: true,
        format: ['pdf', 'doc', 'docx'],
        maxSize: 10,
        description: '填写完整的食品经营许可申请表'
      }
    ],
    process: [
      { id: 'step-1', name: '提交申请', department: '综合窗口', duration: 1, description: '线上或窗口提交申请材料' },
      { id: 'step-2', name: '材料初审', department: '市场监督管理局', duration: 1, description: '审核申请材料是否齐全规范' },
      { id: 'step-3', name: '现场核查', department: '市场监督管理局', duration: 2, description: '对经营场所进行现场核查' },
      { id: 'step-4', name: '审批决定', department: '市场监督管理局', duration: 1, description: '作出准予或不予许可决定' },
      { id: 'step-5', name: '制证发证', department: '综合窗口', duration: 0, description: '制作并发放营业执照和许可证' }
    ],
    fee: '免费'
  },
  {
    id: 'item-002',
    name: '入学报名一件事',
    category: '教育服务',
    department: '教育局',
    promiseTime: 10,
    description: '整合学龄儿童入学报名、学籍注册等事项，实现入学报名一站式办理',
    hot: true,
    icon: 'GraduationCap',
    conditions: [
      '年满6周岁的适龄儿童',
      '具有本市区户籍或符合积分入学条件',
      '身体健康，具备正常学习能力'
    ],
    materials: [
      {
        id: 'mat-005',
        name: '入学报名表',
        required: true,
        format: ['pdf', 'doc', 'docx'],
        maxSize: 10,
        description: '填写完整的入学报名申请表'
      },
      {
        id: 'mat-006',
        name: '户口本',
        required: true,
        format: ['pdf', 'jpg', 'jpeg', 'png'],
        maxSize: 10,
        description: '户口本首页及儿童页扫描件'
      },
      {
        id: 'mat-007',
        name: '房产证明',
        required: true,
        format: ['pdf', 'jpg', 'jpeg', 'png'],
        maxSize: 10,
        description: '房产证或购房合同'
      },
      {
        id: 'mat-008',
        name: '儿童预防接种证',
        required: true,
        format: ['pdf', 'jpg', 'jpeg', 'png'],
        maxSize: 10,
        description: '预防接种证完整扫描件'
      }
    ],
    process: [
      { id: 'step-1', name: '网上报名', department: '教育局', duration: 3, description: '登录平台填写报名信息' },
      { id: 'step-2', name: '材料审核', department: '教育局', duration: 3, description: '审核报名材料真实性' },
      { id: 'step-3', name: '学区划分', department: '教育局', duration: 2, description: '根据学区划分规则分配学校' },
      { id: 'step-4', name: '录取通知', department: '教育局', duration: 2, description: '发放录取通知书' }
    ],
    fee: '免费'
  },
  {
    id: 'item-003',
    name: '退休手续一件事',
    category: '社会保障',
    department: '人力资源和社会保障局',
    promiseTime: 15,
    description: '整合退休申请、养老金核定、医保退休等事项，实现退休手续一站式办理',
    hot: true,
    icon: 'Landmark',
    conditions: [
      '达到法定退休年龄',
      '累计缴纳养老保险满15年',
      '已完成人事档案审核'
    ],
    materials: [
      {
        id: 'mat-009',
        name: '退休申请表',
        required: true,
        format: ['pdf', 'doc', 'docx'],
        maxSize: 10,
        description: '填写完整并签字的退休申请表'
      },
      {
        id: 'mat-010',
        name: '身份证',
        required: true,
        format: ['jpg', 'jpeg', 'png', 'pdf'],
        maxSize: 5,
        description: '身份证正反面照片'
      },
      {
        id: 'mat-011',
        name: '社保卡',
        required: true,
        format: ['jpg', 'jpeg', 'png', 'pdf'],
        maxSize: 5,
        description: '社保卡正反面照片'
      },
      {
        id: 'mat-012',
        name: '一寸免冠照片',
        required: true,
        format: ['jpg', 'jpeg', 'png'],
        maxSize: 2,
        description: '近期一寸免冠彩色照片'
      }
    ],
    process: [
      { id: 'step-1', name: '退休申请', department: '社保局', duration: 1, description: '提交退休申请材料' },
      { id: 'step-2', name: '档案审核', department: '社保局', duration: 5, description: '审核人事档案，确认工龄' },
      { id: 'step-3', name: '待遇核算', department: '社保局', duration: 3, description: '核算养老金待遇标准' },
      { id: 'step-4', name: '医保退休', department: '医保局', duration: 3, description: '办理医疗保险退休手续' },
      { id: 'step-5', name: '待遇发放', department: '社保局', duration: 3, description: '养老金从次月起发放' }
    ],
    fee: '免费'
  },
  {
    id: 'item-004',
    name: '开办餐馆一件事',
    category: '开店经营',
    department: '市场监督管理局',
    promiseTime: 7,
    description: '整合营业执照、食品经营许可、消防检查等事项，实现开办餐馆一站式办理',
    icon: 'UtensilsCrossed',
    conditions: [
      '有符合规定的经营场所',
      '经营场所符合食品安全要求',
      '具备消防验收合格证明',
      '从业人员持有健康证明'
    ],
    materials: [
      {
        id: 'mat-013',
        name: '公司设立登记申请书',
        required: true,
        format: ['pdf', 'doc', 'docx'],
        maxSize: 10,
        description: '填写完整的公司设立登记申请书'
      },
      {
        id: 'mat-014',
        name: '公司章程',
        required: true,
        format: ['pdf', 'doc', 'docx'],
        maxSize: 10,
        description: '全体股东签字的公司章程'
      },
      {
        id: 'mat-015',
        name: '食品经营许可证申请书',
        required: true,
        format: ['pdf', 'doc', 'docx'],
        maxSize: 10,
        description: '餐饮服务类食品经营许可申请'
      },
      {
        id: 'mat-016',
        name: '健康证明',
        required: true,
        format: ['pdf', 'jpg', 'jpeg', 'png'],
        maxSize: 5,
        description: '从业人员有效健康证明'
      }
    ],
    process: [
      { id: 'step-1', name: '名称核准', department: '市场监管局', duration: 1, description: '企业名称预先核准' },
      { id: 'step-2', name: '设立登记', department: '市场监管局', duration: 2, description: '办理工商营业执照' },
      { id: 'step-3', name: '食品经营许可', department: '市场监管局', duration: 3, description: '食品经营许可证审批' },
      { id: 'step-4', name: '消防检查', department: '消防救援机构', duration: 1, description: '消防安全检查' },
      { id: 'step-5', name: '证照发放', department: '综合窗口', duration: 0, description: '统一发放相关证照' }
    ],
    fee: '免费'
  },
  {
    id: 'item-005',
    name: '新生儿落户一件事',
    category: '户籍服务',
    department: '公安局',
    promiseTime: 3,
    description: '整合出生医学证明、户口登记、医保参保等事项，实现新生儿落户一站式办理',
    icon: 'Baby',
    conditions: [
      '新生儿为婚内生育',
      '父母一方为本市户籍',
      '已办理出生医学证明'
    ],
    materials: [
      {
        id: 'mat-017',
        name: '出生医学证明',
        required: true,
        format: ['pdf', 'jpg', 'jpeg', 'png'],
        maxSize: 5,
        description: '新生儿出生医学证明原件'
      },
      {
        id: 'mat-018',
        name: '结婚证',
        required: true,
        format: ['pdf', 'jpg', 'jpeg', 'png'],
        maxSize: 5,
        description: '父母结婚证'
      },
      {
        id: 'mat-019',
        name: '父母户口本',
        required: true,
        format: ['pdf', 'jpg', 'jpeg', 'png'],
        maxSize: 10,
        description: '父母双方户口本'
      },
      {
        id: 'mat-020',
        name: '父母身份证',
        required: true,
        format: ['pdf', 'jpg', 'jpeg', 'png'],
        maxSize: 5,
        description: '父母双方身份证'
      }
    ],
    process: [
      { id: 'step-1', name: '出生登记', department: '派出所', duration: 1, description: '办理户口登记' },
      { id: 'step-2', name: '医保参保', department: '医保局', duration: 1, description: '办理城乡居民医保参保' },
      { id: 'step-3', name: '社保卡办理', department: '社保局', duration: 1, description: '申领新生儿社保卡' }
    ],
    fee: '免费'
  },
  {
    id: 'item-006',
    name: '住房公积金提取一件事',
    category: '住房服务',
    department: '住房公积金管理中心',
    promiseTime: 3,
    description: '整合公积金提取申请、审核、到账等流程，实现公积金提取一站式办理',
    icon: 'Home',
    conditions: [
      '已连续足额缴存住房公积金6个月以上',
      '符合提取条件（购房、租房、还贷、退休等）',
      '个人账户状态正常'
    ],
    materials: [
      {
        id: 'mat-021',
        name: '公积金提取申请表',
        required: true,
        format: ['pdf', 'doc', 'docx'],
        maxSize: 10,
        description: '填写完整的提取申请表'
      },
      {
        id: 'mat-022',
        name: '身份证',
        required: true,
        format: ['jpg', 'jpeg', 'png', 'pdf'],
        maxSize: 5,
        description: '提取人身份证'
      },
      {
        id: 'mat-023',
        name: '银行卡',
        required: true,
        format: ['jpg', 'jpeg', 'png', 'pdf'],
        maxSize: 5,
        description: '本人名下一类银行卡'
      },
      {
        id: 'mat-024',
        name: '提取证明材料',
        required: true,
        format: ['pdf', 'jpg', 'jpeg', 'png'],
        maxSize: 20,
        description: '购房合同/租房合同/退休证明等'
      }
    ],
    process: [
      { id: 'step-1', name: '提交申请', department: '公积金中心', duration: 0, description: '线上提交提取申请' },
      { id: 'step-2', name: '材料审核', department: '公积金中心', duration: 2, description: '审核提取材料真实性' },
      { id: 'step-3', name: '资金拨付', department: '公积金中心', duration: 1, description: '提取资金划转至银行卡' }
    ],
    fee: '免费'
  }
];

export const guideScenes: GuideScene[] = [
  {
    id: 'scene-001',
    name: '我要开便利店',
    description: '个体工商户经营便利店，需办理营业执照和食品经营许可',
    icon: 'Store',
    itemId: 'item-001',
    questions: [
      {
        id: 'q-1',
        question: '您是否已年满18周岁并具有完全民事行为能力？',
        type: 'single',
        required: true,
        options: [
          { label: '是', value: 'yes' },
          { label: '否', value: 'no' }
        ]
      },
      {
        id: 'q-2',
        question: '您是否已经确定经营场所？',
        type: 'single',
        required: true,
        options: [
          { label: '已确定，有房产证或租赁合同', value: 'yes' },
          { label: '尚未确定', value: 'no' }
        ]
      },
      {
        id: 'q-3',
        question: '经营场所的使用性质是？',
        type: 'single',
        required: true,
        options: [
          { label: '商业用房', value: 'commercial' },
          { label: '住宅用房（住改商）', value: 'residential' },
          { label: '其他', value: 'other' }
        ]
      },
      {
        id: 'q-4',
        question: '您是否已准备好经营场所的产权证明材料？',
        type: 'single',
        required: true,
        options: [
          { label: '已准备好房产证/租赁合同', value: 'yes' },
          { label: '尚未准备', value: 'no' }
        ]
      },
      {
        id: 'q-5',
        question: '是否销售预包装食品或散装食品？',
        type: 'single',
        required: true,
        options: [
          { label: '是，需要办理食品经营许可', value: 'yes' },
          { label: '否，仅销售日用品', value: 'no' }
        ]
      }
    ]
  },
  {
    id: 'scene-002',
    name: '我要给孩子报名入学',
    description: '适龄儿童小学一年级入学报名',
    icon: 'GraduationCap',
    itemId: 'item-002',
    questions: [
      {
        id: 'q-6',
        question: '孩子的出生日期是？（需满6周岁）',
        type: 'text',
        required: true
      },
      {
        id: 'q-7',
        question: '孩子是否具有本市户籍？',
        type: 'single',
        required: true,
        options: [
          { label: '是，本区户籍', value: 'local' },
          { label: '是，本市其他区户籍', value: 'city' },
          { label: '否，外地户籍', value: 'non_local' }
        ]
      },
      {
        id: 'q-8',
        question: '在本区是否有自有房产？',
        type: 'single',
        required: true,
        options: [
          { label: '有，房产证齐全', value: 'yes' },
          { label: '有，购房合同已备案', value: 'contract' },
          { label: '无，租房居住', value: 'no' }
        ]
      },
      {
        id: 'q-9',
        question: '孩子是否已完成国家免疫规划疫苗接种？',
        type: 'single',
        required: true,
        options: [
          { label: '是，已全部接种', value: 'yes' },
          { label: '部分未接种', value: 'partial' },
          { label: '不清楚', value: 'unknown' }
        ]
      }
    ]
  },
  {
    id: 'scene-003',
    name: '我要办理退休手续',
    description: '达到法定退休年龄，申请办理退休并领取养老金',
    icon: 'Landmark',
    itemId: 'item-003',
    questions: [
      {
        id: 'q-10',
        question: '您的性别是？',
        type: 'single',
        required: true,
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' }
        ]
      },
      {
        id: 'q-11',
        question: '您的出生日期是？',
        type: 'text',
        required: true
      },
      {
        id: 'q-12',
        question: '您的职工身份是？',
        type: 'single',
        required: true,
        options: [
          { label: '企业职工', value: 'enterprise' },
          { label: '机关事业单位职工', value: 'government' },
          { label: '灵活就业人员', value: 'flexible' }
        ]
      },
      {
        id: 'q-13',
        question: '养老保险累计缴费年限是否满15年？',
        type: 'single',
        required: true,
        options: [
          { label: '是，已满15年', value: 'yes' },
          { label: '否，不足15年', value: 'no' },
          { label: '不清楚', value: 'unknown' }
        ]
      },
      {
        id: 'q-14',
        question: '您的人事档案是否已存放在人才服务机构？',
        type: 'single',
        required: true,
        options: [
          { label: '是，已存放', value: 'yes' },
          { label: '否，在自己手中', value: 'no' },
          { label: '不清楚', value: 'unknown' }
        ]
      }
    ]
  }
];
