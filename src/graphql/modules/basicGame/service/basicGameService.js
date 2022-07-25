import BasicGameRepository from '../repository/basicGameRepository';
import { 
  createRandomUniqueList,
  pickRandonItemFromList
} from '../../../../util/utilFunctions';

class BasicGameService {
  constructor() {
    this._buildTableCards = this._buildTableCards.bind(this);
    this._verifyPlayerMove = this._verifyPlayerMove.bind(this);
    this._updateBasicGamePlayers = this._updateBasicGamePlayers.bind(this);
    this.basicGameRepository = BasicGameRepository
  }

  _updateBasicGamePlayers ({ players, cardData: newPlayerCardData, actionPlayerName }) {
    return players.map(
      ({ playerName, playerScore, playerCards }) => {
        if (actionPlayerName === playerName) {
          return {
            playerName,
            playerScore: playerScore + 1,
            playerCards: newPlayerCardData,
          };
        }
        return { playerName, playerScore, playerCards };
      },
    );
  }

  _buildTableCards({ players, cardData, actionPlayerName }) {
    const playerCardsMatrix = players
    .filter(({ playerName }) => playerName !== actionPlayerName)
    .map(({playerCards}) => playerCards)
    .concat([cardData]);

    const randomElementsFromPlayers = pickRandonItemFromList(playerCardsMatrix);
    return createRandomUniqueList({ 
      size: 8,
      includeElements: [...new Set(randomElementsFromPlayers)]
    });
  }

  _verifyPlayerMove({ gameData = {}, playerIcon, playerName}) {
    const { cardData = [], players = [] } = gameData;
    const playerGame = players.find(
      ({playerName: pName}) => pName === playerName
    );

    if (!playerGame || !playerName || !playerIcon) {
      return false;
    }

    const { playerCards: playerCardIcons = [] } = playerGame;
    const isIconInPlayerCard = [...playerCardIcons].includes(playerIcon);
    const isIconInCardData = cardData.includes(playerIcon);

    return isIconInPlayerCard && isIconInCardData
  }

  async createBasicGame({ players = [], gameType }) {
    const playersData = players.map((pName) => ({
      playerName: pName,
      playerCards: createRandomUniqueList({ size: 8 }) 
    }));

    const playerCardsMatrix = playersData.map(({playerCards}) => playerCards);
    const randomElementsFromPlayers = pickRandonItemFromList(playerCardsMatrix);
    const tableCards = createRandomUniqueList({ 
      size: 8,
      includeElements: [...new Set(randomElementsFromPlayers)]
    });

    return this.basicGameRepository.createGame({
      gameType,
      players: playersData,
      cardData: tableCards,
    });
  }

  async updateBasicGame(ctx, { id, playerIcon, playerName }) {
    const gameData = await this.basicGameRepository.getOneBasicGame(id);
    const isValidPlayerMove = this._verifyPlayerMove({gameData, playerIcon, playerName});

    console.log(ctx);

    if (isValidPlayerMove) {
      console.log(`${playerName} SCORED`);

      const newTableCard = this._buildTableCards({ 
        ...gameData, actionPlayerName: playerName 
      });
      const playersUpdate = this._updateBasicGamePlayers({ 
        ...gameData, actionPlayerName: playerName
      });

      return this.basicGameRepository.updateBasicGame({
        id,
        data: {
          players: playersUpdate,
          cardData: newTableCard,
        }
      }, { new: true });
    }

    console.log(`${playerName} ERROR`);
    return { ...gameData, error: `${playerName} WRONG MOVE` };
  }
}

export default new BasicGameService();