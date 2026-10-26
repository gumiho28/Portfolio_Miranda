'use strict';
document.getElementById('year').textContent = new Date().getFullYear();
const copyButton = document.getElementById('copy-email');
copyButton.addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText('shawncruz0928@gmail.com');
    status.textContent = 'Email copied.';
  } catch {
    status.textContent = 'Please copy: shawncruz0928@gmail.com';
  }
});
