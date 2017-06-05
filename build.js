var moment = require('moment')
require('twix')

var Metalsmith = require('metalsmith')
var layouts = require('metalsmith-layouts')
var inplace = require('metalsmith-in-place')
var sass = require('metalsmith-sass')
var watch = require('metalsmith-watch')

var _start = moment().startOf('month')

// Assume I ignored my journal for a few weeks and I'm setting up the current month
// if it's earlier than the 24th. But I would never wait that long, right?
var startDate = (new Date).getDate() <= 24 ? _start : _start.add(1, 'month')

var monthDates = startDate.twix(moment(startDate).endOf('month'), { allDay: true }).toArray('days')
var monthDateLabels = monthDates.map(d => {
    return { dow: d.format('dd')[0], dom: d.format('D') }
})

var futureMonths = Array(6).fill().map((_, i) => moment(startDate).add(i + 1, 'months').format('MMM'))
console.log(futureMonths)

Metalsmith(__dirname)
    .metadata({
        future_months: futureMonths,
        month_date_labels: monthDateLabels,
        month_name: moment().format('MMMM YYYY')
    })
    .source('./src')
    .destination('./build')
    .clean(true)
    .use(watch({
        paths: {
            '${source}/**/*': true,
            'layouts/*': true
        },
        livereload: 8080
    }))
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
