interface Milestone {
  date: string;
  label: string;
  description: string;
}

interface EducationItem {
  institution: string;
  degree: string;
  startYear: number;
  endYear: number | null;
  milestones?: Milestone[];
}

interface Props {
  item: EducationItem | null;
  onClose: () => void;
}

export default function EducationOverlay({ item, onClose }: Props) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-12 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-pixel-bg/95 backdrop-blur-xl" 
        onClick={onClose}
      />
      
      {/* Scanline overlay for detail view */}
      <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.05] z-10"></div>

      <div className="relative z-20 w-full max-w-4xl h-full bg-pixel-bg border-4 border-pixel-primary shadow-[0_0_100px_rgba(0,212,255,0.2)] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b-4 border-pixel-primary flex justify-between items-center bg-pixel-primary/10">
          <div>
            <h2 className="font-pixel text-xs text-pixel-primary uppercase mb-2">Detailed_Log // {item.institution}</h2>
            <p className="font-pixel text-[10px] text-white uppercase">{item.degree}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 border-2 border-pixel-primary flex items-center justify-center text-pixel-primary hover:bg-pixel-primary hover:text-pixel-bg transition-all font-pixel text-xl"
          >
            X
          </button>
        </div>

        {/* Content - The Deep Timeline */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12">
          <div className="max-w-2xl mx-auto">
            <h3 className="font-pixel text-[10px] text-pixel-secondary mb-12 flex items-center gap-4">
              <span className="w-8 h-px bg-pixel-secondary/30"></span>
              ACTIVITY_HISTORY
              <span className="flex-1 h-px bg-pixel-secondary/30"></span>
            </h3>

            {!item.milestones || item.milestones.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-pixel text-[10px] text-pixel-muted animate-pulse">NO_LOGS_FOUND_FOR_THIS_PERIOD</p>
              </div>
            ) : (
              <div className="space-y-12">
                {item.milestones.map((milestone, idx) => (
                  <div key={idx} className="relative pl-12 group">
                    {/* Progress Line */}
                    {idx !== item.milestones!.length - 1 && (
                      <div className="absolute left-[19px] top-8 bottom-[-48px] w-0.5 bg-gradient-to-b from-pixel-primary/50 to-transparent"></div>
                    )}
                    
                    {/* Milestone Point */}
                    <div className="absolute left-0 top-0 w-10 h-10 flex items-center justify-center">
                      <div className="w-2 h-2 bg-pixel-primary rotate-45 group-hover:scale-150 transition-transform"></div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <span className="font-pixel text-[8px] text-pixel-primary border border-pixel-primary/30 px-2 py-1">
                          {milestone.date}
                        </span>
                        <h4 className="font-pixel text-[10px] text-white uppercase tracking-widest">
                          {milestone.label}
                        </h4>
                      </div>
                      <p className="font-pixel text-[10px] text-pixel-muted leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-pixel-muted/10 bg-pixel-bg flex justify-between items-center opacity-50">
          <span className="font-pixel text-[8px] text-pixel-muted tracking-widest">ENCRYPTED_LOG_STREAM_v2.0</span>
          <span className="font-pixel text-[8px] text-pixel-muted uppercase tracking-tighter">[{item.startYear}-{(item as any).endYear || 'PRESENT'}]</span>
        </div>
      </div>
    </div>
  );
}
