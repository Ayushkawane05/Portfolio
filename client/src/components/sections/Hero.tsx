/**
 * Hero section — renders instantly as static HTML.
 * Name in pixel font with CSS flicker animation.
 * Parallax background is CSS-only (three layers).
 * No JS required to display content.
 */
export default function Hero() {
  return (
    <section className="hero-section" id="hero">
      {/* CSS-only parallax background */}
      <div className="parallax-bg" aria-hidden="true">
        <div className="parallax-layer parallax-layer--stars" />
        <div className="parallax-layer parallax-layer--grid" />
        <div className="parallax-layer parallax-layer--vignette" />
      </div>

      {/* Hero content — immediately visible */}
      <div className="hero-content">
        <h1 className="hero-name">
          Ayush Kawane
        </h1>
        <p className="hero-tagline">
          Software Developer • AI/ML Enthusiast
        </p>

        {/* Scroll indicator */}
        <div className="mt-12 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <span className="text-pixel-muted font-pixel text-[0.5rem] tracking-widest uppercase">
            Scroll Down
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-pixel-primary/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
