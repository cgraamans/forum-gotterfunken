import Discord from "discord.js";
import * as FileType from "file-type"
import * as https from "https";

import {TwitterService} from "../services/twitter";
import {Tools} from '../lib/tools';

import * as Types from "../types/index.d"


export class DiscordModelTwitter {

    constructor() {

    }

    private async getFile(url:string):Promise<Buffer> {

        return new Promise((resolve,reject)=>{

            let data:any[] = []

            https.get(url, (res) => {

                if (res.statusCode === 200) {

                    res.on("data",chunk=>{
                        data.push(chunk);
                    });

                    res.on("end",()=>{
                        const buffer:Buffer = Buffer.concat(data);
                        resolve(buffer);
                    });

                    res.on("error",err=>{
                        reject(err);
                    });

                } else {

                    reject(`Server responded with ${res.statusCode}: ${res.statusMessage}`);

                }

            });

        });

    }

    public async post(message:Discord.Message) {

        let media:Types.DiscordModelTwitter.MediaObj[] = [];

        if(message.attachments) {

            let urls:string[] = [];

            message.attachments.forEach(attachment=>{
                urls.push(attachment.url);
            });

            await Tools.asyncForEach(urls,async (url:string)=>{

                const file = await this.getFile(url)
                                .catch(e=>{console.log(e)});

                // TODO:
                // 

                if(file) {

                    console.log(file);
                    console.log(Buffer.byteLength(file));
                    console.log(await FileType.fromBuffer(file));
                }

                return;

                // media.push({size:"",type:"",data:null});

            });
    
        }
        
        return await TwitterService.post(message.content,media);

    }

}