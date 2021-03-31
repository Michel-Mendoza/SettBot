module.exports = {
    name: 'config',
    async execute(message, args, client) {
        const db = client.database
        db.create(`${message.guild.id}`, {
            locale: 'en_US',
            economy: false
        })
        let msg = require("../mensajes/config.js")
        let obj = db.get(`${message.guild.id}`)
        if (!args[0]||!args[1]) {
            if (obj.locale==='es_ES') message.reply(msg.missingArgs.es_ES)
            if (obj.locale==='en_US') message.reply(msg.missingArgs.en_US)
            if (obj.locale==='fr_FR') message.reply(msg.missingArgs.fr_FR)
            return
        }
        if (args[0].toLowerCase()==='locale'&&(args[1]==='es_ES'||args[1]==='en_US'||args[1]==='fr_FR')) {
            obj.locale = args[1]
            obj.save()
            if (args[1]==='es_ES') message.reply(msg.locale.es_ES)
            if (args[1]==='en_US') message.reply(msg.locale.en_US)
            if (args[1]==='fr_FR') message.reply(msg.locale.fr_FR)
            return
        } else if (args[0].toLowerCase()==='economy'&&(args[1]==='on'||args[1]==='off')) {
            if (args[1]==='on') {
                obj.economy = true;
                obj.save()
                if (obj.locale==='es_ES') message.reply(msg.economy.enable.es_ES)
                if (obj.locale==='en_US') message.reply(msg.economy.enable.en_US)
                if (obj.locale==='fr_FR') message.reply(msg.economy.enable.fr_FR)
            } else if (args[1]==='off') {
                obj.economy = false;
                obj.save()
                if (obj.locale==='es_ES') message.reply(msg.economy.disable.es_ES)
                if (obj.locale==='en_US') message.reply(msg.economy.disable.en_US)
                if (obj.locale==='fr_FR') message.reply(msg.economy.disable.fr_FR)
            }
        } else return;
    }
}