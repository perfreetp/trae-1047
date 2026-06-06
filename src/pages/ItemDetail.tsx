import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Store,
  GraduationCap,
  Landmark,
  Home,
  Baby,
  UtensilsCrossed,
  Download,
  Share2
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

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<ServiceItem | null>(null);
  const [activeTab, setActiveTab] = useState<'conditions' | 'materials' | 'process' | 'fee'>('conditions');

  useEffect(() => {
    const found = serviceItems.find(i => i.id === id);
    if (found) {
      setItem(found);
    }
  }, [id]);

  if (!item) {
    return (
      <div className="container py-16 text-center">
        <p className="text-gray-500">事项不存在</p>
      </div>
    );
  }

  const Icon = item.icon ? iconMap[item.icon] || FileText : FileText;

  const tabs = [
    { key: 'conditions', label: '办理条件' },
    { key: 'materials', label: '申请材料' },
    { key: 'process', label: '办理流程' },
    { key: 'fee', label: '收费标准' }
  ];

  return (
    <div className="container py-8 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        返回事项列表
      </button>

      <div className="card p-8 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Icon className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h1>
                <p className="text-gray-500">{item.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-500" />
                </button>
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Download className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">办理部门：</span>
                <span className="font-medium">{item.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">承诺时限：</span>
                <span className="font-medium text-primary-600">{item.promiseTime} 个工作日</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">材料数量：</span>
                <span className="font-medium">{item.materials.length} 份</span>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => navigate(`/apply/${item.id}`)}
                className="btn-primary"
              >
                在线办理
              </button>
              <button
                onClick={() => navigate(`/guide?itemId=${item.id}`)}
                className="btn-secondary"
              >
                智能导办
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex border-b border-gray-100">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-6 py-4 font-medium transition-colors relative ${
                    activeTab === tab.key
                      ? 'text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'conditions' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">办理条件</h3>
                  <div className="space-y-3">
                    {item.conditions.map((condition, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{condition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'materials' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">申请材料</h3>
                  <div className="space-y-3">
                    {item.materials.map((material) => (
                      <div key={material.id} className="p-4 border border-gray-200 rounded-xl hover:border-primary-200 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-5 h-5 text-primary-500" />
                              <span className="font-medium text-gray-900">{material.name}</span>
                              {material.required ? (
                                <span className="px-2 py-0.5 bg-danger-100 text-danger-600 text-xs rounded-full">
                                  必填
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  选填
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{material.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                              <span>格式：{material.format.join('、')}</span>
                              <span>大小：≤{material.maxSize}MB</span>
                            </div>
                          </div>
                          <button className="text-primary-600 text-sm font-medium hover:underline">
                            下载空表
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'process' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">办理流程</h3>
                  <div className="relative">
                    {item.process.map((step, idx) => (
                      <div key={step.id} className="flex gap-4 pb-8 last:pb-0">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold flex-shrink-0">
                            {idx + 1}
                          </div>
                          {idx < item.process.length - 1 && (
                            <div className="w-0.5 flex-1 bg-gray-200 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{step.name}</h4>
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {step.department}
                            </span>
                          </div>
                          <p className="text-gray-500 mb-2">{step.description}</p>
                          <span className="text-sm text-primary-600">
                            办理时限：{step.duration > 0 ? `${step.duration} 个工作日` : '即时办理'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'fee' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">收费标准</h3>
                  <div className="p-6 bg-success-50 rounded-xl border border-success-100">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-8 h-8 text-success-500" />
                      <div>
                        <p className="font-semibold text-success-700">本事项不收费</p>
                        <p className="text-sm text-success-600">{item.fee}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">咨询方式</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">窗口咨询</p>
                  <p className="text-sm text-gray-500">XX市XX区政务服务中心2楼A区</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">电话咨询</p>
                  <p className="text-sm text-gray-500">12345 政务服务热线</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">常见问题</h3>
            <div className="space-y-3">
              {[
                '办理时限如何计算？',
                '材料不齐全怎么办？',
                '可以委托他人办理吗？',
                '办理进度如何查询？'
              ].map((q, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 flex-1">{q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
