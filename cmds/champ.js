module.exports = {
	name: 'champ',
	description: 'Información sobre habilidades y pasiva de un campeón',
	async execute(message, args) {
		const Discord = require('discord.js');
		const campeonInexistente = require("../errores/campeon-inexistente.json");
		const missingArgs = require("../errores/uso-incorrecto/champion.json");
	
		const champion = args[0]; if (!champion) return message.channel.send(missingArgs);
		const msg = message.channel.send('```Realizando la petición a Riot Games...```');
		
		const championInfo = require("../src/ddragon/get-champdata.js");
		const getInfo = championInfo.get(champion); if ((await getInfo) == false) return (await msg).edit(campeonInexistente);
		
		const embed = new Discord.MessageEmbed();
		embed.setAuthor(`Información sobre el campeón: ${(await getInfo).name}`);
		embed.setDescription((await getInfo).lore);
		embed.addField(`Pasiva: ${(await getInfo).passive.name}`,`\`\`\`${(await getInfo).passive.description}\`\`\``);
		embed.addField(`Q: ${(await getInfo).spells.q.name}`, `\`\`\`${(await getInfo).spells.q.description}\`\`\``);
		embed.addField(`W: ${(await getInfo).spells.w.name}`, `\`\`\`${(await getInfo).spells.w.description}\`\`\``);
		embed.addField(`E: ${(await getInfo).spells.e.name}`, `\`\`\`${(await getInfo).spells.e.description}\`\`\``);
		embed.addField(`R: ${(await getInfo).spells.r.name}`, `\`\`\`${(await getInfo).spells.r.description}\`\`\``);
		embed.setFooter(`Solicitado por ${message.author.username}`);
		embed.setTimestamp();
		
		(await msg).edit(embed);
	}
};