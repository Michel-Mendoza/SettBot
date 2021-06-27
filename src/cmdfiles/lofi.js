const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');

module.exports = {
    name: 'lofi',
    msg_music: new MessageEmbed()
        .setDescription(`✅ Playing LoFi`)
        .setColor('GREEN'),
    description: 'Reproduce LoFi en tu canal de voz.',
    options: [], msg: async (args, interaction, client) => {
        const guild = client.guilds.cache.get(interaction.guild_id)
        const member = guild.members.cache.get(interaction.member.user.id);
        let vc = member.voice.channel;

        const bot = guild.members.cache.get('720401741643907173');
        let vc_bot = bot.voice.channel;

        if (vc_bot && vc && vc_bot!==vc) {
            const embed = new MessageEmbed()
                .setDescription('❌ You must be connected to the same voice channel as the bot to execute this command')
                .setColor('RED');
            return embed;
        };

        if (!vc) return new MessageEmbed()
            .setDescription('❌ You must be connected to a voice channel to execute this command.')
            .setColor('RED');
        const perms = vc.permissionsFor('720401741643907173');
        if (!perms.has('CONNECT') || !perms.has('SPEAK')) return new MessageEmbed()
            .setDescription("❌ I don't have enough permissions to connect or talk in that voice channel.")
            .setColor('RED');
        try {
            await vc.join().then(async connection => {
                connection.play(ytdl('https://www.youtube.com/watch?v=5qap5aO4i9A', {filter:'audioonly', liveBuffer:'50000'}));
            });

        } catch (error) {
            console.log(error);
            return client.errorMsg()
        }
    }
}