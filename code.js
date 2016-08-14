var quakes = Rx.Observable.create(function(observer){
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

