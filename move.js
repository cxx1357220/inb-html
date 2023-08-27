const fs = require('fs')
fs.cp('./dist', '../inb-viewer/shareHtml', {
    recursive: true
}, (err) => {
    if (err) {
        console.error(err);
    }
});

fs.cp('./dist', '../inb-raspberry/dist', {
    recursive: true
}, (err) => {
    if (err) {
        console.error(err);
    }
});