// Default global variables:
var gLatitude = "0";
var gLongitude = "0";
var gDistance = "10mi";
var gCategories = new Object();

// Retrieve the list of categories and insert their names into a hash map with their coressponding ids
function compileCategories() {
    var url = "https://www.eventbriteapi.com/v3/categories/?token=" + TOKEN;
    var request = new XMLHttpRequest();
    
    // When the request is completed, map the categories to the hashmap
    request.onreadystatechange = function(data) {
        if (request.readyState == 4) {
          if (request.status == 200) {
            var data = request.responseText;
            var obj = $.parseJSON(data);
             
            $.each(obj.categories, function(i, item) {
                gCategories[item.id] = item.short_name;
            });  
          } else {
            console.log('Error', request.status)
          }
        }
    }
    
    // Perform a GET request to the API url
    request.open('GET', url, true);
    request.send(); 
}

// Do some dirty works to clean up and organize event's contents
function parseEvent(item) {
    var event = new Object();
    
    // Shorten the event's name
    if (item.name.text.length > 35) {
        event.title = item.name.text.substr(0, 35);
        event.title = event.title + "...";
    } else {
        event.title = item.name.text;
    }
    event.url = item.url;
    event.id = item.id;
    
    // Check if the event's logo exists
    event.pic = item.logo == null ? '' : item.logo.url;
    // Format the time
    event.time = moment(item.start.local).format("ddd, MMM D YYYY, h:mm a");
    // Match event's category id
    event.tag = gCategories[item.category_id];

    return event;   
}

// Send out an HTTP GET request to retrieve the list of events and process the response
function fetchEvents(url, callback) {
    var request = new XMLHttpRequest();
    
    // Call back function to be invoked when the request is completed
    request.onreadystatechange = function(data) {
        if (request.readyState == 4) {
          if (request.status == 200) {
            // Parse the JSON text into JSON object
            var data = request.responseText;
            var obj = $.parseJSON(data);
            var events = new Array();
            
            // Extract each event's contents
            $.each(obj.events, function(i, item) {
                events.push(parseEvent(item));
            });
              
            // Pass the array of events back to the popup script
            callback(events);
          } else {
            console.log('Error', request.status)
            callback(null);
          }
        }
    }
    
    // Perform a GET request to the API url
    request.open('GET', url, true);
    request.send();
}

// Listen to the request from popup script
chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    
    if (request.action == 'fetch') {
        // Update the variables for url insertion
        gLatitude = request.latitude;
        gLongitude = request.longitude;
        gDistance = request.distance;
        
        var url = "https://www.eventbriteapi.com/v3/events/search/?sort_by=date&location.latitude=" 
                   + gLatitude + "&popular=on&token=" 
                   + TOKEN + "&location.longitude=" 
                   + gLongitude + "&location.within=" + gDistance
                   + "&price=" + request.ticket;
        
        // Calculate the date range for next weekend option
        if (request.time == "next") {
          // This will return the Sunday of next weekend (end of range)
          var endTime = moment().add(1, 'weeks').endOf('isoWeek').format("YYYY-MM-DDThh:mm:ss");
          // This will return the Friday night (start of range)
          var startTime = moment().add(1, 'weeks').endOf('isoWeek').subtract(2, 'days').format("YYYY-MM-DDThh:mm:ss");
          url = url + "&start_date.range_start=" + startTime + "&start_date.range_end=" + endTime;
        }
        
        compileCategories();
        fetchEvents(url, callback);
        return true;
    }
});