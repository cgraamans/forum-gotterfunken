import {db} from "./db";
import Discord from "discord.js";

import * as Types from "../types/index.d";

export class DiscordFactory {

    private static instance:DiscordFactory;

    public client:Discord.Client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

    public Timers:NodeJS.Timeout[] = [];

    public Config:Types.Eurobot.Config = {};

    public isReady:boolean = false;

    // Service Instance Initialization
    static getInstance() {
        
        if (!DiscordFactory.instance) {
            DiscordFactory.instance = new DiscordFactory();
        }
        return DiscordFactory.instance;

    }

    constructor() {

        try {

            //
            // CONFIG
            //

            const config = this.getConfig()
                .then(()=>{

                    // 
                    // DISCORD CLIENT
                    //

                    this.client.on("error",e=>{

                        this.isReady = false;
                        throw e;

                    });

                    this.client.on("ready",() => {

                        this.isReady = true;
                        console.log("Discord Ready");

                    });

                    this.client.on('disconnect',(message:Discord.Message)=>{

                        this.isReady = false;
                        if(message) console.log("Disconnected",message);


                        setTimeout(()=>{
                            this.client.login(process.env.EUROBOT_DISCORD)
                        },15000);
                    
                    });
                    
                    this.client.login(process.env.EUROBOT_DISCORD)
                        .then(()=>{
                            this.isReady = true;
                        }).catch(e=>{

                            this.isReady = false;
                            throw e;

                        });

                });


        } catch(e) {

            throw e;
        
        }

    }

    // Retrieve configs from database for constructor
    private async getConfig() {

        this.Config.Routes = await db.q("SELECT * FROM discord_conf_routes",[]).catch(e=>{throw e});
        this.Config.BadWords = await db.q("SELECT * FROM discord_conf_badwords",[]).catch(e=>{throw e});
        this.Config.Channels = await db.q("SELECT * FROM discord_conf_channels",[]).catch(e=>{throw e});
        this.Config.Reactions = await db.q("SELECT * FROM discord_conf_reactions",[]).catch(e=>{throw e});
        this.Config.Roles = {
            Countries:(await db.q("SELECT * FROM discord_conf_role_countries",[]).catch(e=>{throw e})),
            Users:(await db.q("SELECT * FROM discord_conf_role_users",[]).catch(e=>{throw e}))
        };

        return;

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