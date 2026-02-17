import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import ChinaEffects from '../components/ChinaEffects';

const gdpData = [
  { year: 2000, China: 3.6, USA: 10.3 },
  { year: 2005, China: 7.0, USA: 13.1 },
  { year: 2010, China: 13.2, USA: 15.0 },
  { year: 2015, China: 19.8, USA: 18.0 },
  { year: 2020, China: 24.3, USA: 20.9 },
  { year: 2024, China: 33.0, USA: 23.0 },
];

const fdiData = [
  { year: 2018, China: 139, USA: 252 },
  { year: 2019, China: 141, USA: 246 },
  { year: 2020, China: 149, USA: 156 },
  { year: 2021, China: 181, USA: 367 },
  { year: 2022, China: 189, USA: 285 },
  { year: 2023, China: 163, USA: 148 },
];

const China = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);

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

      const statItems = statsRef.current?.querySelectorAll('.stat-card');
      if (statItems) {
        gsap.fromTo(statItems,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      gsap.fromTo(chartsRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: chartsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      const photoItems = photosRef.current?.querySelectorAll('.photo-card');
      if (photoItems) {
        gsap.fromTo(photoItems,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: photosRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const photos = [
    { src: './images/china-1.jpg', location: 'Forbidden City, Beijing' },
    { src: './images/china-2.jpg', location: 'Beijing Hutong' },
    { src: './images/china-3.jpg', location: 'Summer Palace' },
    { src: './images/china-4.jpg', location: 'Summer Palace View' },
    { src: './images/china-5.jpg', location: 'Temple of Heaven' },
    { src: './images/china-6.jpg', location: 'Great Wall of China' },
  ];

  return (
    <section
      ref={sectionRef}
      id="china"
      className="section bg-gray-50/80 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Red Lightning & Storm Effects */}
      <ChinaEffects />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-12">
          <span className="text-sm font-mono uppercase tracking-wider text-gray-400 mb-4 block">Focus Area</span>
          <h2 className="section-title">China: The World's Economic Engine</h2>
          <p className="section-subtitle mx-auto">
            Understanding the scale and momentum of the world's largest economy by purchasing power parity.
          </p>
        </div>

        {/* Key Stats Grid */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="stat-card premium-gloss bg-white rounded-2xl p-6 shadow-sm transition-all duration-300">
            <div className="text-4xl font-bold text-gray-900 mb-2">$33T</div>
            <div className="text-sm text-gray-500 mb-1">GDP (PPP)</div>
            <div className="text-xs text-green-600">World's largest since 2016</div>
          </div>
          <div className="stat-card premium-gloss bg-white rounded-2xl p-6 shadow-sm transition-all duration-300">
            <div className="text-4xl font-bold text-gray-900 mb-2">8,000+</div>
            <div className="text-sm text-gray-500 mb-1">Listed Companies</div>
            <div className="text-xs text-green-600">2× more than US markets</div>
          </div>
          <div className="stat-card premium-gloss bg-white rounded-2xl p-6 shadow-sm transition-all duration-300">
            <div className="text-4xl font-bold text-gray-900 mb-2">600M+</div>
            <div className="text-sm text-gray-500 mb-1">Middle Class</div>
            <div className="text-xs text-green-600">Largest consumer market</div>
          </div>
          <div className="stat-card premium-gloss bg-white rounded-2xl p-6 shadow-sm transition-all duration-300">
            <div className="text-4xl font-bold text-gray-900 mb-2">35%</div>
            <div className="text-sm text-gray-500 mb-1">Green Investment</div>
            <div className="text-xs text-green-600">Of global renewable energy</div>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="gloss-card bg-white rounded-xl p-4 shadow-sm text-center transition-all duration-300">
            <div className="text-2xl font-bold text-gray-900">8/10</div>
            <div className="text-xs text-gray-500">Top unis in Leiden Ranking</div>
          </div>
          <div className="gloss-card bg-white rounded-xl p-4 shadow-sm text-center transition-all duration-300">
            <div className="text-2xl font-bold text-gray-900">$163B</div>
            <div className="text-xs text-gray-500">FDI inflows (2023)</div>
          </div>
          <div className="gloss-card bg-white rounded-xl p-4 shadow-sm text-center transition-all duration-300">
            <div className="text-2xl font-bold text-gray-900">14nm</div>
            <div className="text-xs text-gray-500">Domestic chip production</div>
          </div>
          <div className="gloss-card bg-white rounded-xl p-4 shadow-sm text-center transition-all duration-300">
            <div className="text-2xl font-bold text-gray-900">40%</div>
            <div className="text-xs text-gray-500">Global EV market share</div>
          </div>
        </div>

        {/* Charts */}
        <div ref={chartsRef} className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* GDP Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">GDP (PPP) Comparison</h3>
            <p className="text-sm text-gray-500 mb-4">China vs USA (Trillion USD)</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gdpData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="year" stroke="#9ca3af" fontSize={12} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="China" stroke="#DC2626" strokeWidth={3} dot={{ fill: '#DC2626', r: 4 }} />
                  <Line type="monotone" dataKey="USA" stroke="#6B7280" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#6B7280', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* FDI Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">FDI Inflows</h3>
            <p className="text-sm text-gray-500 mb-4">Foreign Direct Investment (Billion USD)</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fdiData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="year" stroke="#9ca3af" fontSize={12} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Bar dataKey="China" fill="#DC2626" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="USA" fill="#9CA3AF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Field Research</h3>
          <div ref={photosRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="photo-card gloss-card relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                onMouseEnter={() => setActivePhoto(index)}
                onMouseLeave={() => setActivePhoto(null)}
              >
                <img
                  src={photo.src}
                  alt={photo.location}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div 
                  className={`absolute inset-0 bg-black/70 flex items-center justify-center transition-opacity duration-300 ${
                    activePhoto === index ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <span className="text-white text-sm font-medium text-center px-2">{photo.location}</span>
                </div>
              </div>
            ))}
            {[...Array(6)].map((_, i) => (
              <div
                key={`placeholder-${i}`}
                className="photo-card aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50"
              >
                <span className="text-gray-400 text-xs font-mono">Photo {i + 7}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default China;
