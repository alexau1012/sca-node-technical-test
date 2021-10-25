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
    // Sort in ascending order
    const sortedEpisodes = episodes.sort((a, b) => {
        const dateA = convertStringToDateAEST(a.publishedDate);
        const dateB = convertStringToDateAEST(b.publishedDate);
        return dateA - dateB;
    });

    if (order === 'asc') {
        return sortedEpisodes;
    } else if (order === 'dsc') {
        return sortedEpisodes.reverse();
    } else {
        throw Error('Invalid sort order specified');
    }
}

const convertStringToDateAEST = (dateString) => {
    // Converts a string with the format of "21/08/2021, 4:38:00 pm AEST"
    // into a Date. Use cautiously as this conversion does not take into 
    // account of timezone!

    const regex = RegExp(/^(\d{2})\/(\d{2})\/(\d{4}), ([0-9]+)\:(\d{2})\:(\d{2}) ([a-z]+) AEST/);

    try {
        const dateArray = regex.exec(dateString);

        const date = dateArray[1];
        const month = dateArray[2];
        const year = dateArray[3];
        const period = dateArray[7];
        const hour = (period === 'am') ? dateArray[4] : parseInt(dateArray[4]) + 12;
        const minute = dateArray[5];
        const second = dateArray[6];
    
        return new Date(`${year}-${month}-${date} ${hour}:${minute}:${second}`);
    } catch (error) {
        throw Error(`Invalid published date: ${dateString}`);
    }
}