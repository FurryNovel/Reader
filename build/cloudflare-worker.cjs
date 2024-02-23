const fs = require('fs');
const path = require('path');
fs.writeFile(
    path.resolve(__dirname, '../dist/_worker.js'),
    fs.readFileSync(path.resolve(__dirname, '_worker.js'), 'utf-8'),
    'utf-8',
    (err) => {
    }
)
