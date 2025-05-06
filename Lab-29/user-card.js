export class UserCard extends HTMLElement {
    static get observedAttributes() { return ['name']; }
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    attributeChangedCallback(attr, oldVal, newVal) {
      this.render();
    }
  
    render() {
      this.shadowRoot.innerHTML = `<p>User: ${this.getAttribute('name')}</p>
      <button>Greet</button>`;

      this.shadowRoot.querySelector('button').addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('user-greet', {
            detail: this.getAttribute('name'), bubbles: true}));
        });
    }
  
    connectedCallback() {
      this.render();
    }
  }
  
customElements.define('user-card', UserCard);
  