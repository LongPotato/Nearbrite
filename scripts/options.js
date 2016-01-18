// Insert the stored values back to display on the option page
function restoreOptions() {
    chrome.storage.sync.get(function(items) {
        $('input[name=time][value=' + items.time + ']').prop('checked', true);
        $('input[name=ticket][value=' + items.ticket + ']').prop('checked', true);
        $('#distance').html(items.distance.replace('mi',''));
        $('#slider').val(items.distance.replace('mi',''));
    });
}


$(document).ready(function() {
    
    restoreOptions();
    
    // Save options to chrome.storage
    $('#save').click(function() {
        var time = $('input[name=time]:checked').val();
        var ticket = $('input[name=ticket]:checked').val();
        var distance = $('#slider').val() + 'mi';

        chrome.storage.sync.set({
          time: time,
          ticket: ticket,
          distance: distance
        }, function() {
          // Update status to let user know options were saved.
          var status = document.getElementById('status');
          status.textContent = 'Options saved.';
          setTimeout(function() {
            status.textContent = '';
          }, 750);
        });
    });
});


// Display the value of the slider bar
$(function() {
	var value = $('#distance');

	$('#slider').change(function(){
	    value.html(this.value);
	});
});