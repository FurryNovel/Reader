import fs from 'node:fs';
import path from 'node:path';

const worker = fs.readFileSync(path.resolve('./cloudflare/functions/[[catchall]].js'), 'utf-8');

const toPath = path.resolve('./dist/functions/[[catchall]].js');
fs.mkdirSync(path.dirname(toPath), {recursive: true});
fs.writeFileSync(toPath, worker);
