import { useEffect, useState } from 'react'
import { Calendar, MapPin, Users, Plus, Ticket, GraduationCap } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Header() {
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 grid place-items-center text-white font-bold">F</div>
          <div>
            <h1 className="text-xl font-bold">FESdmiT</h1>
            <p className="text-xs text-slate-500 -mt-1">College Event Registration</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
          <a href="#events" className="hover:text-indigo-600">Events</a>
          <a href="#register" className="hover:text-indigo-600">Register</a>
          <a href="/test" className="hover:text-indigo-600">System Test</a>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-sky-50">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 text-indigo-700 px-3 py-1 text-xs font-medium">FESdmiT • Modern College Fests</div>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">Discover. Register. Participate.</h2>
          <p className="mt-4 text-slate-600">Browse upcoming college events, workshops, and competitions. Secure your spot in seconds with a simple registration flow.</p>
          <div className="mt-6 flex gap-3">
            <a href="#register" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg font-semibold shadow-sm transition"><Ticket size={18}/> Quick Register</a>
            <a href="#events" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 px-5 py-3 rounded-lg font-semibold border shadow-sm transition">Explore Events</a>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-video rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 p-1 shadow-lg">
            <div className="w-full h-full rounded-lg bg-white grid md:grid-cols-2 p-4">
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 text-indigo-600 font-semibold"><Calendar size={18}/> FES Week</div>
                <h3 className="text-2xl font-bold mt-2">Tech Symposium 2025</h3>
                <p className="text-slate-600 text-sm mt-1">Workshops • Hackathon • Keynotes</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-3">
                  <span className="inline-flex items-center gap-1"><MapPin size={14}/> Main Auditorium</span>
                  <span className="inline-flex items-center gap-1"><Users size={14}/> 300 seats</span>
                </div>
              </div>
              <div className="hidden md:block rounded-lg bg-gradient-to-br from-indigo-100 to-sky-100"/>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 hidden md:flex items-center gap-2 bg-white border rounded-full px-3 py-2 shadow"><GraduationCap size={16} className="text-indigo-600"/> Powered by Students</div>
        </div>
      </div>
    </section>
  )
}

function EventCard({ ev, onSelect }) {
  return (
    <button onClick={() => onSelect(ev)} className="w-full text-left group">
      <div className="p-5 rounded-xl border bg-white hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold group-hover:text-indigo-700">{ev.title}</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">{new Date(ev.date).toLocaleDateString()}</span>
        </div>
        <p className="text-slate-600 mt-1 line-clamp-2">{ev.description || 'No description'}</p>
        <div className="flex items-center gap-3 text-xs text-slate-500 mt-3">
          <span className="inline-flex items-center gap-1"><MapPin size={14}/> {ev.location}</span>
          {ev.capacity && <span className="inline-flex items-center gap-1"><Users size={14}/> {ev.capacity} seats</span>}
        </div>
        {ev.tags && (
          <div className="mt-3 flex flex-wrap gap-2">
            {ev.tags.map((t, i) => (
              <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
        )}
      </div>
    </button>
  )
}

function EventList({ onSelect }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/events`)
        const data = await res.json()
        setEvents(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section id="events" className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Upcoming Events</h2>
        <span className="text-sm text-slate-500">{events.length} events</span>
      </div>
      {loading ? (
        <p className="text-slate-500">Loading events...</p>
      ) : events.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(ev => (
            <EventCard key={ev.id} ev={ev} onSelect={onSelect} />
          ))}
        </div>
      )}
    </section>
  )
}

function EmptyState() {
  return (
    <div className="p-8 rounded-xl border bg-white text-center">
      <p className="text-slate-600">No events yet. Be the first to add one below.</p>
    </div>
  )
}

function CreateEvent({ onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', capacity: '' })
  const [tag, setTag] = useState('')
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(false)

  const addTag = () => {
    if (!tag.trim()) return
    setTags(prev => [...prev, tag.trim()])
    setTag('')
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        capacity: form.capacity ? Number(form.capacity) : undefined,
        date: new Date(form.date).toISOString(),
        tags: tags.length ? tags : undefined,
      }
      const res = await fetch(`${API_BASE}/api/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (data.id) {
        onCreated()
        setForm({ title: '', description: '', date: '', location: '', capacity: '' })
        setTags([])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="register" className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Add an Event</h2>
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-4 bg-white p-6 rounded-xl border">
        <input required className="input" placeholder="Event title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
        <input required className="input" placeholder="Location" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} />
        <input required type="datetime-local" className="input" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
        <input className="input" placeholder="Capacity (optional)" value={form.capacity} onChange={e=>setForm({...form, capacity:e.target.value})} />
        <textarea className="input md:col-span-2" rows={3} placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}></textarea>
        <div className="md:col-span-2 flex items-center gap-2">
          <input className="input" placeholder="Add tag and press +" value={tag} onChange={e=>setTag(e.target.value)} />
          <button type="button" onClick={addTag} className="btn-secondary inline-flex items-center gap-1"><Plus size={16}/> Add</button>
          <div className="flex gap-2 flex-wrap">
            {tags.map((t,i)=> <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{t}</span>)}
          </div>
        </div>
        <div className="md:col-span-2">
          <button disabled={loading} className="btn-primary inline-flex items-center gap-2"><Calendar size={18}/> {loading ? 'Saving...' : 'Create Event'}</button>
        </div>
      </form>
    </section>
  )
}

function RegisterModal({ ev, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', department: '', year: '', roll_no: '', phone: '' })
  const [loading, setLoading] = useState(false)
  if (!ev) return null

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, event_id: ev.id }
      const res = await fetch(`${API_BASE}/api/registrations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (data.id) onClose()
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-black/30 p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl" onClick={e=>e.stopPropagation()}>
        <h3 className="text-xl font-bold">Register for {ev.title}</h3>
        <p className="text-sm text-slate-600">{new Date(ev.date).toLocaleString()} • {ev.location}</p>
        <form onSubmit={submit} className="mt-4 grid gap-3">
          <input required className="input" placeholder="Full name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input required type="email" className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          <div className="grid grid-cols-2 gap-3">
            <input className="input" placeholder="Department" value={form.department} onChange={e=>setForm({...form, department:e.target.value})} />
            <input className="input" placeholder="Year" value={form.year} onChange={e=>setForm({...form, year:e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="input" placeholder="Roll No" value={form.roll_no} onChange={e=>setForm({...form, roll_no:e.target.value})} />
            <input className="input" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button disabled={loading} className="btn-primary">{loading ? 'Submitting...' : 'Submit'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="py-10 border-t mt-10">
      <div className="max-w-6xl mx-auto px-4 text-sm text-slate-600 flex items-center justify-between">
        <p>© {new Date().getFullYear()} FESdmiT • All rights reserved</p>
        <a href="/test" className="text-indigo-600 hover:underline">System Test</a>
      </div>
    </footer>
  )
}

function App() {
  const [selected, setSelected] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = () => setRefreshKey(k => k + 1)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <Hero />
      <EventList key={refreshKey} onSelect={setSelected} />
      <CreateEvent onCreated={refresh} />
      {selected && <RegisterModal ev={selected} onClose={() => setSelected(null)} />}
      <Footer />

      {/* tiny css helpers */}
      <style>{`
        .input{ @apply w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white } 
        .btn-primary{ @apply bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition } 
        .btn-secondary{ @apply bg-white border hover:bg-slate-50 text-slate-900 px-4 py-2 rounded-lg font-semibold transition }
      `}</style>
    </div>
  )
}

export default App
