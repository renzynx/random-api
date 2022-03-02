import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class GraphqlRedditReturn {
	@Field()
	url!: string;

	@Field()
	image!: string;

	@Field()
	title!: string;

	@Field()
	upvotes!: number;

	@Field()
	downvotes!: number;

	@Field()
	created!: number;

	@Field()
	author!: string;

	@Field()
	subreddit!: string;

	@Field()
	comments!: number;

	@Field()
	thumbnail!: string;

	@Field()
	nsfw!: boolean;

	@Field()
	createdDate!: string;

	@Field()
	createdTime!: string;
}

export interface ILyricQuery {
	q: string;
	artist?: string;
}

export interface IRedditQuery {
	q: string;
	span?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
	sort?: 'comments' | 'upvotes' | 'old' | 'new';
	nsfw?: string;
	limit?: string;
}

export interface IRandomRedditQuery {
	q: string;
}

export interface RedditReturn {
	url: string;
	image: string;
	title: string;
	upvotes: number;
	downvotes: number;
	created: number;
	author: string;
	subreddit: string;
	comments: number;
	thumbnail: string;
	nsfw: boolean;
	createdDate: string;
	createdTime: string;
}

export interface IReddit {
	kind: string;
	data: {
		after: string;
		before: string | null;
		dist: number;
		modhash: string;
		geo_filter: string | null;
		children: Children[];
	};
}

@ObjectType()
export class LyricQuery {
	@Field({ nullable: true })
	lyric!: string;
}

// Generated by https://quicktype.io

export interface Children {
	kind: string;
	data: Data;
}

export interface Data {
	approved_at_utc: null;
	subreddit: string;
	selftext: string;
	author_fullname: string;
	saved: boolean;
	mod_reason_title: null;
	gilded: number;
	clicked: boolean;
	title: string;
	link_flair_richtext: any[];
	subreddit_name_prefixed: string;
	hidden: boolean;
	pwls: number;
	link_flair_css_class: null;
	downs: number;
	thumbnail_height: number;
	top_awarded_type: null;
	hide_score: boolean;
	name: string;
	quarantine: boolean;
	link_flair_text_color: 'dark' | 'light';
	upvote_ratio: number;
	author_flair_background_color: null;
	subreddit_type: string;
	ups: number;
	total_awards_received: number;
	media_embed: Gildings;
	thumbnail_width: number;
	author_flair_template_id: null;
	is_original_content: boolean;
	user_reports: any[];
	secure_media: null;
	is_reddit_media_domain: boolean;
	is_meta: boolean;
	category: null;
	secure_media_embed: Gildings;
	link_flair_text: null;
	can_mod_post: boolean;
	score: number;
	approved_by: null;
	is_created_from_ads_ui: boolean;
	author_premium: boolean;
	thumbnail: string;
	edited: boolean;
	author_flair_css_class: null;
	author_flair_richtext: any[];
	gildings: Gildings;
	post_hint: string;
	content_categories: null;
	is_self: boolean;
	mod_note: null;
	created: number;
	link_flair_type: string;
	wls: number;
	removed_by_category: null;
	banned_by: null;
	author_flair_type: string;
	domain: string;
	allow_live_comments: boolean;
	selftext_html: null;
	likes: null;
	suggested_sort: null;
	banned_at_utc: null;
	url_overridden_by_dest: string;
	view_count: null;
	archived: boolean;
	no_follow: boolean;
	is_crosspostable: boolean;
	pinned: boolean;
	over_18: boolean;
	preview: any[];
	all_awardings: any[];
	awarders: any[];
	media_only: boolean;
	can_gild: boolean;
	spoiler: boolean;
	locked: boolean;
	author_flair_text: null;
	treatment_tags: any[];
	visited: boolean;
	removed_by: null;
	num_reports: null;
	distinguished: null;
	subreddit_id: string;
	author_is_blocked: boolean;
	mod_reason_by: null;
	removal_reason: null;
	link_flair_background_color: string;
	id: string;
	is_robot_indexable: boolean;
	report_reasons: null;
	author: string;
	discussion_type: null;
	num_comments: number;
	send_replies: boolean;
	whitelist_status: string;
	contest_mode: boolean;
	mod_reports: any[];
	author_patreon_flair: boolean;
	author_flair_text_color: null;
	permalink: string;
	parent_whitelist_status: string;
	stickied: boolean;
	url: string;
	subreddit_subscribers: number;
	created_utc: number;
	num_crossposts: number;
	media: null;
	is_video: boolean;
}

interface Gildings {}

// Generated by https://quicktype.io

export interface IRandomRedditData {
	kind: string;
	data: IRandomRedditDatumData;
}

export interface IRandomRedditDatumData {
	after: null;
	dist: number | null;
	modhash: string;
	geo_filter: string;
	children: Child[];
	before: null;
}

export interface Child {
	kind: string;
	data: ChildData;
}

export interface ChildData {
	approved_at_utc: null;
	subreddit: string;
	selftext: string;
	user_reports: any[];
	saved: boolean;
	mod_reason_title: null;
	gilded: number;
	clicked: boolean;
	title: string;
	link_flair_richtext: LinkFlairRichtext[];
	subreddit_name_prefixed: string;
	hidden: boolean;
	pwls: number;
	link_flair_css_class: string;
	downs: number;
	thumbnail_height: null;
	top_awarded_type: null;
	parent_whitelist_status: string;
	hide_score: boolean;
	name: string;
	quarantine: boolean;
	link_flair_text_color: string;
	upvote_ratio: number;
	author_flair_background_color: null;
	subreddit_type: string;
	ups: number;
	total_awards_received: number;
	media_embed: Gildings;
	thumbnail_width: null;
	author_flair_template_id: null;
	is_original_content: boolean;
	author_fullname: string;
	secure_media: null;
	is_reddit_media_domain: boolean;
	is_meta: boolean;
	category: null;
	secure_media_embed: Gildings;
	link_flair_text: string;
	can_mod_post: boolean;
	score: number;
	approved_by: null;
	is_created_from_ads_ui: boolean;
	author_premium: boolean;
	thumbnail: string;
	edited: boolean;
	author_flair_css_class: null;
	author_flair_richtext: any[];
	gildings: Gildings;
	content_categories: null;
	is_self: boolean;
	mod_note: null;
	created: number;
	link_flair_type: string;
	wls: number;
	removed_by_category: null;
	banned_by: null;
	author_flair_type: string;
	domain: string;
	allow_live_comments: boolean;
	selftext_html: string;
	likes: null;
	suggested_sort: null;
	banned_at_utc: null;
	view_count: null;
	archived: boolean;
	no_follow: boolean;
	is_crosspostable: boolean;
	pinned: boolean;
	over_18: boolean;
	all_awardings: any[];
	awarders: any[];
	media_only: boolean;
	link_flair_template_id: string;
	can_gild: boolean;
	spoiler: boolean;
	locked: boolean;
	author_flair_text: null;
	treatment_tags: any[];
	visited: boolean;
	removed_by: null;
	num_reports: null;
	distinguished: null;
	subreddit_id: string;
	author_is_blocked: boolean;
	mod_reason_by: null;
	removal_reason: null;
	link_flair_background_color: string;
	id: string;
	is_robot_indexable: boolean;
	num_duplicates: number;
	report_reasons: null;
	author: string;
	discussion_type: null;
	num_comments: number;
	send_replies: boolean;
	media: null;
	contest_mode: boolean;
	author_patreon_flair: boolean;
	author_flair_text_color: null;
	permalink: string;
	whitelist_status: string;
	stickied: boolean;
	url: string;
	subreddit_subscribers: number;
	created_utc: number;
	num_crossposts: number;
	mod_reports: any[];
	is_video: boolean;
}

export interface LinkFlairRichtext {
	e: string;
	t: string;
}
