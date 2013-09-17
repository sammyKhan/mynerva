var fs = require('fs')
  , Course = require('./Course.js')
  , moment = require('moment');

var START_OF_SEMESTER = '09-03-2013 ';

function saveSection(section) {
    var courseDoc = new Course();
    courseDoc.courseCode = section.name;
    courseDoc.crn = section.crn;
    courseDoc.title = section.title;
    var loc = section.locations[0];
    courseDoc.location = loc.location;
    courseDoc.professor = loc.instructor;
    var days = [];
    var dayString = [];
    var times = loc.time.split('-');
    if (times.length < 2) return;
    var startTime = START_OF_SEMESTER + times[0];
    var endTime = START_OF_SEMESTER + times[1];
    if (loc.days.indexOf('M') !== -1) {
      days.push(moment(startTime).day('Monday'));
      dayString.push('MO');
    }
    if (loc.days.indexOf('T') !== -1) {
      days.push(moment(startTime).day('Tuesday'));
      dayString.push('TU');
    }
    if (loc.days.indexOf('W') !== -1) {
      days.push(moment(startTime).day('Wednesday'));
      dayString.push('WE');
    }
    if (loc.days.indexOf('R') !== -1) {
      days.push(moment(startTime).day('Thursday'));
      dayString.push('TH');
    }
    if (loc.days.indexOf('F') !== -1) {
      days.push(moment(startTime).day('Friday'));
      dayString.push('FR');
    }
    if (days.length > 1) { //sometimes days are TBA
      days.sort(function(a,b) {
        if (a.unix() < b.unix()) return -1;
        return 1;
      });
      courseDoc.days = dayString.join(',');
      courseDoc.startTime = days[0].toISOString();
      var endTime = moment(endTime).day(days[0].day()).toISOString();
      courseDoc.endTime = endTime;
      courseDoc.lastMod = new Date();
      courseDoc.save(function(err, course) {
        if (err) throw err;
        console.dir(course);
      });
    }
}

fs.readFile('courses.json', 'utf8', function(err, data) {
  var courses = JSON.parse(data);
  for (var course in courses) {
    if (courses.hasOwnProperty(course)) {
      courses[course].forEach(saveSection);
    }
  }
});

