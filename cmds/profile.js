const Discord = require('discord.js');
module.exports = {
    name: 'profile',
    async execute(message, args, client) {
        const database = client.database
        const functions = client.functions
        database.create(`${message.author.id}`, {
            locale: 'English',
            verified: false,
            summoner: null,
            region: null
        });
    
        let mencionado = message.mentions.members.first();
        
        const missing_args = {
            English: 'you must tell the region and summoner name to use this command. You can also try linking your summoner name to your profile with `s.verify`',
            Espanol: 'debes incluir la región y el nombre de invocador para usar este comando. También puedes probar a vincular tu nombre de invocador a tu perfil con `s.verify`'
        };
        
        const mention_unverified = {
            English: 'the user you entered is not verified',
            Espanol: 'el usuario que has introducido no está verificado'
        };

        const userdata = database.get(`${message.author.id}`)

        if (!mencionado) {
            if (!args[1]&&userdata.verified==false) {
                if (userdata.locale==='English') return message.reply(missing_args.English)
                if (userdata.locale==='Espanol') return message.reply(missing_args.Espanol)
            };
    
            if (!args[1]&&userdata.verified==true) {
                var name = userdata.summoner;
                var region = userdata.region.toUpperCase();
                var platform = ''
            } else if (args[1]) {
                var platform = args.shift().toUpperCase();
                var name = args.join(' ')
            };
        } else {
            database.create(`${mencionado.id}`, {
                locale: 'English',
                verified: false,
                summoner: null,
                region: null
            });
            var mentiondata = database.get(`${mencionado.id}`)
            console.log(mentiondata)
            if (mentiondata.verified==false) {
                if (userdata.locale==='English') return message.reply(mention_unverified.English)
                if (userdata.locale==='Espanol') return message.reply(mention_unverified.Espanol)
            } else if (mentiondata.verified==true) {
                var name = mentiondata.summoner;
                var region = mentiondata.region.toUpperCase();
                var platform = ''
            }
        }

        let knownRegion = [
            "EUW", "EUNE", "NA", "LAS", "LAN"
        ].includes(platform); if (knownRegion == true) {
            if (platform === "EUW") var region = "EUW1"
            if (platform === "EUNE") var region = "EUN1"
            if (platform === "NA") var region = "NA1"
            if (platform === "LAN") var region = "LA1"
            if (platform === "LAS") var region = "LA2"
        };

        let knownPlatform = [
            "EUW1", "EUN1", "NA1", "LA2", "LA1"
        ].includes(region); if (knownPlatform == true) {
            if (region === "EUW1") var platform = "EUW"
            if (region === "EUN1") var platform = "EUNE"
            if (region === "NA1") var platform = "NA"
            if (region === "LA1") var platform = "LAS"
            if (region === "LA2") var platform = "LA"
        };

        const summoner = await functions.summoner_api(region, name); if (summoner==false) {
            if (userdata.locale==='English') return message.reply(`the specified summoner doesn't exist for that region.`);
            if (userdata.locale==='Espanol') return message.reply(`el invocador que buscas no existe en esa región`);
        };

        const mastery = await functions.mastery_api(region, summoner.summoner_id);
        const soloq = await functions.soloqueue_api(region, summoner.summoner_id);
        const history = await functions.history_api(region, summoner.account_id);
        const last10Games = {
            game1: await functions.gamedata_api(region, history.match_ids[0], summoner.summoner_name),
            game2: await functions.gamedata_api(region, history.match_ids[1], summoner.summoner_name),
            game3: await functions.gamedata_api(region, history.match_ids[2], summoner.summoner_name),
            game4: await functions.gamedata_api(region, history.match_ids[3], summoner.summoner_name),
            game5: await functions.gamedata_api(region, history.match_ids[4], summoner.summoner_name),
            game6: await functions.gamedata_api(region, history.match_ids[5], summoner.summoner_name),
            game7: await functions.gamedata_api(region, history.match_ids[6], summoner.summoner_name),
            game8: await functions.gamedata_api(region, history.match_ids[7], summoner.summoner_name),
            game9: await functions.gamedata_api(region, history.match_ids[8], summoner.summoner_name),
            game10: await functions.gamedata_api(region, history.match_ids[9], summoner.summoner_name),
        };
        const lastgamechamp = await functions.championIdentifiers(history.last_game.champion);
        lastgamechamp.emote = functions.emote(client, lastgamechamp.id);
        var wins = 0; var losses = 0;
        if (last10Games.game1.remake == false) {
            if (last10Games.game1.win == true) wins++; else losses++
        } if (last10Games.game2.remake == false) {
            if (last10Games.game2.win == true) wins++; else losses++
        } if (last10Games.game3.remake == false) {
            if (last10Games.game3.win == true) wins++; else losses++
        } if (last10Games.game4.remake == false) {
            if (last10Games.game4.win == true) wins++; else losses++
        } if (last10Games.game5.remake == false) {
            if (last10Games.game5.win == true) wins++; else losses++
        } if (last10Games.game6.remake == false) {
            if (last10Games.game6.win == true) wins++; else losses++
        } if (last10Games.game7.remake == false) {
            if (last10Games.game7.win == true) wins++; else losses++
        } if (last10Games.game8.remake == false) {
            if (last10Games.game8.win == true) wins++; else losses++
        } if (last10Games.game9.remake == false) {
            if (last10Games.game9.win == true) wins++; else losses++
        } if (last10Games.game10.remake == false) {
            if (last10Games.game10.win == true) wins++; else losses++
        };
        const champ1Mast = (await functions.championIdentifiers(mastery.one.identifier)).name;
        const champ2Mast = (await functions.championIdentifiers(mastery.two.identifier)).name;
        const champ3Mast = (await functions.championIdentifiers(mastery.three.identifier)).name;
        const champ1Emote = functions.emote(client, (await functions.championIdentifiers(mastery.one.identifier)).id);
        const champ2Emote = functions.emote(client, (await functions.championIdentifiers(mastery.two.identifier)).id);
        const champ3Emote = functions.emote(client, (await functions.championIdentifiers(mastery.three.identifier)).id);

        if (userdata.locale==='English') {
            var mastery1 = `**1.${champ1Emote} ${champ1Mast} [${mastery.one.level}]** - ${mastery.one.points.toLocaleString('en-US')}`
            var mastery2 = `**2.${champ2Emote} ${champ2Mast} [${mastery.two.level}]** - ${mastery.two.points.toLocaleString('en-US')}`
            var mastery3 = `**3.${champ3Emote} ${champ3Mast} [${mastery.three.level}]** - ${mastery.three.points.toLocaleString('en-US')}`
        };

        if (userdata.locale==='Espanol') {
            var mastery1 = `**1.${champ1Emote} ${champ1Mast} [${mastery.one.level}]** - ${mastery.one.points.toLocaleString('es-ES')}`
            var mastery2 = `**2.${champ2Emote} ${champ2Mast} [${mastery.two.level}]** - ${mastery.two.points.toLocaleString('es-ES')}`
            var mastery3 = `**3.${champ3Emote} ${champ3Mast} [${mastery.three.level}]** - ${mastery.three.points.toLocaleString('es-ES')}`
        };

        const winrate = `${Math.trunc((soloq.wins * 100) / (soloq.wins + soloq.losses))}% Winrate`
        var cola = history.last_game.queue
        if (userdata.locale==='Espanol') {
            if (cola == 420 || cola == 440 || cola == 700) {
                if (cola == 420) {
                  var cola = 'Clasificatoria Solo/Dúo'
                }
                if (cola == 440) {
                  var cola = 'Clasificatoria Flexible'
                }
                if (cola == 700) {
                  var cola = 'Clash'
                }
              } else {var cola = 'Normal'}
        } else if (userdata.locale==='English') {
            if (cola == 420 || cola == 440 || cola == 700) {
                if (cola == 420) {
                  var cola = 'Ranked Solo/Duo'
                }
                if (cola == 440) {
                  var cola = 'Ranked flex'
                }
                if (cola == 700) {
                  var cola = 'Clash'
                }
              } else {var cola = 'Normal'}
        }
        const embed_espanol = new Discord.MessageEmbed()
            .setAuthor(`Perfil de ${summoner.summoner_name} - ${platform}`, summoner.summoner_icon)
            .setDescription('Esto es lo que he encontrado:')
            .addField('Nivel:', summoner.summoner_lvl, true)
            .addField('Últimas 10 Partidas:', `${wins} Victorias - ${losses} Derrotas`, true)
            .addField('‎', '‎', true)
            .addField('Campeones con mayor maestría:', `${mastery1} puntos.\n${mastery2} puntos.\n${mastery3} puntos.`, true)
            .addField('Estadísticas en Clasificatoria Solo/Dúo:', soloq==false?'Sin clasificar.':`${soloq.tier} ${soloq.rank}\n${soloq.lp} Puntos de Liga.\n${winrate}`, true)
            .addField('Última partida:', `${last10Games.game1.remake?`⚙️ **Remake** en ${cola} con ${lastgamechamp.emote} **${lastgamechamp.name}**.`:`${last10Games.game1.win?`✅ **Victoria** en ${cola} con ${lastgamechamp.emote} **${lastgamechamp.name}** KDA: ${last10Games.game1.kda.kills}/${last10Games.game1.kda.deaths}/${last10Games.game1.kda.assists} - Minions: ${last10Games.game1.cs}`:`❌ **Derrota** en ${cola} con ${lastgamechamp.emote} **${lastgamechamp.name}** KDA: ${last10Games.game1.kda.kills}/${last10Games.game1.kda.deaths}/${last10Games.game1.kda.assists} - Minions: ${last10Games.game1.cs}`}`}`)
            .setFooter(`Solicitado por ${message.author.username}`, message.author.avatarURL())
            .setTimestamp(new Date());
        
        const embed_english = new Discord.MessageEmbed()
            .setAuthor(`Profile of ${summoner.summoner_name} - ${platform}`, summoner.summoner_icon)
            .setDescription(`This is what I found:`)
            .addField('Level:', summoner.summoner_lvl, true)
            .addField('Last 10 Games:', `${wins} Wins - ${losses} Losses`, true)
            .addField('‎', '‎', true)
            .addField('Champions with better mastery:', `${mastery1} points.\n${mastery2} points.\n${mastery3} points.`, true)
            .addField('Ranked Solo/Duo stats:', soloq==false?'Unranked.':`${soloq.tier} ${soloq.rank}\n${soloq.lp} League Points.\n${winrate}`, true)
            .addField('Last game:', `${last10Games.game1.remake?`⚙️ **Remake** in ${cola} with ${lastgamechamp.emote} **${lastgamechamp.name}**.`:`${last10Games.game1.win?`✅ **Victory** in ${cola} with ${lastgamechamp.emote} **${lastgamechamp.name}** KDA: ${last10Games.game1.kda.kills}/${last10Games.game1.kda.deaths}/${last10Games.game1.kda.assists} - Minions: ${last10Games.game1.cs}`:`❌ **Defeat** in ${cola} with ${lastgamechamp.emote} **${lastgamechamp.name}** KDA: ${last10Games.game1.kda.kills}/${last10Games.game1.kda.deaths}/${last10Games.game1.kda.assists} - Minions: ${last10Games.game1.cs}`}`}`)
            .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL())
            .setTimestamp(new Date());
        if (userdata.locale==='Espanol') message.reply(embed_espanol);
        if (userdata.locale==='English') message.reply(embed_english);
    },
};