const { MessageEmbed } = require('discord.js');
module.exports = {
    ws: true,
    async execute (client) {
        client.errorMsg = () => {
            let embed = new MessageEmbed()
                .setDescription('❌ An internal error has ocurred during the execution of the command.')
                .setColor('RED');
            return embed
        }
        client.ws.on('INTERACTION_CREATE', async interaction => {
            const command = interaction.data.name.toLowerCase().replace('test_','');
            const args = interaction.data.options;
            if (!interaction.guild_id) {
                try {
                    client.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 5
                        },
                    });
                    await client.editInteraction (client, interaction, new MessageEmbed()
                            .setDescription('❌ Commands are disabled on DM. If you need help, message me and the bot dev will add you to his friend list as soon as he read your message.')
                            .setColor('RED')
                    );
                } catch (err) {
                    console.error(err)
                    client.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 5
                        },
                    });
                    await client.editInteraction(client, interaction, client.errorMsg)
                };
            } else {
                try {
                    client.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 5
                        },
                    });
                    await client.editInteraction (client, interaction, await require(`../cmdfiles/${command}`).msg(args, interaction, client) || require(`../cmdfiles/${command}`).msg_music)
                } catch (err) {
                    console.error(err)
                    client.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 5
                        },
                    });
                    await client.editInteraction(client, interaction, client.errorMsg)
                };
            };
        });
    },
};