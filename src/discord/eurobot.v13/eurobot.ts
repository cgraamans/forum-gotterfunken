import * as fs from "fs";
import { Collection, TextChannel } from "discord.js";

import Discord from "./lib/services/discord";
import {Calendar} from "./lib/models/google";

import google from "./lib/services/google";
import Tools from './lib/tools';

import * as schedule from "node-schedule";

let jobs:schedule.Job[] = [];
const calendar = new Calendar();

try {

    Discord.Client.commands = new Collection();

    const commands = [];

    console.log(__dirname);
    console.log(new Date(),`@ ${__dirname}`)

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

//
// JOBS
//

// EVENT JOB
jobs.push(schedule.scheduleJob(`*/3 * * * *`, async function(){

    console.log(`tick  @ [${new Date()}]`);

    const items = await google.Calendar({from:new Date(new Date().getTime() - (3*60*1000)),to:new Date()});

    if(items.length > 0) {
        Tools.asyncForEach(items,async (item:any)=>{
            
            const loggedID = await calendar.getLogID(item.id);
            if(loggedID) return; 

            if(!item.start.dateTime) return;
            if(item.status !== "confirmed") return;

            const confChannels = Discord.Config.Channels.filter(ch=>ch.category === "Job-Calendar-EventCheck");
            const embed = calendar.toRichEvent(item);

            console.log(confChannels,embed);

            Discord.Client.guilds.cache.forEach(guild=>{

                confChannels.forEach(confChannel=>{

                    const channel = guild.channels.cache.get(confChannel.channel_id);
                    if(channel && channel.isText()) {
                        console.log("sending event...");
                        channel.send({embeds:[embed]});
                    }

                });

            });

            await calendar.postLogID(item.id);

        });

    }

    return;

})); // EVENT JOB

console.log("jobs",jobs);