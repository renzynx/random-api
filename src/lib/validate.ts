import { IsInt, Max, Min } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class RedditOptions {
	@Field({ nullable: true })
	span!: string;

	@Field({ nullable: true })
	sort!: string;

	@Field({ nullable: true })
	nsfw!: boolean;

	@Field({ nullable: true })
	@IsInt()
	@Min(1)
	@Max(100)
	limit!: number;
}
