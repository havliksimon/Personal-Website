import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const educationData = [
  {
    id: 1,
    school: 'Gymnázium Karla Sladkovského',
    degree: 'General Secondary Education',
    period: '2015 — 2024',
    location: 'Czech Republic',
    description: 'Completed general secondary education with focus on economics and mathematics. Won competition for best high school thesis in economics.',
    status: 'Completed',
    statusColor: 'bg-gray-100 text-gray-600'
  },
  {
    id: 2,
    school: 'VŠE Prague',
    degree: "Bachelor's in Economics",
    period: '2024 — 2027 (Expected)',
    location: 'Prague, Czech Republic',
    description: 'Prague University of Economics and Business. Focusing on investment analysis, financial markets, and economic theory.',
    status: 'Current',
    statusColor: 'bg-green-100 text-green-700'
  },
  {
    id: 3,
    school: 'Beijing Foreign Studies University',
    degree: 'Chinese Language Intensive',
    period: 'Jul — Aug 2025',
    location: 'Beijing, China',
    description: 'Intensive Chinese language summer program with focus on business Chinese and cultural immersion.',
    status: 'Completed',
    statusColor: 'bg-gray-100 text-gray-600'
  },
  {
    id: 4,
    school: 'XJTLU — Xi\'an Jiaotong-Liverpool University',
    degree: 'Semester Abroad',
    period: 'Feb — Jun 2026',
    location: 'Suzhou, China',
    description: 'Economics semester exchange program focusing on international economics and China-Asia business relations.',
    status: 'Upcoming',
    statusColor: 'bg-blue-100 text-blue-700'
  },
  {
    id: 5,
    school: 'SISU Shanghai',
    degree: 'Intensive Chinese Language',
    period: 'Jul — Sep 2026',
    location: 'Shanghai, China',
    description: 'Shanghai International Studies University — Advanced Chinese language intensive course targeting HSK4 proficiency.',
    status: 'Upcoming',
    statusColor: 'bg-blue-100 text-blue-700'
  }
];

const Education = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

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

      // Timeline cards animation
      const cards = timelineRef.current?.querySelectorAll('.timeline-card');
      if (cards) {
        gsap.fromTo(cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: timelineRef.current,
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
      id="education"
      className="section bg-gray-50"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="section-title">Education Journey</h2>
          <p className="section-subtitle mx-auto">
            My academic path from secondary education through university, 
            with a growing focus on Asia-Pacific markets and Chinese language.
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2 hidden md:block" />

          {/* Cards */}
          <div className="space-y-8 md:space-y-0">
            {educationData.map((item, index) => (
              <div
                key={item.id}
                className={`timeline-card relative md:w-[calc(50%-2rem)] ${
                  index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                }`}
              >
                {/* Timeline dot */}
                <div className="hidden md:block absolute top-8 w-4 h-4 rounded-full bg-gray-900 border-4 border-white shadow-sm z-10 ${
                  index % 2 === 0 ? '-right-10' : '-left-10'
                }" 
                style={{ [index % 2 === 0 ? 'right' : 'left']: '-2.5rem' }}
                />

                {/* Card content */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{item.school}</h3>
                        <p className="text-gray-500">{item.degree}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {item.period}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {item.location}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
