module.exports = {
    name: 'emote',
    description: 'test',
    async execute(message, args, client) {
        const emotes = client.emojis
        const emote = emotes.find(emoji => emoji.name === args[0]);
        console.log(emote)
    }
}