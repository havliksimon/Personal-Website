import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, ExternalLink, Github, TrendingUp, BarChart3, Database, LineChart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: 'KI AM Portfolio Tracking Platform',
    description: 'Full-stack web application for tracking investment portfolios with real-time data visualization, risk analysis, and performance metrics. Built for Klub Investorů asset management team.',
    icon: TrendingUp,
    tags: ['Python', 'Flask', 'SQL', 'JavaScript', 'Chart.js'],
    categories: ['web-development', 'finance', 'python'],
    featured: true,
    link: 'https://ki.verxl.com/',
    github: 'https://github.com/havliksimon/ki-asset-management',
    liveUrl: 'https://ki.verxl.com/'
  },
  {
    id: 2,
    title: 'Asian Equity Risk Assessment Platform',
    description: 'Flask-based web application for analyzing risk factors in Asian equity markets using Python, SQL, and machine learning algorithms for predictive modeling.',
    icon: BarChart3,
    tags: ['Python', 'Flask', 'SQL', 'scikit-learn', 'JavaScript'],
    categories: ['web-development', 'finance', 'python'],
    featured: true,
    link: '#'
  },
  {
    id: 3,
    title: 'Macroeconomic Indicator Dashboard',
    description: 'R-based dashboard for tracking and forecasting key macroeconomic indicators for China and Asian markets with interactive visualizations.',
    icon: LineChart,
    tags: ['R', 'Shiny', 'ggplot2', 'Time Series Analysis'],
    categories: ['data-analysis', 'r', 'macro'],
    featured: true,
    link: '#'
  },
  {
    id: 4,
    title: 'Portfolio Optimization Model',
    description: 'Python implementation of Modern Portfolio Theory with risk parity allocation for emerging market portfolios using CVXPY optimization.',
    icon: Database,
    tags: ['Python', 'pandas', 'numpy', 'CVXPY'],
    categories: ['finance', 'python', 'optimization'],
    featured: false,
    link: '#',
    github: 'https://github.com/havliksimon/Portfolio-Optimization-Model'
  }
];

const categoryColors: Record<string, string> = {
  'web-development': 'bg-blue-100 text-blue-700',
  'finance': 'bg-green-100 text-green-700',
  'python': 'bg-yellow-100 text-yellow-700',
  'data-analysis': 'bg-purple-100 text-purple-700',
  'r': 'bg-cyan-100 text-cyan-700',
  'macro': 'bg-orange-100 text-orange-700',
  'optimization': 'bg-pink-100 text-pink-700'
};

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(titleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Cards animation
      cardsRef.current.forEach((card, i) => {
        if (card) {
          gsap.fromTo(card,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              delay: i * 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="section bg-gray-50"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <span className="text-sm font-mono uppercase tracking-wider text-gray-400 mb-4 block">Technical Work</span>
          <h2 className="section-title">
            Featured <span className="text-red-600">Projects</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Building tools that combine financial expertise with technical skills. 
            These projects demonstrate my ability to turn complex data into actionable insights.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => {
            const Icon = project.icon;
            
            return (
              <div
                key={project.id}
                ref={el => { cardsRef.current[index] = el; }}
                className={`bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow ${
                  project.featured ? 'md:col-span-2' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                      {project.featured && (
                        <span className="text-xs font-medium text-red-600">Featured Project</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        title="View on GitHub"
                      >
                        <Github className="w-4 h-4 text-gray-600" />
                      </a>
                    )}
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      title="View Project"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                    </a>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>
                
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 mb-4"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Live at ki.verxl.com
                  </a>
                )}

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                    >
                      <Code2 className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Category Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.categories.map((cat, i) => (
                    <span
                      key={i}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${categoryColors[cat] || 'bg-gray-100 text-gray-700'}`}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
