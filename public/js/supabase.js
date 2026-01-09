// supabase.js (public)
export const SUPABASE_URL = "https://hyczlzenlaxozoqhsjmu.supabase.co"

// ใช้ **public key** เท่านั้น (ไม่ใช่ service_role / admin key)
export const SUPABASE_KEY = "sb_publishable_emPrCoyCJvTojvQDNr4MnA_sITKIqbk"

// สร้าง client
export const mySupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
