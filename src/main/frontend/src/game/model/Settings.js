import Player from "/game/model/Player.js";

export default class Settings {

	/**
	 * @type {Array<Player>}
	 */
	players = ["player-1"];

	/**
	 * @type {Boolean}
	 */
	cheatAnySet = false;

	/**
	 * @type {Boolean}
	 */
	cheatShowSet = false;

	/**
	 * @type {Boolean}
	 */
	atuoAddCards = false;

	/**
	 * @type {Array<Boolean>}
	 */
	pakliConfig = [true, true, true, false];

}