const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const whitelistAddresses = require('./premiumWhitelist.json');

const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
const tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true});

const root = tree.getHexRoot();

const claimingAccount = leafNodes[0];
const hexProof = tree.getHexProof(claimingAccount);

console.log(root);