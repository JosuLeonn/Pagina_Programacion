/* =============================================
   JAVA PAGE — SCRIPT.JS
   Interactividad: cursor, loader, navbar,
   reveal, contadores, tabs de código, copy
   ============================================= */

/* ──────────────────────────────────────────
   1. LOADER
─────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    // Arrancar animaciones hero al cerrar loader
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 120);
    });
  }, 1400);
});


/* ──────────────────────────────────────────
   2. CURSOR PERSONALIZADO
─────────────────────────────────────────── */
const cursor = document.getElementById('cursor');

if (window.matchMedia('(hover: hover)').matches) {
  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Suavizar con RAF
  (function animateCursor() {
    curX += (mouseX - curX) * 0.18;
    curY += (mouseY - curY) * 0.18;
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(animateCursor);
  })();

  // Hover en elementos interactivos
  const hoverEls = document.querySelectorAll('a, button, .feature-card, .uso-item');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}


/* ──────────────────────────────────────────
   3. NAVBAR — scroll & hamburger
─────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

// Scroll: añadir clase .scrolled
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  // Ocultar scroll hint
  const hint = document.getElementById('scrollHint');
  if (hint) hint.style.opacity = window.scrollY > 80 ? '0' : '1';
}, { passive: true });

// Hamburger toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Cerrar menú al hacer click en un link
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Active link según sección visible
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => link.classList.remove('active-nav'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active-nav');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));


/* ──────────────────────────────────────────
   4. REVEAL ON SCROLL (Intersection Observer)
─────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // solo una vez
    }
  });
}, { threshold: 0.12 });

// No observar los del hero (se manejan en el loader)
document.querySelectorAll('.reveal:not(.hero .reveal)').forEach(el => {
  revealObserver.observe(el);
});


/* ──────────────────────────────────────────
   5. CONTADORES ANIMADOS (Stats)
─────────────────────────────────────────── */
function animateCounter(el, target, duration = 1600) {
  let start = null;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    // ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll('.stat-num[data-target]');
      statNums.forEach(num => {
        const target = parseInt(num.dataset.target, 10);
        animateCounter(num, target);
        delete num.dataset.target; // evitar re-animación
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) counterObserver.observe(statsBar);


/* ──────────────────────────────────────────
   6. PESTAÑAS DE CÓDIGO
─────────────────────────────────────────── */
const codeSamples = {
  hola: {
    filename: 'Main.java',
    code: `<span class="cm">// Hola Mundo en Java</span>
<span class="kw">public class</span> <span class="cl">Main</span> {

    <span class="kw">public static void</span> <span class="fn">main</span>(<span class="cl">String</span>[] args) {
        <span class="cl">System</span>.out.<span class="fn">println</span>(<span class="st">"¡Hola, Mundo!"</span>);
        <span class="cl">System</span>.out.<span class="fn">println</span>(<span class="st">"Java: Write Once, Run Anywhere ☕"</span>);
    }

}`
  },
  clase: {
    filename: 'Persona.java',
    code: `<span class="cm">// Programación Orientada a Objetos</span>
<span class="kw">public class</span> <span class="cl">Persona</span> {

    <span class="kw">private</span> <span class="cl">String</span> nombre;
    <span class="kw">private int</span> edad;

    <span class="kw">public</span> <span class="fn">Persona</span>(<span class="cl">String</span> nombre, <span class="kw">int</span> edad) {
        <span class="nb">this</span>.nombre = nombre;
        <span class="nb">this</span>.edad   = edad;
    }

    <span class="kw">public</span> <span class="cl">String</span> <span class="fn">saludar</span>() {
        <span class="kw">return</span> <span class="st">"Hola, soy "</span> <span class="op">+</span> nombre <span class="op">+</span> <span class="st">" y tengo "</span> <span class="op">+</span> edad <span class="op">+</span> <span class="st">" años."</span>;
    }

    <span class="kw">public static void</span> <span class="fn">main</span>(<span class="cl">String</span>[] args) {
        <span class="cl">Persona</span> p = <span class="kw">new</span> <span class="cl">Persona</span>(<span class="st">"Carlos"</span>, <span class="nb">28</span>);
        <span class="cl">System</span>.out.<span class="fn">println</span>(p.<span class="fn">saludar</span>());
    }

}`
  },
  stream: {
    filename: 'Streams.java',
    code: `<span class="kw">import</span> java.util.<span class="cl">List</span>;
<span class="kw">import</span> java.util.stream.<span class="cl">Collectors</span>;

<span class="kw">public class</span> <span class="cl">Streams</span> {

    <span class="kw">public static void</span> <span class="fn">main</span>(<span class="cl">String</span>[] args) {

        <span class="cl">List</span>&lt;<span class="cl">Integer</span>&gt; numeros = <span class="cl">List</span>.<span class="fn">of</span>(<span class="nb">1</span>, <span class="nb">2</span>, <span class="nb">3</span>, <span class="nb">4</span>, <span class="nb">5</span>, <span class="nb">6</span>, <span class="nb">7</span>, <span class="nb">8</span>, <span class="nb">9</span>, <span class="nb">10</span>);

        <span class="cm">// Filtrar pares y multiplicar por 2</span>
        <span class="cl">List</span>&lt;<span class="cl">Integer</span>&gt; resultado = numeros.<span class="fn">stream</span>()
            .<span class="fn">filter</span>(n <span class="op">-></span> n <span class="op">%</span> <span class="nb">2</span> <span class="op">==</span> <span class="nb">0</span>)
            .<span class="fn">map</span>(n <span class="op">-></span> n <span class="op">*</span> <span class="nb">2</span>)
            .<span class="fn">collect</span>(<span class="cl">Collectors</span>.<span class="fn">toList</span>());

        <span class="cm">// Sumar con reduce</span>
        <span class="kw">int</span> suma = resultado.<span class="fn">stream</span>()
            .<span class="fn">reduce</span>(<span class="nb">0</span>, <span class="cl">Integer</span>::<span class="fn">sum</span>);

        <span class="cl">System</span>.out.<span class="fn">println</span>(<span class="st">"Resultado: "</span> <span class="op">+</span> resultado);
        <span class="cl">System</span>.out.<span class="fn">println</span>(<span class="st">"Suma: "</span> <span class="op">+</span> suma);
    }

}`
  }
};

const tabBtns      = document.querySelectorAll('.tab-btn');
const codeContent  = document.getElementById('codeContent');
const codeFilename = document.getElementById('codeFilename');

function setTab(tab) {
  const sample = codeSamples[tab];
  if (!sample) return;

  // Fade out / in
  codeContent.style.opacity = '0';
  codeContent.style.transform = 'translateY(6px)';

  setTimeout(() => {
    codeContent.innerHTML = sample.code;
    codeFilename.textContent = sample.filename;
    codeContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    codeContent.style.opacity = '1';
    codeContent.style.transform = 'translateY(0)';
  }, 200);

  tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => setTab(btn.dataset.tab));
});

// Inicializar con primer tab
setTab('hola');


/* ──────────────────────────────────────────
   7. BOTÓN COPIAR CÓDIGO
─────────────────────────────────────────── */
const copyBtn = document.getElementById('copyBtn');

copyBtn.addEventListener('click', () => {
  const text = codeContent.innerText || codeContent.textContent;
  navigator.clipboard.writeText(text).then(() => {
    copyBtn.textContent = '¡Copiado!';
    copyBtn.style.color = '#28c840';
    copyBtn.style.borderColor = '#28c840';
    setTimeout(() => {
      copyBtn.textContent = 'Copiar';
      copyBtn.style.color = '';
      copyBtn.style.borderColor = '';
    }, 2000);
  }).catch(() => {
    // Fallback para navegadores sin clipboard API
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    copyBtn.textContent = '¡Copiado!';
    setTimeout(() => { copyBtn.textContent = 'Copiar'; }, 2000);
  });
});


/* ──────────────────────────────────────────
   8. HOVER EN FEATURE CARDS (parallax leve)
─────────────────────────────────────────── */
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
    card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease';
  });
});


/* ──────────────────────────────────────────
   9. SMOOTH SCROLL para links internos
─────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ──────────────────────────────────────────
   10. PARALLAX HERO BG TEXT (sutil)
─────────────────────────────────────────── */
const heroBgText = document.querySelector('.hero-bg-text');
if (heroBgText) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroBgText.style.transform = `translateY(calc(-50% + ${scrollY * 0.15}px))`;
  }, { passive: true });
}
