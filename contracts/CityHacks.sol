// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

/// @title A decentralized recommendation source for world famous cities
/// @author Marcos Palacios (@btadine)
/// @notice You can use this contract for any purpose, it does not contain complex logic
/// @dev All function calls are currently implemented without side effects

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @dev Using Ownable from Open Zeppelin for admin purposes
contract CityHacks is Ownable {
    /// @notice Indicates the number of the last trust report
    uint256 private latestReportNumber;

    /// @notice Indicates the number of current reported CityHacks
    uint256 private reportedHacksCount;

    /// @notice Event indicates that a CityHack has been reported or unreported     
    /// @param from(indexed) Contains the address of the wallet that made effective the transaction
    /// @param id(indexed) Contains the id of the CityHack
    /// @param _inadecuate Is a boolean indicating if the CityHack is being reported/unreported
    /// @param latestReportNumber(indexed) Contains the number of trust report 
    /// @param timestamp Contains the timestamp of the transaction
    /// @param reportedHacks Contains all the CityHack ids that are currently reported. Must contain as well the id of the current CityHack in case of inadecuated report
    event TrustReport(address indexed from, uint256 indexed id, bool _inadecuate, uint256 indexed latestReportNumber, uint256 timestamp, uint256[] reportedHacks);

    /// @notice Event indicates that a new CityHack has been created
    /// @param from(indexed) Contains the address of the wallet that made effective the transaction
    /// @param id(indexed) Contains the id of the CityHack
    /// @param description Is a string containing the CityHack description
    /// @param timestamp Contains the timestamp of the transaction
    event NewHack(address indexed from, uint256 indexed id, string description, uint256 timestamp);

    /// @notice Event indicates that a CityHack has been voted
    /// @param from(indexed) Contains the address of the wallet that made effective the transaction
    /// @param hackId(indexed) Contains the id of the CityHack
    /// @param _voteResult Is a boolean indicating if the vote it's voteResult or negative
    event VotedHack(address indexed from, uint256 indexed hackId, bool _voteResult, uint256 timestamp);

    /// @notice Entity holding all the attributes of a CityHack
    /// @param owner Contains the address of the wallet that made effective the transaction
    /// @param id Contains the number of the CityHack
    /// @param cityId Contains a number representing the city of the CityHack, not defined by the contract
    /// @param categoryId Contains a number representing the category of the CityHack, not defined by the contract
    /// @param description Is a string containing the concrete CityHack
    /// @param timestamp Contains the timestamp of the transaction
    /// @param totalUpvotes Contains the number of upvotes of the CityHack
    /// @param totalDownvotes Contains the number of downvotes of the CityHack
    /// @param hidden Indicates if the CityHack should be visible or not
    /// @dev Hacks are stored in the contract. Consider using a different contract as a database or IPFS storing so CityHacks are not lost whenever a new contract is deployed
    struct Hack {
        address owner;
        uint256 id;
        uint256 cityId;
        uint256 categoryId;
        string description;
        uint256 timestamp;
        uint256 totalUpvotes;
        uint256 totalDownvotes;
        bool hidden;
    }

    /// @notice Indicates if an address has voted a CityHack and the vote itself
    /// @param voted Is a boolean that indicates if the address has voted a specific CityHack
    /// @param voteResult Is a boolean that indicates the result of the votation
    struct AddressVote {
        bool voted;
        bool voteResult;
    }

    /// @notice Contains all the CityHacks created to date
    /// @dev "hacks" does not support deleting elements from the array because index is used for CityHack id
    Hack[] private hacks;

    /// @notice Contains all the votes created to date and is accessed providing the voter address and the CityHack id
    mapping(address => mapping(uint256 => AddressVote)) private votes;

    constructor() {}

    /// @notice Provides the last report number
    function getLatestReportNumber() public view returns (uint256) {
        return latestReportNumber;
    }

    /// @notice Reports a CityHack
    /// @param _hackId Contains the id of the CityHack
    /// @param _reportedHacks Contains the reported hacks to date (including the current one)
    /// @dev The event for reporting and unreporting is the same
    /// @dev The number of reported hacks is saved to prevent a difference of reported hacks greater than 1
    /// @dev Is still possible to stuff the parameter with fake reported hacks, think of a solution to mitigate this possibility
    /// @dev The variable latestReportNumber is used for event fetching optimization
    /// @dev There's no validation that the hack id exists, consider adding it
    function reportHack(uint256 _hackId, uint256[] memory _reportedHacks) public {
        require(reportedHacksCount + 1 == _reportedHacks.length);
        latestReportNumber += 1;
        reportedHacksCount += 1;
        emit TrustReport(msg.sender, _hackId, true, latestReportNumber, block.timestamp, _reportedHacks);
    }

    /// @notice Unreports a CityHack
    /// @param _hackId Contains the id of the CityHack
    /// @param _reportedHacks Contains the reported hacks to date (including the current one)
    /// @dev This function is reserved to the owner of the contract
    /// @dev The event for reporting and unreporting is the same
    /// @dev The number of reported hacks is saved to prevent a difference of reported hacks greater than 1
    /// @dev The variable latestReportNumber is used for event fetching optimization
    /// @dev There's no validation that the hack id exists, consider adding it
    function unreportHack(uint256 _hackId, uint256[] memory _reportedHacks) public onlyOwner {
        require(reportedHacksCount - 1 == _reportedHacks.length && reportedHacksCount - 1 >= 0);
        latestReportNumber += 1;
        reportedHacksCount -= 1;
        emit TrustReport(msg.sender, _hackId, false, latestReportNumber, block.timestamp, _reportedHacks);
    }

    /// @notice Hides and Unreports a CityHack
    /// @param _hackId Contains the id of the CityHack
    /// @param _reportedHacks Contains the reported hacks to date (including the current one)
    /// @dev This function is reserved to the owner of the contract
    /// @dev This function uses unreportHack function above and hideHack function below
    function hideAndUnreportHack(uint256 _hackId, uint256[] memory _reportedHacks) public onlyOwner {
        unreportHack(_hackId, _reportedHacks);
        hideHack(_hackId);
    }

    /// @notice Hides a CityHack
    /// @param _hackId Contains the id of the CityHack
    /// @dev This function is reserved to the owner of the contract
    /// @dev There's no validation that the hack id exists, consider adding it
    function hideHack(uint256 _hackId) public onlyOwner {
        hacks[_hackId].hidden = true;
    }

    /// @notice Unhides a CityHack
    /// @param _hackId Contains the id of the CityHack
    /// @dev This function is reserved to the owner of the contract
    /// @dev There's no validation that the hack id exists, consider adding it
    function unHideHack(uint256 _hackId) public onlyOwner {
        hacks[_hackId].hidden = false;
    }

    /// @notice Posts a CityHack
    /// @param _description Contains the text describing the CityHack
    /// @param _cityId Contains the city id of the CityHack
    /// @param _categoryId Contains the category id of the CityHack
    /// @dev Parameter description must not be empty
    /// @dev Parameter _cityId must be > 0
    /// @dev Parameter _categoryId must be > 0
    /// @dev Variable "_hackId" is currently the index of the CityHack in the array
    /// @dev State variable "hacks" does not support element deletions because index is used as CityHack id
    function postHack(string memory _description, uint256 _cityId, uint256 _categoryId) public {
        bytes memory stringBytes = bytes(_description);
        require(stringBytes.length > 0 && _cityId > 0 && _categoryId > 0);
        uint256 hackNumber = hacks.length;
        hacks.push(Hack(msg.sender, hackNumber, _cityId, _categoryId, _description, block.timestamp, 0, 0, false));
        emit NewHack(msg.sender, hackNumber, _description, block.timestamp);
    }

    /// @notice Votes a CityHack
    /// @param _hackId Contains the id of the CityHack
    /// @param _newVoteResult Contains the new result of the vote
    /// @dev Owner of the hack cannot vote to himself
    /// @dev A _newVoteResult with the same contents as voteResult is not allowed
    /// @dev There's no option to withdraw a vote, only to change it
    /// @dev There's no validation that the hack id exists, consider adding it
    /// @dev Nested if/else may be confusing to read, consider a refactor
    function voteHack(uint256 _hackId, bool _newVoteResult) public {
        require(msg.sender != hacks[_hackId].owner);
        AddressVote memory addressVote = votes[msg.sender][_hackId];
        if (addressVote.voted) {
            require(addressVote.voteResult != _newVoteResult);
            if (addressVote.voteResult) {
                hacks[_hackId].totalUpvotes -= 1;
                hacks[_hackId].totalDownvotes += 1;
            } else {
                hacks[_hackId].totalUpvotes += 1;
                hacks[_hackId].totalDownvotes -= 1;
            }
        } else {
            if (_newVoteResult) {
                hacks[_hackId].totalUpvotes += 1;
            }
            else {
                hacks[_hackId].totalDownvotes += 1;
            }
            addressVote.voted = true;
        }
        addressVote.voteResult = _newVoteResult;
        votes[msg.sender][_hackId] = addressVote;
        emit VotedHack(msg.sender, _hackId, _newVoteResult, block.timestamp);
    }

    /// @notice Tips a CityHacker
    /// @param _hackId Contains the id of the CityHack
    /// @dev There's no validation that the hack id exists, consider adding it
    function tipHacker(uint256 _hackId) payable public {
        (bool sent,) = hacks[_hackId].owner.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }

    /// @notice Returns all CityHacks
    function getAllHacks() public view returns(Hack[] memory) {
        return hacks;
    }
}
