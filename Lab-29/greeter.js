export class Greeter extends HTMLElement {
  constructor() {
    super();
    const tpl = document.getElementById('tpl-greeter');
    const instance = tpl.content.cloneNode(true);
    this.attachShadow({ mode: 'open' }).appendChild(instance);
  }
}
customElements.define('x-greeter', Greeter);