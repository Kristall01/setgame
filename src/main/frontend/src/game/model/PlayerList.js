import GameModel from "/game/model/GameModel.js";
import Player from "/game/model/Player.js";

export default class PlayerList {

	//FIELD DECLARATIONS
		/**
		 * @type {Map<Number, Player>}
		 */
		#playerMap = new Map();

		/**
		 * @type {GameModel}
		 */
		#model;

		/**
		 * @param {Number}
		 */
		#nextID = 0;

	//FIELD DECLARATIONS END

	/**
	 * @param {GameModel} gameModel
	 */
	constructor(gameModel) {
		this.#model = gameModel;
	}

	/**
	 * @returns {Map<string,number>}
	 */
	getScores() {
		let scoreList = new Map();
		this.#playerMap.forEach((value, key) => {
			scoreList.set(value.getNickname(), value.getScore());
		});
		return scoreList;
	}

	/**
	 * @returns {Number}
	 */
	getSize() {
		return this.#playerMap.size;
	}

	/**
	 * @returns {Number}
	 */
	getNextID() {
		return ++this.#nextID;
	}

	/**
	 * @param {String} nickname 
	 * @returns {Player}
	 */
	addPlayer(nickname) {
		let pID = this.getNextID();
		let p = new Player(this, nickname, pID);
		this.#playerMap.set(pID, p);

		this.#model.broadcastEvent("addPlayer", {playerID: pID, nickname: nickname});
		return p;
	}

	/**
	 * @returns {Player}
	 * @param {Number} playerID
	 */
	getPlayerByID(playerID) {
		return this.#playerMap.get(playerID) || null;
	}

	/**
	 * @returns {GameModel}
	 */
	getGameModel() {
		return this.#model;
	}

}