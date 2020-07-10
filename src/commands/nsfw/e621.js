const { Command, CommandError, SwitchbladeEmbed } = require('../../')

module.exports = class e621 extends Command {
  constructor (client) {
    super({
      name: 'e621',
      category: 'nsfw',
      requirements: {
        apis: [ 'e621' ]
      },
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:e621.noquery'
      }]
    }, client)
  }

  async run ({ t, author, channel }, query) {
    channel.startTyping()
    const endpoint = channel.nsfw ? '' : 'rating:safe'
    const { posts } = await this.client.apis.e621.searchPost(`${endpoint} ${query} -flash -webm`)
    console.log(posts)
    try {
      const embed = new SwitchbladeEmbed()
      embed
        .setImage(posts[0].file.url)
        .setTitle(`${t('commands:e621.id')}: ${posts[0].id}`)
        .setDescription(`**${t('commands:e621.artist')}**: "${posts[0].tags.artist[0] || 'Unknown artist'}"\n**${t('commands:e621.desc')}**: "${posts[0].description.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, '') || 'No Description'}"\n **ID**: ${posts[0].id}\n[${t('commands:e621.post')}](https://e621.net/posts/${posts[0].id})`)
      channel.send(embed)
      channel.stopTyping(true)
    } catch (e) {
      channel.stopTyping(true)
      throw new CommandError(`${t('commands:e621.notFound')}`)
    }
  }
}
