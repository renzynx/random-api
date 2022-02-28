import { Field, ObjectType } from 'type-graphql';

export interface ILyricQuery {
	q: string;
	artist?: string;
}

@ObjectType()
export class LyricQuery {
	@Field({ nullable: true })
	lyric!: string;
}
