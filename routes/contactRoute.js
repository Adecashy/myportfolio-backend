const express = require("express")
const contactModel = require("../models/contactModel")
const { Resend } = require("resend")
const router = express.Router()
const resend = new Resend(process.env.RESEND_API_KEY)

router.post("/", async (req, res) => {
    try {
        const { name, email, message } = req.body

        const newContact = await contactModel.create({
            name,
            email,
            message
        })

        const { data, error } = await resend.emails.send({
            from: "Portfolio <onboarding@resend.dev",
            to: ["immaemmanuell@gmail.com"],
            subject: `New portfolio message from ${name}`,
            html:`
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2>New Portfolio Contact Message</h2>
                    <p>
                        <strong>Name:</strong> ${name}
                    </p>
                    <p>
                        <strong>Email:</strong> ${email}
                    </p>
                    <p>
                        <strong>Message:</strong>
                    </p>
                    <p> ${message}</p>
                    <hr />
                    <p style="color: #777; font-size: 14px;">
                        This message was sent through your portfolio contact form.
                    </p>
                </div>
            `
        })

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