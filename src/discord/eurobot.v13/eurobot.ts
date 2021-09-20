import Discord from "./lib/services/discord";
import * as fs from "fs";
import { Collection } from "discord.js";

try {

    Discord.Client.commands = new Collection();

    const commands = [];

    console.log(__dirname);

    const commandFiles = fs.readdirSync(__dirname+'/lib/commands').filter(file=>!file.endsWith(".map"));

    for (const file of commandFiles) {
        const command = require(`${__dirname}/lib/commands/${file}`);
        Discord.Client.commands.set(command.data.name, command);
    }

} catch(e) {

    console.log(e);

}

Discord.Client.on("interactionCreate",async (interaction)=>{

    if (!interaction.isCommand()) return;

    console.log(`${interaction.commandName} by ${interaction.user.username}`);

    const command = Discord.Client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`>> ${interaction.commandName} by ${interaction.user.username}`,error,`\n`);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }

});

