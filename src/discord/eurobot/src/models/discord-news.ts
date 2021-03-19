import {db} from "../services/db";
import Discord from "discord.js";
import {RedditService} from "../services/reddit";
import {Tools} from '../lib/tools';

import * as Types from "../types/index.d"

export class DiscordModelNews {

    public maxListSize:number;

    constructor(maxListSize:number = 3) {

        this.maxListSize = maxListSize;

    }

    public async get(key:string = "eunews") {

        let rtn:Types.DiscordModelNews.NewsModel = {key:key};

        let keyDefList:Types.DiscordModelNews.NewsModelRow[] = await db.q(`
                SELECT * FROM discord_news WHERE \`key\` = ?
            `,
            [key.toLowerCase()])
            .catch(e=>{console.log(e)});

        if(keyDefList.length > 0) {

            rtn.row = keyDefList[0];

            // Process Subreddit Column Value
            if(rtn.row.subreddit) {

                let hot = await RedditService.client.getHot(rtn.row.subreddit,{limit:this.maxListSize+2})
                    .catch(e=>{console.log(e)});

                if(hot){

                    rtn.subreddit = hot;
                
                }

            }

        }

        return rtn;

    }

    // Convert news to rich output
    // toRich
    public toRich(news:Types.DiscordModelNews.NewsModel) {

        if(!news.row) return;

        let name = news.key

        if(news.row.subreddit) name = news.row.subreddit;
        if(news.row.name) name = news.row.name;

        let footer = `Source: ${name}`;
        if(news.row.url) footer += ` | URL: ${news.row.url}`;

        let text = ``;

        if(news.subreddit && news.subreddit.length > 0) {

            let embed = new Discord.MessageEmbed()
                .setTitle(`🇪🇺 Eurobot News`)
                .setColor(0xFFCC00)
                .setFooter(footer);

            // filter sticked
            news.subreddit = news.subreddit.filter(submission=>{
                return !submission.stickied;
            });

            // reduce to max list size
            news.subreddit.length = this.maxListSize;

            let thumbnail:string;
            news.subreddit.forEach((submission,idx)=>{

                if(!thumbnail && submission.thumbnail) thumbnail = submission.thumbnail; 

                text += `🔹${submission.title}\n<${submission.url}>\n\n`;

            });
            
            if(thumbnail) embed.setThumbnail(thumbnail);
            embed.setDescription(text);

            return embed;

        }

        return;

    } // toRich


}