const express = require("express")
const contactModel = require("../models/contactModel")
const { Resend } = require("resend")
const router = express.Router()
const resend = new Resend(process.env.RESEND_API_KEY)

router.post("/", async (req, res) => {
    try {
        console.log("CONTACT ROUTE HIT");

        const { name, email, message } = req.body

        const newContact = await contactModel.create({
            name,
            email,
            message
        })

        console.log("Contact saved to MongoDB")

        const { data, error } = await resend.emails.send({
            from: "Portfolio <onboarding@resend.dev>",
            to: ["crimefile67@gmail.com"],
            subject: `New portfolio message from ${name}`,
            html:`
                <div style="margin: 0; padding: 40px 20px; background-color: #f4f7fa; font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #1f2937;">
                    <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);" >
                        <div style="background-color: #050f1a; padding: 28px 32px;">
                            <div style="font-size: 26px; font-weight: 700; color: #ffffff; letter-spacing: 1px;">
                                ADE<span style="color: #4cc9f0;">.</span>
                            </div>
                            <p style="margin: 8px 0 0; color: #94a3b8; font-size: 14px;">New message from your portfolio</p>
                        </div>
                        <div style="padding: 32px;">
                            <h2 style="margin: 0 0 24px; font-size: 22px; color: #111827;">You have a new message 👋</h2>
                            <div style="background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                                <div style="margin-bottom: 14px;>
                                    <p style="margin: 0 0 4px; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Name</p>
                                    <p style="margin: 0; font-size: 16px; font-weight: 600; color: #111827;">${name}</p>
                                </div>
                                <div>
                                    <p style="margin: 0 0 4px; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                                    <p style="margin: 0; font-size: 16px; color: #4cc9f0;">${email}</p>
                                </div>
                            </div>
                            <div>
                                <p style="margin: 0 0 10px; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                                <div style="background-color: #f8fafc; border-left: 4px solid #4cc9f0; padding: 18px 20px; border-radius: 0 10px 10px 0;">
                                    <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #374151; white-space: pre-line;">${message}</p>
                                </div>
                            </div>
                            <div style="text-align: center; margin-top: 30px;">
                                <a href="mailto:${email}" style="display: inline-block; background-color: #4cc9f0; color: #050f1a; text-decoration: none; font-size: 14px; font-weight: 700; padding: 13px 24px; border-radius: 8px;">Reply to ${name}</a>
                            </div>
                        </div>
                        <div style="background-color: #f8fafc; border-top: 1px solid #e5e7eb; padding: 20px 32px; text-align: center;">
                            <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.6;">This message was sent through your portfolio contact form
                                <br />
                                © ${new Date().getFullYear()} Ade. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            `
        })

        console.log("Resend response:", { data, error })

        if (error) {
            console.log("Resend error:", error)
            return res.status(400).json({
                success: false,
                message: "Message was saved, but email notification failed.",
                data: newContact
            })

        }

        res.status(201).json({
            success: true,
            message: "Contact message received successfully",
            data: newContact,
            emailId: data.id
        })

    } catch (error) {
        console.error("contactError:", error.message)
        res.status(404).json({
            success: false,
            message: error.message
        })
    }

})

module.exports = router