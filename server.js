var http = require('http');

function onRequest(request, response){
    console.log("Someone Made A Connection");
    response.write("yas");
}

http.createServer(onRequest).listen();
console.log("Server is running....");

