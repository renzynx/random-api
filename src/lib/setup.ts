import 'reflect-metadata';
import { registerEnumType } from 'type-graphql';
import { SORT_TYPE, SPAN_TYPE } from './constants';

registerEnumType(SORT_TYPE, {
	name: 'Sort'
});

registerEnumType(SPAN_TYPE, {
	name: 'Span'
});
