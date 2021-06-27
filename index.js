const discord = require('discord.js');
const axios = require('axios');
const fs = require('fs');

const client = new discord.Client();

client.functions = require('./functions.js');

const events = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

for (const file of events) {
	const event = require(`./src/events/${file}`);
    event.execute(client);
};

client.editInteraction = async (client, interaction, response) => {
    const data = typeof response === 'object' ? { embeds: [ response ] } : { content: response };
    const channel = await client.channels.resolve(interaction.channel_id);
    return axios
        .patch(`https://discord.com/api/v8/webhooks/${client.user.id}/${interaction.token}/messages/@original`, data)
        .then((answer) => {
            return channel.messages.fetch(answer.data.id)
    });
};

client.login(`${process.env.TOKEN}`)
    .then(console.log(`Sesión iniciada como Sett#6999`))
    .catch(error => console.log(error));

//https://discord.com/oauth2/authorize?client_id=720401741643907173&permissions=8&scope=applications.commands%20bot
//https://discord.gg/za9ebApF
//racasi2816@to200.com