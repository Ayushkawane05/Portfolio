import { useState, useEffect } from 'react';

type Section = 'profile' | 'skills' | 'education' | 'experience' | 'projects' | 'analytics';

export default function Admin() {
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all content for editing
      const res = await fetch(`${apiUrl}/api/content`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/api/admin/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.profile),
      });
      if (res.ok) setMessage('Profile Updated!');
      else setMessage('Update failed');
    } catch (err) {
      setMessage('Network error');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const newSkill = {
      name: formData.get('name'),
      level: Number(formData.get('level')),
      category: formData.get('category'),
    };

    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/api/admin/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkill),
      });
      if (res.ok) {
        setMessage('Skill Added!');
        fetchData();
        form.reset();
      }
    } catch (err) {
      setMessage('Error adding skill');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`${apiUrl}/api/admin/skills/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pixel-bg flex items-center justify-center font-pixel">
        <div className="text-pixel-primary animate-pulse text-xs">INITIALIZING_DASHBOARD...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pixel-bg text-pixel-text font-pixel flex">
      {/* Sidebar */}
      <aside className="w-64 border-r-2 border-pixel-primary/20 p-8 flex flex-col gap-12 bg-pixel-bg/50 backdrop-blur-md">
        <div className="font-pixel text-pixel-primary text-sm flex items-center gap-3">
          <div className="w-2 h-2 bg-pixel-primary animate-ping" />
          DASHBOARD_v1
        </div>

        <nav className="flex flex-col gap-6">
          {(['profile', 'skills', 'education', 'experience', 'projects', 'analytics'] as Section[]).map(s => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`text-left text-[10px] uppercase tracking-widest transition-all ${
                activeSection === s ? 'text-pixel-primary translate-x-2' : 'text-pixel-muted hover:text-white'
              }`}
            >
              {activeSection === s ? '> ' : ''}{s}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <button 
            onClick={() => { document.cookie = 'token=; Max-Age=0; path=/;'; window.location.href = '/admin/login'; }}
            className="text-[8px] text-red-500 hover:underline uppercase tracking-widest"
          >
            TERMINATE_SESSION
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-sm uppercase tracking-[0.3em] text-pixel-secondary">
            {activeSection}_MANAGEMENT
          </h2>
          {message && (
            <div className="text-[10px] text-pixel-primary animate-bounce bg-pixel-primary/10 px-4 py-2 border border-pixel-primary/20">
              {message}
            </div>
          )}
        </header>

        {/* Global Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
          <div className="pixel-border p-4 bg-pixel-bg/80">
            <div className="text-[8px] text-pixel-muted uppercase mb-1">Total Visits</div>
            <div className="text-lg text-pixel-primary font-pixel">{data?.visitsCount || 0}</div>
          </div>
          <div className="pixel-border p-4 bg-pixel-bg/80">
            <div className="text-[8px] text-pixel-muted uppercase mb-1">System Status</div>
            <div className="text-[10px] text-green-500 font-pixel uppercase tracking-widest animate-pulse">Online_v1.0</div>
          </div>
        </div>

        {/* PROFILE SECTION */}
        {activeSection === 'profile' && data && (
          <form onSubmit={handleUpdateProfile} className="max-w-2xl space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[8px] text-pixel-muted uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  value={data.profile.name} 
                  onChange={e => setData({...data, profile: {...data.profile, name: e.target.value}})}
                  className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-3 text-xs focus:border-pixel-primary outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] text-pixel-muted uppercase tracking-widest">Tagline</label>
                <input 
                  type="text" 
                  value={data.profile.tagline} 
                  onChange={e => setData({...data, profile: {...data.profile, tagline: e.target.value}})}
                  className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-3 text-xs focus:border-pixel-primary outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[8px] text-pixel-muted uppercase tracking-widest">Biography</label>
              <textarea 
                rows={5}
                value={data.profile.bio} 
                onChange={e => setData({...data, profile: {...data.profile, bio: e.target.value}})}
                className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-3 text-xs focus:border-pixel-primary outline-none resize-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="px-8 py-4 border-2 border-pixel-primary text-pixel-primary text-[10px] uppercase hover:bg-pixel-primary hover:text-pixel-bg transition-all"
            >
              {saving ? 'SYNCHRONIZING...' : 'UPDATE_PROFILE'}
            </button>
          </form>
        )}

        {/* SKILLS SECTION */}
        {activeSection === 'skills' && data && (
          <div className="space-y-12">
            {/* Add New Skill */}
            <div className="pixel-border p-6 bg-pixel-bg/40 max-w-2xl">
              <h3 className="text-[10px] text-pixel-secondary mb-6 tracking-widest uppercase">Add New Skill</h3>
              <form onSubmit={handleAddSkill} className="flex flex-wrap gap-6 items-end">
                <div className="space-y-2 flex-1 min-w-[150px]">
                  <label className="text-[8px] text-pixel-muted uppercase">Name</label>
                  <input name="name" required className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-xs focus:border-pixel-primary outline-none" />
                </div>
                <div className="space-y-2 w-24">
                  <label className="text-[8px] text-pixel-muted uppercase">Level%</label>
                  <input name="level" type="number" min="0" max="100" required className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-xs focus:border-pixel-primary outline-none" />
                </div>
                <div className="space-y-2 flex-1 min-w-[150px]">
                  <label className="text-[8px] text-pixel-muted uppercase">Category</label>
                  <input name="category" required className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-xs focus:border-pixel-primary outline-none" placeholder="Backend, Frontend, etc." />
                </div>
                <button type="submit" className="p-3 border-2 border-pixel-primary text-pixel-primary text-[10px] hover:bg-pixel-primary hover:text-pixel-bg transition-all">
                  ADD_SKILL
                </button>
              </form>
            </div>

            {/* List Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {data.skills.map((skill: any) => (
                <div key={skill._id} className="flex justify-between items-center p-4 border border-pixel-muted/10 bg-pixel-bg/20">
                  <div>
                    <span className="text-[10px] text-white uppercase tracking-widest">{skill.name}</span>
                    <span className="ml-4 text-[8px] text-pixel-muted uppercase tracking-tighter">[{skill.category}]</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] text-pixel-primary">{skill.level}%</span>
                    <button 
                      onClick={() => handleDeleteSkill(skill._id)}
                      className="text-red-500 hover:text-red-400 text-[8px] uppercase"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDUCATION SECTION */}
        {activeSection === 'education' && data && (
          <div className="space-y-12">
            <div className="pixel-border p-6 bg-pixel-bg/40 max-w-2xl">
              <h3 className="text-[10px] text-pixel-secondary mb-6 tracking-widest uppercase">Add Education</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const f = e.target as HTMLFormElement;
                const fd = new FormData(f);
                const item = {
                  institution: fd.get('institution'),
                  degree: fd.get('degree'),
                  category: fd.get('category'),
                  startYear: Number(fd.get('startYear')),
                  endYear: Number(fd.get('endYear')) || null,
                  detail: fd.get('detail'),
                  extracurriculars: (fd.get('extracurriculars') as string).split(',').map(s => s.trim()).filter(s => s),
                  milestones: JSON.parse((fd.get('milestones') as string) || '[]'),
                };
                setSaving(true);
                try {
                  const res = await fetch(`${apiUrl}/api/admin/education`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item),
                  });
                  if (res.ok) { setMessage('Education Added!'); fetchData(); f.reset(); }
                } catch (e) {
                  setMessage('Invalid Milestone JSON');
                } finally { setSaving(false); setTimeout(() => setMessage(''), 3000); }
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input name="institution" placeholder="INSTITUTION" required className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-xs" />
                  <input name="degree" placeholder="DEGREE" required className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-xs" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <select name="category" className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-xs">
                    <option value="College">College</option>
                    <option value="School">School</option>
                  </select>
                  <input name="startYear" type="number" placeholder="START_YEAR" required className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-xs" />
                  <input name="endYear" type="number" placeholder="END_YEAR" className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-xs" />
                </div>
                <input name="extracurriculars" placeholder="EXTRACURRICULARS (COMMA SEPARATED)" className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-xs" />
                <textarea name="milestones" placeholder='MILESTONES JSON (e.g. [{"date":"JAN", "label":"TASK", "description":"..."}])' className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-[8px] resize-none" rows={3}></textarea>
                <textarea name="detail" placeholder="DETAILS / GPA / FOCUS" className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-xs resize-none" rows={3}></textarea>
                <button type="submit" className="w-full p-3 border-2 border-pixel-primary text-pixel-primary text-[10px] hover:bg-pixel-primary hover:text-pixel-bg transition-all">
                  SAVE_EDUCATION_DATA
                </button>
              </form>
            </div>

            <div className="space-y-4">
              {data.education.map((item: any) => (
                <div key={item._id} className="flex justify-between items-center p-4 border border-pixel-muted/10 bg-pixel-bg/20">
                  <div>
                    <div className="text-[10px] text-white uppercase">{item.institution}</div>
                    <div className="text-[8px] text-pixel-muted uppercase">{item.degree} ({item.startYear}-{item.endYear || 'Present'})</div>
                  </div>
                  <button 
                    onClick={async () => {
                      if (confirm('Delete?')) {
                        await fetch(`${apiUrl}/api/admin/education/${item._id}`, { method: 'DELETE' });
                        fetchData();
                      }
                    }}
                    className="text-red-500 hover:text-red-400 text-[8px] uppercase"
                  >
                    DELETE
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXPERIENCE SECTION */}
        {activeSection === 'experience' && data && (
          <div className="space-y-12">
            <div className="pixel-border p-6 bg-pixel-bg/40 max-w-2xl">
              <h3 className="text-[10px] text-pixel-secondary mb-6 tracking-widest uppercase">Add Experience</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const f = e.target as HTMLFormElement;
                const fd = new FormData(f);
                const item = {
                  role: fd.get('role'),
                  company: fd.get('company'),
                  startDate: fd.get('startDate'),
                  endDate: fd.get('endDate') || 'Present',
                  bullets: (fd.get('bullets') as string).split('\n').filter(b => b.trim()),
                };
                setSaving(true);
                try {
                  const res = await fetch(`${apiUrl}/api/admin/experience`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item),
                  });
                  if (res.ok) { setMessage('Experience Added!'); fetchData(); f.reset(); }
                } finally { setSaving(false); setTimeout(() => setMessage(''), 3000); }
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input name="role" placeholder="ROLE" required className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-xs" />
                  <input name="company" placeholder="COMPANY" required className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input name="startDate" placeholder="START_DATE (e.g. Jan 2024)" required className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-xs" />
                  <input name="endDate" placeholder="END_DATE (e.g. Present)" className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-xs" />
                </div>
                <textarea name="bullets" placeholder="RESPONSIBILITIES (ONE PER LINE)" required className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-xs resize-none" rows={4}></textarea>
                <button type="submit" className="w-full p-3 border-2 border-pixel-primary text-pixel-primary text-[10px] hover:bg-pixel-primary hover:text-pixel-bg transition-all">
                  SAVE_EXPERIENCE_DATA
                </button>
              </form>
            </div>

            <div className="space-y-4">
              {data.experience.map((item: any) => (
                <div key={item._id} className="flex justify-between items-center p-4 border border-pixel-muted/10 bg-pixel-bg/20">
                  <div>
                    <div className="text-[10px] text-white uppercase">{item.role} @ {item.company}</div>
                    <div className="text-[8px] text-pixel-muted uppercase">{item.startDate} - {item.endDate}</div>
                  </div>
                  <button 
                    onClick={async () => {
                      if (confirm('Delete?')) {
                        await fetch(`${apiUrl}/api/admin/experience/${item._id}`, { method: 'DELETE' });
                        fetchData();
                      }
                    }}
                    className="text-red-500 hover:text-red-400 text-[8px] uppercase"
                  >
                    DELETE
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS SECTION */}
        {activeSection === 'projects' && data && (
          <div className="space-y-12">
            <div className="pixel-border p-6 bg-pixel-bg/40 max-w-2xl">
              <h3 className="text-[10px] text-pixel-secondary mb-6 tracking-widest uppercase">Add Project</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const f = e.target as HTMLFormElement;
                const fd = new FormData(f);
                const item = {
                  title: fd.get('title'),
                  description: fd.get('description'),
                  stack: (fd.get('stack') as string).split(',').map(s => s.trim()),
                  outcome: fd.get('outcome'),
                  link: fd.get('link'),
                };
                setSaving(true);
                try {
                  const res = await fetch(`${apiUrl}/api/admin/projects`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item),
                  });
                  if (res.ok) { setMessage('Project Added!'); fetchData(); f.reset(); }
                } finally { setSaving(false); setTimeout(() => setMessage(''), 3000); }
              }} className="space-y-4">
                <input name="title" placeholder="PROJECT TITLE" required className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-xs" />
                <textarea name="description" placeholder="DESCRIPTION" required className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-xs resize-none" rows={3}></textarea>
                <input name="stack" placeholder="TECH STACK (COMMA SEPARATED)" required className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-xs" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="outcome" placeholder="OUTCOME / IMPACT" className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-xs" />
                  <input name="link" placeholder="PROJECT LINK" className="w-full bg-pixel-bg border-2 border-pixel-muted/20 p-2 text-xs" />
                </div>
                <button type="submit" className="w-full p-3 border-2 border-pixel-primary text-pixel-primary text-[10px] hover:bg-pixel-primary hover:text-pixel-bg transition-all">
                  UPLOAD_PROJECT_MANIFEST
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects.map((item: any) => (
                <div key={item._id} className="flex justify-between items-center p-4 border border-pixel-muted/10 bg-pixel-bg/20">
                  <div className="text-[10px] text-white uppercase">{item.title}</div>
                  <button 
                    onClick={async () => {
                      if (confirm('Delete?')) {
                        await fetch(`${apiUrl}/api/admin/projects/${item._id}`, { method: 'DELETE' });
                        fetchData();
                      }
                    }}
                    className="text-red-500 hover:text-red-400 text-[8px] uppercase"
                  >
                    DELETE
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ANALYTICS SECTION */}
        {activeSection === 'analytics' && (
          <AnalyticsDashboard apiUrl={apiUrl} />
        )}
      </main>
    </div>
  );
}

function AnalyticsDashboard({ apiUrl }: { apiUrl: string }) {
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/api/admin/visits`)
      .then(res => res.json())
      .then(data => { setVisits(data); setLoading(false); });
  }, [apiUrl]);

  if (loading) return <div className="text-[8px] animate-pulse">RETRIVING_TRAFFIC_LOGS...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="pixel-border p-4 bg-pixel-primary/5">
          <div className="text-[8px] text-pixel-muted uppercase mb-2">Total Sessions</div>
          <div className="text-xl text-pixel-primary">{visits.length}</div>
        </div>
        <div className="pixel-border p-4 bg-pixel-primary/5">
          <div className="text-[8px] text-pixel-muted uppercase mb-2">Unique IPs</div>
          <div className="text-xl text-pixel-secondary">{new Set(visits.map(v => v.ip)).size}</div>
        </div>
      </div>

      <div className="pixel-border p-6 bg-pixel-bg/20 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-pixel-muted/20 text-[8px] text-pixel-muted uppercase">
              <th className="pb-4">TIMESTAMP</th>
              <th className="pb-4">ORIGIN_IP</th>
              <th className="pb-4">RESOURCES_ACCESSED</th>
            </tr>
          </thead>
          <tbody className="text-[10px]">
            {visits.slice(0, 20).map((v, i) => (
              <tr key={i} className="border-b border-pixel-muted/5">
                <td className="py-4 text-pixel-muted">{new Date(v.timestamp).toLocaleString()}</td>
                <td className="py-4 text-white">{v.ip}</td>
                <td className="py-4 text-pixel-primary">{v.userAgent.split(' ')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
