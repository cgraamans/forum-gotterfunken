import {db} from './db';

export class RedditFactory {

    private static instance:RedditFactory;

    // Service Instance Initialization
    static getInstance() {
        
        if (!RedditFactory.instance) {
            RedditFactory.instance = new RedditFactory();
        }
        return RedditFactory.instance;

    }

}

export const reddit = RedditFactory.getInstance();