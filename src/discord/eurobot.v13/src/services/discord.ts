import DB from "./db";
import * as ClientType from "../../types/discord";

import {Intents, Message, User, Client} from "discord.js";
import * as fs from "fs";

import * as Eurobot from "../../types/index.d";

export class Discord {

    private static instance:Discord;

    public Client:Client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'], intents: [Intents.FLAGS.GUILDS]});

    public Timers:NodeJS.Timeout[] = [];

    public Config:Eurobot.Base.Config = {};


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
                    // Queue events

                    const eventFiles = fs.readdirSync(`${__dirname}/../events`);

                    for (const file of eventFiles) {
                        const event = require(`${__dirname}/../events/${file}`);
                        if (event.once) {
                            this.Client.once(event.name, (...args) => event.execute(...args));
                        } else {
                            this.Client.on(event.name, (...args) => event.execute(...args));
                        }
                    }

                    this.Client.on("error",e=>{

                        console.log("Discord Service Client Error");
                        throw e;

                    });

                    this.Client.on('disconnect',(message:Message)=>{

                        if(message) console.log("Disconnected",message);

                        setTimeout(()=>{
                            this.Client.login(process.env.EUROBOT_DISCORD)
                        },15000);
                    
                    });
                    
                    this.Client.login(process.env.EUCOBOT);

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