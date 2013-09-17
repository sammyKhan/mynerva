var mongoose = require('mongoose');

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

courseSchema.methods.toVEvent = function() {
  var str = 'BEGIN:VEVENT\n';
  str += 'DTSTART;TZID=America/Toronto:' + this.startTime + '\n';
  str += 'DTEND;TZID=America/Toronto:' + this.endTime + '\n';
  str += 'RRULE:FREQ=WEEKLY;';
  str += 'UNTIL=' + this.until;
  str += ';BYDAY=' + this.days + '\n';
  str += 'UID:' + this._id + '\n';
  str += 'DESCRIPTION:' + this.title + '\n';
  str += 'LAST-MODIFIED:' + this.lastMod + '\n';
  str += 'LOCATION:' + this.location + '\n';
  str += 'STATUS:CONFIRMED\n';
  str += 'SUMMARY:' + this.courseCode + '\n';
  str += 'TRANSP:OPAQUE\n';
  str += 'END:VEVENT\n';
};

module.exports = mongoose.model('Course', courseSchema);
