import Redis from 'ioredis';
import { withFilter } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import BasicGame from './model/BasicGame';
import BasicGameService from './service/basicGameService';

const options = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || '6379',
  retryStrategy: times => {
      // reconnect after
      return Math.min(times * 50, 2000);
  }
};

const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options)
});

const SOMETHING_CHANGED_TOPIC = 'something_changed';

export default {
  Query: {
    games: () => BasicGame.find(),
    game: (_, { id }) => BasicGame.findById(id),
  },
  Mutation: {
    createBasicGame: async (_, { data }) => BasicGameService.createBasicGame(data),
    updateBasicGame: async (ctx, { data }) => BasicGameService.updateBasicGame(ctx, data),
    deleteBasicGame: async (_, { id }) => !!(await BasicGame.findOneAndDelete(id)),
  },
  Subscription: {
      hello: {
      // Example using an async generator
      subscribe: async function* () {
        for await (const word of ["Hello", "Bonjour", "Ciao"]) {
          yield { hello: word };
        }
      },
    },
    postCreated: {
      // More on pubsub below
      subscribe: withFilter(
        () => pubsub.asyncIterator(['POST_CREATED']),
        (payload, variables) => console.log({payload, variables})
        ),
    },
    chatCreated: {
      subscribe: (_parent, _args) => pubsub.asyncIterator(['CHAT_CREATED']),
    },
    gamesSub: {
      subscribe: withFilter(
        (_, args) => pubsub.asyncIterator(`${SOMETHING_CHANGED_TOPIC}`),
      ),
    },
  },
};
