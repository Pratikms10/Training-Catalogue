import { featuredClientLogos, type ClientLogo } from './clientLogoData';

const midpoint = Math.ceil(featuredClientLogos.length / 2);
const logoRows = [
  featuredClientLogos.slice(0, midpoint),
  featuredClientLogos.slice(midpoint),
];

function LogoRow({ logos, row }: { logos: ClientLogo[]; row: number }) {
  const cards = (duplicate = false) => logos.map((logo) => (
    <div className="client-logo-card" role={duplicate ? undefined : 'listitem'} key={`${logo.src}-${duplicate ? 'copy' : 'original'}`} title={duplicate ? undefined : logo.name}>
      <img
        src={logo.src}
        alt={duplicate ? '' : `${logo.name} logo`}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
      />
    </div>
  ));

  return (
    <div className="client-logo-viewport">
      <div className={`client-logo-track client-logo-track-${row % 2 === 0 ? 'left' : 'right'}`}>
        <div className="client-logo-group" role="list" aria-label={`Featured client logos, row ${row + 1}`}>
          {cards()}
        </div>
        <div className="client-logo-group" aria-hidden="true">
          {cards(true)}
        </div>
      </div>
    </div>
  );
}

export default function ClientLogosSection() {
  return (
    <section className="clients client-logo-section section" id="about" aria-labelledby="client-logo-heading">
      <div className="client-logo-shell">
        <header className="client-logo-header">
          <span className="eyebrow">TRUSTED BY GLOBAL TEAMS</span>
          <h2 id="client-logo-heading"><em>The Companies Behind</em><br />The Work.</h2>
          <p>One connected network of organisations moving capability forward.</p>
        </header>
        <div className="client-logo-rows">
          {logoRows.map((logos, index) => <LogoRow logos={logos} row={index} key={index} />)}
        </div>
      </div>
    </section>
  );
}
