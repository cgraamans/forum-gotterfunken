import Discord from "./services/discord";
import * as fs from "fs";

import { Collection, Interaction } from "discord.js";
(async () => {

    Discord.Client.commands = new Collection();

    const commands = [];
    const commandFiles = fs.readdirSync('./commands');

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }

    Discord.Client.on("interactionCreate",async (interaction:Interaction)=>{

        if (!interaction.isCommand()) return;

        const command = Discord.Client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }

    });

});