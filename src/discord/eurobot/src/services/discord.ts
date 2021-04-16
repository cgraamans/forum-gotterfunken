import {db} from "./db";
import Discord from "discord.js";

export class DiscordFactory {

    private static instance:DiscordFactory;

    public client:Discord.Client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

    public Timers:NodeJS.Timeout[] = [];

    constructor() {

        try {

            this.client.on("error",e=>{
                throw e;
            })

            this.client.on("ready",() => {

                console.log("Discord Ready");

            });

            this.client.on('disconnect',(message:Discord.Message)=>{

                if(message) console.log("Disconnected",message);

                setTimeout(()=>{
                    this.client.login(process.env.EUROBOT_DISCORD)
                },15000);
            
            });
            this.client.login(process.env.EUROBOT_DISCORD);

        } catch(e) {

            throw e;
        
        }

    }

    // Service Instance Initialization
    static getInstance() {
        
        if (!DiscordFactory.instance) {
            DiscordFactory.instance = new DiscordFactory();
        }
        return DiscordFactory.instance;

    }

    // Get User Warnings
    public async UserWarnings(user:Discord.User,minutes:number = 5):Promise<any> {

        return await db.q(`
        
            SELECT * FROM discord_user_warnings 
            WHERE user_id = ?
            AND dt > ?
        
        `,[user.id,(new Date().getTime() - (minutes * 60000))]);
    
    }

    public async UserWarningAdd(user:Discord.User, reason:string|null = null) {

        return await db.q(`

            INSERT INTO discord_user_warnings
            SET ?

        `,[{
            user_id:user.id,
            dt:(new Date().getTime()),
            reason:reason
        }]);

    }

}

export const DiscordService = DiscordFactory.getInstance();