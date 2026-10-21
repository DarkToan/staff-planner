import { test, expect } from '@playwright/test';
import { DEMO, emails, employees, initialRequests, warnings } from '../../src/demo/fixtures';
import { boardPresentation } from '../../src/demo/presentation';

test('fixtures have coherent message counts, sources, roster, and dates', () => {
  const batch = emails.filter(email => email.batch);
  expect(batch).toHaveLength(12);
  expect(batch.filter(e => e.classification === 'Absence-related')).toHaveLength(7);
  expect(batch.filter(e => e.classification === 'Unrelated')).toHaveLength(4);
  expect(batch.filter(e => e.classification === 'Needs clarification')).toHaveLength(1);
  expect(initialRequests.filter(r => r.batch)).toHaveLength(6);
  expect(initialRequests.filter(r => r.status === 'Pending')).toHaveLength(4);
  expect(initialRequests.filter(r => r.status === 'Approved')).toHaveLength(3);
  expect(warnings).toHaveLength(2);
  expect(employees).toHaveLength(8);
  for (const request of initialRequests) {
    expect(employees.some(employee => employee.id === request.employeeId)).toBeTruthy();
    const source = emails.find(email => email.id === request.emailIds[0]);
    expect(source?.body).toContain(request.quote);
    for (const sourceId of request.emailIds) expect(emails.find(email => email.id === sourceId)?.requestId).toBe(request.id);
    for (const period of request.periods) {
      expect(DEMO.dates).toContain(period.start.slice(0, 10));
      expect(period.start < period.end).toBeTruthy();
    }
  }
  expect(new Set(emails.map(e => e.id)).size).toBe(emails.length);
  expect(new Set(initialRequests.map(r => r.id)).size).toBe(initialRequests.length);
});

test('amendment and cancellation presentations preserve or replace one original absence', () => {
  const amendment = initialRequests.find(r => r.id === 'r4')!;
  expect(boardPresentation(amendment)?.periods).toEqual([amendment.original]);
  expect(boardPresentation({ ...amendment, status: 'Approved', reviewed: true })?.periods).toEqual(amendment.periods);
  expect(boardPresentation({ ...amendment, status: 'Declined', reviewed: true })?.periods).toEqual([amendment.original]);
  const cancellation = initialRequests.find(r => r.id === 'r5')!;
  expect(boardPresentation({ ...cancellation, status: 'Needs clarification' })?.status).toBe('Approved');
  expect(boardPresentation({ ...cancellation, status: 'Cancelled', reviewed: true })).toBeNull();
  expect(boardPresentation({ ...cancellation, status: 'Approved', reviewed: true })?.periods).toEqual(cancellation.periods);
  expect(boardPresentation({ ...initialRequests[0], status: 'Declined' })).toBeNull();
  expect(boardPresentation(initialRequests.find(r => r.id === 'r6')!)).toBeNull();
});