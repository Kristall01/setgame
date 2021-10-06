import GameView from "/game/view/GameView.js"

export default class DomEventHandler {

	/**
	 * @type {GameView}
	 */
	gameView;

	/**
	 * @param {GameView} gameView 
	 */
	constructor(gameView) {
		this.gameView = gameView;

		gameView.playerList.addEventListener("click", event => this.handlePlayerClick(event));
		gameView.cardList.addEventListener("click", event => this.handleCardClick(event));
		gameView.messageList.addEventListener("click", event => this.handleMessageClick(event));
		gameView.restartGameBtn.addEventListener("click", event => this.handleRestartGame(event));
		gameView.anySetBtn.addEventListener("click", () => this.gameView.gameModel.anySet());
		gameView.showSetBtn.addEventListener("click", () => this.gameView.gameModel.showSet());
		gameView.pullCardBtn.addEventListener("click", () => this.gameView.gameModel.getCards());
		gameView.pullCardLargeBtn.addEventListener("click", event => this.gameView.gameModel.getCards(event));
		gameView.menuopener.addEventListener("click", event => this.gameView.endSession());
		gameView.resetGameBtn.addEventListener("click", event => this.gameView.gameModel.resetGame())
		gameView.chatForm.addEventListener("submit", event => this.handleChatSendMessage(event));
		//gameView.modalClose.addEventListener("click", event => this.gameView.showModalMessage(null));
	}

	handleChatSendMessage(event) {
		event.preventDefault();
		let inputElement = event.target.querySelector("input[type=text]");
		let value = inputElement.value;
		inputElement.value = "";
		this.gameView.gameModel.sendChatMessage(value);
	}

	#delegateElement(event, matcher) {
		if(event.target.matches(matcher)) {
			return event.target;
		}
		else {
			if(!event.target.matches(matcher+" *")) {
				return null;
			}
			let node = event.target;
			while(!node.matches(matcher)) {
				node = node.parentElement;
			}
			return node;
		}
	}

	handleRestartGame() {
		let delegated = this.#delegateElement(event, "#restartgamebtn");
		if(!delegated)
			return;
		if(delegated.matches(".disabled"))
			return;
		this.gameView.restartGame();
	}

	handlePlayerClick(event) {
		let playerNode = this.#delegateElement(event, ".player");
		if(!playerNode)
			return;
		this.gameView.gameModel.doPlayerAction(parseInt(playerNode.dataset["playerid"]));
	}

	handleCardClick(event) {
		let cardNode = this.#delegateElement(event, ".card");
		if(!cardNode)
			return;
		this.gameView.gameModel.doCardAction(parseInt(cardNode.dataset["cardid"]));
	}

	handleMessageClick(event) {
		let messageNode = this.#delegateElement(event, ".message");
		if(!messageNode)
			return;
		messageNode.remove();
	}

	handleGameoverReturn(event) {

	}

}
