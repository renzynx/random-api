import { Arg, Query, Resolver } from 'type-graphql';
import { encodeQuery, getLyrics } from '../lib/functions';
import { LyricQuery } from '../lib/types';
import logger from '../lib/logger';

@Resolver()
export class LyricResolver {
	@Query(() => LyricQuery, { nullable: true })
	async getLyric(@Arg('query') query: string, @Arg('artist', { nullable: true }) artist?: string): Promise<LyricQuery> {
		const q = encodeQuery(`${query}`);
		if (!q) throw new Error('Invalid query');
		try {
			const lyric = await getLyrics(q, artist);
			if (!lyric) return { lyric: 'No lyrics found' };
			return { lyric };
		} catch (error: any) {
			logger.error(`[getLyric] error: ${error.message}`);
			throw new Error('Internal server error');
		}
	}
}
