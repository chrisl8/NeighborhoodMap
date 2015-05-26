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
        // 37.689768, -97.338209 is downtown Wichita, KS
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
            // icon: must be set to a null string in order to change it later.
            icon: '',
            //shape: shape,
            animation: google.maps.Animation.DROP,
            title: location[0],
            zIndex: location[3]
        });
        markers.push(marker);
    }
    markers.forEach(function(value) {
        value.setMap(map);
        google.maps.event.addListener(value, 'click', function() {
            self.searchForArticle(value.title);
        });
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
            // Clear any marker highlights if search text is entered
            self.highlightMarker('');
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

    this.highlightMarker = function(text) {
        markers.forEach(function(value, index) {
            if (text == value.title) {
                markers[index].icon = 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/orange.png';
                // Clear and redisplay the marker to activate the new icon:
                value.setMap(null);
                value.setMap(map);
                map.setCenter(markers[index].getPosition());
            } else {
                // Only reset and reanimate the previously highlighted marker,
                // not all of them:
                if (markers[index].icon !== '') {
                    markers[index].icon = '';
                    value.setMap(null);
                    value.setMap(map);
                }
            }
        });
    };

    this.searchForArticle = function(location) {
        self.highlightMarker(location);
        // URL For WikiPedia search.
        var wikipediaURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + location + '&format=json';
        // Using dataType: jsonp will tell jQuery to turn this into a JSONP request
        $.ajax(wikipediaURL, {
            dataType: 'jsonp'
        })
            .done(function(data) {
                if (data[2][0] !== undefined) {
                    self.wikiPediaArticle(data[2][0]);
                } else {
                    self.wikiPediaArticle('No WikiPedia article found.');
                }
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
