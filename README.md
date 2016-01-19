#Nearbrite

Stay up to date with exciting events around you!

This Chrome extension uses Eventbrite's public API to get and display nearby popular events.

##Features

* Access browser current location and search for events on [Eventbrites](https://www.eventbrite.com/)
* Display events: names & time & categories...
* Sort by date
* Option page:
  * View upcomming events or next weekend events
  * Change ticket type: free, paid...
  * Adjust searching distance
 
## Screenshots

![1](https://raw.githubusercontent.com/LongPotato/Nearbrite/master/images/popup.jpeg)

![2](https://raw.githubusercontent.com/LongPotato/Nearbrite/master/images/option.jpeg)

## Setup

The API token has been excluded from this repo, you need to add your own API key in order for the extension to work

1. Register [a new app](http://www.eventbrite.com/myaccount/apps/) to get Eventbrite's API key
2. Create a new JavaScript file named `token.js` in the `script` directory:

     ```
     // Super secret API token:
     var TOKEN = "123456789";
     ```
 
3. Go to `chrome://extensions/` check "Developer mode" and "Load unpacked extension..."
