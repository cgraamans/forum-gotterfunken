import * as fs from "fs";
import { Collection, MessageEmbed } from "discord.js";
import {Eurobot} from "./types/index";

import Discord from "./lib/services/discord";
import {CalendarModel} from "./lib/models/google";
import NewsModel from "./lib/models/news";
import DiscordModel from "./lib/models/discord";

import google from "./lib/services/google";
import Tools from './lib/tools';

import * as schedule from "node-schedule";

let jobs:schedule.Job[] = [];

const calendarModel = new CalendarModel();
const newsModel = new NewsModel();
const discordModel = new DiscordModel();

try {

    Discord.Client.commands = new Collection();

    const commands = [];

    console.log(__dirname);
    console.log(new Date(),`@ ${__dirname}`);

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

try {

    // EVENT CHECK JOB
    jobs.push(schedule.scheduleJob(`*/3 * * * *`, async function(){

        const calendar = await google.Calendar({from:new Date(new Date().getTime() - (3*60*1000)),to:new Date()});

        if(calendar.length > 0) {

            const embed = new MessageEmbed()
                .setTitle(`🇪🇺 Event Starting!`)
                .setColor(0x001489);

            Tools.asyncForEach(calendar,async (entry:any)=>{
                
                const loggedID = await calendarModel.getLogID(entry.id);

                if(loggedID) return; 
                if(!entry.start) return;
                if(!entry.start.dateTime) return;
                if(entry.status !== "confirmed") return;

                let description = "";
                if(entry.description) description = `${entry.description}\n`;

                embed.setDescription(`🔹**${entry.summary}**\n${description}\n\nStarts: ${entry.start.dateTime}\nEnds: ${entry.end.dateTime}`)

                await discordModel.pushJobToDiscord("Job-Calendar-EventCheck",embed);

                await calendarModel.postLogID(entry.id);

                return;

            });

        }

        return;

    })); // EVENT CHECK JOB

    // CALENDAR JOB MORNING
    jobs.push(schedule.scheduleJob(`0 7 * * *`, async function(){
    
		const span:Eurobot.Calendar.Span = calendarModel.textToUnixTimeRange("today");
		const items = await google.Calendar(span.range)

		const calendar = calendarModel.toStringCalendar(items,span)

		const calendarDescription:string = `Calendar for ${span.human}\n\n`;

		const embed = new MessageEmbed()
			.setTitle(`🇪🇺 Eurobot Calendar`)
			.setDescription(calendarDescription + calendar)
			.setColor(0x001489)
            .setFooter(`you can use /calendar as well :)`);
    
        await discordModel.pushJobToDiscord("Job-Calendar",embed);

    }));


    // CALENDAR JOB EVENING
    jobs.push(schedule.scheduleJob(`0 19 * * *`, async function(){
    
		const span:Eurobot.Calendar.Span = calendarModel.textToUnixTimeRange("tomorrow");
		const items = await google.Calendar(span.range)

		const calendar = calendarModel.toStringCalendar(items,span)

		const calendarDescription:string = `Calendar for ${span.human}\n\n`;

		const embed = new MessageEmbed()
			.setTitle(`🇪🇺 Eurobot Calendar`)
			.setDescription(calendarDescription + calendar)
			.setColor(0x001489)
            .setFooter(`you can use /calendar as well :)`);
    
        await discordModel.pushJobToDiscord("Job-Calendar",embed);

    }));

    // News JOB
    jobs.push(schedule.scheduleJob(`0 */4 * * *`, async function(){

        let newsObj:Eurobot.News.Obj = {keyword:"eunews"};

		const keywordObjRow = await newsModel.getKeywordObjRow("eunews");
        if(!keywordObjRow) return;
        
        newsObj.row = keywordObjRow;

		// get news
		newsObj = await newsModel.get(newsObj);
		if(newsObj.subreddit.length > 0 || newsObj.twitter.length > 0) {

            const embed = newsModel.toRich(newsObj);
            await discordModel.pushJobToDiscord("Job-News",embed);
    
        }

        return;
    
    }));    

} catch(e) {
    console.error(e);
}