import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ArrowUp, Menu, X } from 'lucide-react';
import { motion } from 'motion/react';
import { mountCorporateInteractions } from './interactions';
import TEAI360Section from './TEAI360Section';
import ServicesShowcase from './ServicesShowcase';
import HomeInsightsSection from './HomeInsightsSection';
import ClientLogosSection from './ClientLogosSection';
import ContactSection from './ContactSection';

function CorporateHome() {
  useEffect(() => mountCorporateInteractions(), []);

  return (
    <div id="corporate-site">

  <div id="top" aria-hidden="true"></div>
  <a className="skip-link" href="#main">Skip to content</a>
  <header className="site-header">
    <a className="brand" href="/website/" aria-label="TechnoEdge home"><img src="/website/assets/technoedge-logo.png" alt="TechnoEdge Learning Services" /></a>
    <button className="menu-toggle" aria-expanded="false" aria-controls="primary-nav"><Menu className="menu-open-icon" size={28} aria-hidden="true" /><X className="menu-close-icon" size={28} aria-hidden="true" /><span className="sr-only">Menu</span></button>
    <nav id="primary-nav" className="primary-nav" aria-label="Primary navigation">
      <a href="/website/" aria-current="page">Home</a>
      <a href="/e-learning/">E-Learning</a>
      <a href="/catalogue">Catalogue</a>
      <a href="/insights">Insights</a>
      <a href="/careers">Careers</a>
    </nav>
    <div className="header-actions">
      <a className="btn btn-solid" href="#ai-journey">AI Capability Journey</a>
      <a className="btn btn-outline" href="#contact">Talk To Us</a>
    </div>
  </header>

  <main id="main">
    <section className="hero">
      <motion.div className="hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: 'easeOut' }}>
        <span className="hero-kicker">LEARN &nbsp;•&nbsp; UPSKILL &nbsp;•&nbsp; TRANSFORM</span>
        <h1>Build workforce capability.<br /><span>Unlock AI-powered productivity.</span></h1>
        <p>Corporate training, e-learning and practical AI solutions that help teams learn faster, redesign work and deliver measurable outcomes.</p>
        <div className="hero-actions"><a className="btn btn-solid hero-button" href="#services">Explore Our Services <span>›</span></a><a className="btn btn-outline hero-button" href="#ai-journey">Explore the AI Journey</a></div>
      </motion.div>
    </section>

    <ClientLogosSection />

    <section className="impact" aria-labelledby="impact-title" data-active="0">
      <div className="impact-shell">
        <div className="impact-space" aria-hidden="true">
          <span className="impact-grid-plane"></span>
          <span className="impact-space-ring ring-one"></span>
          <span className="impact-space-ring ring-two"></span>
          <span className="impact-space-ring ring-three"></span>
          <span className="impact-energy-core"></span>
          <span className="impact-scan"></span>
        </div>
        <header className="impact-intro">
          <span className="eyebrow">IMPACT AT SCALE</span>
          <h2 id="impact-title">Built through experience.<br />Proven through scale.</h2>
          <p>Four measures of the capability we build with teams worldwide.</p>
          <span className="impact-mode"><i></i> Scroll to navigate the capability field</span>
          <div className="impact-progress" aria-hidden="true">
            <span className="impact-progress-line"><i></i></span>
            <strong className="impact-step">01</strong><span>/ 04</span>
          </div>
        </header>

        <div className="impact-grid" aria-label="Company metrics">
          <article className="impact-card impact-card-navy is-active" style={{ '--card-index': '0' } as React.CSSProperties}>
            <div className="impact-art impact-orbit" aria-hidden="true"><span></span><i></i></div>
            <div className="impact-card-copy">
              <span className="impact-card-index">01 / GLOBAL REACH</span>
              <div className="impact-value"><strong data-count="200">0</strong><span>+</span></div>
              <p>Clients Globally</p>
              <small>Trusted across enterprise learning engagements worldwide.</small>
            </div>
          </article>

          <article className="impact-card impact-card-blue is-upcoming" style={{ '--card-index': '1' } as React.CSSProperties}>
            <div className="impact-art impact-fold" aria-hidden="true"><span></span><i></i></div>
            <div className="impact-card-copy">
              <span className="impact-card-index">02 / DELIVERY</span>
              <div className="impact-value"><strong data-count="3500">0</strong><span>+</span></div>
              <p>Training Hours Delivered</p>
              <small>Instructor-led programs delivered across critical technologies.</small>
            </div>
          </article>

          <article className="impact-card impact-card-periwinkle is-upcoming" style={{ '--card-index': '2' } as React.CSSProperties}>
            <div className="impact-art impact-waves" aria-hidden="true"><span></span><i></i><b></b></div>
            <div className="impact-card-copy">
              <span className="impact-card-index">03 / CURRICULUM</span>
              <div className="impact-value"><strong data-count="3000">0</strong><span>+</span></div>
              <p>Courses Supported</p>
              <small>Curricula mapped to roles, platforms and business outcomes.</small>
            </div>
          </article>

          <article className="impact-card impact-card-light is-upcoming" style={{ '--card-index': '3' } as React.CSSProperties}>
            <div className="impact-art impact-arc" aria-hidden="true"><span></span><i></i></div>
            <div className="impact-card-copy">
              <span className="impact-card-index">04 / CONTENT</span>
              <div className="impact-value"><strong data-count="1500">0</strong><span>+</span></div>
              <p>Content Hours Developed</p>
              <small>Learning assets designed for repeatable capability building.</small>
            </div>
          </article>
        </div>
      </div>
    </section>

    <ServicesShowcase />

    <TEAI360Section />

    <section className="why why-unified section" aria-labelledby="why-heading">
      <header className="why-unified-intro">
        <div><span className="eyebrow">WHY TECHNOEDGE</span><h2 id="why-heading">Built to teach.<br /><em>Recognised to deliver.</em></h2></div>
        <p>Five years of helping teams turn learning into practical capability—through expert-led training, digital experiences and AI-enabled solutions.</p>
      </header>
      <div className="why-unified-showcase" aria-label="TechnoEdge partnerships, recognition and experience">
        <figure className="why-proof-card why-proof-microsoft">
          <span className="why-proof-label">TRAINING PARTNERSHIP</span>
          <div className="why-proof-logo"><img src="/website/assets/partnerships/microsoft-training-partner.gif" alt="Microsoft in Education Global Training Partner badge" loading="lazy" decoding="async" /></div>
          <figcaption>Microsoft Global Training Partner</figcaption>
        </figure>
        <figure className="why-proof-card why-proof-dpiit">
          <span className="why-proof-label">STARTUP INDIA RECOGNITION</span>
          <div className="why-proof-logo"><img src="/website/assets/partnerships/dpiit-startup-india.png" alt="DPIIT Startup India logo" loading="lazy" decoding="async" /></div>
          <figcaption>DPIIT · Startup India</figcaption>
        </figure>
        <figure className="why-proof-card why-proof-skilling">
          <span className="why-proof-label">MICROSOFT SKILLING PARTNERSHIP</span>
          <div className="why-proof-logo"><img src="/website/assets/partnerships/microsoft-training-skilling-partner-badge.png" alt="Microsoft Training Skilling Partner badge" loading="lazy" decoding="async" /></div>
          <figcaption>Microsoft Training Skilling Partner</figcaption>
        </figure>
      </div>
      <div className="why-unified-values" aria-label="How we work">
        <p><strong>Expert-led</strong><span>Programs matched to your teams and technology.</span></p>
        <p><strong>Practice-driven</strong><span>Hands-on learning that reveals real readiness.</span></p>
        <p><strong>Beyond training</strong><span>Support for adoption and implementation.</span></p>
      </div>
    </section>

    <HomeInsightsSection />

    <section className="media-universe" id="testimonials" aria-labelledby="media-universe-title">
      <div className="media-pin">
        <header className="media-universe-intro">
          <span>INSIDE THE EXPERIENCE</span>
          <h2 id="media-universe-title">Real moments.<br />Real impact.</h2>
          <p>Real classrooms, learner voices, and recognition. Select a moment to explore.</p>
        </header>

        <div className="media-field">
          <div className="media-world">
            <figure className="media-node media-photo" data-focus="0.06" data-x="390" data-y="310" data-zoom="1.06" style={{ '--wx': '390px', '--wy': '310px', '--node-width': '520px', '--depth': '-60px' } as React.CSSProperties}>
              <img src="/website/assets/training-media/training-auditorium-wide.jpeg" alt="Large audience attending an artificial intelligence learning forum" loading="lazy" />
              <figcaption>Learning at scale</figcaption>
            </figure>

            <blockquote className="media-node media-quote" data-focus="0.12" data-x="920" data-y="245" data-zoom="1.28" style={{ '--wx': '920px', '--wy': '245px', '--node-width': '380px', '--depth': '35px' } as React.CSSProperties}>
              <span>LEARNER VOICE</span><p>“Focus on real-world examples and the underlying concepts was beautiful.”</p><footer>Mahendra Pratap Singh</footer>
            </blockquote>

            <figure className="media-node media-photo" data-focus="0.18" data-x="1510" data-y="290" data-zoom="1.02" style={{ '--wx': '1510px', '--wy': '290px', '--node-width': '560px', '--depth': '-20px' } as React.CSSProperties}>
              <img src="/website/assets/training-media/training-classroom-intro.jpeg" alt="Instructor addressing learners in a corporate classroom" loading="lazy" />
              <figcaption>Instructor-led capability building</figcaption>
            </figure>

            <figure className="media-node media-photo media-tall" data-focus="0.24" data-x="2070" data-y="420" data-zoom="1.12" style={{ '--wx': '2070px', '--wy': '420px', '--node-width': '430px', '--depth': '50px' } as React.CSSProperties}>
              <img src="/website/assets/training-media/training-team-campus.jpeg" alt="Training cohort gathered after a learning session" loading="lazy" />
              <figcaption>Learning communities</figcaption>
            </figure>

            <blockquote className="media-node media-quote media-quote-blue" data-focus="0.30" data-x="1900" data-y="840" data-zoom="1.26" style={{ '--wx': '1900px', '--wy': '840px', '--node-width': '400px', '--depth': '15px' } as React.CSSProperties}>
              <span>FROM THE ROOM</span><p>“Superb presentation with lots of practical knowledge given to us.”</p><footer>Praful Mehta</footer>
            </blockquote>

            <figure className="media-node media-photo" data-focus="0.36" data-x="1420" data-y="1070" data-zoom="1.04" style={{ '--wx': '1420px', '--wy': '1070px', '--node-width': '560px', '--depth': '-45px' } as React.CSSProperties}>
              <img src="/website/assets/training-media/training-ai-lab.jpeg" alt="Learners participating in a hands-on artificial intelligence lab" loading="lazy" />
              <figcaption>Applied AI in the room</figcaption>
            </figure>

            <figure className="media-node media-photo media-tall" data-focus="0.42" data-x="860" data-y="1160" data-zoom="1.22" style={{ '--wx': '860px', '--wy': '1160px', '--node-width': '360px', '--depth': '70px' } as React.CSSProperties}>
              <img src="/website/assets/training-media/training-auditorium-selfie.jpeg" alt="Trainers and a large auditorium audience after a session" loading="lazy" />
              <figcaption>A room full of learning</figcaption>
            </figure>

            <figure className="media-node media-photo" data-focus="0.48" data-x="340" data-y="990" data-zoom="1.08" style={{ '--wx': '340px', '--wy': '990px', '--node-width': '500px', '--depth': '-10px' } as React.CSSProperties}>
              <img src="/website/assets/training-media/training-team-global.jpeg" alt="International learning team gathered after a workshop" loading="lazy" />
              <figcaption>Global teams, shared progress</figcaption>
            </figure>

            <blockquote className="media-node media-quote" data-focus="0.54" data-x="310" data-y="610" data-zoom="1.3" style={{ '--wx': '310px', '--wy': '610px', '--node-width': '390px', '--depth': '55px' } as React.CSSProperties}>
              <span>LEARNER VOICE</span><p>“Excellent and interactive. Real-world examples made everything easy to understand.”</p><footer>Harsh Langade</footer>
            </blockquote>

            <figure className="media-node media-photo" data-focus="0.60" data-x="820" data-y="690" data-zoom="1.02" style={{ '--wx': '820px', '--wy': '690px', '--node-width': '570px', '--depth': '-65px' } as React.CSSProperties}>
              <img src="/website/assets/training-media/training-classroom-session.jpeg" alt="Corporate learners attending a practical data storytelling session" loading="lazy" />
              <figcaption>Practice in progress</figcaption>
            </figure>

            <figure className="media-node media-photo" data-focus="0.66" data-x="1320" data-y="600" data-zoom="1.08" style={{ '--wx': '1320px', '--wy': '600px', '--node-width': '500px', '--depth': '25px' } as React.CSSProperties}>
              <img src="/website/assets/training-media/training-team-corporate.jpeg" alt="Corporate training cohort celebrating completion" loading="lazy" />
              <figcaption>Capability unlocked together</figcaption>
            </figure>

            <figure className="media-node media-photo" data-focus="0.72" data-x="1780" data-y="590" data-zoom="1.1" style={{ '--wx': '1780px', '--wy': '590px', '--node-width': '470px', '--depth': '-25px' } as React.CSSProperties}>
              <img src="/website/assets/training-media/training-team-workshop.jpeg" alt="Corporate workshop participants celebrating their learning" loading="lazy" />
              <figcaption>Workshop completion</figcaption>
            </figure>

            <figure className="media-node media-photo" data-focus="0.78" data-x="2100" data-y="1080" data-zoom="1.02" style={{ '--wx': '2100px', '--wy': '1080px', '--node-width': '520px', '--depth': '35px' } as React.CSSProperties}>
              <img src="/website/assets/training-media/training-bloom-session.jpeg" alt="Facilitator leading a technology training session" loading="lazy" />
              <figcaption>Learning designed for work</figcaption>
            </figure>

            <figure className="media-node media-photo" data-focus="0.85" data-x="1510" data-y="1370" data-zoom="1.05" style={{ '--wx': '1510px', '--wy': '1370px', '--node-width': '540px', '--depth': '-40px' } as React.CSSProperties}>
              <img src="/website/assets/training-media/training-interactive-room.jpeg" alt="Interactive classroom with learners engaged around shared tables" loading="lazy" />
              <figcaption>Participation over presentation</figcaption>
            </figure>

            <figure className="media-node media-photo" data-focus="0.92" data-x="690" data-y="1370" data-zoom="1.04" style={{ '--wx': '690px', '--wy': '1370px', '--node-width': '560px', '--depth': '30px' } as React.CSSProperties}>
              <img src="/website/assets/training-media/training-enterprise-team.jpeg" alt="Enterprise learning community gathered after training" loading="lazy" />
              <figcaption>Real people. Real capability.</figcaption>
            </figure>

            <figure className="media-node media-photo media-recognition" style={{ '--node-width': '350px' } as React.CSSProperties}>
              <img src="/website/assets/training-media/recognition-youtube-silver.jpg" alt="YouTube Silver Creator Award presented to Pavan Lalwani for 100,000 subscribers" loading="lazy" />
              <figcaption>Pavan Lalwani’s 100K creator milestone</figcaption>
            </figure>

            <figure className="media-node media-photo media-recognition" style={{ '--node-width': '390px' } as React.CSSProperties}>
              <img src="/website/assets/training-media/recognition-mit-memento.jpg" alt="Military Institute of Technology commemorative memento" loading="lazy" />
              <figcaption>Military Institute of Technology memento</figcaption>
            </figure>

            <figure className="media-node media-photo media-recognition" style={{ '--node-width': '360px' } as React.CSSProperties}>
              <img src="/website/assets/training-media/recognition-smsos-2025.jpg" alt="SMSOS Conference 2025 commemorative memento" loading="lazy" />
              <figcaption>SMSOS Conference 2025</figcaption>
            </figure>

            <figure className="media-node media-photo media-recognition" style={{ '--node-width': '340px' } as React.CSSProperties}>
              <img src="/website/assets/training-media/recognition-youtube-letter.jpg" alt="Letter from YouTube marking Pavan Lalwani’s 100,000-subscriber milestone" loading="lazy" />
              <figcaption>Letter marking the creator milestone</figcaption>
            </figure>

            <figure className="media-node media-photo media-recognition" style={{ '--node-width': '350px' } as React.CSSProperties}>
              <img src="/website/assets/training-media/recognition-mit-letter.jpg" alt="Framed appreciation letter from Military Institute of Technology for a TechnoEdge skill-development course" loading="lazy" />
              <figcaption>Appreciation from Military Institute of Technology</figcaption>
            </figure>
          </div>
        </div>

        <div className="media-universe-hud" aria-hidden="true">
          <span>SCROLL TO EXPLORE <small>SELECT A MOMENT TO VIEW</small></span>
          <i><b></b></i>
          <strong><span data-media-chapter>01 / 05</span> TRAINING MOMENTS</strong>
        </div>
      </div>

      <dialog className="media-lightbox" aria-label="Training moments gallery">
        <button className="media-lightbox-close" type="button" aria-label="Close training moment"><X size={24} aria-hidden="true" /></button>
        <div className="media-lightbox-visual">
          <img alt="" hidden />
          <blockquote hidden><span></span><p></p><footer></footer></blockquote>
        </div>
        <div className="media-lightbox-details">
          <span className="media-lightbox-eyebrow">INSIDE THE EXPERIENCE</span>
          <h3></h3>
          <p>Real moments from TechnoEdge learning and recognition.</p>
          <div className="media-lightbox-controls">
            <button type="button" data-media-previous aria-label="Previous moment">←</button>
            <span data-media-count>01 / 20</span>
            <button type="button" data-media-next aria-label="Next moment">→</button>
          </div>
        </div>
      </dialog>
    </section>

    <ContactSection />
  </main>

  <footer className="site-footer" id="careers">
    <div><img src="/website/assets/technoedge-logo.png" alt="TechnoEdge" /><p>Your workforce capability development partner for training, e-learning and responsible AI transformation.</p></div>
    <div><strong>Services</strong><a href="#services">Corporate Training</a><a href="/e-learning/">E-Learning</a><a href="#services">AI &amp; Automation</a><a href="#services">Content &amp; Language</a></div>
    <div><strong>Company</strong><a href="#about">About Us</a><a href="/insights">Insights</a><a href="/careers">Careers</a><a href="#contact">Contact</a></div>
    <div><strong>Connect</strong><a href="https://www.linkedin.com/company/technoedge-learning-services-india-pvt-ltd/home/" target="_blank" rel="noopener">LinkedIn</a><a href="tel:+917400068614">+91 74000 68614</a><a href="#contact">Talk to our team</a></div>
    <p className="copyright">© 2026 TechnoEdge Learning Services. All rights reserved.</p>
  </footer>

  <div className="ai-contact">
    <div className="contact-choices" id="contact-choices"><a href="https://wa.me/917400068614" target="_blank" rel="noopener"><b>Chat with us</b><span>Start a WhatsApp conversation</span></a><a href="tel:+917400068614"><b>Call our team</b><span>+91 74000 68614</span></a></div>
    <button className="ai-bot-button" aria-expanded="false" aria-controls="contact-choices"><img src="/website/assets/contact-host.png" alt="A welcoming TechnoEdge host—open contact options" /><span>Talk to us</span></button>
  </div>
  <a className="back-top" href="#top" aria-label="Back to top"><ArrowUp size={20} aria-hidden="true" /></a>
  

    </div>
  );
}

export default function App() {
  return <Routes><Route path="/" element={<CorporateHome />} /></Routes>;
}
