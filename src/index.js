const Ably = require('ably');

function Zapdroid(user, key) {
    this.auth = {
        key: key || false,
        user: user || false,
    }
    
    this.realtime = new Ably.Realtime(this.auth.key);
    //this.channel = this.realtime.channels.get('zappy:' + this.auth.user);
    this.channel = this.realtime.channels.get('zappy:sdkSkills');

    const publishOutboundMsg = async (user, msg, platformSpecificVars, callback = false, skill = 'generic_llm') => {
        this.channel.publish('outboundMsg', { user, msg, platformSpecificVars, replyHandler: false, skill: '' });
    };

    const publishOutboundMsg_v2 = async (user, msg, platformSpecificVars, tool, vendorSpecificVars) => {
        const submitData = async () => {
            const url = 'https://assistant.services.zapdroid.io/submit-output';
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
    
        await submitData();
    };

    this.createSkill = (skill, description, parameters, fn) => {
        console.log("create skill: ", { skill })
        const eventName = 'tool:' + skill
        const eventName2 = 'tool_v2:' + skill
    
        // broadcast skill addition
        this.channel.publish('skillAvailable', { name: skill, description, parameters, user: this.auth.user });
        //console.log("Skill registered!")
    
        this.channel.subscribe(eventName, async (message) => {
            await fn(message, async (replyMsg) => {
                const platformSpecificVars = message.data.platformSpecificVars;
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
    
        setInterval(() => {
            this.channel.publish('skillAvailable', { name: skill, description, parameters, user: this.auth.user  }, function (err) {
                if (err) {
                    console.log('Unable to publish message; err = ' + err.message);
                }
            });
        }, 30 * 1000); // Every 30 seconds
    }
}

module.exports = Zapdroid