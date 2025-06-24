export function scrollOrNavigate(location, navigate) {
  if (location.pathname === '/') {
    // Scroll al top si ya estamos en la raíz
    document.querySelector('body')?.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // Navega a la raíz y luego hace scroll al top
    navigate('/', { replace: false });

    // Espera un poco para que el navegador cargue la página y luego hace scroll
    setTimeout(() => {
      document.querySelector('body')?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }
}
