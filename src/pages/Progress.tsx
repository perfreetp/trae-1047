import { useState, useRef } from 'react';
import { Search, Clock, FileText, Download, Calendar, MessageSquare, ChevronRight, AlertCircle, CheckCircle2, Upload, X, PenTool, MapPin, Phone, Bell, Star } from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useUserStore } from '@/store/useUserStore';
import { useSmsStore } from '@/store/useSmsStore';
import StatusBadge from '@/components/common/StatusBadge';
import type { Application, UploadedMaterial, Appointment, Evaluation, SmsRecord } from '@/types';

const statusTabs = [
  { key: 'all', label: '全部' },
  { key: 'processing', label: '办理中' },
  { key: 'completed', label: '已完成' },
  { key: 'correction', label: '待补正' }
];

const timeSlots = [
  '09:00-10:00', '10:00-11:00', '11:00-12:00',
  '14:00-15:00', '15:00-16:00', '16:00-17:00'
];

export default function Progress() {
  const { applications, fetchApplications, fetchApplicationDetail, resubmitAfterCorrection, updateMaterial, setAppointment, addMaterial, currentApplication, setCurrentApplication, submitEvaluation } = useApplicationStore();
  const { user } = useUserStore();
  const { smsRecords } = useSmsStore();
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [evalRating, setEvalRating] = useState(5);
  const [evalContent, setEvalContent] = useState('');
  const [selectedFileForReupload, setSelectedFileForReupload] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredApps = applications.filter((app) => {
    if (user) {
      if (user.role === 'citizen' && app.applicantId !== user.id) {
        return false;
      }
      if (user.role === 'worker' && !app.approvalRecords?.some(record => record.handler === user.name)) {
        return false;
      }
      if (user.role === 'approver' && app.assignedDepartment !== user.department) {
        return false;
      }
    }
    if (activeTab !== 'all' && app.status !== activeTab) {
      return false;
    }
    if (searchText && !app.itemName.includes(searchText) && !app.id.includes(searchText)) {
      return false;
    }
    return true;
  });

  const hasPermissionToView = (app: Application): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'citizen') return app.applicantId === user.id;
    if (user.role === 'worker') {
      return app.approvalRecords?.some(record => record.handler === user.name) || false;
    }
    if (user.role === 'approver') {
      return app.assignedDepartment === user.department;
    }
    return false;
  };

  const handleSelectApp = (app: Application) => {
    if (!hasPermissionToView(app)) {
      return;
    }
    setSelectedApp(app);
    fetchApplicationDetail(app.id);
  };

  const handleFileReupload = (materialId: string) => {
    setSelectedFileForReupload(materialId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedApp || !selectedFileForReupload) return;

    const newMaterial: UploadedMaterial = {
      id: `umat-${Date.now()}`,
      materialId: selectedFileForReupload,
      name: file.name,
      url: '#',
      size: file.size,
      uploadTime: new Date().toLocaleString(),
      status: 'pending'
    };

    addMaterial(selectedApp.id, newMaterial);
    setSelectedFileForReupload(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResubmit = () => {
    if (!selectedApp) return;
    resubmitAfterCorrection(selectedApp.id);
    setShowCorrectionModal(false);
    const updated = fetchApplicationDetail(selectedApp.id);
    if (updated) setSelectedApp(updated);
  };

  const handleMakeAppointment = () => {
    if (!selectedApp || !appointmentDate || !appointmentTime) return;
    
    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      date: appointmentDate,
      timeSlot: appointmentTime,
      location: '政务服务中心一楼大厅',
      createTime: new Date().toLocaleString()
    };

    setAppointment(selectedApp.id, appointment);
    setShowAppointmentModal(false);
    setAppointmentDate('');
    setAppointmentTime('');
    const updated = fetchApplicationDetail(selectedApp.id);
    if (updated) setSelectedApp(updated);
  };

  const handleSubmitEvaluation = () => {
    if (!selectedApp) return;
    
    const evaluation: Evaluation = {
      id: `eval-${Date.now()}`,
      applicationId: selectedApp.id,
      itemName: selectedApp.itemName,
      rating: evalRating,
      content: evalContent,
      createTime: new Date().toLocaleString(),
      applicantName: user?.name || ''
    };

    submitEvaluation(selectedApp.id, evaluation);
    setShowEvalModal(false);
    setEvalRating(5);
    setEvalContent('');
    const updated = fetchApplicationDetail(selectedApp.id);
    if (updated) setSelectedApp(updated);
  };

  const getAppSmsRecords = (appId: string): SmsRecord[] => {
    return smsRecords.filter(sms => sms.applicationId === appId);
  };

  const getSmsTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      submit_success: '申报提交成功',
      correction: '材料补正通知',
      completed: '办件办结通知',
      overdue: '超时预警',
      login_code: '登录验证码'
    };
    return labels[type] || type;
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleDownloadResult = (file: { id: string; name: string }) => {
    const content = `办理结果文件\n\n事项名称：${selectedApp?.itemName}\n办件编号：${selectedApp?.id}\n申请人：${selectedApp?.applicantName}\n办结时间：${new Date().toLocaleString()}\n\n该事项已办结，相关证件已制作完成，请凭此通知和本人身份证到政务服务中心领取。`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace('.pdf', '.txt');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
                  onClick={() => handleSelectApp(app)}
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
                      {selectedApp.approvalRecords.map((record) => (
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
                    {selectedApp.assignedDepartment && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">承办部门</p>
                        <p className="font-medium text-gray-900">{selectedApp.assignedDepartment}</p>
                      </div>
                    )}
                  </div>

                  {Object.keys(selectedApp.formData).length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">表单预填信息</p>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(selectedApp.formData).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-xs text-gray-500">{key}</p>
                            <p className="text-sm text-gray-900">{String(value)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedApp.signature && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                        <PenTool className="w-4 h-4" />
                        电子签名
                      </p>
                      <div className="bg-white p-3 rounded border border-gray-200 inline-block">
                        <img
                          src={selectedApp.signature.dataUrl}
                          alt="电子签名"
                          className="h-16"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">签名时间：{selectedApp.signature.createTime}</p>
                    </div>
                  )}
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
                                {(material.size / 1024 / 1024).toFixed(2)} MB | {material.uploadTime}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={material.status} size="sm" />
                            {selectedApp.status === 'correction' && material.status === 'rejected' && (
                              <button
                                onClick={() => handleFileReupload(material.id)}
                                className="px-3 py-1 text-xs bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-1"
                              >
                                <Upload className="w-3 h-3" />
                                重新上传
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                )}

                {selectedApp.resultFiles && selectedApp.resultFiles.length > 0 && (
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Download className="w-5 h-5 text-blue-600" />
                      办理结果
                    </h3>
                    <div className="space-y-3">
                      {selectedApp.resultFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                              <p className="text-xs text-gray-500">生成时间：{file.createTime}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDownloadResult(file)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                          >
                            <Download className="w-4 h-4" />
                            下载
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedApp.appointment && (
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      预约取件
                    </h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-900 mb-1">已预约取件</p>
                          <div className="text-sm text-blue-700 space-y-1">
                            <p className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              日期：{selectedApp.appointment.date}
                            </p>
                            <p className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              时间：{selectedApp.appointment.timeSlot}
                            </p>
                            <p className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              地点：{selectedApp.appointment.location}
                            </p>
                          </div>
                        </div>
                      </div>
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

                {selectedApp.evaluation && (
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      满意度评价
                    </h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(selectedApp.evaluation.rating)}
                            <span className="text-sm text-green-700">
                              {selectedApp.evaluation.rating === 5 ? '非常满意' :
                               selectedApp.evaluation.rating === 4 ? '满意' :
                               selectedApp.evaluation.rating === 3 ? '一般' :
                               selectedApp.evaluation.rating === 2 ? '不满意' : '非常不满意'}
                            </span>
                          </div>
                          {selectedApp.evaluation.content && (
                            <p className="text-sm text-green-700">{selectedApp.evaluation.content}</p>
                          )}
                          <p className="text-xs text-green-600 mt-2">评价时间：{selectedApp.evaluation.createTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {getAppSmsRecords(selectedApp.id).length > 0 && (
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-blue-600" />
                      短信通知记录
                    </h3>
                    <div className="space-y-3">
                      {getAppSmsRecords(selectedApp.id).map((sms) => (
                        <div key={sms.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          sms.status === 'sent' ? 'bg-green-100' : sms.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
                        }`}>
                          <Bell className={`w-4 h-4 ${
                            sms.status === 'sent' ? 'text-green-600' : sms.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 text-sm">{getSmsTypeLabel(sms.type)}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              sms.status === 'sent' ? 'bg-green-100 text-green-700' :
                              sms.status === 'failed' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {sms.status === 'sent' ? '已发送' : sms.status === 'failed' ? '发送失败' : '发送中'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{sms.content}</p>
                          <p className="text-xs text-gray-400 mt-1">{sms.createTime}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

                <div className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {selectedApp.status === 'completed' && (
                      <>
                        {!selectedApp.resultFiles || selectedApp.resultFiles.length === 0 ? (
                          <button
                            onClick={() => {
                              if (!selectedApp) return;
                              const resultFile = {
                                id: `result-${Date.now()}`,
                                name: `${selectedApp.itemName}_办理结果.pdf`,
                                url: '#',
                                type: 'application/pdf',
                                createTime: new Date().toLocaleString()
                              };
                              useApplicationStore.getState().addResultFile(selectedApp.id, resultFile);
                              const updated = fetchApplicationDetail(selectedApp.id);
                              if (updated) setSelectedApp(updated);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            生成办理结果
                          </button>
                        ) : null}
                        {!selectedApp.appointment && (
                          <button
                            onClick={() => setShowAppointmentModal(true)}
                            className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                          >
                            <Calendar className="w-4 h-4" />
                            预约取件
                          </button>
                        )}
                        {!selectedApp.evaluation && user?.role === 'citizen' && (
                          <button
                            onClick={() => setShowEvalModal(true)}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
                          >
                            <Star className="w-4 h-4" />
                            评价
                          </button>
                        )}
                      </>
                    )}
                    {selectedApp.status === 'correction' && (
                      <button
                        onClick={() => setShowCorrectionModal(true)}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        补正材料并重新提交
                      </button>
                    )}
                    {selectedApp.status !== 'completed' && !selectedApp.appointment && (
                      <button
                        onClick={() => setShowAppointmentModal(true)}
                        className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        预约取件
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

      {showCorrectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">补正材料确认</h3>
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-orange-700">
                  请确认已重新上传所有需要补正的材料，提交后将重新进入审核流程。
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCorrectionModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleResubmit}
                  className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  确认提交
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">预约取件</h3>
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">选择日期</label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择时间段</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        appointmentTime === slot
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setAppointmentTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700 flex items-start gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  取件地点：政务服务中心一楼大厅
                </p>
                <p className="text-sm text-blue-700 flex items-start gap-2 mt-1">
                  <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  咨询电话：12345
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAppointmentModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleMakeAppointment}
                  disabled={!appointmentDate || !appointmentTime}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  确认预约
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEvalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">满意度评价</h3>
              <button
                onClick={() => {
                  setShowEvalModal(false);
                  setEvalRating(5);
                  setEvalContent('');
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">服务评分</label>
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-8 h-8 cursor-pointer transition-colors ${
                          star <= evalRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                        onClick={() => setEvalRating(star)}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {evalRating === 5 ? '非常满意' :
                     evalRating === 4 ? '满意' :
                     evalRating === 3 ? '一般' :
                     evalRating === 2 ? '不满意' : '非常不满意'}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">评价内容</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="请输入您的评价和建议..."
                  value={evalContent}
                  onChange={(e) => setEvalContent(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowEvalModal(false);
                    setEvalRating(5);
                    setEvalContent('');
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmitEvaluation}
                  className="flex-1 px-4 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  提交评价
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
