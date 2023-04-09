const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes, hexToBytes } = require("ethereum-cryptography/utils");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "937e9e35d554e80fa3b02314781edf0b8415353b": 100,
  "ce5a848cb96d24ccf3a3f8d3ed666100f9f247e2": 50,
  "393ec577a38715db7785af37d569dae0c68902a8": 75,
};

app.get("/balance/:address", (req, res) => {
  console.log(req.params);
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { amount, recipient, hashMsg, signature, recoverBit } = req.body;
  const pubKey = toHex(secp.recoverPublicKey(hexToBytes(hashMsg), hexToBytes(signature), recoverBit));
  const hashOfPublicKey = keccak256(hexToBytes(pubKey).slice(1));
  const sender = toHex(hashOfPublicKey.slice(-20))

  const toRecipient = recipient.replace("0x", "");
  setInitialBalance(sender);
  setInitialBalance(toRecipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[toRecipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
