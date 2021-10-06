import Parameter from "/game/model/card_params/Parameter.js"

export default class EnumFilllevel extends Parameter {

	/**
	 * @param {String} label
	 * @param {Number} ID
	 */
	constructor(label, ID) {
		super(label, ID);
	}

	//STATICS ************************************

	static FILLEVEL_FULL = new EnumFilllevel("full", 0);
	static FILLEVEL_STRIPPED = new EnumFilllevel("stripped", 1);
	static FILLEVEL_EMPTY = new EnumFilllevel("empty", 2);

	/**
	 * @type {Array<EnumFilllevel>}
	 */
	static #constants = [this.FILLEVEL_FULL, this.FILLEVEL_STRIPPED, this.FILLEVEL_EMPTY];

	/**
	 * @param {Number} ID
	 * @returns {EnumFilllevel}
	 */
	static valueOf(ID) {
		return this.#constants[ID];
	}

}