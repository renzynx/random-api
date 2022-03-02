import axios from 'axios';
import cheerio from 'cheerio';
import logger from './logger';
import type { FastifyInstance } from 'fastify';
import type { ApolloServerPlugin } from 'apollo-server-plugin-base';

const encodeQuery = (q: string): string | null => {
	const expression =
		/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
	if (expression.test(q)) return null;
	return encodeURI(
		q
			.toString()
			.toLowerCase()
			.replace(/\[(.*?)\]|\-|\&|\((.*?)\)/g, '')
			.trim()
	);
};

const getLyrics = async (query: string, artist?: string): Promise<string | null> => {
	try {
		const res = await axios.get(`https://www.musixmatch.com/search/${query} ${artist ? artist : ''}`);
		const $ = cheerio.load(res.data);
		const search = $('a.title').first().attr('href');
		if (!search) return fallBack(query, artist) ?? null;
		const link = 'https://www.musixmatch.com' + search;
		const res2 = await axios.get(link);
		const $2 = cheerio.load(res2.data);
		const lyric = $2('.lyrics__content__ok').text();
		if (!lyric) return fallBack(query, artist) ?? null;
		return lyric;
	} catch (error: any) {
		logger.error(`[getLyrics] error: ${error.message}`);
		return null;
	}
};

const fallBack = async (query: string, artist?: string): Promise<string | null> => {
	try {
		const res = await axios.get(
			`https://search.azlyrics.com/search.php?q=${query.split(' ').join('+')} ${artist ? artist.split(' ').join('+') : ''}`
		);
		const $ = cheerio.load(res.data);
		const link = $('body > div.container.main-page > div > div > div:nth-child(1) > table > tbody > tr:nth-child(1) > td > a');
		const lyricUrl = link.attr('href');
		if (!lyricUrl) return null;
		const lyricRes = await axios.get(lyricUrl);
		const $lyric = cheerio.load(lyricRes.data);
		const lyric = $lyric('body > div.container.main-page > div > div.col-xs-12.col-lg-8.text-center > div:nth-child(8)').text();
		return lyric;
	} catch (error: any) {
		logger.error(`[firstFallBack] error: ${error.message}`);
		return null;
	}
};

// const fallBack = async (query: string, artist?: string): Promise<string | null> => {
// 	try {
// 		const res = await axios.get(`https://genius.com/api/search/multi?per_page=1&q=${query.split('+')} ${artist ? artist : ''}`);
// 		const url = res.data.response.sections[0].hits[0].result.url;

// 		const res2 = await axios.get(url);
// 		const $ = cheerio.load(res2.data);
// 		const lyricContainer = $('#lyrics-root-pin-spacer')
// 			.toString()
// 			.replace(/<br[^>]*>/g, '\n');
// 		const $2 = cheerio.load(lyricContainer);
// 		const lyric = $2.text().split('\n');
// 		lyric.shift();
// 		lyric.unshift('[Intro]');
// 		return lyric.join('\n');
// 	} catch (error: any) {
// 		logger.error(`[fallBack] error: ${error.message}`);
// 		return null;
// 	}
// };

const fastifyAppClosePlugin = (app: FastifyInstance): ApolloServerPlugin => {
	return {
		async serverWillStart() {
			return {
				async drainServer() {
					await app.close();
				}
			};
		}
	};
};

export { encodeQuery, getLyrics, fallBack, fastifyAppClosePlugin };
