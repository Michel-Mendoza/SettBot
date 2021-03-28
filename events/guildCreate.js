module.exports = {
	name: 'guildCreate',
	async execute(guild, client) {
		const owner = await client.users.fetch('797254248387444769');
		owner.send(`He sido añadido a ${guild.name}`);
	},
};