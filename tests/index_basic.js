const Zapdroid = require("../src/index")

let ZAPDROID_USER='4408a428-f081-704d-7810-a3c37e038cc0'
let ZAPDROID_SECRET_KEY='yTu-6A.1F2-vw:--bgpSakZ1k848ygL3OXnfMsN0XBY8Oz35Lp7yobxvg'

// Initialize Zapdroid with authentication
let zappy = new Zapdroid(ZAPDROID_USER, ZAPDROID_SECRET_KEY)
//console.log({zappy})

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