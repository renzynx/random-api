import axios from 'axios';
import { Arg, Args, Query, Resolver } from 'type-graphql';
import logger from '../lib/logger';
import { GraphqlRedditReturn, IRandomRedditData, IReddit, RedditReturn } from '../lib/types';
import { RedditOptions } from '../lib/validate';

@Resolver()
export class RedditResolver {
	@Query(() => [GraphqlRedditReturn])
	async getReddit(@Arg('query') query: string, @Args(() => RedditOptions) options: RedditOptions): Promise<GraphqlRedditReturn[] | string> {
		const { sort, span, nsfw, limit } = options;

		if (sort && !['comments', 'upvotes', 'old', 'new'].includes(sort))
			throw new Error('Invalid sort option, valid options are: comments, upvotes, old, new');
		if (span && !['hour', 'day', 'week', 'month', 'year', 'all'].includes(span))
			throw new Error('Invalid span option, valid options are: hour, day, week, month, year, all');

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

			if (sort === 'comments') {
				posts.sort((a, b) => b.comments - a.comments);
			} else if (sort === 'upvotes') {
				posts.sort((a, b) => b.upvotes - a.upvotes);
			} else if (sort === 'old') {
				posts.sort((a, b) => b.created - a.created);
			} else if (sort === 'new') {
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
			logger.error(`[getRandomReddit] error: ${error.message}`);
			return null;
		}
	}
}
