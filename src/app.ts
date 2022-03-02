import 'reflect-metadata';
import fastify from 'fastify';
import autoRoutes from 'fastify-autoroutes';
import rateLimit from 'fastify-rate-limit';
import path from 'path';
import logger from './lib/logger';
import { srcDir, PORT } from './lib/constants';
import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { fastifyAppClosePlugin } from './lib/functions';
import { buildSchema } from 'type-graphql';
import { LyricResolver } from './resolvers/lyric.resolver';

const bootstrap = async () => {
	const app = fastify({ ignoreTrailingSlash: true, trustProxy: true });
	app.register(autoRoutes, {
		dir: path.join(srcDir, 'routes'),
		logLevel: 'debug'
	});
	app.register(rateLimit, {
		global: true,
		max: 20,
		timeWindow: 60 * 1000
	});

	app.get('/', async () => {
		return 'Documentation: https://docs.renzynx.space\nStatus Page: https://status.renzynx.space/status';
	});

	const server = new ApolloServer({
		schema: await buildSchema({
			resolvers: [LyricResolver]
		}),
		plugins: [
			fastifyAppClosePlugin(app),
			ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
			ApolloServerPluginLandingPageGraphQLPlayground()
		]
	});

	await server.start();
	app.register(server.createHandler());

	app.listen(PORT, (err, address) => {
		if (err) {
			logger.error(`[app] error starting server: ${err.message}`);
			process.exit(1);
		}
		logger.info(`[app] server listening on ${address}`);
	});
};

bootstrap().catch((error: any) => {
	logger.error(`[app] error bootstrapping: ${error.message}`);
	process.exit(1);
});
