import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  playerCards: { type: [Number], required: true },
  playerScore: { type: Number, required: false, default: 0 },
});

const BasicGame = new mongoose.Schema({
  gameName: { type: String, required: true },
  gameMode: { type: String, required: true },
  gameDificulty: { type: String, required: true },
  gameTotalCards: { type: Number, required: false, default: 10 },
  gameCards: { type: [Number], required: true },
  players: [PlayerSchema],
}, {
  collection: 'basicGames',
  timestamps: true,
  toObject: { virtuals: true },
});

export default mongoose.model('BasicGame', BasicGame);
