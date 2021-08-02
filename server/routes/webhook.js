const express = require('express');
const router = express.Router();
const structjson = require('./structjson.js');
const dialogflow = require('dialogflow');
const axios = require("axios");
const uuid = require('uuid');

const {WebhookClient} = require('dialogflow-fulfillment');

const bankAPI = "https://bank70.herokuapp.com/api";


router.post('/', (request, response) => {

    //console.log('enter');
    const _agent = new WebhookClient({ request, response });
  /*   console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));

    console.log('Dialogflow Request body: ' + JSON.stringify(request.body)); */

    function backend(agent) {
      agent.add(`Test du 23-07-2021, Welcome to my agent from madaliou express!`);
    }

    function chatbank(agent) {
      agent.add(`Bienvenue je suis le chatbankBot depuis la Banque A!`);
    }

    const create_account = async ( agent) => {
        
        
        //const {receiver_account_number, sender_account_number, amount, ext_bank_name} = request.body.queryResult.parameters;
        const {firstname, lastname, type, phone, birthdate, birth_place, email, password} = request.body.queryResult.parameters;
        
        await axios.post(`${bankAPI}/register`, {firstname, lastname, type, phone, birthdate, birth_place, email, password, sold:0})
              .then(resp => {

                agent.add(`Account created successfully, Your account number is ${resp.data.account.account_number}`);
                  
                //agent.add(`Account created successfully`);
              })
              .catch(err => {
                  console.log('pas cool : ', err);
                  
                  agent.add( err.response.data.message ? `${err.response.data.message}` : 'An error occured!!');
              });
       
      }

    const transfert = async ( agent) => {
      //console.log('request.body.queryResult.parameters', request.body.queryResult.parameters);
      //const {receiver_account_number, sender_account_number, amount, ext_bank_name} = request.body.queryResult.parameters;
      const receiver_account_number = request.body.queryResult.parameters.toAccount;
      const sender_account_number = request.body.queryResult.parameters.fromAccount;
      const amount = request.body.queryResult.parameters.amount;
      const ext_bank_name = request.body.queryResult.parameters.bankName;    
      const email = request.body.queryResult.parameters.email;    
      const password = request.body.queryResult.parameters.password;    


      await axios.post(`${bankAPI}/account/externTransfert`, {receiver_account_number, sender_account_number, amount, ext_bank_name, email, password})
            .then(resp => {
                console.log('cool : ', resp.data);
                agent.add('The Transfert is done successfully');
            })
            .catch(err => {
                console.log('pas cool : ', err.response);
                
                agent.add( err.response.data.message ? `${err.response.data.message}` : 'An error occured!!');
            });
     
    }

    const balance = async ( agent) => {
      console.log('request.body.queryResult.parameters', request.body.queryResult.parameters);
      //const {receiver_account_number, sender_account_number, amount, ext_bank_name} = request.body.queryResult.parameters;
      const {account_number, email, password} = request.body.queryResult.parameters;
      
      await axios.post(`${bankAPI}/account/sold`, {account_number, email, password})
            .then(resp => {
                console.log('cool : ', resp.data);
                /* if (resp.status === 200) {
                    result.data = resp.data;
                } */
                agent.add(`Your account balance is ${resp.data.sold}`);
            })
            .catch(err => {
                console.log('pas cool : ', err);
                
                agent.add( err.response.data.message ? `${err.response.data.message}` : 'An error occured!!');
            });
     
    }

    const credit_account = async ( agent) => {
       
        //const {receiver_account_number, sender_account_number, amount, ext_bank_name} = request.body.queryResult.parameters;
        const {account_number, amount} = request.body.queryResult.parameters;
        
          
  
        await axios.post(`${bankAPI}/account/credit`, {account_number, amount})
              .then(resp => {
                  console.log('cool : ', resp.data);
                  /* if (resp.status === 200) {
                      result.data = resp.data;
                  } */
                  agent.add(`The credit is done successfully!!`);
              })
              .catch(err => {
                  console.log('pas cool : ', err.response);

                  agent.add( err.response.data.message ? `${err.response.data.message}` : 'An error occured!!');
                  
              });
       
      }
      
    
    let intents = new Map();
    intents.set('TestBackend', backend);
    intents.set('chatbank', chatbank);
    intents.set('transfert', transfert);
    intents.set('get-my-solde', balance);
    intents.set('credit-account', credit_account);   
    intents.set('create-account', create_account);    
 

    _agent.handleRequest(intents);
});

module.exports = router;


