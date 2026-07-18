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
