import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Lock, Smartphone, User, Shield, Eye, EyeOff, CheckCircle2, Info } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { useSmsStore } from '@/store/useSmsStore';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn, users } = useUserStore();
  const { sendVerificationCode, verifyCode } = useSmsStore();
  const [loginType, setLoginType] = useState<'password' | 'sms'>('password');
  const [phone, setPhone] = useState('13800138001');
  const [password, setPassword] = useState('123456');
  const [smsCode, setSmsCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [sentCode, setSentCode] = useState<string | null>(null);

  const from = (location.state as { from?: string })?.from || '/';

  if (isLoggedIn) {
    return <Navigate to={from} replace />;
  }

  const handleSendCode = () => {
    if (!phone || phone.length !== 11) {
      setError('请输入正确的手机号');
      return;
    }
    const { code } = sendVerificationCode(phone);
    setSentCode(code);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogin = async () => {
    setError('');
    if (!phone || phone.length !== 11) {
      setError('请输入正确的手机号');
      return;
    }
    if (loginType === 'password' && !password) {
      setError('请输入密码');
      return;
    }
    if (loginType === 'sms') {
      if (!smsCode) {
        setError('请输入验证码');
        return;
      }
      if (!verifyCode(phone, smsCode)) {
        setError('验证码错误或已过期');
        return;
      }
    }

    setLoading(true);
    try {
      const success = await login(phone, loginType === 'password' ? password : smsCode);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('登录失败，请检查手机号是否正确');
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const roleLabels: Record<string, string> = {
    citizen: '市民',
    worker: '窗口工作人员',
    approver: '审批人员',
    admin: '管理员'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">政务服务"一件事"联办平台</h1>
          <p className="text-gray-500">让政务服务更便捷、更高效</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginType === 'password'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setLoginType('password')}
            >
              密码登录
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginType === 'sms'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setLoginType('sms')}
            >
              短信登录
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {sentCode && loginType === 'sms' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-sm flex items-start gap-2">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">测试提示：验证码已发送</p>
                <p className="text-xs mt-1">您的验证码是：<span className="font-mono font-bold">{sentCode}</span></p>
                <p className="text-xs mt-1">也可在管理员后台"短信记录"中查看</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="请输入手机号"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={11}
                />
              </div>
            </div>

            {loginType === 'password' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="请输入密码"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">验证码</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="请输入验证码"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  <button
                    type="button"
                    className={`px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      countdown > 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                  >
                    {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
              <span className="text-gray-600">记住我</span>
            </label>
            <a href="#" className="text-blue-600 hover:text-blue-700">忘记密码？</a>
          </div>

          <button
            className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-3">还没有账号？</p>
            <button className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              立即注册
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            测试账号（点击手机号快速填入）：
          </p>
          <div className="grid grid-cols-2 gap-2">
            {users.map((user) => (
              <button
                key={user.id}
                className="text-left p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                onClick={() => {
                  setPhone(user.phone);
                  setPassword('123456');
                }}
              >
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  {roleLabels[user.role]}
                </p>
                <p className="text-xs text-blue-600 font-mono">{user.phone}</p>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          登录即表示您同意<a href="#" className="text-blue-500">《用户协议》</a>和<a href="#" className="text-blue-500">《隐私政策》</a>
        </p>
      </div>
    </div>
  );
}
