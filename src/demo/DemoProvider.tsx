import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { initialRequests, Request, stages, Status } from './fixtures';

type DemoState = {
  connected: boolean; connect: () => void; processed: boolean; stage: number;
  processing: boolean; process: () => void; reset: () => void;
  requests: Request[]; update: (id: string, status: Status, reviewed?: boolean) => void;
  selectedRequest: string | null; selectRequest: (id: string | null) => void;
  selectedEmail: string | null; selectEmail: (id: string | null) => void;
  notice: string; setNotice: (text: string) => void; activity: string[];
};
const Context = createContext<DemoState | null>(null);
export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [stage, setStage] = useState(-1);
  const [requests, setRequests] = useState(() => structuredClone(initialRequests));
  const [selectedRequest, selectRequest] = useState<string | null>(null);
  const [selectedEmail, selectEmail] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [activity, setActivity] = useState(['Grace’s Monday leave approved · 16 Oct', 'Hugo’s appointment approved · 16 Oct']);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const running = useRef(false);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; running.current = false; };
  useEffect(() => () => clear(), []);
  function process() {
    if (running.current) return;
    if (processed) { setNotice('No new emails in this demo. Reset the demo to replay.'); return; }
    if (!connected) { setNotice('Connect the simulated Office 365 mailbox first.'); return; }
    running.current = true;
    setNotice(''); setStage(0);
    stages.slice(1).forEach((_, index) => timers.current.push(setTimeout(() => setStage(index + 1), (index + 1) * 1200)));
    timers.current.push(setTimeout(() => {
      setProcessed(true); setStage(-1); running.current = false;
      setActivity(previous => ['Demo batch processed: 12 emails · 6 request records · 2 fixture warnings', ...previous]);
      setNotice('12 emails processed. 7 absence-related · 4 unrelated · 1 needs clarification.');
    }, 6500));
  }
  function reset() {
    clear(); setConnected(false); setProcessed(false); setStage(-1);
    setRequests(structuredClone(initialRequests)); selectRequest(null); selectEmail(null);
    setNotice('Demo reset. Connect the mailbox to replay.');
    setActivity(['Grace’s Monday leave approved · 16 Oct', 'Hugo’s appointment approved · 16 Oct']);
  }
  function update(id: string, status: Status, reviewed = false) {
    setRequests(previous => previous.map(request => request.id === id ? { ...request, status, reviewed: reviewed || request.reviewed } : request));
    setActivity(previous => [`${id.toUpperCase()} · ${status}${reviewed ? ' · change reviewed' : ''} by Alex Morgan (demo)`, ...previous]);
    setNotice(`Mock request updated: ${status}. No notification sent. Coverage figures remain predefined.`);
  }
  return <Context.Provider value={{ connected, connect: () => setConnected(true), processed, stage, processing: stage >= 0, process, reset, requests: requests.filter(r => !r.batch || processed), update, selectedRequest, selectRequest, selectedEmail, selectEmail, notice, setNotice, activity }}>{children}</Context.Provider>;
}
export function useDemo() {
  const value = useContext(Context);
  if (!value) throw new Error('DemoProvider is required');
  return value;
}