'use strict';

// ══ NAVBAR ══════════════════════════════════════════════════════
const navbar  = document.getElementById('navbar');
const burger  = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const nlItems  = document.querySelectorAll('.nl');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
  toggleBTT();
}, { passive: true });

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

nlItems.forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

document.addEventListener('click', e => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !burger.contains(e.target)) {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

function updateActiveNav() {
  const y = window.scrollY + 120;
  nlItems.forEach(link => {
    const id = link.getAttribute('href');
    if (!id || !id.startsWith('#')) return;
    const el = document.querySelector(id);
    if (!el) return;
    link.classList.toggle('active', y >= el.offsetTop && y < el.offsetTop + el.offsetHeight);
  });
}

// ══ BACK TO TOP ══════════════════════════════════════════════════
const btt = document.getElementById('btt');
function toggleBTT() { btt.classList.toggle('show', window.scrollY > 500); }
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ══ AOS (custom lightweight) ════════════════════════════════════
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const delay = parseInt(en.target.getAttribute('data-aos-delay') || 0);
      setTimeout(() => en.target.classList.add('aos-animate'), delay);
      obs.unobserve(en.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

// ══ COUNTER ══════════════════════════════════════════════════════
function runCounter(el) {
  const target = parseInt(el.dataset.target);
  const dur = 1800, step = 16, inc = target / (dur / step);
  let cur = 0;
  const t = setInterval(() => {
    cur += inc;
    if (cur >= target) { cur = target; clearInterval(t); }
    el.textContent = Math.floor(cur);
  }, step);
}

function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      runCounter(en.target);
      obs.unobserve(en.target);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => obs.observe(el));
}

// ══ SKILL BARS ══════════════════════════════════════════════════
function initSkillBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.style.width = en.target.dataset.w + '%';
      obs.unobserve(en.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.sk-fill[data-w]').forEach(el => obs.observe(el));
}

// ══ PORTFOLIO PREVIEW INTERACTION ═══════════════════════════════
function initPortfolioPreview() {
  document.querySelectorAll('.proj-img-wrap').forEach(wrap => {
    // Touch tap toggle for mobile
    let isRevealed = false;
    wrap.addEventListener('touchstart', e => {
      isRevealed = !isRevealed;
      wrap.classList.toggle('revealed', isRevealed);
    }, { passive: true });
  });
}

// ══ PORTFOLIO FILTER ════════════════════════════════════════════
function initFilter() {
  const btns  = document.querySelectorAll('.filt');
  const cards = document.querySelectorAll('.proj-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        if (match) {
          card.classList.remove('hidden');
          card.style.animation = 'filterIn .4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Inject animation
  const s = document.createElement('style');
  s.textContent = '@keyframes filterIn{from{opacity:0;transform:scale(.93) translateY(14px)}to{opacity:1;transform:none}}';
  document.head.appendChild(s);
}

// ══ LIGHTBOX / GALLERY MODAL ════════════════════════════════════
function initLightbox() {
  const overlay   = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lbImg');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');
  const lbCounter = document.getElementById('lbCounter');

  let images = [], idx = 0;

  function openLightbox(imgs, startIdx) {
    images = imgs;
    idx = startIdx;
    show();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function show() {
    const src = images[idx];
    lbImg.src = src || '';
    lbImg.alt = `Project image ${idx + 1}`;
    lbCounter.textContent = `${idx + 1} / ${images.length}`;
    lbPrev.style.display = images.length > 1 ? 'flex' : 'none';
    lbNext.style.display = images.length > 1 ? 'flex' : 'none';

    // Fallback for missing images
    lbImg.onerror = () => {
      lbImg.src = "data:image/svg+xml," + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
          <rect width="800" height="500" fill="#0c1020"/>
          <text x="400" y="240" text-anchor="middle" font-size="52" fill="#00d4ff30">📁</text>
          <text x="400" y="290" text-anchor="middle" font-size="16" fill="#00d4ff50">Image not found</text>
        </svg>`
      );
    };
  }

  function prev() { idx = (idx - 1 + images.length) % images.length; show(); }
  function next() { idx = (idx + 1) % images.length; show(); }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });

  // Keyboard support
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Swipe on mobile
  let tx = 0;
  lbImg.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  lbImg.addEventListener('touchend', e => {
    const dx = tx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) dx > 0 ? next() : prev();
  });

  // Wire gallery buttons
  document.querySelectorAll('.btn-gallery').forEach(btn => {
    btn.addEventListener('click', () => {
      try {
        const imgs = JSON.parse(btn.dataset.images || '[]');
        openLightbox(imgs.length ? imgs : ['images/placeholder.jpg'], 0);
      } catch {
        openLightbox(['images/placeholder.jpg'], 0);
      }
    });
  });

  // Also clicking on image wrap opens lightbox
  document.querySelectorAll('.proj-img-wrap').forEach(wrap => {
    wrap.addEventListener('click', e => {
      const card = wrap.closest('.proj-card');
      const btn = card ? card.querySelector('.btn-gallery') : null;
      if (btn) {
        btn.click();
      }
    });
  });
}

// ══ TESTIMONIALS SLIDER ══════════════════════════════════════════
function initTestiSlider() {
  const slider   = document.getElementById('testiSlider');
  const dotsWrap = document.getElementById('testiDots');
  const counter  = document.getElementById('testiCounter');
  const prev     = document.getElementById('tPrev');
  const next     = document.getElementById('tNext');
  if (!slider) return;

  const cards = slider.querySelectorAll('.tcard');
  const total = cards.length;
  let cur = 0, autoId;

  function vis() {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 960) return 2;
    return 3;
  }

  function max() { return Math.max(0, total - vis()); }

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i <= max(); i++) {
      const d = document.createElement('span');
      d.className = 'tdot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => { go(i); resetAuto(); });
      dotsWrap.appendChild(d);
    }
  }

  function updateUI() {
    document.querySelectorAll('.tdot').forEach((d, i) => d.classList.toggle('active', i === cur));
    counter.textContent = `${cur + 1} / ${total}`;
    const v = vis();
    const gapPx = 24;
    const cardW = (slider.offsetWidth - gapPx * (v - 1)) / v;
    slider.style.transform = `translateX(-${cur * (cardW + gapPx)}px)`;
    cards.forEach(c => {
      c.style.minWidth = `${cardW}px`;
      c.style.maxWidth = `${cardW}px`;
    });
  }

  function go(idx) {
    cur = Math.max(0, Math.min(idx, max()));
    updateUI();
  }

  function nextSlide() { go(cur < max() ? cur + 1 : 0); }
  function prevSlide() { go(cur > 0 ? cur - 1 : max()); }
  function startAuto() { autoId = setInterval(nextSlide, 5500); }
  function resetAuto() { clearInterval(autoId); startAuto(); }

  next.addEventListener('click', () => { nextSlide(); resetAuto(); });
  prev.addEventListener('click', () => { prevSlide(); resetAuto(); });

  // Swipe
  let tx = 0;
  slider.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = tx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) { dx > 0 ? nextSlide() : prevSlide(); resetAuto(); }
  });

  buildDots();
  updateUI();
  startAuto();
  window.addEventListener('resize', () => { buildDots(); go(Math.min(cur, max())); });
}

// ══ CONTACT FORM ═════════════════════════════════════════════════
function initForm() {
  const form = document.getElementById('contactForm');
  const ok   = document.getElementById('formOk');
  if (!form) return;

  const F = {
    name:    { el: document.getElementById('cfName'),    err: document.getElementById('cfNameErr'),    msg: 'Please enter your name.' },
    email:   { el: document.getElementById('cfEmail'),   err: document.getElementById('cfEmailErr'),   msg: 'Please enter a valid email.' },
    service: { el: document.getElementById('cfService'), err: document.getElementById('cfServiceErr'), msg: 'Please select a service.' },
    msg:     { el: document.getElementById('cfMsg'),     err: document.getElementById('cfMsgErr'),     msg: 'Please write a message (min 15 chars).' },
  };

  function setErr(f) { f.el.classList.add('err'); f.err.textContent = f.msg; f.err.classList.add('show'); }
  function clr(f)    { f.el.classList.remove('err'); f.err.classList.remove('show'); }

  Object.values(F).forEach(f => {
    f.el.addEventListener('input', () => clr(f));
    f.el.addEventListener('change', () => clr(f));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    if (!F.name.el.value.trim() || F.name.el.value.trim().length < 2) { setErr(F.name); valid = false; } else clr(F.name);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(F.email.el.value.trim())) { setErr(F.email); valid = false; } else clr(F.email);
    if (!F.service.el.value) { setErr(F.service); valid = false; } else clr(F.service);
    if (F.msg.el.value.trim().length < 15) { setErr(F.msg); valid = false; } else clr(F.msg);
    if (!valid) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      form.reset();
      ok.classList.add('show');
      setTimeout(() => ok.classList.remove('show'), 6000);
    }, 1600);
  });
}

// ══ SMOOTH SCROLL for anchors ════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 76, behavior: 'smooth' });
    }
  });
});

// ══ INIT ══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initCounters();
  initSkillBars();
  initPortfolioPreview();
  initFilter();
  initLightbox();
  initTestiSlider();
  initForm();
  updateActiveNav();
  toggleBTT();
  initAdmin();
});

// ══ ADMIN DASHBOARD (DIRECT ACCESS) ═════════════════════════════

function showTab(tabId, btn) {
  document.querySelectorAll('.adm-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.adm-tab').forEach(b => b.classList.remove('active'));
  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');
  if (btn) btn.classList.add('active');
}

// ── POPULATE admin fields with current page values ──
function populateAdmin() {
  // Hero
  const heroName = document.querySelector('.hero-name');
  if (heroName) setField('edit-heroName', heroName.childNodes[0]?.textContent?.trim() || '');
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) setField('edit-heroTitle', heroTitle.textContent.trim());
  const heroDesc = document.querySelector('.hero-desc');
  if (heroDesc) setField('edit-heroDesc', heroDesc.textContent.trim());
  const stats = document.querySelectorAll('.hstat-n');
  if (stats[0]) setField('edit-statProjects', stats[0].dataset.target || stats[0].textContent);
  if (stats[1]) setField('edit-statWebsites', stats[1].dataset.target || stats[1].textContent);
  if (stats[2]) setField('edit-statBrands',   stats[2].dataset.target || stats[2].textContent);
  const heroImg = document.getElementById('heroImg');
  if (heroImg) setField('edit-heroImg', heroImg.src.replace(location.href.replace(location.hash,''),'') || '');

  // About
  const aboutParas = document.querySelectorAll('.about-para');
  if (aboutParas[0]) setField('edit-aboutP1', aboutParas[0].textContent.trim());
  if (aboutParas[1]) setField('edit-aboutP2', aboutParas[1].textContent.trim());
  const facts = document.querySelectorAll('.fact-num.counter');
  if (facts[0]) setField('edit-factProjects', facts[0].dataset.target || '');
  if (facts[1]) setField('edit-factWebsites', facts[1].dataset.target || '');
  if (facts[2]) setField('edit-factBrands',   facts[2].dataset.target || '');

  // Services
  const svcTitles = document.querySelectorAll('.stype-card h3');
  svcTitles.forEach((el, i) => setField(`edit-svc${i+1}`, el.textContent.trim()));
  const servSec = document.querySelector('.services-section .sec-title');
  if (servSec) setField('edit-servTitle', servSec.textContent.trim());
  const servSub = document.querySelector('.services-section .sec-sub');
  if (servSub) setField('edit-servSub', servSub.textContent.trim());

  // Skills
  const skNames = document.querySelectorAll('.sk-name');
  const skPcts  = document.querySelectorAll('.sk-pct');
  skNames.forEach((el, i) => setField(`edit-sk${i+1}name`, el.textContent.trim()));
  skPcts.forEach((el, i)  => setField(`edit-sk${i+1}pct`,  el.textContent.replace('%','').trim()));

  // Contact
  const phoneEl = document.querySelector('.contact-info-item a[href^="tel"]');
  if (phoneEl) setField('edit-phone', phoneEl.textContent.trim());
  const waEl = document.querySelector('a[href^="https://wa.me"]');
  if (waEl) setField('edit-whatsapp', waEl.href.replace('https://wa.me/',''));
  const emailEl = document.querySelector('.contact-info-item a[href^="mailto"]');
  if (emailEl) setField('edit-email', emailEl.textContent.trim());
  const addrEl = document.querySelector('.contact-info-item .cii-val');
  if (addrEl) setField('edit-address', addrEl.textContent.trim());
  setField('edit-siteTitle', document.title);
  const footerCopy = document.querySelector('.footer-bottom p');
  if (footerCopy) setField('edit-footerCopy', footerCopy.textContent.trim());

  // Projects
  buildProjectsAdmin();
}

function setField(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

// ── LIVE EDIT functions ──
function liveEdit(key, val) {
  const targets = {
    heroName:     () => { const el = document.querySelector('.hero-name'); if(el) el.childNodes[0].textContent = val; },
    heroTitle:    () => { const el = document.querySelector('.hero-title'); if(el) el.firstChild.textContent = val; },
    heroDesc:     () => { const el = document.querySelector('.hero-desc'); if(el) el.textContent = val; },
    statProjects: () => updateStat(0, val),
    statWebsites: () => updateStat(1, val),
    statBrands:   () => updateStat(2, val),
    heroImg:      () => { document.querySelectorAll('#heroImg,.about-img,.skill-profile-img').forEach(i=>i.src=val); },
    aboutP1:      () => { const els=document.querySelectorAll('.about-para'); if(els[0]) els[0].textContent=val; },
    aboutP2:      () => { const els=document.querySelectorAll('.about-para'); if(els[1]) els[1].textContent=val; },
    factProjects: () => updateFact(0, val),
    factWebsites: () => updateFact(1, val),
    factBrands:   () => updateFact(2, val),
    servTitle:    () => { const el=document.querySelector('.services-section .sec-title'); if(el) el.firstChild.textContent=val; },
    servSub:      () => { const el=document.querySelector('.services-section .sec-sub'); if(el) el.textContent=val; },
    phone:        () => { document.querySelectorAll('a[href^="tel"]').forEach(a=>{a.href='tel:'+val;a.textContent=val;}); },
    whatsapp:     () => { document.querySelectorAll('a[href^="https://wa.me"]').forEach(a=>a.href='https://wa.me/'+val); },
    email:        () => { document.querySelectorAll('a[href^="mailto"]').forEach(a=>{a.href='mailto:'+val;a.textContent=val;}); },
    address:      () => { document.querySelectorAll('.cii-val').forEach(el=>{ if(!el.closest('a')) el.textContent=val; }); },
    siteTitle:    () => { document.title = val; },
    footerCopy:   () => { const el=document.querySelector('.footer-bottom p'); if(el) el.textContent=val; },
  };
  if (targets[key]) targets[key]();
  autoSave(key, val);
}

function updateStat(idx, val) {
  const stats = document.querySelectorAll('.hstat-n');
  if (stats[idx]) { stats[idx].textContent = val; stats[idx].dataset.target = val; }
}
function updateFact(idx, val) {
  const facts = document.querySelectorAll('.fact-num.counter');
  if (facts[idx]) { facts[idx].textContent = val; facts[idx].dataset.target = val; }
}

function liveEditSvc(idx, val) {
  const svcTitles = document.querySelectorAll('.stype-card h3');
  if (svcTitles[idx]) svcTitles[idx].textContent = val;
  autoSave('svc'+idx, val);
}

function liveEditSkill(idx, type, val) {
  const skNames = document.querySelectorAll('.sk-name');
  const skPcts  = document.querySelectorAll('.sk-pct');
  const skFills = document.querySelectorAll('.sk-fill');
  if (type === 'name' && skNames[idx]) skNames[idx].textContent = val;
  if (type === 'pct'  && skPcts[idx])  { skPcts[idx].textContent = val+'%'; skFills[idx].dataset.w = val; skFills[idx].style.width = val+'%'; }
  autoSave('sk'+idx+type, val);
}

function liveEditColor(cssVar, val) {
  document.documentElement.style.setProperty(cssVar, val);
  // Update displayed hex value
  const map = {'--cyan':'colorCyanVal','--purple':'colorPurpleVal','--bg1':'colorBgVal','--card':'colorCardVal'};
  if(map[cssVar]) { const el=document.getElementById(map[cssVar]); if(el) el.textContent=val; }
  autoSave('color_'+cssVar, val);
}

function resetColors() {
  const defaults = {'--cyan':'#00d4ff','--purple':'#a855f7','--bg1':'#060b18','--card':'#0d1526'};
  Object.entries(defaults).forEach(([v,c]) => {
    document.documentElement.style.setProperty(v, c);
    liveEditColor(v, c);
  });
  document.getElementById('edit-colorCyan').value   = '#00d4ff';
  document.getElementById('edit-colorPurple').value = '#a855f7';
  document.getElementById('edit-colorBg').value     = '#060b18';
  document.getElementById('edit-colorCard').value   = '#0d1526';
}

// ── Image file upload → data URL ──
function fileToUrl(field, inputId) {
  const file = document.getElementById(inputId).files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const url = e.target.result;
    const fld = document.getElementById('edit-'+field);
    if (fld) fld.value = url;
    liveEdit(field, url);
  };
  reader.readAsDataURL(file);
}

// ── Projects admin ──
function buildProjectsAdmin() {
  const cards = document.querySelectorAll('.proj-card');
  const list  = document.getElementById('admProjectsList');
  if (!list) return;
  list.innerHTML = '';
  cards.forEach((card, i) => {
    const name = card.querySelector('.proj-name')?.textContent || 'Project '+(i+1);
    const desc = card.querySelector('.proj-desc')?.textContent || '';
    const cat  = card.querySelector('.proj-cat')?.textContent  || '';
    const img  = card.querySelector('.proj-img')?.src || card.querySelector('.proj-front-img')?.src || '';

    const row = document.createElement('div');
    row.className = 'adm-proj-row';
    row.innerHTML = `
      <h4><i class="fa-solid fa-folder"></i> Project ${i+1}: ${name}</h4>
      <div class="adm-proj-grid">
        <div class="adm-field">
          <label>Project Naam</label>
          <input type="text" class="adm-input" value="${name}" oninput="liveEditProj(${i},'name',this.value)"/>
        </div>
        <div class="adm-field">
          <label>Category</label>
          <input type="text" class="adm-input" value="${cat}" oninput="liveEditProj(${i},'cat',this.value)"/>
        </div>
        <div class="adm-field adm-full">
          <label>Description</label>
          <textarea class="adm-input" rows="2" oninput="liveEditProj(${i},'desc',this.value)">${desc}</textarea>
        </div>
        <div class="adm-field adm-full">
          <label>Image URL</label>
          <div class="adm-img-row">
            <input type="text" class="adm-input" value="${img}" oninput="liveEditProj(${i},'img',this.value)"/>
            <input type="file" id="projFile${i}" accept="image/*" class="adm-file" onchange="projFileUpload(${i},'projFile${i}')"/>
            <label for="projFile${i}" class="adm-file-btn"><i class="fa-solid fa-upload"></i> Upload</label>
          </div>
        </div>
      </div>`;
    list.appendChild(row);
  });
}

function liveEditProj(idx, type, val) {
  const cards = document.querySelectorAll('.proj-card');
  if (!cards[idx]) return;
  if (type === 'name') { const el=cards[idx].querySelector('.proj-name'); if(el) el.textContent=val; }
  if (type === 'cat')  { const el=cards[idx].querySelector('.proj-cat');  if(el) el.textContent=val; }
  if (type === 'desc') { const el=cards[idx].querySelector('.proj-desc'); if(el) el.textContent=val; }
  if (type === 'img')  {
    const imgEl = cards[idx].querySelector('.proj-img');
    if (imgEl) imgEl.src = val;
    const btnGal = cards[idx].querySelector('.btn-gallery');
    if (btnGal) btnGal.dataset.images = JSON.stringify([val]);
    const fi=cards[idx].querySelector('.proj-front-img');
    const bi=cards[idx].querySelector('.proj-back-img');
    if(fi) fi.src=val; if(bi) bi.src=val;
  }
  autoSave('proj_'+idx+'_'+type, val);
}

function projFileUpload(idx, inputId) {
  const file = document.getElementById(inputId).files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const url = e.target.result;
    liveEditProj(idx, 'img', url);
    // update input
    const inputs = document.querySelectorAll('#admProjectsList .adm-img-row .adm-input');
    if(inputs[idx]) inputs[idx].value = url;
  };
  reader.readAsDataURL(file);
}

// ── Auto Save to localStorage ──
function autoSave(key, val) {
  try { localStorage.setItem('sk_adm_'+key, val); } catch(e) {}
}

function loadSavedData() {
  // Restore all saved values from localStorage
  const prefix = 'sk_adm_';
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k.startsWith(prefix)) continue;
    const field = k.replace(prefix,'');
    const val = localStorage.getItem(k);
    if (!val) continue;
    try {
      if (field.startsWith('color_')) {
        document.documentElement.style.setProperty(field.replace('color_',''), val);
      } else if (field.startsWith('svc')) {
        const idx = parseInt(field.replace('svc',''));
        liveEditSvc(idx, val);
      } else if (field.startsWith('proj_')) {
        const parts = field.split('_');
        liveEditProj(parseInt(parts[1]), parts[2], val);
      } else if (field.startsWith('sk')) {
        const m = field.match(/sk(\d)(\w+)/);
        if(m) liveEditSkill(parseInt(m[1]), m[2], val);
      } else {
        liveEdit(field, val);
      }
    } catch(e) {}
  }
}

function saveAll() {
  const toast = document.getElementById('admToast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

function openAdminModal() {
  const modal = document.getElementById('admModal');
  if (modal) {
    populateAdmin();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeAdminModal() {
  const modal = document.getElementById('admModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function initAdmin() {
  populateAdmin();
  loadSavedData();

  // ── PASSWORD MODAL SETUP ──
  const pwdModal     = document.getElementById('pwdModal');
  const pwdInput     = document.getElementById('pwdInput');
  const pwdError     = document.getElementById('pwdError');
  const pwdSubmitBtn = document.getElementById('pwdSubmitBtn');
  const pwdCancelBtn = document.getElementById('pwdCancelBtn');
  const pwdEyeBtn    = document.getElementById('pwdEyeBtn');
  const DASHBOARD_PASSWORD = 'khanshaheen333';

  function openPwdModal() {
    if (pwdModal) {
      pwdInput.value = '';
      pwdError.classList.remove('show');
      pwdInput.classList.remove('shake');
      pwdModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => pwdInput.focus(), 350);
    }
  }

  function closePwdModal() {
    if (pwdModal) {
      pwdModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function tryUnlock() {
    if (pwdInput.value === DASHBOARD_PASSWORD) {
      closePwdModal();
      setTimeout(() => openAdminModal(), 200);
    } else {
      pwdError.classList.add('show');
      pwdInput.classList.add('shake');
      setTimeout(() => pwdInput.classList.remove('shake'), 500);
      pwdInput.select();
    }
  }

  if (pwdSubmitBtn) pwdSubmitBtn.addEventListener('click', tryUnlock);
  if (pwdCancelBtn) pwdCancelBtn.addEventListener('click', closePwdModal);

  // Enter key to submit password
  if (pwdInput) {
    pwdInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') tryUnlock();
    });
    pwdInput.addEventListener('input', () => {
      pwdError.classList.remove('show');
      pwdInput.classList.remove('shake');
    });
  }

  // Toggle password visibility
  if (pwdEyeBtn) {
    pwdEyeBtn.addEventListener('click', () => {
      const isPass = pwdInput.type === 'password';
      pwdInput.type = isPass ? 'text' : 'password';
      pwdEyeBtn.innerHTML = isPass
        ? '<i class="fa-solid fa-eye-slash"></i>'
        : '<i class="fa-solid fa-eye"></i>';
    });
  }

  // Backdrop click to close pwd modal
  if (pwdModal) {
    pwdModal.addEventListener('click', e => {
      if (e.target === pwdModal) closePwdModal();
    });
  }

  // Attach open listeners to all open-admin-btn elements (Navbar, drawer, floating)
  document.querySelectorAll('.open-admin-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      // Close mobile drawer if open
      const navLinks = document.getElementById('navLinks');
      const burger = document.getElementById('burger');
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        if (burger) burger.classList.remove('active');
      }
      openPwdModal();
    });
  });

  // Close button
  const closeBtn = document.getElementById('admModalClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeAdminModal);
  }

  // Backdrop click to close
  const modal = document.getElementById('admModal');
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        closeAdminModal();
      }
    });
  }

  // Escape key to close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (pwdModal && pwdModal.classList.contains('open')) {
        closePwdModal();
      } else if (modal && modal.classList.contains('open')) {
        closeAdminModal();
      }
    }
  });

  // Direct URL link support: http://localhost:8080/#dashboard
  if (window.location.hash === '#dashboard' || window.location.hash === '#admin') {
    setTimeout(openPwdModal, 400);
  }
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#dashboard' || window.location.hash === '#admin') {
      openPwdModal();
    }
  });
}

