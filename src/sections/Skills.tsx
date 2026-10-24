import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import skillsData from '../data/skills.json';
import SkillsEffects from '../components/SkillsEffects';

gsap.registerPlugin(ScrollTrigger);

/**
 * The full inventory, presented as a working matrix rather than nine cards:
 * every category and every skill stays on the page, in two columns, with the
 * process panel alongside so the section reads as "what I know" and "how I
 * use it" at the same time.
 */
const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: titleRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        },
      );

      const blocks = gridRef.current?.querySelectorAll('.skill-block');
      if (blocks) {
        gsap.fromTo(blocks,
          { y: 16, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.4, stagger: 0.04, ease: 'power2.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 88%', toggleActions: 'play none none reverse' },
          },
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
      <SkillsEffects />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div ref={titleRef} className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Expertise
            </span>
            <h2 id="skills-heading" className="text-3xl font-semibold tracking-[-0.02em] text-gray-900 md:text-4xl">
              Skills &amp; Technologies
            </h2>
          </div>
          <p className="max-w-sm text-[13px] leading-relaxed text-gray-500 md:text-right">
            The toolkit built across VŠE Prague, Klub Investorů and published research: quantitative
            work, programming, valuation, Asia-Pacific and languages.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-6 lg:gap-y-7">
            {skillsData.categories.map((category) => (
              <div key={category.id} className="skill-block border-t border-gray-300 pt-2.5">
                <h3 className="mb-1.5 font-mono text-[8.5px] uppercase leading-tight tracking-[0.12em] text-gray-500">
                  {category.name}
                </h3>
                <ul className="space-y-0.5">
                  {category.skills.map((skill) => (
                    <li key={skill.name} className="flex flex-wrap items-baseline gap-x-1.5 leading-snug">
                      <span className="text-[12px] font-medium text-gray-900">{skill.name}</span>
                      <span className="hidden font-mono text-[7.5px] uppercase tracking-[0.05em] text-gray-400 sm:inline">
                        {skill.context}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
