import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

export const sendOtp = async (userEmail, verificationOtp) => {
    try{
        const info = await transporter.sendMail({
            from: `Bazarify <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: "Verify Your Email",
            text: verificationOtp,
        })
    }
    catch(error){
        console.log(error)
    }; 
}