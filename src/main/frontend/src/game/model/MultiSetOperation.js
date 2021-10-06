import Player from "/game/model/Player.js";
import Card from "/game/model/Card.js";
import GameModel from "/game/model/GameModel.js";

export default class MultiSetOperation {

	/**
	 * @type {Player}
	 */
	#player = null;

	/**
	 * @type {Number}
	 */
	#taskID;

	/**
	 * @type {Array<Card>}
	 */
	#selectedCards = [];

	/**
	 * @type {GameModel}
	 */
	#gameModel;

	/**
	 * @type {Array<Player>}
	 */
	#blockList = [];

	/**
	 * @param {GameModel} gameModel
	 */
	constructor(gameModel) {
		this.#gameModel = gameModel;
	}

	/**
	 * @returns {Boolean}
	 */
	isActive() {
		return this.#player != null;
	}

	/**
	 * @param {Card} card 
	 */
	doCardAction(card) {
		if(!this.isActive()) {
			this.#gameModel.broadcastMessage("A játékhoz először ki kell választani 1 játékost.");
			return;
		}
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
		if(this.isActive()) {
			this.#gameModel.broadcastMessage("Már van játékos kiválasztva.");
			return;
		}
		if(player.isBlocked()) {
			this.#gameModel.broadcastMessage("Ez a játékos nem léphet ebben a körben.");
			return;
		}
		this.#player = player;
		this.#taskID = setTimeout(() => this.#operationDone(false), 10*1000);
		player.setActiveState(true);
	}

	#operationDone(success) {
		clearTimeout(this.#taskID);
		this.#player.setActiveState(false);
		this.#selectedCards.forEach(card => card.setSelected(false));
		if(success) {
			this.#gameModel.broadcastMessage(`${this.#player.getNickname()} talált egy setet!`);
			this.#player.increaseScore();
			this.#unblockPlayers();
			this.getGameModel().removeCardsFromTable(this.#selectedCards);
			this.getGameModel().pullCards(3);
		}
		else {
			this.#player.decreaseScore();
			this.#player.setBlocked(true);
			this.#blockList.push(this.#player);
			if(this.#blockList.length == this.#gameModel.getPlayerList().getSize()) {
				this.#unblockPlayers();
			}
		}
		this.#selectedCards = [];
		this.#player = null;
	}

	#unblockPlayers() {
		this.#blockList.forEach(blockedPlayer => blockedPlayer.setBlocked(false));
		this.#blockList = [];
	}

	/**
	 * @type {GameModel}
	 */
	getGameModel() {
		return this.#gameModel;
	}

}
