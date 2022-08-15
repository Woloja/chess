/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

const fs = require('fs');
const mix = require('laravel-mix');

// const mqpacker = require('css-mqpacker'); // combaine all media queries by a groups
// const sortCSSmq = require('sort-css-media-queries'); //custom sorting for mqpacker

// mix.options({
//     processCssUrls: false, // dont copy files by links from css
//     postCss: [
//         require('css-mqpacker')({
//             sort: sortCSSmq
//         }),
//         require('autoprefixer')({
//             // grid: "autoplace",
//             remove: true
//         })
//     ]
// });

mix.setPublicPath('public');
mix.webpackConfig({
    module: {
        rules: []
    },
    resolve: {
        extensions: ['.js'],
        modules: ['node_modules'],
        /**
         * if you have a problem with compiling
         *  - GSAP
         *  - ScrollMagic
         *  - and...
         * Save and do not let God, some jQuery libs
         *
         * remove the relevant comment
         *
         * If you have any other libraries that cause the error, add them in alias`es
         *  or provide in plugins
         */
        alias: {}
    },
    plugins: []
});

if (mix.inProduction()) {
    mix.options({
        terser: {
            terserOptions: {
                compress: {
                    // eslint-disable-next-line camelcase
                    drop_console: true
                }
            }
        }
    });
}

mix.copyDirectory('src/structure', 'public'); // pages structure
mix.copyDirectory('src/lang', 'public/lang'); // pages translations
mix.copyDirectory('src/parts', 'public/parts'); // pages templates
mix.copyDirectory('src/php', 'public/php'); // simple config

mix.copyDirectory('src/assets/images', 'public/images');
mix.copyDirectory('src/assets/favicon', 'public/favicon');

mix.copyDirectory('html/js/*', 'public/js');
mix.copyDirectory('html/css/*', 'public/css');
mix.copyDirectory('html/images/*', 'public/images');
mix.copyDirectory('html/media', 'public/images/media');

mix.js(['src/assets/js/ukraine.js'], 'public/js');
mix.sass('src/assets/sass/app.sass', 'public/css/ukraine.css');

// mix.sourceMaps(); // Enable sourcemaps
mix.version(); // Enable versioning.
// mix.extract();

// mix.browserSync({
//     watch: true,
//     files: ['public', 'public/**/*.+(html|php)'],
//     open: 'http://pixel-map.local/',
//     reloadDelay: 1000,
//     server: {
//         baseDir: './public/'
//     }
// });

// mix.then(function () {
//     let filesToClear = ['public/js/vanilla.js'];
//
//     for (let i = 0; i < filesToClear.length; i++) {
//         fs.stat(filesToClear[i], function (err, stats) {
//             if (stats && stats.isFile()) {
//                 fs.unlink(filesToClear[i], (err) => {
//                     if (err) throw err;
//                     console.log(filesToClear[i] + ' - was deleted');
//                 });
//             }
//         });
//     }
// });
