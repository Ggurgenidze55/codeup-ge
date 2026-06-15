'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Menu, X, Code2, ChevronDown, User, LogOut, LayoutDashboard, Award } from 'lucide-react'

export function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-[#2A2A3C]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-[#6C63FF] rounded-lg flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white">Codeup<span className="text-[#6C63FF]">.ge</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/courses" className="text-[#8888AA] hover:text-white transition-colors">კურსები</Link>
          {session?.user && (
            <Link href="/dashboard" className="text-[#8888AA] hover:text-white transition-colors">ჩემი სწავლება</Link>
          )}
          <a href="#pricing" className="text-[#8888AA] hover:text-white transition-colors">ფასები</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 bg-[#12121A] border border-[#2A2A3C] rounded-lg px-3 py-2 text-sm hover:border-[#6C63FF] transition-colors"
              >
                <div className="w-7 h-7 bg-[#6C63FF] rounded-full flex items-center justify-center text-xs font-bold">
                  {session.user.name?.[0] || session.user.email?.[0] || 'U'}
                </div>
                <span className="text-white">{session.user.name || 'მომხმარებელი'}</span>
                <ChevronDown className="w-4 h-4 text-[#8888AA]" />
              </button>
              {userMenu && (
                <div className="absolute right-0 top-12 w-48 bg-[#12121A] border border-[#2A2A3C] rounded-xl overflow-hidden shadow-xl">
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm text-[#8888AA] hover:text-white hover:bg-[#1A1A28]" onClick={() => setUserMenu(false)}>
                    <LayoutDashboard className="w-4 h-4" /> დაფა
                  </Link>
                  <Link href="/certificates" className="flex items-center gap-2 px-4 py-3 text-sm text-[#8888AA] hover:text-white hover:bg-[#1A1A28]" onClick={() => setUserMenu(false)}>
                    <Award className="w-4 h-4" /> სერტიფიკატები
                  </Link>
                  {(session.user as any).role === 'ADMIN' && (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-3 text-sm text-[#6C63FF] hover:bg-[#1A1A28]" onClick={() => setUserMenu(false)}>
                      <User className="w-4 h-4" /> ადმინი
                    </Link>
                  )}
                  <hr className="border-[#2A2A3C]" />
                  <button onClick={() => signOut()} className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-400 hover:bg-[#1A1A28]">
                    <LogOut className="w-4 h-4" /> გამოსვლა
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-[#8888AA] hover:text-white text-sm transition-colors">შესვლა</Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-4">რეგისტრაცია</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#0A0A0F] border-b border-[#2A2A3C] px-4 py-4 flex flex-col gap-4">
          <Link href="/courses" className="text-[#8888AA] hover:text-white" onClick={() => setOpen(false)}>კურსები</Link>
          {session?.user ? (
            <>
              <Link href="/dashboard" className="text-[#8888AA] hover:text-white" onClick={() => setOpen(false)}>დაფა</Link>
              <button onClick={() => signOut()} className="text-red-400 text-left">გამოსვლა</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-[#8888AA] hover:text-white" onClick={() => setOpen(false)}>შესვლა</Link>
              <Link href="/register" className="btn-primary text-center" onClick={() => setOpen(false)}>რეგისტრაცია</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
