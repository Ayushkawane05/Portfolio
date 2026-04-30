import { useMemo } from 'react';

interface ExperienceItem {
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

interface ExperienceProps {
  items?: ExperienceItem[];
}

export default function Experience({ items }: ExperienceProps) {
  const experience = useMemo(() => {
    if (items && items.length > 0) return items;
    if (typeof window !== 'undefined' && (window as any).__INITIAL_DATA__) {
      return (window as any).__INITIAL_DATA__.experience;
    }
    return [
      {
        role: 'Product Developer Intern',
        company: 'Darwinbox',
        startDate: 'Jan 2026',
        endDate: 'Present',
        bullets: [
          'Built scalable backend services using Node.js and MongoDB.',
          'Designed CollabScore — an AI evaluation system using LLM prompting.',
          'Architected a multi-stage AI orchestration pipeline.',
          'Optimized RESTful APIs within a microservices architecture.'
        ]
      }
    ];
  }, [items]);

  return (
    <section id="experience" className="py-20 px-6 max-w-4xl mx-auto">
      <h2 className="text-pixel-primary font-pixel text-xl mb-12 flex items-center gap-4">
        <span className="text-2xl">{'>'}</span> WORK_HISTORY
      </h2>

      <div className="space-y-16">
        {experience.map((item: ExperienceItem, index: number) => (
          <div key={index} className="relative pl-12 border-l-2 border-pixel-secondary/20 pb-12">
            {/* Timeline Dot */}
            <div className="absolute -left-[11px] top-0 w-5 h-5 bg-pixel-bg border-2 border-pixel-secondary rounded-sm" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-pixel text-sm text-white uppercase mb-1">
                  {item.role}
                </h3>
                <p className="font-pixel text-[10px] text-pixel-primary uppercase tracking-widest">
                  @ {item.company}
                </p>
              </div>
              <div className="font-pixel text-[8px] text-pixel-muted bg-pixel-bg px-3 py-2 border border-pixel-muted/20">
                {item.startDate} - {item.endDate}
              </div>
            </div>

            <div className="pixel-border p-8 bg-pixel-bg/60 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="font-pixel text-4xl text-pixel-secondary">#0{index + 1}</span>
              </div>
              
              <ul className="space-y-6">
                {item.bullets.map((bullet: string, i: number) => (
                  <li key={i} className="flex gap-4 group/bullet">
                    <span className="text-pixel-secondary font-pixel text-[10px] select-none group-hover/bullet:translate-x-1 transition-transform">{'>'}</span>
                    <p className="font-pixel text-[10px] text-pixel-muted leading-relaxed flex-1 group-hover/bullet:text-white transition-colors">
                      {bullet}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
