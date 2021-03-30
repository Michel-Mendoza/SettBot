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
        let usuario1 = eco.get(`${message.guild.id}.${message.author.id}`)
        let usuario2 = eco.get(`${message.guild.id}.${mencionado.id}`)

        let dineroapostado = usuario1.bank+usuario2.bank

        function resetbank(a,b) {
            a.bank -= a.bank
            a.save()

            b.bank -= b.bank
            b.save()
        }

        if (usuario1.bank == 0||usuario2.bank == 0) return message.reply('tú o la persona con la que quieres apostar no tenéis dinero en juego. Apuesta con s.apostar <cantidad>')

        const msg = await message.channel.send(`${mencionado.nickname}, ¿quieres aceptar la apuesta? Reacciona con ✅ si estás de acuerdo. Tus ${usuario2.bank} puntos serán restados de tu cartera.`) 
        await msg.react('✅')

        msg.awaitReactions((reaction, user) => user.id == mencionado.id && reaction.emoji.name == '✅', {
            max: 1, time: 30000
        }).then(async collected => {
            if (collected.first().emoji.name == '✅') {
                const init = await message.channel.send(`La apuesta ha iniciado correctamente. Cuando acabéis, finaliza la apuesta reaccionando a este mensaje con ✅. La apuesta tiene una duración máxima de 3 horas.`)
                await init.react('✅')

                init.awaitReactions((reaction, user) => user.id == mencionado.id && reaction.emoji.name == '✅', {
                    max: 1, time: 10800000
                }).then(async collected => {
                    if (collected.first().emoji.name == '✅') {
                        const win = await message.channel.send(`La apuesta finalizado. ¿Has ganado? Si es así, reacciona con 👍. En caso contrario, hazlo con 👎.`)
                        await win.react('👍'); await win.react('👎')

                        win.awaitReactions((reaction, user) => user.id == mencionado.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'), {
                            max: 1, time: 30000
                        }).then(async collected => {
                            if (collected.first().emoji.name == '👍') {
                                message.channel.send(`¡Enhorabuena! Has ganado ${usuario1.bank+usuario2.bank} puntos y el dinero en juego se ha establecido a 0.`)
                                usuario2.money == dineroapostado+usuario2.money
                                usuario2.save()
                                resetbank(usuario1, usuario2)
                            } else if (collected.first().emoji.name == '👎') {
                                message.channel.send(`¡La próxima vez será! El dinero en juego se ha establecido a 0.`)
                                usuario1.money == dineroapostado+usuario1.money
                                usuario1.save()
                                resetbank(usuario1, usuario2)
                            }
                        }).catch(() => {
                            message.channel.send('La apuesta se ha cancelado.');
                    });
                    }
                }).catch(() => {
                    message.channel.send('La apuesta se ha cancelado.');
            });
            }
        }).catch(() => {
            message.channel.send('La apuesta se ha cancelado.');
    });
    }

}