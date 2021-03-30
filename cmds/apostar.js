const MeowDB = require('meowdb');
const eco = new MeowDB({
    dir: __dirname,
    name: "database"
})

module.exports = {
    name: 'apostar',
    description: 'Comando para apostar tus puntos.',
    async execute(message, args) {        
        let cantidad = parseInt(args[0]);
        let user = eco.get(`${message.guild.id}.${message.author.id}`)

        if(user.money >= cantidad) {
            user.money -= cantidad;
            user.bank += cantidad;
            user.save();
            message.reply(`has apostado ${cantidad}. Te quedan ${user.money} puntos.`)
        } else {
            message.reply('no tienes suficientes puntos para apostar esta cantidad.')
        }  
    }
}