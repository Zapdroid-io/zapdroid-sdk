const Ably = require('ably');

// check if the environment variables are available
if (!process.env.ZAPDROID_SECRET_KEY) {
    console.error('Environment variable ZAPDROID_SECRET_KEY is not available');
    process.exit(1);
}

if (!process.env.ZAPDROID_TEAM_ID) {
    console.error('Environment variable ZAPDROID_TEAM_ID is not available');
    process.exit(1);
}

const realtime = new Ably.Realtime(process.env.ZAPDROID_SECRET_KEY);
const channel = realtime.channels.get('zappy-' + process.env.ZAPDROID_TEAM_ID);

const publishOutboundMsg = async (user, msg, platformSpecificVars, callback = false, skill = 'generic_llm') => {

    //let zapdroidTeamId = process.env.ZAPDROID_TEAM_ID;
    channel.publish('outboundMsg', { user, msg, platformSpecificVars, replyHandler: false, skill: '' });
};
const publishOutboundMsg_v2 = async (user, msg, platformSpecificVars, tool, vendorSpecificVars) => {
    const submitData = async () => {
        const url = 'https://assistant.services.zapdroid.io/submit-output'; // Replace with your actual endpoint URL
        const data = {
            tool_call_id: tool.id,
            output: msg,
            threadId: vendorSpecificVars.threadId,
            runId: vendorSpecificVars.runId
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log('Success:', response.statusText);
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    await submitData(); // Call the function to send the request

};


// create a class with auth as json member
function Zapdroid() {
    this.auth = {
        key: process.env.ZAPDROID_SECRET_KEY || false,
        teamId: process.env.ZAPDROID_TEAM_ID || false,
    }

    const setAuth = (teamId, key) => {
        this.auth.key = key;
        this.auth.teamId = teamId;
    }

    const createSkill = (skill, description, parameters, fn) => {
        console.log("create skill: ", { skill })
        const eventName = 'tool:' + skill
        const eventName2 = 'tool_v2:' + skill
    
        // broadcast skill addition
        channel.publish('skillAvailable', { name: skill, description, parameters });
        console.log("Skill registered!")
    
        channel.subscribe(eventName, async (message) => {
            await fn(message, async (replyMsg) => {
                const platformSpecificVars = message.data.platformSpecificVars;
                //tool, vendorSpecificVars
                const user = message.data.user;
                if (typeof message.data.version != 'undefined') {
                    if (message.data.version == 2) {
                        const tool = message.data.tool;
                        const vendorSpecificVars = message.data.vendorSpecificVars;
    
                        await publishOutboundMsg_v2(user, replyMsg, platformSpecificVars, tool, vendorSpecificVars)
                    }
                } else {
                    await publishOutboundMsg(user, replyMsg, platformSpecificVars)
    
                }
            })
        })
    
        //let interval = NODE_ENV === 'production' ? 60 : 10;
    
        setInterval(function () {
    
            //console.log("publishing event...")
            channel.publish('skillAvailable', { name: skill, description, parameters }, function (err) {
                if (err) {
                    console.log('Unable to publish message; err = ' + err.message);
                } else {
                    //console.log('Message successfully published');
                }
            });
        }, 30 * 1000); // Every 60 seconds
    }
}





module.exports = Zapdroid