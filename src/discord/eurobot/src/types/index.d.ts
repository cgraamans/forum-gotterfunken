import { Submission } from 'snoowrap';
import Discord from 'discord.js';

export namespace DiscordModelNews {

    export interface NewsModel {

        subreddit?:Submission[],
        twitter?:any[],
        row?:NewsModelRow,
        key?:string

    }

    export interface NewsModelRow {

        key:string,
        name?:string,
        subreddit?:string,
        twitter_list?:string,
        twitter?:string,
        url?:string

    }

}

export namespace DiscordModelPoll {

    export interface Poll {

        author:string,
        channel:string,
        end:number,
        start:number
        text:string,

        message?:string,
        results?:PollResultTotals
        user?:Discord.User

    }

    export interface PollResults {

        totals:PollResultTotals
        up?:string[],
        down?:string[],
        shrug?:string[]

    }

    export interface PollResultTotals {
            "up":number,
            "down":number,
            "shrug":number,
    }

    export interface PollResultDBTotal {

        vote:string,
        num:number

    }

}

export namespace DiscordModelMessage {

    export interface CommandModel {
        string:string,
        options?:string[]
    }

}