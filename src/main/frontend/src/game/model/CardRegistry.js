import Card from "/game/model/Card.js";
import GameModel from "/game/model/GameModel.js";

export default class CardRegistry {

	#nextID = 0;
	#cardMap = new Map();

	/**
	 * @type {GameModel}
	 */
	#gameModel;

	/**
	 * @param {GameModel} gameModel
	 */
	constructor(gameModel) {
		this.#gameModel = gameModel;
	}

	/**
	 * @returns {GameModel}
	 */
	getGameModel() {
		return this.#gameModel;
	}

	createCard(initParam) {
		let id = this.#getNextID();
		let c = new Card(this, initParam, id);
		this.#cardMap.set(id, c);
		return c;
	}

	getCardByID(cardID) {
		return this.#cardMap.get(cardID);
	}

	#getNextID() {
		return ++this.#nextID;
	}

}