import PlayerList from "/game/model/PlayerList.js";
import EventCollector from "/game/model/EventCollector.js";
import Card from "/game/model/Card.js";
import Settings from "/game/model/Settings.js";
import CardRegistry from "/game/model/CardRegistry.js";
import MultiSetOperation from "/game/model/MultiSetOperation.js";
import SingleSetOperation from "/game/model/SingleSetOperation.js";

export default class GameModel extends EventTarget {

	/**
	 * @type {Settings}
	 */
	#settings;

	/**
	 * @type {PlayerList}
	 */
	#playerList;

	/**
	 * @type {Array<Card>}
	 */
	#tableCards = [];

	/**
	 * @type {SetOperation}
	 */
	#setOperation;

	/**
	 * @type {CardRegistry}
	 */
	#cardRegistry;

	/**
	 * @type {Array<Card>}
	 */
	#pakli;

	/**
	 * @type {Boolean}
	 */
	#gameIsOver;

	#startTime = Date.now();

	/**
	 * @param {EventCollector} [collector] 
	 * @param {Settings} settings
	 */
	constructor(settings, collector) {
		super();

		if(collector) {
			collector.registerFunctions(this);
		}

		this.#settings = settings;
		this.#cardRegistry = new CardRegistry(this);
		this.#playerList = new PlayerList(this);

		this.#pakli = Card.createPakli(settings.pakliConfig, this.#cardRegistry);
		console.log("pakli lapjai: ",this.#pakli);

		if(settings.players.length == 1) {
			let p = this.#playerList.addPlayer(settings.players[0]);
			this.#setOperation = new SingleSetOperation(this, p);
		}
		else {
			for(let i = 0; i < settings.players.length; ++i) {
				this.#playerList.addPlayer(settings.players[i]);
			}
			this.#setOperation = new MultiSetOperation(this);
		}
		this.pullCards(12);
		this.broadcastEvent("updateUi", {uiElement: "showset", status: settings.cheatShowSet})
		this.broadcastEvent("updateUi", {uiElement: "anyset", status: settings.cheatAnySet})
		this.broadcastEvent("updateUi", {uiElement: "pullcard", status: !settings.atuoAddCards})
		this.broadcastEvent("updateUi", {uiElement: "chatwindow", status: false})
	}

	/**
	 * @returns {Array<Array<Card>>}
	 */
	findAllSets() {
		let r = [];
		for(let a = 0; a < this.#tableCards.length; ++a) {
			for(let b = a+1; b < this.#tableCards.length; ++b) {
				for(let c = b+1; c < this.#tableCards.length; c++) {
					let testArray = [this.#tableCards[a], this.#tableCards[b],this.#tableCards[c]];
					if(Card.isSetCombination(testArray)) {
						r.push(testArray);
					}
				}
			}
		}
		return r;
	}

	resetGame() {
		this.broadcastMessage("Ez a funkció offline játékban nem használható.");
	}

	#pullCard() {
		let card = this.#pakli.pop();
		this.broadcastEvent("updatePakliSize", {count: this.#pakli.length});
		this.#tableCards.push(card);
		this.broadcastEvent("putCard", {cardID: card.getID(), params: card.getParamsText()});
	}

	/**
	 * @param {Number} N 
	 */
	pullCards(N) {
		let pullCount = Math.min(N, this.#pakli.length);
		for(let i = 0; i < pullCount; ++i) {
			this.#pullCard();
		}
		let pakliEmpty = true;
		let allSets = [];
		if(this.#settings.atuoAddCards) {
			while(true) {
				allSets = this.findAllSets(this.#tableCards);
				pakliEmpty = this.#pakli.length == 0;
				if(allSets.length == 0 && !pakliEmpty) {
					for(let localI = 0; localI < 3; ++localI) {
						this.#pullCard();
					}
				}
				else {
					break;
				}
			}
		}
		else {
			allSets = this.findAllSets(this.#tableCards);
			pakliEmpty = this.#pakli.length == 0;
		}
		if(pakliEmpty && allSets.length == 0) {
			this.broadcastEvent("gameOver", {scores: this.#playerList.getScores(), time: Date.now() - this.#startTime});
		}
	}

	/**
	 * @param {Array<Card>} cards 
	 */
	removeCardsFromTable(cards) {
		cards.forEach(card => {
			let newTable = this.#tableCards.filter(tableCard => tableCard != card);
			if(newTable.length == this.#tableCards.length) {
				throw Error("Ez a kártya nincs az asztalon.");
			}
			this.#tableCards = newTable;
			this.broadcastEvent("removeCard", {cardID: card.getID()});
		});
	}

	/**
	 * @returns {PlayerList}
	 */
	getPlayerList() {
		return this.#playerList;
	}

	/**
	 * @returns {CardRegistry}
	 */
	getCardRegistry() {
		return this.#cardRegistry;
	}

	/**
	 * @param {String} eventID 
	 * @param {Object} detail 
	 */
	broadcastEvent(eventID, detail) {
		let allEvent = new CustomEvent("*", {detail: detail});
		Object.defineProperty(allEvent, "getEventID", ()=>eventID);
		this.dispatchEvent(new CustomEvent(eventID, {detail: detail}));
		this.dispatchEvent(allEvent);
	}

	/* COMS INTERFACE IMPLEMENTED METHODS */

	showSet() {
		if(!this.#settings.cheatShowSet) {
			this.broadcastMessage("Set keresés ki van kapcsolva.");
			return;
		}
		let setList = this.findAllSets();
		if(setList.length == 0) {
			this.broadcastMessage("Nincs set a leosztásban.");
		}
		else {
			let index = Math.floor(Math.random()*setList.length);
			let setCombo = setList[index];
			setCombo.forEach(setCard => setCard.flash());
		}
	}

	anySet() {
		if(!this.#settings.cheatAnySet) {
			this.broadcastMessage("Set mutatás ki van kapcsolva.");
			return;
		}
		let setList = this.findAllSets();
		if(setList.length == 0) {
			this.broadcastMessage("Nincs set a leosztásban.");
		}
		else {
			this.broadcastMessage("Van set a leosztásban.");
		}
	}

	getCards() {
		if(this.#settings.atuoAddCards) {
			this.broadcastMessage("A kézi kártyahúzás ki van kapcsolva.");
			return;
		}
		if(this.#pakli.length == 0) {
			this.broadcastMessage("Nincs több kártya a pakliban.");
			return;
		}
		else {
			this.pullCards(3);
		}
	}

	showSetEnabled() {
		return this.#settings.cheatShowSet;
	}

	anySetEnabled() {
		return this.#settings.cheatAnySet;
	}

	autopullEnabled() {
		return this.#settings.atuoAddCards;
	}

	broadcastMessage(text) {
		this.broadcastEvent("message", {text: text});//"Nincs "+cardID+" ID-s kártya az asztalon.");
	}

	/**
	 * @param {Number} cardID 
	 */
	doCardAction(cardID) {
		let card = this.#cardRegistry.getCardByID(cardID);
		if(!card)
			return;
		if(!this.#tableCards.includes(card)) {
			this.broadcastMessage("Nincs "+cardID+" ID-s kártya az asztalon.");
			return;
		}
		this.#setOperation.doCardAction(card);
	}
	
	/**
	 * @param {Number} playerID 
	 */
	doPlayerAction(playerID) {
		let player = this.#playerList.getPlayerByID(playerID);
		if(!player)
			return;
		this.#setOperation.doPlayerAction(player);
	}

}