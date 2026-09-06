'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Cross, MapPin, PhoneCall, ShieldAlert } from 'lucide-react'

export default function SOSPage() {
  useEffect(() => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContextClass) return
      const ctx = new AudioContextClass()

      const playBeep = (startTime: number, frequency: number) => {
        const oscillator = ctx.createOscillator()
        const gain = ctx.createGain()
        oscillator.type = 'sine'
        oscillator.frequency.value = frequency
        gain.gain.setValueAtTime(0.0001, startTime)
        gain.gain.exponentialRampToValueAtTime(0.3, startTime + 0.015)
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.2)
        oscillator.connect(gain)
        gain.connect(ctx.destination)
        oscillator.start(startTime)
        oscillator.stop(startTime + 0.2)
      }

      playBeep(ctx.currentTime, 880)
      playBeep(ctx.currentTime + 0.24, 1040)

      window.setTimeout(() => {
        void ctx.close()
      }, 600)
    } catch {
      // Audio is optional; the SOS page must still work if the browser blocks it.
    }
  }, [])

  return <main className="min-h-screen bg-destructive/5 px-5 py-8 text-foreground"><div className="mx-auto flex max-w-2xl flex-col gap-8"><Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary"><ArrowLeft className="size-4" />Back to MedThread</Link><section className="rounded-[2rem] border border-destructive/20 bg-card p-6 shadow-xl sm:p-10"><div className="grid size-14 place-items-center rounded-2xl bg-destructive text-destructive-foreground"><ShieldAlert className="size-7" /></div><p className="mt-8 text-xs font-bold uppercase tracking-widest text-destructive">Emergency support</p><h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">You are not alone.</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">If you or someone nearby is in immediate danger, call emergency services now. MedThread cannot replace urgent medical care.</p><a href="tel:112" className="mt-8 flex items-center justify-center gap-3 rounded-2xl bg-destructive px-5 py-4 text-lg font-bold text-destructive-foreground shadow-lg"><PhoneCall className="size-5" />Call 112 now</a><div className="mt-4 flex items-start gap-3 rounded-2xl bg-secondary p-4 text-sm leading-6 text-muted-foreground"><MapPin className="mt-1 size-4 shrink-0 text-primary" />Share your exact location with the emergency operator and ask someone nearby to stay with you.</div></section><section className="grid gap-3 sm:grid-cols-2"><a href="tel:108" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 font-bold"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><Cross className="size-5" /></span>Ambulance · 108</a><a href="tel:112" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 font-bold"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><PhoneCall className="size-5" /></span>National emergency · 112</a></section></div></main>
}
