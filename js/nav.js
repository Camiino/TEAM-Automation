// Wähle die Navbar aus
const navbar = document.getElementById('nav');

// Füge ein Scroll-Event hinzu
window.addEventListener('scroll', () => {
  // Überprüfe, ob die Seite gescrollt wurde
  if (window.scrollY > 0) {
    navbar.classList.add('scrolled'); // Klasse hinzufügen
  } else {
    navbar.classList.remove('scrolled'); // Klasse entfernen
  }
});