import BasicGame from './model/BasicGame';
import BasicGameService from './service/basicGameService';

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
};
