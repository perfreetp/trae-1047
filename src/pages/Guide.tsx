import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Store,
  GraduationCap,
  Landmark,
  Home,
  Baby,
  UtensilsCrossed,
  FileText,
  ArrowLeft
} from 'lucide-react';
import StepProgress from '@/components/common/StepProgress';
import { guideScenes } from '@/mock/items';
import type { GuideScene } from '@/types';

const iconMap: Record<string, any> = {
  Store,
  GraduationCap,
  Landmark,
  Home,
  Baby,
  UtensilsCrossed
};

export default function Guide() {
  const navigate = useNavigate();
  const [selectedScene, setSelectedScene] = useState<GuideScene | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [isEligible, setIsEligible] = useState(true);

  const steps = [
    { name: '选择场景', description: '选择您要办理的事项' },
    { name: '条件自测', description: '回答几个简单问题' },
    { name: '生成清单', description: '获取办理材料清单' }
  ];

  const handleSelectScene = (scene: GuideScene) => {
    setSelectedScene(scene);
    setCurrentStep(1);
    setAnswers({});
    setShowResult(false);
  };

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNextQuestion = () => {
    if (!selectedScene) return;
    if (currentStep < selectedScene.questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      const hasNoAnswer = Object.values(answers).some(v => v === 'no');
      setIsEligible(!hasNoAnswer);
      setShowResult(true);
      setCurrentStep(2);
    }
  };

  const handlePrevQuestion = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBackToScenes = () => {
    setSelectedScene(null);
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
  };

  const currentQuestion = selectedScene?.questions[currentStep - 1];

  return (
    <div className="container py-8 animate-fade-in">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">智能导办</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          通过几个简单的问题，帮助您判断是否符合办理条件，并生成个性化的材料清单
        </p>
      </div>

      {!selectedScene && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">选择办理场景</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guideScenes.map((scene) => {
              const Icon = iconMap[scene.icon] || FileText;
              return (
                <div
                  key={scene.id}
                  onClick={() => handleSelectScene(scene)}
                  className="card p-6 cursor-pointer group hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:from-violet-500 group-hover:to-purple-600 transition-colors flex-shrink-0">
                      <Icon className="w-7 h-7 text-violet-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">
                        {scene.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{scene.description}</p>
                      <div className="flex items-center gap-1 mt-3 text-violet-600 text-sm font-medium">
                        开始导办 <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedScene && (
        <div>
          <div className="max-w-3xl mx-auto">
            <button
              onClick={handleBackToScenes}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回场景选择
            </button>

            <div className="mb-10">
              <StepProgress steps={steps} currentStep={currentStep} />
            </div>

            {!showResult && currentQuestion && (
              <div className="card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center font-semibold">
                    {currentStep}
                  </span>
                  <span className="text-sm text-gray-500">问题 {currentStep}/{selectedScene.questions.length}</span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {currentQuestion.question}
                </h3>
                {currentQuestion.required && (
                  <span className="text-danger-500 text-sm">* 必填</span>
                )}

                <div className="mt-8 space-y-3">
                  {currentQuestion.type === 'single' && currentQuestion.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(currentQuestion.id, option.value)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        answers[currentQuestion.id] === option.value
                          ? 'border-violet-500 bg-violet-50'
                          : 'border-gray-200 hover:border-violet-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          answers[currentQuestion.id] === option.value
                            ? 'border-violet-500'
                            : 'border-gray-300'
                        }`}>
                          {answers[currentQuestion.id] === option.value && (
                            <div className="w-3 h-3 rounded-full bg-violet-500" />
                          )}
                        </div>
                        <span className="font-medium text-gray-700">{option.label}</span>
                      </div>
                    </button>
                  ))}

                  {currentQuestion.type === 'text' && (
                    <input
                      type="text"
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                      placeholder="请输入..."
                      className="input-field"
                    />
                  )}
                </div>

                <div className="flex justify-between mt-10">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={currentStep === 1}
                    className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一题
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={!answers[currentQuestion.id]}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentStep < selectedScene.questions.length ? '下一题' : '查看结果'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {showResult && (
              <div className="card p-8">
                <div className="text-center mb-8">
                  {isEligible ? (
                    <>
                      <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-success-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">恭喜您，符合办理条件！</h3>
                      <p className="text-gray-500">根据您的回答，您符合该事项的办理条件</p>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-10 h-10 text-warning-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">暂不符合办理条件</h3>
                      <p className="text-gray-500">根据您的回答，您可能暂不符合该事项的办理条件</p>
                    </>
                  )}
                </div>

                {isEligible && (
                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4">您需要准备的材料</h4>
                    <div className="space-y-3">
                      {selectedScene.questions.map((_, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" />
                          <span className="text-gray-700">材料 {idx + 1}：相关证明材料</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <button onClick={handleBackToScenes} className="btn-outline">
                    重新选择
                  </button>
                  {isEligible && (
                    <button
                      onClick={() => navigate(`/apply/${selectedScene.itemId}`)}
                      className="btn-primary"
                    >
                      立即办理
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
