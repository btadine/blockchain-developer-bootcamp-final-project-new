## Design Pattern Decisions


### Inheritance and Interfaces
I used Ownable from the OppenZeppelin library (v.4.0). It handles the ownership of the contract and provides me the modifier onlyOwner
so I don't need to reinvent the wheel.

### Access Control Design Patterns
Since my project involves some admin configuration, I used onlyOwner to limit the availablity of the admin methods.

### Optimizing Gas
I have done a considerable number of optimizations to use less gas. I removed redundant variables, used bytes when possible (probably I can find more places for that) removed modifiers in favour of require statements and externalized some storage into events to prevent more gas consumption than necessary. I avoided deleting elements in my arrays in purpose so the design overall was simpler, consuming less gas and less error prone.

For the next iteration my plan is to remove the storage of CityHacks outside of the contract (store only Ids).

