var moment = require('moment')
require('twix')

var Metalsmith = require('metalsmith')
var layouts = require('metalsmith-layouts')
var inplace = require('metalsmith-in-place')
var sass = require('metalsmith-sass')

var _start = moment().startOf('month')

// Assume I ignored my journal for a few weeks and I'm setting up the current month
// if it's earlier than the 24th. But I would never wait that long, right?
var startDate = (new Date).getDate() <= 24 ? _start : _start.add(1, 'month')

var dates = startDate.twix(moment(startDate).endOf('month'), { allDay: true }).toArray('days')


Metalsmith(__dirname)
    .metadata({
        date_labels: dates.map(d => d.format('dd D')),
        month_name: moment().format('MMMM YYYY')
    })
    .source('./src')
    .destination('./build')
    .clean(true)
    .use(sass({
        outputDir: 'css/',
        outputStyle: 'nested'
    }))
    .use(inplace({ pattern: '*.njk' }))
    .use(layouts({
        directory: 'layouts',
        engine: 'nunjucks'
    }))
    .build(console.log)
