(function () {
gsap.registerPlugin(ScrollTrigger);

  var lenis = new Lenis({
    duration: 1.2,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smoothWheel: true,
    syncTouch: false // keep touch scrolling native on phones/tablets; smoothing is for mouse wheel only
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('.nav a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(a.getAttribute('href'));
      if (target) lenis.scrollTo(target, { offset: -20 });
    });
  });

  // --- Mobile menu ---
  var navToggle = document.getElementById('nav-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        mobileMenu.classList.remove('open');
        navToggle.classList.remove('open');
        var target = document.querySelector(a.getAttribute('href'));
        if (target) lenis.scrollTo(target, { offset: -20 });
      });
    });
  }

  // --- Name shrinks from the hero into the nav as the page scrolls ---
  gsap.timeline({
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '+=260',
      scrub: true
    }
  })
    .to('#hero-name', { opacity: 0, y: -16, scale: 0.85 }, 0)
    .to('.nav .mark', { opacity: 1 }, 0);

  var heroWords = "Building things that work end to end.".split(" ");
  var titleEl = document.getElementById('hero-title');
  heroWords.forEach(function (w, i) {
    var wrap = document.createElement('span');
    wrap.className = 'word';
    var inner = document.createElement('span');
    inner.textContent = w + (i < heroWords.length - 1 ? '\u00A0' : '');
    wrap.appendChild(inner);
    titleEl.appendChild(wrap);
  });
  gsap.set('.hero h1 .word > span', { yPercent: 110 });
  gsap.to('.hero h1 .word > span', { yPercent: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06, delay: 0.15 });

  gsap.utils.toArray('[data-reveal-fade]').forEach(function (el) {
    gsap.fromTo(el, { opacity: 0, y: 24 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });
  gsap.fromTo('[data-reveal-stagger]', { opacity: 0, y: 24 }, {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12,
    scrollTrigger: { trigger: '.contrib .items', start: 'top 82%' }
  });

  var track = document.querySelector('[data-scrub-track]');
  ScrollTrigger.create({
    trigger: '.work-pin',
    start: 'top top',
    end: function () { return '+=' + (window.innerHeight * 2); },
    pin: '.work-sticky',
    pinSpacing: true,
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: function (self) {
      var maxShift = Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.1);
      gsap.set(track, { x: -self.progress * maxShift });
    }
  });

  // Fraunces loads async and can change section heights after ScrollTrigger's
  // initial measurement, which desyncs pin start/end points and causes
  // sections to overlap mid-scroll. Recalculate once fonts settle.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      ScrollTrigger.refresh();
    });
  }
  window.addEventListener('load', function () {
    ScrollTrigger.refresh();
  });

  document.querySelectorAll('[data-magnetic]').forEach(function (el) {
    var strength = 0.22, radius = 40;
    el.addEventListener('mousemove', function (e) {
      var rect = el.getBoundingClientRect();
      var cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      var dx = e.clientX - cx, dy = e.clientY - cy;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radius + rect.width / 2) {
        gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.3, ease: 'power2.out' });
      }
    });
    el.addEventListener('mouseleave', function () {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });

  // Email link: mailto often gets silently blocked when the page runs inside
  // an embedded iframe (can't navigate the parent out to a mail app), so copy
  // the address to the clipboard as a reliable fallback alongside the attempt.
  var emailBtn = document.getElementById('email-btn');
  if (emailBtn) {
    emailBtn.addEventListener('click', function () {
      var address = 'shubham.chaprana.ug25@nsut.ac.in';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(address).then(function () {
          var textEl = document.getElementById('email-btn-text');
          var original = textEl.textContent;
          textEl.textContent = 'Copied to clipboard';
          setTimeout(function () { textEl.textContent = original; }, 1800);
        });
      }
    });
  }
})();
