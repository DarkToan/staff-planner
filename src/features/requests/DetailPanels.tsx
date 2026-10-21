import React, { useState } from 'react';
import { Mail, ArrowUpRight, AlertTriangle, CalendarDays, History } from 'lucide-react';
import { Action, Avatar, Badge, Modal } from '../../components/ui';
import { useDemo } from '../../demo/DemoProvider';
import { employees, emails, Status } from '../../demo/fixtures';

export function DetailPanels() {
  const demo = useDemo();
  const [confirmation, setConfirmation] = useState<{ id: string; status: Status; reviewed: boolean } | null>(null);
  const request = demo.requests.find(r => r.id === demo.selectedRequest);
  const employee = employees.find(e => e.id === request?.employeeId);
  const email = emails.find(e => e.id === demo.selectedEmail);
  const source = emails.find(e => e.id === request?.emailIds[0]);
  function confirm(status: Status, reviewed = false) {
    if (request) setConfirmation({ id: request.id, status, reviewed });
  }
  return <>
    <Modal open={!!request && !email && !confirmation} onClose={() => demo.selectRequest(null)} title="Request details" description="Review the evidence. Make a considered decision." side>
      {request && employee && <div className="detail-content">
        <div className="employee-heading"><Avatar initials={employee.initials} /><div><h2>{employee.name}</h2><p>{employee.role} · {employee.team}</p></div></div>
        <div className="detail-status"><Badge status={request.status} /><span>{request.id.toUpperCase()} · {request.type}</span></div>
        <section className="detail-section"><h3><CalendarDays size={15} /> Requested time</h3><strong>{request.periodLabel}</strong><p>{request.fullDay ? 'Full-day' : 'Partial-day / unconfirmed'} · Europe/London</p>{request.periods.map((period, i) => <p className="exact-period" key={i}>Start: {period.start.replace('T', ' ')}<br />End: {period.end.replace('T', ' ')}</p>)}{!request.periods.length && <p>No date placed on the board: clarification is required.</p>}</section>
        {request.kind && <div className="context-callout"><strong>{request.kind === 'amendment' ? 'Review an amendment' : 'Review a cancellation'}</strong><p>{request.kind === 'amendment' ? 'Original approved leave: Thu 22 Oct, 09:00–17:00. It stays active until the amendment is accepted; accepting replaces it, never duplicates it.' : 'Eva’s original Friday leave remains approved until you accept this cancellation. Accepting removes the absence from the board.'}</p>{request.reviewed && <p><strong>This change has been reviewed.</strong></p>}</div>}
        <section className="detail-section"><h3><Mail size={15} /> Source evidence</h3><strong>{source?.subject}</strong><p>{source?.sender}</p><p>Received {source?.received}</p><blockquote>{request.quote}</blockquote><Action onPress={() => demo.selectEmail(source?.id ?? null)}>View full email <ArrowUpRight size={14} /></Action>
          {request.emailIds.length > 1 && <div className="related-messages"><h4>Related messages · same request</h4>{request.emailIds.slice(1).map(id => <button className="text-button" key={id} onClick={() => demo.selectEmail(id)}><Mail size={14} />{emails.find(e => e.id === id)?.subject}</button>)}</div>}
        </section>
        <section className={`impact-box ${request.warning ? 'impact-warning' : ''}`}><h3><AlertTriangle size={16} />{request.kind === 'cancellation' ? 'Impact if cancellation accepted' : 'Impact if approved'}</h3><p>Predefined illustration · not recalculated after decisions</p><div className="impact-grid">{[['Scheduled staff', request.impact.scheduled], ['Available if accepted', request.impact.available], ['Required minimum', request.impact.minimum], ['Shortfall', request.impact.shortfall]].map(([label, value]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div><p>Affected period: {request.impact.period}</p>{request.status === 'Pending' && <strong className="hypothetical">Hypothetical pending-request impact</strong>}</section>
        <section className="detail-section"><h3><History size={15} /> Fictional history</h3><p>16 Oct · Baseline schedule prepared</p><p>{request.batch ? '19 Oct · Imported in simulated email batch' : '16 Oct · Approved by Alex Morgan (demo)'}</p>{demo.activity.filter(item => item.startsWith(request.id.toUpperCase())).map((item, i) => <p key={i}>{item}</p>)}</section>
        <div className="detail-actions">{request.kind ? <>
          <Action primary disabled={!!request.reviewed} onPress={() => confirm(request.kind === 'cancellation' ? 'Cancelled' : 'Approved', true)}>{request.kind === 'cancellation' ? 'Accept cancellation' : 'Accept amendment'}</Action>
          <Action disabled={!!request.reviewed} onPress={() => confirm(request.kind === 'cancellation' ? 'Approved' : 'Declined', true)}>Keep original leave</Action>
          <Action disabled={!!request.reviewed} onPress={() => confirm('Needs clarification')}>Needs clarification</Action>
        </> : <><Action primary disabled={!request.periods.length} onPress={() => confirm('Approved')}>Approve</Action><Action onPress={() => confirm('Declined')}>Decline</Action><Action onPress={() => confirm('Needs clarification')}>Needs clarification</Action></>}</div>
        {!request.periods.length && <p className="helper">Approval is unavailable for this ambiguous fixture until dates are known. No date extraction is implemented.</p>}
        <p className="helper">Local demo status only. No policy checks, staffing calculation, or emails sent.</p>
      </div>}
    </Modal>
    <Modal open={!!confirmation} onClose={() => setConfirmation(null)} title="Confirm demo decision" description="Only this browser’s in-memory fixture will change.">
      <p>Set this mock request to <strong>{confirmation?.status}</strong>{confirmation?.reviewed ? ' and mark the change as reviewed' : ''}?</p><p className="helper">No notification is sent. Coverage warnings and figures remain fixed examples.</p><div className="modal-actions"><Action onPress={() => setConfirmation(null)}>Go back</Action><Action primary onPress={() => { if (confirmation) demo.update(confirmation.id, confirmation.status, confirmation.reviewed); setConfirmation(null); }}>Confirm decision</Action></div>
    </Modal>
    <Modal open={!!email} onClose={() => demo.selectEmail(null)} title="Source email" description="Fictional message · no real mailbox access" side>
      {email && <div className="email-detail"><h2>{email.subject}</h2><p><strong>From:</strong> {email.sender}</p><p><strong>To:</strong> team.absences@northstar.example</p><p><strong>Received:</strong> {email.received}</p><div className="email-tags"><span className="badge">{email.unread ? 'Unread' : 'Read'}</span><span className="badge">{!email.batch || demo.processed ? 'Processed' : 'Unprocessed'}</span><span className="badge">{email.classification}</span></div>{(!email.batch || demo.processed) && <p className="category">Category: StaffPlanner-Processed</p>}<div className="email-body">{email.quote ? <>{email.body.split(email.quote)[0]}<mark>{email.quote}</mark>{email.body.split(email.quote)[1]}</> : email.body}</div><p className="helper">Processed means reviewed by the app, not approved by a manager. Read/unread is a separate fictional mailbox flag.</p>{email.requestId && (!email.batch || demo.processed) && <Action primary onPress={() => { demo.selectRequest(email.requestId!); demo.selectEmail(null); }}>Review linked request</Action>}</div>}
    </Modal>
  </>;
}