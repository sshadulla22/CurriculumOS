import { Code2, Globe, MessageCircle, Send, Users } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-950 pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-6">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Code2 className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">JS Mastery</span>
            </a>
            <p className="text-gray-400 max-w-sm mb-8">
              Helping developers master JavaScript and full-stack development through project-based learning and structured roadmaps.
            </p>
            <div className="flex gap-4">
              {[Globe, MessageCircle, Send, Users].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <Icon size={20} className="text-white" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Course</h4>
            <ul className="space-y-4">
              <li><a href="#roadmap" className="text-gray-400 hover:text-white transition-colors">Roadmap</a></li>
              <li><a href="#curriculum" className="text-gray-400 hover:text-white transition-colors">Curriculum</a></li>
              <li><a href="#reviews" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} JS Mastery. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            Made with <span className="text-red-500">❤️</span> for the developer community.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
