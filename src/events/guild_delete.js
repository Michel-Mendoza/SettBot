module.exports = {
	async execute(client) {
		client.on('guildDelete', async (guild) => {
			const log_channel = await client.channels.cache.get('843803560600797195');
			log_channel.send(`\`He sido expulsado de ${guild.name}\``);
		});
	},
};