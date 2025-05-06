import './hello-world.js';
import './greeter.js';
import './user-card.js';
import './tab-panel.js';

export function removeHello() {
    const el = document.querySelector('hello-world');
    if (el) el.remove();
    const status = document.getElementById('status');
    if (status) status.textContent = 'Timer stopped.';
}
  
// STEP 6: Custom event listener for user-greet
document.body.addEventListener('user-greet', e => {
  alert(`Hello, ${e.detail}!`);
});

// STEP 5: Change name after 2 seconds
setTimeout(() => {
  const userCard = document.querySelector('user-card[name="Alice"]');
  if (userCard) userCard.setAttribute('name', 'Bob');
}, 2000);

// STEP 7: Tab panel switching
export function activate(i) {
  const panels = document.querySelectorAll("#p0, #p1");
  panels.forEach((el, idx) =>
    el.setAttribute("slot", idx === i ? "active" : "panel")
  );
}
activate(0);