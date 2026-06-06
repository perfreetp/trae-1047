import { useState } from 'react';
import {
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Search,
  Send,
  User,
  Building,
  X,
  AlertCircle,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useUserStore } from '@/store/useUserStore';
import type { Application } from '@/types';

const tabs = [
  { key: 'pending', label: '待办件', icon: Clock },
  { key: 'processing', label: '在办件', icon: Users },
  { key: 'completed', label: '已办件', icon: CheckCircle },
  { key: 'overdue', label: '超时预警', icon: AlertTriangle }
];

const departments = [
  '市场监督管理局',
  '教育局',
  '人力资源和社会保障局',
  '公安局',
  '住房公积金管理中心',
  '医保局'
];

export default function Approval() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [opinion, setOpinion] = useState('');
  const [correctionNotice, setCorrectionNotice] = useState('');
  const { applications, fetchApplications, fetchApplicationDetail, assignDepartment, completeApplication, rejectApplication, requestCorrection, currentApplication } = useApplicationStore();

  const filteredApplications = applications.filter(app => {
    if (user?.role === 'approver' && app.assignedDepartment !== user.department) {
      return false;
    }
    
    if (searchKeyword && !app.itemName.includes(searchKeyword) && !app.applicantName.includes(searchKeyword) && !app.id.includes(searchKeyword)) {
      return false;
    }
    
    switch (activeTab) {
      case 'pending':
        return app.status === 'submitted';
      case 'processing':
        return app.status === 'processing';
      case 'completed':
        return app.status === 'approved' || app.status === 'completed' || app.status === 'rejected';
      case 'overdue':
        return app.isOverdue;
      default:
        return true;
    }
  });

  const selectedApplication = applications.find(app => app.id === selectedApp);

  const handleSelectApp = (app: Application) => {
    setSelectedApp(app.id);
    fetchApplicationDetail(app.id);
  };

  const handleAssign = () => {
    if (!selectedApp || !selectedDepartment) return;
    assignDepartment(selectedApp, selectedDepartment);
    setShowAssignModal(false);
    setSelectedDepartment('');
    setOpinion('');
  };

  const handleApprove = () => {
    if (!selectedApp) return;
    completeApplication(selectedApp);
  };

  const handleReject = () => {
    if (!selectedApp || !opinion) return;
    rejectApplication(selectedApp, opinion);
    setShowRejectModal(false);
    setOpinion('');
  };

  const handleRequestCorrection = () => {
    if (!selectedApp || !correctionNotice) return;
    const rejectedMaterialIds = selectedApplication?.materials.map(m => m.id) || [];
    requestCorrection(selectedApp, correctionNotice, rejectedMaterialIds);
    setShowCorrectionModal(false);
    setCorrectionNotice('');
  };

  const canApprove = () => {
    if (!selectedApplication) return false;
    if (user?.role === 'approver' && selectedApplication.assignedDepartment !== user.department) return false;
    return selectedApplication.status === 'processing';
  };

  const canReject = () => canApprove();
  const canRequestCorrection = () => canApprove();
  const canAssign = () => {
    if (!selectedApplication) return false;
    return (user?.role === 'worker' || user?.role === 'admin') && selectedApplication.status === 'submitted';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">协同审批</h1>
          <p className="text-gray-500">多部门联合审批，高效协同办理</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: '待办件', value: applications.filter(a => a.status === 'submitted').length, color: 'blue' },
            { label: '在办件', value: applications.filter(a => a.status === 'processing').length, color: 'primary' },
            { label: '已办件', value: applications.filter(a => ['approved', 'completed', 'rejected'].includes(a.status)).length, color: 'green' },
            { label: '超时件', value: applications.filter(a => a.isOverdue).length, color: 'orange' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索办件编号、事项名称或申请人..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 border-b border-gray-100 pb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    activeTab === tab.key
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {filteredApplications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">暂无办件</p>
              </div>
            ) : (
              filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className={`bg-white rounded-xl shadow-sm p-5 cursor-pointer transition-all hover:shadow-md border-2 ${
                    selectedApp === app.id ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onClick={() => handleSelectApp(app)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 truncate flex-1">{app.itemName}</h3>
                    <StatusBadge status={app.status} />
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{app.applicantName}</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="text-gray-400">办件编号：</span>
                      <span className="font-mono">{app.id}</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>申请时间：{app.createTime}</span>
                    </p>
                    {app.assignedDepartment && (
                      <p className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        <span>承办部门：{app.assignedDepartment}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="lg:col-span-2">
            {selectedApplication ? (
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedApplication.itemName}</h2>
                      <p className="text-gray-500">办件编号：{selectedApplication.id}</p>
                    </div>
                    <StatusBadge status={selectedApplication.status} />
                  </div>
                </div>

                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    申请人信息
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">申请人</p>
                      <p className="font-medium text-gray-900">{selectedApplication.applicantName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">联系电话</p>
                      <p className="font-medium text-gray-900">{selectedApplication.applicantPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">申请时间</p>
                      <p className="font-medium text-gray-900">{selectedApplication.createTime}</p>
                    </div>
                    {selectedApplication.assignedDepartment && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">承办部门</p>
                        <p className="font-medium text-gray-900">{selectedApplication.assignedDepartment}</p>
                      </div>
                    )}
                  </div>

                  {Object.keys(selectedApplication.formData).length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">表单信息</p>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(selectedApplication.formData).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-xs text-gray-500">{key}</p>
                            <p className="text-sm text-gray-900">{String(value)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {selectedApplication.materials.length > 0 && (
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      申请材料
                    </h3>
                    <div className="space-y-3">
                      {selectedApplication.materials.map((material) => (
                        <div
                          key={material.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{material.name}</p>
                              <p className="text-xs text-gray-500">
                                {(material.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <StatusBadge status={material.status} size="sm" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    审批记录
                  </h3>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                    <div className="space-y-6">
                      {selectedApplication.approvalRecords.map((record) => (
                        <div key={record.id} className="relative flex gap-4">
                          <div
                            className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              record.status === 'approved'
                                ? 'bg-green-100'
                                : record.status === 'rejected'
                                ? 'bg-red-100'
                                : record.status === 'correction'
                                ? 'bg-orange-100'
                                : 'bg-blue-100'
                            }`}
                          >
                            {record.status === 'approved' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : record.status === 'rejected' || record.status === 'correction' ? (
                              <AlertCircle className="w-5 h-5 text-orange-600" />
                            ) : (
                              <Clock className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{record.nodeName}</span>
                              <span className="text-sm text-gray-500">- {record.department}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{record.opinion}</p>
                            <p className="text-xs text-gray-400">
                              处理人：{record.handler} | {record.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedApplication.correctionNotice && (
                  <div className="p-6 border-b border-gray-100">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-orange-800 mb-1">补正通知</p>
                          <p className="text-sm text-orange-700">{selectedApplication.correctionNotice}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {canAssign() && (
                      <button
                        onClick={() => setShowAssignModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        部门分派
                      </button>
                    )}
                    {canApprove() && (
                      <button
                        onClick={handleApprove}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        审批通过
                      </button>
                    )}
                    {canRequestCorrection() && (
                      <button
                        onClick={() => setShowCorrectionModal(true)}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        补正通知
                      </button>
                    )}
                    {canReject() && (
                      <button
                        onClick={() => setShowRejectModal(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        驳回
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">请选择左侧办件查看详情</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">部门分派</h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">选择部门</label>
                <select
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="">请选择承办部门</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分派意见</label>
                <textarea
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="请输入分派意见..."
                  value={opinion}
                  onChange={(e) => setOpinion(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!selectedDepartment}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  确认分派
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">驳回申请</h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">驳回理由</label>
                <textarea
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="请输入驳回理由..."
                  value={opinion}
                  onChange={(e) => setOpinion(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowRejectModal(false); setOpinion(''); }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleReject}
                  disabled={!opinion}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  确认驳回
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCorrectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">材料补正通知</h3>
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">补正说明</label>
                <textarea
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="请说明需要补正的材料和原因..."
                  value={correctionNotice}
                  onChange={(e) => setCorrectionNotice(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowCorrectionModal(false); setCorrectionNotice(''); }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleRequestCorrection}
                  disabled={!correctionNotice}
                  className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  发送通知
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
