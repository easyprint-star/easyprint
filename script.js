document.addEventListener("DOMContentLoaded", () => {
  // ✅ Hamburger menu
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // ✅ Cookie banner
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");

  if (cookieBanner && acceptBtn) {
    if (document.cookie.includes("cookiesAccepted=true")) {
      cookieBanner.style.display = "none";
    }

    acceptBtn.addEventListener("click", function() {
      document.cookie = "cookiesAccepted=true; max-age=" + 60*60*24*365 + "; path=/";
      cookieBanner.style.display = "none";
    });
  }

  // ✅ Contact form (only runs on contact.html)
  const contactForm = document.getElementById("contactForm");
  const formResponse = document.getElementById("formResponse");

  if (contactForm && formResponse) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      formResponse.textContent = "⏳ Sending message...";

      const formData = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        message: contactForm.message.value
      };

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        const data = await res.json();
        if (res.ok) {
          formResponse.style.color = "green";
          formResponse.textContent = data.success;
          contactForm.reset();
        } else {
          formResponse.style.color = "red";
          formResponse.textContent = data.error || "❌ Something went wrong.";
        }
      } catch (err) {
        formResponse.style.color = "red";
        formResponse.textContent = "❌ Failed to send. Try again later.";
      }
    });
  }
});
