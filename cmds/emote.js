module.exports = {
    name: 'emote',
    description: 'test',
    async execute(message, args, client) {
        const emote = client.emojis.find(emoji => emoji.name === args[0]);
        console.log(emote)
    }
}