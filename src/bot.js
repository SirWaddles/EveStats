import Discord from 'discord.js';
import DiscordToken from './discordtoken';
const client = new Discord.Client();

client.on('message', message => {
  if (message.content === 'ping') {
    message.reply('U R DUM');
  }
});

client.login(DiscordToken);
