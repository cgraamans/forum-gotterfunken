import ConfDiscord from "../conf/discord.json";
import Discord from "discord.js";

import {db} from "../services/db";

import * as https from "https";

import {TwitterService} from "../services/twitter";
import {Tools} from '../lib/tools';

import * as Types from "../types/index.d"
import { finished } from "node:stream";

export class DiscordModelTwitter {

    public maxListSize:number;

    constructor() {

    }

    // public async get(command:Types.DiscordModelMessage.CommandModel,message:Discord.Message) {

    //     let rtn:Types.DiscordModelNews.NewsModel = {};
    //     const ModelMessage = new DiscordModelMessage(message)

    //     const channels = ModelMessage.CommandGetOptionsChannels(command.options);
    //     if(channels && channels.length > 0) {
    //         rtn.key = channels[0];
    //     }
        
    //     const filter = ModelMessage.CommandOptionsFilter(command.options);
    //     if(filter.length > 0) {
    //         rtn.key = filter[0];
    //     }

    //     if(!rtn.key) rtn.key = "eunews";

    //     let keyDefList:Types.DiscordModelNews.NewsModelRow[] = await db.q(`
    //             SELECT * FROM discord_news WHERE \`key\` = ?
    //         `,
    //         [rtn.key.toLowerCase()])
    //         .catch(e=>{console.log(e)});

    //     if(keyDefList.length > 0) {

    //         rtn.row = keyDefList[0];

    //         // Process Subreddit Column Value
    //         if(rtn.row.subreddit) {

    //             let hot = await RedditService.client.getHot(rtn.row.subreddit,{limit:this.maxListSize+2})
    //                 .catch(e=>{console.log(e)});

    //             if(hot){

    //                 rtn.subreddit = hot;
                
    //             }

    //         }

    //     }

    //     return rtn;

    // }

    // Convert news to rich output
    // toRich

    private async getFile(url:string) {

        return new Promise((resolve,reject)=>{

            let data:any;

            const request = https.get(url, response => {
                if (response.statusCode === 200) {
                    response.pipe(data);
                } else {
                    reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
                }
            });

            request.on("error",err=>{
                reject(err.message);
            });

            request.on("finish",()=>{
                resolve(data);
            });

        });

    }

    public async post(message:Discord.Message) {

        let media:any = [];

        if(message.attachments) {

            message.attachments.forEach(attachment=>{

                const file = this.getFile(attachment.url)
                                .catch(e=>{console.log(e)});

                console.log(file);

            });
    
        }
        
        return TwitterService.post(message.content,media);

    }


    

}