const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'joanna.gabis@gmail.com',
        subject: 'Welcome email',
        text: `Welcome to the app, ${name}! Let me know how you like it.`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'joanna.gabis@gmail.com',
        subject: 'Bye bye',
        text: `See you soon, ${name}! Please come back...`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}

