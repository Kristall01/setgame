import Parameter from "/game/model/card_params/Parameter.js"

export default class EnumFigure extends Parameter {

	/**
	 * @param {String} label 
	 * @param {Number} ID
	 */
	constructor(label, ID) {
		super(label, ID);
	}

	//STATICS ************************************

	static FIGURE_OVAL = new EnumFigure("oval", 0);
	static FIGURE_WAVY = new EnumFigure("wavy", 1);
	static FIGURE_DIAMOND = new EnumFigure("diamond", 2);

	/**
	 * @type {Array<EnumFigure>}
	 */
	static #constants = [this.FIGURE_OVAL, this.FIGURE_WAVY, this.FIGURE_DIAMOND];

	/**
	 * @param {Number} ID
	 * @returns {EnumFigure}
	 */
	static valueOf(ID) {
		return this.#constants[ID];
	}

}