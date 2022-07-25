import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import { MONGO_URI } from './config';

async function connectDatabase() {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;
    mongoose.connection
      .on('error', error => reject(error))
      .on('close', () => console.log('Database connection closed.'))
      .once('open', () => resolve(mongoose.connections[0]));

    mongoose.connect(MONGO_URI);
  });
}

async function startServer({ typeDefs, resolvers }) {
  try {
    const info = await connectDatabase();
    console.log(`Connected to mongodb 🍃 at ${info.host}:${info.port}/${info.name}`);
  } catch (error) {
    console.error('Unable to connect to database');
    process.exit(1);
  }

  const server = new ApolloServer({ typeDefs, resolvers });
  const graphqlPort = 3000;
  server.setGraphQLPath('graphql');
  server.listen(graphqlPort).then(({ url }) => {
    console.log(`🚀 Apollo server ready on ${url}`);
    console.log('⚡️ Playground exposed on /graphql');
  });
}

export default startServer;
