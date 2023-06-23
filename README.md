## Zapdroid SDK
A robust Node.js package that allows easy integration of [Zapdroid](https://www.zapdroid.io/) AI chatbot functionalities into your system. Zapdroid SDK allows you to interface any business operation securely and privately with Zapdroid's natural language interface.


## Requirements
You should already have Zapdroid installed on your slack workspace or any other supported platform.
Make sure to have following environment variables:
```
ZAPDROID_TEAM_ID=TXXXXX-YYYYYYYYYY
ZAPDROID_SECRET_KEY=ZZZZZZZZZ
```

You can get these by asking Zapdroid on your slack. In a secure channel ask 'what are my SDK credentials?'


## Installation
Use the package manager [npm](https://www.npmjs.com/) to install Zapdroid SDK.
```bash
npm install zapdroid-sdk
```

## Usage

To create your custom function that can be triggered by Zapdroid chatbot, you need to define:
1. Function / skill name
2. Function description
3. Arguments it expects

A random number generator is shown below:

```javascript
const { createSkill } = require('zapdroid-sdk');

// define required parameters
let functionName = 'random_number_generator'
let description = 'This tool is used to generate random number'
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

// Use Zapdroid SDK to plug it in with main LLM engiine
createSkill(functionName, description, parameters, async (message, reply) => {
    console.log('random_number_generator skill called')
    const { min, max } = message.data.args;

    // generate a random number between min and max
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    await reply(`Your random number is ${randomNumber}`)
})
```

Wait for a few seconds, and then message Zapdroid on your slack:
```
@Zapdroid generate a random number between 3-10
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please make sure to update tests as appropriate.


## License
[MIT](https://choosealicense.com/licenses/mit/)