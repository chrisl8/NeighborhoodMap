var locations = [
    ['MakeICT', 37.686291, -97.319418, 1],
    ['Keeper of the Plains', 37.691342, -97.349687, 2],
    ['Riverside Park', 37.697514, -97.345547, 3],
    ['Intrust Arena', 37.683377, -97.332051, 4],
    ['Mead\'s Corner', 37.686375, -97.333181, 5],
    ['Century II', 37.684846, -97.340529, 6],
    ['Wichita Public Library', 37.684362, -97.338925, 7],
    ['The Labor Party', 37.688559, -97.326893, 8],
    ['Cow Town', 37.693687, -97.362591, 9],
    ['Botanica', 37.696229, -97.363135, 10],
    ['Wichita Art Museum', 37.695005, -97.356018, 11]
];

var ViewModel = function() {
  this.locationList = ko.observaleArray([]);

};

function initialize() {
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

    //  var marker = new google.maps.Marker({
    //    map:map,
    //    draggable: true,
    //    animation: google.maps.Animation.DROP,
    //    position: locations.MakeICT
    //  });

    for (var i = 0; i < locations.length; i++) {
        var location = locations[i];
        var myLatLng = new google.maps.LatLng(location[1], location[2]);
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            //icon: image,
            //shape: shape,
            animation: google.maps.Animation.DROP,
            title: location[0],
            zIndex: location[3]
        });
    }
}
google.maps.event.addDomListener(window, 'load', initialize);
