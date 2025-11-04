export class AsyncLocalStorage {
	constructor() {
		this._store = undefined
	}
	getStore() {
		return this._store
	}
	run(store, cb, ...args) {
		this._store = store
		try {
			return cb(...args)
		} finally {
			this._store = undefined
		}
	}
	enterWith(store) {
		this._store = store
	}
	disable() {}
}
export default { AsyncLocalStorage }
