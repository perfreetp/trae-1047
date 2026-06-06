import { useState } from 'react';
import { Star, MessageSquare, Clock, CheckCircle, FileText } from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useUserStore } from '@/store/useUserStore';
import StatusBadge from '@/components/common/StatusBadge';
import type { Evaluation } from '@/types';

export default function MyEvaluation() {
  const { user } = useUserStore();
  const { applications, submitEvaluation } = useApplicationStore();
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [showEvalModal, setShowEvalModal] = useState(false);

  const userApplications = user?.role === 'citizen'
    ? applications.filter(app => app.applicantId === user.id)
    : [];

  const completedApps = userApplications.filter(app => 
    app.status === 'completed' || app.status === 'approved'
  );

  const evaluatedApps = completedApps.filter(app => app.evaluation);
  const pendingApps = completedApps.filter(app => !app.evaluation);

  const handleSubmitEvaluation = () => {
    if (!selectedAppId) return;
    
    const evaluation: Evaluation = {
      id: `eval-${Date.now()}`,
      applicationId: selectedAppId,
      itemName: applications.find(a => a.id === selectedAppId)?.itemName || '',
      rating,
      content,
      createTime: new Date().toLocaleString(),
      applicantName: user?.name || ''
    };

    submitEvaluation(selectedAppId, evaluation);
    setShowEvalModal(false);
    setSelectedAppId(null);
    setRating(5);
    setContent('');
  };

  const openEvalModal = (appId: string) => {
    setSelectedAppId(appId);
    setShowEvalModal(true);
  };

  const renderStars = (count: number, interactive = false, onRate?: (r: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 cursor-${interactive ? 'pointer' : 'default'} transition-colors ${
              star <= count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">我的评价</h1>
          <p className="text-gray-500">查看和提交您的办件满意度评价</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{completedApps.length}</p>
            <p className="text-gray-500">已办结办件</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{evaluatedApps.length}</p>
            <p className="text-gray-500">已评价</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <MessageSquare className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{pendingApps.length}</p>
            <p className="text-gray-500">待评价</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              待评价办件
            </h3>
          </div>
          {pendingApps.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
              <p className="text-gray-500">暂无待评价办件</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pendingApps.map((app) => (
                <div key={app.id} className="p-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{app.itemName}</h4>
                    <p className="text-sm text-gray-500 mt-1">办件编号：{app.id}</p>
                    <p className="text-sm text-gray-500">办结时间：{app.updateTime}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.status} />
                    <button
                      onClick={() => openEvalModal(app.id)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      评价
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              已评价办件
            </h3>
          </div>
          {evaluatedApps.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">暂无已评价办件</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {evaluatedApps.map((app) => (
                <div key={app.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{app.itemName}</h4>
                      <p className="text-sm text-gray-500 mt-1">办件编号：{app.id}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                  {app.evaluation && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(app.evaluation.rating)}
                        <span className="text-sm text-gray-500 ml-2">
                          评价时间：{app.evaluation.createTime}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{app.evaluation.content || '未填写评价内容'}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showEvalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">满意度评价</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">服务评分</label>
                <div className="flex items-center gap-4">
                  {renderStars(rating, true, setRating)}
                  <span className="text-sm text-gray-500">
                    {rating === 5 ? '非常满意' : rating === 4 ? '满意' : rating === 3 ? '一般' : rating === 2 ? '不满意' : '非常不满意'}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">评价内容</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="请输入您的评价和建议..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowEvalModal(false);
                    setSelectedAppId(null);
                    setRating(5);
                    setContent('');
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmitEvaluation}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
