import { Request, Status } from './fixtures';

// Presentation choices for fixed demo records, not staffing or approval calculations.
// A change request is distinct from the approved leave it proposes to change.
export function boardPresentation(request: Request): { periods: Request['periods']; status: Status; label: string } | null {
  if (request.status === 'Cancelled') return null;
  if (request.kind === 'amendment' && request.status !== 'Approved' && request.original) {
    return { periods: [request.original], status: 'Approved', label: request.reviewed ? 'Approved · original retained' : 'Approved original · amendment' };
  }
  if (request.kind === 'cancellation') {
    return { periods: request.periods, status: 'Approved', label: request.reviewed ? 'Approved · original retained' : 'Approved · cancellation review' };
  }
  if (request.status === 'Declined' || request.periods.length === 0) return null;
  return { periods: request.periods, status: request.status, label: request.status };
}