import Parameter from "/game/model/card_params/Parameter.js"

export default class EnumColor extends Parameter {

	/**
	 * @param {String} label
	 * @param {Number} ID
	 */
	constructor(label, ID) {
		super(label, ID);
	}

	//STATICS ************************************

	static COLOR_RED = new EnumColor("red", 0);
	static COLOR_GREEN = new EnumColor("green", 1);
	static COLOR_PURPLE = new EnumColor("purple", 2);

	/**
	 * @type {Array<EnumColor>}
	 */
	static #constants = [this.COLOR_RED, this.COLOR_GREEN, this.COLOR_PURPLE];

	/**
	 * @param {Number} ID
	 * @returns {EnumColor}
	 */
	static valueOf(ID) {
		return this.#constants[ID];
	}

}