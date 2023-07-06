
const express = require("express");
const cors = require('cors');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser')

const port = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({ info: 'MahaShipping Home' })
})

const db = require('./queries');
const config = require('./newsletterConfig')
app.get('/emails', db.getEmails)
app.post('/addEmail', db.postEmails)
app.delete('/emails/:email', db.deleteEmail)

cron.schedule('* * * * *', async function () { // change your corn expression accordingly to send email at your requirements
    const recipients = await db.retrieveEmails();
    console.log(recipients)
    let mailOptions = {
        from: 'prasathvicky79@gmail.com',
        to: recipients,
        subject: 'Email from Node-App: A Test Message!',
        text: 'Some content to send',
    };

    let transporter = nodemailer.createTransport(config.emailAuthConfig)

    console.log('Running Cron Process');
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
        else console.log('Email sent: ' + info.response);
    });
});