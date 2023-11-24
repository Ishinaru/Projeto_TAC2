const Adocao = artifacts.require("Adocao");

contract("Adocao", (accounts) => {
    let adocao;
    let expectedPetId;

    before(async() =>{
        adocao = await Adocao.deployed();
    });

    describe("adotando um pet e recuperando o endereço da conta",async()=>{
        before("adote um pet usando contas[0]",async()=>{
            await adocao.adotar(8, {from:accounts[0]});
            expectedAdotante = accounts[0];
        });

        it("pode combinar o endereço de um dono pelo id do pet", async() =>{
            const adotante = await adocao.adotantes(8);
            assert.equal(adotante, expectedAdotante, "O dono do pet adotado teve a primeira conta")
        });

        it("pode combinar a coleção de todos endereços dos donos de pet", async()=>{
            const adotantes = await adocao.getAdotantes();
            assert.equal(adotantes[8], expectedAdotante, "O dono do pet adotado pôde estar na coleção")
        })
    });
});