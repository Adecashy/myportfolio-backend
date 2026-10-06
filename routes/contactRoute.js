const express = require("express")
const contactModel = require("../models/contactModel")
const router = express.Router()

router.post("/", async (req, res) => {
    try {
        const { name, email, message } = req.body
        const newContact = await contactModel.create({
            name,
            email,
            message
        })
        res.status(201).json({
            success: true,
            message: "Contact message received successfully",
            data: newContact
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