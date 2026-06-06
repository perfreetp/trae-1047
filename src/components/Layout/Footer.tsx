export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">关于平台</h3>
            <p className="text-sm leading-relaxed">
              政务服务"一件事"联办平台，致力于为市民和企业提供高效、便捷的一站式政务服务，实现"一件事一次办"。
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">服务事项</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">开店经营</a></li>
              <li><a href="#" className="hover:text-white transition-colors">教育服务</a></li>
              <li><a href="#" className="hover:text-white transition-colors">社会保障</a></li>
              <li><a href="#" className="hover:text-white transition-colors">住房服务</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">帮助中心</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">办事指南</a></li>
              <li><a href="#" className="hover:text-white transition-colors">常见问题</a></li>
              <li><a href="#" className="hover:text-white transition-colors">政策法规</a></li>
              <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">联系方式</h3>
            <ul className="space-y-2 text-sm">
              <li>服务热线：12345</li>
              <li>工作时间：周一至周五 9:00-17:00</li>
              <li>电子邮箱：service@gov.cn</li>
              <li>办公地址：XX市XX区政务服务中心</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© 2024 政务服务联办平台 版权所有 | 京ICP备XXXXXXXX号</p>
        </div>
      </div>
    </footer>
  );
}
