

//C:\Users\ekirschning\AppData\Local\Apps\cURL\bin>
// curl --upload-file myFile.txt http://localhost:3000


// ------------ BEGIN MODULE SCOPE VARIABLES --------------


var fs;

try {
    fs = require("fs");
} catch (err) {
    console.log("fs not available in this environment");
}
var http = require('http');

http.createServer(function (request, response) {
    console.log(' server lsitening on port %d ', this.address().port);
    response.writeHead(200);
    var newFile = fs.createWriteStream(" fileCopy.md");
   
    var fileBytes = request.headers['content-length'];
    var uploadBytes = 0;
    request.on('readable', function () {
        var chunk = null;
     while (null !== (chunk = request.read())) {
            uploadBytes += chunk.length;
            var progress = (uploadBytes / fileBytes) * 100;
            response.write("progress:" + parseInt(progress, 10) + " %\n");
      
        }
     

    });
     request.pipe(newFile);
    request.on('end', function () {
           response.write("progress:100 %\n");
        response.end();
      console.log("end");
    });
    request.on('error', function (err) {
        console.log("error=" + err);

    });
  }).listen(3000);

