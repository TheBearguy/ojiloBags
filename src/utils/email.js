import nodemailer from "nodemailer"

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: smtp.gmail.com,
        port: 587,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    await transporter.sendMail(mailOptions)
}

export default sendEmail