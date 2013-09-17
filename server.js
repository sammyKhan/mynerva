var express = require('express')
  , app = express()
  , Course = require('./Couse.js');

var beginning = 
'BEGIN:VCALENDAR\n PRODID:\n VERSION:2.0\n CALSCALE:GREGORIAN\n METHOD:PUBLISH\n X-WR-CALNAME:MYNERVA\n X-WR-TIMEZONE:America/Toronto\n BEGIN:VTIMEZONE\n TZID:America/Toronto\n X-LIC-LOCATION:America/Toronto\n BEGIN:DAYLIGHT\n TZOFFSETFROM:-0500\n TZOFFSETTO:-0400\n TZNAME:EDT\n DTSTART:19700308T020000\n RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\n END:DAYLIGHT\n BEGIN:STANDARD\n TZOFFSETFROM:-0400\n TZOFFSETTO:-0500\n TZNAME:EST\n DTSTART:19701101T020000\n RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\n END:STANDARD\n END:VTIMEZONE\n';

app.use(express.bodyParser());
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.get('/', function(req, res) {
  if (req.query.crns) {
    var crns = req.query.crns.split(',');
    var cal = beginning;
    Course.where('crn').in(crns).exec(function(err, courses) {
      courses.forEach(function(course) {
        cal += course.toVEvent();
      });
      cal += 'END:VCALENDAR';
    });
    res.send(cal);
  } else {
    res.render('index.html');
  }
});

app.listen(3000);
