const nodemailer = require("nodemailer");
// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (options) => {
    // console.log(options)
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
//    // create reusable transporter object using the default SMTP
    //console.log(options)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMPTP_PORT,
        secure: false,
        //tls:true,
//
        // true for 465, false for other ports
        auth: {
            user: '11486ea6222a85', // generated ethereal user
            pass: '9d705d7b2c0331', // generated ethereal password
        },
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `${process.env.FROM_NAME}`, // sender address
        to: options.to, // list of receivers
        subject: options.subject, // Subject line
        text: options.text // plain text body
        // html: , // html body
    });
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
module.exports = sendEmail;