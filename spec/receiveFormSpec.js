var request = require("request");
var base_url = "http://localhost:3000/"

describe ("tests the ability to render a template", function() {
  var endpoint = "receiveForm";
  describe("POST /" + endpoint, function() {
    let url = base_url + endpoint;

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

      function receiveResponse(error, response, body) {
        // console.log('error: ' + JSON.stringify(error));
        // console.log('response: ' + JSON.stringify(response));
        console.log('body: ' + JSON.stringify(body));

        console.log('to: ' + body.response.to);
        console.log('from: ' + body.response.from);
        console.log('message: ' + body.response.message);

        expect(body.response.to).toBe('foo');
        done();
      }

      request(options, receiveResponse);
    });
  });
});
