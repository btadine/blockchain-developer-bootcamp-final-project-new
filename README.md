# blockchain-developer-bootcamp-final-project
Final Project of Consensys Ethereum Bootcamp

## Public Ethereum account for NFT Certificate

0xE03A750EED6C6A38a30910fC6Ce1eF047bF8714b

## Deployed version URL
https://cityhacks.vercel.app

## About this project

This project borns from a personal need of reccomendations when I visit new cities I don't know yet. The problem is, when visiting a new city for pleasure or work, it's highly likely to end up in the most touristical places. In opposition, locals and reallocated persons know the cheapest place to take a good beer, the quieter spot in the city with amazing views, or the cofee place where you can work for free.

This is where Cityhacks falls into place. Cityhacks is a categorized city-based suggestion feed owned by the community.

## How CityHacks works?

1. A user creates a new suggestion (AKA "CityHack") indicating a city and a category.
2. A user can upvote or downvote a suggestion.
3. Suggestions are reordered based on upvotes and downvotes.
4. Users can report inappropiate content, which is removed if validated.
5. Users can tip a CityHack creator for the suggestion as a way to thank him for the recommendation.

Coming soon:

6. Hex/ENS addresses of donors shown inside the suggestion (Next iteration).

### Limitations when using CityHacks
1. Anyone who provides a city, a category and a non-empty description, can post a CityHack.
2. The original poster address can't vote his own suggestion.
3. The same address can't vote twice the same for a given suggestion, and has only one vote in every suggestion
4. Votes for a suggestion can be changed but not withdrawn.
5. Innapropiate CityHack's can be reported.
6. The admin can unreport reported CityHacks and/or hide them if they are inappropiate.

Coming soon:

7. Ban for addresses that practice spam. (Next iteration)
8. Block CityHack votes if a CityHack has been voted 10 times in less than 30 minutes. (Next iteration)

## Project Directory Structure

- The `./contracts` folder is where the main contract is located.
- The `./migrations` folder contains the scripts for Truffle.
- The `./test` folder contains the unit tests of the project.
- The `./scripts` folder contains scripts to deploy with Hardhat.
- The `./client` folder contains the front end of the project.

Truffle/Hardhat can be used to deploy the smart contract. However, the tests are prepared only for Truffle.

## Local Deployment

### Prerequisites

- Node.js >= v14
- Truffle & Ganache

### Contracts

- Run `yarn install` in project root to install Truffle build and smart contract dependencies
- Run local testnet in port `8545` with an Ethereum client, e.g. Ganache
- `truffle migrate --network development`
- `truffle console --network development`
- Run tests in Truffle console: `test`

### Frontend
- Navigate to `client/src/utils` and open `Constants.js`
- Change variable `LOCAL_DEPLOYMENT` value to `true`
- Network id for localhost is `5777` (can be changed)
- `cd client`
- `yarn install`
- `yarn start`
- Open `http://localhost:3000`
- Connect with Metamask. Switch network to `Localhost:8545`, chainId default 





