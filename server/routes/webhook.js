const express = require('express');
const router = express.Router();
const structjson = require('./structjson.js');
const dialogflow = require('dialogflow');
const axios = require("axios");
const uuid = require('uuid');

//const config = require('../config/keys');
const { Opinion } = require('../models/Opinion.js');

const { Pizza } = require('../models/Pizza.js');

const {WebhookClient} = require('dialogflow-fulfillment');

const bankAPI = "https://bb4027aacbf3.ngrok.io/api";


router.post('/', (request, response) => {

    console.log('enter');
    const _agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));

    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    function backend(agent) {
      agent.add(`Test du 23-07-2021, Welcome to my agent from madaliou express!`);
    }

    function chatbank(agent) {
      agent.add(`Bienvenue je suis le chatbankBot depuis la Banque A!`);
    }

    const transfert = async ( agent) => {
      console.log('request.body.queryResult.parameters', request.body.queryResult.parameters);
      //const {receiver_account_number, sender_account_number, amount, ext_bank_name} = request.body.queryResult.parameters;
      const receiver_account_number = request.body.queryResult.parameters.toAccount;
      const sender_account_number = request.body.queryResult.parameters.fromAccount;
      const amount = request.body.queryResult.parameters.amount;
      const ext_bank_name = request.body.queryResult.parameters.bankName;    

      await axios.post(`${bankAPI}/account/externTransfert`, {receiver_account_number, sender_account_number, amount, ext_bank_name})
            .then(resp => {
                console.log('cool : ', resp.data);
                /* if (resp.status === 200) {
                    result.data = resp.data;
                } */
                agent.add('Transfert Done');
            })
            .catch(err => {
                console.log('pas cool : ', err);
                
                agent.add('Error');
            });
     
    }

    const balance = async ( agent) => {
      console.log('request.body.queryResult.parameters', request.body.queryResult.parameters);
      //const {receiver_account_number, sender_account_number, amount, ext_bank_name} = request.body.queryResult.parameters;
      const receiver_account_number = request.body.queryResult.parameters.balance;
        

      await axios.post(`${bankAPI}/account/sold`, {receiver_account_number, sender_account_number, amount, ext_bank_name})
            .then(resp => {
                console.log('cool : ', resp.data);
                /* if (resp.status === 200) {
                    result.data = resp.data;
                } */
                agent.add('Transfert Done');
            })
            .catch(err => {
                console.log('pas cool : ', err);
                
                agent.add('Error');
            });
     
    }
    
    let intents = new Map();
    intents.set('TestBackend', backend);
    intents.set('chatbank', chatbank);
    intents.set('transfert', transfert);

    _agent.handleRequest(intents);
});

module.exports = router;


