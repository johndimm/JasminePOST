var express = require('express');
var app = express();  //use express js module

//
// Return a simple HTML form.
//
app.get('/', function(req,res){
        res.send(`
  <!doctype html>
  <form action="/receiveForm" method="POST">
    to: <input name="to" />
    <br />
    from: <input name="from" />
    <br />
    message:
    <br />
    <textarea name="message" rows="6" cols="80"></textarea>
    <input type="submit" />
  </form>
        `);
});

//
// Handle POST request.
//
app.use(express.urlencoded({extended:true})); // to support URL-encoded bodies

app.post('/receiveForm', function(req, res) {
  console.log('body: ' + JSON.stringify(req.body));

  // When the request comes from the HTML form, the body has the expected hash of parameters.
  var params = req.body; // for POST.  for GET use req.query

  var keys = Object.keys(req.body);
  if (keys && keys.length == 1 && req.body[keys[0]] == '') {

    // But when the request comes from jasmine, the params are the
    // first and only key of body, as a JSON string.  Strange.
    // Must be something about how jasmine sends the request.

    params = JSON.parse(keys[0]);
  }

  // Prove that we have the hash of parameters we wanted.
  console.log('to: ' + params.to);
  console.log('from: ' + params.from);
  console.log('message: ' + params.message);

  res.send({"response": params});
});


const port = 3000;
app.set('port', port);

app.listen(app.get('port'), function(){ //start express server
        console.log( 'Express Server Started on http://localhost:' + port);
});
