document.addEventListener('DOMContentLoaded', function() {
    // Function to read a cookie by name
    function getCookie(name) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    }
  
    // Determine current theme (default to 'light')
    const theme = getCookie('theme') || 'light';
  
    // Dynamically create and insert the stylesheet link element
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/styles/' + theme + '.css';
    document.head.appendChild(link);
  
    // Attach event listener to toggle theme on button click
    document.getElementById('themeButton').addEventListener('click', function() {
      fetch('/themeToggle')
        .then(() => window.location.reload());
    });
  });