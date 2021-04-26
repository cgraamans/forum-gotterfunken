import Discord from "discord.js";
import {DiscordService} from "../services/discord"
import { Tools } from "../lib/tools";
import * as Types from "../types/index.d"

export class DiscordModelMessage {

    public message:Discord.Message;

    constructor(message:Discord.Message) {

        this.message = message;

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

        const filteredReactions = DiscordService.Config.Reactions.filter(reaction=>{
            return reaction.category === type;
        });

        const randomNumber = Math.floor(filteredReactions.length * Math.random());
        const reactionMsg = filteredReactions[randomNumber];

        return reactionMsg;
    
    }

    // Check the BannedWords list
    public BannedPhrases(text:string) {

        let rtnBool:boolean = false;

        DiscordService.Config.BadWords.forEach(BadWords=>{

            if(text.toLowerCase().includes(BadWords)) rtnBool = true;

        });

        return rtnBool;

    }

    // Routing foreign announcement channels to local announcement channels
    public Route() {



    }

    // isImage by last string segment
    public isImage(str:string){
        const imageLink = str.split('.');
        const image = /(jpg|jpeg|png|gif)/gi.test(imageLink[imageLink.length - 1]);
        if (!image) return false;
        return true;
    }

    //
    // Command processing and filtering
    //

    // Get commands from message and process them
    public GetCommand(message:Discord.Message) {

        if(message.content.startsWith("!") || message.content.startsWith(".")) {

            let text = message.content.slice(1);
            let textArr = text.split(" ");

            if(textArr.length > 0) {

                let Command:Types.DiscordModelMessage.CommandModel = {
                    string:textArr[0],
                };

                textArr.shift();
                Command.options = textArr;

                return Command;

            }

        }

        return;

    }

    public CommandGetOptionsTime(options:string[]) {

        let times:number[] = [];

        options.forEach((section:string,idx:number)=>{

            const toTime = Tools.stringDateSMHDToTime(section);
            if(toTime) 
                times.push(toTime);

        });

        return times;

    }

    public CommandGetOptionsChannels(options:string[]) {

        let channels:string[] = [];

        options.forEach((section:string,idx:number)=>{

            const matchedChannel = section.match(Discord.MessageMentions.CHANNELS_PATTERN);
            if(matchedChannel && !section.startsWith("/"))
                channels.push(section.slice(2,-1));

        });

        return channels;

    }

    public CommandGetOptionsNumbers(options:string[]) {

        let numbers:number[] = [];

        options.forEach((section:string)=>{

            if(section.match(/^\d$/)) 
                numbers.push(parseInt(section)); 

        });

        return numbers;

    }

    public CommandOptionsFilter(options:string[]) {

        let clean = options.filter(option=>{
            return !Tools.stringDateSMHDToTime(option);
        })

        clean = clean.filter(option=>{
            return !(option.match(Discord.MessageMentions.CHANNELS_PATTERN) && !option.startsWith("/"));
        });

        return clean;

    }

    public toRich(options?:any) {

        

    }

}