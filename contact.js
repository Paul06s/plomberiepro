// Ce script est indépendant de la navigation du site.
const contactForm = document.querySelector('#contact-form');

if (contactForm) {
  const status = document.querySelector('#contact-status');
  const submitButton = contactForm.querySelector('[type="submit"]');
  let sending = false;

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || !contactForm.reportValidity()) return;

    sending = true;
    submitButton.disabled = true;
    contactForm.setAttribute('aria-busy', 'true');
    status.textContent = 'Envoi en cours…';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(contactForm),
      });
      // Un serveur statique peut renvoyer du HTML au lieu d'exécuter PHP.
      const data = await response.json();
      if (typeof data.message !== 'string' || typeof data.ok !== 'boolean') {
        throw new Error('Réponse inattendue');
      }
      status.textContent = data.message;
      if (response.ok && data.ok) contactForm.reset();
    } catch (error) {
      status.textContent = 'Impossible de confirmer l’envoi. Vos champs sont conservés. Veuillez réessayer plus tard.';
    } finally {
      sending = false;
      submitButton.disabled = false;
      contactForm.removeAttribute('aria-busy');
    }
  });
}
