import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import timelineData from '../data/timeline.json';
import { GraduationCap, Award, Briefcase, Languages, Calendar, MapPin } from 'lucide-react';
import TimelineEffects from '../components/TimelineEffects';

gsap.registerPlugin(ScrollTrigger);

const typeIcons = {
  education: GraduationCap,
  achievement: Award,
  experience: Briefcase,
  language: Languages
};

const typeColors = {
  education: 'border-blue-200 bg-blue-50',
  achievement: 'border-amber-200 bg-amber-50',
  experience: 'border-green-200 bg-green-50',
  language: 'border-purple-200 bg-purple-50'
};

const statusColors = {
  Completed: 'bg-gray-100 text-gray-600',
  Current: 'bg-green-100 text-green-700',
  Upcoming: 'bg-blue-100 text-blue-700'
};

const Timeline = () => {
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
            stagger: 0.12,
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
      id="journey"
      aria-labelledby="journey-heading"
      className="section bg-gray-50/80 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Emerald Journey Effects */}
      <TimelineEffects />
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 id="journey-heading" className="section-title">Education Journey</h2>
          <p className="section-subtitle mx-auto">
            My academic path from secondary education through university, 
            with a growing focus on Asia-Pacific markets and Chinese language.
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Center line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 md:-translate-x-1/2" />

          {/* Cards */}
          <div className="space-y-8">
            {timelineData.events.map((item, index) => {
              const Icon = typeIcons[item.type as keyof typeof typeIcons];
              const isLeft = index % 2 === 0;
              
              return (
                <div
                  key={item.id}
                  className={`timeline-card relative flex ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-start gap-4 md:gap-8`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-gray-900 border-4 border-white shadow-sm z-10 md:-translate-x-1/2" />

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Card content */}
                  <div className={`ml-10 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}>
                    <div className={`gloss-card bg-white rounded-xl p-5 border ${typeColors[item.type as keyof typeof typeColors]} shadow-sm transition-all duration-300`}>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                            <Icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                            <p className="text-gray-500 text-sm">{item.subtitle}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[item.status as keyof typeof statusColors]}`}>
                          {item.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {item.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {item.location}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">
                        {item.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {item.skills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="tag tag-gray text-[10px]">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
