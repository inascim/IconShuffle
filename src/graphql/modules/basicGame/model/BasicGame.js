import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  playerCards: { type: [Number], required: true },
  playerScore: { type: Number, required: false, default: 0 },
});

const BasicGame = new mongoose.Schema({
  players: [PlayerSchema],
  gameType: { type: String, required: true },
  cardsNumber: { type: Number, required: false, default: 10 },
  cardData: { type: [Number], required: true },
}, {
  collection: 'basicGames',
  timestamps: true,
  toObject: { virtuals: true },
});

export default mongoose.model('BasicGame', BasicGame);
