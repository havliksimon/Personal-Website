import { Linkedin, Github, Twitter, Mail, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo & Tagline */}
          <div>
            <h3 className="text-2xl font-semibold mb-2">Šimon Havlík</h3>
            <p className="text-gray-400 text-sm mb-4">
              Investment Analyst & Economics Student
            </p>
            <p className="text-gray-500 text-sm">
              Bridging economic theory with actionable investment strategy through data-driven analysis.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <nav className="space-y-2">
              <a href="#about" className="block text-gray-300 hover:text-white transition-colors">About</a>
              <a href="#journey" className="block text-gray-300 hover:text-white transition-colors">Journey</a>
              <a href="#skills" className="block text-gray-300 hover:text-white transition-colors">Skills</a>
              <a href="#projects" className="block text-gray-300 hover:text-white transition-colors">Projects</a>
              <a href="#china" className="block text-gray-300 hover:text-white transition-colors">China</a>
              <a href="#contact" className="block text-gray-300 hover:text-white transition-colors">Contact</a>
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Connect
            </h4>
            <div className="flex gap-3">
              <a
                href="https://linkedin.com/in/havliksimon"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:havlik.simon@post.cz"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Šimon Havlík. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            Back to top
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
