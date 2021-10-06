import Parameter from "/game/model/card_params/Parameter.js"

export default class EnumNumber extends Parameter {
	
	/**
	 * @param {String} label 
	 * @param {Number} ID
	 */
	constructor(label, ID) {
		super(label, ID);
	}

	//STATICS ************************************

	static NUMBER_1 = new EnumNumber("1", 0);
	static NUMBER_2 = new EnumNumber("2", 1);
	static NUMBER_3 = new EnumNumber("3", 2);

	/**
	 * @type {Array<EnumNumber>}
	 */
	static #constants = [this.NUMBER_1, this.NUMBER_2, this.NUMBER_3];

	/**
	 * @param {Number} ID
	 * @returns {EnumNumber}
	 */
	static valueOf(ID) {
		return this.#constants[ID];
	}

}