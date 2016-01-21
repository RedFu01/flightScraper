var dataProvider = require('./getData');
var combine = require('./combine');
var csv = require('csv-write-stream');
var fs = require('fs');



function parseEntries(data, callback){
	var count =0;
	for(var key in data){
		if(!(key == "full_count" || key == "visible" || key == "stats" || key == "version")){
			count ++;
			callback(dataProvider.parseEntry(key, data[key]));
		}
	}
	return count;
}

function getFolderName(){
	var result = 'flights-';
	var now = new Date();
	var day = now.getDate()<10?'0'+now.getDate():now.getDate();
	var month =  (now.getMonth()+1)<10?'0'+(now.getMonth()+1):(now.getMonth()+1);
	result +=day+'-'+month+'-'+now.getFullYear();
		
		try {
    		fs.statSync(result)
  		} catch(err) {
    		fs.mkdirSync(result);
  		}
		  
	return result;
}
function getFileName(){
	var result = 'temp-';
	var now = new Date();
	result+=now.getTime()+'.csv';
	return result;
}

var writer = csv({sendHeaders: false})
	writer.pipe(fs.createWriteStream(getFolderName()+'/'+getFileName()));
	
setInterval(function(){
	writer.end()
	writer = csv({sendHeaders: false});
	writer.pipe(fs.createWriteStream(getFolderName()+'/'+getFileName()));
},1000*60*2)
	
setInterval(function(){
	dataProvider.forAllPanes(14,function(data){
	//console.log(countEntries(data));
	console.log(parseEntries(data,function(d){
	writer.write(d)
	}))

	
})
},10*1000)

setInterval(function(){
	combine.start();
}, 1000*60*60*12)