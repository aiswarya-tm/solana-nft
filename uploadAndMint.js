const { Connection, Keypair } = require("@solana/web3.js");
const {
  Metaplex,
  keypairIdentity,
  irysStorage,
  toMetaplexFile,
} = require("@metaplex-foundation/js");
const fs = require("fs");
const secret = require("./keys/newKey.json");
const CONFIG = require("./metadatas/nezuko_metadata.js");
require("dotenv").config();

// declare your RPC and establish your Connection to Solana
const QUICKNODE_RPC = process.env.QUICKNODE_RPC;
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);

// establish the wallet we will be using
const WALLET = Keypair.fromSecretKey(new Uint8Array(secret));

// establish a new Metaplex instance by calling our SOLANA_CONNECTION in Metaplex.make()
// Our instance will use the Keypair we just created and bundlrStorage (an option for uploading files to Arweave using Solana).
const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
.use(keypairIdentity(WALLET))
.use(irysStorage({
    address: 'https://devnet.irys.xyz',
    providerUrl: QUICKNODE_RPC,
    timeout: 120000,
}));

async function uploadImage(filePath, fileName) {
    console.log(`Step 1 - Uploading Image`);
    const imgBuffer = fs.readFileSync(filePath+fileName);
    const imgMetaplexFile = toMetaplexFile(imgBuffer,fileName);
    const imgUri = await METAPLEX.storage().upload(imgMetaplexFile);
    console.log(`   Image URI:`,imgUri);
    return imgUri;
}

async function uploadMetadata(imageURL,imgType,nftName,description,attributes) {
    console.log(`Step 2 - Uploading MetaData`);
    const { uri } = await METAPLEX
    .nfts()
    .uploadMetadata({
        name: nftName,
        description: description,
        image: imageURL,
        attributes: attributes,
        properties: {
            files: [
                {
                    type: imgType,
                    uri: imageURL,
                },
            ]
        }
    });
    console.log('   Metadata URI:',uri);
    return uri;  
}

async function mintNFT(metadataUri,name,symbol,sellerFee,creators) {
    console.log(`Step 3 - Minting NFT`);
    const createNftBuilder = await METAPLEX
    .nfts()
    .builders()
    .create({
        uri: metadataUri,
        name: name,
        sellerFeeBasisPoints: sellerFee,
        symbol: symbol,
        creators: creators,
        isMutable: false
    });

    const { mintAddress } = createNftBuilder.getContext();

    // Submit the tx
    await METAPLEX
    .rpc()
    .sendAndConfirmTransaction(createNftBuilder, { commitment: "confirmed" });

    console.log(`   Success!`, mintAddress);
    console.log(`   Minted NFT: https://solscan.io/token/${mintAddress.toBase58()}?cluster=devnet`);
    
    
}

async function main() {
    const imageURI = await uploadImage(CONFIG.uploadPath, CONFIG.imgFileName);
    console.log("image URI is ", imageURI);
    const metadatURI = await uploadMetadata(imageURI, CONFIG.imgType, CONFIG.imgName, CONFIG.description, CONFIG.attributes);
    console.log("metadata URI ", metadatURI);
    await mintNFT(metadatURI, CONFIG.imgName, CONFIG.symbol,CONFIG.sellerFeeBasisPoints,CONFIG.creators);
}

main();
