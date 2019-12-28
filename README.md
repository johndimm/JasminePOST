## Testing POST requests using jasmine

This is a short example showing that special handling is needed to 
test POST requests using jasmine.  

##### Install and test

In one command shell:
```
npm install
node index.js
```

In another:
```
npm test
```

##### Flow

To get started, the node server responds to a GET / request with an HTML form:

```
  <!doctype html>
  <form action="/receiveForm" method="POST">
    to: <input name="to" />
    <br />
    from: <input name="from" />
    <br />
    message:
    <br />
    <textarea name="message" rows="6" cols="80"></textarea>
    <br />
    <input type="submit" />
  </form>
```

Navigate to

  http://localhost:3000/
  
Fill in some values and submit the form.  The server responds by returning the input 
parameters and logging some debug info.

```
app.post('/receiveForm', function(req, res) {
  console.log('body: ' + JSON.stringify(req.body));

  // When the request comes from the HTML form, the body has the expected hash of parameters.
  var params = req.body; // for POST.  for GET use req.query

  // Prove that we have the hash of parameters we wanted.
  console.log('to: ' + params.to);
  console.log('from: ' + params.from);
  console.log('message: ' + params.message);

  res.send({"response": params});
});

```

The response is good, as expected.  No problem when filling in the 
form.

```
{"response":{"to":"foo@bar.com","from":"moo@zar.com","message":"amber alert"}}
```

The server response shows it all worked when the data comes from an HTML form.

```
body: {"to":"foo@bar.com","from":"moo@zar.com","message":"amber alert"}
to: foo@bar.com
from: moo@zar.com
message: amber alert
```

To test this with jasmine, I created this options object for request, 
hoping it will result in the same request as the browser makes with the HTML 
form.  The form data is
stringified and passed as the "body", and I specified that it's json.


```
    const form = {
       to: "foo@bar.com",
       from: "moo@zar.com",
       message: "amber alert"
    };

    let formData = JSON.stringify(form);
    let contentLength = formData.length;

    it("passing POST params", function() {
      var options = {
        headers: {
          'Content-Length': contentLength,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri: url,
        body: formData,
        method: 'POST',
        json: true
      };
```
The command line response:

```
body: {"response":{"{\"to\":\"foo@bar.com\",\"from\":\"moo@zar.com\",\"message\":\"amber alert\"}":""}}
to: undefined
from: undefined
message: undefined
```

Server says:

```
body: {"{\"to\":\"foo@bar.com\",\"from\":\"moo@zar.com\",\"message\":\"amber alert\"}":""}
to: undefined
from: undefined
message: undefined
```

The workaround is easy.  The response no longer has a hash of the POST parameters.  But
they are available.  The field body.response is an object with one key 
that is itself a JSON string that parses to the hash.  The value at that key is the 
empty string.  Doesn't look right, but the information is there.

You can parse the key and use the resulting object:

```
  var keys = Object.keys(req.body);
  if (keys && keys.length == 1 && req.body[keys[0]] == '') {

    // But when the request comes from jasmine, the params are the
    // first and only key of body, as a JSON string.  Strange.
    // Must be something about how jasmine sends the request.

    params = JSON.parse(keys[0]);
  }
```

Now the jasmine test shows the right output:

```
body: {"response":{"to":"foo@bar.com","from":"moo@zar.com","message":"amber alert"}}
to: foo@bar.com
from: moo@zar.com
message: amber alert
```

And the server displays the right stuff:

```
Express Server Started on http://localhost:3000
body: {"{\"to\":\"foo@bar.com\",\"from\":\"moo@zar.com\",\"message\":\"amber alert\"}":""}
key: {"to":"foo@bar.com","from":"moo@zar.com","message":"amber alert"}
to: foo@bar.com
from: moo@zar.com
message: amber alert
```

Full source on github.