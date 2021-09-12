import { Submission } from 'snoowrap';
import Discord from 'discord.js';

export namespace Base {

    export interface Config {
        BadWords?:string[],
        Channels?:ConfigChannel[],
        Reactions?:ConfigReaction[],
        Roles?:RolesCountries,
        Routes?:ChannelRoute[]
    }

    export interface ConfigRolesCountry {
        alias:string,
        role_id:string,
        emoji:string,
        
        toggle_result?:number,
        toggle_role?:Discord.Role

    }

    export interface ConfigRolesUser {
        role_id:string,
        category:string,
        user_level:number
    }

    export interface ConfigReaction {
        reaction:string,
        category:string
    }

    export interface ConfigChannel {
        channel_id:string,
        category:string
    }

    export interface RolesCountries {
        Countries:ConfigRolesCountry[],
        Users:ConfigRolesUser[]
    }

    export interface ChannelRoute {

        from:string,
        to:string,
        isActive:number

    }

}

export namespace Models {

    export namespace News {

        export interface Obj {

            subreddit?:Submission[],
            twitter?:any[],
            row?:Row,
            key?:string

        }

        export interface Row {

            key:string,
            name?:string,
            subreddit?:string,
            twitter_list?:string,
            twitter?:string,
            url?:string

        }

    }

    export namespace Polls {

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
    
    export namespace Message {
    
        export interface CommandModel {
            string:string,
            options?:string[]
        }
    
    }
    
    export namespace Twitter {
    
        export interface MediaObj {
            size:string,
            type:string,
            data:Buffer
        }
    
    }

}

