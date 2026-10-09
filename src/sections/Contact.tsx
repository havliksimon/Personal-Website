import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Linkedin, Send, CheckCircle, type LucideIcon } from 'lucide-react';
import ContactEffects from '../components/ContactEffects';

gsap.registerPlugin(ScrollTrigger);

interface ContactItem {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string | null;
  hoverValue?: string;
}

const contactInfo: ContactItem[] = [
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
    value: 'Redacted for privacy',
    hoverValue: 'Shared via email',
    href: 'mailto:havlik.simon@post.cz'
  }
];

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
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
        let detail = `HTTP ${response.status}`;
        try {
          const data = await response.json();
          if (data?.errors?.length) detail = data.errors.map((x: { message: string }) => x.message).join(', ');
        } catch {
          /* keep the status code */
        }
        setError(`The mail service rejected that (${detail}).`);
      }
    } catch {
      setError('Could not reach the mail service — a browser blocker may be blocking formspree.io.');
    }

    setIsSubmitting(false);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="section bg-gray-50/80 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Pink Warm Contact Effects */}
      <ContactEffects />
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 id="contact-heading" className="section-title">Let's Connect</h2>
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
                  <div className="gloss-card group flex items-center gap-4 p-4 bg-gray-50 rounded-xl transition-all duration-300 cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">{item.label}</span>
                      <p className="font-medium text-gray-900">
                        <span className={item.hoverValue ? 'group-hover:hidden' : undefined}>{item.value}</span>
                        {item.hoverValue && (
                          <span className="hidden text-amber-600 group-hover:inline">{item.hoverValue}</span>
                        )}
                      </p>
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
          <div className="premium-gloss bg-gray-50 rounded-2xl p-6 md:p-8">
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
                {error && (
                  <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                    {error}{' '}
                    <a
                      className="font-medium underline"
                      href={`mailto:havlik.simon@post.cz?subject=${encodeURIComponent(
                        formData.subject || 'Website enquiry'
                      )}&body=${encodeURIComponent(formData.message)}`}
                    >
                      Send it by email instead
                    </a>
                  </div>
                )}
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
