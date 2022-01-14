## Design Pattern Decisions


### Inheritance and Interfaces
I used Ownable from the OppenZeppelin library (v.4.0). It handles the ownership of the contract and provides me the modifier onlyOwner
so I don't need to reinvent the wheel.

### Access Control Design Patterns
Since my project involves some admin configuration, I used onlyOwner to limit the availablity of the admin methods.
