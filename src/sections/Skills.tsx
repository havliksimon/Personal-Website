import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import skillsData from '../data/skills.json';
import { Calculator, Code, Brain, TrendingUp, BookOpen, Landmark, Globe, Palette, Languages, type LucideIcon } from 'lucide-react';
import SkillsEffects from '../components/SkillsEffects';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, LucideIcon> = {
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

const colorMap: Record<string, { bg: string; fill: string; text: string }> = {
  blue: { bg: 'bg-blue-50', fill: 'bg-blue-500', text: 'text-blue-700' },
  cyan: { bg: 'bg-cyan-50', fill: 'bg-cyan-500', text: 'text-cyan-700' },
  purple: { bg: 'bg-purple-50', fill: 'bg-purple-500', text: 'text-purple-700' },
  green: { bg: 'bg-green-50', fill: 'bg-green-500', text: 'text-green-700' },
  orange: { bg: 'bg-orange-50', fill: 'bg-orange-500', text: 'text-orange-700' },
  emerald: { bg: 'bg-emerald-50', fill: 'bg-emerald-500', text: 'text-emerald-700' },
  red: { bg: 'bg-red-50', fill: 'bg-red-500', text: 'text-red-700' },
  pink: { bg: 'bg-pink-50', fill: 'bg-pink-500', text: 'text-pink-700' },
  indigo: { bg: 'bg-indigo-50', fill: 'bg-indigo-500', text: 'text-indigo-700' }
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-labelledby="skills-heading"
      className="section bg-gray-50/80 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Purple Creative Effects */}
      <SkillsEffects />
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <span className="text-sm font-mono uppercase tracking-wider text-gray-400 mb-4 block">Expertise</span>
          <h2 id="skills-heading" className="section-title">Skills & Technologies</h2>
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
              <div key={category.id} className="skill-card premium-gloss bg-white rounded-2xl p-5 shadow-sm transition-all duration-300">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-gray-400 text-xs">{category.description}</p>
                  </div>
                </div>

                {/* Accent */}
                <div className={`h-0.5 w-10 rounded-full ${colors.fill} opacity-60 mb-3`} />

                {/* Skills List */}
                <div className="space-y-0.5">
                  {category.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="group/skill flex items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 -mx-1 transition-colors duration-200 hover:bg-gray-50"
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-1.5 h-1.5 rounded-full ${colors.fill} flex-shrink-0 transition-transform duration-300 group-hover/skill:scale-150`} />
                        <span className="text-sm font-medium text-gray-900 truncate">{skill.name}</span>
                      </span>
                      <span className="text-[11px] text-gray-400 whitespace-nowrap">{skill.context}</span>
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
