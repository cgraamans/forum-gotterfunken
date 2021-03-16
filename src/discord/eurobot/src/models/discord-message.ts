import ConfDiscord from "../conf/discord.json";
import Discord, { MessageMentions } from "discord.js";
import {DiscordService} from "../services/discord";
import {GoogleCalendarModel as GoogleCalendarModelObj} from "./google-calendar";
import { Tools } from "../lib/tools";

export class DiscordMessageModel {

    public UserRoles:string[] = [];

    constructor(message:Discord.Message) {

        let that = this;

        for(let role in ConfDiscord.Roles.User) {

            (ConfDiscord.Roles.User as any)[role].forEach((id:string)=>{

                if(message.member.roles.cache.find(r=>r.id === id) && !this.UserRoles.includes(role)) this.UserRoles.push(role);

            });

        }

    }

    // Get Guild Emoji from Message
    public async MessageGuildEmoji(message:Discord.Message, emojiName?:string|null, limit:number = 0): Promise<Discord.Emoji> {
        
        if(!message.guild) return;

        if(!emojiName) {

            let emoji = message.guild.emojis.cache.random();

            if(!emoji.available && limit < 10) {
                limit++;
                return await this.MessageGuildEmoji(message,null,limit);
            }   

            return emoji;

        }

        let emoji = message.guild.emojis.cache.find(em=>em.name === emojiName);
        if(emoji && emoji.available) {
            return emoji;            
        }

        return;

    }

    // Default bot textual reactions
    public async React(message:Discord.Message, type:string = "default") {

        if (Math.round(Math.random()) === 1) {
            
            const randomNumber = Math.floor(ConfDiscord.Reactions.default.length * Math.random());
            const reactionMsg = ConfDiscord.Reactions.default[randomNumber];

            return reactionMsg;
    
        }
        
        return "";
        
    }

    // Check the BannedWords list
    public BannedPhrases(text:string) {

        let rtnBool:boolean = false;

        ConfDiscord.BannedWords.forEach(bannedWord=>{

            if(text.toLowerCase().includes(bannedWord)) rtnBool = true;

        });

        return rtnBool;

    }

    public stringSanitizeTime(text:string) {

        let rtn:{text:string,time?:number} = {text}
        let textArr = text.split(" ");

        textArr.forEach((section:string,idx:number)=>{

            const toTime = Tools.stringDateSMHDToTime(section);
            if(toTime) {

                rtn.time = toTime;
                textArr.splice(idx, 1);
                
            }

        });

        rtn.text = textArr.join(" ");
        
        return rtn;

    }

    public stringSanitizeChannel(text:string) {

        let rtn:{text:string,channel?:string} = {text}
        let textArr = text.split(" ");

        textArr.forEach((section:string,idx:number)=>{

            const matchedChannel = section.match(MessageMentions.CHANNELS_PATTERN);
            if(matchedChannel) {

                rtn.channel = section.slice(2,-1);           
                textArr.splice(idx, 1);

            }

        });

        rtn.text = textArr.join(" ");

        return rtn;

    }

    public stringSanitizeNumber(text:string) {

        let rtn:{text:string,number?:number} = {text};
        let textArr = text.split(" ");

        textArr.forEach((section:string,idx:number)=>{

            if(section.match(/\d/)) rtn.number = parseInt(section);
            textArr.splice(idx, 1);

        });

        rtn.text = textArr.join(" ");

        return rtn;

    }

    public Commands(message:Discord.Message) {

        if(message.content.startsWith("!") || message.content.startsWith(".")) {

            const text = message.content.slice(1);
            let textArr = text.split(" ");
            const command = textArr[0];

            if(textArr.length > 1) {
                textArr.shift();
            }

            return {
                command:command,
                text:textArr.join(" "),
            };

        }

        return;

    }

    // Get commands from message and process them
    public async _Commands(message:Discord.Message) {

        if(message.content.startsWith("!") || message.content.startsWith(".")) {

            const text = message.content.slice(1);

            let commandOptions = text.split(" ");
            const command = commandOptions[0];
            if(commandOptions.length > 1) {
                commandOptions.shift();
            }


            
            // NEWS COMMAND
            // reddit get for news top 3
            if(command.toLowerCase() === "news") {

                if(!this.UserRoles.includes("Admin") && !this.UserRoles.includes("Mod") && !this.UserRoles.includes("News")) return;

            }

            // POLL COMMAND
            if(command.toLowerCase() === "poll") {

                if(!this.UserRoles.includes("Admin") && !this.UserRoles.includes("Mod") && !this.UserRoles.includes("Poll")) return;

                let pollTime:number = 86400000;
                let pollString:string;

                pollString = commandOptions.join(" ");
                if(!pollString.endsWith("?")) {

                    await message.channel.send(`${message.member.user}, your poll must end with a '?'`);
                    return;

                }

            }




            if(["warn"].includes(command)) {}

        }

    }

}