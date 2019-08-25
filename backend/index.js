const express = require('express');
const bodyParser = require('body-parser');
const queries = require('./queries');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (request, response) => {
  response.json({info: 'RSVP app, with Node.js and postgres API'});
});

app.post('/invitees', queries.addInvitee);
app.get('/invitees', queries.getInvitees);
app.get('/invitees/:name', queries.getInviteeByName);
app.put('/invitees/:name', queries.editInvitee);
app.delete('/invitees/:name', queries.removeInvitee);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
