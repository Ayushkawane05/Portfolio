/**
 * Custom SSG prerender script.
 * 
 * Runs after `vite build` and renders the React app to static HTML.
 * Fetches from /api/content and bakes data into HTML.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');
const indexPath = resolve(distDir, 'index.html');

if (!existsSync(indexPath)) {
  console.error('❌ dist/index.html not found. Run `vite build` first.');
  process.exit(1);
}

async function prerender() {
  console.log('🚀 Starting prerender...');
  
  let html = readFileSync(indexPath, 'utf-8');
  let data;

  try {
    const response = await fetch('http://localhost:3001/api/content');
    if (!response.ok) throw new Error('API down');
    data = await response.json();
    console.log('✅ Fetched data from API');
  } catch (err) {
    console.warn('⚠️  Backend unreachable, using fallback data');
    const fallbackPath = resolve(__dirname, 'content-fallback.json');
    data = JSON.parse(readFileSync(fallbackPath, 'utf-8'));
  }

  // 1. Inject initial data script
  const dataScript = `<script>window.__INITIAL_DATA__ = ${JSON.stringify(data)};</script>`;
  html = html.replace('</head>', `  ${dataScript}\n</head>`);

  // 2. Generate static HTML sections
  // This matches the output of our React components exactly
  const staticContent = `
    <nav class="fixed top-0 left-0 w-full z-[1000] bg-transparent py-6">
      <div class="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div class="font-pixel text-pixel-primary text-sm tracking-tighter">AK.SYS _</div>
        <div class="hidden md:flex gap-8">
          <span class="font-pixel text-[10px] text-pixel-muted uppercase tracking-widest">Home</span>
          <span class="font-pixel text-[10px] text-pixel-muted uppercase tracking-widest">About</span>
          <span class="font-pixel text-[10px] text-pixel-muted uppercase tracking-widest">Skills</span>
          <span class="font-pixel text-[10px] text-pixel-muted uppercase tracking-widest">Projects</span>
        </div>
      </div>
    </nav>
    <main>
      <section class="hero-section" id="hero">
        <div class="parallax-bg" aria-hidden="true">
          <div class="parallax-layer parallax-layer--stars"></div>
          <div class="parallax-layer parallax-layer--grid"></div>
          <div class="parallax-layer parallax-layer--vignette"></div>
        </div>
        <div class="hero-content">
          <h1 class="hero-name">${data.profile.name}</h1>
          <p class="hero-tagline">${data.profile.tagline}</p>
          <div class="mt-12 flex flex-col items-center gap-2 animate-fade-in" style="animation-delay:0.5s;animation-fill-mode:both">
            <span class="text-pixel-muted font-pixel text-[0.5rem] tracking-widest uppercase">Scroll Down</span>
            <div class="w-px h-8 bg-gradient-to-b from-pixel-primary/50 to-transparent"></div>
          </div>
        </div>
      </section>

      <section id="about" class="py-20 px-6 max-w-4xl mx-auto">
        <div class="pixel-border p-8 bg-pixel-bg/80 backdrop-blur-sm">
          <h2 class="text-pixel-primary font-pixel text-xl mb-8 flex items-center gap-4">
            <span class="text-2xl">></span> ABOUT_ME
          </h2>
          <div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div class="flex-1 font-pixel text-xs leading-relaxed text-pixel-muted">
              <p class="mb-4">${data.profile.bio}</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div class="flex items-center gap-3">
                  <span class="w-2 h-2 bg-green-500 animate-pulse"></span>
                  <span class="text-[10px]">STATUS: HIRING_INTERN_GRAD_2026</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="w-2 h-2 bg-pixel-primary"></span>
                  <span class="text-[10px]">LOCATION: ${data.profile.contact.location.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" class="py-20 px-6 max-w-5xl mx-auto">
        <h2 class="text-pixel-primary font-pixel text-xl mb-12 flex items-center gap-4">
          <span class="text-2xl">></span> SKILLS_DATABASE
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          ${Array.from(new Set(data.skills.map(s => s.category))).map(cat => `
            <div class="space-y-6">
              <h3 class="font-pixel text-[10px] text-pixel-secondary mb-4 tracking-[0.3em]">// ${cat}</h3>
              <div class="space-y-6">
                ${data.skills.filter(s => s.category === cat).map(skill => `
                  <div class="group">
                    <div class="flex justify-between items-end mb-2">
                      <span class="font-pixel text-[10px] text-white">${skill.name}</span>
                      <span class="font-pixel text-[8px] text-pixel-muted">${skill.level}%</span>
                    </div>
                    <div class="h-4 bg-pixel-bg border border-pixel-muted/20 p-0.5 flex">
                      <div class="h-full bg-pixel-primary" style="width: ${skill.level}%"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <section id="education" class="py-20 px-6 max-w-4xl mx-auto">
        <h2 class="text-pixel-primary font-pixel text-xl mb-12 flex items-center gap-4">
          <span class="text-2xl">></span> ACADEMIC_JOURNEY
        </h2>
        <div class="space-y-16">
          ${data.education.map(item => `
            <div class="relative pl-12 border-l-2 border-pixel-primary/20 pb-8">
              <div class="absolute -left-[11px] top-0 w-5 h-5 bg-pixel-bg border-2 border-pixel-primary rounded-sm shadow-[0_0_10px_rgba(0,212,255,0.3)]"></div>
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <span class="font-pixel text-[8px] text-pixel-secondary bg-pixel-secondary/10 px-2 py-1 uppercase tracking-widest border border-pixel-secondary/20 mb-2 inline-block">
                    ${item.category}
                  </span>
                  <h3 class="font-pixel text-sm text-white uppercase tracking-tight">${item.institution}</h3>
                </div>
                <div class="font-pixel text-[10px] text-pixel-primary whitespace-nowrap">
                  [${item.startYear} - ${item.endYear || 'PRESENT'}]
                </div>
              </div>
              <p class="font-pixel text-[10px] text-pixel-secondary mb-4 italic">${item.degree}</p>
              <div class="pixel-border p-6 bg-pixel-bg/40 border-pixel-muted/10">
                <p class="font-pixel text-[10px] text-pixel-muted leading-relaxed mb-6">${item.detail}</p>
                ${item.extracurriculars && item.extracurriculars.length > 0 ? `
                  <div class="space-y-4">
                    <h4 class="font-pixel text-[8px] text-pixel-primary uppercase tracking-widest">// Extracurricular_Activities</h4>
                    <div class="flex flex-wrap gap-4">
                      ${item.extracurriculars.map(ec => `
                        <div class="flex items-center gap-2">
                          <span class="text-pixel-primary font-bold text-xs">+</span>
                          <span class="font-pixel text-[10px] text-pixel-muted">${ec}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <section id="experience" class="py-20 px-6 max-w-4xl mx-auto">
        <h2 class="text-pixel-primary font-pixel text-xl mb-12 flex items-center gap-4">
          <span class="text-2xl">></span> EXPERIENCE
        </h2>
        <div class="space-y-16">
          ${data.experience.map(item => `
            <div class="pixel-border p-6 bg-pixel-bg/40">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 class="font-pixel text-sm text-white mb-1 uppercase">${item.role}</h3>
                  <p class="font-pixel text-[10px] text-pixel-primary uppercase">${item.company}</p>
                </div>
                <div class="font-pixel text-[10px] text-pixel-muted bg-pixel-bg px-3 py-1 border border-pixel-muted/20">
                  ${item.startDate} - ${item.endDate}
                </div>
              </div>
              <ul class="space-y-4">
                ${item.bullets.map(bullet => `
                  <li class="flex gap-4 group">
                    <span class="text-pixel-primary font-pixel text-[10px] select-none">></span>
                    <p class="font-pixel text-[10px] text-pixel-muted leading-relaxed flex-1">${bullet}</p>
                  </li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </section>

      <section id="projects" class="py-20 px-6 max-w-6xl mx-auto">
        <h2 class="text-pixel-primary font-pixel text-xl mb-12 flex items-center gap-4">
          <span class="text-2xl">></span> PROJECTS
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${data.projects.map(project => `
            <div class="flex flex-col h-full bg-pixel-bg/40 border-2 border-pixel-muted/20">
              <div class="aspect-video bg-pixel-primary/5 flex items-center justify-center border-b-2 border-pixel-muted/20 relative overflow-hidden">
                <span class="font-pixel text-[8px] text-pixel-primary/40 uppercase tracking-[0.2em]">${project.title}</span>
              </div>
              <div class="p-6 flex-1 flex flex-col">
                <h3 class="font-pixel text-xs text-white mb-3 uppercase">${project.title}</h3>
                <p class="font-pixel text-[10px] text-pixel-muted leading-relaxed mb-6 flex-1">${project.description}</p>
                <div class="flex flex-wrap gap-2 mb-6">
                  ${project.stack.map(tech => `
                    <span class="px-2 py-1 bg-pixel-primary/10 text-pixel-primary font-pixel text-[8px] border border-pixel-primary/20">${tech}</span>
                  `).join('')}
                </div>
                <div class="flex items-center justify-between mt-auto">
                  <div class="font-pixel text-[8px] text-pixel-secondary italic">${project.outcome}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <footer id="contact" class="py-32 px-6 bg-pixel-bg border-t-2 border-pixel-muted/10 relative overflow-hidden">
        <div class="absolute inset-0 pointer-events-none bg-scanline opacity-[0.03]"></div>
        <div class="max-w-4xl mx-auto text-center relative z-10">
          <h2 class="text-pixel-primary font-pixel text-2xl mb-12">SAY_HELLO</h2>
          <p class="font-pixel text-[10px] text-pixel-muted leading-relaxed mb-12 max-w-xl mx-auto">
            Currently looking for new opportunities and collaborations.
          </p>
          <div class="flex flex-wrap justify-center gap-8 mb-20">
            <div class="group flex flex-col items-center gap-4">
              <div class="w-12 h-12 pixel-border flex items-center justify-center bg-pixel-bg"><span class="font-pixel text-pixel-primary">@</span></div>
              <span class="font-pixel text-[8px] text-pixel-muted uppercase tracking-widest">Email</span>
            </div>
            <div class="group flex flex-col items-center gap-4">
              <div class="w-12 h-12 pixel-border flex items-center justify-center bg-pixel-bg"><span class="font-pixel text-pixel-primary">IN</span></div>
              <span class="font-pixel text-[8px] text-pixel-muted uppercase tracking-widest">LinkedIn</span>
            </div>
            <div class="group flex flex-col items-center gap-4">
              <div class="w-12 h-12 pixel-border flex items-center justify-center bg-pixel-bg"><span class="font-pixel text-pixel-primary">GH</span></div>
              <span class="font-pixel text-[8px] text-pixel-muted uppercase tracking-widest">Github</span>
            </div>
          </div>
          <div class="pt-20 border-t border-pixel-muted/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div class="font-pixel text-[8px] text-pixel-muted uppercase tracking-[0.2em]">© ${new Date().getFullYear()} AYUSH KAWANE • PIXEL_ART_v1.0</div>
            <div class="font-pixel text-[8px] text-pixel-muted uppercase tracking-[0.2em] flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> SYSTEM_UP_AND_RUNNING
            </div>
          </div>
        </div>
      </footer>
    </main>
  `;

  // Replace the entire root content with the static content
  // We use a more robust replacement to avoid greedy regex issues with nested divs
  const rootPrefix = '<div id="root">';
  const rootSuffix = '</div>';
  const bodySuffix = '</body>';
  
  const parts = html.split(rootPrefix);
  const beforeRoot = parts[0];
  const rest = parts[1];
  
  const afterRoot = rest.substring(rest.lastIndexOf(rootSuffix) + rootSuffix.length);
  // Note: lastIndexOf(rootSuffix) is risky if there are multiple root-level divs, 
  // but in our Vite build, #root is the only child of body besides scripts in head.
  // Actually, the most reliable way is to find the LAST </div> before </body>.
  
  const bodyParts = html.split(bodySuffix);
  const contentBeforeBodyEnd = bodyParts[0];
  const contentAfterBodyEnd = bodyParts[1];
  
  const rootContentStart = contentBeforeBodyEnd.indexOf(rootPrefix) + rootPrefix.length;
  const rootContentEnd = contentBeforeBodyEnd.lastIndexOf(rootSuffix);
  
  html = contentBeforeBodyEnd.substring(0, rootContentStart) + 
         staticContent + 
         contentBeforeBodyEnd.substring(rootContentEnd) + 
         bodySuffix + 
         contentAfterBodyEnd;

  // Ensure proper cache headers comment
  const cacheHint = '<!-- Cache-Control: public, max-age=60, stale-while-revalidate=600 -->';
  if (!html.includes(cacheHint)) {
    html = html.replace('</head>', `  ${cacheHint}\n</head>`);
  }

  // Write back
  writeFileSync(indexPath, html, 'utf-8');

  console.log('✅ Prerender complete. Static HTML written to dist/index.html');

  // Report file size
  const sizeBytes = Buffer.byteLength(html, 'utf-8');
  const sizeKB = (sizeBytes / 1024).toFixed(2);
  console.log(`📦 HTML size: ${sizeKB} KB (raw)`);
}

prerender().catch(err => {
  console.error('❌ Prerender failed:', err);
  process.exit(1);
});
