import PlayerList from "/game/model/PlayerList.js";

export default class Player {

	/**
	 * @type {Number}
	 */
	#score = 0;

	/**
	 * @type {Number}
	 */
	#ID;

	/**
	 * @type {String}
	 */
	#nickname;

	/**
	 * @type {PlayerList}
	 */
	#playerList;

	/**
	 * @type {Boolean}
	 */
	#blocked = false;

	/**
	 * @type {Boolean}
	 */
	#active = false;

	/**
	 * @param {PlayerList} playerList 
	 * @param {*} nickname 
	 * @param {Number} ID
	 */
	constructor(playerList, nickname, ID) {
		this.#playerList = playerList;
		this.#nickname = nickname;
		this.#ID = ID;
	}

	/**
	 * @returns {Number}
	 */
	getID() {
		return this.#ID;
	}

	/**
	 * @returns {String}
	 */
	getNickname() {
		return this.#nickname;
	}

	/**
	 * @returns {PlayerList}
	 */
	getContainer() {
		return this.#playerList;
	}

	/**
	 * @returns {Boolean}
	 */
	isActive() {
		return this.#active;
	}

	/**
	 * @param {Boolean} state 
	 */
	setActiveState(state) {
		if(state != this.#active) {
			this.#active = state;
			this.#playerList.getGameModel().broadcastEvent("playerActiveState", {playerID: this.getID(), state: state});
		}
	}

	/**
	 * @returns {Boolean}
	 */	
	isBlocked() {
		return this.#blocked;
	}

	/**
	 * @param {Boolean} state 
	 */
	setBlocked(state) {
		if(state != this.#blocked) {
			this.#blocked = state;
			this.#playerList.getGameModel().broadcastEvent("playerBlockedState", {playerID: this.getID(), state: state});
		}
	}

	getScore() {
		return this.#score;
	}

	#updateScore() {
		this.#playerList.getGameModel().broadcastEvent("updateScore", {playerID: this.getID(), score: this.getScore()});
	}

	increaseScore() {
		++this.#score;
		this.#updateScore();
	}

	decreaseScore() {
		--this.#score;
		this.#updateScore();
	}

}