module.exports = accounts => {
	return web3.eth.sendTransaction({ from: accounts[0], to: accounts[0], gasPrice: 0 });
}