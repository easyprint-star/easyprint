
/* main-updates.js
 - Toggles mobile menu, ensures hamburger sits far right, collapses on navigation,
 - Handles form POST to /api/send using fetch (for Resend server function).
*/
document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.getElementById('menuBtn');
  const mainMenu = document.getElementById('main-menu');
  const body = document.body;

  function setAria(expanded){
    menuBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }

  menuBtn.addEventListener('click', function(e){
    const isOpen = mainMenu.classList.toggle('open');
    setAria(isOpen);
    // when menu opens, add class to body to apply top padding so content isn't overlapped
    if(isOpen) body.classList.add('nav-open'); else body.classList.remove('nav-open');
  });

  // Close menu when a nav link is clicked (also covers navigation to other pages)
  document.querySelectorAll('a[data-close-nav]').forEach(a => {
    a.addEventListener('click', function(e){
      // collapse menu first if open
      if(mainMenu.classList.contains('open')){
        mainMenu.classList.remove('open');
        setAria(false);
        body.classList.remove('nav-open');
      }
      // allow normal navigation to proceed (no preventDefault)
    });
  });

  // Handle forms with data-ajax="true"
  document.querySelectorAll('form[data-ajax="true"]').forEach(form=>{
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"], input[type="submit"]');
      if(btn) { btn.disabled = true; btn.dataset.orig = btn.innerText || btn.value || ''; if(btn.innerText) btn.innerText = 'Sending...'; }
      const data = new FormData(form);
      const payload = {};
      data.forEach((v,k)=> payload[k]=v);
      try{
        const res = await fetch('/api/send', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        if(res.ok){
          // if there is a thankyou page redirect to it
          if(window.location.pathname.indexOf('order')!==-1 || window.location.pathname.indexOf('contact')!==-1){
            window.location.href = '/thankyou.html';
          } else {
            alert('Message sent — thank you!');
            form.reset();
          }
        } else {
          const txt = await res.text();
          alert('Send failed: ' + txt);
        }
      }catch(err){
        alert('Send error: ' + err.message);
      } finally {
        if(btn){ btn.disabled = false; if(btn.innerText) btn.innerText = btn.dataset.orig; }
      }
    });
  });

  // Ensure menu is collapsed on load (useful when coming from another page)
  if(mainMenu.classList.contains('open')){
    mainMenu.classList.remove('open');
    setAria(false);
    body.classList.remove('nav-open');
  }
});
