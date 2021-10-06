export default class EventCollector {

	/**
	 * @type {Map<String, Array<Function>>}
	 */
	#listenerMap

	#wildcardListeners = [];

	constructor() {
		this.#listenerMap = new Map();
	}

	/**
	 * @param {EventTarget} target 
	 */
	registerFunctions(target) {
		this.#listenerMap.forEach((functionList, eventType, map) => {
			functionList.forEach(fn => {
				target.addEventListener(eventType, fn);
			});
		});
	}

	/**
	 * @param key {String}
	 * @param f {Function}
	 */
	addEventListener(key, f) {
		let fList = this.#listenerMap.get(key);
		if(fList == undefined) {
			fList = [];
			this.#listenerMap.set(key, fList);
		}
		fList.push(f);
	}

}