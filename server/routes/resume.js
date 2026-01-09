import express from "express"
import { createClient } from "@supabase/supabase-js"

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Update profile (admin only)
router.post("/update-profile", async (req, res) => {
  const { name, role, email, phone, location, summary } = req.body

  if (!name || !role) {
    return res.status(400).json({ error: "กรุณากรอกชื่อและตำแหน่งงาน" })
  }

  try {
    const { error } = await supabase.from("profile").upsert({
      id: 1,
      name,
      role,
      email,
      phone,
      location,
      summary,
      updated_at: new Date().toISOString(),
    })

    if (error) throw error

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
