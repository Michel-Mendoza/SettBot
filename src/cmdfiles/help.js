const Discord = require('discord.js')
module.exports = {
    name: "help",
    description: "Muestra una lista de comandos.",
    options: [], msg: async (args, interaction, client) => {
        const embed = new Discord.MessageEmbed()
            .setTitle('Sett Bot -  Add me to your server!')
            .setURL('https://discord.com/oauth2/authorize?client_id=720401741643907173&permissions=8&scope=applications.commands%20bot')
            .setThumbnail(`https://cdn.discordapp.com/app-icons/720401741643907173/80599f2f72f9b6249af32a7113a85913.png`)
            .setDescription(`We use slash commands for all our functions. Old "s." prefix is disabled.\nIf you need help, DM me and the bot dev will add you to his friend list to help you as soon he reads your message.`)
            .addField('/profile [Region] [Summoner Name]', 'Shows a list of champion mastery, ranked winrate and more details of a LoL profile.\nExample usage: /profile EUW MendozaX')
            .addField('❌ (Disabled command) - /verify [Region] [Summoner Name]', 'Links your LoL user and region to your Discord profile. With this, you can use some new commands.\nExample usage: /verify EUW MendozaX')
            .addField('❌ (Disabled command) - /history [Region] [Summoner Name] (Page)', `Shows your LoL match history, 5 games per page.\nExample usage: /history EUW MendozaX 3`)
            .addField('❌ (Disabled command) - /champion [Champion Name]', `Shows the lore, passive and abilities of an specified champion. \nExample usage: /champion Sett`)
            .addField('❌ (Disabled command) - /mastery [Region] [Summoner Name] [Champion Name]', 'Shows mastery points, last games and champion winrate for a player on a specified champion. \nExample usage: /mastery EUW MendozaX Swain')
            .addField('🛠️ (Work In Progress) - /multisearch', 'More info will be provided on the next few days.')
            .addField('/lofi', 'Plays LoFi in your current voice channel.')
            .setFooter(`Requested by ${interaction.member.user.username}`,`https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
            .setTimestamp();
        return embed
    }
};