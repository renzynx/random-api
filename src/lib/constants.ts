import path from 'path';

export const srcDir = path.join(__dirname, '..');
export const PORT = process.env.PORT ?? 42069;

export enum SORT_TYPE {
	comments = 'comments',
	upvotes = 'upvotes',
	old = 'old',
	new = 'new'
}

export enum SPAN_TYPE {
	hour = 'hour',
	day = 'day',
	week = 'week',
	month = 'month',
	year = 'year',
	all = 'all'
}
