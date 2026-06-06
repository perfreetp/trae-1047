import { useState } from 'react';
import { Search, Clock, FileText, Download, Calendar, MessageSquare, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useUserStore } from '@/store/useUserStore';
import StatusBadge from '@/components/common/StatusBadge';
import type { Application } from '@/types';

const statusTabs = [
  { key: 'all', label: '全部' },
  { key: 'processing', label: '办理中' },
  { key: 'completed', label: '已完成' },
  { key: 'correction', label: '待补正' }
];

export default function Progress() {
  const { applications } = useApplicationStore();
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const filteredApps = applications.filter((app) => {
    if (app.applicantId !== user?.id && user?.role !== 'admin' && user?.role !== 'approver') {
      return false;
    }
    if (activeTab !== 'all' && app.status !== activeTab) {
      return false;
    }
    if (searchText && !app.itemName.includes(searchText) && !app.id.includes(searchText)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">办件进度查询</h1>
          <p className="text-gray-600">查询您的办件进度，了解办理详情</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="输入办件编号或事项名称搜索"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 border-b border-gray-100 pb-4">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {filteredApps.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">暂无办件记录</p>
              </div>
            ) : (
              filteredApps.map((app) => (
                <div
                  key={app.id}
                  className={`bg-white rounded-xl shadow-sm p-5 cursor-pointer transition-all hover:shadow-md border-2 ${
                    selectedApp?.id === app.id ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedApp(app)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 truncate flex-1">{app.itemName}</h3>
                    <StatusBadge status={app.status} />
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p className="flex items-center gap-1">
                      <span className="text-gray-400">办件编号：</span>
                      <span className="font-mono">{app.id}</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>申请时间：{app.createTime}</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="text-gray-400">当前环节：</span>
                      <span className="text-blue-600">{app.currentNode}</span>
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">查看详情</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="lg:col-span-2">
            {selectedApp ? (
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedApp.itemName}</h2>
                      <p className="text-gray-500">办件编号：{selectedApp.id}</p>
                    </div>
                    <StatusBadge status={selectedApp.status} />
                  </div>
                </div>

                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    办理进度
                  </h3>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                    <div className="space-y-6">
                      {selectedApp.approvalRecords.map((record, index) => (
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

                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    申请信息
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">申请人</p>
                      <p className="font-medium text-gray-900">{selectedApp.applicantName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">联系电话</p>
                      <p className="font-medium text-gray-900">{selectedApp.applicantPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">申请时间</p>
                      <p className="font-medium text-gray-900">{selectedApp.createTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">最后更新</p>
                      <p className="font-medium text-gray-900">{selectedApp.updateTime}</p>
                    </div>
                    {selectedApp.deadline && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">预计完成</p>
                        <p className="font-medium text-gray-900">{selectedApp.deadline}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedApp.materials.length > 0 && (
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      申请材料
                    </h3>
                    <div className="space-y-3">
                      {selectedApp.materials.map((material) => (
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

                {selectedApp.correctionNotice && (
                  <div className="p-6 border-b border-gray-100">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-orange-800 mb-1">材料补正通知</p>
                          <p className="text-sm text-orange-700">{selectedApp.correctionNotice}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {selectedApp.status === 'completed' && (
                      <>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          下载结果
                        </button>
                        <button className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          满意度评价
                        </button>
                      </>
                    )}
                    {selectedApp.status === 'correction' && (
                      <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        补正材料
                      </button>
                    )}
                    <button className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      预约取件
                    </button>
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
    </div>
  );
}
