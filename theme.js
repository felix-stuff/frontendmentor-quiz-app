const toggle = document.getElementById('mode-toggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme') || 'theme--light';
body.classList.add(savedTheme);
toggle.checked = savedTheme === 'theme--dark';

const updateTheme = (isDarkMode) => {
  const theme = isDarkMode ? 'theme--dark' : 'theme--light';
  body.className = `quiz ${theme}`;
  localStorage.setItem('theme', theme);
};

toggle.addEventListener('change', () => updateTheme(toggle.checked));
