import React, { useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import dayGridPlugin from '@fullcalendar/daygrid';
import luxonPlugin from '@fullcalendar/luxon3';
import { EventContentArg, EventInput, EventMountArg } from '@fullcalendar/core';
import { ChevronLeft, ChevronRight, Download, CalendarDays, Info, CircleHelp } from 'lucide-react';
import { Action, Badge, Card, Filter, Modal } from '../../components/ui';
import { useDemo } from '../../demo/DemoProvider';
import { DEMO, employees } from '../../demo/fixtures';
import { boardPresentation } from '../../demo/presentation';
import { CoverageSummary as Coverage } from './components/CoverageSummary';

const colors = { Pending: '#fff1cb', Approved: '#dcefe8', 'Needs clarification': '#ece6fa', Declined: '#eee', Cancelled: '#eee' };
// No license is bundled or invented. The official unlicensed warning remains visible.
// Supply your own legitimate key only under terms applicable to your intended use.
const schedulerLicenseKey = process.env.EXPO_PUBLIC_FULLCALENDAR_LICENSE_KEY || undefined;

function exposeEvent(arg: EventMountArg) {
  if (!arg.event.extendedProps.requestId) return;
  // FullCalendar v6 marks its timeline layout table aria-hidden, including events.
  arg.el.closest('table[aria-hidden="true"]')?.removeAttribute('aria-hidden');
  arg.el.setAttribute('tabindex', '-1');
}
function CalendarEvent({ arg, onReview }: Readonly<{ arg: EventContentArg; onReview: (id: string) => void }>) {
  const requestId = arg.event.extendedProps.requestId;
  if (!requestId) return <span className="work-shift-label">Scheduled work</span>;
  const name = employees.find(e => e.id === arg.event.getResources()[0]?.id)?.name ?? '';
  return <button className="calendar-event-button" aria-label={`Review ${name}: ${arg.event.title}`} onClick={event => { event.stopPropagation(); onReview(requestId); }}>{arg.event.title}</button>;
}
export default function StaffingBoard() {
  const demo = useDemo(); const calendar = useRef<FullCalendar>(null);
  const [team, setTeam] = useState('All'); const [employee, setEmployee] = useState('All'); const [status, setStatus] = useState('All');
  const [view, setView] = useState('resourceTimelineWeek'); const [title, setTitle] = useState('19–23 October 2026');
  const [exportOpen, setExportOpen] = useState(false); const [exportType, setExportType] = useState('approved-absences'); const [format, setFormat] = useState('csv');
  const roster = employees.filter(e => (team === 'All' || e.team === team) && (employee === 'All' || e.id === employee));
  const events = useMemo(() => {
    const shifts: EventInput[] = employees.flatMap(person => DEMO.dates.map(date => ({ id: `shift-${person.id}-${date}`, resourceId: person.id, title: 'Scheduled work', start: `${date}T09:00:00`, end: `${date}T17:00:00`, display: 'background', backgroundColor: '#eaf0f6', extendedProps: { shift: true } })));
    const absences: EventInput[] = demo.requests.flatMap(request => {
      const display = boardPresentation(request);
      if (!display || (status !== 'All' && display.status !== status)) return [];
      return display.periods.map((period, index) => {
      const person = employees.find(e => e.id === request.employeeId)!;
      let borderColor = '#e6c578';
      if (display.status === 'Needs clarification') borderColor = '#c4b5e8';
      if (display.status === 'Approved') borderColor = '#a8d6c4';
      return { id: `${request.id}-${index}`, resourceId: person.id, start: period.start, end: period.end,
        title: `${request.warning ? '⚠ ' : ''}${view === 'dayGridMonth' ? person.name + ' · ' : ''}${display.label}`,
        backgroundColor: colors[display.status], borderColor, textColor: '#364355',
        classNames: [display.status === 'Pending' ? 'absence-pending' : 'absence-confirmed'], extendedProps: { requestId: request.id },
      };
      });
    });
    const allowed = new Set(roster.map(e => e.id));
    return [...(view === 'dayGridMonth' ? [] : shifts), ...absences].filter(event => allowed.has(event.resourceId as string));
  }, [demo.requests, roster.map(e => e.id).join(','), status, view]);
  function changeView(next: string) { setView(next); calendar.current?.getApi().changeView(next); }
  return <div className="page-stack"><div className="page-heading"><div><span className="eyebrow">THE RIGHT PEOPLE. A CLEARER PICTURE.</span><h1>Your team, in view.</h1><p>Scheduled work and absence requests, side by side. Never confused.</p></div><Action onPress={() => setExportOpen(true)}><Download size={15} /> Export sample</Action></div>
    <Card><div className="calendar-toolbar"><div className="calendar-date-controls"><Action label="Previous period" onPress={() => calendar.current?.getApi().prev()}><ChevronLeft size={16} /></Action><Action label="Next period" onPress={() => calendar.current?.getApi().next()}><ChevronRight size={16} /></Action><h2>{title}</h2><Action onPress={() => calendar.current?.getApi().today()}>Today</Action><Action onPress={() => calendar.current?.getApi().gotoDate(DEMO.week)}>Demo week</Action></div><div className="view-switch" role="group" aria-label="Calendar view"><button className={view === 'resourceTimelineWeek' ? 'active' : ''} onClick={() => changeView('resourceTimelineWeek')}>Week timeline</button><button className={view === 'dayGridMonth' ? 'active' : ''} onClick={() => changeView('dayGridMonth')}>Month overview</button></div></div>
    <div className="calendar-filters"><Filter label="Team" value={team} onChange={setTeam} options={['All', 'Operations', 'Customer support'].map(value => ({ value, label: value === 'All' ? 'All teams' : value }))} /><Filter label="Employee" value={employee} onChange={setEmployee} options={[{ value: 'All', label: 'All employees' }, ...employees.map(e => ({ value: e.id, label: e.name }))]} /><Filter label="Absence status" value={status} onChange={setStatus} options={['All', 'Pending', 'Approved', 'Needs clarification'].map(value => ({ value, label: value === 'All' ? 'All statuses' : value }))} /><span className="timezone-label"><CalendarDays size={14} />Europe/London · demo fixtures</span></div>
    <div className="calendar-host"><FullCalendar ref={calendar} plugins={[resourceTimelinePlugin, dayGridPlugin, luxonPlugin]} schedulerLicenseKey={schedulerLicenseKey} initialView="resourceTimelineWeek" initialDate={DEMO.week} timeZone={DEMO.timezone} firstDay={1} weekends={false} headerToolbar={false} resourceAreaHeaderContent="TEAM MEMBER" resourceAreaWidth={210} resources={roster.map(e => ({ id: e.id, title: e.name, role: e.role, initials: e.initials }))} resourceOrder="title" resourceLabelContent={arg => <div className="resource-person"><span className="avatar avatar-small">{arg.resource.extendedProps.initials}</span><span><strong>{arg.resource.title}</strong><small>{arg.resource.extendedProps.role}</small></span></div>} events={events} editable={false} selectable={false} eventStartEditable={false} eventDurationEditable={false} eventClick={arg => { if (arg.event.extendedProps.requestId) demo.selectRequest(arg.event.extendedProps.requestId); }} eventContent={arg => <CalendarEvent arg={arg} onReview={demo.selectRequest} />} eventDidMount={exposeEvent} datesSet={arg => setTitle(arg.view.title)} slotMinTime="09:00:00" slotMaxTime="17:00:00" slotDuration="04:00:00" slotMinWidth={68} slotLabelFormat={[{ weekday: 'short', day: 'numeric', month: 'short' }, { hour: '2-digit', minute: '2-digit', hour12: false }]} height="auto" eventMinHeight={30} dayMaxEvents={4} displayEventTime={view === 'dayGridMonth'} nowIndicator={false} />
    </div><div className="calendar-legend">{['Scheduled work', 'Pending', 'Approved', 'Needs clarification', 'Coverage warning'].map(value => <Badge key={value} status={value as Parameters<typeof Badge>[0]['status']} />)}</div></Card>
    {demo.processed && <div className="info-banner"><CircleHelp size={18} /><span><strong>Finn’s date needs clarification.</strong> “Next Friday” is not assigned a guessed date or shown as an absence.</span><button className="review-link" onClick={() => demo.selectRequest('r6')}>Review evidence</button></div>}
    <Coverage />
    <div className="license-note"><Info size={15} /><span>FullCalendar Premium evaluation · no license key bundled. The scheduler’s license warning is intentional. Commercial production use requires an appropriate license; confirm terms before client distribution.</span></div>
    <Modal open={exportOpen} onClose={() => setExportOpen(false)} title="Download a sample export" description="Static local assets · not generated from the current board"><div className="export-options"><Filter label="Sample content" value={exportType} onChange={setExportType} options={[{ value: 'approved-absences', label: 'Approved absences' }, { value: 'work-schedule', label: 'Work schedule' }]} /><Filter label="Format" value={format} onChange={setFormat} options={[{ value: 'csv', label: 'CSV' }, { value: 'ics', label: 'ICS' }]} /></div><p className="context-callout">Sample export—not a live export of your selections. Changing filters or approvals does not change these files.</p><a className="download-link" href={`/exports/staffplanner-sample-${exportType}.${format}`} download={`staffplanner-sample-${exportType}.${format}`}><Download size={16} />Download sample {format.toUpperCase()}</a></Modal>
  </div>;
}