const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'my_database',
  port: 54320,
});

//get all Invitees
const getInvitees = (request, response) => {
  pool.query('SELECT * FROM invitees', (error, results) => {
    if(error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
}

//get invitee by name
const getInviteeByName = (request, response) => {
  const name = request.params.name;

  pool.query('SELECT * FROM invitees WHERE name = $1', [name], (error, results) => {
    if(error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
}

//get invitees by has confirmed
const getInviteesByHasConfirmed = (request, response) => {
  const confirmed = 1;
  console.log('test');
  pool.query('SELECT * FROM invitees WHERE confirmed = $1', [confirmed], (error, results) => {
    if(error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
}

//add invitee
const addInvitee = (request, response) => {
  const { name, confirmed } = request.body;

  pool.query('INSERT INTO invitees (name, confirmed) VALUES ($1, $2)', [name, confirmed], (error, results) => {
    if(error) {
      throw error;
    }
    response.status(201).send(`Invitee added with name: ${name}`);
  });
}

//edit invitee by name
const editInvitee = (request, response) => {
  const nameInput = request.params.name;
  const { name, confirmed } = request.body;

  pool.query(
    'UPDATE invitees SET name = $1, confirmed = $2 WHERE name = $3',
    [name, confirmed, nameInput],
    (error, results) => {
      if(error) {
        throw error;
      }
      response.status(200).send(`Invitee modified with name: ${nameInput}`);
    }
  );
}

//remove invitee
const removeInvitee = (request, response) => {
  const name = request.params.name;

  pool.query(
    'DELETE FROM invitees WHERE name = $1', [name], (error, results) => {
    if(error) {
      throw error;
    }
    response.status(200).send(`Invitee removed with name ${name}`);
    }
  );
}

//export functions
module.exports = {
  getInvitees,
  getInviteeByName,
  getInviteesByHasConfirmed,
  addInvitee,
  editInvitee,
  removeInvitee,
}
