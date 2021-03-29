const Discord = require('discord.js');
const MeowDB = require('meowdb');
const eco = new MeowDB({
    dir: __dirname,
    name: "database"
})

module.exports = {
    name: 'puntos',
    description: 'Comando para ver tus puntos.',
    async execute(message) {        
        let mencionado = message.mentions.members.first();
        if(!mencionado) {
        eco.create(`${message.guild.id}.${message.author.id}`, {
            money: 500,
            bank: 0,
            time: 0
        });            
        let user = eco.get(`${message.guild.id}.${message.author.id}`)
        const balance = new Discord.MessageEmbed()
        .setAuthor('Tu balance de puntos', message.author.avatarURL())
        .setDescription('Ahora mismo tienes:')
        .addFields(
            { name: 'Puntos actuales:', value: user.money, inline: true},
            { name: 'Puntos en el banco:', value: user.bank, inline: true },
        )
        .setTimestamp()
        message.channel.send(balance)
        } else {
        eco.create(`${message.guild.id}.${mencionado.id}`, {
            money: 500,
            bank: 0,
            time: 0
        });
        let user = eco.get(`${message.guild.id}.${mencionado.id}`)
        let avatar = `https://cdn.discordapp.com/avatars/${mencionado.id}/${mencionado.user.avatar}`
        const balance = new Discord.MessageEmbed()
        .setTitle(`Este es el balance de ${mencionado.nickname}`, avatar)
        .setDescription(`${mencionado.nickname} tiene ahora mismo:`)
        .addFields(
            { name: 'Puntos actuales:', value: user.money, inline: true},
            { name: 'Puntos en el banco:', value: user.bank, inline: true },
        )
        .setTimestamp()
        message.channel.send(balance)
        }
        
    }
}