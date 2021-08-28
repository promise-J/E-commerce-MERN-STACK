const nodemailer = require('nodemailer');

const sendMail = (options)=> {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // sender address
        to: options.to, // list of receivers
        subject: options.subject, // Subject line
        html: options.message// plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
            console.log(err)
        else
            console.log(info);
    })
}



module.exports = sendMail