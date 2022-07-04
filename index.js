const {Blockchain , Block , Transaction} = require("./src/blockchain");

let Coin = new Blockchain();

console.log('Creating some transactions...');
Coin.addBlock(new Block(1, Date.now(), { amount: 4 }));
Coin.addBlock(new Block(2, Date.now(), { amount: 8 }));

console.log('Starting the miner...');
Coin.minePendingTransactions('my-address');

console.log('Balance of my-address is', Coin.getBalanceOfAddress('my-address'));
