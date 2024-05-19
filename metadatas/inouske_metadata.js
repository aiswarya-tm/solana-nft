const { Keypair } = require("@solana/web3.js");
const secret = require("../keys/newKey.json");

const WALLET = Keypair.fromSecretKey(new Uint8Array(secret));

// CONFIG object containing some metadata
const CONFIG = {
    uploadPath: "uploads/",
    imgFileName: "inouske.png",
    imgType: "image/png",
    imgName: "Inouske NFT",
    description: "Hi this is INOUSKE. I have a boar head and am a demon slayer toooo!!!",
    symbol:"INZ",
    attributes: [
      { trait_type: "Speed", value: "Quick" },
      { trait_type: "Demon", value: "false" },
      { trait_type: "Color", value: "Blue" },
    ],
    sellerFeeBasisPoints: 500, //500 bp = 5%
    creators: [{ address: WALLET.publicKey, share: 100 }],
  };
 
  module.exports=CONFIG;