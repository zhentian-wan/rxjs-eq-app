var quakes = Rx.Observable
    .interval(2000)
    .flatMap(function(){
        return Rx.DOM.jsonpRequest({
            url: QUAKE_URL,
            jsonpCallback: 'eqfeed_callback'
        }).retry(3);
    })
    .flatMap(function(result){
        return Rx.Observable.from(result.response.features);
    })
    .distinct(function(quake){
        return quake.properties.code;
    });

quakes.subscribe(function(quake){
    var coords = quake.geometry.coordinates;
    var size = quake.properties.mag * 10000;
 
    L.circle([coords[1], coords[0]], size).addTo(map);
});


/*Rx.Observable.create(function(observer){
    window.eqfeed_callback = function(response){
        observer.onNext(response);
        observer.onCompleted();
    };
    loadJSONP(QUAKE_URL);
}).flatMap(function transform(dataset){
    return Rx.Observable.from(dataset.features);
}).map(function(quake){
    return {
        lat: quake.geometry.coordinates[1],
        lng: quake.geometry.coordinates[0],
        size: quake.properties.mag * 10000
    }
});

quakes.subscribe(function(quake){
    L.circle([quake.lat, quake.lng], quake.size).addTo(map)
});
*/
