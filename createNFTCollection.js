const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const { Metaplex, keypairIdentity, irysStorage, toMetaplexFile, toBigNumber, CreateCandyMachineInput, DefaultCandyGuardSettings, CandyMachineItem, toDateTime, sol, TransactionBuilder, CreateCandyMachineBuilderContext } = require("@metaplex-foundation/js");
const secret = require("./keys/secretKey.json");
require("dotenv").config();

const QUICKNODE_RPC = process.env.QUICKNODE_RPC;
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC, { commitment: 'finalized' });

const WALLET = Keypair.fromSecretKey(new Uint8Array(secret));
const NFT_METADATA = process.env.METADATA_URL; 

const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
.use(keypairIdentity(WALLET))

const METADATA_ARRAY = ["https://arweave.net/B01H4JSNPzaezp_qR_98pIB60aL2QG4dQQTgypHMBQ0","https://arweave.net/oPL-mV6naKywJhPfQkaWo9K4HXiQdsf6m_7_XmYQ6MA","https://arweave.net/JPKBppBteYFClAokKakLiq4xlYNH1GUqq4aLLS7R4fg"]

async function createCollectionNft() {
    const collectionNft = await METAPLEX.nfts().create({
        name: "QuickNode Demo NFT Collection",
        uri: NFT_METADATA,
        sellerFeeBasisPoints: 0,
        isCollection: true,
        updateAuthority: WALLET,
      });

      console.log(`Minted Collection NFT: ${collectionNft.mintAddress.toString()}`);
      console.log(`https://solscan.io/token/${collectionNft.mintAddress.toString()}?cluster=devnet`);
      return collectionNft.mintAddress.toString();
}

async function generateCandyMachine(nftMint) {
    const candyMachineSettings =
        {
            itemsAvailable: toBigNumber(3), // Collection Size: 3
            sellerFeeBasisPoints: 1000, // 10% Royalties on Collection
            symbol: "DEMO",
            maxEditionSupply: toBigNumber(0), // 0 reproductions of each NFT allowed
            isMutable: true,
            creators: [
                { address: WALLET.publicKey, share: 100 },
            ],
            collection: {
                address: new PublicKey(nftMint), // Can replace with your own NFT or upload a new one
                updateAuthority: WALLET,
            },
        };
    const { candyMachine } = await METAPLEX.candyMachines().create(candyMachineSettings);
    console.log(`Created Candy Machine: ${candyMachine.address.toString()}`);
    console.log(`https://solscan.io/address/${candyMachine.address.toString()}?cluster=devnet`);
}

async function updateCandyMachine(candyMachineId) {
    const candyMachine = await METAPLEX
        .candyMachines()
        .findByAddress({ address: new PublicKey(candyMachineId) });

    const { response } = await METAPLEX.candyMachines().update({
        candyMachine,
        symbol: "DEMON",
        guards: {
            startDate: { date: toDateTime("2022-10-17T16:00:00Z") },
            mintLimit: {
                id: 1,
                limit: 3,
            },
            solPayment: {
                amount: sol(0.1),
                destination: METAPLEX.identity().publicKey,
            },
        }
    })
    
    console.log(`Updated Candy Machine: ${candyMachineId}`);
    console.log(`https://solscan.io/tx/${response.signature}?cluster=devnet`);
}

async function addItems(candyMachineId) {
    const candyMachine = await METAPLEX
        .candyMachines()
        .findByAddress({ address: new PublicKey(candyMachineId) }); 
    const items = [];
    for (let i = 0; i < METADATA_ARRAY.length; i++ ) { // Add 3 NFTs (the size of our collection)
        items.push({
            name: `Demon Slayer NFT # ${i+1}`,
            uri: METADATA_ARRAY[i]
        })
    }
    const { response } = await METAPLEX.candyMachines().insertItems({
        candyMachine,
        items: items,
      },{commitment:'finalized'});

    console.log(`Items added to Candy Machine: ${candyMachineId}`);
    console.log(`https://solscan.io/tx/${response.signature}?cluster=devnet`);
}

async function mintNft(candyMachineId) {
    const candyMachine = await METAPLEX
        .candyMachines()
        .findByAddress({ address: new PublicKey(candyMachineId) }); 
    let { nft, response } = await METAPLEX.candyMachines().mint({
        candyMachine,
        collectionUpdateAuthority: WALLET.publicKey,
        },{commitment:'finalized'})

    console.log(`Minted NFT: ${nft.address.toString()}`);
    console.log(`https://solscan.io/address/${nft.address.toString()}?cluster=devnet`);
    console.log(`https://solscan.io/tx/${response.signature}?cluster=devnet`);
}

async function main() {
    // const COLLECTION_NFT_MINT = await createCollectionNft();
    // const CANDY_MACHINE_ID = await generateCandyMachine(COLLECTION_NFT_MINT);
    const CANDY_MACHINE_ID = "5QdVinc9n1KftHYSKfhu9StBZpeLmwK2o4BbGjimUkMg";

    // await updateCandyMachine(CANDY_MACHINE_ID)

    // await addItems(CANDY_MACHINE_ID);

    await mintNft(CANDY_MACHINE_ID);
}


main()

//candy machine id = xLG55CwpQxjh6WKGmjX2y6esR8jQ2Y5FkT6Duwpr3P7