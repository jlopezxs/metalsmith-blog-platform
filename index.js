var MetalsmithBlog,
    Metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    layouts = require('metalsmith-layouts'),
    inPlace = require('metalsmith-in-place'),
    collections = require('metalsmith-collections'),
    permalinks = require('metalsmith-permalinks'),
    sass = require('metalsmith-sass'),
    htmlMinifier = require('metalsmith-html-minifier'),
    drafts = require('metalsmith-drafts'),
    serve = require('metalsmith-serve'),
    watch = require('metalsmith-watch'),
    moment = require('moment'),
    config = {
        static_data: require('./config/static-data.json'),
        collections: require('./config/collections.json'),
        general: require('./config/general.json')
    };

config.static_data.moment = moment;

MetalsmithBlog = Metalsmith(__dirname)
    .metadata(config.static_data)
    .source('src')
    .use(collections(config.collections))
    .use(sass({
        outputDir: 'css'
    }))
    .use(markdown({
        smartypants: true,
        gfm: true,
        tables: true
    }))
    .use(layouts({
        engine: config.general.engine,
        directory: 'templates',
        partials: 'templates/partials'
    }))
    .use(inPlace({
        engine: config.general.engine,
        partials: 'templates/partials'
    }))
    .use(drafts())
    .use(permalinks({
        pattern: config.general.url_pattern
    }))
    .use(htmlMinifier())
    .destination('build');

if (config.general.serve) {
    MetalsmithBlog.use(serve({
        port: config.general.port,
        verbose: true
    }));
}

if (config.general.watch) {
    MetalsmithBlog.use(watch({
        pattern: '/**/*',
        livereload: true
    }));
}

MetalsmithBlog.build(function(error) {
    if (error) {
        console.log(error);
    } else {
        console.log('\x1b[36m', 'Metalsmith Blog Platform', '\x1b[0m', 'Build Complete');
    }
});
