import { useMemo } from 'react';

interface Skill {
  name: string;
  level: number; // 0-100
  category: string;
}

interface SkillsProps {
  skills?: Skill[];
}

export default function Skills({ skills }: SkillsProps) {
  const data = useMemo<Skill[]>(() => {
    if (skills && skills.length > 0) return skills;
    if (typeof window !== 'undefined' && (window as any).__INITIAL_DATA__) {
      return (window as any).__INITIAL_DATA__.skills || [];
    }
    return [
      { name: 'REACT', level: 90, category: 'FRONTEND' },
      { name: 'NODE.JS', level: 85, category: 'BACKEND' },
      { name: 'MONGODB', level: 80, category: 'BACKEND' },
      { name: 'PYTHON', level: 75, category: 'AI/ML' },
      { name: 'TYPESCRIPT', level: 85, category: 'LANGUAGES' },
      { name: 'DOCKER', level: 60, category: 'DEVOPS' },
    ];
  }, [skills]);

  const categories = Array.from(new Set(data.map((s: Skill) => s.category)));

  return (
    <section id="skills" className="py-20 px-6 max-w-5xl mx-auto">
      <h2 className="text-pixel-primary font-pixel text-xl mb-12 flex items-center gap-4">
        <span className="text-2xl">{'>'}</span> SKILLS_DATABASE
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {categories.map((cat: string) => (
          <div key={cat} className="space-y-6">
            <h3 className="font-pixel text-[10px] text-pixel-secondary mb-4 tracking-[0.3em]">
              // {cat}
            </h3>
            
            <div className="space-y-6">
              {data.filter((s: Skill) => s.category === cat).map((skill: Skill) => (
                <div key={skill.name} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-pixel text-[10px] text-white group-hover:text-pixel-primary transition-colors">
                      {skill.name}
                    </span>
                    <span className="font-pixel text-[8px] text-pixel-muted">
                      {skill.level}%
                    </span>
                  </div>
                  
                  {/* Pixel Progress Bar */}
                  <div className="h-4 bg-pixel-bg border border-pixel-muted/20 p-0.5 flex">
                    <div 
                      className="h-full bg-pixel-primary transition-all duration-1000 ease-out flex"
                      style={{ width: `${skill.level}%` }}
                    >
                      {/* Diagonal stripes overlay for "animated" feel */}
                      <div className="w-full h-full opacity-20 bg-[linear-gradient(45deg,transparent_25%,#000_25%,#000_50%,transparent_50%,transparent_75%,#000_75%)] bg-[size:10px_10px]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
