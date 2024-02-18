// MAKE SURE ENVIRONMENT VARIABLES ARE AVAILABLE before you require sdk 
//require('dotenv').config()
const { createSkill } = require('./src/index.js');
//import { createSkill } from './index.js';

// define required parameters
let functionName = 'generateVideo'
let description = 'Generates video from a subject'
let parameters = {
    "type": "object",
    "properties": {
      "subject": {
        "type": "string",
        "description": "Subject of the video"
      }
    },
    "required": [
      "subject"
    ]
};

// Use Zapdroid SDK to plug it in with main LLM engiine
createSkill(functionName, description, parameters, async (message, reply) => {
    console.log('generateVideo skill called')
    //const { min, max } = message.data.args;
    console.log(message.data)

    await reply(`Your video ID is 12345`)

})