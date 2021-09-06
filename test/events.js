module.exports = (tx, name) => {
	return tx.logs.filter(e => e.event === name);
}