import Player from "/game/model/Player.js";
import Card from "/game/model/Card.js";
import GameModel from "/game/model/GameModel.js";

export default class SingleSetOperation {

	/**
	 * @type {Player}
	 */
	#player = null;

	/**
	 * @type {Array<Card>}
	 */
	#selectedCards = [];

	/**
	 * @type {GameModel}
	 */
	#gameModel;

	/**
	 * @param {GameModel} gameModel 
	 * @param {Player} player 
	 */
	constructor(gameModel, player) {
		this.#gameModel = gameModel;
		this.#player = player;
		player.setActiveState(true);
	}

	/**
	 * @param {Card} card 
	 */
	doCardAction(card) {
		if(!card.isSelected()) {
			card.setSelected(true);
			this.#selectedCards.push(card);
			if(this.#selectedCards.length == 3) {
				this.#operationDone(Card.isSetCombination(this.#selectedCards));
			}
		}
		else {
			card.setSelected(false);
			this.#selectedCards = this.#selectedCards.filter(iteratorCard => iteratorCard != card);
		}
	}

	/**
	 * @param {Player} player 
	 */
	doPlayerAction(player) {
		this.#gameModel.broadcastMessage(`Egyjátékos módban nem kell játékost kiválasztani.`);
	}

	#operationDone(success) {
		this.#selectedCards.forEach(card => card.setSelected(false));
		if(success) {
			this.#gameModel.broadcastMessage(`Találtál egy setet.`);
			this.#player.increaseScore();
			this.getGameModel().removeCardsFromTable(this.#selectedCards);
			this.getGameModel().pullCards(3);
		}
		else {
			this.#player.decreaseScore();
			this.#gameModel.broadcastMessage(`Ez nem volt set.`);
		}
		this.#selectedCards = [];
	}

	/**
	 * @type {GameModel}
	 */
	getGameModel() {
		return this.#gameModel;
	}

}
