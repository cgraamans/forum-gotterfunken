import ConfDiscord from "../conf/discord.json";
import Discord from "discord.js";
import {GoogleCalendarModel as GoogleCalendarModelObj} from "./google-calendar";

export class DiscordMessageModel {

    public UserRoles:any[] = [];

    constructor(message:Discord.Message) {

        let that = this;
        ConfDiscord.Roles.forEach(function(roleLookup) {

            const role = message.member.roles.cache.find(r=>roleLookup.toLowerCase() === r.name.toLowerCase());
            if(role) {
                
                that.UserRoles.push(roleLookup.toLowerCase());

            }

        });

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

    // Get commands from message and process them
    public async Commands(message:Discord.Message) {

        let text = message.content.toLowerCase();
        if(text.startsWith("!") || text.startsWith(".")) {

            text = text.slice(1);
            let commandOptions = text.split(" ");
            const command = commandOptions[0];
            if(commandOptions.length > 1) {
                commandOptions.shift();
            }

            if(["poll","vote"].includes(command)) {

                // check fg network or senator

                let pollTime:number = 300000;
                const regex:RegExp = /^[0-9]?[0-9]*[dhms]$/gm;
                let matchedTime:string|null = null;
                commandOptions.forEach((section:string,idx:number)=>{

                    const matches = section.match(regex);
                    if(matches) {
                        matchedTime = matches[0];
                        commandOptions.slice
                    }
                    console.log();
                    if(regex.test(section)) {     

                    }

                });

                // check citizen or senator

            }
    
            if(command === "senatevote") {
    
                if(!this.UserRoles.includes("senator")) return;
                // check senator

            }
    
            if(command === "calendar") {

                // weekly calendar

                const GoogleCalendarModel = new GoogleCalendarModelObj();
                const items = await GoogleCalendarModel.get(commandOptions);
                if(items.length > 0) {
                    const embed = GoogleCalendarModel.toRich(items,commandOptions);
                    if(embed) message.channel.send(embed);    
                }

            }

            if(command === "ban") {

                // check options for time and user

            }

            if(["mute","prison"].includes(command)) {

                // check options for time and user

            }

            if(command === "addquote") {

                if(!this.UserRoles.includes("senator") && !this.UserRoles.includes("citizen")) return;

            }

        }

    }

}