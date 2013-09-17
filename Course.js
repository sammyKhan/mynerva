var mongoose = require('mongoose')
  , moment = require('moment');

mongoose.connect('mongodb://localhost/mynerva');

var courseSchema = mongoose.Schema({
  crn : Number,
  courseCode : String,
  title : String,
  location : String,
  professor : String,
  startTime : Date,
  endTime : Date,
  days : String,
  lastMod : Date,
});

courseSchema.index({crn: 1});

var lastDay = new Date('Dec 03 2013');
var tfmt = 'YYYYMMDDTHHmmss';

courseSchema.methods.toVEvent = function() {
  var str = 'BEGIN:VEVENT\r\n';
  str += 'DTSTART;TZID=America/Toronto:' + moment(this.startTime).format(tfmt) + '\r\n';
  str += 'DTEND;TZID=America/Toronto:' + moment(this.endTime).format(tfmt) + '\r\n';
  str += 'RRULE:FREQ=WEEKLY;';
  str += 'UNTIL=' + moment(lastDay).format(tfmt);
  str += ';BYDAY=' + this.days + '\r\n';
  str += 'UID:' + this._id + '\r\n';
  str += 'DESCRIPTION:' + this.title + '\r\n';
  str += 'LAST-MODIFIED:' + moment(this.lastMod).format(tfmt) + '\r\n';
  str += 'LOCATION:' + this.location + '\r\n';
  str += 'STATUS:CONFIRMED\r\n';
  str += 'SUMMARY:' + this.courseCode + '\r\n';
  str += 'TRANSP:OPAQUE\r\n';
  str += 'END:VEVENT\r\n';
  return str;
};

module.exports = mongoose.model('Course', courseSchema);
