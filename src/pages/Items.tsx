import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Clock,
  Users,
  FileText,
  Store,
  GraduationCap,
  Landmark,
  Home,
  Baby,
  UtensilsCrossed,
  ChevronRight,
  X
} from 'lucide-react';
import { serviceItems } from '@/mock/items';
import type { ServiceItem } from '@/types';

const iconMap: Record<string, any> = {
  Store,
  GraduationCap,
  Landmark,
  Home,
  Baby,
  UtensilsCrossed
};

const categories = ['全部', '开店经营', '教育服务', '社会保障', '户籍服务', '住房服务'];

export default function Items() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keywordParam = searchParams.get('keyword') || '';
  
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchKeyword, setSearchKeyword] = useState(keywordParam);
  const [filteredItems, setFilteredItems] = useState<ServiceItem[]>(serviceItems);

  useEffect(() => {
    let result = [...serviceItems];
    
    if (selectedCategory !== '全部') {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(keyword) ||
          item.description.toLowerCase().includes(keyword) ||
          item.department.toLowerCase().includes(keyword)
      );
    }
    
    setFilteredItems(result);
  }, [selectedCategory, searchKeyword]);

  const clearFilters = () => {
    setSelectedCategory('全部');
    setSearchKeyword('');
  };

  return (
    <div className="container py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">事项库</h1>
        <p className="text-gray-500">浏览和搜索所有政务服务"一件事"联办事项</p>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索事项名称、办理部门..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
            清除筛选
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Filter className="w-5 h-5 text-gray-400 mr-2 self-center" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 text-sm">
          共找到 <span className="font-semibold text-gray-900">{filteredItems.length}</span> 个事项
        </p>
      </div>

      <div className="space-y-4">
        {filteredItems.map((item) => {
          const Icon = item.icon ? iconMap[item.icon] || FileText : FileText;
          return (
            <div
              key={item.id}
              onClick={() => navigate(`/items/${item.id}`)}
              className="card p-6 cursor-pointer group"
            >
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center group-hover:bg-primary-500 transition-colors flex-shrink-0">
                  <Icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {item.name}
                        </h3>
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {item.category}
                        </span>
                        {item.hot && (
                          <span className="px-2.5 py-1 bg-danger-100 text-danger-600 text-xs rounded-full">
                            热门
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 mb-4">{item.description}</p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                  </div>
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{item.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>承诺 {item.promiseTime} 个工作日</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <FileText className="w-4 h-4" />
                      <span>{item.materials.length} 份材料</span>
                    </div>
                    <div className="flex items-center gap-2 text-success-600">
                      <span className="w-2 h-2 bg-success-500 rounded-full" />
                      <span>在线可办</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="card p-16 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">未找到匹配的事项</p>
            <p className="text-gray-400 text-sm mt-2">请尝试调整搜索关键词或筛选条件</p>
          </div>
        )}
      </div>
    </div>
  );
}
