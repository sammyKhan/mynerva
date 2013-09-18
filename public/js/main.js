$('#btn').click(function() {
  var crns = $('#crns').val().replace(/,/g, '-');
  var url = window.location.href + crns + '.ics';
  $('#answer').html('<p>Copy the following url into Google Calendar:</p>' + url);
});

