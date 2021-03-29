const MeowDB = require('meowdb');
const eco = new MeowDB({
    dir: "../data",
    name: "database"
})

module.exports = {
    name: 'puntos',
    description: 'Comando para ver tus puntos.',
    async execute(message) {
        eco.create(`${message.guild.id}.${message.author.id}`, {
            money: 0,
            bank: 0,
            time: 0
        });
        
        let mencionado = message.mentions.members.first();
        if(!mencionado) {
        let user = eco.get(`${message.guild.id}.${message.author.id}`)
        const balance = new Discord.MessageEmbed()
        .setTitle('Tu balance de puntos')
        .setDescription('Ahora mismo tienes:')
        .addFields(
            { name: 'Puntos actuales:', value: user.money, inline: true},
            { name: 'Puntos en el banco:', value: user.bank, inline: true },
        )
        .setTimestamp()
        message.channel.send(balance)
        } else {
        let user = eco.get(`${message.guild.id}.${mencionado.id}`)
        const balance = new Discord.MessageEmbed()
        .setTitle(`Este es el balance de ${mencionado.username}`)
        .setDescription(`${mencionado.username} tiene ahora mismo:`)
        .addFields(
            { name: 'Puntos actuales:', value: user.money, inline: true},
            { name: 'Puntos en el banco:', value: user.bank, inline: true },
        )
        .setTimestamp()
        message.channel.send(balance)
        }
        
    }
}