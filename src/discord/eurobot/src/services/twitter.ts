import twitter from "twitter";
import {Tools} from "../lib/tools";
import * as Types from "../types/index.d";

export class TwitterFactory {

    private static instance:TwitterFactory;

    private client:twitter;

    // Service Instance Initialization
    static getInstance() {

        if (!TwitterFactory.instance) {
            TwitterFactory.instance = new TwitterFactory();
        }
        return TwitterFactory.instance;

    }

    constructor() {

        this.client = new twitter({
            consumer_key: process.env.FG_TWITTER_C_KEY,
            consumer_secret: process.env.FG_TWITTER_C_SECRET,
            access_token_key: process.env.FG_TWITTER_AT_KEY,
            access_token_secret: process.env.FG_TWITTER_AT_SECRET
        });

        // Test connection on init
        const params = {screen_name: "cgraamans"};
        this.client.get("statuses/user_timeline", params, (error)=>{
            if (error) console.log("Twitter Init Error",error);
        });

    }

    // post message with media
    public async post(message:string,media?:Types.DiscordModelTwitter.MediaObj[]) {

        let params = {status:message};

        if(media && media.length > 0) {

            await Tools.asyncForEach(media,async (mediaObj:Types.DiscordModelTwitter.MediaObj)=>{

                const init = await this.initUpload(mediaObj.size,mediaObj.type);
                console.log(init);
                // TODO: 
                // chunk
                // 

            });

        }

        // TEST 
        return new Promise((resolve:any)=>{resolve()});

        // return await this.client.post("statuses/update",params)
            // .catch(e=>{console.log(e)});

    }

    public async get(params:{screen_name:string}){

        await this.client.get('statuses/user_timeline', params);

    }

    // Media Upload Fns
    // https://github.com/desmondmorris/node-twitter/tree/master/examples#media
    //

    private async initUpload (mediaSize:string,mediaType:string) {
        return this.makePost('media/upload', {
            command    : 'INIT',
            total_bytes: mediaSize,
            media_type : mediaType,
        }).then((data:twitter.ResponseData) => data.media_id_string);
    }

    private async appendUpload (mediaId:string,mediaData:any) {
        return this.makePost('media/upload', {
            command      : 'APPEND',
            media_id     : mediaId,
            media        : mediaData,
            segment_index: 0
        }).then((data:twitter.ResponseData) => mediaId);
    }

    private async finalizeUpload (mediaId:string) {
        return this.makePost('media/upload', {
            command : 'FINALIZE',
            media_id: mediaId
        }).then((data:twitter.ResponseData) => mediaId);
    }

    private async makePost (endpoint:string, params:twitter.RequestParams) {
        return new Promise((resolve, reject) => {
            this.client.post(endpoint, params, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }

    // Media Upload Fns

}

export const TwitterService = TwitterFactory.getInstance();