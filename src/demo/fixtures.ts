export const DEMO = {
  week: '2026-10-19',
  dates: ['2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23'],
  timezone: 'Europe/London',
  mailbox: 'team.absences@northstar.example',
  manager: 'Alex Morgan',
};
export type Status = 'Pending' | 'Approved' | 'Declined' | 'Needs clarification' | 'Cancelled';
export type Period = { start: string; end: string };
export type Employee = { id: string; name: string; role: string; team: string; initials: string };
export const employees: Employee[] = [
  { id: 'alice', name: 'Alice Bennett', role: 'Service coordinator', team: 'Operations', initials: 'AB' },
  { id: 'ben', name: 'Ben Carter', role: 'Customer specialist', team: 'Customer support', initials: 'BC' },
  { id: 'chloe', name: 'Chloe Davis', role: 'Customer specialist', team: 'Customer support', initials: 'CD' },
  { id: 'diego', name: 'Diego Evans', role: 'Operations analyst', team: 'Operations', initials: 'DE' },
  { id: 'eva', name: 'Eva Foster', role: 'Service coordinator', team: 'Operations', initials: 'EF' },
  { id: 'finn', name: 'Finn Grant', role: 'Customer specialist', team: 'Customer support', initials: 'FG' },
  { id: 'grace', name: 'Grace Hayes', role: 'Team lead', team: 'Customer support', initials: 'GH' },
  { id: 'hugo', name: 'Hugo Irving', role: 'Operations analyst', team: 'Operations', initials: 'HI' },
];
export type Request = {
  id: string; employeeId: string; type: string; status: Status; periods: Period[];
  periodLabel: string; fullDay: boolean; emailIds: string[]; quote: string;
  batch: boolean; warning: boolean; kind?: 'amendment' | 'cancellation';
  original?: Period; reviewed?: boolean;
  impact: { scheduled: number; available: number; minimum: number; shortfall: number; period: string };
};
const safeImpact = { scheduled: 4, available: 3, minimum: 3, shortfall: 0, period: '09:00–17:00' };
export const initialRequests: Request[] = [
  { id: 'r1', employeeId: 'alice', type: 'Annual leave', status: 'Pending', periods: [{ start: '2026-10-20T09:00:00', end: '2026-10-20T17:00:00' }], periodLabel: 'Tue 20 Oct · 09:00–17:00', fullDay: true, emailIds: ['e1'], quote: 'Could I take Tuesday 20 October off as annual leave?', batch: true, warning: false, impact: safeImpact },
  { id: 'r2', employeeId: 'ben', type: 'Personal appointment', status: 'Pending', periods: [{ start: '2026-10-21T13:00:00', end: '2026-10-21T17:00:00' }], periodLabel: 'Wed 21 Oct · 13:00–17:00', fullDay: false, emailIds: ['e2'], quote: 'I need Wednesday 21 October, 13:00–17:00, for a personal appointment.', batch: true, warning: true, impact: { scheduled: 4, available: 3, minimum: 4, shortfall: 1, period: 'Wed 21 Oct · 13:00–17:00' } },
  { id: 'r3', employeeId: 'chloe', type: 'Annual leave · multiple dates', status: 'Pending', periods: [{ start: '2026-10-22T09:00:00', end: '2026-10-22T17:00:00' }, { start: '2026-10-23T09:00:00', end: '2026-10-23T17:00:00' }], periodLabel: 'Thu 22 & Fri 23 Oct · 09:00–17:00', fullDay: true, emailIds: ['e3'], quote: 'Please book annual leave for Thursday 22 and Friday 23 October.', batch: true, warning: true, impact: { scheduled: 4, available: 3, minimum: 4, shortfall: 1, period: 'Fri 23 Oct · 09:00–17:00' } },
  { id: 'r4', employeeId: 'diego', type: 'Amendment · annual leave', kind: 'amendment', status: 'Pending', periods: [{ start: '2026-10-22T13:00:00', end: '2026-10-22T17:00:00' }], original: { start: '2026-10-22T09:00:00', end: '2026-10-22T17:00:00' }, periodLabel: 'Thu 22 Oct · change to 13:00–17:00', fullDay: false, emailIds: ['e5', 'e4'], quote: 'Please amend my approved Thursday 22 October leave to 13:00–17:00 only.', batch: true, warning: false, impact: { ...safeImpact, period: 'Thu 22 Oct · 13:00–17:00' } },
  { id: 'r5', employeeId: 'eva', type: 'Cancellation · annual leave', kind: 'cancellation', status: 'Approved', periods: [{ start: '2026-10-23T09:00:00', end: '2026-10-23T17:00:00' }], periodLabel: 'Fri 23 Oct · 09:00–17:00', fullDay: true, emailIds: ['e7', 'e6'], quote: 'Please cancel my approved leave on Friday 23 October. I will work my normal shift.', batch: true, warning: false, impact: { scheduled: 4, available: 4, minimum: 3, shortfall: 0, period: 'Fri 23 Oct · after cancellation' } },
  { id: 'r6', employeeId: 'finn', type: 'Date unclear', status: 'Needs clarification', periods: [], periodLabel: '“Next Friday” · date unconfirmed', fullDay: false, emailIds: ['e8'], quote: 'Can I take next Friday afternoon off? Not sure which dates I sent before.', batch: true, warning: false, impact: { ...safeImpact, period: 'Unconfirmed · illustrative only' } },
  { id: 'r7', employeeId: 'grace', type: 'Annual leave', status: 'Approved', periods: [{ start: '2026-10-19T09:00:00', end: '2026-10-19T17:00:00' }], periodLabel: 'Mon 19 Oct · 09:00–17:00', fullDay: true, emailIds: ['archive1'], quote: 'Please record my agreed annual leave for Monday 19 October.', batch: false, warning: false, impact: safeImpact },
  { id: 'r8', employeeId: 'hugo', type: 'Personal appointment', status: 'Approved', periods: [{ start: '2026-10-20T09:00:00', end: '2026-10-20T12:00:00' }], periodLabel: 'Tue 20 Oct · 09:00–12:00', fullDay: false, emailIds: ['archive2'], quote: 'Confirming my approved appointment on Tuesday 20 October, 09:00–12:00.', batch: false, warning: false, impact: { ...safeImpact, period: '09:00–12:00' } },
];
export type Email = { id: string; sender: string; subject: string; received: string; body: string; quote?: string; classification: 'Absence-related' | 'Unrelated' | 'Needs clarification'; unread: boolean; requestId?: string; batch: boolean };
function message(id: string, employeeId: string, subject: string, text: string, requestId: string, classification: Email['classification'] = 'Absence-related'): Email {
  const employee = employees.find(e => e.id === employeeId)!;
  return { id, sender: `${employee.name} <${employeeId}@northstar.example>`, subject, received: '19 Oct 2026 · 08:15 BST', body: `Hi Alex,\n\n${text}\n\nThank you,\n${employee.name}`, quote: text, classification, unread: id === 'e2', requestId, batch: !id.startsWith('archive') };
}
export const emails: Email[] = [
  message('e1', 'alice', 'Annual leave — Tuesday 20 October', initialRequests[0].quote, 'r1'),
  message('e2', 'ben', 'Wednesday afternoon appointment', initialRequests[1].quote, 'r2'),
  message('e3', 'chloe', 'Two days of annual leave', initialRequests[2].quote, 'r3'),
  message('e4', 'diego', 'Original: Thursday annual leave', 'My Thursday 22 October full-day leave was approved on 16 October.', 'r4'),
  message('e5', 'diego', 'Amendment: Thursday afternoon only', initialRequests[3].quote, 'r4'),
  message('e6', 'eva', 'Original: Friday leave confirmed', 'Confirming my approved full-day leave for Friday 23 October.', 'r5'),
  message('e7', 'eva', 'Cancel my Friday leave', initialRequests[4].quote, 'r5'),
  message('e8', 'finn', 'Next Friday?', initialRequests[5].quote, 'r6', 'Needs clarification'),
  ...['Kitchen supplies have arrived', 'Quarterly team newsletter', 'Printer maintenance on Monday', 'Lunch menu for this week'].map((subject, i): Email => ({ id: `e${i + 9}`, sender: 'Office team <office@northstar.example>', subject, received: '19 Oct 2026 · 08:00 BST', body: `Hello team,\n\n${subject}. This is an office update; no absence is requested.\n\nOffice team`, classification: 'Unrelated', unread: i === 0, batch: true })),
  message('archive1', 'grace', 'Approved: Monday annual leave', initialRequests[6].quote, 'r7'),
  message('archive2', 'hugo', 'Approved: Tuesday appointment', initialRequests[7].quote, 'r8'),
];
export const warnings = [
  { id: 'r2', title: 'Wednesday afternoon', period: '21 Oct · 13:00–17:00', text: '1 person below minimum if Ben’s pending request is approved.' },
  { id: 'r3', title: 'Friday customer support', period: '23 Oct · 09:00–17:00', text: '1 person below minimum if Chloe’s pending request is approved.' },
];
export const stages = ['Reading new emails', 'Identifying absence requests', 'Extracting requested time ranges', 'Linking source evidence', 'Updating the staffing board'];