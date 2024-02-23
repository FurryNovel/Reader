import fs from 'node:fs';
import path from 'node:path';
fs.writeFile(
    path.resolve('./dist/_worker.js'),
    fs.readFileSync(path.resolve('./build/_worker.js'), 'utf-8'),
    'utf-8',
    (err) => {
    }
)
