document.addEventListener("DOMContentLoaded", () => {
  // ===== Cookie Banner =====
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");

  if (cookieBanner && acceptBtn) {
    if (document.cookie.split("; ").find(row => row.startsWith("cookiesAccepted="))) {
      cookieBanner.style.display = "none";
    }

    acceptBtn.addEventListener("click", () => {
      document.cookie = "cookiesAccepted=true; max-age=" + 60*60*24*365 + "; path=/; SameSite=Lax";
      cookieBanner.style.display = "none";
    });
  }

  // ===== Mobile Menu Toggle =====
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // ===== Contact Form =====
  document.getElementById("contactForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const responseEl = document.getElementById("formResponse");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        responseEl.textContent = data.success;
        responseEl.style.color = "green";
        e.target.reset();
      } else {
        responseEl.textContent = data.error || "❌ Failed to send message.";
        responseEl.style.color = "red";
      }
    } catch (err) {
      responseEl.textContent = "❌ Something went wrong.";
      responseEl.style.color = "red";
    }
  });

  // ===== Order Form =====
  document.getElementById("orderForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const responseEl = document.getElementById("orderResponse");
    const fileErrorEl = document.getElementById("fileError");

    fileErrorEl.textContent = "";

    const files = form.querySelector("#file-upload").files;
    let totalSize = 0;
    const maxFileSize = 10 * 1024 * 1024;
    const maxTotalSize = 20 * 1024 * 1024;

    for (let file of files) {
      if (file.size > maxFileSize) {
        fileErrorEl.textContent = `❌ ${file.name} is too large (max 10MB each).`;
        return;
      }
      totalSize += file.size;
    }

    if (totalSize > maxTotalSize) {
      fileErrorEl.textContent = "❌ Total file size exceeds 20MB.";
      return;
    }

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        responseEl.textContent = data.success;
        responseEl.style.color = "green";
        form.reset();
      } else {
        responseEl.textContent = data.error || "❌ Failed to send order.";
        responseEl.style.color = "red";
      }
    } catch (err) {
      console.error("Order form error:", err);
      responseEl.textContent = "❌ Failed to send order. Please try again later.";
      responseEl.style.color = "red";
    }
  });
});
