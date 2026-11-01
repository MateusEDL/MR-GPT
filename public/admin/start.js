/* global CMS */
(() => {
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
  if (!window.CMS) {
    document.body.textContent = 'Não foi possível carregar o painel. Recarregue a página ou contate a equipe técnica.';
    return;
  }
  CMS.init({
    config: {
      backend: {
        name: 'github',
        repo: 'MateusEDL/MR-GPT',
        branch: 'main',
        base_url: window.location.origin,
        auth_endpoint: 'api/auth',
      },
      local_backend: local,
    },
  });
})();
