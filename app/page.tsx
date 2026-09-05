'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Activity,
  Bell,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Clock3,
  Cross,
  FileText,
  FlaskConical,
  HeartPulse,
  Languages,
  LocateFixed,
  LockKeyhole,
  MapPin,
  Menu,
  Mic,
  Moon,
  Navigation,
  Pill,
  Play,
  Search,
  ShieldCheck,
  Stethoscope,
  Sun,
  Users,
  UserRound,
  Video,
  X,
} from 'lucide-react'

type View = 'home' | 'doctors' | 'symptoms' | 'tests' | 'medicines' | 'account'
type SpeechRecognition = { lang: string; interimResults: boolean; continuous: boolean; start: () => void; stop: () => void; onstart: (() => void) | null; onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onerror: ((event: { error: string }) => void) | null; onend: (() => void) | null }
type SpeechRecognitionConstructor = new () => SpeechRecognition
declare global { interface Window { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor } }

const doctors = [
  { name: 'Dr. Ananya Sharma', specialty: 'General Physician', distance: '1.2 km away', time: 'Available now', initials: 'AS', color: 'bg-[#1f7d6b]' },
  { name: 'Dr. Rohan Verma', specialty: 'Internal Medicine', distance: '2.8 km away', time: 'In 15 min', initials: 'RV', color: 'bg-[#2f78a0]' },
  { name: 'Dr. Meera Iyer', specialty: 'Paediatrics', distance: '3.4 km away', time: 'In 20 min', initials: 'MI', color: 'bg-[#b86d4e]' },
]

const features = [
  { icon: Mic, title: 'Speak naturally', text: 'Tell us how you feel in your language.', view: 'symptoms' as View },
  { icon: Stethoscope, title: 'Find a doctor', text: 'Meet verified doctors, near you.', view: 'doctors' as View },
  { icon: FlaskConical, title: 'Manage tests', text: 'Book diagnostics and track reports.', view: 'tests' as View },
  { icon: Pill, title: 'Stay on track', text: 'Spoken reminders for your medicines.', view: 'medicines' as View },
]

export default function Page() {
  const [view, setView] = useState<View>('home')
  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [voiceError, setVoiceError] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [located, setLocated] = useState(false)

  useEffect(() => () => recognitionRef.current?.stop(), [])

  const toggleVoice = () => {
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionAPI) {
      setVoiceError('Voice input is not supported in this browser. You can type your symptoms below instead.')
      return
    }
    const recognition = new SpeechRecognitionAPI()
    recognition.lang = 'en-IN'
    recognition.interimResults = true
    recognition.continuous = false
    recognition.onstart = () => { setVoiceError(''); setListening(true) }
    recognition.onresult = (event) => {
      const text = Array.from(event.results).map((result) => result[0].transcript).join('')
      setTranscript(text)
    }
    recognition.onerror = (event) => {
      setListening(false)
      setVoiceError(event.error === 'not-allowed' ? 'Microphone permission was blocked. Allow microphone access in your browser and try again.' : 'We could not hear that clearly. Please try again or type your symptoms.')
    }
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    recognition.start()
  }
  const [matched, setMatched] = useState(false)
  const [query, setQuery] = useState('')

  const findDoctor = () => {
    setMatched(false)
    window.setTimeout(() => setMatched(true), 650)
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => setLocated(true), () => setLocated(true))
    } else setLocated(true)
  }

  return (
    <div className={dark ? 'dark min-h-screen' : 'min-h-screen'}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
            <button onClick={() => setView('home')} className="flex items-center gap-2.5" aria-label="MedThread home">
              <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><Cross className="size-6" strokeWidth={2.5} /></span>
              <span className="font-display text-lg font-bold tracking-tight text-primary">MedThread<span className="text-accent">.</span><small className="ml-2 hidden font-sans text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:inline">Care that stays with you</small></span>
            </button>
            <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
              {(['home', 'doctors', 'symptoms', 'tests', 'medicines'] as View[]).map((item) => <button key={item} onClick={() => setView(item)} className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors ${view === item ? 'bg-secondary text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>{item === 'home' ? 'Overview' : item === 'symptoms' ? 'AI Triage' : item === 'tests' ? 'Tests & Reports' : item}</button>)}
            </nav>
            <div className="flex items-center gap-2">
              <button onClick={() => setDark(!dark)} className="grid size-10 place-items-center rounded-full border border-border bg-card text-primary transition hover:-rotate-12" aria-label="Toggle day and night mode">{dark ? <Sun className="size-4" /> : <Moon className="size-4" />}</button>
              <button onClick={() => setView('account')} className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 sm:flex"><UserRound className="size-4" />Patient account</button>
              <button onClick={() => setMenuOpen(!menuOpen)} className="grid size-10 place-items-center rounded-full border border-border md:hidden" aria-label="Open menu">{menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
            </div>
          </div>
          {menuOpen && <nav className="flex flex-col gap-1 border-t border-border px-5 py-3 md:hidden">{(['home', 'doctors', 'symptoms', 'tests', 'medicines'] as View[]).map((item) => <button key={item} onClick={() => { setView(item); setMenuOpen(false) }} className="rounded-lg px-3 py-2 text-left text-sm font-semibold capitalize">{item}</button>)}</nav>}
        </header>

        {view === 'home' ? <Home setView={setView} listening={listening} setListening={toggleVoice} /> : <AppView view={view} query={query} setQuery={setQuery} located={located} getLocation={getLocation} matched={matched} findDoctor={findDoctor} listening={listening} setListening={toggleVoice} transcript={transcript} setTranscript={setTranscript} voiceError={voiceError} />}

        <footer className="border-t border-border bg-card px-5 py-8 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-muted-foreground sm:flex-row"><span className="font-display font-bold text-primary">MedThread<span className="text-accent">.</span></span><span>Care that stays with you — for every Indian, in every corner.</span><span>© 2026 MedThread Health</span></div></footer>
      </div>
    </div>
  )
}

function Home({ setView, listening, setListening }: { setView: (v: View) => void; listening: boolean; setListening: () => void }) {
  return <main>
    <section className="relative overflow-hidden bg-primary text-primary-foreground"><div className="absolute inset-0 dot-grid opacity-20" /><div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-24"><div><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-foreground/80"><span className="size-2 animate-pulse rounded-full bg-accent" />GWS Sustainability · Page 3 · S16</div><h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">Care that <span className="text-accent">stays</span> with you.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-primary-foreground/75">Healthcare shouldn&apos;t end after a consultation. Speak naturally, get intelligent guidance, meet a verified doctor, and keep your care journey connected.</p><div className="mt-8 flex flex-wrap gap-3"><button onClick={() => setView('symptoms')} className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3.5 font-bold text-accent-foreground shadow-xl shadow-black/15 transition hover:-translate-y-1"><Mic className="size-5" />Tell us how you feel <ChevronRight className="size-4" /></button><button onClick={() => setView('doctors')} className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-5 py-3.5 font-bold transition hover:bg-primary-foreground/10"><Stethoscope className="size-5" />Find a doctor</button></div><div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-primary-foreground/70"><span className="flex items-center gap-2"><Languages className="size-4 text-accent" />Hindi · English · Marathi +</span><span className="flex items-center gap-2"><ShieldCheck className="size-4 text-accent" />Verified & secure</span></div></div><div className="relative mx-auto w-full max-w-md"><div className="absolute -inset-6 rounded-[3rem] bg-accent/20 blur-3xl" /><div className="relative rounded-[2rem] border border-primary-foreground/15 bg-primary-foreground/10 p-3 shadow-2xl backdrop-blur-sm"><div className="rounded-[1.5rem] bg-card p-5 text-foreground"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Good morning, Aanya</p><h2 className="font-display text-lg font-bold">How can we help?</h2></div><span className="grid size-10 place-items-center rounded-full bg-secondary text-primary"><HeartPulse className="size-5 animate-pulse" /></span></div><button onClick={() => setListening()} className={`mx-auto mt-9 grid size-28 place-items-center rounded-full text-primary-foreground shadow-xl transition ${listening ? 'bg-accent mic-ring' : 'bg-primary hover:scale-105'}`} aria-label="Start voice triage"><Mic className="size-10" /></button><p className="mt-5 text-center text-sm font-bold">{listening ? 'Listening… tell us what you feel' : 'Tap to speak'}</p><p className="mt-1 text-center text-xs text-muted-foreground">We&apos;ll connect you to the right care.</p><div className="mt-8 grid grid-cols-2 gap-2">{['Find a doctor', 'My medicines', 'Tests & reports', 'Health profile'].map((x, i) => <button key={x} onClick={() => setView(i === 0 ? 'doctors' : i === 2 ? 'tests' : i === 1 ? 'medicines' : 'home')} className="rounded-xl bg-secondary p-3 text-left text-xs font-semibold transition hover:bg-mint/60"><span className="mb-2 block text-primary">{[<Users key="u" className="size-4" />, <Pill key="p" className="size-4" />, <FlaskConical key="f" className="size-4" />, <FileText key="f2" className="size-4" />][i]}</span>{x}</button>)}</div></div></div></div></div></section>
    <section className="border-b border-border bg-card"><div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border px-5 py-5 sm:grid-cols-4 lg:px-8">{[['68%', 'Indians lack timely access'], ['24/7', 'Care guidance'], ['5+', 'Indian languages'], ['100%', 'Follow-up focused']].map(([num, text]) => <div key={num} className="px-4 py-2 first:pl-0 last:pr-0"><p className="font-display text-2xl font-bold text-primary">{num}</p><p className="mt-1 text-xs text-muted-foreground sm:text-sm">{text}</p></div>)}</div></section>
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="max-w-2xl"><p className="eyebrow">One connected care hub</p><h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">From “what&apos;s wrong?” to “I&apos;m better.”</h2><p className="mt-4 text-lg leading-8 text-muted-foreground">MedThread closes the gaps between symptoms, doctors, medicines, tests, and the follow-up that makes care work.</p></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map(({ icon: Icon, title, text, view: target }) => <button key={title} onClick={() => setView(target)} className="group rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"><span className="mb-8 grid size-11 place-items-center rounded-xl bg-secondary text-primary"><Icon className="size-5 transition group-hover:scale-110" /></span><h3 className="font-display font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary">Explore <ChevronRight className="size-4" /></span></button>)}</div></section>
    <section className="bg-secondary"><div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-14 lg:grid-cols-2 lg:px-8"><div><p className="eyebrow">Why MedThread</p><h2 className="mt-3 font-display text-3xl font-bold">Healthcare in your voice, on your terms.</h2><p className="mt-4 max-w-xl leading-7 text-muted-foreground">Designed for real life — low bandwidth, busy families, different languages, and the need for a doctor who remembers what happened last time.</p></div><div className="grid grid-cols-2 gap-3">{[['Voice-first', Mic], ['Trusted', ShieldCheck], ['Nearby', MapPin], ['Continuous', Activity]].map(([label, Icon]) => <div key={label as string} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"><span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary"><Icon className="size-4" /></span><span className="text-sm font-bold">{label as string}</span></div>)}</div></div></section>
    <section className="mx-auto max-w-7xl px-5 py-14 text-center lg:px-8"><p className="eyebrow">Help us create impact</p><h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-bold">Vote for MedThread. Help care travel further.</h2><p className="mx-auto mt-4 max-w-xl text-muted-foreground">GSW Sustainability · Page 3 | S16. One vote takes us closer to a healthier India.</p><button onClick={() => setView('doctors')} className="mt-7 rounded-full bg-primary px-6 py-3.5 font-bold text-primary-foreground transition hover:scale-105">Support MedThread <span className="ml-1 text-accent">♥</span></button></section>
  </main>
}

function AccountPrototype() {
  const [signedIn, setSignedIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  return <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-9">
      {!signedIn ? <>
        <div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary"><ShieldCheck className="size-6" /></span><div><p className="eyebrow">Private care space</p><h2 className="font-display text-2xl font-bold">Welcome back</h2></div></div>
        <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">Sign in to see your prescriptions, medicines, tests, appointments, and follow-up care in one place.</p>
        <div className="mt-7 flex flex-col gap-4"><label className="text-sm font-bold">Email or phone<input className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:ring-2 focus:ring-primary/30" placeholder="you@example.com" type="email" /></label><label className="text-sm font-bold">Password<div className="relative mt-2"><input className="h-12 w-full rounded-xl border border-border bg-background px-4 pr-16 outline-none focus:ring-2 focus:ring-primary/30" placeholder="Enter your password" type={showPassword ? 'text' : 'password'} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-primary">{showPassword ? 'Hide' : 'Show'}</button></div></label><button onClick={() => setSignedIn(true)} className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5"><LockKeyhole className="size-4" />Sign in to my care</button><button type="button" onClick={() => setSignedIn(true)} className="text-sm font-bold text-primary">Create a new patient account</button></div>
        <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">Prototype preview: account data will connect to secure patient records when authentication is enabled.</p>
      </> : <PatientDashboard onSignOut={() => setSignedIn(false)} />}
    </div>
    <div className="rounded-3xl bg-primary p-7 text-primary-foreground sm:p-9"><HeartPulse className="size-8 text-accent" /><h2 className="mt-8 font-display text-2xl font-bold">Your health, remembered.</h2><p className="mt-3 text-sm leading-6 text-primary-foreground/75">MedThread keeps the details that matter close, so every consultation can start with context.</p><div className="mt-8 flex flex-col gap-4">{[['Prescriptions', 'Safe and organized'], ['Care timeline', 'Every visit in one story'], ['Reports', 'Ready when you need them']].map(([label, detail]) => <div key={label} className="flex items-center gap-3 border-b border-primary-foreground/15 pb-4"><span className="grid size-9 place-items-center rounded-xl bg-primary-foreground/10"><CircleCheck className="size-4 text-accent" /></span><div><p className="text-sm font-bold">{label}</p><p className="text-xs text-primary-foreground/60">{detail}</p></div></div>)}</div></div>
  </div>
}

function PatientDashboard({ onSignOut }: { onSignOut: () => void }) {
  return <div><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Patient dashboard</p><h2 className="mt-1 font-display text-2xl font-bold">Good morning, Priya</h2><p className="mt-2 text-sm text-muted-foreground">Here is your care snapshot.</p></div><button onClick={onSignOut} className="text-sm font-bold text-primary">Sign out</button></div><div className="mt-8 grid gap-3 sm:grid-cols-2">{[['Next appointment', 'Dr. Ananya Sharma', 'Today · 4:30 PM', Video], ['Medicines', '2 reminders today', 'Next · 7:00 PM', Pill], ['Reports', '3 health reports', '1 new result', FileText], ['Care timeline', '12-day follow-up', 'Updated yesterday', Activity]].map(([title, main, sub, Icon]) => <div key={title as string} className="rounded-2xl border border-border bg-background p-4"><span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary"><Icon className="size-4" /></span><p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">{title as string}</p><p className="mt-1 font-display text-sm font-bold">{main as string}</p><p className="mt-1 text-xs text-muted-foreground">{sub as string}</p></div>)}</div><div className="mt-5 rounded-2xl bg-secondary p-4"><p className="text-sm font-bold text-primary">Your next step</p><p className="mt-1 text-sm text-muted-foreground">Complete your health profile before your next consultation.</p><button className="mt-3 text-sm font-bold text-primary">Open health profile →</button></div></div>
}

function AppView({ view, query, setQuery, located, getLocation, matched, findDoctor, listening, setListening, transcript, setTranscript, voiceError }: { view: View; query: string; setQuery: (v: string) => void; located: boolean; getLocation: () => void; matched: boolean; findDoctor: () => void; listening: boolean; setListening: () => void; transcript: string; setTranscript: (v: string) => void; voiceError: string }) {
  const config = { doctors: ['Find your doctor', 'Verified care, closer to you.', Stethoscope], symptoms: ['Tell us how you feel', 'Voice-first triage that listens before it advises.', Activity], tests: ['Tests & diagnostics', 'Book, track, and understand your health reports.', FlaskConical], medicines: ['Your medicines', 'Simple reminders for a healthier routine.', Pill], account: ['Your medical account', 'A private home for your care journey.', UserRound] }[view]
  const Icon = config[2]
  return <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><button className="mb-5 text-sm font-semibold text-primary" onClick={() => window.history.back()}>← Back to overview</button><div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary"><Icon className="size-6" /></span><div><p className="eyebrow">MedThread care hub</p><h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{config[0]}</h1></div></div><p className="mt-4 max-w-xl text-lg text-muted-foreground">{config[1]}</p></div>{view === 'doctors' && <button onClick={getLocation} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-bold text-primary"><LocateFixed className="size-4" />{located ? 'Location found' : 'Use my location'}</button>}</div>
    {view === 'account' && <AccountPrototype />}
    {view === 'doctors' && <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]"><div><div className="flex gap-2"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by specialty, doctor, or care need" className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 outline-none focus:ring-2 focus:ring-primary/30" /></div><button onClick={findDoctor} className="rounded-xl bg-primary px-4 font-bold text-primary-foreground">{matched ? <CircleCheck className="size-5" /> : 'Search'}</button></div><p className="mt-6 text-sm font-bold text-muted-foreground">{located ? 'Showing doctors near your location' : 'Popular near you'} · 24 doctors available</p><div className="mt-4 space-y-3">{doctors.filter((d) => !query || `${d.name} ${d.specialty}`.toLowerCase().includes(query.toLowerCase())).map((d) => <div key={d.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"><div className="flex items-start gap-4"><div className={`grid size-12 place-items-center rounded-full ${d.color} text-sm font-bold text-white`}>{d.initials}</div><div className="flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><div><h3 className="font-display font-bold">{d.name}</h3><p className="text-sm text-muted-foreground">{d.specialty}</p></div><span className="flex items-center gap-1 text-xs font-bold text-emerald-600"><span className="size-2 rounded-full bg-emerald-500" />{d.time}</span></div><div className="mt-3 flex gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1"><MapPin className="size-3" />{d.distance}</span><span className="flex items-center gap-1"><Video className="size-3" />Video or in-person</span></div></div></div><button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground">Connect with {d.name.split(' ')[1]} <ChevronRight className="size-4" /></button></div>)}</div></div><div className="relative min-h-[390px] overflow-hidden rounded-2xl border border-border bg-[#dfeae4] map-grid"><div className="absolute inset-0 opacity-40" /><div className="absolute left-[20%] top-[30%] grid size-8 animate-bounce place-items-center rounded-full bg-accent text-accent-foreground shadow-lg"><MapPin className="size-4" /></div><div className="absolute left-[58%] top-[45%] grid size-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg"><MapPin className="size-4" /></div><div className="absolute left-[38%] top-[68%] grid size-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg"><MapPin className="size-4" /></div><div className="absolute bottom-4 left-4 right-4 rounded-xl bg-card/95 p-3 shadow-lg backdrop-blur"><p className="flex items-center gap-2 text-sm font-bold"><Navigation className="size-4 text-primary" />{located ? 'Your location · Nearby care' : 'Delhi NCR · Nearby care'}</p><a href="https://www.google.com/maps/search/doctor+near+me" target="_blank" rel="noreferrer" className="mt-1 block text-xs font-semibold text-primary underline">Open in Google Maps</a></div></div></div>}
    {view === 'symptoms' && <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]"><div className="rounded-3xl border border-border bg-card p-6 sm:p-10"><div className="mx-auto max-w-md text-center"><button onClick={setListening} className={`mx-auto grid size-32 place-items-center rounded-full text-primary-foreground shadow-xl transition ${listening ? 'bg-accent mic-ring' : 'bg-primary hover:scale-105'}`} aria-label={listening ? 'Stop listening' : 'Start listening'}><Mic className="size-11" /></button><h2 className="mt-7 font-display text-xl font-bold">{listening ? 'Listening to you…' : transcript ? 'We heard you' : 'Start with your voice'}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{listening ? 'Speak clearly in English or Hindi. Tap the microphone to stop.' : 'Tap the microphone and describe what you are feeling naturally.'}</p>{transcript ? <div className="mt-6 rounded-2xl border border-primary/20 bg-secondary p-4 text-left"><p className="text-xs font-bold uppercase tracking-wider text-primary">Your symptom note</p><textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} rows={3} className="mt-2 w-full resize-none bg-transparent text-sm leading-6 text-foreground outline-none" aria-label="Your transcribed symptoms" /></div> : <div className="mt-7 flex flex-wrap justify-center gap-2">{['Headache', 'Fever', 'Cough', 'Stomach pain'].map((x) => <button onClick={() => setTranscript(`I have ${x.toLowerCase()}`)} key={x} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary">{x}</button>)}</div>}{voiceError && <p role="alert" className="mt-4 rounded-xl bg-accent/20 px-3 py-2 text-xs font-semibold text-accent-foreground">{voiceError}</p>}<p className="mt-5 text-xs text-muted-foreground">Your browser may ask for microphone permission.</p></div></div><div className="rounded-3xl bg-primary p-6 text-primary-foreground"><ShieldCheck className="size-7 text-accent" /><h3 className="mt-5 font-display text-xl font-bold">A safe first step</h3><p className="mt-3 text-sm leading-6 text-primary-foreground/75">Our triage assistant organizes your symptoms for a doctor. It does not diagnose or replace professional medical advice.</p><div className="mt-8 space-y-3 text-sm">{['Speak in your preferred language', 'Get urgency guidance', 'Share a clear summary with a doctor'].map((x) => <p key={x} className="flex items-center gap-2"><CircleCheck className="size-4 text-accent" />{x}</p>)}</div></div></div>}
    {view === 'tests' && <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[['Complete Blood Count', 'City Diagnostics · Tomorrow, 10:00 AM', 'Confirmed'], ['Lipid Profile', 'Apollo Diagnostics · 02 May 2026', 'Report ready'], ['Thyroid Panel', 'Nearby labs · Book a test', 'Recommended']].map(([name, detail, status]) => <div key={name} className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><FlaskConical className="size-5" /></span><span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-primary">{status}</span></div><h3 className="mt-5 font-display font-bold">{name}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p><button className="mt-5 flex items-center gap-1 text-sm font-bold text-primary">View details <ChevronRight className="size-4" /></button></div>)}</div>}
    {view === 'medicines' && <div className="mt-10 grid gap-4 md:grid-cols-2">{[['09:00 AM', 'Paracetamol 650 mg', 'After breakfast', true], ['01:00 PM', 'Vitamin D3', 'With lunch', false], ['07:00 PM', 'Cetirizine 10 mg', 'After dinner', false]].map(([time, name, note, done]) => <div key={name as string} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"><span className="grid size-12 place-items-center rounded-xl bg-secondary text-primary"><Pill className="size-5" /></span><div className="flex-1"><p className="font-mono text-sm font-bold text-primary">{time as string}</p><h3 className="font-display font-bold">{name as string}</h3><p className="text-sm text-muted-foreground">{note as string}</p></div>{done ? <span className="grid size-9 place-items-center rounded-full bg-emerald-100 text-emerald-700"><CircleCheck className="size-5" /></span> : <button className="grid size-9 place-items-center rounded-full border border-primary text-primary"><Play className="size-4" /></button>}</div>)}</div>}
  </main>
}
