import { Arg, Args, Query, Resolver } from 'type-graphql';
import { SORT_TYPE } from '../lib/constants';
import { GraphqlRedditReturn, IRandomRedditData, IReddit, RedditReturn } from '../lib/types';
import { RedditOptions } from '../lib/validate';
import axios from 'axios';
import logger from '../lib/logger';

@Resolver()
export class RedditResolver {
	@Query(() => [GraphqlRedditReturn])
	async getReddit(@Args(() => RedditOptions, { validate: true }) options: RedditOptions): Promise<GraphqlRedditReturn[] | string> {
		const { query, sort, span, nsfw, limit } = options;
		try {
			const res = await axios.get<IReddit>(
				`https://www.reddit.com/r/${query}/${span ? 'top.json' : '.json'}?limit=${limit ? limit : '10'}${span ? `&t=${span}` : ''}`
			);

			if (!res.data.data) throw new Error('No subreddit found');

			const posts: RedditReturn[] = [];
			for (const post of res.data.data.children) {
				const permalink = post.data.permalink;
				const url = `https://www.reddit.com${permalink}`;
				const image = post.data.url;
				const title = post.data.title;
				const upvotes = post.data.ups;
				const downvotes = post.data.downs;
				const created = post.data.created;
				const author = post.data.author;
				const subreddit = post.data.subreddit;
				const comments = post.data.num_comments;
				const thumbnail = post.data.thumbnail;
				const nsfw = post.data.over_18;
				const createdDate = new Date(created * 1000).toLocaleDateString();
				const createdTime = new Date(created * 1000).toLocaleTimeString();

				posts.push({
					url,
					image,
					title,
					upvotes,
					downvotes,
					created,
					author,
					subreddit,
					comments,
					thumbnail,
					nsfw,
					createdDate,
					createdTime
				});
			}

			if (sort === SORT_TYPE.comments) {
				posts.sort((a, b) => b.comments - a.comments);
			} else if (sort === SORT_TYPE.upvotes) {
				posts.sort((a, b) => b.upvotes - a.upvotes);
			} else if (sort === SORT_TYPE.old) {
				posts.sort((a, b) => b.created - a.created);
			} else if (sort === SORT_TYPE.new) {
				posts.sort((a, b) => a.created - b.created);
			}

			return nsfw ? posts : posts.filter((post) => !post.nsfw);
		} catch (error: any) {
			if ((error.response && error.response.status === 404) || error.message === "Cannot read properties of undefined (reading 'children')")
				throw new Error('Subreddit not found');
			throw new Error('Internal server error');
		}
	}

	@Query(() => GraphqlRedditReturn, { nullable: true })
	async getRedditRandom(@Arg('query') query: string): Promise<RedditReturn | null> {
		try {
			const res = await axios.get<IRandomRedditData[]>(`https://www.reddit.com/r/${query}/random/.json`);
			if (!res.data.length) null;
			const post = res.data[0].data.children[0];
			const permalink = post.data.permalink;
			const url = `https://www.reddit.com${permalink}`;
			const image = post.data.url;
			const title = post.data.title;
			const upvotes = post.data.ups;
			const downvotes = post.data.downs;
			const created = post.data.created;
			const author = post.data.author;
			const subreddit = post.data.subreddit;
			const comments = post.data.num_comments;
			const thumbnail = post.data.thumbnail;
			const nsfw = post.data.over_18;
			const createdDate = new Date(created * 1000).toLocaleDateString();
			const createdTime = new Date(created * 1000).toLocaleTimeString();

			return {
				url,
				image,
				title,
				upvotes,
				downvotes,
				created,
				author,
				subreddit,
				comments,
				thumbnail,
				nsfw,
				createdDate,
				createdTime
			};
		} catch (error: any) {
			if ((error.response && error.response.status === 404) || error.message === "Cannot read properties of undefined (reading 'children')")
				throw new Error('Subreddit not found');
			logger.error(`[getRandomReddit] error: ${error.message}`);
			throw new Error('Internal server error');
		}
	}
}
