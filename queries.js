const config = require('./newsletterConfig');
const Pool = require('pg').Pool
const pool = new Pool(config.postgresConfig)

async function retrieveEmails() {
    try {
        const res = await pool.query("SELECT * FROM emails ORDER BY email ASC");
        return res.rows.map((email) => email.email);
    } catch (error) {
        console.error(error);
        return [];
    }
}

const getEmails = (request, response) => {
    pool.query('SELECT * FROM emails ORDER BY email ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows.map((email) => email.email))
    })
}

const postEmails = (request, response) => {
    const { email } = request.body
    let isEmailAlreadySubscribed = false;
    pool.query('SELECT EXISTS(SELECT 1 FROM emails WHERE email = $1)', [email], (error, results) => {
        if (error) {
            throw error
        }
        isEmailAlreadySubscribed = results.rows[0].exists
        if (!isEmailAlreadySubscribed) {
            pool.query('INSERT INTO emails (email) VALUES ($1) RETURNING *', [email], (error, results) => {
                if (error) {
                    throw error
                }
                response.status(201).send({ status: "success", response: "Successfully subscribed to our weekly newsletter" })
            })
        }
        else {
            response.status(201).send({ status: "failed", response: "Email: " + email + " is already subscribed" })
        }
    })

}

const deleteEmail = (request, response) => {
    const email = request.params.email
    pool.query('DELETE FROM emails WHERE email = $1', [email], (error, results) => {
        if (error) {
            throw error
        }
        const resp = { status: results.rowCount === 0 ? "failed" : "success", response: results.rowCount === 0 ? "Unable to unsubscribe, Email doesn't exist or subrscribed to our newsletter" : "Successfully unsubscribed from our weekly newsletter" }
        response.status(200).send(resp)
    })
}

module.exports = {
    getEmails,
    postEmails,
    deleteEmail,
    retrieveEmails,
}