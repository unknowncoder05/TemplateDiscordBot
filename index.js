const fs = require('fs');
const Discord = require('discord.js');
const { token, prefix } = require('./config.json');


const client = new Discord.Client();



client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}



client.on('message', async message => {
	if (!message.content.startsWith(prefix)) return;

	const commandName = message.content.split(" ")[0].slice(prefix.length);
	
	if (!client.commands.has(commandName)){
		await message.reply({ content: 'Not a command I know of', ephemeral: true });
		return;
	}

	try {
		await client.commands.get(commandName).execute(message);
	} catch (error) {
		console.error(error);
		await message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


client.login(token);
