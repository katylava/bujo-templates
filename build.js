var Metalsmith = require('metalsmith')
var layouts = require('metalsmith-layouts')
var inplace = require('metalsmith-in-place')
var sass = require('metalsmith-sass')

// var nunjucks = require('jstransformer')(require('jstransformer-nunjucks'))

Metalsmith(__dirname)
    .metadata({
        start_date: new Date(2017, 6, 1)
    })
    .source('./src')
    .destination('./build')
    .clean(true)
    .use(sass({
        outputDir: 'css/',
        outputStyle: 'nested',
        sourceMap: true,
        sourceMapContents: true
    }))
    .use(inplace({ pattern: '*.njk' }))
    .use(layouts({
        directory: 'layouts',
        engine: 'nunjucks'
    }))
    .build(console.log)
