// /api/saveResume.js
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // ใส่ใน .env เท่านั้น
)

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, role, email, phone, location, summary } = req.body
    const { error } = await supabase.from("profile").upsert({
      id: 1,
      name,
      role,
      email,
      phone,
      location,
      summary,
      updated_at: new Date().toISOString()
    })
    if (error) return res.status(500).json({ error: error.message })
    res.status(200).json({ message: "Success" })
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
const { publicURL } = supabase.storage
  .from("resume-pdfs")
  .getPublicUrl("myresume.pdf")

document.getElementById("resume-pdf").href = publicURL

