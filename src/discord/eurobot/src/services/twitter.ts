import twitter from "twitter";

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

        const params = {screen_name: 'nodejs'};
        this.client.get('statuses/user_timeline', params, function(error) {
            if (error) throw new Error(error);
        });

    }

    public async post(message:string) {

        return await this.client.post("statuses/update",{status:message})
            .catch(e=>{console.log(e)});

    }

    public async get(){}

}

export default TwitterFactory.getInstance();