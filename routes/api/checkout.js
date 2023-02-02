var router = require('express').Router();
var mongoose = require('mongoose');
var axios = require('axios');
const express = require('express');
const app = express();
const { appendFile } = require('fs');
var crypto = require('crypto-js');
var SHA256 = require("crypto-js/sha256");
const { response } = require('express');
var qs = require('qs');
require('dotenv').config();

const { REACT_APP_URL, REACT_APP_PEI_TESTMODE, REACT_APP_PEI_CLIENTID, REACT_APP_PEI_SECRET, REACT_APP_PEI_MERCHANTID, APP_API_URL } = {...process.env };
const peiOrderUrl = REACT_APP_PEI_TESTMODE === "1" ? 'https://externalapistaging.pei.is/api/orders' : 'https://api.pei.is/api/orders';
router.post("/insertCart", function(req, res, next) {
    axios.post('https://test.netgiro.is/api/Checkout/InsertCart', req.body).then((data) => {
        res.json(data);
    }).catch(next);
})

router.get("/payment", function(req, res, next) {
    console.log(req);
})

//get payment response from saltpay
router.get("/get_saltpay_hash", function(req, res, next) {
    console.log(req.query);
    const { returnurlsuccess, secret_key, merchant_id, amount, order_id } = {...req.query };
    const message = `${merchant_id}|${returnurlsuccess}|${returnurlsuccess}|${order_id}|${amount}|ISK`;
    console.log(message);
    const checkhash_data = crypto.HmacSHA256(message, secret_key);
    const checkhash = crypto.enc.Hex.stringify(checkhash_data);
    console.log(checkhash);
    return res.json({ checkhash: checkhash })
})
router.get("/get_netgiro_hash", function(req, res, next) {
    console.log(req.query);
    const { secret_key, order_id, total, application_id } = {...req.query };
    const message = `${secret_key}${order_id}${total}${application_id}`;
    console.log(message);
    const checkhash_data = SHA256(message);
    const Signature = crypto.enc.Hex.stringify(checkhash_data);
    console.log(Signature);
    return res.json({ Signature: Signature })
})

router.get("/saltpaySuccess", function(req, res, next) {
    const response = req.query;
    console.log(response);
    const params = new URLSearchParams({...response, payment_type: "SaltPay" });
    return res.redirect(`${REACT_APP_URL}/checkout?${params.toString()}`);
})

router.get("/netigroSuccess", function(req, res, next) {
    const response = req.query;
    console.log(response);
    response.status = response.invoiceNumber !== "-" ? "OK" : "CANCEL";
    const params = new URLSearchParams({...response, payment_type: "Netgiro" });
    return res.redirect(`${REACT_APP_URL}/checkout?${params.toString()}`);
})

async function getPeiToken() {
    // Create the payload, the payload consists of the username and secret that the vendor sets
    const authPayload = Buffer.from(`${REACT_APP_PEI_CLIENTID}:${REACT_APP_PEI_SECRET}`).toString('base64');
    var data = qs.stringify({
        'grant_type': 'client_credentials',
        'scope': 'externalapi'
    });
    var config = {
        method: 'post',
        url: REACT_APP_PEI_TESTMODE === "1" ? 'https://authstaging.pei.is/core/connect/token' : 'https://auth.pei.is/core/connect/token',
        headers: {
            'Authorization': `Basic ${authPayload}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };
    try {
        const response = await axios(config);
        console.log(response);
        if (response.status === 200) {
            const { token_type, access_token } = {...response.data };
            return `${token_type} ${access_token}`;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

router.post("/get_pei_order", async(req, res, next) => {
    const data = req.body.params;
    const peiToken = await getPeiToken();
    console.log(peiToken);
    const result = { data: false };
    if (peiToken !== false) {
        const peiResponseUrl = `${APP_API_URL}/checkout/getPeiResponse?order_id=${data.reference}`;
        const requestData = JSON.stringify({
            ...data,
            merchantId: REACT_APP_PEI_MERCHANTID,
            successReturnUrl: peiResponseUrl,
            cancelReturnUrl: APP_API_URL + "/checkout/peiCancelled",
            postbackUrl: peiResponseUrl,
        });
        const config = {
            method: 'post',
            url: peiOrderUrl,
            headers: {
                'Authorization': peiToken,
                'Content-Type': 'application/json'
            },
            data: requestData
        };
        try {
            const response = await axios(config);
            if (response.status === 200) {
                result.data = (REACT_APP_PEI_TESTMODE === "1" ? 'https://gattinstaging.pei.is/' : 'https://gattin.pei.is/') + response.data.orderId
            }
        } catch (error) {
            console.log(error);
        }
    }
    return res.json(result);
})

router.get("/peiCancelled", function(req, res, next) { //Pei cancelled
    const params = new URLSearchParams({ payment_type: "Pei", status: "CANCEL" });
    return res.redirect(`${REACT_APP_URL}/checkout?${params.toString()}`);
})

router.get("/getPeiResponse", function(req, res, next) { //Pei cancelled
    const params = new URLSearchParams({ payment_type: "Pei", status: "OK", orderid: req.query.order_id });
    return res.redirect(`${REACT_APP_URL}/checkout?${params.toString()}`);
})
module.exports = router;