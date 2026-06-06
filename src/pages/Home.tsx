import { useNavigate } from 'react-router-dom';
import {
  Search,
  Store,
  GraduationCap,
  Landmark,
  Home as HomeIcon,
  Baby,
  UtensilsCrossed,
  Clock,
  FileCheck,
  Users,
  TrendingUp,
  ChevronRight,
  Sparkles,
  BookOpen,
  FileText,
  FolderOpen,
  Search as SearchIcon
} from 'lucide-react';
import { useState } from 'react';
import { serviceItems } from '@/mock/items';
import { mockStatistics } from '@/mock/applications';

const quickActions = [
  { icon: Sparkles, label: '智能导办', path: '/guide', color: 'bg-gradient-to-br from-violet-500 to-purple-600' },
  { icon: FileText, label: '在线申报', path: '/apply', color: 'bg-gradient-to-br from-primary-500 to-blue-600' },
  { icon: FolderOpen, label: '材料中心', path: '/materials', color: 'bg-gradient-to-br from-emerald-500 to-teal-600' },
  { icon: SearchIcon, label: '进度查询', path: '/progress', color: 'bg-gradient-to-br from-orange-500 to-amber-600' }
];

const hotItems = serviceItems.filter(item => item.hot);

const iconMap: Record<string, any> = {
  Store,
  GraduationCap,
  Landmark,
  HomeIcon,
  Baby,
  UtensilsCrossed
};

export default function Home() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/items?keyword=${encodeURIComponent(searchKeyword)}`);
    }
  };

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-blue-700 py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              政务服务"一件事"联办平台
            </h1>
            <p className="text-xl text-blue-100 mb-10">
              整合多部门事项，优化办理流程，实现"一件事一次办"
            </p>
            
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="搜索您要办理的事项，如：开店、入学、退休..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full h-14 pl-14 pr-32 rounded-2xl bg-white/95 backdrop-blur text-gray-800 placeholder-gray-400 text-lg focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
              >
                搜索
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['开便利店', '入学报名', '退休手续', '公积金提取', '新生儿落户'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchKeyword(tag);
                    navigate(`/items?keyword=${encodeURIComponent(tag)}`);
                  }}
                  className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-sm transition-colors backdrop-blur"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="card p-6 flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform group"
              >
                <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="font-medium text-gray-800">{action.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="card p-6 text-center">
            <p className="text-3xl font-bold text-primary-600">{mockStatistics.totalApplications.toLocaleString()}</p>
            <p className="text-gray-500 mt-2">累计办件</p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-3xl font-bold text-success-600">{mockStatistics.completedApplications.toLocaleString()}</p>
            <p className="text-gray-500 mt-2">已办结</p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-3xl font-bold text-warning-600">{mockStatistics.satisfactionRate}%</p>
            <p className="text-gray-500 mt-2">满意度</p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-3xl font-bold text-purple-600">{mockStatistics.averageTime}天</p>
            <p className="text-gray-500 mt-2">平均办理时长</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">热门事项</h2>
            <p className="text-gray-500 mt-1">最受欢迎的"一件事"联办服务</p>
          </div>
          <button
            onClick={() => navigate('/items')}
            className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
          >
            查看全部 <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotItems.map((item) => {
            const Icon = item.icon ? iconMap[item.icon] || FileText : FileText;
            return (
              <div
                key={item.id}
                onClick={() => navigate(`/items/${item.id}`)}
                className="card p-6 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                        {item.name}
                      </h3>
                      <span className="px-2 py-0.5 bg-danger-100 text-danger-600 text-xs rounded-full flex-shrink-0">
                        热门
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        承诺 {item.promiseTime} 工作日
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {item.department}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">办事指南</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: FileCheck, title: '办理流程', desc: '了解"一件事"联办的完整流程和环节' },
                  { icon: BookOpen, title: '政策法规', desc: '查看相关政策文件和法律法规依据' },
                  { icon: Users, title: '常见问题', desc: '解答办理过程中常见疑问' },
                  { icon: TrendingUp, title: '办事效率', desc: '查看各部门办理时效和统计数据' }
                ].map((guide, idx) => {
                  const Icon = guide.icon;
                  return (
                    <div key={idx} className="card p-5 flex items-start gap-4 hover:shadow-card-hover transition-shadow cursor-pointer">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{guide.title}</h3>
                        <p className="text-sm text-gray-500">{guide.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">通知公告</h2>
              <div className="card divide-y divide-gray-100">
                {[
                  { title: '关于优化营商环境的若干措施发布', time: '2024-01-15', tag: '政策' },
                  { title: '春节期间政务服务中心工作安排', time: '2024-01-12', tag: '通知' },
                  { title: '新增"新生儿落户一件事"联办服务', time: '2024-01-10', tag: '新功能' },
                  { title: '系统升级维护通知', time: '2024-01-08', tag: '系统' }
                ].map((notice, idx) => (
                  <div key={idx} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-start gap-3">
                      <span className={`px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${
                        notice.tag === '政策' ? 'bg-primary-100 text-primary-600' :
                        notice.tag === '新功能' ? 'bg-success-100 text-success-600' :
                        notice.tag === '系统' ? 'bg-warning-100 text-warning-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {notice.tag}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 font-medium line-clamp-1">{notice.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{notice.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
