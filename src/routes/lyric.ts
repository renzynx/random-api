import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { Resource } from 'fastify-autoroutes';
import type { ILyricQuery } from '../lib/types';
import { encodeQuery, getLyrics } from '../lib/functions';

export default (_fastify: FastifyInstance) =>
	<Resource>{
		get: {
			handler: async (request: FastifyRequest) => {
				const { q, artist } = request.query as ILyricQuery;
				if (!q) return 'Invalid query';
				const encodedQuery = encodeQuery(q);
				if (!encodedQuery) return 'Invalid query';
				try {
					const searchResults = await getLyrics(encodedQuery, artist ? artist : '');
					if (!searchResults) return { lyric: 'No results found' };
					return { lyric: searchResults };
				} catch (error) {
					throw new Error('Internal server error');
				}
			}
		}
	};
