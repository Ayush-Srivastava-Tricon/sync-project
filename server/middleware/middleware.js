const jwt = require("jsonwebtoken");
const jwttoken = require("../server.js");

function validateToken(req, res, next) {
    const bearer = req.headers['authorization'];
    if (bearer) {
        const token = bearer.split(" ")[1];
        req.token = token;
        try {
            let decoded = jwt.verify(token, jwttoken.adminsecretkey || jwttoken.usersecretkey);
            next();   //callback
        } catch (err) {
            if (err.message.includes("invalid")) {
                res.status(401).send({ message: "Invalid Token", status: 401 });
            } else {
                res.status(500).send({ message: "Token Expired", status: 500 });
            }
        }
    } else {
        res.status(401).send({ message: "Authorization Token required", status: 401 });
    }
}

function validateAdminToken(req, res, next) {
    const bearer = req.headers['authorization'];
    if (bearer) {
        const token = bearer.split(" ")[1];
        req.token = token;
        try {
            let decoded = jwt.verify(token, jwttoken.adminsecretkey);
            next();   //callback
        } catch (err) {
            if (err.message.includes("invalid")) {
                res.status(401).send({ message: "Invalid Token", status: 401 });
            } else {
                res.status(500).send({ message: "Token Expired", status: 500 });
            }
        }
    } else {
        res.status(401).send({ message: "Authorization Token required", status: 401 });
    }
}

function validateBingTripToken(req, res, next) {
    const bearer = req.headers['authorization'];
    if (bearer) {
        const token = bearer.split(" ")[1];
        req.token = token;
        try {
            let decoded = jwt.verify(token, jwttoken.bingtripToken);
            next();   //callback
        } catch (err) {
            if (err.message.includes("invalid")) {
                res.status(401).send({ message: "Invalid Token", status: 401 });
            } else {
                res.status(500).send({ message: "Token Expired", status: 500 });
            }
        }
    } else {
        res.status(401).send({ message: "Authorization Token required", status: 401 });
    }
}

module.exports = {validateToken,validateAdminToken,validateBingTripToken};
