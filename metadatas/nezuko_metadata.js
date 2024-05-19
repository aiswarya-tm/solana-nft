const { Keypair } = require("@solana/web3.js");
const secret = require("../keys/newKey.json");

const WALLET = Keypair.fromSecretKey(new Uint8Array(secret));

// CONFIG object containing some metadata
const CONFIG = {
    uploadPath: "uploads/",
    imgFileName: "image.png",
    imgType: "image/png",
    imgName: "Nezuko NFT",
    description: "Hi this is NEZUKO. I am a demon and a demon slayer!!!",
    symbol:"NEZ",
    attributes: [
      { trait_type: "Speed", value: "Quick" },
      { trait_type: "Demon", value: "true" },
      { trait_type: "Color", value: "Pink" },
    ],
    sellerFeeBasisPoints: 500, //500 bp = 5%
    creators: [{ address: WALLET.publicKey, share: 100 }],
  };
 
  module.exports=CONFIG;