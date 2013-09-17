var express = require('express')
  , app = express()
  , Course = require('./Course.js')
  , Step = require('./step.js');

var beginning = 
'BEGIN:VCALENDAR\r\n PRODID:\r\n VERSION:2.0\r\n CALSCALE:GREGORIAN\r\n METHOD:PUBLISH\r\n X-WR-CALNAME:MYNERVA\r\n X-WR-TIMEZONE:America/Toronto\r\n BEGIN:VTIMEZONE\r\n TZID:America/Toronto\r\n X-LIC-LOCATION:America/Toronto\r\n BEGIN:DAYLIGHT\r\n TZOFFSETFROM:-0500\r\n TZOFFSETTO:-0400\r\n TZNAME:EDT\r\n DTSTART:19700308T020000\r\n RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n END:DAYLIGHT\r\n BEGIN:STANDARD\r\n TZOFFSETFROM:-0400\r\n TZOFFSETTO:-0500\r\n TZNAME:EST\r\n DTSTART:19701101T020000\r\n RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n END:STANDARD\r\n END:VTIMEZONE\r\n';

app.use(express.bodyParser());
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.get('/:crns', function(req, res) {
  var crns = req.params.crns.replace(/\.ics/, '');
  crns = crns.split('-');
  var cal = beginning;
  Step(
    function findCourses() {
      Course.where('crn').in(crns).exec(this);
    },
    function renderEvents(err, courses) {
      if (courses.length === 0) {
        res.send('No courses found with those CRNs');
      }
      console.log('got ' + courses.length + ' courses');
      if (err) throw err;
      courses.forEach(function(course) {
        cal += course.toVEvent();
      });
      return cal;
    },
    function returnIt(err, cal) {
      if (err) throw err;
      res.send(cal);
    }
  );
});

app.get('/', function(req, res) {
  res.render('index.html');
});

app.listen(3000);
