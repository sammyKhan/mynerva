Minerva Schedule Exporter
===

### How it works:
  * course schedule info stored in MongoDB
  * crn taken from request params and retrieved from db
  * renders iCalendar file format for use with Google Calendar, iCal etc.

### Current status:
  * Courses scraped from minerva thanks to Dom https://github.com/jokeofweek/hackmcgill
  * Basic outline of server

### What needs to be done:
  * Fix the file format output
  * Fill in the UI

### Future stuff:
  * Add support for other semesters
  * Add support for courses with 'TBA' day/time
  * Scrape exam schedules
  * Create API for managing courses
