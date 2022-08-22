import mongoose from 'mongoose';
import { MONGO_URI } from './config';
import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import express from 'express';
import http from 'http';


import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';


async function connectDatabase() {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;
    mongoose.connection
      .on('error', error => reject(error))
      .on('close', () => console.log('Database connection closed.'))
      .once('open', () => resolve(mongoose.connections[0]));

    mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });
}

async function startServer({ typeDefs, resolvers }) {
  // Required logic for integrating with Express
  const app = express();
  // Our httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = http.createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if your ApolloServer serves at
    // a different path.
    path: '/graphql',
  });
  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer({ schema }, wsServer);
  
  const server = new ApolloServer({ 
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  // More required logic for integrating with Express
  await server.start();
  server.applyMiddleware({
    app,

    // By default, apollo-server hosts its GraphQL endpoint at the
    // server root. However, *other* Apollo Server packages host it at
    // /graphql. Optionally provide this to match apollo-server.
    path: '/',
  });

  const graphqlPort = 3000;
  await new Promise(
    resolve => httpServer.listen({ port: process.env.PORT || graphqlPort }, resolve)
  );

  console.log(
    `🚀 Query endpoint ready at http://localhost:${graphqlPort}${server.graphqlPath}`
  );

  console.log(
    `🚀 Subscription endpoint ready at ws://localhost:${graphqlPort}${server.graphqlPath}`
  );

  try {
    const info = await connectDatabase();
    console.log(`Connected to mongodb 🍃 at ${info.host}:${info.port}/${info.name}`);
  } catch (error) {
    console.error('Unable to connect to database');
    process.exit(1);
  }

  // Old Apollo Server Startup
  // server.setGraphQLPath('graphql');
  // server.listen(process.env.PORT || graphqlPort).then(({ url }) => {
  //   console.log(`🚀 Apollo server ready on ${url}`);
  //   console.log('⚡️ Playground exposed on /graphql');
  // });
}

export default startServer;
