const getRSSFeed = require('../utilities/rss-parser');
const { convertISODateToAEST } = require('../utilities/format-iso-date-to-AEST');

const rssFeedPage = 'https://www.nasa.gov/rss/dyn/Houston-We-Have-a-Podcast.rss';

exports.get = async (req, res, next) => {
    try {
        // Get RSS feed using URL
        let feed = await getRSSFeed(rssFeedPage);

        let rssFeed = {
            title: feed.title,
            description: feed.description,
            episodes: [],
        };

        // Iterate the first 10 items or length of the items if it is less than 10
        const itemsLen = (feed.items.length < 10) ? feed.items.length : 10;

        for (let i = 0; i < itemsLen; i++) {
            const feedItem = feed.items[i];
            
            rssFeed.episodes.push({
                title: feedItem.title,
                audioUrl: feedItem.enclosure.url,
                publishedDate: convertISODateToAEST(feedItem.pubDate),
            });
        }

        return res.json(rssFeed);
    } catch (error) {
        console.error(error);
    }
}