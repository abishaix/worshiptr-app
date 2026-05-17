'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase, type Song } from '@/lib/supabase'

const CATEGORIES = ['all', 'worship', 'praise', 'hymn', 'psalm', 'christmas', 'easter']

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([])
  const [filtered, setFiltered] = useState<Song[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('songs')
      .select('*')
      .order('title_tr')
      .then(({ data }) => {
        setSongs(data || [])
        setFiltered(data || [])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let result = songs
    if (category !== 'all') result = result.filter(s => s.category === category)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(s =>
        s.title_tr.toLowerCase().includes(q) ||
        s.title_en.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, category, songs])

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <span className="text-white text-sm">♪</span>
        </div>
        <div>
          <h1 className="text-base font-semibold text-gray-900">WorshipTR</h1>
          <p className="text-xs text-gray-500">Turkish worship in English</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-4">
          <span className="text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search in Turkish or English..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                category === cat
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Song list */}
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading songs...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">No songs found</div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map(song => (
              <Link
                key={song.id}
                href={`/songs/${song.slug}`}
                className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{song.title_tr}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{song.title_en}</p>
                </div>
                <div className="flex items-center gap-2">
                  {song.category && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                      {song.category}
                    </span>
                  )}
                  <span className="text-gray-300">›</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          {filtered.length} of {songs.length} songs
        </p>
      </div>
    </main>
  )
}
