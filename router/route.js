const express = require("express")
const path = require("path");
const dotenv = require("dotenv")
const Stripe = require("stripe");
const router = express.Router();
router.get('/successcheckout', async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../successcheckout.html');
        res.sendFile(filePath);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send("Internal Server Error");
    }
})
router.get('/declinecheckout', async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../declinecheckout.html');
        res.sendFile(filePath);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/buyNow', async (req, res) => {
    console.log(req.body)
    const secret = "sk_test_51P3dSwA4AswEsCKbATZyUeJMovoQ7r9ofQrOXyxl6kSTA6aB29SPF8VKCn9dk7SHH8ZV1KTJfnL7tgdPgkRKBYXM00uVwwZTBg";
    const data = await req.body;
    const items = data.items.map((value, index) => {
        return {
            price_data: {
                currency: "pkr",
                product_data: {
                    name: value.title,
                },
                unit_amount: value.price * 100
            },
            quantity: value.quantity
        }
    })
    //@ts-ignore
    const stripe = new Stripe(secret);
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: items,
            currency: "pkr",
            mode: 'payment',
            success_url: `${process.env.ipaddress}/successcheckout`,
            cancel_url: `${process.env.ipaddress}/declinecheckout`,
            billing_address_collection: "required",
        });
        console.log(session)
        const returnObj = {
            'status': 'accepted',
            'Link': session.url
        }
        console.log("URL is: ", session.url);
        res.send(returnObj)

    } catch (err) {
        // console.log("Error is: ",err);
        const returnObj = {
            'status': 'decline',
            'error': err
        }
        res.send(returnObj)
    }
    finally {

    }

})

module.exports = router

