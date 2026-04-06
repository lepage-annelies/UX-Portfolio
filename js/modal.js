(function () {
  let overlayEl = null;
  let formEl = null;
  let inputEl = null;
  let errorEl = null;
  let closeEl = null;
  let submitEl = null;
  let toggleEl = null;
  let lastFocusedElement = null;
  let successHandler = null;

  function showPasswordModal(onSuccess) {
    ensureModal();
    successHandler = onSuccess;
    lastFocusedElement = document.activeElement;
    overlayEl.hidden = false;
    errorEl.hidden = true;
    errorEl.textContent = '';
    inputEl.value = '';
    inputEl.type = 'password';
    document.body.classList.add('modal-open');
    toggleEl.setAttribute('aria-pressed', 'false');
    toggleEl.setAttribute('aria-label', 'Wachtwoord tonen');
    inputEl.focus();
    document.addEventListener('keydown', handleModalKeydown);
  }

  function ensureModal() {
    if (overlayEl) {
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="modal-overlay" id="password-modal" role="dialog" aria-modal="true" aria-labelledby="pw-modal-title" hidden>
        <div class="modal">
          <button class="modal__close" id="pw-close" aria-label="Sluiten" type="button">×</button>
          <h2 class="modal__title" id="pw-modal-title">Dit project is beveiligd</h2>
          <p class="pw-modal__desc">Dit project bevat vertrouwelijke informatie en is daarom met een wachtwoord beschermd.</p>
          <form class="pw-form" id="pw-form" novalidate>
            <label for="pw-input" class="sr-only">Wachtwoord</label>
            <div class="modal__field">
              <input class="modal__input" id="pw-input" type="password" placeholder="Wachtwoord" autocomplete="off" />
              <button class="modal__toggle" id="pw-toggle" type="button" aria-label="Wachtwoord tonen" aria-pressed="false">
                <svg class="modal__toggle-icon modal__toggle-icon--show" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 5C6.5 5 2.1 8.3 1 12c1.1 3.7 5.5 7 11 7s9.9-3.3 11-7c-1.1-3.7-5.5-7-11-7Zm0 11.2A4.2 4.2 0 1 1 12 7.8a4.2 4.2 0 0 1 0 8.4Zm0-6.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8Z" fill="currentColor"/>
                </svg>
                <svg class="modal__toggle-icon modal__toggle-icon--hide" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="m3.3 2 18.7 18.7-1.3 1.3-3.4-3.4A12.8 12.8 0 0 1 12 19c-5.5 0-9.9-3.3-11-7a11.8 11.8 0 0 1 4.3-5.7L2 3.3 3.3 2Zm7 7 3.1 3.1a2.4 2.4 0 0 0-3.1-3.1Zm8.5 5.9L15.7 12a3.7 3.7 0 0 1-3.7 3.7l-1.5-1.5a2.4 2.4 0 0 0 3.3-3.3L8.9 6a8.9 8.9 0 0 1 3.1-.5c5.5 0 9.9 3.3 11 7a11.8 11.8 0 0 1-4.2 5.4Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            <p class="modal__error" id="pw-error" hidden></p>
            <button class="btn btn--primary pw-submit" id="pw-submit" type="submit">Bevestigen</button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(wrapper.firstElementChild);

    overlayEl = document.getElementById('password-modal');
    formEl = document.getElementById('pw-form');
    inputEl = document.getElementById('pw-input');
    errorEl = document.getElementById('pw-error');
    closeEl = document.getElementById('pw-close');
    submitEl = document.getElementById('pw-submit');
    toggleEl = document.getElementById('pw-toggle');

    formEl.addEventListener('submit', handleSubmit);
    closeEl.addEventListener('click', closeModal);
    toggleEl.addEventListener('click', handleToggleClick);
    overlayEl.addEventListener('click', function (e) {
      if (e.target === this) {
        closeModal();
      }
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const input = inputEl.value;

    if (window.portfolioAuth.checkPassword(input)) {
      window.portfolioAuth.setAuthenticated();
      if (typeof successHandler === 'function') {
        successHandler();
      }
      closeModal();
    } else {
      errorEl.hidden = false;
      errorEl.textContent = 'Onjuist wachtwoord';
      inputEl.value = '';
      inputEl.focus();
    }
  }

  function closeModal() {
    overlayEl.hidden = true;
    successHandler = null;
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', handleModalKeydown);
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function handleToggleClick() {
    const isVisible = inputEl.type === 'text';

    inputEl.type = isVisible ? 'password' : 'text';
    toggleEl.setAttribute('aria-pressed', String(!isVisible));
    toggleEl.setAttribute('aria-label', isVisible ? 'Wachtwoord tonen' : 'Wachtwoord verbergen');
    inputEl.focus();
  }

  function handleModalKeydown(e) {
    if (!overlayEl || overlayEl.hidden) {
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }

    if (e.key !== 'Tab') {
      return;
    }

    const focusable = [closeEl, inputEl, toggleEl, submitEl];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  window.showPasswordModal = showPasswordModal;
}());