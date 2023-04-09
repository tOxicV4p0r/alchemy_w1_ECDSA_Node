import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, hexToBytes } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, publicKey, setPublicKey }) {
  async function onChange(evt) {
    const pk = evt.target.value;
    setPrivateKey(pk);
    //console.log(pk.length);
    // pk.replace("0x","");
    if (pk.length >= 66) {
      const pubKey = toHex(secp.getPublicKey(pk.replace("0x", "")));
      setPublicKey(pubKey);

      const hashOfPublicKey = keccak256(hexToBytes(pubKey).slice(1));
      const pubAddr = toHex(hashOfPublicKey.slice(-20))
      setAddress("0x" + pubAddr);

      const { data: { balance }, } = await server.get(`balance/${pubAddr}`);
      setBalance(balance);

    } else {
      setPublicKey("");
      setAddress("");
      setBalance(0);
    }

  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type an private key, for example: 0x1..." value={privateKey} onChange={onChange}></input>
      </label>

      <label>
        Public Key : {publicKey}
      </label>

      <label>
        Wallet Address : {address}
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
