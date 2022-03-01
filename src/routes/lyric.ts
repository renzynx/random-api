import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Resource } from 'fastify-autoroutes';
import type { ILyricQuery } from '../lib/types';
import { encodeQuery, getLyrics } from '../lib/functions';
import logger from '../lib/logger';

export default () =>
	<Resource>{
		get: {
			handler: async (request: FastifyRequest, reply: FastifyReply) => {
				const { q, artist } = request.query as ILyricQuery;
				if (!q) return 'Invalid query';
				const encodedQuery = encodeQuery(q);
				if (!encodedQuery) return 'Invalid query';
				try {
					const searchResults = await getLyrics(encodedQuery, artist ? artist : '');
					if (!searchResults) return { lyric: 'No results found' };
					return { lyric: searchResults };
				} catch (error: any) {
					logger.error(`Error getting lyrics: ${error.message}`);
					reply.statusCode = 500;
					return reply.send({ error: 'Internal Server Error.', statusCode: 500 });
				}
			}
		}
	};
