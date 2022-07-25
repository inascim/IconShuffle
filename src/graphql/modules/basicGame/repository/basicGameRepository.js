import BasicGame from '../model/BasicGame';

class BasicGameRepository {
  constructor() {
    this.basicGame = BasicGame;
  }

  async createGame(data) {
    const basicGame = await this.basicGame.create(data);
    return basicGame;
  }

  async getOneBasicGame(id) {
    const singleBasicGame = await this.basicGame.findById(id).lean();
    return singleBasicGame || {};
  }

  async updateBasicGame({ id, data }) {
    return this.basicGame.findOneAndUpdate(id, data, { new: true });
  }
}

export default new BasicGameRepository();