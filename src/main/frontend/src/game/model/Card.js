import EnumNumber from "/game/model/card_params/EnumNumber.js";
import EnumFigure from "/game/model/card_params/EnumFigure.js";
import EnumColor from "/game/model/card_params/EnumColor.js";
import EnumFillevel from "/game/model/card_params/EnumFillevel.js";
import Parameter from "/game/model/card_params/Parameter.js";
import CardRegistry from "/game/model/CardRegistry.js";

export default class Card {
	
	/**
	 * @type {Array<Parameter>}
	 */
	#params = [];

	#paramsText

	/**
	 * @type {Number}
	 */
	#ID;

	/**
	 * @type {CardRegistry}
	 */
	#cardRegistry;

	/**
	 * @type {Boolean}
	 */
	#selected = false;

	/**
	 * @param {CardRegistry} cardRegistry
	 * @param {String} initParams 
	 * @param {Number} cardID 
	 */
	constructor(cardRegistry, initParams, cardID) {
		this.#cardRegistry = cardRegistry;
		this.#ID = cardID;
		this.#paramsText = initParams;

		let args = undefined;
		if((initParams instanceof String || (typeof initParams == "string")) && initParams.length == Card.PARAMETER_SPACE.length) {
			args = [];
			for(let i = 0; i < initParams.length; ++i) {
				args[i] = parseInt(initParams[i]);
			}
		}
		if(args == undefined) {
			throw Error("unknown argument allocation");
		}
		for(let i = 0; i < Card.PARAMETER_SPACE.length; ++i) {
			let paramSpace = Card.PARAMETER_SPACE[i];
			let param = paramSpace.valueOf(parseInt(args[i]));
			if(!param) {
				throw "invalid paramSpace constant";
			}
			this.#params.push(param);
		}
	}

	/**
	 * @returns {Parameter}
	 * @param {Number} paramID 
	 */
	getParameterByID(paramID) {
		return this.#params[paramID];
	}

	getParamsText() {
		return this.#paramsText;
	}

	flash() {
		this.#cardRegistry.getGameModel().broadcastEvent("flashCard", this.getID());
	}

	/**
	 * @returns {Boolean}
	 */
	isSelected() {
		return this.#selected;
	}

	/**
	 * @param {Boolean} state 
	 */
	setSelected(state) {
		if(state != this.#selected) {
			this.#selected = state;
			this.#cardRegistry.getGameModel().broadcastEvent("cardActiveState", {cardID: this.getID(), state: state});
		}
	}

	/**
	 * @returns {Number}
	 */
	getID() {
		return this.#ID;
	}

/* STATIC FUNCTIONS ##################################################################################*/

	/**
	 * @param {Array<Card>} cards 
	 * @param {Number} paramID
	 * @returns {boolean}
	 */
	static allSameParameter(cards, paramID) {
		if(cards.length == 0)
			return true;
		let first = cards[0].getParameterByID(paramID).getID();
		for(let i = 1; i < cards.length; ++i) {
			if(cards[i].getParameterByID(paramID).getID() != first)
				return false;
		}
		return true;
	}
	
	/**
	 * @param {Array<Card>} cards 
	 * @param {Number} paramID
	 * @returns {boolean}
	 */
	static allDiffParameter(cards, paramID) {
		for(let i = 0; i < cards.length; ++i) {
			for(let j = i+1; j < cards.length; ++j) {
				if(cards[i].getParameterByID(paramID).getID() == cards[j].getParameterByID(paramID).getID()) {
					return false;
				}
			}
		}
		return true;
	}
	
	/**
	 * @param {Array<Card>} cards 
	 * @returns {boolean}
	 */
	static isSetCombination(cards) {
		let i = 0;
		for(; i < this.PARAMETER_SPACE.length; ++i) {
			if(!(Card.allSameParameter(cards, i) || Card.allDiffParameter(cards, i))) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 
	 * @param {Array<Card>} array 
	 */
	static #shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	/**
	 * @param {Array<Boolean>} pakliConfig
	 * @param {CardRegistry} cardRegistry
	 * 
	 * @returns {Array<Card>}
	 */
	static createPakli(pakliConfig, cardRegistry) {
		if(pakliConfig.length != this.PARAMETER_SPACE.length) {
			throw Error("unknown pakli allocation");
		}
		let ranges = [];
		for(let i = 0; i < pakliConfig.length; ++i) {
			ranges.push(pakliConfig[i] ? [0,1,2] : [0]);
		}
		let pakli = [];
		for(let ni = 0; ni < ranges[0].length; ++ni) {
			for(let fi = 0; fi < ranges[1].length; ++fi) {
				for(let ci = 0; ci < ranges[2].length; ++ci) {
					for(let fli = 0; fli < ranges[3].length; ++fli) {
						let buffer = ""+ranges[0][ni]+ranges[1][fi]+ranges[2][ci]+ranges[3][fli];
						pakli.push(cardRegistry.createCard(buffer));
					}
				}
			}
		}
		Card.#shuffle(pakli);
		return pakli;
	}
	
	/**
	 * @type {Array}
	 */
	static PARAMETER_SPACE = [EnumNumber, EnumFigure, EnumColor, EnumFillevel];

}
