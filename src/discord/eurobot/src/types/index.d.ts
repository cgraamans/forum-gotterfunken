import { Submission } from 'snoowrap';

export namespace DiscordModelNews {

    export interface NewsModel {

        subreddit?:Submission[],
        twitter?:any[],
        row?:NewsModelRow,
        key:string

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

        results?:DiscordModelPoll.PollResults
    }

    export interface PollResults {

        up:string[],
        down:string[],
        shrug:string[]

    }

}

export namespace DiscordModelMessage {

    export interface CommandModel {
        string:string,
        options?:string[]
    }

}