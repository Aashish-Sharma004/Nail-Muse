// src/pages/Home/Home.jsx
import { useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Palette,
  Leaf,
  Leaf as LeafIcon,
  ShieldCheck,
  Clock,
  Gem,
  Star,
  ArrowRight,
  Heart,
  Crown,
  
} from 'lucide-react';

const Home = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('nm-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedEls = document.querySelectorAll('.nm-animate');
    animatedEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const services = [
    { Icon: Sparkles, title: 'Signature Manicure', desc: 'Meticulous care with hydrating massage & flawless polish application by our master technicians.', price: 'From $45' },
    { Icon: Zap,      title: 'Gel Extensions',    desc: 'Lightweight Gel-X extensions with zero damage to natural nails — lasting up to four weeks.', price: 'From $85' },
    { Icon: Palette,  title: 'Custom Nail Art',   desc: '3D sculpting, Swarovski crystals & hand-painted murals — bespoke art crafted just for you.', price: 'From $35' },
    { Icon: Leaf,     title: 'Spa Pedicure',       desc: 'Soothing soak, callus treatment & an extended lower-leg massage for total relaxation.', price: 'From $65' },
  ];

  const team = [
    {
      name: 'Elena M.',
      role: 'Master Nail Artist',
      BadgeIcon: Heart,
      badge: 'Customer Favorite',
      rating: 4.9,
      img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80',
      skills: ['3D Art', 'Hand-painted', 'Gems'],
    },
    {
      name: 'Mia K.',
      role: 'Extension Specialist',
      BadgeIcon: Crown,
      badge: 'Master Tech',
      rating: 5.0,
      img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
      skills: ['Gel-X', 'Acrylics', 'Sculpting'],
    },
    {
      name: 'Sarah T.',
      role: 'Spa & Pedicure Expert',
      BadgeIcon: Sparkles,
      badge: 'Fills up fast',
      rating: 4.8,
      img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
      skills: ['Reflexology', 'Callus Care', 'Relaxation'],
    },
  ];

  const testimonials = [
    {
      name: 'Priya S.',
      review: 'Absolutely stunning work. Elena created the most intricate floral design on my nails — I got compliments for weeks!',
      rating: 5,
      date: 'Aug 2026',
    },
    {
      name: 'Jessica R.',
      review: 'Best gel-X experience I have ever had. Zero lifting after 3 weeks. Mia is a pure genius and such a professional.',
      rating: 5,
      date: 'Jul 2026',
    },
    {
      name: 'Anika M.',
      review: 'The spa pedicure was so relaxing I almost fell asleep! Clean, premium, and the team is so incredibly welcoming.',
      rating: 5,
      date: 'Sep 2026',
    },
  ];

  const whyItems = [
    { Icon: LeafIcon,    label: 'Non-Toxic Products',    sub: 'Eco-friendly & safe' },
    { Icon: ShieldCheck, label: 'Hospital Sterilization', sub: 'Zero cross-contamination' },
    { Icon: Clock,       label: 'Live Queue Tracking',    sub: 'No idle waiting' },
    { Icon: Gem,         label: 'Premium Experience',     sub: 'Luxury from start to finish' },
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Libre+Baskerville:ital,wght@0,400..700;1,400..700&family=Smooch+Sans:wght@100..900&display=swap');

    .nm-home { font-family: 'Josefin Sans', sans-serif; color: #2B1E16; background: #FAF8F5; }

    .nm-animate { opacity: 0; transform: translateY(40px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .nm-animate.nm-d1 { transition-delay: 0.1s; }
    .nm-animate.nm-d2 { transition-delay: 0.2s; }
    .nm-animate.nm-d3 { transition-delay: 0.3s; }
    .nm-animate.nm-d4 { transition-delay: 0.4s; }
    .nm-animate.nm-d5 { transition-delay: 0.5s; }
    .nm-visible { opacity: 1 !important; transform: translateY(0) !important; }

    /* ── Hero ── */
    .nm-hero {
      position: relative; min-height: 100vh;
      display: flex; align-items: center; justify-content: center; overflow: hidden;
      background: linear-gradient(135deg, #1a100a 0%, #2B1E16 50%, #3d2a1e 100%);
    }
    .nm-hero-bg {
      position: absolute; inset: 0;
      background-image: url('https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=2070&auto=format&fit=crop');
      background-size: cover; background-position: center; opacity: 0.35;
      animation: nmHeroZoom 20s ease-in-out infinite alternate;
    }
    @keyframes nmHeroZoom { from { transform: scale(1); } to { transform: scale(1.06); } }
    .nm-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
    .nm-orb1 { width: 450px; height: 450px; background: radial-gradient(circle, rgba(212,149,107,0.28) 0%, transparent 70%); top: -10%; left: -10%; animation: nmFloat 10s ease-in-out infinite; }
    .nm-orb2 { width: 320px; height: 320px; background: radial-gradient(circle, rgba(180,110,70,0.2) 0%, transparent 70%); bottom: 10%; right: -5%; animation: nmFloat 14s ease-in-out infinite reverse; }
    @keyframes nmFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }

    .nm-hero-content { position: relative; z-index: 10; text-align: center; padding: 2rem 1.5rem; max-width: 900px; }

    .nm-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,0.12); backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.22); color: #f5deb3;
      font-family: 'Smooch Sans', sans-serif;
      font-size: 15px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
      padding: 7px 22px; border-radius: 100px; margin-bottom: 1.5rem;
      animation: nmFadeDown 0.8s ease both;
    }
    .nm-hero-title {
      font-family: 'Libre Baskerville', serif;
      font-size: clamp(2.6rem, 6.5vw, 4.8rem); font-weight: 700;
      color: #FAF8F5; line-height: 1.15; margin-bottom: 1.5rem;
      animation: nmFadeUp 0.9s 0.2s ease both;
    }
    .nm-hero-title .nm-accent { color: #d4956b; font-style: italic; }
    .nm-hero-sub {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 1.15rem; color: rgba(250,248,245,0.88); max-width: 580px;
      margin: 0 auto 2.5rem; line-height: 1.75; font-weight: 400;
      animation: nmFadeUp 0.9s 0.4s ease both;
    }
    .nm-hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; animation: nmFadeUp 0.9s 0.6s ease both; }

    .nm-btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      background: linear-gradient(135deg, #d4956b, #b8763e);
      color: #FAF8F5; border: none; padding: 15px 36px; border-radius: 100px;
      font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;
      box-shadow: 0 8px 30px rgba(180,120,60,0.4); letter-spacing: 0.5px; text-decoration: none;
    }
    .nm-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 14px 40px rgba(180,120,60,0.5); }

    /* Stats bar */
    .nm-stats-bar {
      position: absolute; bottom: 0; left: 0; right: 0;
      background: rgba(20,12,8,0.75); backdrop-filter: blur(20px);
      border-top: 1px solid rgba(255,255,255,0.08);
      padding: 22px 32px; display: flex; justify-content: center; gap: 56px; z-index: 10;
      animation: nmFadeUp 1s 0.8s ease both;
    }
    .nm-stat { text-align: center; }
    .nm-stat-num { font-family: 'Libre Baskerville', serif; font-size: 2.1rem; font-weight: 700; color: #d4956b; display: block; line-height: 1; }
    .nm-stat-label { font-family: 'Smooch Sans', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(250,248,245,0.65); margin-top: 4px; display: block; }

    /* Scroll indicator */
    .nm-scroll-ind { position: absolute; bottom: 110px; left: 50%; transform: translateX(-50%); z-index: 10; display: flex; flex-direction: column; align-items: center; gap: 6px; color: rgba(250,248,245,0.45); font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase; animation: nmFadeUp 1s 1s ease both; }
    .nm-scroll-line { width: 1.5px; height: 46px; background: linear-gradient(to bottom, rgba(250,248,245,0.45), transparent); animation: nmScrollAnim 2s ease-in-out infinite; }
    @keyframes nmScrollAnim { 0%,100% { transform: scaleY(1); opacity: 1; } 50% { transform: scaleY(0.5); opacity: 0.3; } }

    /* Why strip */
    .nm-why { background: #2B1E16; padding: 36px 24px; }
    .nm-why-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-around; flex-wrap: wrap; gap: 28px; }
    .nm-why-item { display: flex; align-items: center; gap: 16px; color: #FAF8F5; }
    .nm-why-icon-wrap { width: 46px; height: 46px; border-radius: 12px; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .nm-why-label { font-size: 1.05rem; font-weight: 600; line-height: 1.4; }
    .nm-why-sub { font-size: 0.85rem; opacity: 0.6; margin-top: 3px; line-height: 1.5; }

    /* Sections */
    .nm-sec { padding: 88px 24px; }
    .nm-sec-inner { max-width: 1200px; margin: 0 auto; }
    .nm-sec-bg-warm { background: #F5EFE6; }
    .nm-sec-bg-dark { background: linear-gradient(135deg, #2B1E16, #1a100a); }
    .nm-sec-bg-light { background: #FAF8F5; }

    .nm-tag { display: inline-block; background: #F5EFE6; color: #8B5E3C; font-family: 'Smooch Sans', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 5px 18px; border-radius: 100px; margin-bottom: 16px; }
    .nm-tag-dark { background: rgba(255,255,255,0.08); color: #d4956b; }

    .nm-heading { font-family: 'Libre Baskerville', serif; font-size: clamp(2rem, 3.8vw, 3.2rem); font-weight: 700; color: #2B1E16; line-height: 1.25; margin-bottom: 18px; }
    .nm-heading-light { color: #FAF8F5; }
    .nm-subtext { font-family: 'Josefin Sans', sans-serif; font-size: 1.08rem; color: #6B5344; line-height: 1.8; max-width: 580px; }
    .nm-subtext-light { color: rgba(250,248,245,0.7); }
    .nm-center { text-align: center; }
    .nm-mx-auto { margin-left: auto; margin-right: auto; }

    /* Services grid */
    .nm-svcs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-top: 48px; }
    .nm-svc-card {
      background: #fff; border: 1px solid #EDE5D8; border-radius: 22px; padding: 36px 26px;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative; overflow: hidden;
    }
    .nm-svc-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(212,149,107,0.08), transparent); opacity: 0; transition: opacity 0.3s; }
    .nm-svc-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(43,30,22,0.1); }
    .nm-svc-card:hover::before { opacity: 1; }

    .nm-svc-icon-wrap { width: 54px; height: 54px; border-radius: 16px; background: #F5EFE6; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; transition: all 0.3s ease; }
    .nm-svc-card:hover .nm-svc-icon-wrap { background: #2B1E16; }
    .nm-svc-card:hover .nm-svc-icon-wrap svg { color: #FAF8F5 !important; }

    .nm-svc-title { font-family: 'Libre Baskerville', serif; font-size: 1.4rem; font-weight: 600; color: #2B1E16; margin-bottom: 10px; line-height: 1.3; }
    .nm-svc-desc { font-size: 0.95rem; color: #6B5344; line-height: 1.75; margin-bottom: 20px; }
    .nm-svc-price { font-size: 0.95rem; font-weight: 700; color: #d4956b; letter-spacing: 0.5px; }

    /* Team grid */
    .nm-team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 48px; }
    .nm-team-card { border-radius: 22px; overflow: hidden; background: #fff; border: 1px solid #EDE5D8; transition: all 0.4s ease; }
    .nm-team-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(43,30,22,0.1); }
    .nm-team-imgw { position: relative; height: 280px; overflow: hidden; background: #F5EFE6; }
    .nm-team-imgw img { width: 100%; height: 100%; object-fit: cover; object-position: top; transition: transform 0.6s ease; }
    .nm-team-card:hover .nm-team-imgw img { transform: scale(1.06); }
    .nm-team-badge2 { position: absolute; top: 14px; left: 14px; background: rgba(250,248,245,0.94); backdrop-filter: blur(10px); color: #2B1E16; font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 8px; display: flex; align-items: center; gap: 5px; }
    .nm-team-rating2 { position: absolute; top: 14px; right: 14px; background: #2B1E16; color: #FAF8F5; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 8px; display: flex; align-items: center; gap: 4px; }
    .nm-team-body { padding: 24px; }
    .nm-team-name { font-family: 'Libre Baskerville', serif; font-size: 1.55rem; font-weight: 600; color: #2B1E16; margin-bottom: 5px; line-height: 1.25; }
    .nm-team-role { font-size: 0.92rem; color: #6B5344; margin-bottom: 14px; line-height: 1.5; }
    .nm-team-skills { display: flex; flex-wrap: wrap; gap: 7px; }
    .nm-team-skill { background: #F5EFE6; color: #6B5344; font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 6px; border: 1px solid #EDE5D8; line-height: 1.4; }

    /* Testimonials */
    .nm-test-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 48px; }
    .nm-test-card {
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(12px); border-radius: 20px; padding: 32px;
      transition: all 0.3s ease;
    }
    .nm-test-card:hover { background: rgba(255,255,255,0.08); border-color: rgba(212,149,107,0.3); transform: translateY(-4px); }
    .nm-test-stars { display: flex; gap: 4px; margin-bottom: 16px; }
    .nm-test-text { font-size: 1rem; color: rgba(250,248,245,0.88); line-height: 1.8; margin-bottom: 20px; font-style: italic; }
    .nm-test-author { font-weight: 600; color: #FAF8F5; font-size: 0.98rem; line-height: 1.4; }
    .nm-test-date { font-size: 0.82rem; color: rgba(250,248,245,0.45); margin-top: 3px; }

    /* View button */
    .nm-view-btn {
      display: inline-flex; align-items: center; gap: 8px; margin-top: 44px;
      background: #2B1E16; color: #FAF8F5;
      padding: 15px 38px; border-radius: 100px;
      font-size: 14px; font-weight: 600; border: none; cursor: pointer;
      transition: all 0.3s ease; box-shadow: 0 8px 24px rgba(43,30,22,0.25);
      text-decoration: none; letter-spacing: 0.3px;
    }
    .nm-view-btn:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(43,30,22,0.35); }

    @keyframes nmFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes nmFadeDown { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 640px) {
      .nm-stats-bar { gap: 20px; padding: 18px 12px; flex-wrap: wrap; }
      .nm-sec { padding: 72px 16px; }
      .nm-scroll-ind { display: none; }
    }
  `;

  return (
    <div className="nm-home">
      <style>{css}</style>

      {/* ─── HERO ─── */}
      <section className="nm-hero">
        <div className="nm-hero-bg" />
        <div className="nm-orb nm-orb1" />
        <div className="nm-orb nm-orb2" />

        <div className="nm-hero-content">
          <span className="nm-eyebrow">
            <Sparkles size={13} />
            Premium Nail Studio &amp; Artistry
          </span>
          <h1 className="nm-hero-title">
            Elevate Your<br />
            <span className="nm-accent">Natural Beauty</span>
          </h1>
          <p className="nm-hero-sub">
            Welcome to NailMuse Studio — where luxury meets artistry.
            Explore our services, meet our artists, and read what our clients say.
          </p>
          
        </div>

        {/* Stats bar */}
        <div className="nm-stats-bar">
          {[
            { num: '2K+', label: 'Happy Clients' },
            { num: '5.0', label: 'Average Rating' },
            { num: '12+', label: 'Services' },
            { num: '6+',  label: 'Expert Artists' },
          ].map((s) => (
            <div className="nm-stat" key={s.label}>
              <span className="nm-stat-num">{s.num}</span>
              <span className="nm-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Scroll cue */}
        <div className="nm-scroll-ind">
          <div className="nm-scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ─── WHY US STRIP ─── */}
      <div className="nm-why">
        <div className="nm-why-inner">
          {whyItems.map(({ Icon, label, sub }) => (
            <div className="nm-why-item" key={label}>
              <div className="nm-why-icon-wrap">
                <Icon size={22} color="#d4956b" />
              </div>
              <div>
                <div className="nm-why-label">{label}</div>
                <div className="nm-why-sub">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── SERVICES ─── */}
      <section id="nm-services" className="nm-sec nm-sec-bg-warm">
        <div className="nm-sec-inner">
          <div className="nm-center nm-animate">
            <span className="nm-tag">Our Services</span>
            <h2 className="nm-heading nm-center">Curated Nail Care<br />&amp; Artistry</h2>
            <p className="nm-subtext nm-center nm-mx-auto">
              From classic manicures to bespoke 3D nail art — every treatment
              is designed to leave you feeling utterly pampered.
            </p>
          </div>

          <div className="nm-svcs-grid">
            {services.map(({ Icon, title, desc, price }, i) => (
              <div key={title} className={`nm-svc-card nm-animate nm-d${i + 1}`}>
                <div className="nm-svc-icon-wrap">
                  <Icon size={26} color="#8B5E3C" />
                </div>
                <h3 className="nm-svc-title">{title}</h3>
                <p className="nm-svc-desc">{desc}</p>
                <span className="nm-svc-price">{price}</span>
              </div>
            ))}
          </div>

          <div className="nm-center nm-animate nm-d5">
            <a href="/services" className="nm-view-btn">
              View All Services <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section className="nm-sec nm-sec-bg-light">
        <div className="nm-sec-inner">
          <div className="nm-center nm-animate">
            <span className="nm-tag">Meet the Artists</span>
            <h2 className="nm-heading nm-center">
              Expert Technicians,{' '}
              <em style={{ fontStyle: 'italic', color: '#d4956b' }}>Real Passion</em>
            </h2>
            <p className="nm-subtext nm-center nm-mx-auto">
              Our certified artists bring years of expertise and relentless
              creativity to every single appointment.
            </p>
          </div>

          <div className="nm-team-grid">
            {team.map(({ name, role, BadgeIcon, badge, rating, img, skills }, i) => (
              <div key={name} className={`nm-team-card nm-animate nm-d${i + 1}`}>
                <div className="nm-team-imgw">
                  <img
                    src={img}
                    alt={name}
                    onError={(e) => { e.target.src = 'https://placehold.co/400x285/FAF8F5/2B1E16?text=NailMuse'; }}
                  />
                  <div className="nm-team-badge2">
                    <BadgeIcon size={11} color="#8B5E3C" />
                    {badge}
                  </div>
                  <div className="nm-team-rating2">
                    <Star size={13} color="#d4956b" fill="#d4956b" />
                    {rating}
                  </div>
                </div>
                <div className="nm-team-body">
                  <div className="nm-team-name">{name}</div>
                  <div className="nm-team-role">{role}</div>
                  <div className="nm-team-skills">
                    {skills.map((sk) => (
                      <span key={sk} className="nm-team-skill">{sk}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="nm-sec nm-sec-bg-dark">
        <div className="nm-sec-inner">
          <div className="nm-center nm-animate">
            <span className="nm-tag nm-tag-dark">Client Love</span>
            <h2 className="nm-heading nm-heading-light nm-center">What Our Clients Say</h2>
            <p className="nm-subtext nm-subtext-light nm-center nm-mx-auto">
              Don&apos;t just take our word for it — hear from the people we pamper every day.
            </p>
          </div>

          <div className="nm-test-grid">
            {testimonials.map(({ name, review, rating, date }, i) => (
              <div key={name} className={`nm-test-card nm-animate nm-d${i + 1}`}>
                <div className="nm-test-stars">
                  {Array.from({ length: rating }).map((_, idx) => (
                    <Star key={idx} size={17} color="#d4956b" fill="#d4956b" />
                  ))}
                </div>
                <p className="nm-test-text">&ldquo;{review}&rdquo;</p>
                <div>
                  <div className="nm-test-author">{name}</div>
                  <div className="nm-test-date">{date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;