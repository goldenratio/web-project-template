import { Component, html } from 'htm/preact';
import { DragDropFolder } from './drag-drop-folder';

export class App extends Component {

  componentDidMount(): void {
    console.log('App mounted');
  }

  render() {
    return html`
      <${DragDropFolder} />
    `;
  }
}
