import NodeRSA from "node-rsa";

export function encryptRSA(plaintext: string, publicKey: NodeRSA.Key): string {
  const key = new NodeRSA();
  key.importKey(publicKey, "pkcs8-public");
  const encrypted = key.encrypt(plaintext, "base64");
  return encrypted;
}

export function decryptRSA(
  ciphertext: string,
  privateKey: NodeRSA.Key
): string {
  const key = new NodeRSA();
  key.importKey(privateKey, "pkcs8-private");
  const decrypted = key.decrypt(ciphertext, "utf8");
  return decrypted;
}

export function getEncryptedVote(
  vote: number,
  public_key: string
): string {
    const key = new NodeRSA({ b: 2048 });
    const publicKey = key.importKey(public_key, "pkcs8-public");

    function randomIntFromInterval(min: number, max: number) {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const randomizedVote = randomIntFromInterval(0, 10000000) * 2 + vote;
    const message = randomizedVote.toString();
    console.log(message);

    const encryptedMessage = encryptRSA(message, public_key);
    console.log("Encrypted message:", encryptedMessage);
    return encryptedMessage;
}