import path from "node:path";
import fs from "node:fs";

export function vitePagesWrapperPlugin(userOptions) {
    let options = {
        outDir: './../',
        worker: './worker/index.js',
        ...userOptions,
    };
    let resolvedConfig;
    return {
        name: 'vite:pages-wrapper',
        enforce: 'post',
        configResolved(config) {
            resolvedConfig = config;
            options.outDir = path.resolve(config.root, config.build.outDir, options.outDir);
        },
        async closeBundle() {
            console.log('🔥 [WorkerWrapper] Worker Entry: ' + path.resolve(options.outDir, '_worker.js'))
            fs.writeFileSync(
                path.resolve(options.outDir, '_worker.js'),
                `import worker from './server/worker.js'; export default worker;`
            );
        },
        apply(config, {command}) {
            return command === 'build' && config.build.ssr
        }
    };
}
