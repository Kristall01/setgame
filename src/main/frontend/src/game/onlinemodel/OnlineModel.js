import EventCollector from "/game/model/EventCollector.js";

export default class OnlineModel extends EventTarget {

	/**
	 * @type {WebSocket}
	 */
	connection;

	/**
	 * @param {string} username 
	 * @param {EventCollector} collector 
	 */
	constructor({address, username}, collector) {
		super();

		if(address.startsWith("http://")) {
			address = address.substr(7);
		}
		else if(address.startsWith("https://"))
			address = address.substr(7);
		else if(!address.startsWith("ws://")) {
			address = "ws://" + address;
		}

		collector.registerFunctions(this);

		this.broadcastEvent("modal", {message: "kapcsolódás..."});

		let s = null;
		try {
			s = new WebSocket(address+"/play/"+username);
		}
		catch(err) {
			this.broadcastEvent("modal", {message: "kapcsolódási hiba"});
			return;
		}
		s.addEventListener("close", closeEvent => {
			console.error("[WS CLOSE] connection closed",closeEvent);
			this.broadcastEvent("modal", {message: "megszakadt a kapcsolat"});
		});
		s.addEventListener("error", errorEvent => {
			console.warn("[WS ERROR] connection error",errorEvent);
			this.broadcastEvent("modal", {message: "kapcsolat hiba"});
		});
		s.addEventListener("open", openEvent => {

			console.log("[WS OPEN] opened connection");
			this.broadcastEvent("modal", {message: null});
		});
		s.addEventListener("message", messageEvent => this.handleMessage(messageEvent));

		this.connection = s;

		//window.magic = (text, command) => this.magic(text, command);
		window.packet = (type, cmd) => this.sendPacket(type,cmd);
	}

	resetGame() {
		this.sendPacket("resetgame");
	}

	broadcastMessage(text) {
		setTimeout(() => this.broadcastEvent("message", {text: text}), 1);
	}

	doPlayerAction(playerID) {
		console.log(playerID);
		this.broadcastMessage("Online módban nem kell játékost kiválasztani.");
	}

	magic(m, command) {
		this.sendPacket("magic", {magic: m, command: command});
	}

	/**
	 * @param {MessageEvent} messageEvent 
	 */
	handleMessage(messageEvent) {
		let packet = JSON.parse(messageEvent.data);
		let packetID = packet.packetID;
		let packetData = packet.packetData;
		this.broadcastEvent(packetID, packetData);
	}

	/**
	 * @param {string} eventID 
	 * @param {Object} detail 
	 */
	broadcastEvent(eventID, detail) {
		let allEvent = new CustomEvent("*", {detail: detail});
		Object.defineProperty(allEvent, "getEventID", ()=>eventID);
		this.dispatchEvent(new CustomEvent(eventID, {detail: detail}));
		this.dispatchEvent(allEvent);
	}

	getCards() {
		this.sendPacket("getcard")
	}

	anySet() {
		this.sendPacket("anyset")
	}

	showSet() {
		this.sendPacket("showset");
	}

	/*disabled() {
		this.broadcastMessage("Online módban ez a funkció nem elérhető.");
	}*/

	doCardAction(cardID) {
		this.sendPacket("cardaction", {cardID: cardID});
	}

	sendChatMessage(message) {
		this.sendPacket("chat", {message})
	}

	sendPacket(packetID, content) {
		let packetText = packetID;
		if(content !== undefined) {
			packetText += ';'+JSON.stringify(content);
		}
		else {
			packetText += ";{}";
		}
		if(this.connection.readyState === 1) {
			this.connection.send(packetText);
		}
		else {
			console.log("dropped packet "+packetText);
		}
	}

}
