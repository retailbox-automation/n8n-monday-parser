const { src, dest } = require('gulp');

function buildIcons() {
  return src('nodes/MondayParser/mondayparser.svg')
    .pipe(dest('dist'));
}

exports['build:icons'] = buildIcons; 