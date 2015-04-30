/* TODO:
   1. Map markers should:
    a. Dissapear during a search just like unfound items.
    b. "Highlight" when they are clicked in the list.
    c. Be clickable to behave the same way as the list items are.
  2. Search other locations besides Wikipedia, and display both,
  or only the ones with actual results.
    */

var locations = [
    ['MakeICT', 37.686291, -97.319418, 1],
    ['The Keeper of the Plains', 37.691342, -97.349687, 2],
    ['Riverside Park', 37.697514, -97.345547, 3],
    ['Intrust Bank Arena', 37.683377, -97.332051, 4],
    ['Mead\'s Corner', 37.686375, -97.333181, 5],
    ['Century II Performing Arts & Convention Center', 37.684846, -97.340529, 6],
    ['Wichita Public Library', 37.684362, -97.338925, 7],
    ['The Labor Party', 37.688559, -97.326893, 8],
    ['Old Cowtown Museum', 37.693687, -97.362591, 9],
    ['Botanica, The Wichita Gardens', 37.696229, -97.363135, 10],
    ['Wichita Art Museum', 37.695005, -97.356018, 11]
];

var markers = [];

var ViewModel = function() {
    var self = this;

    var mapOptions = {
        // 37.689768, -97.338209
        center: {
            lat: 37.689768,
            lng: -97.338209
        },
        zoom: 15
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    for (var i = 0; i < locations.length; i++) {
        var location = locations[i];
        var myLatLng = new google.maps.LatLng(location[1], location[2]);
        var marker = new google.maps.Marker({
            position: myLatLng,
            //map: map,
            //icon: image,
            //shape: shape,
            animation: google.maps.Animation.DROP,
            title: location[0],
            zIndex: location[3]
        });
        markers.push(marker);
    }
    markers.forEach(function(value) {
        value.setMap(map);
    });


    this.locSearchString = ko.observable('');

    this.fullLocationList = ko.observableArray([]);

    this.showArticle = ko.observable(false);

    this.locationList = ko.computed(function() {
        this.showArticle(false);
        var list = [];
        if (this.locSearchString() === '') {
            locations.forEach(function(locationItem) {
                list.push(locationItem[0]);
            });
            markers.forEach(function(value) {
                value.setMap(map);
            });
            return list;
        } else {
            locations.forEach(function(locationItem) {
                if (locationItem[0].toLowerCase().indexOf(this.locSearchString().toLowerCase()) >= 0) {
                    list.push(locationItem[0]);
                }
            }, this);
            markers.forEach(function(value) {
                if (list.indexOf(value.title) >= 0) {
                    value.setMap(map);
                } else {
                    value.setMap(null);
                }
            });
            return list;
        }
    }, this);

    this.wikiPediaArticle = ko.observable();

    this.searchForArticle = function(location) {
        // URL For WikiPedia search.
        var wikipediaURL = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + location + "&format=json";
        // Using dataType: jsonp will tell jQuery to turn this into a JSONP request
        $.ajax(wikipediaURL, {
            dataType: 'jsonp'
        })
            .done(function(data) {
                self.wikiPediaArticle(data[2][0]);
                self.showArticle(true);
            })
            .fail(function() {
                self.wikiPediaArticle('Wikipedia Articles Could Not Be Loaded');
                self.showArticle(true);
            });
    };
};

google.maps.event.addDomListener(window, 'load');
/* If you get the error:
Uncaught TypeError: Cannot read property 'nodeType' of null
It means your script was executed before the HTML was rendered,
and you need to make sure ko.applyBindings does not run until
after the DOM is built.
Often an easy way is to simply put the scripts at the bottom of
the HTML document instead of at the top. */
ko.applyBindings(new ViewModel());
