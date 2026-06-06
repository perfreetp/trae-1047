import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Bell,
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare,
  Phone,
  Calendar,
  FileText
} from 'lucide-react';
import { useSmsStore } from '@/store/useSmsStore';
import { useUserStore } from '@/store/useUserStore';
import { useApplicationStore } from '@/store/useApplicationStore';
import type { SmsType, SmsStatus } from '@/types';

const smsTypeOptions: { value: SmsType | 'all'; label: string }[] = [
  { value: 'all', label: '全部类型' },
  { value: 'login_code', label: '登录验证码' },
  { value: 'submit_success', label: '申报提交成功' },
  { value: 'correction', label: '材料补正通知' },
  { value: 'overdue', label: '超时预警' },
  { value: 'completed', label: '办件办结通知' }
];

const smsStatusOptions: { value: SmsStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部状态' },
  { value: 'sent', label: '已发送' },
  { value: 'pending', label: '发送中' },
  { value: 'failed', label: '发送失败' }
];

export default function SmsRecords() {
  const { user } = useUserStore();
  const { smsRecords } = useSmsStore();
  const { applications } = useApplicationStore();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState<SmsType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<SmsStatus | 'all'>('all');

  const filteredRecords = useMemo(() => {
    let records = smsRecords;

    if (user?.role === 'citizen') {
      records = records.filter(sms => sms.phone === user.phone);
    } else if (user?.role === 'worker' || user?.role === 'approver') {
      const userAppIds = applications
        .filter(app => 
          user?.role === 'approver' 
            ? app.assignedDepartment === user.department
            : true
        )
        .map(app => app.id);
      records = records.filter(sms => 
        !sms.applicationId || userAppIds.includes(sms.applicationId)
      );
    }

    if (searchKeyword) {
      records = records.filter(sms => 
        sms.phone.includes(searchKeyword) || 
        sms.content.includes(searchKeyword) ||
        (sms.applicationId && sms.applicationId.includes(searchKeyword))
      );
    }

    if (filterType !== 'all') {
      records = records.filter(sms => sms.type === filterType);
    }

    if (filterStatus !== 'all') {
      records = records.filter(sms => sms.status === filterStatus);
    }

    return records.sort((a, b) => 
      new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
    );
  }, [smsRecords, user, applications, searchKeyword, filterType, filterStatus]);

  const stats = useMemo(() => ({
    total: filteredRecords.length,
    sent: filteredRecords.filter(r => r.status === 'sent').length,
    pending: filteredRecords.filter(r => r.status === 'pending').length,
    failed: filteredRecords.filter(r => r.status === 'failed').length
  }), [filteredRecords]);

  const getStatusIcon = (status: SmsStatus) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusStyle = (status: SmsStatus) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
    }
  };

  const getStatusLabel = (status: SmsStatus) => {
    switch (status) {
      case 'sent': return '已发送';
      case 'pending': return '发送中';
      case 'failed': return '发送失败';
    }
  };

  const getTypeLabel = (type: SmsType) => {
    const found = smsTypeOptions.find(t => t.value === type);
    return found ? found.label : type;
  };

  const getApplicationName = (appId?: string) => {
    if (!appId) return '-';
    const app = applications.find(a => a.id === appId);
    return app ? app.itemName : appId;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">短信记录</h1>
          <p className="text-gray-500">
            {user?.role === 'admin' 
              ? '查看和管理所有短信发送记录'
              : user?.role === 'citizen'
              ? '查看您的短信发送记录'
              : '查看您业务范围内的短信发送记录'
            }
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-gray-500">总发送量</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.sent}</p>
            <p className="text-gray-500">已发送</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
            <p className="text-gray-500">发送中</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-50 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.failed}</p>
            <p className="text-gray-500">发送失败</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索手机号、内容或办件编号..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <select
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as SmsType | 'all')}
              >
                {smsTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as SmsStatus | 'all')}
              >
                {smsStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">暂无短信记录</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">短信类型</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">手机号</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">内容</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">关联办件</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">发送时间</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-900">{getTypeLabel(record.type)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900 font-mono">{record.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 max-w-xs truncate">{record.content}</p>
                        {record.verificationCode && (
                          <p className="text-xs text-blue-600 mt-1">验证码：{record.verificationCode}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{getApplicationName(record.applicationId)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{record.createTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(record.status)}`}>
                            {getStatusLabel(record.status)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
