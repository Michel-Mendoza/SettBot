module.exports = {
	name: 'guildDelete',
	async execute(guild, client) {
		const owner = await client.users.fetch('797254248387444769');
		owner.send(`\`He sido expulsado de ${guild.name}\``);
	},
};