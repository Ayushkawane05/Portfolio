import { useMemo } from 'react';

interface ContactData {
  email: string;
  linkedin: string;
  github: string;
  location: string;
}

interface ContactProps {
  contact?: ContactData;
}

export default function Contact({ contact }: ContactProps) {
  const data = useMemo(() => {
    if (contact) return contact;
    if (typeof window !== 'undefined' && (window as any).__INITIAL_DATA__) {
      return (window as any).__INITIAL_DATA__.profile?.contact;
    }
    return {
      email: 'ayushkawane05@example.com',
      linkedin: 'https://linkedin.com/in/ayushkawane',
      github: 'https://github.com/ayushkawane',
      location: 'Pune, India'
    };
  }, [contact]);

  return (
    <footer id="contact" className="py-32 px-6 bg-pixel-bg border-t-2 border-pixel-muted/10 relative overflow-hidden">
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.03]" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-pixel-primary font-pixel text-2xl mb-12 animate-pulse">
          SAY_HELLO
        </h2>
        
        <p className="font-pixel text-[10px] text-pixel-muted leading-relaxed mb-12 max-w-xl mx-auto">
          Currently looking for new opportunities and collaborations. 
          The terminal is always open for connections.
        </p>

        <div className="flex flex-wrap justify-center gap-8 mb-20">
          <a href={`mailto:${data.email}`} className="group flex flex-col items-center gap-4">
            <div className="w-12 h-12 pixel-border flex items-center justify-center bg-pixel-bg group-hover:bg-pixel-primary/10 transition-colors">
              <span className="font-pixel text-pixel-primary group-hover:scale-110 transition-transform">@</span>
            </div>
            <span className="font-pixel text-[8px] text-pixel-muted uppercase tracking-widest">Email</span>
          </a>

          <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-4">
            <div className="w-12 h-12 pixel-border flex items-center justify-center bg-pixel-bg group-hover:bg-pixel-primary/10 transition-colors">
              <span className="font-pixel text-pixel-primary group-hover:scale-110 transition-transform">IN</span>
            </div>
            <span className="font-pixel text-[8px] text-pixel-muted uppercase tracking-widest">LinkedIn</span>
          </a>

          <a href={data.github} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-4">
            <div className="w-12 h-12 pixel-border flex items-center justify-center bg-pixel-bg group-hover:bg-pixel-primary/10 transition-colors">
              <span className="font-pixel text-pixel-primary group-hover:scale-110 transition-transform">GH</span>
            </div>
            <span className="font-pixel text-[8px] text-pixel-muted uppercase tracking-widest">Github</span>
          </a>
        </div>

        <div className="pt-20 border-t border-pixel-muted/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-pixel text-[8px] text-pixel-muted uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} AYUSH KAWANE • PIXEL_ART_v1.0
          </div>
          <div className="font-pixel text-[8px] text-pixel-muted uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            SYSTEM_UP_AND_RUNNING
          </div>
        </div>
      </div>
    </footer>
  );
}
