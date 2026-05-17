import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Song = {
  id: number
  title_tr: string
  title_en: string
  slug: string
  artist: string | null
  category: string | null
}

export type Section = {
  id: number
  song_id: number
  label: string
  type: string
  order_num: number
  lines_tr: string
  lines_en: string
}
