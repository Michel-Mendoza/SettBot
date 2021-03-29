module.exports = {
    name: 'emote',
    description: 'test',
    async execute(message, args, client) {
        try {
            const emotes = client.emojis.cache
            const emote = emotes.find(emoji => emoji.name.toLowerCase() === args[0].toLowerCase());
            message.channel.send(`<:${emote.name}:${emote.id}>`)
        } catch (error) {
            message.channel.send(error)
        }
    }
}