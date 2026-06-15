'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewCoursePage() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', slug: '', description: '', level: 'BEGINNER', price: '0', icon: '', color: '#6C63FF' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
    })
    if (res.ok) {
      router.push('/admin/courses')
    } else {
      const d = await res.json()
      setError(d.error || 'შეცდომა')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-8">ახალი კურსი</h1>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { key: 'title', label: 'სათაური', type: 'text', placeholder: 'JavaScript — სრული კურსი' },
              { key: 'slug', label: 'Slug (URL)', type: 'text', placeholder: 'javascript' },
              { key: 'icon', label: 'Emoji Icon', type: 'text', placeholder: '⚡' },
              { key: 'color', label: 'ფერი (HEX)', type: 'text', placeholder: '#F7DF1E' },
              { key: 'price', label: 'ფასი ($)', type: 'number', placeholder: '69' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-[#8888AA] mb-2">{f.label}</label>
                <input
                  type={f.type}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full bg-[#0A0A0F] border border-[#2A2A3C] rounded-lg px-4 py-3 text-white placeholder-[#4A4A6A] focus:outline-none focus:border-[#6C63FF]"
                  placeholder={f.placeholder}
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-[#8888AA] mb-2">აღწერა</label>
              <textarea
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full bg-[#0A0A0F] border border-[#2A2A3C] rounded-lg px-4 py-3 text-white placeholder-[#4A4A6A] focus:outline-none focus:border-[#6C63FF] h-24 resize-none"
                placeholder="კურსის დეტალური აღწერა..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8888AA] mb-2">დონე</label>
              <select
                value={form.level}
                onChange={e => setForm(p => ({ ...p, level: e.target.value }))}
                className="w-full bg-[#0A0A0F] border border-[#2A2A3C] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#6C63FF]"
              >
                <option value="BEGINNER">დამწყები</option>
                <option value="INTERMEDIATE">საშუალო</option>
                <option value="ADVANCED">მოწინავე</option>
              </select>
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-50">
              {loading ? 'იქმნება...' : 'კურსის შექმნა'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
