import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  Upload,
  PenTool,
  CheckCircle,
  X,
  Plus,
  Trash2,
  Eye,
  Download,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import StepProgress from '@/components/common/StepProgress';
import { serviceItems } from '@/mock/items';
import { useUserStore } from '@/store/useUserStore';
import { useApplicationStore } from '@/store/useApplicationStore';

export default function Apply() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { createApplication, updateApplication, submitApplication } = useApplicationStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({});
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appId, setAppId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const item = serviceItems.find(i => i.id === itemId);

  useEffect(() => {
    if (item && user) {
      const newApp = createApplication(item.id, user.id, user.name, user.phone);
      setAppId(newApp.id);
    }
  }, [item, user]);

  const steps = [
    { name: '填写信息', description: '基本申报信息' },
    { name: '上传材料', description: '提交所需材料' },
    { name: '电子签名', description: '确认并签名' },
    { name: '提交完成', description: '提交申报' }
  ];

  const formFields = [
    { key: 'name', label: '姓名', required: true, placeholder: '请输入真实姓名' },
    { key: 'idCard', label: '身份证号', required: true, placeholder: '请输入18位身份证号' },
    { key: 'phone', label: '联系电话', required: true, placeholder: '请输入手机号' },
    { key: 'address', label: '联系地址', required: true, placeholder: '请输入详细地址' },
    { key: 'email', label: '电子邮箱', required: false, placeholder: '请输入邮箱地址（选填）' }
  ];

  const handleFormChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = (materialId: string, files: FileList | null) => {
    if (files) {
      setUploadedFiles(prev => ({
        ...prev,
        [materialId]: [...(prev[materialId] || []), ...Array.from(files)]
      }));
    }
  };

  const removeFile = (materialId: string, index: number) => {
    setUploadedFiles(prev => ({
      ...prev,
      [materialId]: prev[materialId].filter((_, i) => i !== index)
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#165DFF';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setSignatureData(dataUrl);
    setShowSignatureModal(false);
  };

  const handleSubmit = async () => {
    if (!appId) return;
    setIsSubmitting(true);
    
    if (appId) {
      updateApplication(appId, {
        formData,
        status: 'submitted'
      });
      submitApplication(appId);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setCurrentStep(3);
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return formFields.filter(f => f.required).every(f => formData[f.key]);
    }
    if (currentStep === 1 && item) {
      return item.materials.filter(m => m.required).every(m => uploadedFiles[m.id]?.length > 0);
    }
    if (currentStep === 2) {
      return signatureData !== null;
    }
    return true;
  };

  if (!item) {
    return (
      <div className="container py-16 text-center">
        <p className="text-gray-500">事项不存在</p>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        返回
      </button>

      <div className="card p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{item.name}</h1>
            <p className="text-sm text-gray-500">在线申报 · 承诺 {item.promiseTime} 工作日办结</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-10 px-4">
          <StepProgress steps={steps} currentStep={currentStep} />
        </div>

        {currentStep === 0 && (
          <div className="card p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">填写申报信息</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {formFields.map((field) => (
                <div key={field.key} className={field.key === 'address' || field.key === 'email' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-danger-500 ml-1">*</span>}
                  </label>
                  <input
                    type="text"
                    value={formData[field.key] || ''}
                    onChange={(e) => handleFormChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="input-field"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setCurrentStep(1)}
                disabled={!canProceed()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="card p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">上传申请材料</h2>
            
            <div className="space-y-6">
              {item.materials.map((material) => (
                <div key={material.id} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{material.name}</h3>
                        {material.required && (
                          <span className="px-2 py-0.5 bg-danger-100 text-danger-600 text-xs rounded-full">
                            必填
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{material.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        支持格式：{material.format.join('、')}，大小不超过 {material.maxSize}MB
                      </p>
                    </div>
                  </div>

                  {uploadedFiles[material.id]?.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {uploadedFiles[material.id].map((file, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <FileText className="w-5 h-5 text-primary-500" />
                          <span className="flex-1 text-sm text-gray-700 truncate">{file.name}</span>
                          <span className="text-xs text-gray-400">{formatFileSize(file.size)}</span>
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <Download className="w-4 h-4 text-gray-400" />
                          </button>
                          <button
                            onClick={() => removeFile(material.id, idx)}
                            className="p-1 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-danger-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">点击或拖拽文件到此处上传</p>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept={material.format.map(f => `.${f}`).join(',')}
                      onChange={(e) => handleFileUpload(material.id, e.target.files)}
                    />
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={() => setCurrentStep(0)} className="btn-outline">
                上一步
              </button>
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!canProceed()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="card p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">电子签名确认</h2>
            
            <div className="bg-warning-50 border border-warning-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-warning-700">温馨提示</p>
                  <p className="text-sm text-warning-600 mt-1">
                    请确认以上申报信息真实有效，签名后将提交至相关部门审批。
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 mb-6">
              <h3 className="font-medium text-gray-900 mb-4">申报信息预览</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="flex">
                    <span className="text-gray-500 w-24 flex-shrink-0">
                      {formFields.find(f => f.key === key)?.label}：
                    </span>
                    <span className="text-gray-900">{value || '-'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-4">手写签名</h3>
              {signatureData ? (
                <div className="relative border border-gray-200 rounded-xl p-4 inline-block">
                  <img src={signatureData} alt="签名" className="h-24" />
                  <button
                    onClick={() => setSignatureData(null)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSignatureModal(true)}
                  className="flex items-center gap-3 px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-400 hover:bg-primary-50/50 transition-colors"
                >
                  <PenTool className="w-6 h-6 text-gray-400" />
                  <div className="text-left">
                    <p className="font-medium text-gray-700">点击签名</p>
                    <p className="text-xs text-gray-400">使用鼠标或触摸屏手写签名</p>
                  </div>
                  <Plus className="w-5 h-5 text-gray-400 ml-4" />
                </button>
              )}
            </div>

            <div className="flex items-start gap-3 mb-8">
              <input type="checkbox" id="agree" className="mt-1" />
              <label htmlFor="agree" className="text-sm text-gray-600">
                我已阅读并同意《政务服务申报须知》和《个人信息保护声明》，确认所填信息真实有效。
              </label>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setCurrentStep(1)} className="btn-outline">
                上一步
              </button>
              <button
                onClick={handleSubmit}
                disabled={!signatureData || isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '提交中...' : '提交申报'}
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">申报提交成功！</h2>
            <p className="text-gray-500 mb-2">您的办件编号：{appId}</p>
            <p className="text-gray-500 mb-8">我们将在 {item.promiseTime} 个工作日内完成审批</p>
            
            <div className="flex gap-4 justify-center">
              <button onClick={() => navigate('/progress')} className="btn-secondary">
                查看进度
              </button>
              <button onClick={() => navigate('/')} className="btn-primary">
                返回首页
              </button>
            </div>
          </div>
        )}
      </div>

      {showSignatureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg animate-fade-in">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">手写签名</h3>
              <button
                onClick={() => setShowSignatureModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="border border-gray-200 rounded-xl overflow-hidden touch-none">
                <canvas
                  ref={canvasRef}
                  width={480}
                  height={200}
                  className="w-full cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                请使用鼠标或手指在上方区域手写签名
              </p>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={clearSignature} className="btn-outline">
                清除
              </button>
              <button onClick={saveSignature} className="btn-primary">
                确认签名
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
