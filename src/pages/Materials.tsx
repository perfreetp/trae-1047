import { useState } from 'react';
import {
  FolderOpen,
  FileText,
  Upload,
  ShieldCheck,
  AlertTriangle,
  Download,
  Eye,
  Trash2,
  Plus,
  Search,
  Clock,
  Check
} from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';

const categories = [
  { id: 'all', label: '全部材料', icon: FolderOpen },
  { id: 'id', label: '身份证明', icon: FileText },
  { id: 'proof', label: '证明材料', icon: ShieldCheck },
  { id: 'license', label: '证照资质', icon: Check }
];

const mockMyMaterials = [
  { id: '1', name: '身份证正反面.jpg', category: 'id', size: '1.2 MB', uploadTime: '2024-01-10', status: 'approved' },
  { id: '2', name: '户口本扫描件.pdf', category: 'id', size: '2.5 MB', uploadTime: '2024-01-10', status: 'approved' },
  { id: '3', name: '房产证复印件.pdf', category: 'proof', size: '3.1 MB', uploadTime: '2024-01-12', status: 'approved' },
  { id: '4', name: '营业执照.jpg', category: 'license', size: '0.8 MB', uploadTime: '2024-01-08', status: 'pending' },
  { id: '5', name: '学历证明.pdf', category: 'proof', size: '1.5 MB', uploadTime: '2024-01-05', status: 'rejected' }
];

const mockLicenses = [
  { id: '1', name: '居民身份证', issuer: '公安局', validDate: '2040-01-01', status: 'valid' },
  { id: '2', name: '社会保障卡', issuer: '人社局', validDate: '长期', status: 'valid' },
  { id: '3', name: '不动产权证', issuer: '自然资源局', validDate: '长期', status: 'valid' },
  { id: '4', name: '学历证书', issuer: '教育部', validDate: '长期', status: 'valid' }
];

export default function Materials() {
  const [activeTab, setActiveTab] = useState<'my' | 'license'>('my');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const { applications } = useApplicationStore();

  const correctionItems = applications.filter(app => app.status === 'correction');

  const filteredMaterials = mockMyMaterials.filter(m => {
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    if (searchKeyword && !m.name.includes(searchKeyword)) return false;
    return true;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success-100 text-success-600';
      case 'pending': return 'bg-warning-100 text-warning-600';
      case 'rejected': return 'bg-danger-100 text-danger-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return '已审核';
      case 'pending': return '审核中';
      case 'rejected': return '已驳回';
      default: return '未知';
    }
  };

  return (
    <div className="container py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">材料中心</h1>
        <p className="text-gray-500">管理您的申报材料、电子证照和补正通知</p>
      </div>

      {correctionItems.length > 0 && (
        <div className="bg-warning-50 border border-warning-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-warning-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-warning-700 mb-2">待补正材料通知</h3>
              <p className="text-sm text-warning-600 mb-4">
                您有 {correctionItems.length} 个申请需要补正材料，请及时处理
              </p>
              <div className="space-y-2">
                {correctionItems.map(app => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{app.itemName}</p>
                      <p className="text-xs text-gray-500">{app.correctionNotice}</p>
                    </div>
                    <button className="btn-primary text-sm py-2 px-4">
                      立即补正
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('my')}
          className={`px-6 py-4 font-medium transition-colors relative ${
            activeTab === 'my' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            我的材料
          </div>
          {activeTab === 'my' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('license')}
          className={`px-6 py-4 font-medium transition-colors relative ${
            activeTab === 'license' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            电子证照
          </div>
          {activeTab === 'license' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
          )}
        </button>
      </div>

      {activeTab === 'my' && (
        <div>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索材料名称..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              上传材料
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">材料名称</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">分类</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">大小</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">上传时间</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">状态</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary-600" />
                        </div>
                        <span className="font-medium text-gray-900">{material.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {categories.find(c => c.id === material.category)?.label || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{material.size}</td>
                    <td className="px-6 py-4 text-gray-600">{material.uploadTime}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(material.status)}`}>
                        {getStatusLabel(material.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-danger-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'license' && (
        <div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockLicenses.map((license) => (
              <div key={license.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-2.5 py-1 bg-success-100 text-success-600 rounded-full text-xs font-medium">
                    有效
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{license.name}</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-500">
                    <span className="text-gray-400">签发机关：</span>
                    {license.issuer}
                  </p>
                  <p className="text-gray-500">
                    <span className="text-gray-400">有效期至：</span>
                    {license.validDate}
                  </p>
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button className="flex-1 btn-secondary text-sm py-2">
                    查看详情
                  </button>
                  <button className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1">
                    <Upload className="w-4 h-4" />
                    授权使用
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-primary-50 rounded-xl border border-primary-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h4 className="font-semibold text-primary-700 mb-1">证照授权说明</h4>
                <p className="text-sm text-primary-600">
                  您可以授权相关部门调用您的电子证照，无需重复提交纸质材料。授权后，相关部门可在办理业务时直接调取您的电子证照信息。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
