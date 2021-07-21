# Mweb3.js - Web3.js for Metrix

Mweb3 is a library for dApps to interract with the Metrix blockchain. mweb3 communicates to a Metrix node via the provider provided.

https://www.npmjs.com/package/mweb3

## Get Started
Run the following in your project folder:

	npm install mweb3 --save

## Web Dapp Usage
This is example is meant for web dapps who would like to use Mweb3's convenience methods with MetriMask's RPC provider. MetriMask is a Metrix wallet [Chrome extension](https://chrome.google.com/webstore/detail/MetriMask/). More details about MetriMask [here](https://github.com/TheLindaProjectInc/MetriMask).

### 1. Construct Mweb3 instance
If you have MetriMask installed, you will have a `window.qrypto` object injected in your browser tab. Pass that into Mweb3 as a parameter to set the provider.
```
const mweb3 = new Mweb3(window.qrypto.rpcProvider);
```

### 2. Construct Contract instance
The Contract class is meant for executing `sendtocontract` or `callcontract` at a specific contract address with a given ABI.
```
const contractAddress = 'f7b958eac2bdaca0f225b86d162f263441d23c19';
const contractAbi = [{"constant":false,"inputs":[{"name":"_eventAddress","type":"address"},{"name":"_eventName","type":"bytes32[10]"},{"name":"_eventResultNames","type":"bytes32[10]"},{"name":"_numOfResults","type":"uint8"},{"name":"_lastResultIndex","type":"uint8"},{"name":"_arbitrationEndBlock","type":"uint256"},{"name":"_consensusThreshold","type":"uint256"}],"name":"createDecentralizedOracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_eventAddress","type":"address"},{"name":"_eventName","type":"bytes32[10]"},{"name":"_eventResultNames","type":"bytes32[10]"},{"name":"_numOfResults","type":"uint8"},{"name":"_lastResultIndex","type":"uint8"},{"name":"_arbitrationEndBlock","type":"uint256"},{"name":"_consensusThreshold","type":"uint256"}],"name":"doesDecentralizedOracleExist","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_eventAddress","type":"address"},{"name":"_eventName","type":"bytes32[10]"},{"name":"_eventResultNames","type":"bytes32[10]"},{"name":"_numOfResults","type":"uint8"},{"name":"_bettingEndBlock","type":"uint256"},{"name":"_resultSettingEndBlock","type":"uint256"},{"name":"_consensusThreshold","type":"uint256"}],"name":"createCentralizedOracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_oracle","type":"address"},{"name":"_eventAddress","type":"address"},{"name":"_eventName","type":"bytes32[10]"},{"name":"_eventResultNames","type":"bytes32[10]"},{"name":"_numOfResults","type":"uint8"},{"name":"_bettingEndBlock","type":"uint256"},{"name":"_resultSettingEndBlock","type":"uint256"},{"name":"_consensusThreshold","type":"uint256"}],"name":"doesCentralizedOracleExist","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"oracles","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_addressManager","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_contractAddress","type":"address"},{"indexed":true,"name":"_oracle","type":"address"},{"indexed":true,"name":"_eventAddress","type":"address"},{"indexed":false,"name":"_name","type":"bytes32[10]"},{"indexed":false,"name":"_resultNames","type":"bytes32[10]"},{"indexed":false,"name":"_numOfResults","type":"uint8"},{"indexed":false,"name":"_bettingEndBlock","type":"uint256"},{"indexed":false,"name":"_resultSettingEndBlock","type":"uint256"},{"indexed":false,"name":"_consensusThreshold","type":"uint256"}],"name":"CentralizedOracleCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_contractAddress","type":"address"},{"indexed":true,"name":"_eventAddress","type":"address"},{"indexed":false,"name":"_name","type":"bytes32[10]"},{"indexed":false,"name":"_resultNames","type":"bytes32[10]"},{"indexed":false,"name":"_numOfResults","type":"uint8"},{"indexed":false,"name":"_lastResultIndex","type":"uint8"},{"indexed":false,"name":"_arbitrationEndBlock","type":"uint256"},{"indexed":false,"name":"_consensusThreshold","type":"uint256"}],"name":"DecentralizedOracleCreated","type":"event"}];

// Create a new Contract instance and use the same provider as mweb3
const contract = mweb3.Contract(contractAddress, contractAbi);
```

### 3. Get Logged In MetriMask Account
To get the current logged in account in MetriMask, you will have to add an [Event Listener](https://www.w3schools.com/jsref/met_element_addeventlistener.asp) to listen to messages sent from MetriMask.
```
let account;

function onQryptoAcctChange(event) {
  if (event.data.message && event.data.message.type == "ACCOUNT_CHANGED") {
    account = event.data.message.payload;

    // You now have the logged in account.
    // account = InpageAccount {
    //   loggedIn: true,
    //   name: "My Wallet", 
    //   network: "TestNet",
    //   address: "mJHp6dUSmDShpEEMmwxqHPo7sFSdydSkPM",
    //   balance: 49.10998413
    // } 

    // You may also get the account from `window.metrimask.account`.
    // account = window.metrimask.account
  }
}
window.addEventListener('message', onMetriMaskAcctChange, false);
```

### 4. Execute sendtocontract
The last piece is to execute a `sendtocontract` on your Contract instance. This will automatically show a Qrypto popup to confirm that you would like to send the transaction.
```
// Does a sendtocontract call on a function called setResult(uint8)
const tx = await contract.send('setResult', {
  methodArgs: [1],    // Sets the function params
  gasLimit: 1000000,  // Sets the gas limit to 1 million
  senderAddress: account.address,
});
// tx = txid of the transaction
```

## Mweb3Provider
The provider is the link between Mweb3 and the blockchain. A compatible Mweb3 Provider adheres to the following interface:
```
interface Mweb3Provider: {
  rawCall: (method: string, args: any[]) => Promise; // returns the result of the request
}
```

## Mweb3
Instantiate a new instance of `Mweb3`: 
```
const { Mweb3 } = require('mweb3');

// Instantiate Mweb3 with HttpProvider
// Pass in the URL of your Metrix node RPC port with auth credentials.
// Default Metrix RPC ports: testnet=33851 mainnet=33831
const mweb3 = new Mweb3('http://mwtrix:metrix@localhost:13889');

// Instantiate Mweb3 with MetriMaskRPCProvider
// MetriMaskRPCProvider is a provider for the MetriMask Wallet Chrome Extension.
// Please note MetriMaskRPCProvider only allows the rawCall() method to be used.
// It is specifically used for `sendtocontract` and `callcontract` only.
const mweb3 = new Mweb3(window.metrimask.rpcProvider);
```

### isConnected()
Checks if you are connected properly to the local Metrix node.
```
async function isConnected() {
  return await mweb3.isConnected();
}
```

### getHexAddress(address)
Converts a Metrix address to hex format.
```
async function getHexAddress() {
  return await mweb3.getHexAddress('qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy');
}
```

### fromHexAddress(hexAddress)
Converts a hex address to Metrix format.
```
async function fromHexAddress() {
  return await mweb3.fromHexAddress('17e7888aa7412a735f336d2f6d784caefabb6fa3');
}
```

### getBlockCount()
Gets the current block height of your local Metrix node.
```
async function getBlockCount() {
  return await mweb3.getBlockCount();
}
```

### getTransaction(txid)
Gets the transaction details of the transaction id.
```
async function getTransaction(args) {
  const {
    transactionId, // string
  } = args;

  return await mweb3.getTransactionReceipt(transactionId);
}
```

### getTransactionReceipt(txid)
Gets the transaction receipt of the transaction id.
```
async function getTransactionReceipt(args) {
  const {
    transactionId, // string
  } = args;

  return await mweb3.getTransactionReceipt(transactionId);
}
```

### listUnspent()
Gets the unspent outputs that can be used.
```
async function listUnspent() {
  return await mweb3.listUnspent();
}
```

### searchLogs(fromBlock, toBlock, addresses, topics, contractMetadata, removeHexPrefix)
Gets the logs given the params on the blockchain.

The `contractMetadata` param contains the contract names and ABI that you would like to parse. An example of one is:
```
# contract_metadata.js
module.exports = {
  EventFactory: {
    address: 'd53927df927be7fc51ce8bf8b998cb6611c266b0',
    abi: [{ constant: true, inputs: [{ name: '', type: 'bytes32' }], name: 'topics', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: '_oracle', type: 'address' }, { name: '_name', type: 'bytes32[10]' }, { name: '_resultNames', type: 'bytes32[10]' }, { name: '_bettingEndBlock', type: 'uint256' }, { name: '_resultSettingEndBlock', type: 'uint256' }], name: 'createTopic', outputs: [{ name: 'topicEvent', type: 'address' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [{ name: '_name', type: 'bytes32[10]' }, { name: '_resultNames', type: 'bytes32[10]' }, { name: '_bettingEndBlock', type: 'uint256' }, { name: '_resultSettingEndBlock', type: 'uint256' }], name: 'doesTopicExist', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function' }, { inputs: [{ name: '_addressManager', type: 'address' }], payable: false, stateMutability: 'nonpayable', type: 'constructor' }, { anonymous: false, inputs: [{ indexed: true, name: '_topicAddress', type: 'address' }, { indexed: true, name: '_creator', type: 'address' }, { indexed: true, name: '_oracle', type: 'address' }, { indexed: false, name: '_name', type: 'bytes32[10]' }, { indexed: false, name: '_resultNames', type: 'bytes32[10]' }, { indexed: false, name: '_bettingEndBlock', type: 'uint256' }, { indexed: false, name: '_resultSettingEndBlock', type: 'uint256' }], name: 'TopicCreated', type: 'event' }],
  },

  TopicEvent: {
    abi: [{ constant: false, inputs: [{ name: '_resultIndex', type: 'uint8' }, { name: '_sender', type: 'address' }, { name: '_amount', type: 'uint256' }], name: 'voteFromOracle', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'totalBotValue', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [{ name: '_oracleIndex', type: 'uint8' }], name: 'getOracle', outputs: [{ name: '', type: 'address' }, { name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [{ name: '', type: 'address' }], name: 'didWithdraw', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'resultSet', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'status', outputs: [{ name: '', type: 'uint8' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'getFinalResult', outputs: [{ name: '', type: 'uint8' }, { name: '', type: 'string' }, { name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint256' }], name: 'resultNames', outputs: [{ name: '', type: 'bytes32' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint256' }], name: 'oracles', outputs: [{ name: 'didSetResult', type: 'bool' }, { name: 'oracleAddress', type: 'address' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [], name: 'finalizeResult', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: false, inputs: [{ name: '_oracle', type: 'address' }, { name: '_resultIndex', type: 'uint8' }, { name: '_consensusThreshold', type: 'uint256' }], name: 'centralizedOracleSetResult', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'totalMetrixValue', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: '_consensusThreshold', type: 'uint256' }], name: 'invalidateOracle', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'getBetBalances', outputs: [{ name: '', type: 'uint256[10]' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'owner', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'calculateMetrixContributorWinnings', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'getVoteBalances', outputs: [{ name: '', type: 'uint256[10]' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'getTotalVotes', outputs: [{ name: '', type: 'uint256[10]' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: '_better', type: 'address' }, { name: '_resultIndex', type: 'uint8' }], name: 'bet', outputs: [], payable: true, stateMutability: 'payable', type: 'function' }, { constant: false, inputs: [{ name: '_resultIndex', type: 'uint8' }, { name: '_currentConsensusThreshold', type: 'uint256' }], name: 'votingOracleSetResult', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'getTotalBets', outputs: [{ name: '', type: 'uint256[10]' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'getEventName', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'invalidResultIndex', outputs: [{ name: '', type: 'uint8' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'numOfResults', outputs: [{ name: '', type: 'uint8' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [], name: 'withdrawWinnings', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: false, inputs: [{ name: '_newOwner', type: 'address' }], name: 'transferOwnership', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'calculateBotContributorWinnings', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { inputs: [{ name: '_owner', type: 'address' }, { name: '_centralizedOracle', type: 'address' }, { name: '_name', type: 'bytes32[10]' }, { name: '_resultNames', type: 'bytes32[10]' }, { name: '_bettingEndBlock', type: 'uint256' }, { name: '_resultSettingEndBlock', type: 'uint256' }, { name: '_addressManager', type: 'address' }], payable: false, stateMutability: 'nonpayable', type: 'constructor' }, { payable: true, stateMutability: 'payable', type: 'fallback' }, { anonymous: false, inputs: [{ indexed: true, name: '_eventAddress', type: 'address' }, { indexed: false, name: '_finalResultIndex', type: 'uint8' }], name: 'FinalResultSet', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: '_winner', type: 'address' }, { indexed: false, name: '_MetrixTokenWon', type: 'uint256' }, { indexed: false, name: '_botTokenWon', type: 'uint256' }], name: 'WinningsWithdrawn', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: '_previousOwner', type: 'address' }, { indexed: true, name: '_newOwner', type: 'address' }], name: 'OwnershipTransferred', type: 'event' }],
  },
};
```

Usage:
```
const ContractMetadata = require('./contract_metadata');

async function(args) {
  let {
    fromBlock, // number
    toBlock, // number
    addresses, // string array
    topics // string array
  } = args;

  if (addresses === undefined) {
    addresses = [];
  }
  if (topics === undefined) {
    topics = [];
  }

  // removeHexPrefix = true removes the '0x' hex prefix from all hex values
  return await mweb3.searchLogs(fromBlock, toBlock, addresses, topics, contractMetadata, true);
}
```

## Contract.js
Instantiate a new instance of `Contract`: 
```
const { Mweb3 } = require('mweb3');

const mweb3 = new Mweb3('http://metrix:metrix@localhost:13889');

// contractAddress = The address of your contract deployed on the blockchain
const contractAddress = 'f7b958eac2bdaca0f225b86d162f263441d23c19';

// contractAbi = The ABI of the contract
const contractAbi = [{"constant":false,"inputs":[{"name":"_eventAddress","type":"address"},{"name":"_eventName","type":"bytes32[10]"},{"name":"_eventResultNames","type":"bytes32[10]"},{"name":"_numOfResults","type":"uint8"},{"name":"_lastResultIndex","type":"uint8"},{"name":"_arbitrationEndBlock","type":"uint256"},{"name":"_consensusThreshold","type":"uint256"}],"name":"createDecentralizedOracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_eventAddress","type":"address"},{"name":"_eventName","type":"bytes32[10]"},{"name":"_eventResultNames","type":"bytes32[10]"},{"name":"_numOfResults","type":"uint8"},{"name":"_lastResultIndex","type":"uint8"},{"name":"_arbitrationEndBlock","type":"uint256"},{"name":"_consensusThreshold","type":"uint256"}],"name":"doesDecentralizedOracleExist","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_eventAddress","type":"address"},{"name":"_eventName","type":"bytes32[10]"},{"name":"_eventResultNames","type":"bytes32[10]"},{"name":"_numOfResults","type":"uint8"},{"name":"_bettingEndBlock","type":"uint256"},{"name":"_resultSettingEndBlock","type":"uint256"},{"name":"_consensusThreshold","type":"uint256"}],"name":"createCentralizedOracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_oracle","type":"address"},{"name":"_eventAddress","type":"address"},{"name":"_eventName","type":"bytes32[10]"},{"name":"_eventResultNames","type":"bytes32[10]"},{"name":"_numOfResults","type":"uint8"},{"name":"_bettingEndBlock","type":"uint256"},{"name":"_resultSettingEndBlock","type":"uint256"},{"name":"_consensusThreshold","type":"uint256"}],"name":"doesCentralizedOracleExist","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"oracles","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_addressManager","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_contractAddress","type":"address"},{"indexed":true,"name":"_oracle","type":"address"},{"indexed":true,"name":"_eventAddress","type":"address"},{"indexed":false,"name":"_name","type":"bytes32[10]"},{"indexed":false,"name":"_resultNames","type":"bytes32[10]"},{"indexed":false,"name":"_numOfResults","type":"uint8"},{"indexed":false,"name":"_bettingEndBlock","type":"uint256"},{"indexed":false,"name":"_resultSettingEndBlock","type":"uint256"},{"indexed":false,"name":"_consensusThreshold","type":"uint256"}],"name":"CentralizedOracleCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_contractAddress","type":"address"},{"indexed":true,"name":"_eventAddress","type":"address"},{"indexed":false,"name":"_name","type":"bytes32[10]"},{"indexed":false,"name":"_resultNames","type":"bytes32[10]"},{"indexed":false,"name":"_numOfResults","type":"uint8"},{"indexed":false,"name":"_lastResultIndex","type":"uint8"},{"indexed":false,"name":"_arbitrationEndBlock","type":"uint256"},{"indexed":false,"name":"_consensusThreshold","type":"uint256"}],"name":"DecentralizedOracleCreated","type":"event"}];

// Create a Contract instance from the Mweb3 instance
const contract = mweb3.Contract(contractAddress, contractAbi);
```

### call(methodName, params)
Executes a `callcontract`
```
// callcontract on a method named 'bettingEndBlock'
async function exampleCall(args) {
  const {
    senderAddress, // address
  } = args;

  return await contract.call('bettingEndBlock', {
    methodArgs: [],
    senderAddress: senderAddress,
  });
}
```

### send(methodName, params)
Executes a `sendtocontract`
```
// sendtocontract on a method named 'setResult'
async function exampleSend(args) {
  const {
    resultIndex, // number
    senderAddress, // address
  } = args;

  return await contract.send('setResult', {
    methodArgs: [resultIndex],
    gasLimit: 1000000, // setting the gas limit to 1 million
    senderAddress: senderAddress,
  });
}
```

## Encoder
`Encoder` static functions are exposed in Mweb3 instances.
```
const { Mweb3 } = require('mweb3');

const mweb3 = new Mweb3('http://metrix:metrix@localhost:13889');
mweb3.encoder.objToHash(abiObj, isFunction);
mweb3.encoder.addressToHex(address);
mweb3.encoder.boolToHex(value);
mweb3.encoder.intToHex(num);
mweb3.encoder.uintToHex(num);
mweb3.encoder.stringToHex(string, maxCharLen);
mweb3.encoder.stringArrayToHex(strArray, numOfItems);
mweb3.encoder.padHexString(hexStr);
mweb3.encoder.constructData(abi, methodName, args);
```

## Decoder
`Decoder` static functions are exposed in Mweb3 instances.
```
const { Mweb3 } = require('mweb3');

const mweb3 = new Mweb3('http://metrix:metrix@localhost:13889');
mweb3.decoder.toMetrixAddress(hexAddress, isMainnet);
mweb3.decoder.removeHexPrefix(value);
mweb3.decoder.decodeSearchLog(rawOutput, contractMetadata, removeHexPrefix);
mweb3.decoder.decodeCall(rawOutput, contractABI, methodName, removeHexPrefix);
```

## Utils
`Utils` static functions are exposed in Mweb3 instances.
```
const { Mweb3 } = require('mweb3');

const mweb3 = new Mweb3('http://metrix:metrix@localhost:13889');
mweb3.utils.paramsCheck(methodName, params, required, validators);
mweb3.utils.appendHexPrefix(value);
mweb3.utils.trimHexPrefix(str);
mweb3.utils.chunkString(str, length);
mweb3.utils.toUtf8(hex);
mweb3.utils.fromUtf8(str);
mweb3.utils.isJson(str);
mweb3.utils.isMetrixAddress(address);
```

## Running Tests
You need to create a `.env` file in the root folder with the following variables in the following formats. Change it to how your environment is setup.
```
METRIX_RPC_ADDRESS='http://metrix:metrix@localhost:13889'
SENDER_ADDRESS='mMZK8FNPRm54jvTLAGEs1biTCgyCkcsmna'
WALLET_PASSPHRASE='metrix'
```
