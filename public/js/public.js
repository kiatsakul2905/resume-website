// /js/public.js
import { mySupabase } from "./supabase.js"

// ===== Load Resume Data =====
export async function loadResume() {
  try {
    const { data: profileData, error: profileError } = await mySupabase
      .from("profile")
      .select("name, role, summary, avatar_url")
      .single()

    if (profileError) throw profileError

    if (profileData) {
      document.getElementById("name").textContent = profileData.name || "John Doe"
      document.getElementById("role").textContent = profileData.role || "Full Stack Developer"
      document.getElementById("summary").textContent = profileData.summary || "Passionate developer..."
      // Avatar
      const avatarImg = document.getElementById("avatar-img")
      const avatarText = document.getElementById("avatar-text")
      if (profileData.avatar_url && avatarImg) {
        avatarImg.src = profileData.avatar_url
        avatarImg.style.display = "block"
        avatarText.style.display = "none"
      } else if (avatarText) {
        const initials = (profileData.name || "John Doe").split(" ").map(n => n[0]).join("").substring(0,2).toUpperCase()
        avatarText.textContent = initials
        avatarText.style.display = "flex"
      }
    }

    // load experience, education, certificates... (เหมือนเดิม)
    // ตัวอย่างเรียกใช้ portfolio, skills, contact
  } catch (err) {
    console.error("Error loading resume:", err.message)
  }
}

// Auto-load
if (document.getElementById("resume")) {
  loadResume()
}
