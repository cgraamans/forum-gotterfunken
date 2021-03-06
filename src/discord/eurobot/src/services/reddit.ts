import Snoowrap from 'snoowrap';

export class RedditFactory {

    private static instance:RedditFactory;

    public client:Snoowrap;

    constructor(){

        this.client = require("snoowrap");
        this.client = new Snoowrap({
            userAgent: 'GotterfunkenPostingBot',
            clientId: process.env.FG_REDDIT_CLIENT_ID,
            clientSecret: process.env.FG_REDDIT_CLIENT_SECRET,
            username: process.env.FG_REDDIT_USER,
            password: process.env.FG_REDDIT_PASS
        });

    }

    // Service Instance Initialization
    static getInstance() {
        
        if (!RedditFactory.instance) {
            RedditFactory.instance = new RedditFactory();
        }
        return RedditFactory.instance;

    }

}

export const RedditService = RedditFactory.getInstance();