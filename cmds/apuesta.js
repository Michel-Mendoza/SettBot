const MeowDB = require('meowdb');
const eco = new MeowDB({
    dir: __dirname,
    name: "database"
})

module.exports = {
    name: 'apuesta',
    description: 'Comando para apostar tus puntos.',
    async execute(message) {
        let mencionado = message.mentions.members.first();
        if (!mencionado) return message.reply('debes mencionar a alguien para iniciar la apuesta.')
        let user = eco.get(`${message.guild.id}.${message.author.id}`)
        let user2 = eco.get(`${message.guild.id}.${mencionado.id}`)

        let dinero1 = user.bank
        let dinero2 = user2.bank

        let apostado = dinero1 + dinero2

        if (dinero1 == 0||dinero2 == 0) return message.reply('tú o la persona con la que quieres apostar no tenéis dinero en juego. Apuesta con s.apostar <cantidad>')

        user.bank == 0; user.save()
        user2.bank == 0; user2.save()

        const msg = await message.channel.send(`${mencionado.nickname}, ¿quieres aceptar la apuesta? Reacciona con 👍 si estás de acuerdo. Tus ${dinero2} puntos serán restados de tu cartera.`) 
        await msg.react('👍')

        msg.awaitReactions((reaction, user) => user.id == mencionado.id && reaction.emoji.name == '👍', {
            max: 1, time: 30000
        }).then(async collected => {
            if (collected.first().emoji.name == '👍') {
                const init = await message.channel.send(`La apuesta ha iniciado correctamente. Cuando acabéis, finaliza la apuesta reaccionando a este mensaje con 👍. La apuesta tiene una duración máxima de 3 horas.`)
                await init.react('👍')

                init.awaitReactions((reaction, user) => user.id == mencionado.id && reaction.emoji.name == '👍', {
                    max: 1, time: 10800000
                }).then(async collected => {
                    if (collected.first().emoji.name == '👍') {
                        const win = await message.channel.send(`La apuesta finalizado. ¿Has ganado? Si es así, reacciona con 👍. En caso contrario, hazlo con 👎.`)
                        await win.react('👍'); await win.react('👎')

                        win.awaitReactions((reaction, user) => user.id == mencionado.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'), {
                            max: 1, time: 30000
                        }).then(async collected => {
                            if (collected.first().emoji.name == '👍') {
                                message.channel.send(`¡Enhorabuena! Has ganado ${apostado} puntos y el dinero en juego se ha establecido a 0.`)
                                let dinero = user2.money
                                let asumar = apostado
                                let total = dinero+asumar
                                user2.money==total
                                user2.bank==0
                                user.save();
                                user.bank == 0; user.save()
                            } else if (collected.first().emoji.name == '👎') {
                                message.channel.send(`¡La próxima vez será! El dinero en juego se ha establecido a 0.`)
                                let dinero = user.money
                                let asumar = apostado
                                let total = dinero+asumar
                                user.money==total
                                user.bank==0
                                user.save();
                                user2.bank == 0; user2.save()
                            }
                        }).catch(() => {
                            message.channel.send('La apuesta se ha cancelado.');
                            user.bank == dinero1; user2.bank == dinero2; user.save(); user2.save()
                    });
                    }
                }).catch(() => {
                    message.channel.send('La apuesta se ha cancelado.');
                    user.bank == dinero1; user2.bank == dinero2; user.save(); user2.save()
            });
            }
        }).catch(() => {
            message.channel.send('La apuesta se ha cancelado.');
            user.bank == dinero1; user2.bank == dinero2; user.save(); user2.save()
    });
    }

}