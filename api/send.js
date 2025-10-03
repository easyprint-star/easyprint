// Hamburger toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

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

// Cookie banner
const cookieBanner = document.getElementById("cookie-banner");
const acceptBtn = document.getElementById("accept-cookies");

if (document.cookie.includes("cookiesAccepted=true")) {
  cookieBanner.style.display = "none";
}

acceptBtn.addEventListener("click", function() {
  document.cookie = "cookiesAccepted=true; max-age=" + 60*60*24*365 + "; path=/";
  cookieBanner.style.display = "none";
});

// Contact form submit
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const statusEl = document.getElementById("formStatus");
    statusEl.innerText = "Sending...";

    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value
    };

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        statusEl.innerText = "✅ Message sent successfully!";
        contactForm.reset();
      } else {
        const txt = await res.text();
        statusEl.innerText = "❌ Error: " + txt;
      }
    } catch (err) {
      statusEl.innerText = "❌ Network error: " + err.message;
    }
  });
}