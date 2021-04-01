module.exports = {
    name: 'config',
    async execute(message, args, client) {
        const database = client.database
        database.create(`${message.author.id}`, {
            locale: 'English',
            verified: false,
            summoner: null,
            region: null
        });
        const userdata = database.get(`${message.author.id}`)
        const missing_args = {
            English: 'you must specify the value you want to change in the config.',
            Espanol: 'debes especificar el valor que quieres cambiar en la configuración.'
        };
        const unknown_config = {
            English: "you must enter a correct value to modify the config. Example: `s.config language español`",
            Espanol: 'debes introducir un valor correcto para modificar la configuración. Ejemplo: `s.config language english`'
        }
        if (!args[1]) {
            if (userdata.locale==='English') return message.reply(missing_args.English)
            if (userdata.locale==='Espanol') return message.reply(missing_args.Espanol)
        };
        const configvar = args [0]
        const newconfig = args[1]
        if (!configvar.toLowerCase() === 'language') {
            if (userdata.locale==='English') return message.reply(unknown_config.English)
            if (userdata.locale==='Espanol') return message.reply(unknown_config.Espanol)
        }
        if (!newconfig.toLowerCase() === 'español'||!newconfig.toLowerCase() === 'english') {
            if (userdata.locale==='English') return message.reply(unknown_config.English)
            if (userdata.locale==='Espanol') return message.reply(unknown_config.Espanol)
        }
        if (newconfig==='español') {
            userdata.locale = 'Espanol'; userdata.save()
        } else if (newconfig==='english') {
            userdata.locale==='English'
        }
    }
}