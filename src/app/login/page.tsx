'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Code2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.error) {
      setError('არასწორი ელ-ფოსტა ან პაროლი')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#6C63FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">შესვლა</h1>
          <p className="text-[#8888AA] mt-2">გამარჯობა! შედი შენს ანგარიშზე.</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#8888AA] mb-2">ელ-ფოსტა</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#0A0A0F] border border-[#2A2A3C] rounded-lg px-4 py-3 text-white placeholder-[#4A4A6A] focus:outline-none focus:border-[#6C63FF] transition-colors"
                placeholder="შენი@ელ-ფოსტა.ge"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8888AA] mb-2">პაროლი</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-[#2A2A3C] rounded-lg px-4 py-3 pr-12 text-white placeholder-[#4A4A6A] focus:outline-none focus:border-[#6C63FF] transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8888AA] hover:text-white">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'შესვლა...' : 'შესვლა'}
            </button>
          </form>
          <p className="text-center text-[#8888AA] text-sm mt-6">
            ანგარიში არ გაქვს?{' '}
            <Link href="/register" className="text-[#6C63FF] hover:underline font-medium">დარეგისტრირდი</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
