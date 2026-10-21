import React from 'react';
import { Link, Slot, usePathname, useRouter } from 'expo-router';
import { CalendarDays, LayoutDashboard, ClipboardList, Mail, Settings2, LogOut, RotateCcw, ChevronRight, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Avatar } from '../ui';
import { useDemo } from '../../demo/DemoProvider';
import { stages } from '../../demo/fixtures';
import { DetailPanels } from '../../features/requests/DetailPanels';

const navigation = [
  { path: '/overview', label: 'Overview', icon: LayoutDashboard },
  { path: '/calendar', label: 'Staffing calendar', icon: CalendarDays },
  { path: '/requests', label: 'Requests', icon: ClipboardList },
  { path: '/emails', label: 'Emails', icon: Mail },
  { path: '/settings', label: 'Demo settings', icon: Settings2 },
] as const;
export default function WorkspaceShell() {
  const pathname = usePathname(); const router = useRouter();
  const demo = useDemo();
  const page = navigation.find(item => pathname === item.path);
  return <div className="app-shell">
    <aside className="sidebar"><Link href="/overview" className="brand"><span className="brand-icon"><CalendarDays size={21} /></span>StaffPlanner<span className="brand-dot">.</span></Link>
      <div className="workspace-label">NORTHSTAR WORKSPACE<span>Manager view</span></div>
      <nav aria-label="Main navigation">{navigation.map(({ path, label, icon: Icon }) => <Link key={path} href={path} className={`nav-link ${pathname === path ? 'active' : ''}`} aria-current={pathname === path ? 'page' : undefined}><Icon size={18} /><span>{label}</span>{label === 'Requests' && demo.processed && <b>{demo.requests.filter(r => r.status === 'Pending').length}</b>}</Link>)}</nav>
      <div className="sidebar-note"><ShieldCheck size={20} /><strong>A safe space to explore</strong><p>Every employee, email, and decision here is fictional.</p><Link href="/settings">About this demo <ArrowUpRight size={13} /></Link></div>
      <div className="sidebar-profile"><Avatar initials="AM" small /><div><strong>Alex Morgan</strong><span>Team manager</span></div><button className="icon-button" aria-label="Sign out" onClick={() => router.replace('/')}><LogOut size={17} /></button></div>
    </aside>
    <div className="workspace-main"><header className="topbar"><div className="breadcrumb">Workspace <ChevronRight size={14} /><strong>{page?.label}</strong></div><div className="topbar-actions"><span className="demo-label"><i /> Demo mode · All data is fictional</span><button className="text-button reset-action" onClick={demo.reset}><RotateCcw size={14} /> Reset demo</button><span className="header-identity"><Avatar initials="AM" small /><span>Alex Morgan</span></span><button className="icon-button" aria-label="Sign out of demo" onClick={() => router.replace('/')}><LogOut size={17} /></button></div></header>
      {demo.processing && <div className="global-progress" role="status"><span className="spinner" /><strong>Simulated processing</strong><span>{stages[demo.stage]}…</span><progress aria-label="Email processing progress" value={demo.stage + 1} max={6} /><small>You can keep exploring.</small></div>}
      {demo.notice && <div className="notice" role="status"><span>{demo.notice}</span><button className="text-button" aria-label="Dismiss notification" onClick={() => demo.setNotice('')}>Dismiss</button></div>}
      <main className="page-content"><Slot /></main>
      <footer className="app-footer"><span>StaffPlanner · Frontend prototype</span><span>Europe/London · Fictional demo week: 19–23 October 2026</span></footer>
    </div>
    <DetailPanels />
  </div>;
}