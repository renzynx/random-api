import { Max, Min } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';
import { SORT_TYPE, SPAN_TYPE } from './constants';

@ArgsType()
export class RedditOptions {
	@Field(() => SPAN_TYPE, { nullable: true })
	span!: SPAN_TYPE;

	@Field(() => SORT_TYPE, { nullable: true })
	sort!: SORT_TYPE;

	@Field({ nullable: true })
	nsfw!: boolean;

	@Field({ nullable: true })
	@Min(1)
	@Max(100)
	limit!: number;
}
