const feedService = require('../services/feedService');

const rssFeedPageUrl = 'https://www.nasa.gov/rss/dyn/Houston-We-Have-a-Podcast.rss';

exports.get = async (req, res, next) => {
    try {
        const rssFeed = await feedService.getFeed(rssFeedPageUrl);

        return res.json(rssFeed);
    } catch (error) {
        next(error);
    }
}

exports.getSorted = async (req, res, next) => {
    try {
        const order = req.query.order;

        if (!order) {
            next(Error('Sort order is not specified'));
        }

        const rssFeed = await feedService.getFeed(rssFeedPageUrl);

        const rssFeedEpisodes = await feedService.getSortedEpisodes(rssFeed.episodes, order);

        rssFeed.episodes = rssFeedEpisodes;

        return res.json(rssFeed);
    } catch (error) {
        next(error);
    }
}