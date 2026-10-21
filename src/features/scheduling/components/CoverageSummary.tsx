import React from 'react';
import { AlertTriangle, ChevronRight, ShieldCheck } from 'lucide-react';
import { Card, SectionHeading } from '../../../components/ui';
import { useDemo } from '../../../demo/DemoProvider';
import { warnings } from '../../../demo/fixtures';

export function CoverageSummary({ compact = false }: Readonly<{ compact?: boolean }>) {
  const demo = useDemo();

  return (
    <Card>
      <div className="card-heading">
        <SectionHeading
          title="Coverage watch"
          subtitle="Predefined demo-week scenarios"
          action={
            <span className="badge badge-coverage-warning">
              <AlertTriangle size={12} />
              {demo.processed ? '2 examples' : 'Awaiting batch'}
            </span>
          }
        />
      </div>
      <div className="coverage-list">
        {demo.processed ? warnings.map(warning => (
          <button className="coverage-item" key={warning.id} onClick={() => demo.selectRequest(warning.id)}>
            <span className="warning-icon"><AlertTriangle size={17} /></span>
            <span>
              <strong>{warning.title}</strong>
              <small>{warning.period}</small>
              <p>{warning.text}</p>
              {!compact && <em>Hypothetical · fixed scenario, not current calculated coverage</em>}
            </span>
            <ChevronRight size={16} />
          </button>
        )) : (
          <div className="empty-small">
            <ShieldCheck size={24} />
            <strong>No imported warnings yet</strong>
            <p>Process the fictional inbox to reveal two coverage scenarios.</p>
          </div>
        )}
      </div>
      {demo.processed && (
        <div className="card-bottom helper">
          Fixed examples do not change after decisions. They are not live staffing alerts.
        </div>
      )}
    </Card>
  );
}