var fs = require('fs');
var concat = require('concat-files');
var AdmZip = require('adm-zip');
var zip = new AdmZip();
var pathLib = require('path');

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(pathLib.join(srcpath, file)).isDirectory();
  });
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

function compressPath(path){

var files = fs.readdirSync(__dirname+path)
console.log(files);

for(var i = 0; i< files.length; i++){
	files[i] = __dirname+path+'/'+files[i];
}
console.log(files);
  concat(files, __dirname+path+path+'.csv', function() {

	  for(var i=0; i< files.length; i++){
	  	fs.unlink(files[i])
      }
	  compress();
	  
  });
}
  function compress(path){
	  zip.addLocalFile(__dirname+path+path+'.csv');
	  zip.writeZip(__dirname+path+'.zip');
    fs.unlink(__dirname+path+path+'.csv');
    fs.rmdir(__dirname+path);
  }


function start(){
  var folder = getDirectories(__dirname);
  
  for(var i=0; i< folder.length;i++){
    if(folder[i] != getFolderName()){
      compressPath('/'+folder[i]);
    }
  }
}

module.exports = {
	start: start,
}
  