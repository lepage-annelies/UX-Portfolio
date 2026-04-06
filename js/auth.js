(function () {
  const AUTH_KEY = 'portfolio_authenticated';
  const TAB_AUTH_VALUE = 'portfolio_authenticated';
  const SHARED_PASSWORD = 'sollicitatie2026';

  const PROJECT_CONFIG = {
    'case-study-Results&Insights': { protected: true, password: SHARED_PASSWORD },
    'case-study-Taskplanner': { protected: true, password: SHARED_PASSWORD },
    'case-study-Gebruikersbeheer': { protected: true, password: SHARED_PASSWORD },
    'case-study-ClassChat': { protected: false, password: null },
    'case-study-Rob': { protected: false, password: null },
  };

  function requiresPassword(slug) {
    return PROJECT_CONFIG[slug] && PROJECT_CONFIG[slug].protected === true;
  }

  function checkPassword(password) {
    return password === SHARED_PASSWORD;
  }

  function isAuthenticated() {
    const hasSessionAuth = sessionStorage.getItem(AUTH_KEY) === 'true';
    const hasTabAuth = window.name === TAB_AUTH_VALUE;

    if (!hasTabAuth && hasSessionAuth) {
      sessionStorage.removeItem(AUTH_KEY);
    }

    return hasSessionAuth && hasTabAuth;
  }

  function setAuthenticated() {
    window.name = TAB_AUTH_VALUE;
    sessionStorage.setItem(AUTH_KEY, 'true');
  }

  window.portfolioAuth = {
    isAuthenticated,
    setAuthenticated,
    requiresPassword,
    checkPassword,
  };
}());