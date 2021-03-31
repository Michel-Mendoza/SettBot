module.exports = {
    name: 'config',
    async execute(message, args, client) {
        const db = client.database
        db.create(`${message.guild.id}`, {
            locale: 'en_US',
            economy: false
        })
        if (!args) return message.reply(`you must specify the value you want to change in the config. `)
        if (args[0].toLowerCase()==='locale'&&(args[1]==='es_ES'||args[1]==='en_US'||args[1]==='fr_FR')) {
            let obj = db.get(`${message.guild.id}`)
            obj.locale = args[1]
            obj.save()
            let msg = require("../mensajes/config.js")
            if (args[1]==='es_ES') message.reply(msg.es_ES)
            if (args[1]==='en_US') message.reply(msg.en_US)
            if (args[1]==='fr_FR') message.reply(msg.fr_FR)
        }
    }
}