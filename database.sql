CREATE TABLE IF NOT EXISTS invitees (name text, confirmed integer);

INSERT INTO invitees (name, confirmed) VALUES ('Steve', 1);
INSERT INTO invitees (name, confirmed) VALUES ('John', 0);
INSERT INTO invitees (name, confirmed) VALUES ('Jeff', 1);

SELECT * FROM invitees;
