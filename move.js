const fs = require('fs')
fs.rm('../inb-viewer/public/shareHtml', {
    recursive: true
}, (err) => {
    if (err) {
        console.log('err: ', err);
    } else {
        fs.cp('./dist', '../inb-viewer/public/shareHtml', {
            recursive: true
        }, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
})


fs.rm('../inb-raspberry/dist', {
    recursive: true
}, (err) => {
    if (err) {
        console.log('err: ', err);
    } else {
        fs.cp('./dist', '../inb-raspberry/dist', {
            recursive: true
        }, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
})
