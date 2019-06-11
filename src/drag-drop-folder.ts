import { Component, html } from 'htm/preact';
import { style } from 'typestyle';

const className = style({
  border: '5px solid blue',
  width: '200px',
  height: '100px'
});

function traverseFileTree(item, path = '') {
  if (item.isFile) {
    // Get file
    item.file(function (file) {
      console.log('File: ' + path + file.name);
    }, e => {});
  } else if (item.isDirectory) {
    // Get folder contents
    console.log('found directory');
    const dirReader = item.createReader();
    dirReader.readEntries(entries => {
      for (let i = 0; i < entries.length; i++) {
        traverseFileTree(entries[i], path + item.name + '/')
      }
    }, e => {});
  }
}

export class DragDropFolder extends Component {

  render() {
    return html`
    <div className="${className}" ondrop="${this.dropHandler}" ondragover="${this.dragOverHandler}">
      Drag and drop folder here!
    </div>`;
  }

  componentDidMount(): void {
    console.log('mounted');
  }

  private dropHandler = event => {
    console.log(event);
    const items = event.dataTransfer.items; // FileList object.

    for (let i = 0; i < items.length; i++) {
      const item = items[i].webkitGetAsEntry();
      if (item) {
        traverseFileTree(item);
      }
    }
    event.preventDefault();
  };

  private dragOverHandler = event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };
}
