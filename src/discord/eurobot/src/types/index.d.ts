import { Submission } from 'snoowrap';

export namespace DiscordModelNews {

    export interface NewsModel {

        subreddit?:Submission[];
        twitter?:any[];
        row?:NewsModelRow;
        key:string;

    }

    export interface NewsModelRow {

        key:string;
        name?:string;
        subreddit?:string;
        twitter_list?:string;
        twitter?:string;
        url?:string;

    }

}

export namespace DiscordModelPoll {

    export interface PollModelFilteredOptions {
        channels:string[];
        numbers?:number[];
        times:number[];
        filtered:string[];
    }

}

export namespace DiscordModelMessage {

    export interface CommandModel {

        string:string;
        options?:string[];

    }

}