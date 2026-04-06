/* ============================================================
   components.js
   Reusable Web Components: <site-nav> and <site-footer>

   HOW IT WORKS
   ─────────────────────────────────────────────────────────
   Both components extend HTMLElement and render their HTML
   once on connectedCallback. They read a `page` attribute
   to know which nav link gets .active, and a `root` attribute
  to keep compatibility if pages move across folders.

   USAGE IN HTML
   ─────────────────────────────────────────────────────────
  Same-folder pages (index.html, about.html, case-study.html, contact.html):
     <site-nav  page="home"  root="./"></site-nav>
     <site-footer             root="./"></site-footer>

   VALID page VALUES
   ─────────────────────────────────────────────────────────
   "home"  → Werk
   "about" → Over mij
  "contact" → Contact
   ============================================================ */


/* ============================================================
   COMPONENT: <site-nav>
   ============================================================ */
class SiteNav extends HTMLElement {
  connectedCallback() {
    const root    = this.getAttribute('root') || './';
    const current = this.getAttribute('page') || '';

    /* Nav link definitions — single source of truth for labels + paths */
    const NAV_LINKS = [
      { page: 'home',  label: 'Projecten',       href: 'index.html'      },
      { page: 'about', label: 'Over mij',   href: 'about.html'      },
    ];

    /* Resolve links relative to the current root when provided. */
    const resolveHref = (href) => {
      if (root === '../') {
        return `../${href}`;
      }
      return href;
    };

    const linkItems = NAV_LINKS.map(({ page, label, href }) => {
      const isActive = page === current;
      return `<li>
          <a href="${resolveHref(href)}"${isActive ? ' class="active"' : ''}>${label}</a>
        </li>`;
    }).join('\n        ');

    const contactCta = `<li>
          <a class="btn btn--primary btn--sm nav-cta" href="${resolveHref('contact.html')}">
            Contacteer mij <i class="fas fa-paper-plane"></i>
          </a>
        </li>`;

    this.innerHTML = `
<nav id="main-nav" role="navigation" aria-label="Hoofdnavigatie">
  <div class="nav-inner">
    <a class="nav-logo" href="${resolveHref('index.html')}">
      <img src="${resolveHref('Assets/Logo-Annelies.svg')}" alt="Annelies Le Page" />
      <span class="nav-logoname">Annelies Le Page</span>
    </a>
    <button
      class="nav-toggle"
      id="nav-toggle"
      aria-label="Menu openen"
      aria-expanded="false"
      aria-controls="nav-links"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
    <ul class="nav-links" id="nav-links" role="list">
      ${linkItems}
      ${contactCta}
    </ul>
  </div>
</nav>`;

    /* Mobile toggle — scoped to this element, no global function needed */
    const toggle   = this.querySelector('#nav-toggle');
    const navLinks = this.querySelector('#nav-links');

    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Menu sluiten' : 'Menu openen');
    });

    /* Close on outside click */
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Menu openen');
      }
    });

    /* Apply stronger blur state once content scrolls behind the sticky nav */
    const nav = this.querySelector('#main-nav');
    const setScrolledState = () => {
      nav.classList.toggle('nav-scrolled', window.scrollY > 8);
    };

    setScrolledState();
    window.addEventListener('scroll', setScrolledState, { passive: true });
  }
}

customElements.define('site-nav', SiteNav);


/* ============================================================
   COMPONENT: <site-footer>
   ============================================================ */
class SiteFooter extends HTMLElement {
  connectedCallback() {
    const root = this.getAttribute('root') || './';

    const resolveHref = (href) => {
      if (root === '../') {
        return `../${href}`;
      }
      return href;
    };

    /* Year auto-updates — no manual edits needed */
    const year = new Date().getFullYear();

    this.innerHTML = `
<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <img class="footer-logo" src="${resolveHref('Assets/Logo-Annelies-Inverse.svg')}" alt="Annelies Le Page" />
      <div class="footer-identity">
      <a class="footer-email" href="mailto:lepage.annelies@gmail.com">lepage.annelies@gmail.com</a>
        <span class="footer-name">© ${year} Annelies Le Page</span>
      </div>
    </div>
    <nav class="footer-links" aria-label="Footer links">
      <a class="social-icon" href="https://www.linkedin.com/in/annelieslepage" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" data-tooltip="LinkedIn">
        <img src="${resolveHref('Assets/LinkedIn Icon.svg')}" alt="" />
      </a>
      <a class="social-icon" href="https://www.behance.net/lepageanne874b" target="_blank" rel="noopener noreferrer" aria-label="Behance" data-tooltip="Behance">
        <img src="${resolveHref('Assets/Square Brands Icon.svg')}" alt="" />
      </a>
      <a class="social-icon" href="https://dribbble.com/Annelies_Le_Page" target="_blank" rel="noopener noreferrer" aria-label="Dribbble" data-tooltip="Dribbble">
        <img src="${resolveHref('Assets/Dribbble Brand Icon.svg')}" alt="" />
      </a>
      <!--<a href="${resolveHref('Assets/KleurplatenBumba.pdf')}" target="_blank" rel="noopener noreferrer">CV downloaden</a>-->
    </nav>
  </div>
</footer>`;

    const footerLogo = this.querySelector('.footer-logo');
    const footerIdentity = this.querySelector('.footer-identity');

    const syncFooterLogoHeight = () => {
      if (!footerLogo || !footerIdentity) return;
      footerLogo.style.height = `${Math.round(footerIdentity.offsetHeight * 0.85)}px`;
    };

    syncFooterLogoHeight();
    window.addEventListener('resize', syncFooterLogoHeight);
  }
}

customElements.define('site-footer', SiteFooter);
