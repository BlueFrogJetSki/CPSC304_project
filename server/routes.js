require('dotenv').config();
const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());




async function getConnection() {
	return await oracledb.getConnection({
		user: process.env.ORACLE_USER,
		password: process.env.ORACLE_PASSWORD,
		connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/stu`,
	});
}

async function closeConnection(connection) {
	try {
		if (connection) {
			await connection.close();
			console.log('Connection closed successfully.');
		}
	} catch (error) {
		console.error('Error closing the connection:', error);
	}
}

// API Routes

// --------------- GET ROUTES ------------------
// GET a health entry given a userId
app.get('/health-entries/:userId', async (req, res) => {
	const { userId } = req.params;
	let connection;
	try {
		connection = await getConnection();
		const result = await connection.execute(
			`SELECT * FROM HealthEntries WHERE user_id = :userId`,
			{ userId }
		);
		res.status(200).json(result.rows);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});
// GET a health entry given a entryid
app.get('/health-entry/:Id', async (req, res) => {
	let connection;
	let { Id } = req.params;
	console.log(Id);

	try {
		connection = await getConnection();
		const result = await connection.execute(
			`SELECT * FROM HealthEntries WHERE Id = :Id`,
			{ Id: Number(Id) }
		);
		console.log(result);
		res.status(200).json(result.rows);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});

// GET a device given a userId
app.get('/devices/:userId', async (req, res) => {
	const { userId } = req.params;
	let connection;
	try {
		connection = await getConnection();
		const result = await connection.execute(
			`SELECT * FROM Devices WHERE user_id = :userId`,
			{ userId }
		);
		res.status(200).json(result.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});
// GET a users vitals given userId
app.get('/users-vitals/:userId', async (req, res) => {
	const { userId } = req.params;
	let connection;
	try {
		connection = await getConnection();
		const result = await connection.execute(
			`SELECT * FROM Users_Vitals WHERE user_id = :userId`,
			{ userId }
		);
		res.status(200).json(result.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});
// GET a user given userId
app.get('/users/:id', async (req, res) => {
	const { id } = req.params;
	let connection;
	try {
		connection = await getConnection();
		const result = await connection.execute(
			`SELECT * FROM Users WHERE Id = :id`,
			{ id }
		);
		res.status(200).json(result.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});

app.get('/conditions', async (req, res) => {
	let connection;

	try {
		connection = await getConnection();
		const result = await connection.execute(`SELECT * FROM Conditions`);
		res.status(200).json(result.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});

// GET all users
app.get('/users', async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const result = await connection.execute(`SELECT * FROM Users`);
		res.status(200).json(result.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});
// GET all programs
app.get('/programs', async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const result = await connection.execute(`SELECT * FROM Programs`);
		res.status(200).json(result.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});

// GET a program given programID
app.get('/programs/:id', async (req, res) => {
	let connection;
	const { id } = req.params;
	try {
		connection = await getConnection();
		const result = await connection.execute(
			`SELECT * FROM Programs WHERE Id = :id`,
			{ id }
		);
		res.status(200).json(result.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});


// GET a health entry given a entryid
app.get('/consultant-for-user/:userId', async (req, res) => {
	let connection;
	const { userId } = req.params;
	console.log(userId)

	try {
		connection = await getConnection();
		const result = await connection.execute(`SELECT C.Id, C.Name, C.education, C.email FROM Users U JOIN Consultants C ON U.consultant_id = C.Id WHERE U.Id = ${userId}`);
		console.log(result);
		res.status(200).json(result.rows);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});

// ---------------- POST ROUTES ---------------------

// POST register
app.post('/register', async (req, res) => {
	let connection;
	const { firstName, lastName, dob, consultant_id } = req.body;
	try {
		connection = await getConnection();
		await connection.execute(
			`INSERT INTO Users (firstName, lastName, dob, consultant_id) VALUES (:firstName, :lastName, :dob, :consultant_id)`,
			{ firstName, lastName, dob, consultant_id },
			{ autoCommit: true }
		);
		res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});

// POST login
app.post('/login', async (req, res) => {
	let connection;
	// this is assuming login is based on full name
	const { Id } = req.body;
	console.log(Id);
	try {
		connection = await getConnection();
		const result = await connection.execute(
			`SELECT * FROM Users WHERE Id = :Id`,
			{ Id }
		);
		if (result.rows.length > 0) {
			res
				.status(200)
				.json({ message: 'Login successful', userId: result.rows[0][0] });
		} else {
			res.status(401).json({ message: 'Invalid credentials' });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});

// POST health entries
//TODO:
// The INSERT operation should be able to handle the case where the foreign
// key value in the tuple being inserted does not exist in the relation that is being
// referred to.
// This "handling" can either be that the inserted tuple is rejected by the GUI
// with an appropriate error message or that the values that are being referred
// to are inserted
app.post('/health-entries', async (req, res) => {
	let connection;
	const { Date:entryDate, Prescription:prescription, Treatment:treatment, Notes:notes, userId:user_id, consultantId:consultant_id } =
		req.body;

	// unique id generation
	const id = uuidv4().replace(/\D/g, '').substring(0, 8);
	console.log(id)

	try {
		connection = await getConnection();
		await connection.execute(
			`INSERT INTO HealthEntries (id, entryDate, prescription, treatment, notes, user_id, consultant_id) 
			 VALUES (:id, TO_DATE(:entryDate, 'YYYY-MM-DD'), :prescription, :treatment, :notes, :user_id, :consultant_id)`,
			{ id, entryDate, prescription, treatment, notes, user_id, consultant_id },
			{ autoCommit: true }
		);
		res.status(201).json({ message: 'Health entry added successfully', id });
	} catch (error) {
		if (error.message.includes('ORA-02291')) {
			res.status(400).json({
				error:
					'The foreign key value does not exist. Please ensure user_id and consultant_id are valid.',
			});
		} else {
			res.status(500).json({ error: error.message });
		}
	} finally {
		closeConnection(connection);
	}
});

// POST devices
app.post('/devices', async (req, res) => {
	let connection;
	const { model, deviceType, user_id } = req.body;
	try {
		connection = await getConnection();
		await connection.execute(
			`INSERT INTO Devices (model, deviceType, user_id) VALUES (:model, :deviceType, :user_id)`,
			{ model, deviceType, user_id },
			{ autoCommit: true }
		);
		res.status(201).json({ message: 'Device added successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});

// ---------------- PUT ROUTES    ---------------------
app.put('/users/:id', async (req, res) => {
	let connection;
	const { id } = req.params;
	const { firstName, lastName, dob, consultant_id } = req.body;
	try {
		connection = await getConnection();
		await connection.execute(
			`UPDATE Users SET firstName = :firstName, lastName = :lastName, dob = :dob, consultant_id = :consultant_id WHERE Id = :id`,
			{ firstName, lastName, dob, consultant_id, id },
			{ autoCommit: true }
		);
		res.status(200).json({ message: 'User updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});

// PUT/UPDATE Health entries given id
app.put('/health-entries/:id', async (req, res) => {
	let connection;
	const { id } = req.params;
	const { Date:entryDate, Prescription:prescription, Treatment:treatment, Notes:notes, userId:user_id, consultantId:consultant_id } =
		req.body;

	try {
		connection = await getConnection();
		await connection.execute(
			`UPDATE HealthEntries SET entryDate = TO_DATE(:entryDate, 'YYYY-MM-DD'), prescription = :prescription, treatment = :treatment, notes = :notes, user_id = :user_id, consultant_id = :consultant_id WHERE Id = :id`,
			{ entryDate, prescription, treatment, notes, user_id, consultant_id, id },
			{ autoCommit: true }
		);
		res.status(200).json({ message: 'Health entry updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});

// ---------------- DELETE ROUTES ---------------------

//TODO
//Delete requirement:
// Implement a cascade-on-delete situation for this relation (or an alternative that was
// agreed to by the TA if the DB system doesn’t provide this).
app.delete('/users/:id', async (req, res) => {
	let connection;
	const { id } = req.params;
	try {
		connection = await getConnection();
		await connection.execute(
			`DELETE FROM Users WHERE Id = :id`,
			{ id },
			{ autoCommit: true }
		);
		res.status(200).json({ message: 'User deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});

app.delete('/health-entries/:id', async (req, res) => {
	let connection;
	const { id } = req.params;
	try {
		connection = await getConnection();
		await connection.execute(
			`DELETE FROM HealthEntries WHERE Id = :id`,
			{ id },
			{ autoCommit: true }
		);
		res.status(200).json({ message: 'Health entry deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});

app.delete('/devices/:id', async (req, res) => {
	let connection;
	const { id } = req.params;
	try {
		connection = await getConnection();
		await connection.execute(
			`DELETE FROM Devices WHERE Id = :id`,
			{ id },
			{ autoCommit: true }
		);
		res.status(200).json({ message: 'Device deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});

// Join query
app.get('/health-entries-users/:userId', async (req, res) => {
	let connection;
	const { userId } = req.params;
	try {
		connection = await getConnection();
		const result = await connection.execute(
			`SELECT he.Id, he.entryDate, he.prescription, he.treatment, he.notes, 
                    u.firstName, u.lastName 
             FROM HealthEntries he
             JOIN Users u ON he.user_id = u.Id
             WHERE he.user_id = :userId`,
			{ userId }
		);
		res.status(200).json(result.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});

//Group By
app.get('/health-entries-summary/:userId', async (req, res) => {
	let connection;
	const { userId } = req.params;
	try {
		connection = await getConnection();
		const result = await connection.execute(
			`SELECT he.treatment, COUNT(*) AS entry_count 
             FROM HealthEntries he
             WHERE he.user_id = :userId
             GROUP BY he.treatment`,
			{ userId }
		);
		res.status(200).json(result.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});

// having: vitals
app.get('/frequent-treatments/:userId', async (req, res) => {
	let connection;
	const { userId } = req.params;
	try {
		connection = await getConnection();
		const result = await connection.execute(
			`SELECT he.treatment, COUNT(*) AS entry_count 
             FROM HealthEntries he
             WHERE he.user_id = :userId
             GROUP BY he.treatment
             HAVING COUNT(*) >= 2`,
			{ userId }
		);
		res.status(200).json(result.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});

// Nested Group By
app.get('/nested-health-entries/:userId', async (req, res) => {
	let connection;
	const { userId } = req.params;
	try {
		connection = await getConnection();
		const result = await connection.execute(
			`SELECT he.consultant_id, he.treatment, COUNT(*) AS entry_count 
             FROM HealthEntries he
             WHERE he.user_id = :userId
             GROUP BY he.consultant_id, he.treatment`,
			{ userId }
		);
		res.status(200).json(result.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});

// Division
app.get('/users-in-all-programs', async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const result = await connection.execute(
			`SELECT U.Id, U.firstName, U.lastName
			FROM Users U
			WHERE NOT EXISTS (
				SELECT P.Id
				FROM Programs P
				MINUS
				SELECT R.program_id
				FROM RegisteredIn R
				WHERE R.user_id = U.Id
			)`
		);
		res.status(200).json(result.rows);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});

// Selection
const allowedAttributes = ['scientific_name', 'description', 'treatment'];
const allowedOperators = ['=', '>', '<', '>=', '<=', '!='];
app.post('/search-conditions', async (req, res) => {
	let connection;
	const { conditionString } = req.body;

	if (!conditionString || typeof conditionString !== 'string') {
		return res.status(400).json({ error: 'Invalid condition string' });
	}

	try {
		//regex to split into tokens, respecting quoted strings
		/*
		Regex broken down

		(?:...) - non capturing group

			inside non capturing group:

			[^\s"]+ 
		   		^  character set, matching characters not included in the set
		   		^  character set, matching characters not included in the set
				\s  whitespace characters (spaces, tabs, newline etc)
				"  double quote
			matches any character that is not whitespace or double quote
			+ one or more of these characters overall
		
			double quoted strings:

			"[^"]*"
				"  opening double quote
				[^"]*  zero or more chars NOT double quote
				"  closing double quote
				e.g treatment = "Physical Therapy", "Physical Therapy" matches this

			single quoted strings:

			'[^']*'
				'  opening single quote
				[^']* zero or more characters NOT single quote
				'  closing single quote
				e.g treatment = 'Diabetes', 'diabetes' would match this

		+ outside non capturing lets us know the pattern can match 1+ tokens consecutively
		
		g is global flag that ensures regex finds all matches in the input string and not only one.
		
		*/

		const tokens = conditionString.match(/(?:[^\s"]+|"[^"]*"|'[^']*')+/g);
		const clauses = [];
		const binds = {};
		let bindIndex = 0;

		console.log(tokens)

		// looping through all the tokens we found using regex
		for (let i = 0; i < tokens.length; i++) {
			// current token
			let token = tokens[i];

			// if the token is one of the attributes (columns of the conditions table)
			if (allowedAttributes.includes(token)) {
				// Process attribute

				// first token is the attribute, so assign it as that
				const attribute = token;

				//check next token for the operator (operator always follows an attribute)
				const operator = tokens[++i];
				//error handling for invalid operators
				if (!allowedOperators.includes(operator)) {
					throw new Error(`Invalid operator: ${operator}`);
				}
				//check next token for the value (value always follows operator)
				let value = tokens[++i];

				
				//error handling for if value does not exist
				if (!value) {
					throw new Error(`Missing value for attribute: ${attribute}`);
				}
				
				//if next word is not 'AND' or 'OR' it means there is a space between the two words
				while (!['AND', 'OR'].includes(tokens[i + 1]) && tokens[i+1] != null) {
					value += ` ${tokens[++i]}`
				}



				//remove surrounding quotes (single or double)
				value = value.replace(/^["']|["']$/g, '');

				//add the clause using LOWER() to remove case sensitivity
				const paramName = `param${bindIndex++}`;
				clauses.push(`LOWER(${attribute}) ${operator} LOWER(:${paramName})`);
				binds[paramName] = value.toLowerCase();
			} else if (['AND', 'OR'].includes(token)) {
				// Process logical operator
				clauses.push(token);
			} else {
				throw new Error(`Unexpected token: ${token}`);
			}
		}

		//form the WHERE condition by joining all the clauses
		const whereClause = clauses.join(' ');

		

		//construct SQL query
		const query = `SELECT * FROM Conditions WHERE ${whereClause}`;
		console.log(whereClause)
		console.log(binds)
		connection = await getConnection();
		const result = await connection.execute(query, binds);
		res.status(200).json(result.rows);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});

//Projection on vitals
app.post('/vitals/:userId', async (req, res) => {
	let connection;
	const { userId } = req.params;
	const { projectionAttributes } = req.body;

	let selectedAttributes = '*';
	if (projectionAttributes && projectionAttributes.join('') != '') {
		console.log(projectionAttributes);
		selectedAttributes = projectionAttributes.filter(str => str != '');
		selectedAttributes = selectedAttributes.join(',');
	}
	console.log(selectedAttributes);

	try {
		connection = await getConnection();
		const result = await connection.execute(
			`Select ${selectedAttributes} FROM Users_Vitals WHERE user_id = :userId`,
			{ userId: userId }
		);
		res.status(200).json(result.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		closeConnection(connection);
	}
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});