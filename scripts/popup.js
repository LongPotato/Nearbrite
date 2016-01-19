// Initalized global variables:
var gTime = "now";
var gTicket = "";
var gDistance = "10mi";

// Display the events to the HTML page
function displayEvents(data) {
    $('#loading').hide();
    
    $.each(data, function(i, item) {
        var entry = 
          '<div class="event">\
           <a target="_blank" href="' + item.url + '">\
            <div id="' + item.id + '" class="item">\
              <img src="' + item.pic + '" width="107" height="60" />\
              <h4 class="headline">' + item.title + '</h4>\
              <div class="time">' + item.time + '</div>\
              <div class="tag">' + item.tag + '</div>\
            </div>\
          </a>\
          </div>';
        
        $("#field").append(entry);
    });
}

// Pass the values stored in storage to the global variabes
function getOptions() {
    // 2 arguments: default values & call back function to assign variables
    chrome.storage.sync.get({time: "now",
                             ticket: "all",
                             distance: "10mi"},
        function(items) {
            gTime = items.time;
            gTicket = items.ticket;
            gDistance = items.distance;
        });
}

// Everything start here
$(document).ready(function() {
    // Get user's options stored from chrome.storage
    getOptions();
    
    // Check & access user's current location from the browser
    if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function(position) {
            // Pass the values for the API parameters to the background script and retrieve the repsonse
            chrome.runtime.sendMessage({'action': 'fetch' ,
                                        'latitude': position.coords.latitude, 
                                        'longitude': position.coords.longitude,
                                        'time': gTime, 'ticket': gTicket,
                                        'distance': gDistance},            
                function(response) {
                    displayEvents(response);
                }
            );
        });
    } else { 
        alert("Geolocation is not supported by this browser!");
    }
});