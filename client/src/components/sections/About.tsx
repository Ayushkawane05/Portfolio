import { useMemo } from 'react';

interface AboutProps {
  bio?: string;
  avatarUrl?: string;
}

export default function About({ bio, avatarUrl }: AboutProps) {
  // Use data from window if available (SSG)
  const data = useMemo(() => {
    if (bio) return { bio, avatarUrl };
    if (typeof window !== 'undefined' && (window as any).__INITIAL_DATA__) {
      return (window as any).__INITIAL_DATA__.profile;
    }
    return { 
      bio: 'B.Tech in AI & Data Science at VIT Pune. Building scalable backend systems and AI-powered applications. Currently a Product Developer Intern at Darwinbox.',
      avatarUrl: ''
    };
  }, [bio, avatarUrl]);

  return (
    <section id="about" className="py-20 px-6 max-w-4xl mx-auto">
      <div className="pixel-border p-8 bg-pixel-bg/80 backdrop-blur-sm">
        <h2 className="text-pixel-primary font-pixel text-xl mb-8 flex items-center gap-4">
          <span className="text-2xl">{'>'}</span> ABOUT_ME
        </h2>
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {data.avatarUrl && (
            <div className="w-32 h-32 pixel-border p-1 bg-pixel-primary/10">
              <img src={data.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="flex-1 font-pixel text-xs leading-relaxed text-pixel-muted">
            <p className="mb-4">
              {data.bio}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 animate-pulse" />
                <span className="text-[10px]">STATUS: HIRING_INTERN_GRAD_2026</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-pixel-primary" />
                <span className="text-[10px]">LOCATION: PUNE, INDIA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
