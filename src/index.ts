import { html, render } from 'htm/preact';
import { App } from './app';

window.onload = () => {
  render(html`<${App} />`, document.body);
};
