async function saveResume() {
  const name = document.getElementById("name").value
  const role = document.getElementById("role").value
  const email = document.getElementById("email").value
  const phone = document.getElementById("phone").value
  const location = document.getElementById("location").value
  const summary = document.getElementById("summary").value

  if (!name || !role) {
    alert("กรุณากรอกชื่อและตำแหน่งงาน")
    return
  }

  try {
    const res = await fetch("http://localhost:3000/api/resume/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role, email, phone, location, summary })
    })

    const data = await res.json()

    if (data.error) throw new Error(data.error)

    alert("บันทึกข้อมูลสำเร็จ")
    window.location.href = "index.html"
  } catch (err) {
    alert("บันทึกข้อมูลไม่สำเร็จ: " + err.message)
  }
}
