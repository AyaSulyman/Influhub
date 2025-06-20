const express = require('express');
const Message = require('../data/data');
const router = express.Router();


router.post('/message', (req, res) => {
    console.log(req.body);

    const message = new Message(req.body);
    message.save()
        .then((message) => res.status(200).send(message))
        .catch((error) => res.status(400).send(error));
});


router.get('/message', (req, res) => {
    Message.find({})
        .then((messages) => res.status(200).send(messages))
        .catch((error) => res.status(400).send(error));
});

module.exports = router;
