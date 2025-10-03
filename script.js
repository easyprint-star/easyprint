// ===== Hamburger Menu =====
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  // Close menu when clicking a link
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });
}

// ===== Cookie Banner =====
const cookieBanner = document.getElementById("cookie-banner");
const acceptBtn = document.getElementById("accept-cookies");

function getCookie(name) {
  return document.cookie.split("; ").find(row => row.startsWith(name + "="));
}

if (cookieBanner) {
  if (getCookie("cookiesAccepted")) {
    cookieBanner.style.display = "none";
  }

  if (acceptBtn) {
    acceptBtn.addEventListener("click", function() {
      document.cookie = "cookiesAccepted=true; max-age=" + (60*60*24*365) + "; path=/";
      cookieBanner.style.display = "none";
    });
  }
}

// ===== Contact Form Submission =====
const contactForm = document.querySelector("form.card");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: contactForm.name.value,
      email: contactForm.email.value,
      message: contactForm.message.value
    };

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("✅ Your message has been sent successfully!");
        contactForm.reset();
      } else {
        alert("❌ Something went wrong. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Failed to send. Please check your connection.");
    }
  });
}
