const Ably = require('ably');
//const { readGoogleSheet } = require('./lib');
const realtime = new Ably.Realtime(process.env.ZAPDROID_SECRET_KEY);
const channel = realtime.channels.get('zappy-' + process.env.ZAPDROID_TEAM_ID);



const publishOutboundMsg = async (user, msg, platformSpecificVars, callback = false, skill = 'generic_llm') => {

    //let zapdroidTeamId = process.env.ZAPDROID_TEAM_ID;
    channel.publish('outboundMsg', { user, msg, platformSpecificVars, replyHandler: false, skill: '' });
};

const createSkill = (skill, description, parameters, fn) => {
    console.log("create skill: ", { skill })
    const eventName = 'tool:' + skill

    // broadcast skill addition
    channel.publish('skillAvailable', { name: skill, description, parameters });
    console.log("Skill registered!")

    channel.subscribe(eventName, async (message) => {
        await fn(message, async (replyMsg) => {
            const platformSpecificVars = message.data.platformSpecificVars;
            const user = message.data.user;
            await publishOutboundMsg(user, replyMsg, platformSpecificVars)
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


module.exports = { createSkill }