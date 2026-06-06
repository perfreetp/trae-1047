import { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  BookOpen, 
  Sparkles, 
  FileText, 
  FolderOpen, 
  Users, 
  Search, 
  Bell, 
  User, 
  Menu, 
  X,
  LogOut,
  ChevronDown,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { useSmsStore } from '@/store/useSmsStore';
import { useApplicationStore } from '@/store/useApplicationStore';
import type { UserRole, SmsRecord, Application } from '@/types';

const allNavItems = [
  { path: '/', label: '首页', icon: HomeIcon, roles: ['citizen', 'worker', 'approver', 'admin'] as UserRole[] },
  { path: '/items', label: '事项库', icon: BookOpen, roles: ['citizen', 'worker', 'approver', 'admin'] as UserRole[] },
  { path: '/guide', label: '智能导办', icon: Sparkles, roles: ['citizen', 'worker', 'approver', 'admin'] as UserRole[] },
  { path: '/apply', label: '在线申报', icon: FileText, roles: ['citizen', 'worker'] as UserRole[] },
  { path: '/materials', label: '材料中心', icon: FolderOpen, roles: ['citizen', 'worker'] as UserRole[] },
  { path: '/approval', label: '协同审批', icon: Users, roles: ['worker', 'approver', 'admin'] as UserRole[] },
  { path: '/progress', label: '进度查询', icon: Search, roles: ['citizen', 'worker', 'approver', 'admin'] as UserRole[] },
  { path: '/my-evaluation', label: '我的评价', icon: MessageSquare, roles: ['citizen'] as UserRole[] },
  { path: '/statistics', label: '评价统计', icon: MessageSquare, roles: ['admin'] as UserRole[] },
  { path: '/sms', label: '短信记录', icon: Bell, roles: ['citizen', 'worker', 'approver', 'admin'] as UserRole[] }
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useUserStore();
  const { smsRecords } = useSmsStore();
  const { applications } = useApplicationStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const navItems = useMemo(() => {
    if (!user) return allNavItems.filter(item => item.roles.length === 4);
    return allNavItems.filter(item => item.roles.includes(user.role));
  }, [user]);

  const notifications = useMemo(() => {
    if (!user) return [];

    let userSmsRecords: typeof smsRecords = [];
    let userApplications: typeof applications = [];

    if (user.role === 'admin') {
      userSmsRecords = smsRecords;
      userApplications = applications;
    } else if (user.role === 'citizen') {
      userSmsRecords = smsRecords.filter(sms => sms.phone === user.phone);
      userApplications = applications.filter(app => app.applicantId === user.id);
    } else if (user.role === 'worker') {
      userApplications = applications.filter(app => 
        app.approvalRecords?.some(record => record.handler === user.name)
      );
      const handledAppIds = userApplications.map(app => app.id);
      userSmsRecords = smsRecords.filter(sms => 
        sms.applicationId && handledAppIds.includes(sms.applicationId)
      );
    } else if (user.role === 'approver') {
      userApplications = applications.filter(app => 
        app.assignedDepartment === user.department
      );
      const deptAppIds = userApplications.map(app => app.id);
      userSmsRecords = smsRecords.filter(sms => 
        sms.applicationId && deptAppIds.includes(sms.applicationId)
      );
    }

    const notifs: Array<{
      id: string;
      title: string;
      content: string;
      type: 'application' | 'sms' | 'system';
      time: string;
      icon: React.ReactNode;
    }> = [];

    userApplications.forEach(app => {
      if (app.status === 'correction') {
        notifs.push({
          id: `corr-${app.id}`,
          title: '材料补正通知',
          content: `您的"${app.itemName}"需要补充材料`,
          type: 'application',
          time: app.updateTime,
          icon: <AlertCircle className="w-5 h-5 text-orange-500" />
        });
      }
      if (app.status === 'completed' || app.status === 'approved') {
        notifs.push({
          id: `done-${app.id}`,
          title: '办件已办结',
          content: `您的"${app.itemName}"已办理完成`,
          type: 'application',
          time: app.updateTime,
          icon: <CheckCircle className="w-5 h-5 text-green-500" />
        });
      }
      if (app.status === 'processing') {
        notifs.push({
          id: `proc-${app.id}`,
          title: '办件办理中',
          content: `您的"${app.itemName}"正在${app.currentNode}`,
          type: 'application',
          time: app.updateTime,
          icon: <Clock className="w-5 h-5 text-blue-500" />
        });
      }
    });

    userSmsRecords.slice(0, 5).forEach(sms => {
      const typeLabels: Record<string, string> = {
        login_code: '登录验证码',
        submit_success: '申报提交成功',
        correction: '材料补正通知',
        overdue: '超时预警',
        completed: '办件办结通知'
      };
      notifs.push({
        id: `sms-${sms.id}`,
        title: `短信：${typeLabels[sms.type] || '短信通知'}`,
        content: `${sms.content.substring(0, 30)}...`,
        type: 'sms',
        time: sms.createTime,
        icon: <Bell className={`w-5 h-5 ${sms.status === 'sent' ? 'text-green-500' : sms.status === 'failed' ? 'text-red-500' : 'text-yellow-500'}`} />
      });
    });

    return notifs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);
  }, [user, applications, smsRecords]);

  const unreadCount = notifications.length;

  const roleLabels: Record<string, string> = {
    citizen: '市民',
    worker: '窗口工作人员',
    approver: '审批人员',
    admin: '管理员'
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/items?keyword=${encodeURIComponent(searchKeyword)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  const handleNotificationClick = (type: string) => {
    setShowNotifications(false);
    if (type === 'sms') {
      navigate('/sms');
    } else {
      navigate('/progress');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">政务服务联办平台</h1>
              <p className="text-xs text-gray-500">一件事一次办</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="搜索事项..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-48 h-9 pl-10 pr-4 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3" />
            </form>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">通知消息</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">暂无通知</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif.type)}
                          className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {notif.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.content}</p>
                              <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">{user.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.phone}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                        {roleLabels[user.role]}
                      </span>
                      {user.department && (
                        <p className="text-xs text-gray-400 mt-1">{user.department}</p>
                      )}
                    </div>
                    {user.role === 'citizen' && (
                      <Link
                        to="/my-evaluation"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        我的评价
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                登录
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
