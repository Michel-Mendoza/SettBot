module.exports = {
	name: 'ready',
    once: true,
	async execute(client) {
        client.user.setActivity(`versión v3 en desarrollo. ¡Nuevas funciones próximamente!`, {type: 'WATCHING',})
        console.log(`Bot listo.`)
        const servers = await client.guilds.cache.size
        const owner = await client.users.fetch('797254248387444769');
        owner.send(`Bot iniciado. ${new Date()}\nEstoy en ${servers} servidores.`);
	},
};  