const copydir = require('copy-dir');
copydir('html-template', 'dist', {
  filter: () => true
});
