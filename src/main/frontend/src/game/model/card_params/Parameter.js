export default class Parameter {

	/**
	 * @type {Number}
	 */
	#ID

	/**
	 * @type {String}
	 */
	#label;

	/**
	 * 
	 * @param {String} label 
	 * @param {Number} ID
	 */
	constructor(label, ID) {
		this.#label = label;
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
	label() {
		return this.#label;
	}

	/**
	 * @param {Number} ID 
	 * @returns {Parameter}
	 */
	static valueOf(ID) {
		throw Error("unimplemented method Parameter::valueOf(ID)");
	}

}