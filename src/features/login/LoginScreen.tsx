import React from 'react';
import { useRouter } from 'expo-router';
import { H1, Input, Label, Paragraph, XStack, YStack } from 'tamagui';
import { ArrowRight, CalendarDays, Check, ShieldCheck, Users } from 'lucide-react';
import { Action } from '../../components/ui';

export default function LoginScreen() {
  const router = useRouter();
  return <main className="login-page">
    <section className="login-story">
      <div className="brand brand-light"><span className="brand-icon"><CalendarDays size={24} /></span>StaffPlanner<span className="brand-dot">.</span></div>
      <div className="story-body"><span className="eyebrow light">A CLEARER VIEW OF YOUR TEAM</span><h1>Good planning.<br />Better days.</h1><p>Turn absence emails into a clear staffing picture. Less inbox admin. More time for your team.</p>
        <div className="login-illustration"><div className="illustration-top"><span><Users size={17} /> Your team, in view</span><span className="light-pill">19–23 OCT</span></div>{['Alice Bennett', 'Ben Carter', 'Chloe Davis', 'Diego Evans'].map((name, i) => <div className="illustration-row" key={name}><span>{name}</span><div className="mini-shifts">{[0, 1, 2, 3, 4].map(day => <i className={day === i ? 'mini-away' : ''} key={day} />)}</div></div>)}<div className="illustration-note"><Check size={15} /> A little clarity goes a long way.</div></div>
      </div><div className="story-footer">Thoughtfully planned. Confidently managed.</div>
    </section>
    <section className="login-form"><YStack width="100%" maxWidth={380} gap={23}>
      <div><span className="eyebrow">WELCOME TO STAFFPLANNER</span><H1 display="block" fontSize={32} lineHeight="42px" color="#1d2942" marginTop={10}>Your team starts here.</H1><Paragraph display="block" color="#7a8396" marginTop={9} fontSize={15}>Explore a simpler way to manage absences and keep your team covered.</Paragraph></div>
      <YStack gap={7}><Label htmlFor="manager-email" fontSize={13} color="#36435c">Email address</Label><Input id="manager-email" aria-label="Email address" defaultValue="alex.morgan@northstar.example" autoComplete="off" backgroundColor="white" borderColor="#dce1eb" height={47} fontSize={14} /></YStack>
      <YStack gap={7}><Label htmlFor="manager-password" fontSize={13} color="#36435c">Password</Label><Input id="manager-password" aria-label="Password" defaultValue="fictional-demo" secureTextEntry autoComplete="off" backgroundColor="white" borderColor="#dce1eb" height={47} /></YStack>
      <Action primary onPress={() => router.push('/overview')}>Sign in to demo <ArrowRight size={16} /></Action>
      <XStack gap={10} padding={15} backgroundColor="#f1f4fb" borderRadius={10}><ShieldCheck size={20} color="#5364a8" /><Paragraph flex={1} fontSize={12} color="#69758b">Demo mode · All data is fictional. No credentials are checked and no services are contacted.</Paragraph></XStack>
      <p className="login-footnote">A frontend-only product preview. No account needed.</p>
    </YStack><div className="login-bottom">Demo mode · All data is fictional</div></section>
  </main>;
}