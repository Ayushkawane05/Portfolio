import { useMemo } from 'react';

interface AchievementItem {
  type: string;
  title: string;
  description: string;
  year: number;
}

interface AchievementsProps {
  items?: AchievementItem[];
}

export default function Achievements({ items }: AchievementsProps) {
  const achievements = useMemo(() => {
    if (items) return items;
    if (typeof window !== 'undefined' && (window as any).__INITIAL_DATA__) {
      return (window as any).__INITIAL_DATA__.achievements;
    }
    return [
      {
        type: 'paper',
        title: 'Smart Urban Management System',
        description: 'IoT-based real-time city monitoring.',
        year: 2025
      },
      {
        type: 'achievement',
        title: 'Patent Filed: Third Eye',
        description: 'Assistive navigation for visually impaired.',
        year: 2024
      }
    ];
  }, [items]);

  return (
    <section id="achievements" className="py-20 px-6 max-w-4xl mx-auto">
      <h2 className="text-pixel-primary font-pixel text-xl mb-12 flex items-center gap-4">
        <span className="text-2xl">{'>'}</span> ACHIEVEMENTS
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {achievements.map((item: AchievementItem, index: number) => (
          <div key={index} className="flex gap-4 p-4 border border-pixel-muted/10 bg-pixel-bg/20 hover:border-pixel-secondary/30 transition-all">
            <div className="flex flex-col items-center">
              <span className="font-pixel text-[10px] text-pixel-secondary mb-1">
                {item.year}
              </span>
              <div className="w-px flex-1 bg-pixel-muted/10" />
            </div>
            
            <div>
              <div className="font-pixel text-[8px] text-pixel-primary uppercase mb-1">
                [{item.type}]
              </div>
              <h3 className="font-pixel text-xs text-white mb-2 uppercase">
                {item.title}
              </h3>
              <p className="font-pixel text-[10px] text-pixel-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
