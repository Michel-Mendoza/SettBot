module.exports = {
	async execute(client) {
		client.on('guildCreate', async (guild) => {
			const log_channel = await client.channels.cache.get('843803560600797195');
			log_channel.send(`\`He sido añadido a ${guild.name}\``);
		});
	},
};