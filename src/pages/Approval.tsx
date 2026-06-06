import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  ChevronRight,
  Search,
  Filter,
  Send,
  User,
  Building,
  Calendar
} from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import { useApplicationStore } from '@/store/useApplicationStore';
import type { ApplicationStatus } from '@/types';

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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [opinion, setOpinion] = useState('');
  const { applications, fetchApplications } = useApplicationStore();

  const filteredApplications = applications.filter(app => {
    if (searchKeyword && !app.itemName.includes(searchKeyword) && !app.applicantName.includes(searchKeyword)) {
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

  const handleApprove = (appId: string) => {
    alert('审批通过操作已执行');
  };

  const handleReject = (appId: string) => {
    alert('驳回操作已执行');
  };

  const handleAssign = () => {
    if (selectedDepartment && opinion) {
      alert(`已分派至 ${selectedDepartment}`);
      setShowAssignModal(false);
      setSelectedDepartment('');
      setOpinion('');
    }
  };

  return (
    <div className="container py-8 animate-fade-in">
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
          <div key={idx} className="card p-6">
            <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex border-b border-gray-100">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 px-4 py-4 font-medium text-sm transition-colors relative flex items-center justify-center gap-2 ${
                      activeTab === tab.key
                        ? 'text-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {activeTab === tab.key && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-4 border-b border-gray-100">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索办件名称、申请人..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  筛选
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedApp === app.id ? 'bg-primary-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900 truncate">{app.itemName}</h3>
                        <StatusBadge status={app.status as ApplicationStatus} />
                        {app.isOverdue && (
                          <span className="px-2 py-0.5 bg-danger-100 text-danger-600 text-xs rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            超时
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {app.applicantName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {app.createTime}
                        </span>
                      </div>
                      <p className="text-sm text-primary-600 mt-2">当前环节：{app.currentNode}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 mt-2" />
                  </div>
                </div>
              ))}

              {filteredApplications.length === 0 && (
                <div className="p-16 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">暂无相关办件</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          {selectedApplication ? (
            <div className="card sticky top-24">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">{selectedApplication.itemName}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex">
                    <span className="text-gray-500 w-20">办件编号：</span>
                    <span className="text-gray-900">{selectedApplication.id}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-20">申请人：</span>
                    <span className="text-gray-900">{selectedApplication.applicantName}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-20">联系电话：</span>
                    <span className="text-gray-900">{selectedApplication.applicantPhone}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-20">申请时间：</span>
                    <span className="text-gray-900">{selectedApplication.createTime}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 w-20">当前状态：</span>
                    <StatusBadge status={selectedApplication.status as ApplicationStatus} />
                  </div>
                </div>
              </div>

              <div className="p-6 border-b border-gray-100">
                <h4 className="font-medium text-gray-900 mb-4">审批记录</h4>
                <div className="relative">
                  {selectedApplication.approvalRecords.map((record, idx) => (
                    <div key={record.id} className="flex gap-3 pb-6 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          record.status === 'approved' ? 'bg-success-100' :
                          record.status === 'rejected' ? 'bg-danger-100' :
                          record.status === 'correction' ? 'bg-warning-100' :
                          'bg-gray-100'
                        }`}>
                          {record.status === 'approved' ? <CheckCircle className="w-4 h-4 text-success-600" /> :
                           record.status === 'rejected' ? <XCircle className="w-4 h-4 text-danger-600" /> :
                           record.status === 'correction' ? <AlertTriangle className="w-4 h-4 text-warning-600" /> :
                           <Clock className="w-4 h-4 text-gray-500" />}
                        </div>
                        {idx < selectedApplication.approvalRecords.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 text-sm">{record.nodeName}</span>
                          <span className="text-xs text-gray-400">{record.department}</span>
                        </div>
                        <p className="text-sm text-gray-600">{record.opinion}</p>
                        <p className="text-xs text-gray-400 mt-1">{record.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {(activeTab === 'pending' || activeTab === 'processing') && (
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => handleApprove(selectedApplication.id)}
                      className="flex items-center justify-center gap-2 py-2.5 bg-success-500 hover:bg-success-600 text-white rounded-lg font-medium transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      通过
                    </button>
                    <button
                      onClick={() => handleReject(selectedApplication.id)}
                      className="flex items-center justify-center gap-2 py-2.5 bg-danger-500 hover:bg-danger-600 text-white rounded-lg font-medium transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      驳回
                    </button>
                  </div>
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    部门分派
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="card p-12 text-center sticky top-24">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">选择左侧办件查看详情</p>
            </div>
          )}
        </div>
      </div>

      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md animate-fade-in">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">部门分派</h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  选择分派部门
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="input-field"
                >
                  <option value="">请选择部门</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Send className="w-4 h-4 inline mr-2" />
                  分派意见
                </label>
                <textarea
                  value={opinion}
                  onChange={(e) => setOpinion(e.target.value)}
                  placeholder="请输入分派意见..."
                  rows={4}
                  className="input-field resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="btn-outline"
              >
                取消
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedDepartment || !opinion}
                className="btn-primary disabled:opacity-50"
              >
                确认分派
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
