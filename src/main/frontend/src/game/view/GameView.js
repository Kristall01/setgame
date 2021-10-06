import GameModel from "/game/model/GameModel.js";
import Settings from "/game/model/Settings.js";
import EventCollector from "/game/model/EventCollector.js";
import { convertToHtml } from "/textconverter.js";

import DomEventHandler from "/game/view/DomEventHandler.js";
import ModelEventHandler from "/game/view/ModelEventHandler.js";

import Menu from "/menu/Menu.js";
import OnlineModel from "/game/onlinemodel/OnlineModel.js";

export default class GameView {

	/**
	 * @type {Menu}
	 */
	menu;

	/**
	 * @type {GameModel}
	 */
	gameModel;

	/**
	 * @type {ModelEventHandler}
	 */
	modelEventHandler;

	/**
	 * @type {DomEventHandler}
	 */
	domEventHandler;

	/**
	 * @type {Settings}
	 */
	settings;

	modalLocked = false;

	playerList = document.getElementById("players");
	cardList = document.getElementById("gametable");
	anySetBtn = document.getElementById("btn-anyset");
	showSetBtn = document.getElementById("btn-showset");
	messageList = document.getElementById("messagelist");
	pullCardBtn = document.getElementById("btn-pullcard");
	pullCardLargeBtn = document.getElementById("pakliparent").querySelector(".card");
	menuopener = document.getElementById("menuopener");
	restartGameBtn = document.getElementById("restartgamebtn");
	resetGameBtn = document.getElementById("btn-resetgame");
	chatForm = document.getElementById("chat-form");
	chatWindow = document.getElementById("chat-window");
	modalWindow = document.getElementById("modal-layer");
	modalText = document.getElementById("modal-text");
	buttonLevel = document.getElementById("button-level");
	//modalClose = document.getElementById("modal-close");

	eventCollector = new EventCollector();

	/**
	 * @param {Menu} menu
	 */
	constructor(menu) {
		this.menu = menu;
		this.modelEventHandler = new ModelEventHandler(this, this.eventCollector);
		this.domEventHandler = new DomEventHandler(this);

		document.getElementById("server-address-input").value = location.host;
	}


	startMultiGame(data) {
		this.playerList.innerHTML = "";
		this.updatePakliSize("?");
		this.cardList.innerHTML = "";
		this.messageList.innerHTML = "";

		this.gameModel = new OnlineModel(data, this.eventCollector);
	}

	getElementByName(name) {
		switch(name) {
			case("anyset"): {
				return this.anySetBtn;
			}
			case "showset": {
				return this.showSetBtn;
			}
			case "pullcard": {
				return this.pullCardBtn;
			}
			case "resetgame": {
				return this.resetGameBtn;
			}
			case "chatwindow": {
				return this.chatWindow;
			}
			default: {
				return null;
			}
		}
	}

	updateUi(name, status) {
		let e = this.getElementByName(name);
		if(e !== null) {
			if(status) {
				e.classList.remove("disabled");
				if(e.classList.contains("hideable")) {
					e.classList.remove("dnone");
				}
			}
			else {
				e.classList.add("disabled");
				if(e.classList.contains("hideable")) {
					e.classList.add("dnone");
				}
			}
		}
	}

	/**
	 * @param {Settings} settings 
	 * 
	 */
	startGame(settings) {
		this.settings = settings;

		if(!this.sessionScores) {
			this.sessionScores = new Map();
			settings.players.forEach(name => this.sessionScores.set(name, 0));
		}

		this.playerList.innerHTML = "";
		this.updatePakliSize("?");
		this.cardList.innerHTML = "";
		this.messageList.innerHTML = "";
		this.gameModel = new GameModel(settings, this.eventCollector);

		/*
		if(!this.gameModel.anySetEnabled()) {
			this.anySetBtn.classList.add("disabled");
		}
		if(!this.gameModel.showSetEnabled()) {
			this.showSetBtn.classList.add("disabled");
		}
		if(this.gameModel.autopullEnabled()) {
			this.pullCardBtn.classList.add("disabled");
		}
		*/


		if(settings.players.length > 1) {
			this.restartGameBtn.classList.remove("disabled");
		}
		else {
			this.restartGameBtn.classList.add("disabled");
		}
	}

	/**
	 * @returns {GameModel}
	 */
	getGameModel() {
		return this.gameModel;
	}

	flashCard(cardID) {
		let cardNode = this.getCardNodeByID(cardID);
		cardNode.classList.add("flash");
		let taskID = cardNode.getAttribute("flashtaskid");
		if(taskID) {
			clearTimeout(taskID);
		}
		taskID = setTimeout(() => {
			cardNode.classList.remove("flash");
			cardNode.removeAttribute("flashtaskid");
		}, 2000);
		cardNode.setAttribute("flashtaskid", taskID);
	}

	addCard(cardID, params) {
		let cardNode = document.createElement("div");
		cardNode.dataset.cardid = cardID;
		cardNode.setAttribute("id", "card-"+cardID);
		cardNode.classList.add("card");
		let cardFigureCount = parseInt(params[0])+1;
		let properties = [null, "shape", "color", "fill"]
		for(let cardFigureI = 0; cardFigureI < cardFigureCount; ++cardFigureI) {
			let figureSvg = document.createElement("svg");
			figureSvg.setAttribute("viewbox", "-2 -2 54 104");
			figureSvg.appendChild(document.createElement("path"));
			for(let i = 1; i < properties.length; ++i) {
				cardNode.classList.add(properties[i]+parseInt(params[i]));
			}
			cardNode.innerHTML += figureSvg.outerHTML;
		}
		this.cardList.appendChild(cardNode);
	}

	#setPlayerClass(playerID, state, className) {
		let classes = this.getPlayerNodeByID(playerID).classList;
		if(state) {
			classes.add(className);
		}
		else {
			classes.remove(className);
		}

	}

	setPlayerActive(playerID, state) {
		this.#setPlayerClass(playerID, state, "active");
	}

	setCardActive(cardID, state) {
		let classes = this.getCardNodeByID(cardID).classList;
		if(state) {
			classes.add("active");
		}
		else {
			classes.remove("active");
		}
	}

	setPlayerBlocked(playerID, state) {
		this.#setPlayerClass(playerID, state, "blocked");
	}

	getCardNodeByID(cardID) {
		return document.getElementById("card-"+cardID);
	}

	getPlayerNodeByID(playerID) {
		return document.getElementById("player-"+playerID);
	}

	removeCard(cardID) {
		this.getCardNodeByID(cardID).remove();
	}

	updatePlayerScore(playerID, score) {
		let playerNode = this.getPlayerNodeByID(playerID);
		let playerName = playerNode.querySelector(".nametag").innerText;
		playerNode.querySelector(".score").innerText = score;
	}

	addPlayer(playerID, nickname) {
		let playerElement = document.createElement("div");
		playerElement.dataset.nickname = nickname;
		playerElement.dataset.playerid = playerID;
		playerElement.classList.add("player");
		playerElement.setAttribute("id", "player-"+playerID);

			let nameTag = document.createElement("span");
			nameTag.innerText = nickname;
			nameTag.classList.add("nametag");
			playerElement.appendChild(nameTag);

			let scoreTag = document.createElement("span");
			scoreTag.innerText = "0";
			scoreTag.classList.add("score");
			playerElement.appendChild(scoreTag);
		this.playerList.appendChild(playerElement);

		this.updatePlayerScore(playerID, 0);
	}

	removePlayer(playerID) {
		this.getPlayerNodeByID(playerID).remove();
	}

	logChatMessage(message) {
		let chatLogElement = document.getElementById("chat-log");
		if(message == "\0") {
			chatLogElement.innerHTML = "";
			return;
		}
		let msgEntry = document.createElement("div");
		chatLogElement.appendChild(msgEntry);
		msgEntry.outerHTML = `<div class="chat-message-entry">${convertToHtml(message)}</div>`;
		chatLogElement.scrollTop = chatLogElement.scrollHeight;
	}

	showModalMessage(text/*, button = false*/) {
		if(this.modalLocked) {
			return;
		}
		if(!text) {
			this.modalWindow.classList.add("dnone");
			return;
		}
		this.modalText.innerText = text;


		/*
		if(button) {
			this.buttonLevel.classList.remove("dnone");
		}
		else {
			this.buttonLevel.classList.add("dnone");
		}
		*/

		/*
		let entries = Object.entries(buttons);
		if(entries.length == 0) {
			this.buttonLevel.classList.add("dnone");
		}
		else {
			this.buttonLevel.classList.remove("dnone");

			buttons.forEach(([key, name]) => {});
			let button = document.createElement("div");
			this.buttonLevel.appendChild(button);
			button.outerHTML = `<div class="button"></div>`;
		}
		*/
		this.modalWindow.classList.remove("dnone");
	}

	logMessage(text) {
		let messageNode = document.createElement("div");
		let randomID = "message-"+Date.now()+Math.floor(Math.random()*10000);
		messageNode.setAttribute("id", randomID);
		messageNode.classList.add("message");

			let spanNode = document.createElement("span");
			messageNode.appendChild(spanNode);
			spanNode.innerHTML = convertToHtml(text);

		this.messageList.appendChild(messageNode);
		setTimeout(() => {
			let localNode = document.getElementById(randomID);
			if(!localNode)
				return;
			messageNode.classList.add("fade");
			setTimeout(() => {
				let localLocalnode = document.getElementById(randomID);
				if(localLocalnode)
					localLocalnode.remove();
			}, 1000);
		}, 3000);
	}

	updatePakliSize(amount) {
		this.pullCardLargeBtn.innerHTML = amount;
	}

	callGameOver(results) {

		let scores = results.scores;

		let scoreTable = document.getElementById("finalscores");

		scores.forEach((value, key) => {
			let scoreNodeContent = `<td>${key}</td><td>${this.sessionScores.get(key)}</td><td>${value}</td>`;
			let scoreNode = document.createElement("tr");
			scoreNode.innerHTML = scoreNodeContent;

			scoreTable.appendChild(scoreNode);

			let currentScore = this.sessionScores.get(key);
			let newScore = currentScore + value;
			this.sessionScores.set(key, newScore);
		});

		if(scores.size > 1) {
			this.menu.saveMultiStat(scores);
		}
		else {
			scores.forEach((value, key) => {
				if(this.menu.settings.pakliConfig[3]) {
					this.menu.save4State(key, results.time);
				}
				else {
					this.menu.save3State(key, results.time);
				}
			});
		}

		let filter = document.getElementById("gameoverfilter");
		filter.classList.remove("hidden");
		let d = new Date(results.time);
		let min = d.getMinutes();
		if(min < 10)
			min = "0"+min;
		let sec = d.getSeconds();
		if(sec < 10)
			sec = "0"+sec;
		filter.querySelector(".time").innerText = `${min}:${sec}`;
	}

	hideGameOver() {
		let filter = document.getElementById("gameoverfilter");
		filter.classList.add("hidden");
		filter.querySelector("tbody").innerHTML = "";
	}

	endSession() {
		this.sessionScores = null;
		this.hideGameOver();
		this.menu.toggleMode();
	}

	restartGame() {
		this.hideGameOver();
		this.startGame(this.settings);
	}

}
