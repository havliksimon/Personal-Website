import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Linkedin, Send, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'havlik.simon@post.cz',
    href: 'mailto:havlik.simon@post.cz'
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/havliksimon',
    href: 'https://linkedin.com/in/havliksimon'
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Prague, Czech Republic',
    href: null
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+420 776 341 621',
    href: 'tel:+420776341621'
  }
];

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

      // Content animation
      gsap.fromTo(contentRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xreaqlgy';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });
      
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section bg-white"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="section-title">Let's Connect</h2>
          <p className="section-subtitle mx-auto">
            I'm always open to discussing investment opportunities and consulting projects.
            Whether you're looking for analytical expertise or want to exchange ideas about
            financial markets, I'd love to hear from you.
          </p>
        </div>

        {/* Content */}
        <div ref={contentRef} className="grid lg:grid-cols-2 gap-12">
          {/* Left - Contact Info */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h3>
            
            <div className="space-y-4 mb-8">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                const content = (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">{item.label}</span>
                      <p className="text-gray-900 font-medium">{item.value}</p>
                    </div>
                  </div>
                );
                
                return item.href ? (
                  <a key={index} href={item.href} className="block">
                    {content}
                  </a>
                ) : (
                  <div key={index}>{content}</div>
                );
              })}
            </div>

            {/* Status Card */}
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-700">Available for opportunities</span>
              </div>
              <p className="text-sm text-green-600">
                Currently seeking consulting internships for 2026-2027.
              </p>
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Send a Message</h3>
            
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Message sent!</h4>
                <p className="text-gray-500">I'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Subject (Optional)</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="form-input"
                    placeholder="Project inquiry"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Your Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-input min-h-[120px] resize-none"
                    placeholder="Tell me about your project or opportunity..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary justify-center py-4"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
