# Description
You can create NFTs and upload metadata to arweave using metaplex. (JS)


## uploadImageAndMetadata.js
- This file is used to upload the images and metadata to arweave.
- You need to add appropriate image under `uploads` folder.
- You need to create appropriate metadata to be uploaded under `metdatas` folder.
- When metadata is created, make sure to edit the fields and image url is in accordance with the file name in `uploads` folder.

## uploadAndMint.js
- This file can be used to upload image, upload metadata and mint a NFT to the wallet (secret key associated wallet).

## createNFTCollection.js
- This file is used to create NFT Collection.
- First you need to create a collection NFT metadata. Store the URL generated in `env` under the key `METADATA_URL`.
- Now create the metadatas for all the NFTs required in your collection.
- Add the url of these in the `METADATA_ARRAY` in the file.
- First call the `createCollectionNft` function and `generateCandyMachine`. While generating candy machine set the `itemsAvailable` to the no of NFTs required in the collection.
- paste the candymachine id in `CANDY_MACHINE_ID`.
- Call the `updateCandyMachine()`.
- Call the `addItems()`.
- Call the  `mintNft()`.

## metadats
- All the NFT metadatas are stored here.

## uploads
- All the images are stored here. All are png files.

## Prerequisite
- Install the package using `npm i`.
- Set the `.env` variables, based on `.env.example` file.

## Run the file
- uploadImageAndMetadata: `node uploadImageAndMetadata.js`
- uploadAndMint: `node uploadAndMint.js`
- createNFTCollection: `createNFTCollection.js`