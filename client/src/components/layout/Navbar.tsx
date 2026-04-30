import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '#hero' },
    { name: 'ABOUT', href: '#about' },
    { name: 'SKILLS', href: '#skills' },
    { name: 'EXPERIENCE', href: '#experience' },
    { name: 'PROJECTS', href: '#projects' },
    { name: 'CONTACT', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${
      isScrolled ? 'bg-pixel-bg/95 backdrop-blur-md border-b-2 border-pixel-primary/20 py-2' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#hero" className="font-pixel text-pixel-primary text-sm tracking-tighter hover:scale-105 transition-transform">
          AK.SYS <span className="animate-pulse">_</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-pixel text-[10px] text-pixel-muted hover:text-pixel-primary transition-colors tracking-widest"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-pixel-primary hover:bg-pixel-primary/10 transition-colors"
          aria-label="Toggle Menu"
        >
          <div className="space-y-1.5 w-5">
            <div className={`h-0.5 bg-current transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`h-0.5 bg-current transition-all ${isOpen ? 'opacity-0' : ''}`} />
            <div className={`h-0.5 bg-current transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu (The "Drop Down") */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-pixel-bg border-b-2 border-pixel-primary/20 overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="p-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block font-pixel text-xs text-pixel-muted hover:text-pixel-primary transition-colors tracking-widest"
            >
              {'>'} {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
