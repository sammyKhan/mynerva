var express = require('express')
  , app = express()
  , Course = require('./Course.js')
  , Step = require('./step.js');

var beginning = 
'BEGIN:VCALENDAR\r\nPRODID:123\r\nVERSION:2.0\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:MYNERVA\r\nX-WR-TIMEZONE:America/Toronto\r\nBEGIN:VTIMEZONE\r\nTZID:America/Toronto\r\nX-LIC-LOCATION:America/Toronto\r\nBEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT\r\nBEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD\r\nEND:VTIMEZONE\r\n';

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
      cal += 'END:VCALENDAR';
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
