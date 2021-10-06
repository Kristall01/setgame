import GameView from "/game/view/GameView.js";
import EventCollector from "/game/model/EventCollector.js";
export default class ModelEventHandler {

	/**
	 * @type {GameView}
	 */
	#gameView;

	/**
	 * @param {EventCollector} collector 
	 * @param {GameView} gameView
	 */
	constructor(gameView, collector) {

		collector.addEventListener("putCard", (event) => {
			let {cardID, params} = event.detail;
			gameView.addCard(cardID, params);
		});

		collector.addEventListener("removeCard", (event) => {
			let {cardID} = event.detail;
			gameView.removeCard(cardID);
		});

		collector.addEventListener("addPlayer", (event) => {
			let {playerID, nickname} = event.detail;
			gameView.addPlayer(playerID, nickname);
		});
		
		collector.addEventListener("playerActiveState", (event) => {
			let {playerID, state} = event.detail;
			gameView.setPlayerActive(playerID, state);
		});

		collector.addEventListener("playerBlockedState", (event) => {
			let {playerID, state} = event.detail;
			gameView.setPlayerBlocked(playerID, state)
		});

		collector.addEventListener("cardActiveState", (event) => {
			let {cardID, state} = event.detail;
			gameView.setCardActive(cardID, state);
		});

		collector.addEventListener("updatePakliSize", (event) => {
			let {count} = event.detail;
			gameView.updatePakliSize(count);
		});

		collector.addEventListener("updateScore", (event) => {
			let {playerID, score} = event.detail;
			gameView.updatePlayerScore(playerID, score);
		});

		collector.addEventListener("gameOver", (event) => {
			gameView.callGameOver(event.detail);
		});

		collector.addEventListener("message", (event) => {
			let {text} = event.detail;
			gameView.logMessage(text);
		});

		collector.addEventListener("flashCards", (event) => {
			let {cardIds} = event.detail;
			for(let card of cardIds) {
				gameView.flashCard(card);
			}
		});

		collector.addEventListener("flashCard", (event) => {
			gameView.flashCard(event.detail);
		});

		collector.addEventListener("removeplayer", (event) => {
			let {playerID, score} = event.detail;
			gameView.removePlayer(playerID);
		});

		collector.addEventListener("updateUi", (event) => {
			let {uiElement, status} = event.detail;
			gameView.updateUi(uiElement, status);
		});

		collector.addEventListener("chat", (event) => {
			let {message} = event.detail;
			gameView.logChatMessage(message);
		});

		collector.addEventListener("modal", (event) => {
			let {message} = event.detail;
			gameView.showModalMessage(message);
		});

		collector.addEventListener("disconnected", (event) => {
			let {reason} = event.detail;
			gameView.showModalMessage(reason);
			gameView.modalLocked = true;
		});
	}

}
