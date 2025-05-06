export class HelloWorld extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.intervalId = null;
        this.timeEl = document.createElement('p');
    }
    connectedCallback() {
        //this.textContent = 'Hello, World!';
        //this.shadowRoot.innerHTML = `<p> Hello, Shadow DOM! </p>`;
        this.timeEl.textContent = `Time: ${new Date().toLocaleTimeString()}`;
        this.shadowRoot.appendChild(this.timeEl);
    
        this.intervalId = setInterval(() => {
          this.timeEl.textContent = `Time: ${new Date().toLocaleTimeString()}`;
        }, 1000);
    }
    disconnectedCallback() {
        clearInterval(this.intervalId);
    }
}
customElements.define('hello-world', HelloWorld);
