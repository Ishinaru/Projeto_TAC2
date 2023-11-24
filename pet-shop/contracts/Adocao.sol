// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract Adocao {
    address[16] public adotantes;


// Função para adotar um pet
function adotar(uint petId) public returns (uint) {
    require(petId >= 0 && petId < 16);
    adotantes[petId] = msg.sender;
    return petId;
}

function getAdotantes() public view returns (address[16] memory) {
    return adotantes;
}

}
