# RSVP-web-app

to run a python server:
  - in the terminal go to the directory with your index.html
  - run this command: python -m SimpleHTTPServer
  - go to http://127.0.0.1:8000

to run index.js
  - in the terminal go to the backend directory
  - run this command: node index.js
  - go to http://localhost:3000/invitees

add invitees:
  - curl --data "name=John&confirmed=1" http://localhost:3000/invitees
  - curl --data "name=Steve&confirmed=0" http://localhost:3000/invitees
  - curl --data "name=Jeff&confirmed=0" http://localhost:3000/invitees
  - curl --data "name=George&confirmed=1" http://localhost:3000/invitees
  - curl --data "name=Sam&confirmed=1" http://localhost:3000/invitees
  - curl --data "name=Micheal&confirmed=1" http://localhost:3000/invitees
  - curl --data "name=Mio&confirmed=0" http://localhost:3000/invitees
  - curl --data "name=Josh&confirmed=1" http://localhost:3000/invitees
