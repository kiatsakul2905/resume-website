import { mySupabase } from "./supabase.js"

async function loadResume() {
  try {
    // ===== Load profile =====
    const { data: profile, error: profileError } = await mySupabase
      .from("profile")
      .select("name, role, summary, avatar_url")
      .single()

    if (profileError) throw profileError
    console.log("Profile data:", profile)

    document.getElementById("name").textContent = profile.name || "John Doe"
    document.getElementById("role").textContent = profile.role || "Full Stack Developer"
    document.getElementById("summary").textContent = profile.summary || "Passionate developer..."

    const avatarImg = document.getElementById("avatar-img")
    const avatarText = document.getElementById("avatar-text")

    if (profile.avatar_url && avatarImg) {
      avatarImg.src = profile.avatar_url
      avatarImg.style.display = "block"
      avatarText.style.display = "none"
    } else {
      const initials = (profile.name || "John Doe")
        .split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
      avatarText.textContent = initials
      avatarText.style.display = "flex"
      if (avatarImg) avatarImg.style.display = "none"
    }

    // ===== Load experience =====
    const { data: expData, error: expError } = await mySupabase
      .from("experience")
      .select("*")
      .order("id", { ascending: true })

    if (!expError && expData) {
      const expList = document.getElementById("experience")
      if (expList) {
        expList.innerHTML = ""
        expData.forEach(exp => {
          expList.innerHTML += `
            <div class="experience-item">
              <div class="experience-header">
                <h3>${exp.position || "Position"}</h3>
                <span class="date">${exp.year_start || ""} - ${exp.year_end || ""}</span>
              </div>
              <p class="company">${exp.company || "Company"}</p>
              <ul class="description">
                ${(exp.description || "").split("\n").map(d => d.trim() ? `<li>${d}</li>` : "").join("")}
              </ul>
            </div>
          `
        })
      }
    }

    // ===== Load education =====
    const { data: eduData, error: eduError } = await mySupabase
      .from("education")
      .select("*")
      .order("date_start", { ascending: false })

    if (!eduError && eduData) {
      const eduList = document.getElementById("education")
      if (eduList) {
        eduList.innerHTML = ""
        eduData.forEach(edu => {
          eduList.innerHTML += `
            <div class="education-item">
              <div class="education-header">
                <h3>${edu.school || "School"}</h3>
                <span class="date">${edu.date_start || ""} - ${edu.date_end || ""}</span>
              </div>
              <p class="school">${edu.details || "Details"}</p>
            </div>
          `
        })
      }
    }

    // ===== Load certificates =====
    const { data: certData, error: certError } = await mySupabase
      .from("certificates")
      .select("id, name, detail, image_url, year")
      .order("year", { ascending: false })

    if (!certError && certData) {
      const certList = document.getElementById("certificates")
      if (certList) {
        certList.innerHTML = ""
        certData.forEach(cert => {
          certList.innerHTML += `
            <div class="certificate-item">
              <img src="${cert.image_url || 'https://via.placeholder.com/80x80?text=Cert'}" 
                   alt="${cert.name || "Certificate"}" class="certificate-img">
              <div class="certificate-content">
                <h3>${cert.name || "Certificate"}</h3>
                <p class="certificate-issuer">${cert.detail || "-"}</p>
                <span class="date">${cert.year || "-"}</span>
              </div>
            </div>
          `
        })
      }
    }

    // ===== Load portfolio + skills =====
    const { data: portData, error: portError } = await mySupabase
      .from("portfolio")
      .select(`
        id,
        title,
        description,
        image_url,
        created_at,
        portfolio_skills (
          skill:skills(name, type)
        )
      `)
      .order("created_at", { ascending: false })

    if (!portError && portData) {
      const portList = document.getElementById("portfolio")
      if (portList) {
        portList.innerHTML = ""
        portData.forEach(port => {
          const skills = port.portfolio_skills || []
          portList.innerHTML += `
            <div class="portfolio-item">
              <img src="${port.image_url || 'https://via.placeholder.com/400x200?text=Project'}" 
                   alt="${port.title || "Project"}" class="portfolio-img">
              <div class="portfolio-content">
                <h3>${port.title || "Project"}</h3>
                <p>${port.description || ""}</p>
                <div class="tech-stack">
                  ${skills.map(s => `<span class="tech-tag">${s.skill.name}</span>`).join("")}
                </div>
              </div>
            </div>
          `
        })
      }
    }

    // ===== Load skills =====
    const { data: skillData, error: skillError } = await mySupabase
      .from("skills")
      .select("name, type")

    if (!skillError && skillData) {
      const skillList = document.getElementById("skills")
      if (skillList) {
        skillList.innerHTML = ""
        const skillsByType = {}
        skillData.forEach(skill => {
          const type = skill.type || "Other"
          if (!skillsByType[type]) skillsByType[type] = []
          skillsByType[type].push(skill.name)
        })
        Object.keys(skillsByType).forEach(type => {
          skillList.innerHTML += `
            <div class="skill-category">
              <h4>${type}</h4>
              <div class="skill-tags">
                ${skillsByType[type].map(s => `<span class="skill-tag">${s}</span>`).join("")}
              </div>
            </div>
          `
        })
      }
    }

    // ===== Load contact =====
    const { data: contactData, error: contactError } = await mySupabase
      .from("contact")
      .select("email, phone, location, github")
      .single()

    if (!contactError && contactData) {
      const emailEl = document.querySelector('a[href^="mailto:"]')
      if (emailEl) {
        emailEl.href = `mailto:${contactData.email || ""}`
        emailEl.textContent = contactData.email || ""
      }

      const phoneEl = document.querySelector('a[href^="tel:"]')
      if (phoneEl) {
        phoneEl.href = `tel:${contactData.phone || ""}`
        phoneEl.textContent = contactData.phone || ""
      }

      const locationEl = document.querySelector('[data-contact="location"]')
      if (locationEl) locationEl.textContent = contactData.location || ""

      const githubEl = document.querySelector('[data-contact="github"]')
      if (githubEl) {
        githubEl.href = contactData.github || "#"
        githubEl.textContent = (contactData.github || "").replace(/^https?:\/\//, "")
        githubEl.target = "_blank"
        githubEl.rel = "noopener"
      }
    }

  } catch (err) {
    console.error("Error loading public data:", err.message)
  }
}

// Auto-load
if (document.getElementById("resume")) {
  loadResume()
}
