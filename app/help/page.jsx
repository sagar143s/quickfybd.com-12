'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

import Loading from '@/components/Loading'
import Link from 'next/link'
import DashboardSidebar from '@/components/DashboardSidebar'
import { Mail, MessageCircle, Phone, HelpCircle } from 'lucide-react'

export default function HelpPage() {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u ?? null))
    return () => unsub()
  }, [])

  if (user === undefined) return <Loading />

  if (user === null) {
    return (
      <>
        {/* <Navbar /> removed, now global via ClientLayout */}
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-semibold text-slate-800 mb-3">Help & Support</h1>
          <p className="text-slate-600 mb-6">Please sign in to access help and support.</p>
          <Link href="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg">Go to Home</Link>
        </div>
        {/* <Footer /> removed, now global via ClientLayout */}
      </>
    )
  }

  return (
    <>
      {/* <Navbar /> removed, now global via ClientLayout */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardSidebar />
        <main className="md:col-span-3">
          <h1 className="text-2xl font-semibold text-slate-800 mb-6">Help & Support</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <Mail className="text-blue-600 mb-3" size={32} />
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Email Support</h2>
              <p className="text-slate-600 text-sm mb-4">Get help via email within 24 hours.</p>
              <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
                support@example.com
              </a>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <MessageCircle className="text-green-600 mb-3" size={32} />
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Live Chat</h2>
              <p className="text-slate-600 text-sm mb-4">Chat with our support team.</p>
              <button className="text-blue-600 hover:underline">Start Chat</button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <Phone className="text-orange-600 mb-3" size={32} />
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Phone Support</h2>
              <p className="text-slate-600 text-sm mb-4">Call us Mon-Fri 9AM-6PM.</p>
              <a href="tel:+1234567890" className="text-blue-600 hover:underline">
                +1 (234) 567-890
              </a>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <HelpCircle className="text-purple-600 mb-3" size={32} />
              <h2 className="text-lg font-semibold text-slate-800 mb-2">FAQ</h2>
              <p className="text-slate-600 text-sm mb-4">Find answers to common questions.</p>
              <Link href="/faq" className="text-blue-600 hover:underline">Browse FAQ</Link>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Submit a Ticket</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Brief description of your issue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200">
                  <option>Order Issue</option>
                  <option>Product Question</option>
                  <option>Payment Issue</option>
                  <option>Account Issue</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  rows={5}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Provide details about your issue..."
                />
              </div>
              <button 
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        </main>
      </div>
      {/* <Footer /> removed, now global via ClientLayout */}
    </>
  )
}
