import { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
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
  MessageSquare
} from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { useSmsStore } from '@/store/useSmsStore';
import type { UserRole } from '@/types';

const allNavItems = [
  { path: '/', label: '首页', icon: Home, roles: ['citizen', 'worker', 'approver', 'admin'] as UserRole[] },
  { path: '/items', label: '事项库', icon: BookOpen, roles: ['citizen', 'worker', 'approver', 'admin'] as UserRole[] },
  { path: '/guide', label: '智能导办', icon: Sparkles, roles: ['citizen', 'worker', 'approver', 'admin'] as UserRole[] },
  { path: '/apply', label: '在线申报', icon: FileText, roles: ['citizen', 'worker'] as UserRole[] },
  { path: '/materials', label: '材料中心', icon: FolderOpen, roles: ['citizen', 'worker'] as UserRole[] },
  { path: '/approval', label: '协同审批', icon: Users, roles: ['worker', 'approver', 'admin'] as UserRole[] },
  { path: '/progress', label: '进度查询', icon: Search, roles: ['citizen', 'worker', 'approver', 'admin'] as UserRole[] },
  { path: '/statistics', label: '评价统计', icon: MessageSquare, roles: ['admin'] as UserRole[] },
  { path: '/sms', label: '短信记录', icon: Bell, roles: ['admin'] as UserRole[] }
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useUserStore();
  const { smsRecords } = useSmsStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const navItems = useMemo(() => {
    if (!user) return allNavItems.filter(item => item.roles.length === 4);
    return allNavItems.filter(item => item.roles.includes(user.role));
  }, [user]);

  const unreadCount = 0;

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

  return (
    <header className="bg-white shadow-nav sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
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
                  className={`nav-link flex items-center gap-1.5 text-sm ${
                    isActive ? 'nav-link-active' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
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
                className="w-48 h-9 pl-10 pr-4 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
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
                  <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-card-hover border border-gray-100 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">通知消息</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {mockNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                          !notif.read ? 'bg-primary-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            notif.type === 'application' ? 'bg-primary-500' :
                            notif.type === 'system' ? 'bg-warning-500' : 'bg-success-500'
                          }`} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.content}</p>
                            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
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
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">{user.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-card-hover border border-gray-100 overflow-hidden animate-fade-in">
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
              <Link to="/login" className="btn-primary text-sm py-2 px-4">
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
          <div className="lg:hidden py-4 border-t border-gray-100 animate-slide-up">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`nav-link flex items-center gap-3 py-3 ${
                      isActive ? 'nav-link-active' : ''
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
