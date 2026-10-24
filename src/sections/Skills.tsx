import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import skillsData from '../data/skills.json';
import SkillsEffects from '../components/SkillsEffects';
import SkillsWorkbench from '../components/SkillsWorkbench';

gsap.registerPlugin(ScrollTrigger);

/**
 * Curriculum-vitae layout: the skill inventory reads as a printed CV on the
 * left, while the right runs a live workbench showing how the work actually
 * gets done — analyse, value, report.
 */
const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const benchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: titleRef.current, start: 'top 82%', toggleActions: 'play none none reverse' },
        },
      );

      const rows = listRef.current?.querySelectorAll('.cv-row');
      if (rows) {
        gsap.fromTo(rows,
          { y: 24, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out',
            scrollTrigger: { trigger: listRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
          },
        );
      }

      gsap.fromTo(benchRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: benchRef.current, start: 'top 82%', toggleActions: 'play none none reverse' },
        },
      );
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
      <SkillsEffects />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div ref={titleRef} className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-sm font-mono uppercase tracking-wider text-gray-400 mb-3 block">Expertise</span>
            <h2 id="skills-heading" className="section-title">Skills & Technologies</h2>
            <p className="section-subtitle">
              The toolkit behind the work: valuation, modelling and research, applied to real portfolios
              and published analyses.
            </p>
          </div>
          <p className="hidden md:block max-w-[220px] text-right font-mono text-[10px] uppercase tracking-[0.18em] leading-relaxed text-gray-400">
            Curriculum<br />Prague · 2026
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          {/* CV column */}
          <div ref={listRef} className="cv">
            {skillsData.categories.map((category) => (
              <div
                key={category.id}
                className="cv-row grid gap-1 border-t border-gray-200 py-4 md:grid-cols-[150px_1fr] md:gap-6"
              >
                <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-gray-700">
                  {category.name}
                </h3>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5">
                  {category.skills.map((skill, index) => (
                    <span key={skill.name} className="inline-flex items-baseline gap-2">
                      <span className="text-[13px] font-medium text-gray-900">{skill.name}</span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-gray-500">
                        {skill.context}
                      </span>
                      {index < category.skills.length - 1 && (
                        <span aria-hidden="true" className="text-gray-300">·</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <div className="border-t border-gray-200 pt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-gray-500">
                Working languages · English (C1) · Czech (native) · German (B1)
              </p>
            </div>
          </div>

          {/* Workbench column */}
          <div ref={benchRef}>
            <SkillsWorkbench />
            <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-gray-500">
              A representative slice of the workflow · comparable analysis → DCF → investment memo
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
