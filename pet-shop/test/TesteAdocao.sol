// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adocao.sol";

contract TesteAdocao {
    // The address of the adoption contract to be tested
    Adocao adocao = Adocao(DeployedAddresses.Adocao());

    // The id of the pet that will be used for testing
    uint expectedPetId = 8;

    //The expected owner of adopted pet is this contract
    address expectedAdotante = address(this);

    // Testing the adopt() function
    function testUserPodeAdotarPet() public {
        uint returnedId = adocao.adotar(expectedPetId);

        Assert.equal(returnedId, expectedPetId, "Adoção do pet experado pode combinar com o retorno");
    }

    // Testing retrieval of a single pet's owner
    function testGetAdotanteAddressByPetId() public {
        address adotante = adocao.adotantes(expectedPetId);

        Assert.equal(adotante, expectedAdotante, "Dono do pet correto");
    }

    // Testing retrieval of all pet owners
    function testGetAdotanteAddressByPetIdInArray() public {
        // Store adotantes in memory rather than contract's storage
        address[16] memory adotantes = adocao.getAdotantes();

        Assert.equal(adotantes[expectedPetId], expectedAdotante, "Dono do pet correto");
    }
}