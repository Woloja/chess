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

// const fs = require('fs');
const mix = require('laravel-mix');

// const mqpacker = require('css-mqpacker'); // combaine all media queries by a groups
// const sortCSSmq = require('sort-css-media-queries'); //custom sorting for mqpacker

// mix.options({
//     processCssUrls: false, // dont copy files by links from css
//     postCss: [
//         require('css-mqpacker')({
//             sort: sortCSSmq
//         })
//     ]
// });

mix.setPublicPath('public');
mix.webpackConfig({
    output: {
        // chunkFilename: 'public/js/chunks/[name].js',
        chunkFilename: 'js/chunks/[name].js'
    },
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

mix.copy('src/index.html', 'public/index.html');
// mix.copyDirectory('src/images', 'public/images');

mix.js(['src/js/app.js'], 'public/js');
mix.sass('src/sass/app.sass', 'public/css/app.css');

// mix.sourceMaps(); // Enable sourcemaps
mix.version(); // Enable versioning.
// mix.extract();

// mix.browserSync({
//     watch: true,
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
