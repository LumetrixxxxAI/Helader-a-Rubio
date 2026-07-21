document.addEventListener('DOMContentLoaded', function () {

  // ---------- Año footer ----------
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();

  // ---------- Header al hacer scroll ----------
  var header = document.getElementById('header');
  function actualizarHeader() {
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  actualizarHeader();
  window.addEventListener('scroll', actualizarHeader, { passive: true });

  // ---------- Menú móvil ----------
  var btnMenu = document.getElementById('btnMenu');
  var navMovil = document.getElementById('navMovil');
  btnMenu.addEventListener('click', function () {
    btnMenu.classList.toggle('abierto');
    navMovil.classList.toggle('abierto');
  });
  navMovil.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      btnMenu.classList.remove('abierto');
      navMovil.classList.remove('abierto');
    });
  });

  // ---------- Scroll reveal ----------
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // ---------- Carrusel de opiniones ----------
  var slidesWrap = document.getElementById('carruselSlides');
  var puntosWrap = document.getElementById('carruselPuntos');
  var btnAnterior = document.getElementById('flechaAnterior');
  var btnSiguiente = document.getElementById('flechaSiguiente');

  if (slidesWrap) {
    var slides = slidesWrap.children;
    var total = slides.length;
    var actual = 0;
    var autoplay;

    for (var i = 0; i < total; i++) {
      var punto = document.createElement('button');
      punto.className = 'punto-carrusel' + (i === 0 ? ' activo' : '');
      punto.setAttribute('aria-label', 'Ir a opinión ' + (i + 1));
      punto.addEventListener('click', function (idx) {
        return function () { irASlide(idx); reiniciarAutoplay(); };
      }(i));
      puntosWrap.appendChild(punto);
    }

    function irASlide(idx) {
      actual = (idx + total) % total;
      slidesWrap.style.transform = 'translateX(-' + (actual * 100) + '%)';
      puntosWrap.querySelectorAll('.punto-carrusel').forEach(function (p, pi) {
        p.classList.toggle('activo', pi === actual);
      });
    }

    function reiniciarAutoplay() {
      clearInterval(autoplay);
      autoplay = setInterval(function () { irASlide(actual + 1); }, 6000);
    }

    btnAnterior.addEventListener('click', function () { irASlide(actual - 1); reiniciarAutoplay(); });
    btnSiguiente.addEventListener('click', function () { irASlide(actual + 1); reiniciarAutoplay(); });

    reiniciarAutoplay();
  }

  // ---------- Scroll-spy del menú ----------
  var navLinks = document.querySelectorAll('.nav-desktop a[href^="#"]');
  var secciones = Array.prototype.slice.call(navLinks).map(function (link) {
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);

  if (navLinks.length && secciones.length && 'IntersectionObserver' in window) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = '#' + entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle('activo', link.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secciones.forEach(function (sec) { spyObserver.observe(sec); });
  }

  // ---------- Contadores animados ----------
  var contadores = document.querySelectorAll('[data-cuenta]');
  if (contadores.length && 'IntersectionObserver' in window) {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var meta = parseInt(el.getAttribute('data-cuenta'), 10);
        countObserver.unobserve(el);
        if (reduceMotion) { el.textContent = meta; return; }
        var inicio = null;
        var duracion = 1400;
        function animar(ts) {
          if (!inicio) inicio = ts;
          var progreso = Math.min((ts - inicio) / duracion, 1);
          var facil = 1 - Math.pow(1 - progreso, 3);
          el.textContent = Math.round(meta * facil);
          if (progreso < 1) requestAnimationFrame(animar);
        }
        requestAnimationFrame(animar);
      });
    }, { threshold: 0.6 });
    contadores.forEach(function (el) { countObserver.observe(el); });
  }

  // ---------- Botón volver arriba ----------
  var btnVolverArriba = document.getElementById('btnVolverArriba');
  if (btnVolverArriba) {
    window.addEventListener('scroll', function () {
      btnVolverArriba.classList.toggle('visible', window.scrollY > 700);
    }, { passive: true });
    btnVolverArriba.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Lightbox de galería ----------
  var lightbox = document.getElementById('lightbox');
  var lightboxContenido = document.getElementById('lightboxContenido');
  var lightboxCerrar = document.getElementById('lightboxCerrar');
  var itemsGaleria = document.querySelectorAll('.item-galeria');

  function abrirLightbox(html) {
    lightboxContenido.innerHTML = html;
    lightbox.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
  function cerrarLightbox() {
    lightbox.classList.remove('visible');
    document.body.style.overflow = '';
  }
  itemsGaleria.forEach(function (item) {
    item.addEventListener('click', function () {
      var foto = item.querySelector('.foto-real');
      var placeholder = item.querySelector('.img-placeholder');
      if (foto) {
        abrirLightbox('<img src="' + foto.src + '" alt="' + foto.alt + '" style="width:100%;height:100%;object-fit:contain;">');
      } else {
        abrirLightbox(placeholder ? placeholder.outerHTML : '');
      }
    });
  });
  if (lightboxCerrar) lightboxCerrar.addEventListener('click', cerrarLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) cerrarLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') cerrarLightbox();
  });

  // ---------- Pestañas de ubicación (dos locales) ----------
  var tabsLocal = document.querySelectorAll('.ubicacion-tab');
  var panelesLocal = document.querySelectorAll('.ubicacion-grid[data-local-panel]');
  tabsLocal.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var local = tab.getAttribute('data-local');
      tabsLocal.forEach(function (t) { t.classList.toggle('activo', t === tab); });
      panelesLocal.forEach(function (panel) {
        panel.hidden = panel.getAttribute('data-local-panel') !== local;
      });
    });
  });

  // ---------- Banner de cookies ----------
  var cookiesBanner = document.getElementById('cookiesBanner');
  var btnAceptar = document.getElementById('btnAceptarCookies');
  var btnRechazar = document.getElementById('btnRechazarCookies');
  var CLAVE_COOKIES = 'elrubio_cookies_decision';

  if (cookiesBanner && !localStorage.getItem(CLAVE_COOKIES)) {
    setTimeout(function () { cookiesBanner.classList.add('visible'); }, 800);
  }
  function ocultarBanner() { cookiesBanner.classList.remove('visible'); }
  if (btnAceptar) btnAceptar.addEventListener('click', function () {
    localStorage.setItem(CLAVE_COOKIES, 'aceptado');
    ocultarBanner();
  });
  if (btnRechazar) btnRechazar.addEventListener('click', function () {
    localStorage.setItem(CLAVE_COOKIES, 'rechazado');
    ocultarBanner();
  });

});
