export class TabPanel extends HTMLElement {
    constructor() {
      super();
  
      const tpl = document.createElement('template');
      tpl.innerHTML = `
        <style>
            ::slotted([slot=panel]) {display: none;}
            ::slotted([slot=active]) {display: block;}
        </style>
        <nav><slot name="tab"></slot></nav>
        <div>
            <slot name="panel"></slot>
            <slot name="active"></slot>
        </div>
      `;
  
      this.attachShadow({ mode: 'open' }).appendChild(tpl.content.cloneNode(true));
    }
  }
  
customElements.define('tab-panel', TabPanel);
  