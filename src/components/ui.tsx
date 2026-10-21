import React from 'react';
import { Button, Dialog, H2, Paragraph, XStack, YStack } from 'tamagui';
import { Check, CircleHelp, Clock3, X, XCircle } from 'lucide-react';
import { Status } from '../demo/fixtures';

export function Action({ children, onPress, primary = false, disabled = false, label }: { children: React.ReactNode; onPress?: () => void; primary?: boolean; disabled?: boolean; label?: string }) {
  return <Button className={primary ? 'action-button action-primary' : 'action-button'} aria-label={label} onPress={onPress} disabled={disabled} backgroundColor={primary ? '#3348a5' : '#ffffff'} color={primary ? '#ffffff' : '#35405a'} borderWidth={1} borderColor={primary ? '#3348a5' : '#dce1eb'} borderRadius={8} height={40} paddingHorizontal={14} fontSize={13} fontWeight="600" opacity={disabled ? 0.5 : 1}>{children}</Button>;
}
export function Badge({ status }: { status: Status | 'Scheduled work' | 'Coverage warning' }) {
  const Icons = { Approved: Check, Pending: Clock3, Declined: XCircle, 'Needs clarification': CircleHelp, Cancelled: XCircle, 'Scheduled work': Check, 'Coverage warning': CircleHelp };
  const Icon = Icons[status];
  return <span className={`badge badge-${status.toLowerCase().replaceAll(' ', '-')}`}><Icon size={12} aria-hidden="true" />{status}</span>;
}
export function Avatar({ initials, small = false }: { initials: string; small?: boolean }) {
  return <span className={`avatar ${small ? 'avatar-small' : ''}`}>{initials}</span>;
}
export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <YStack className={`card ${className}`} backgroundColor="white" borderRadius={12} borderWidth={1} borderColor="#e3e7ef" overflow="hidden">{children}</YStack>;
}
export function Modal({ open, onClose, title, description, children, side = false }: { open: boolean; onClose: () => void; title: string; description: string; children: React.ReactNode; side?: boolean }) {
  return <Dialog modal open={open} onOpenChange={value => { if (!value) onClose(); }}>
    <Dialog.Portal>
      <Dialog.Overlay key="overlay" backgroundColor="rgba(19,28,49,0.35)" />
      <Dialog.Content key="content" className={side ? 'dialog-panel' : 'dialog-centered'} backgroundColor="white" borderWidth={1} borderColor="#e1e5ee" borderRadius={side ? 0 : 16} padding={26} gap={18} maxHeight="94vh" width={side ? 560 : 480} maxWidth="96vw" elevate>
        <XStack justifyContent="space-between" alignItems="flex-start" gap={12}>
          <YStack flex={1} gap={6}><Dialog.Title fontSize={21} color="#1c2944" fontWeight="700">{title}</Dialog.Title><Dialog.Description color="#6c768a" fontSize={13}>{description}</Dialog.Description></YStack>
          <Action onPress={onClose} label={`Close ${title}`}><X size={17} /></Action>
        </XStack>
        <div className="dialog-scroll">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog>;
}
export function SectionHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return <XStack justifyContent="space-between" alignItems="center" gap={16} flexWrap="wrap"><YStack gap={5}><H2 fontSize={17} fontWeight="700" color="#26334e">{title}</H2>{subtitle && <Paragraph fontSize={13} color="#768095">{subtitle}</Paragraph>}</YStack>{action}</XStack>;
}
export function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return <label className="filter"><span>{label}</span><select value={value} onChange={event => onChange(event.target.value)} aria-label={label}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}