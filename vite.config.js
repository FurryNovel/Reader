import vuePlugin from '@vitejs/plugin-vue'
import {defineConfig} from "vite";
import path from "path";

import inject from '@rollup/plugin-inject';
import {VitePWA} from 'vite-plugin-pwa'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import {PrimeVueResolver} from 'unplugin-vue-components/resolvers';
import {viteBindSSRPlugin} from "vue-unique-ssr-id";
import topLevelAwait from "vite-plugin-top-level-await";


export default defineConfig({
    plugins: [
        viteBindSSRPlugin(),
        vuePlugin(),
        AutoImport({
            // targets to transform
            include: [
                /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                /\.vue$/,
                /\.vue\?vue/, // .vue
                /\.md$/, // .md
            ],
            // global imports to register
            imports: [
                // presets
                'vue',
                'vue-router',
                {
                    'axios': [
                        // default imports
                        ['default', 'axios'], // import { default as axios } from 'axios',
                    ],
                },
            ],
            
            // Array of strings of regexes that contains imports meant to be filtered out.
            ignore: [],
            
            // Enable auto import by filename for default module exports under directories
            defaultExportByFilename: false,
            
            // Filepath to generate corresponding .d.ts file.
            // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
            // Set `false` to disable.
            dts: './auto-imports.d.ts',
            
            // Array of strings of regexes that contains imports meant to be ignored during
            // the declaration file generation. You may find this useful when you need to provide
            // a custom signature for a function.
            ignoreDts: [
                'ignoredFunction',
                /^ignore_/
            ],
            
            // Auto import inside Vue template
            // see https://github.com/unjs/unimport/pull/15 and https://github.com/unjs/unimport/pull/72
            vueTemplate: false,
            
            // Custom resolvers, compatible with `unplugin-vue-components`
            // see https://github.com/antfu/unplugin-auto-import/pull/23/
            resolvers: [
                /* ... */
            ],
            
            // Inject the imports at the end of other imports
            injectAtEnd: true,
            
            // Generate corresponding .eslintrc-auto-import.json file.
            // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
            eslintrc: {
                enabled: false, // Default `false`
                filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
                globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
            },
        }),
        Components({
            resolvers: [
                PrimeVueResolver()
            ]
        }),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
                navigateFallbackDenylist: [
                    /^\/api/,
                    /^\/cdn-cgi/,
                ],
            },
            manifest: {
                'name': '兽人控小说站',
                'short_name': '兽人控小说站',
                'theme_color': '#008AFF',
                'background_color': '#f7f7fc',
                'display': 'standalone',
                'orientation': 'portrait',
                'lang': 'zh-CN',
                'icons': [
                    {
                        'sizes': '192x192',
                        'src': 'static/android-chrome-192x192.png',
                        'type': 'image/png'
                    },
                    {
                        'sizes': '512x512',
                        'src': 'static/android-chrome-512x512.png',
                        'type': 'image/png'
                    }
                ]
            }
        }),
        topLevelAwait({
            // The export name of top-level await promise for each chunk module
            promiseExportName: '__tla',
            // The function to generate import names of top-level await promise in each chunk module
            promiseImportName: i => `__tla_${i}`
        }),
    ],
    server: {
        proxy: {
            '/api': {
                target: 'https://novel.tigerkk.me/api',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            },
        }
    },
    build: {
        minify: false,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    define: {
        __APP_VERSION: `${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}.${new Date().getHours()}`,
    },
});
