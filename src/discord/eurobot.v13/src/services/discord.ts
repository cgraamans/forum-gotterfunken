import DB from "./db";
import {Client, Intents, Message, User} from "discord.js";

import * as Eurobot from "../../types/index.d";

export class Discord {

    private static instance:Discord;

    public client:Client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'], intents: [Intents.FLAGS.GUILDS]});

    public Timers:NodeJS.Timeout[] = [];

    public Config:Eurobot.Base.Config = {};

    public isReady:boolean = false;

    // Service Instance Initialization
    static getInstance() {
        
        if (!Discord.instance) {
            Discord.instance = new Discord();
        }
        return Discord.instance;

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
                        console.log("Discord Service Client Error");
                        throw e;

                    });

                    this.client.on("ready",() => {

                        this.isReady = true;
                        console.log("Discord Ready");

                    });

                    this.client.on('disconnect',(message:Message)=>{

                        this.isReady = false;
                        if(message) console.log("Disconnected",message);


                        setTimeout(()=>{
                            this.client.login(process.env.EUROBOT_DISCORD)
                        },15000);
                    
                    });
                    
                    this.client.login(process.env.EUCOBOT)
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

        this.Config.Routes = await DB.q("SELECT * FROM discord_conf_routes").catch(e=>{throw e});
        this.Config.BadWords = await DB.q("SELECT * FROM discord_conf_badwords").catch(e=>{throw e});
        this.Config.Channels = await DB.q("SELECT * FROM discord_conf_channels").catch(e=>{throw e});
        this.Config.Reactions = await DB.q("SELECT * FROM discord_conf_reactions").catch(e=>{throw e});
        this.Config.Roles = {
            Countries:(await DB.q("SELECT * FROM discord_conf_role_countries").catch(e=>{throw e})),
            Users:(await DB.q("SELECT * FROM discord_conf_role_users").catch(e=>{throw e}))
        };

        return;

    }

    // Get User Warnings
    public async UserWarnings(user:User,minutes:number = 5):Promise<any> {

        return await DB.q(`
        
            SELECT * FROM discord_user_warnings 
            WHERE user_id = ?
            AND dt > ?
        
        `,[user.id,(new Date().getTime() - (minutes * 60000))]);
    
    }

    public async UserWarningAdd(user:User, reason:string|null = null) {

        return await DB.q(`

            INSERT INTO discord_user_warnings
            SET ?

        `,[{
            user_id:user.id,
            dt:(new Date().getTime()),
            reason:reason
        }]);

    }

}

export default Discord.getInstance();