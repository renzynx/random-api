import axios from 'axios';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Resource } from 'fastify-autoroutes';
import type { IReddit, IRedditQuery, RedditReturn } from '../../lib/types';

export default () =>
	<Resource>{
		get: {
			handler: async (request: FastifyRequest, reply: FastifyReply) => {
				const { q, span, nsfw, limit, sort } = request.query as IRedditQuery;
				if (!q) return 'Invalid query';
				if (limit && isNaN(Number(limit))) {
					reply.statusCode = 400;
					return 'Invalid limit';
				}
				if ((limit && parseInt(limit, 10) < 1) || (limit && parseInt(limit, 10) > 100)) {
					reply.statusCode = 400;
					return 'Limit must be between 1 and 100';
				}
				if (span && !['hour', 'day', 'week', 'month', 'year', 'all'].includes(span)) {
					reply.statusCode = 400;
					return reply.send('Span must be one of day, week, month, year, all');
				}
				if (sort && !['comments', 'upvotes', 'old', 'new'].includes(sort)) {
					reply.statusCode = 400;
					return reply.send('Sort must be one of comments, upvotes, old, new');
				}
				try {
					const res = await axios.get<IReddit>(
						`https://www.reddit.com/r/${q}/${span ? 'top.json' : '.json'}?limit=${limit ? limit : '10'}${span ? `&t=${span}` : ''}`
					);

					if (!res.data.data) {
						reply.statusCode = 404;
						return 'Subreddit not found';
					}

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
					if (
						(error.response && error.response.status === 404) ||
						error.message === "Cannot read properties of undefined (reading 'children')"
					) {
						reply.statusCode = 404;
						return 'Subreddit not found';
					}

					reply.statusCode = 500;
					return 'Internal server error';
				}
			}
		}
	};
