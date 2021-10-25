const getRSSFeed = require('../utilities/rss-parser');
const { convertISODateToAEST } = require('../utilities/format-iso-date-to-AEST');

exports.getFeed = async (url) => {
    // Get RSS feed using URL
    let feed = await getRSSFeed(url);

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

    return rssFeed;
}

exports.getSortedEpisodes = (episodes, order) => {
    const sortedEpisodes = episodes.sort((a, b) => a.publishedDate - b.publishedDate);
    if (order === 'asc') {
        return sortedEpisodes.reverse();
    } else if (order === 'dsc') {
        return sortedEpisodes;
    } else {
        throw new Error('Invalid sort order specified');
    }
}