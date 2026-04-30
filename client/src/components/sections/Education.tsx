import { useMemo } from 'react';

interface EducationItem {
  id?: string;
  institution: string;
  degree: string;
  startYear: number;
  endYear: number | null;
  detail: string;
  category: 'School' | 'College';
  extracurriculars: string[];
  milestones?: { date: string; label: string; description: string }[];
}

interface EducationProps {
  items?: EducationItem[];
  onSelect?: (item: EducationItem) => void;
}

export default function Education({ items, onSelect }: EducationProps) {
  const education = useMemo<EducationItem[]>(() => {
    if (items && items.length > 0) return items;
    if (typeof window !== 'undefined' && (window as any).__INITIAL_DATA__) {
      return (window as any).__INITIAL_DATA__.education;
    }
    return [
      {
        institution: 'Vishwakarma Institute of Technology',
        degree: 'B.Tech in Artificial Intelligence and Data Science',
        startYear: 2022,
        endYear: 2026,
        detail: 'CGPA: 8.51/10.0 • Focus on Machine Learning and Distributed Systems.',
        category: 'College',
        extracurriculars: ['AI Club Lead', 'Hackathon Organizer', 'Robotics Team'],
      }
    ];
  }, [items]);

  return (
    <section id="education" className="py-20 px-6 max-w-4xl mx-auto">
      <h2 className="text-pixel-primary font-pixel text-xl mb-12 flex items-center gap-4">
        <span className="text-2xl">{'>'}</span> ACADEMIC_JOURNEY
      </h2>

      <div className="space-y-16">
        {education.map((item: EducationItem, index: number) => (
          <div 
            key={index} 
            className="relative pl-12 border-l-2 border-pixel-primary/20 pb-8 cursor-pointer group/item hover:border-pixel-primary transition-colors"
            onClick={() => onSelect?.(item)}
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[11px] top-0 w-5 h-5 bg-pixel-bg border-2 border-pixel-primary rounded-sm shadow-[0_0_10px_rgba(0,212,255,0.3)] group-hover/item:scale-125 transition-transform" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <span className="font-pixel text-[8px] text-pixel-secondary bg-pixel-secondary/10 px-2 py-1 uppercase tracking-widest border border-pixel-secondary/20 mb-2 inline-block">
                  {item.category}
                </span>
                <h3 className="font-pixel text-sm text-white uppercase tracking-tight group-hover/item:text-pixel-primary transition-colors">
                  {item.institution}
                </h3>
              </div>
              <div className="font-pixel text-[10px] text-pixel-primary whitespace-nowrap">
                [{item.startYear} - {item.endYear || 'PRESENT'}]
              </div>
            </div>

            <p className="font-pixel text-[10px] text-pixel-secondary mb-4 italic">
              {item.degree}
            </p>

            <div className="pixel-border p-6 bg-pixel-bg/40 border-pixel-muted/10">
              <p className="font-pixel text-[10px] text-pixel-muted leading-relaxed mb-6">
                {item.detail}
              </p>

              {item.extracurriculars && item.extracurriculars.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-pixel text-[8px] text-pixel-primary uppercase tracking-widest">
                    // Extracurricular_Activities
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {item.extracurriculars.map((ec, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-pixel-primary font-bold text-xs">+</span>
                        <span className="font-pixel text-[10px] text-pixel-muted">{ec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
