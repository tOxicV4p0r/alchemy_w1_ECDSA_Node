import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, hexToBytes } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, publicKey, setPublicKey }) {
  async function onChange(evt) {
    const pk = evt.target.value;
    setPrivateKey(pk);
    
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
        private key for testing<br />
        0x7e69fc57547910b7f930a24667a4c9f00cfc3d0f09e2ca9d1802f950f80f8c59<br />
        0x9872d111c678db4249b39fd04902b8efa3b303f3d0d988b90189b55ffe3f77de<br />
        0x5c6a8f7f4c90eae8e5abd4e22cb553e2448f8d99e4fe394c18ca9ab301598912
      </label>
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
