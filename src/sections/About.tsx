import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, Database, Globe, Award, MapPin, GraduationCap, Briefcase, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo(leftRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: leftRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo(rightRef.current,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: rightRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      const stats = statsRef.current?.querySelectorAll('.stat-item');
      if (stats) {
        gsap.fromTo(stats,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
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
      id="about"
      className="py-24 md:py-32 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-full mb-4">
            Get to know me
          </span>
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-gray-900">
            About Me
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-20">
          {/* Left Column - Text */}
          <div ref={leftRef}>
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 leading-tight">
              Economics student passionate about <span className="text-blue-600">Asia-Pacific markets</span> and <span className="text-blue-600">data-driven investment analysis</span>
            </h3>
            
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                My journey into economics began with a national thesis competition win, which opened doors to VŠE Prague — one of Central Europe's premier business schools. This achievement fueled my passion for understanding complex economic systems.
              </p>
              <p>
                As an active analyst at Klub Investorů, I combine fundamental valuation techniques with quantitative methods to identify investment opportunities. My focus on Asian markets stems from a deep fascination with the region's rapid economic transformation.
              </p>
              <p>
                Currently advancing my Mandarin skills (HSK3 → HSK4) to better understand Chinese business culture and access primary market research. Planning a semester at Xi'an Jiaotong-Liverpool University to deepen my regional expertise.
              </p>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>Prague, Czech Republic</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <GraduationCap className="w-4 h-4" />
                <span>VŠE Prague</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Briefcase className="w-4 h-4" />
                <span>Klub Investorů</span>
              </div>
            </div>

            {/* Education Journey Link - Animated */}
            <button
              onClick={() => {
                const educationSection = document.getElementById('education');
                if (educationSection) {
                  const start = window.scrollY;
                  const target = educationSection.getBoundingClientRect().top + window.scrollY;
                  const distance = target - start;
                  const duration = 1800;
                  const startTime = performance.now();
                  
                  const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                  
                  const animate = (currentTime: number) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = easeInOutQuad(progress);
                    
                    window.scrollTo(0, start + distance * eased);
                    
                    if (progress < 1) {
                      requestAnimationFrame(animate);
                    }
                  };
                  
                  requestAnimationFrame(animate);
                }
              }}
              className="group mt-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <GraduationCap className="w-4 h-4 text-white" />
                <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-30" />
              </span>
              <span className="font-medium">Education Journey</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>

          {/* Right Column - Image & Highlights */}
          <div ref={rightRef} className="space-y-6">
            {/* Portrait */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 aspect-[4/3]">
              <img
                src="./images/about-portrait.jpg"
                alt="Šimon Havlík"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-medium text-lg">Šimon Havlík</p>
                <p className="text-white/80 text-sm">Investment Analyst & Economics Student</p>
              </div>
            </div>

            {/* Highlight Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl border border-red-100">
                <TrendingUp className="w-6 h-6 text-red-600 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-1">Investment Analysis</h4>
                <p className="text-sm text-gray-500">DCF, multiples, equity research</p>
              </div>
              <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-100">
                <Database className="w-6 h-6 text-blue-600 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-1">Data Science</h4>
                <p className="text-sm text-gray-500">Python, SQL, R, ML</p>
              </div>
              <div className="p-5 bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl border border-green-100">
                <Globe className="w-6 h-6 text-green-600 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-1">Asia-Pacific</h4>
                <p className="text-sm text-gray-500">China markets, Mandarin HSK3</p>
              </div>
              <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-100">
                <Award className="w-6 h-6 text-purple-600 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-1">Recognition</h4>
                <p className="text-sm text-gray-500">National thesis winner</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-gray-100">
          <div className="stat-item text-center">
            <p className="text-4xl font-bold text-gray-900 mb-1">20+</p>
            <p className="text-sm text-gray-500">Stock Analyses</p>
          </div>
          <div className="stat-item text-center">
            <p className="text-4xl font-bold text-gray-900 mb-1">HSK3</p>
            <p className="text-sm text-gray-500">Mandarin Level</p>
          </div>
          <div className="stat-item text-center">
            <p className="text-4xl font-bold text-gray-900 mb-1">5+</p>
            <p className="text-sm text-gray-500">Tech Stack</p>
          </div>
          <div className="stat-item text-center">
            <p className="text-4xl font-bold text-gray-900 mb-1">2027</p>
            <p className="text-sm text-gray-500">Graduation</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
