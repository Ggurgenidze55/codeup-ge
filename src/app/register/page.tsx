'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Code2, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('პაროლები არ ემთხვევა'); return }
    if (form.password.length < 6) { setError('პაროლი მინიმუმ 6 სიმბოლო უნდა იყოს'); return }
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false) }
    else router.push('/login?registered=1')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#6C63FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">რეგისტრაცია</h1>
          <p className="text-[#8888AA] mt-2">შექმენი ანგარიში და დაიწყე სწავლა</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'სახელი', type: 'text', placeholder: 'გიორგი ბერიძე' },
              { key: 'email', label: 'ელ-ფოსტა', type: 'email', placeholder: 'შენი@ელ-ფოსტა.ge' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-[#8888AA] mb-2">{f.label}</label>
                <input
                  type={f.type}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full bg-[#0A0A0F] border border-[#2A2A3C] rounded-lg px-4 py-3 text-white placeholder-[#4A4A6A] focus:outline-none focus:border-[#6C63FF] transition-colors"
                  placeholder={f.placeholder}
                  required
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-[#8888AA] mb-2">პაროლი</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-[#0A0A0F] border border-[#2A2A3C] rounded-lg px-4 py-3 pr-12 text-white placeholder-[#4A4A6A] focus:outline-none focus:border-[#6C63FF] transition-colors"
                  placeholder="მინიმუმ 6 სიმბოლო"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8888AA] hover:text-white">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8888AA] mb-2">გაიმეორე პაროლი</label>
              <input
                type="password"
                value={form.confirm}
                onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                className="w-full bg-[#0A0A0F] border border-[#2A2A3C] rounded-lg px-4 py-3 text-white placeholder-[#4A4A6A] focus:outline-none focus:border-[#6C63FF] transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'შექმნა...' : 'ანგარიშის შექმნა'}
            </button>
          </form>
          <p className="text-center text-[#8888AA] text-sm mt-6">
            უკვე გაქვს ანგარიში?{' '}
            <Link href="/login" className="text-[#6C63FF] hover:underline font-medium">შესვლა</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
