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
            
            // config.entry = path.resolve(config.root, options.entry);
            // options.workerFile = path.resolve(config.root, options.workerSrc);
            // options.outDir = path.resolve(config.root, options.outDir);
            // config.outDir
        },
        async closeBundle() {
            // const outputWorkerBundlePath = path.resolve(resolvedConfig.root, resolvedConfig.build.outDir, 'worker.js');
            // let workerBundleFile = fs.readFileSync(path.resolve(resolvedConfig.root, options.worker)).toString();
            // workerBundleFile = workerBundleFile.replace('@/', './');
            // console.log('🔥 [WorkerWrapper] Worker: ' + outputWorkerBundlePath)
            // fs.writeFileSync(
            //     outputWorkerBundlePath,
            //     workerBundleFile
            // );
            
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
