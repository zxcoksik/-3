/**
 * Общая оболочка сайта: навигация, футер, модальное окно заявки
 */
(function () {
  'use strict';

  const page = document.body.dataset.page || 'home';

  const navItems = [
    { href: 'index.html', label: 'Главная', id: 'home' },
    { href: 'about.html', label: 'О нас', id: 'about' },
    { href: 'catalog.html', label: 'Коллекция', id: 'catalog' },
    { href: 'process.html', label: 'Процесс', id: 'process' },
    { href: 'reviews.html', label: 'Отзывы', id: 'reviews' },
  ];

  const navLinksHtml = navItems
    .map(
      (item) =>
        `<li><a href="${item.href}" class="nav__link${page === item.id ? ' is-active' : ''}" data-nav="${item.id}" data-cursor="hover">${item.label}</a></li>`
    )
    .join('');

  const footerNavHtml = navItems
    .map((item) => `<a href="${item.href}" data-cursor="hover">${item.label}</a>`)
    .join('');

  const lightboxHtml =
    page === 'catalog'
      ? `
  <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Просмотр изображения" hidden>
    <div class="lightbox__backdrop" id="lightboxBackdrop"></div>
    <div class="lightbox__content">
      <button class="lightbox__close" id="lightboxClose" aria-label="Закрыть" data-cursor="hover">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
      <button class="lightbox__nav lightbox__nav--prev" id="lightboxPrev" aria-label="Предыдущее" data-cursor="hover">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
      <figure class="lightbox__figure">
        <img src="" alt="" id="lightboxImg" width="900" height="600">
        <figcaption id="lightboxCaption"></figcaption>
      </figure>
      <button class="lightbox__nav lightbox__nav--next" id="lightboxNext" aria-label="Следующее" data-cursor="hover">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
    </div>
  </div>`
      : '';

  const chromeTop = `
  <div class="preloader" id="preloader" aria-hidden="true">
    <div class="preloader__inner">
      <div class="preloader__ring"></div>
      <span class="preloader__text">RESONANCE</span>
      <div class="preloader__bar"><span></span></div>
    </div>
  </div>
  <div class="cursor" id="cursor" aria-hidden="true">
    <div class="cursor__dot"></div>
    <div class="cursor__ring"></div>
  </div>
  <div class="noise" aria-hidden="true"></div>
  <div class="ambient" aria-hidden="true">
    <div class="ambient__blob ambient__blob--1"></div>
    <div class="ambient__blob ambient__blob--2"></div>
    <div class="ambient__blob ambient__blob--3"></div>
  </div>
  <header class="nav" id="nav">
    <nav class="nav__inner container">
      <a href="index.html" class="nav__logo" data-cursor="hover">
        <span class="nav__logo-mark">R</span>
        <span class="nav__logo-text">RESONANCE</span>
      </a>
      <ul class="nav__links" id="navLinks">
        ${navLinksHtml}
        <li><button type="button" class="nav__cta btn btn--sm" data-modal-open data-cursor="hover">Оставить заявку</button></li>
      </ul>
      <button class="nav__burger" id="navBurger" aria-label="Открыть меню" aria-expanded="false">
        <span></span><span></span>
      </button>
    </nav>
    <div class="nav__progress" id="navProgress"></div>
  </header>`;

  const chromeBottom = `
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <a href="index.html" class="footer__logo" data-cursor="hover">RESONANCE</a>
        <p class="footer__tagline">Кураторский мир винила · Est. 2019</p>
      </div>
      <nav class="footer__nav" aria-label="Навигация в подвале">
        ${footerNavHtml}
        <button type="button" class="footer__nav-btn" data-modal-open data-cursor="hover">Оставить заявку</button>
      </nav>
      <div class="footer__social">
        <a href="#" class="footer__social-link" aria-label="Telegram" data-cursor="hover">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.09-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" fill="currentColor"/></svg>
        </a>
        <a href="#" class="footer__social-link" aria-label="Instagram" data-cursor="hover">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
        </a>
        <a href="#" class="footer__social-link" aria-label="YouTube" data-cursor="hover">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" stroke="currentColor" stroke-width="1.5"/><path d="M9.75 15.02l6.5-3.52-6.5-3.52v7.04z" fill="currentColor"/></svg>
        </a>
      </div>
      <p class="footer__copy">&copy; 2025 RESONANCE Studio. Все права защищены.</p>
    </div>
  </footer>
  <div class="modal" id="requestModal" role="dialog" aria-labelledby="modalTitle" aria-modal="true" hidden>
    <div class="modal__backdrop" data-modal-close></div>
    <div class="modal__dialog">
      <button type="button" class="modal__close" data-modal-close aria-label="Закрыть" data-cursor="hover">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
      <div class="modal__form-wrap" id="modalFormWrap">
        <span class="modal__label">Заявка</span>
        <h2 class="modal__title" id="modalTitle">Оставить заявку</h2>
        <p class="modal__subtitle">Подберём пластинку, проверим наличие или ответим на вопрос — обычно в течение 2 часов.</p>
        <form class="modal__form" id="requestForm" novalidate>
          <div class="form-field">
            <label class="form-field__label" for="reqName">Имя</label>
            <input class="form-field__input" type="text" id="reqName" name="name" placeholder="Как к вам обращаться" required autocomplete="name">
          </div>
          <div class="form-field">
            <label class="form-field__label" for="reqContact">Email или Telegram</label>
            <input class="form-field__input" type="text" id="reqContact" name="contact" placeholder="@username или email" required autocomplete="email">
          </div>
          <div class="form-field">
            <label class="form-field__label" for="reqType">Тип заявки</label>
            <select class="form-field__input form-field__select" id="reqType" name="type" required>
              <option value="">Выберите тему</option>
              <option value="order">Пластинка под заказ</option>
              <option value="question">Вопрос по заказу</option>
              <option value="coop">Сотрудничество</option>
              <option value="other">Другое</option>
            </select>
          </div>
          <div class="form-field">
            <label class="form-field__label" for="reqMessage">Сообщение</label>
            <textarea class="form-field__input form-field__textarea" id="reqMessage" name="message" rows="4" placeholder="Альбом, исполнитель, пожелания…" required></textarea>
          </div>
          <button type="submit" class="btn btn--glow modal__submit" data-cursor="hover">
            <span>Отправить заявку</span>
          </button>
        </form>
      </div>
      <div class="modal__success" id="modalSuccess" hidden>
        <div class="modal__success-icon" aria-hidden="true">✓</div>
        <h2 class="modal__title">Заявка принята</h2>
        <p class="modal__subtitle">Мы свяжемся с вами в ближайшее время. Спасибо, что выбираете RESONANCE.</p>
        <button type="button" class="btn btn--primary" data-modal-close data-cursor="hover">Закрыть</button>
      </div>
    </div>
  </div>
  ${lightboxHtml}`;

  const main = document.querySelector('main');
  if (main) {
    const top = document.createElement('div');
    top.id = 'site-chrome-top';
    top.innerHTML = chromeTop;
    document.body.insertBefore(top, main);

    const bottom = document.createElement('div');
    bottom.id = 'site-chrome-bottom';
    bottom.innerHTML = chromeBottom;

    const firstScript = document.querySelector('body > script');
    if (firstScript) {
      document.body.insertBefore(bottom, firstScript);
    } else {
      document.body.appendChild(bottom);
    }
  }
})();
