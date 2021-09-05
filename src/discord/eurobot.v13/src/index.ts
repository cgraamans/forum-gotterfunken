import Discord from "./services/discord";
import * as fs from "fs";
import { Collection, BaseCommandInteraction } from "discord.js";

try {

    Discord.Client.commands = new Collection();

    const commands = [];

    console.log(__dirname);

    const commandFiles = fs.readdirSync(__dirname+'/commands').filter(file=>!file.endsWith(".map"));

    for (const file of commandFiles) {
        const command = require(`${__dirname}/commands/${file}`);
        Discord.Client.commands.set(command.data.name, command);
    }

} catch(e) {

    console.log(e);

}

Discord.Client.on("interactionCreate",async (interaction:BaseCommandInteraction)=>{

    if (!interaction.isCommand()) return;

    console.log("INTERACTION",interaction);

    const command = Discord.Client.commands.get(interaction.commandName);

    console.log(command);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }

});

