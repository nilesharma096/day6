// Fetch JSON content dynamically for Achievements & Personal page lists
document.addEventListener("DOMContentLoaded", () => {
  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      // Load achievements
      const achList = document.getElementById('achievements-list');
      if (achList && data.achievements) {
        achList.innerHTML = data.achievements
          .map(item => `<li>${item}</li>`)
          .join('');
      }
      // Load personal info lists
      if (data.personal) {
        const hobbiesList = document.getElementById('hobbies-list');
        const roleModelsList = document.getElementById('rolemodels-list');
        const booksList = document.getElementById('books-list');
        const websitesList = document.getElementById('websites-list');

        if (hobbiesList)
          hobbiesList.innerHTML = data.personal.hobbies.map(h => `<li>${h}</li>`).join('');
        if (roleModelsList)
          roleModelsList.innerHTML = data.personal.roleModels.map(r => `<li>${r}</li>`).join('');
        if (booksList)
          booksList.innerHTML = data.personal.books.map(b => `<li>${b}</li>`).join('');
        if (websitesList)
          websitesList.innerHTML = data.personal.websites.map(w => `<li>${w}</li>`).join('');
      }
    })
    .catch(console.error);

  // Simple fade-in scroll animation for elements with data-animate
  const animatedEls = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  animatedEls.forEach(el => {
    el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700', 'ease-out');
    observer.observe(el);
  });

  // Dark Mode Toggle
  const toggleBtnDesktop = document.getElementById('darkModeToggle');
  const toggleBtnMobile = document.getElementById('darkModeToggleMobile'); // This ID should be present in the mobile menu on all pages
  const htmlElement = document.documentElement;

  function enableDarkMode() {
    htmlElement.classList.add('dark');
    document.body.classList.add('bg-gray-900', 'text-gray-100');

    // Update main content background
    document.querySelectorAll('main').forEach(mainEl => {
      mainEl.classList.remove('bg-white');
      mainEl.classList.add('bg-gray-800');
    });

    // Update text colors for headings and paragraphs/list items
    document.querySelectorAll('h1, h2').forEach(el => {
      el.classList.remove('text-indigo-700', 'text-gray-900');
      el.classList.add('text-indigo-400');
    });
    document.querySelectorAll('p, li').forEach(el => {
      el.classList.remove('text-gray-700');
      el.classList.add('text-gray-300');
    });
    document.querySelectorAll('a.text-indigo-600').forEach(el => { // For social links on contact page
      el.classList.add('dark:text-indigo-400');
    });
    document.querySelectorAll('input, textarea').forEach(el => { // For contact form inputs
      el.classList.add('dark:bg-gray-700', 'dark:text-white', 'dark:border-gray-600');
    });


    if (toggleBtnDesktop) toggleBtnDesktop.textContent = '☀️';
    if (toggleBtnMobile) toggleBtnMobile.textContent = '☀️';
    localStorage.setItem('darkMode', 'enabled');
  }

  function disableDarkMode() {
    htmlElement.classList.remove('dark');
    document.body.classList.remove('bg-gray-900', 'text-gray-100');

    // Revert main content background
    document.querySelectorAll('main').forEach(mainEl => {
      mainEl.classList.remove('bg-gray-800');
      mainEl.classList.add('bg-white');
    });

    // Revert text colors for headings and paragraphs/list items
    document.querySelectorAll('h1').forEach(el => {
      el.classList.remove('text-indigo-400');
      el.classList.add('text-indigo-700');
    });
    document.querySelectorAll('h2').forEach(el => { // H2 reverts to gray-900 in light mode
      el.classList.remove('text-indigo-400');
      el.classList.add('text-gray-900');
    });
    document.querySelectorAll('p, li').forEach(el => {
      el.classList.remove('text-gray-300');
      el.classList.add('text-gray-700');
    });
    document.querySelectorAll('a.text-indigo-600').forEach(el => {
      el.classList.remove('dark:text-indigo-400');
    });
    document.querySelectorAll('input, textarea').forEach(el => {
      el.classList.remove('dark:bg-gray-700', 'dark:text-white', 'dark:border-gray-600');
    });

    if (toggleBtnDesktop) toggleBtnDesktop.textContent = '🌙';
    if (toggleBtnMobile) toggleBtnMobile.textContent = '🌙';
    localStorage.setItem('darkMode', 'disabled');
  }

  // Initialize dark mode based on saved preference or system preference
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === 'enabled') {
    enableDarkMode();
  } else if (!savedMode && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    enableDarkMode();
  }

  // Add event listeners for dark mode toggles
  if (toggleBtnDesktop) {
    toggleBtnDesktop.addEventListener('click', () => {
      htmlElement.classList.contains('dark') ? disableDarkMode() : enableDarkMode();
    });
  }
  if (toggleBtnMobile) {
    toggleBtnMobile.addEventListener('click', () => {
      htmlElement.classList.contains('dark') ? disableDarkMode() : enableDarkMode();
    });
  }

  // Hamburger menu toggle logic
  const menuButton = document.getElementById('menuButton'); // Standardized ID for hamburger button
  const mobileMenu = document.getElementById('mobileMenu');   // Standardized ID for mobile menu div

  if (menuButton) { // Ensure button exists on the page
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', !expanded);
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Scroll to Top Button (only on index.html)
  const scrollBtn = document.getElementById("scrollTopBtn");
  if (scrollBtn) { // Check if the button exists on the current page
    window.addEventListener("scroll", () => {
      scrollBtn.classList.toggle("hidden", window.scrollY < 300);
    });
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});


