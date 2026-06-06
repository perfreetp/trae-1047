import { useState } from 'react';
import {
  FolderOpen,
  FileText,
  Upload,
  ShieldCheck,
  AlertTriangle,
  Download,
  Eye,
  Plus,
  Search,
  Clock,
  Check
} from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useUserStore } from '@/store/useUserStore';

const categories = [
  { id: 'all', label: '全部材料', icon: FolderOpen },
  { id: 'id', label: '身份证明', icon: FileText },
  { id: 'proof', label: '证明材料', icon: ShieldCheck },
  { id: 'license', label: '证照资质', icon: Check }
];

const mockLicenses = [
  { id: '1', name: '居民身份证', issuer: '公安局', validDate: '2040-01-01', status: 'valid' },
  { id: '2', name: '社会保障卡', issuer: '人社局', validDate: '长期', status: 'valid' },
  { id: '3', name: '不动产权证', issuer: '自然资源局', validDate: '长期', status: 'valid' },
  { id: '4', name: '学历证书', issuer: '教育部', validDate: '长期', status: 'valid' }
];

export default function Materials() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState<'my' | 'license'>('my');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const { applications } = useApplicationStore();

  const userApplications = user?.role === 'citizen'
    ? applications.filter(app => app.applicantId === user.id)
    : applications;

  const allMaterials = userApplications.flatMap(app => 
    app.materials.map(mat => ({
      ...mat,
      applicationId: app.id,
      applicationName: app.itemName
    }))
  );

  const correctionItems = userApplications.filter(app => app.status === 'correction');

  const filteredMaterials = allMaterials.filter(m => {
    if (searchKeyword && !m.name.includes(searchKeyword)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">材料中心</h1>
          <p className="text-gray-500">管理您的申报材料、电子证照和补正通知</p>
        </div>

        {correctionItems.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-800 mb-2">您有 {correctionItems.length} 项待补正材料</h3>
                <p className="text-orange-700 text-sm mb-3">请及时补充完善材料，以免影响办理进度</p>
                <div className="space-y-2">
                  {correctionItems.map(app => (
                    <div key={app.id} className="bg-white rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{app.itemName}</p>
                        <p className="text-sm text-gray-500">办件编号：{app.id}</p>
                      </div>
                      <span className="text-sm text-orange-600 font-medium">需补正</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: '材料总数', value: allMaterials.length, color: 'blue' },
            { label: '待审核', value: allMaterials.filter(m => m.status === 'pending').length, color: 'yellow' },
            { label: '已通过', value: allMaterials.filter(m => m.status === 'approved').length, color: 'green' },
            { label: '已驳回', value: allMaterials.filter(m => m.status === 'rejected').length, color: 'red' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex gap-4 border-b border-gray-100 pb-4">
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'my'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('my')}
            >
              我的材料
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'license'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('license')}
            >
              电子证照
            </button>
          </div>
        </div>

        {activeTab === 'my' ? (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索材料名称..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
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
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      selectedCategory === cat.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {filteredMaterials.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">暂无材料</p>
                <p className="text-gray-400 mt-1">点击右上角上传您的第一份材料</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">材料名称</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">关联办件</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">大小</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">上传时间</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">状态</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredMaterials.map((material) => (
                      <tr key={material.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <span className="font-medium text-gray-900">{material.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{material.applicationName}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {(material.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{material.uploadTime}</span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={material.status} size="sm" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Eye className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Download className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">我的电子证照</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockLicenses.map((license) => (
                <div key={license.id} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <ShieldCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      有效
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{license.name}</h4>
                  <p className="text-sm text-gray-500 mb-1">签发机关：{license.issuer}</p>
                  <p className="text-sm text-gray-500">有效期至：{license.validDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
