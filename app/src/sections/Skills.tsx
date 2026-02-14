import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import skillsData from '../data/skills.json';
import { Calculator, Code, Brain, TrendingUp, BookOpen, Landmark, Globe, Palette, Languages } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = {
  Calculator,
  Code,
  Brain,
  TrendingUp,
  BookOpen,
  Landmark,
  Globe,
  Palette,
  Languages
};

const colorMap: Record<string, { bg: string; fill: string; text: string; circle: string }> = {
  blue: { bg: 'bg-blue-50', fill: 'bg-blue-500', text: 'text-blue-700', circle: 'stroke-blue-500' },
  cyan: { bg: 'bg-cyan-50', fill: 'bg-cyan-500', text: 'text-cyan-700', circle: 'stroke-cyan-500' },
  purple: { bg: 'bg-purple-50', fill: 'bg-purple-500', text: 'text-purple-700', circle: 'stroke-purple-500' },
  green: { bg: 'bg-green-50', fill: 'bg-green-500', text: 'text-green-700', circle: 'stroke-green-500' },
  orange: { bg: 'bg-orange-50', fill: 'bg-orange-500', text: 'text-orange-700', circle: 'stroke-orange-500' },
  emerald: { bg: 'bg-emerald-50', fill: 'bg-emerald-500', text: 'text-emerald-700', circle: 'stroke-emerald-500' },
  red: { bg: 'bg-red-50', fill: 'bg-red-500', text: 'text-red-700', circle: 'stroke-red-500' },
  pink: { bg: 'bg-pink-50', fill: 'bg-pink-500', text: 'text-pink-700', circle: 'stroke-pink-500' },
  indigo: { bg: 'bg-indigo-50', fill: 'bg-indigo-500', text: 'text-indigo-700', circle: 'stroke-indigo-500' }
};

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      const cards = cardsRef.current?.querySelectorAll('.skill-card');
      if (cards) {
        gsap.fromTo(cards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      const progressBars = cardsRef.current?.querySelectorAll('.skill-progress');
      if (progressBars) {
        progressBars.forEach((bar) => {
          const width = bar.getAttribute('data-width');
          gsap.fromTo(bar,
            { width: '0%' },
            {
              width: `${width}%`,
              duration: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: bar,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="section bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <span className="text-sm font-mono uppercase tracking-wider text-gray-400 mb-4 block">Expertise</span>
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle mx-auto">
            Comprehensive toolkit built through coursework at VŠE Prague, self-study, and practical experience.
          </p>
        </div>

        {/* Skill Cards Grid - 9 categories */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillsData.categories.map((category) => {
            const Icon = iconMap[category.icon] || Code;
            const colors = colorMap[category.color];
            
            return (
              <div key={category.id} className="skill-card bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-gray-400 text-xs">{category.description}</p>
                  </div>
                </div>

                {/* Skills List */}
                <div className="space-y-2.5">
                  {category.skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {/* Circular Progress */}
                          <div className="relative w-6 h-6">
                            <svg className="w-6 h-6 transform -rotate-90">
                              <circle
                                cx="12"
                                cy="12"
                                r="9"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="2"
                              />
                              <circle
                                cx="12"
                                cy="12"
                                r="9"
                                fill="none"
                                className={colors.circle}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 9}`}
                                strokeDashoffset={`${2 * Math.PI * 9 * (1 - skill.level / 100)}`}
                                style={{ transition: 'stroke-dashoffset 1s ease' }}
                              />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[6px] font-medium text-gray-600">
                              {skill.level}%
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">{skill.context}</span>
                      </div>
                      {/* Horizontal Progress Bar */}
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`skill-progress h-full rounded-full ${colors.fill}`}
                          data-width={skill.level}
                          style={{ width: '0%' }}
                        />
                      </div>
                    </div>
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

export default Skills;
