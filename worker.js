import fs from 'node:fs';
import path from 'node:path';

const worker = fs.readFileSync(path.resolve('./cloudflare/functions/[[catchall]].js'), 'utf-8');

const basePath = path.resolve('./functions/');

const routes = [
    'index',
    'bookmark',
    'about',
    'search',
    'settings',
    'novel/*',
];

routes.forEach((route) => {
    let _worker = worker;
    if (route.endsWith('*')) {
        route = route.slice(0, -1);
        route = route + '[[catchall]]';
    }
    if (route.split('/').length > 0) {
        _worker = `import worker from "./${Array.from({length: route.split('/').length}).map((_, i) => {
            return '../';
        }).join('')}dist/server/worker.js"\n` + _worker;
    } else {
        _worker = `import worker from "./../dist/server/worker.js"\n` + _worker;
    }
    const toPath = path.resolve(basePath, `${route}.js`);
    fs.mkdirSync(path.dirname(toPath), {recursive: true});
    fs.writeFileSync(toPath, _worker);
    console.log(`Created function for route: ${route}.js`);
});
