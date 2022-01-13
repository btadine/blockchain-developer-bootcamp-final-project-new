## Avoiding Common Attacks

### 1. Check Return Values Pattern (SWC-104)
When using low-level call methods, the contract handles the possibility that the call will fail by checking the return value.

### 2. Checks-Effects-Interactions Pattern (SWC-107) 
The contract avoids re-entrancy hacks performing the required checks before any changes have been written to the contract. 
There are no changes in logic until it is unavoidable to do them. Modifiers are only used for validation.

### 3. Proper Use of require, assert and revert (SWC-110)
All the require calls are made to validate input. assert and revert are not used in the project.

### 4. Avoid authorization through tx.origin (SWC-115)
The contract doesn't use tx.origin for authorization. Uses msg.sender instead.

### 5. Avoiding Timestamp/Block number dependence (SWC-116)
The contract events include timestamps as a reference but the functions and variables have been designed to avoid relying
on the number of block or the timestamp since it could contain unexpected values or be manipulated.

### 6. Built-In Variable Names (SWC-119)
All the function names have distinctive names, not resembling any variable that could be shadowed.

### 7. Code with no effects (SWC-135)
The contract has been revised and cleaned throughly to not include variables or functions without use.
