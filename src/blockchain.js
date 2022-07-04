const SHA256 = require("crypto-js/sha256");
class Block {
    constructor(timestamp, transactions, previousHash = ''){
		this.previousHash = previousHash;
		this.timestamp = timestamp;
		this.transactions  = transactions;
		this.hash = this.calculateHash();
		this.nonce = 0;
    }

    calculateHash() {
		return SHA256(
			this.index + 
			this.previousHash + 
			this.timestamp + 
			JSON.stringify(this.transactions) +
			this.nonce
		).toString();
	}

	mineBlock(difficulty){
		while (this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
			this.nonce++;
			this.hash = this.calculateHash();
		}
		console.log("BLOCK MINED: " + this.hash);
	}
}

class Blockchain {
	constructor(){
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 5;

		// Place to store transactions in between block creation
		this.pendingTransactions = [];

		// How many coins a miner will get as a reward for his/her efforts
		this.miningReward = 100;
	}

	createGenesisBlock(){
		return new Block(0,Date.now(), "Genesis block", "0");
	}

	getLastestBlock(){
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock){
		newBlock.previousHash = this.getLastestBlock().hash;
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
	}

	isChainValid() {
		for (let i = 1; i < this.chain.length; i++){
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			if (currentBlock.hash !== currentBlock.calculateHash()) {
				return false;
			}

			if (currentBlock.previousHash !== previousBlock.hash) {
				return false;
			}
		}
		return true;
	}

	minePendingTransactions(miningRewardAddress) {
        // Create new block with all pending transactions and mine it..
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
    
        // Add the newly mined block to the chain
        this.chain.push(block);
    
        // Reset the pending transactions and send the mining reward
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    
	
}

class Transaction {
    constructor (fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    createTransaction(transaction){
        // There should be some validation here!

        // Push into onto the "pendingTransactions" array
        this.pendingTransactions.push(transaction);
    }

	getBalanceOfAddress(address){
        let balance = 0; // you start at zero!
    
        // Loop over each block and each transaction inside the block
        for(const block of this.chain){
            for(const trans of block.transactions){
    
                // If the given address is the sender -> reduce the balance
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
    
                // If the given address is the receiver -> increase the balance
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
    
        return balance;
    }
}

module.exports = {Blockchain , Block , Transaction};
