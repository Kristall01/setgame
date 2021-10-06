import GameView from "/game/view/GameView.js";
import Settings from "/game/model/Settings.js";

export default class Menu {

	activeMenu = "menu-main";

	gameView;

	settings = new Settings();

	raceMode = false;

	constructor() {
		this.settings.atuoAddCards = false;
		this.settings.cheatAnySet = true;
		this.settings.cheatShowSet = true;
		this.settings.pakliConfig = [true,true,true,true];
		this.gameView = new GameView(this);

		this.switchMenu("menu-main");
		document.getElementById("menu").addEventListener("click", event => this.handleMenuClick(event));

		let switches = document.querySelectorAll(".toggleswitch input");
		switches.forEach(sw => sw.addEventListener("change", event => this.handleChangeSetting(event)))

		document.getElementById("start-game").addEventListener("click", () => this.startGame());
		document.getElementById("start-game-online").addEventListener("submit", (event) => this.startMultiGame(event));
		document.getElementById("playeradd-btn").addEventListener("click", (event) => this.addPlayerField(event));
		document.getElementById("playerinput-list").addEventListener("click", (event) => this.delegateRemovePlayer(event));

		this.updateScore3();
		this.updateScore4();
		this.updateScoreMulti();
	}

	addPlayerField(event) {
		if(event.target.matches(".disabled")) {
			return;
		}
		let e = document.getElementById("playerinput-list");
		let newNode = document.createElement("div");
		document.getElementById("playerinput-list").appendChild(newNode);
		let ch = e.querySelectorAll("div");
		newNode.outerHTML = `<div class="inputentry"><input type="text" value="player${ch.length}" placeholder="játékos neve"><i class="fas fa-times"></i></div>`;

		if(ch.length == 10) {
			event.target.classList.add("disabled");
		}
	}

	switchMenu(menuID) {
		document.getElementById(this.activeMenu).classList.remove("active");
		document.getElementById(menuID).classList.add("active");
		this.activeMenu = menuID;
	}

	delegateRemovePlayer(event) {
		let deleteButton = event.target;
		if(!deleteButton.matches(".fa-times")) {
			if(!deleteButton.matches(".fa-times *")) {
				return;
			}
			while(!deleteButton.matches(".fa-times")) {
				deleteButton = deleteButton.parentElement;
			}
		}
		while(!deleteButton.matches(".inputentry")) {
			deleteButton = deleteButton.parentElement;
		}
		deleteButton.remove();
		document.getElementById("playeradd-btn").classList.remove("disabled");
	}

	/**
	 * @param {HtmlInput} event 
	 */
	handleChangeSetting(event) {

		/**
		 * @type {HTMLInputElement}
		 */
		let element = event.target;

		let parsedValue = parseInt(element.value);

		switch(element.name) {
			case "gamemode": {
				if(parsedValue != this.raceMode) {
					this.raceMode = parsedValue;
					let openers = document.querySelectorAll("[data-menulink=menu-settings]");
					if(parsedValue) {
						openers.forEach(opener => {
							opener.classList.add("disabled");
						});
					}
					else {
						openers.forEach(opener => {
							opener.classList.remove("disabled");
						});
					}
				}
				break;
			}
			case "difficulty": {
				if(parsedValue) {
					this.settings.pakliConfig = [true,true,true,true];
				}
				else {
					this.settings.pakliConfig = [true,true,true,false];
				}
				break;
			}
			case "showset": { //settings.cheatAnySet <==> showset
				if(parsedValue) {
					this.settings.cheatAnySet = true;
				}
				else {
					this.settings.cheatAnySet = false;
				}
				break;
			}
			case "searchset": {
				if(parsedValue) {//settings.cheatShowSet <==> searchset
					this.settings.cheatShowSet = true;
				}
				else {
					this.settings.cheatShowSet = false;
				}
				break;
			}
			case "pullcard": {
				if(parsedValue) {
					this.settings.atuoAddCards = false;
				}
				else {
					this.settings.atuoAddCards = true;
				}
				break;
			}
		}
	}

	saveMultiStat(statMap) {
		let multi = localStorage.getItem("multi");
		if(!multi) {
			multi = "[]";
		}

		let stat = {};
		statMap.forEach((value, key) => {
			stat[key] = value;
		})

		multi = JSON.parse(multi);
		multi.push(stat);
		if(multi.length > 10) {
			multi.shift();
		}
		this.updateScoreMulti(multi);

		localStorage.setItem("multi", JSON.stringify(multi));
	}

	saveSingleState(itemName, key, time) {
		let items = localStorage.getItem(itemName);
		if(!items) {
			items = "[]";
		}
		items = JSON.parse(items);
		items.push({"user":key, "time":time});

		this.updateSingleScore(itemName, items);
		localStorage.setItem(itemName, JSON.stringify(items));
	}

	updateScore3(items) {
		this.updateSingleScore("single3", items);
	}

	createTimeString(time) {
		let d = new Date(time);
		let min = d.getMinutes();
		if(min < 10)
			min = "0"+min;
		let sec = d.getSeconds();
		if(sec < 10)
			sec = "0"+sec;
		return `${min}:${sec}`;
	}

	updateSingleScore(itemName, items) {
		if(!items) {
			items = localStorage.getItem(itemName);
			if(!items) {
				items = "[]";
			}
			items = JSON.parse(items);
		}
		let table = document.getElementById("table-scores-"+itemName);
		table.innerHTML = "";

		items.sort((e0, e1) => {
			return e0.time - e1.time;
		});

		let i = 0;
		items.forEach(record => {
			let asd = `<td>${++i}</td><td>${record.user}</td><td>${this.createTimeString(record.time)}</td>`;
			let trElement = document.createElement("tr");
			trElement.innerHTML = asd;
			table.appendChild(trElement);
		});
	}

	updateScore4(items) {
		this.updateSingleScore("single4", items);
	}

	updateScoreMulti(items) {
		if(!items) {
			items = localStorage.getItem("multi");
			if(!items) {
				items = "[]";
			}
			items = JSON.parse(items);
		}
		let table = document.getElementById("table-scores-multi");
		table.innerHTML = "";

		items.forEach(g => {
			let subtable = document.createElement("table");
			subtable.setAttribute("cellspacing", "0");
			subtable.classList.add("section");
			subtable.innerHTML = "<thead><tr><th>játékos</th><th>pontszám</th></tr></thead><tbody></tbody>";
			table.appendChild(subtable);
			let subcontent = subtable.querySelector("tbody");
			Object.keys(g).forEach(player => {

				let recordTr = document.createElement("tr");
				recordTr.innerHTML = `<td>${player}</td><td>${g[player]}</td>`;
				subcontent.appendChild(recordTr);
			});
		});
	}

	save3State(key, time) {
		this.saveSingleState("single3", key, time);
	}

	save4State(key, time) {
		this.saveSingleState("single4", key, time);
	}

	startGame() {
		this.settings.players = [];
		let nameNodes = document.getElementById("playerinput-list").querySelectorAll(".inputentry input");
		for(let i = 0; i < nameNodes.length; ++i) {
			let nameString = nameNodes[i].value;
			if(nameString.length == 0) {
				alert("hibás játékos beállítás");
				return;
			}
			this.settings.players.push(nameString);
		}
		if(this.raceMode) {
			this.settings.cheatAnySet = false;
			this.settings.cheatShowSet = false;
			this.settings.atuoAddCards = true;
		}
		let difficulty = parseInt(document.querySelector('input[name="difficulty"]:checked').value);
		if(difficulty) {
			this.settings.pakliConfig = [true, true, true, true];
		}
		else {
			this.settings.pakliConfig = [true, true, true, false];
		}
		this.gameView.startGame(this.settings);
		this.toggleMode();
	}

	/**
	 * @param {SubmitEvent} event 
	 */
	startMultiGame(event) {
		event.preventDefault();
		let data = Object.fromEntries(new FormData(event.target).entries());
		if(!data.username) {
			data.username = "vendég";
		}
		this.toggleMode();
		this.gameView.startMultiGame(data);
	}

	handleMenuClick(event) {
		let node = null;
		if(event.target.matches(".menulink")) {
			node = event.target;
		}
		else {
			if(!event.target.matches(".menulink *")) {
				return;
			}
			node = event.target;
			while(!node.matches(".menulink")) {
				node = node.parentElement;
			}
		}
		if(node.matches(".disabled"))
			return;
		this.switchMenu(node.dataset.menulink);
	}

	toggleMode() {
		document.getElementById("menu").classList.toggle("dnone");
		document.getElementById("game").classList.toggle("dnone");
		this.switchMenu("menu-main");
	}

	gameEnded() {
		this.toggleMode();
	}

}
new Menu();