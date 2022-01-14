# blockchain-developer-bootcamp-final-project
Final Project of Consensys Ethereum Bootcamp

## Cityhacks: A decentralized city-based suggestion feed 

### The Problem

When visiting a new city for pleasure or work, it's highly likely to end up in the most touristical places. In opposition, locals and reallocated persons know the cheapest place to take a good beer, the quieter spot in the city with amazing views, or the cofee place where you can work for free.

### The Solution

A decentralized city-based suggestion feed by category (ie. cheap/nice spot/traditional/parking/coworking).

### User Workflow

1. A user creates a new suggestion (AKA "City hack") indicating a city and a category.
2. When posted, the suggestion leads to a transaction with the smart contract where the suggestion id is stored.
3. Each time a new suggestion is created, an event is emitted.
4. A user can upvote or downvote a suggestion.
5. Each time a new vote is performed, an event is emitted.
6. Suggestions are reordered based on upvotes and downvotes.
7. A user can report inappropiate content.
8. Each time a user makes a report or a CityHack is unreported, an event is emitted.
9. A user can tip a poster to the original address used for the suggestion creation as a way to thank him for the recommendation.

- Coming soon -
10. When a tip is made, an event with the address of the donator is emitted. (Not yet, next iteration)
11. Hex/ENS addresses of donors are shown inside of the suggestion (Not yet, next iteration)

### The Rules
1. Anyone can post a CityHack providing a City, a Category and a non-empty description.
1. The original poster address can't vote his own suggestion.
2. The same address can't vote twice the same for a given suggestion, and has only one vote in every suggestion
3. Votes for a suggestion can be changed but not withdrawn.
4. Innapropiate CityHack's can be reported.
5. The admin can unreport reported CityHacks and/or hide them if they are inappropiate

- Coming soon -
6. Ban spam addresses. (Not yet, next iteration)
7. Block the voting of a hack if it has been voted 10 times in less than 30 minutes. (Not yet, next iteration)


