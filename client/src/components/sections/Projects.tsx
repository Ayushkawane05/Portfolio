import { useMemo } from 'react';

interface ProjectItem {
  title: string;
  description: string;
  thumbnailUrl: string;
  stack: string[];
  githubUrl: string;
  demoUrl: string;
  outcome: string;
}

interface ProjectsProps {
  items?: ProjectItem[];
}

export default function Projects({ items }: ProjectsProps) {
  const projects = useMemo(() => {
    if (items) return items;
    if (typeof window !== 'undefined' && (window as any).__INITIAL_DATA__) {
      return (window as any).__INITIAL_DATA__.projects;
    }
    return [
      {
        title: 'AI Health Chat System',
        description: 'LLM-powered healthcare chatbot with multi-turn context and session memory.',
        thumbnailUrl: '',
        stack: ['LLMs', 'Python', 'NLP'],
        githubUrl: '',
        demoUrl: '',
        outcome: 'Hackathon Finalist'
      },
      {
        title: 'E-Commerce Platform',
        description: 'Full-stack MERN application with JWT and RBAC.',
        thumbnailUrl: '',
        stack: ['MERN', 'Node.js'],
        githubUrl: '',
        demoUrl: '',
        outcome: 'Latency reduced by 40%'
      }
    ];
  }, [items]);

  return (
    <section id="projects" className="py-20 px-6 max-w-6xl mx-auto">
      <h2 className="text-pixel-primary font-pixel text-xl mb-12 flex items-center gap-4">
        <span className="text-2xl">{'>'}</span> PROJECTS
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project: ProjectItem, index: number) => (
          <div key={index} className="flex flex-col h-full bg-pixel-bg/40 border-2 border-pixel-muted/20 hover:border-pixel-primary/50 transition-all group">
            {/* Project Image Placeholder */}
            <div className="aspect-video bg-pixel-primary/5 flex items-center justify-center border-b-2 border-pixel-muted/20 group-hover:bg-pixel-primary/10 transition-colors relative overflow-hidden">
              <span className="font-pixel text-[8px] text-pixel-primary/40 uppercase tracking-[0.2em]">
                {project.title}
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-pixel-bg to-transparent opacity-0 group-hover:opacity-40 transition-opacity" />
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-pixel text-xs text-white mb-3 uppercase group-hover:text-pixel-primary transition-colors">
                {project.title}
              </h3>
              <p className="font-pixel text-[10px] text-pixel-muted leading-relaxed mb-6 flex-1">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.stack.map((tech: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-pixel-primary/10 text-pixel-primary font-pixel text-[8px] border border-pixel-primary/20">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="font-pixel text-[8px] text-pixel-secondary italic">
                  {project.outcome}
                </div>
                <div className="flex gap-4">
                  {project.githubUrl && (
                    <a href={project.githubUrl} className="text-pixel-muted hover:text-pixel-primary transition-colors font-pixel text-[10px]">
                      SRC
                    </a>
                  )}
                  {project.demoUrl && (
                    <a href={project.demoUrl} className="text-pixel-muted hover:text-pixel-primary transition-colors font-pixel text-[10px]">
                      LIVE
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
