'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase, type Song, type Section } from '@/lib/supabase'

function splitLines(text: string): string[] {
  return text
    .split(/\s*\/\s*|\n/)
    .map(l => l.trim())
    .map(l => l.replace(/^\d+\.?\s*/, ''))
    .map(l => l.replace(/^Koro:\s*/i, ''))
    .map(l => l.replace(/^Chorus:\s*/i, ''))
    .filter(l => l.length > 0)
}

export default function SongPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [song, setSong] = useState<Song | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [layout, setLayout] = useState<'side' | 'stacked'>('side')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    supabase
      .from('songs')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data: songData }) => {
        if (!songData) return
        setSong(songData)
        supabase
          .from('sections')
          .select('*')
          .eq('song_id', songData.id)
          .order('order_num')
          .then(({ data: sectionData }) => {
            setSections(sectionData || [])
            setLoading(false)
          })
      })
  }, [slug])

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center text-gray-400 text-sm">
      Loading...
    </div>
  )

  if (!song) return (
    <div className="min-h-screen bg-white flex items-center justify-center text-gray-400 text-sm">
      Song not found
    </div>
  )

  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            &larr;
          </button>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">{song.title_tr}</h1>
            <p className="text-xs text-gray-500">{song.title_en}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setLayout('side')}
            className={layout === 'side' ? 'text-xs px-3 py-1.5 rounded-lg border bg-indigo-600 text-white border-indigo-600' : 'text-xs px-3 py-1.5 rounded-lg border bg-white text-gray-500 border-gray-200'}
          >
            Side by side
          </button>
          <button
            onClick={() => setLayout('stacked')}
            className={layout === 'stacked' ? 'text-xs px-3 py-1.5 rounded-lg border bg-indigo-600 text-white border-indigo-600' : 'text-xs px-3 py-1.5 rounded-lg border bg-white text-gray-500 border-gray-200'}
          >
            Stacked
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {sections.map((section) => {
          const trLines = splitLines(section.lines_tr)
          const enLines = splitLines(section.lines_en)
          return (
            <div key={section.id} className="mb-8">
              <p className="text-xs font-medium text-indigo-500 uppercase tracking-wide mb-3">
                {section.label}
              </p>
              {layout === 'side' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 mb-2">🇹🇷 Türkçe</p>
                    {trLines.map((line, i) => (
                      <p key={i} className="text-sm font-medium text-gray-900 leading-relaxed">{line}</p>
                    ))}
                  </div>
                  <div className="space-y-1 border-l border-gray-100 pl-4">
                    <p className="text-xs text-gray-400 mb-2">🇺🇸 English</p>
                    {enLines.map((line, i) => (
                      <p key={i} className="text-sm italic text-gray-500 leading-relaxed">{line}</p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {trLines.map((line, i) => (
                    <div key={i}>
                      <p className="text-sm font-medium text-gray-900 leading-relaxed">{line}</p>
                      <p className="text-xs italic text-gray-500 leading-relaxed mt-0.5">{enLines[i] || ''}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
        {song.artist && (
          <p className="text-xs text-gray-400 text-center mt-8 border-t border-gray-100 pt-4">{song.artist}</p>
        )}
      </div>
    </main>
  )
}
