const express = require('express');
const router = express.Router();
const structjson = require('./structjson.js');
const dialogflow = require('dialogflow');
const uuid = require('uuid');

const config = require('../config/keys');
const { Opinion } = require('../models/Opinion.js');

const { Pizza } = require('../models/Pizza.js');

const {WebhookClient} = require('dialogflow-fulfillment');

router.post('/', (request, response) => {

    console.log('rentré');
    const _agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    function backend(agent) {
      agent.add(`Welcome to my agent from madaliou express!`);
    }
    
    let intents = new Map();
    intents.set('TestBackend', backend);
    _agent.handleRequest(intents);
});

module.exports = router;


