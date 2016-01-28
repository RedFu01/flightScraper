var http = require('http');

var proxys =[
	{
		ip:"202.50.176.212",
		port:8080
	},
	{
		ip:"123.195.148.199",
		port:80
	},
	{
		ip:"61.191.27.117",
		port:443
	},
	{
		ip:"134.119.20.197",
		port:80
	},
	{
		ip:"79.165.50.14",
		port: 4444
	},
	{
		ip: "134.119.20.197",
		port:80
	},
	{
		ip:"84.75.168.193",
		port:80
	},
	{
		ip:"218.213.166.218",
		port:81
	},
	{
		ip:"123.195.148.199",
		port:80
	}
];
var proxyIndex = 0;
function getProxy(){
	var res = proxys[proxyIndex];
	proxyIndex++;
	proxyIndex = proxyIndex % proxys.length;
	return res;
}

function forAllPanes(split, processingCallback){
	var lngSplit = 360/split;
	var latSplit = 180/split;
	for(var currLat = -90; currLat <= 90-latSplit; currLat+=latSplit){
		
		for(var currLng = -180; currLng <= 180-lngSplit; currLng += lngSplit){
			var bounds={
				southwest:{
					lat: currLat,
					lng: currLng
				},
				northeast:{
					lat: currLat + latSplit,
					lng: currLng + lngSplit
				}
			};
			loadData(bounds, processingCallback);
		}
	}
}

function parseEntry(key, array){
	return {
		writeTime: new Date(),
		key:key,
		registrationNumber: array[0],
		lat: parseFloat(array[1]),
		lng: parseFloat(array[2]),
		track: parseFloat(array[3]),
		altitude: parseFloat(array[4]),
		horizontalSpeed: parseFloat(array[5]),
		squawk: array[6],
		radar: array[7],
		aircraftType: array[8],
		registration: array[9],
		timestamp: array[10],
		startAirport: array[11],
		endAirport: array[12],
		flightNumber: array[13],
		verticalSpeed: parseFloat(array[15]),
		internationalFlightNumber: array[16]
	};
}

function loadData(bounds,callback){
	var proxy = getProxy();
	var options = {
		
  host: proxy.ip,
  port: proxy.port,
  path: 'http://data.flightradar24.com/zones/fcgi/feed.js?bounds='+bounds.northeast.lat+','+bounds.southwest.lat+','+bounds.southwest.lng+','+bounds.northeast.lng+'&faa=1&mlat=1&flarm=1&adsb=1&gnd=1&air=1&vehicles=1&estimated=1&maxage=1600&gliders=1&stats=0',
  headers: {
    Host: "data.flightradar24.com"
  }
  // host: 'data.flightradar24.com',
  // port: 80,
  // path: '/zones/fcgi/feed.js?bounds='+bounds.northeast.lat+','+bounds.southwest.lat+','+bounds.southwest.lng+','+bounds.northeast.lng+'&faa=1&mlat=1&flarm=1&adsb=1&gnd=1&air=1&vehicles=1&estimated=1&maxage=900&gliders=1&stats=0&'
};
	
	http.get(options, function(res) {
		var response ='';
		//console.log("Got response: " + res.statusCode);
	
	if(res.statusCode == 200){
		res.on("data", function(chunk) {
			response+=chunk;
		});
		res.on('end',function(){
			try{
			callback(JSON.parse(response));
			}catch(e){
				console.log(e);
			}
		});
	}else{
		callback(undefined);
	}
	}).on('error', function(e) {
  		console.log("Got error: " + e.message +' @proxy: '+proxy.ip+':'+proxy.port);
	});
}

module.exports = {
	loadData: loadData,
	forAllPanes:forAllPanes,
	parseEntry:parseEntry,
}