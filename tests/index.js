//dotenv
//require('dotenv').config()
//const { createSkill } = require("../src/index")

let ZAPDROID_TEAM_ID='T9ZNY708H-caa0b708ddf77f6c6f15d7eff0dc3312'
let ZAPDROID_SECRET_KEY='yTu-6A.pB3yrg:Pdw4o2dK7xiQE7OdyOlSLrByBZa0mV6ti7esR1Nnqu4'

const ZapdroidSDK = require("../src/index")

let zappy = new ZapdroidSDK()
zappy.setAuth(ZAPDROID_TEAM_ID, ZAPDROID_SECRET_KEY)

let functionName = 'random_number_generator'
const description = 'This tool is used to generate random number'
let parameters = {
    type: "object",
    properties: {
        min: {
            type: "integer",
            description: "Min number to generate",
        },
        max: {
            type: "integer",
            description: "Max number to generate",
        },
    },
    required: ["min", "max"],
};

zappy.createSkill(functionName, description, parameters, async (message, reply) => {
    console.log('random_number_generator skill called')
    const { min, max } = message.data.args;

    // generate a random number between min and max
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    await reply(`Your random number is ${randomNumber}`)
})