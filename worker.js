import fs from 'node:fs';
import path from 'node:path';

const worker = fs.readFileSync(path.resolve('./cloudflare/functions/[[catchall]].js'), 'utf-8');

const basePath = path.resolve('./dist/functions/');

const routes = [
    'index',
    'bookmark',
    'about',
    'search',
    'settings',
    'novel/*',
];

routes.forEach((route) => {
    if (route.endsWith('*')) {
        route = route.slice(0, -1);
        route = route + '[[catchall]]';
    }
    const toPath = path.resolve(basePath, `${route}.js`);
    fs.mkdirSync(path.dirname(toPath), {recursive: true});
    fs.writeFileSync(toPath, worker);
    console.log(`Created function for route: ${route}.js`);
});