const postgresConfig = {
    user: 'postgres', // username for the database
    host: 'localhost',
    database: 'dummy',
    password: '1234',
    port: 1234, // postgres port number
}

const emailAuthConfig = {
    service: "gmail", //mail service provider name
    auth: {
        user: 'sample@gmail.com',
        pass: '123', //app specific authentication password from your mail provider
    },
    tls: {
        rejectUnauthorized: false,
    },
}

module.exports = {
    emailAuthConfig,
    postgresConfig
}



