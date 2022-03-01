import axios from 'axios';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Resource } from 'fastify-autoroutes';
import type { IRandomRedditData, IRandomRedditQuery } from '../../lib/types';

export default () =>
	<Resource>{
		get: {
			handler: async (request: FastifyRequest, reply: FastifyReply) => {
				const { q } = request.query as IRandomRedditQuery;
				if (!q) return 'Invalid query';
				try {
					const res = await axios.get<IRandomRedditData[]>(`https://www.reddit.com/r/${q}/random/.json`);

					if (!res.data.length) {
						reply.statusCode = 404;
						return reply.send('Subreddit not found');
					}

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
					if (error.response && error.response.status === 404) {
						reply.statusCode = 404;
						return 'Subreddit not found';
					}
					reply.statusCode = 500;
					return 'Internal server error';
				}
			}
		}
	};
