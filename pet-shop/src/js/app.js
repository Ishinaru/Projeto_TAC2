App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    if(window.ethereum){
      App.web3Provider = window.ethereum;
      try{
        await window.ethereum.enable();
      }catch(error){
        console.error("Usuario com conta de acesso negada");
      }
    }
    else if (window.web3){
      App.web3Provider = window.web3.currentProvider;
    }
    else{
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    web3 = new Web3(App.web3Provider);
  },

  initContract: function() {
    $.getJSON('Adocao.json',function(data){
      var AdocaoArtefato = data;
      App.contracts.Adocao = TruffleContract(AdocaoArtefato);

      App.contracts.Adocao.setProvider(App.web3Provider);

      return App.markAdopted();
  });
},

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function() {
    var adocaoInstancia;
    App.contracts.Adocao.deployed().then(function(instancia){
      adocaoInstancia = instancia;

      return adocaoInstancia.getAdotantes.call();
    }).then(function(adotantes){
      for(i = 0; i< adotantes.length;i++){
        if(adotantes[i]!=='0x0000000000000000000000000000000000000000'){
          $(`.panel-pet`).eq(i).find('button').text('Sucesso').attr('disabled', true);
        }
      }
    }).catch(function(err){
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adocaoInstancia;

    web3.eth.getAccounts(function(error, accounts){
      if(error){
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adocao.deployed().then(function(instancia){
        adocaoInstancia = instancia;

        return adocaoInstancia.adotar(petId, {from: account});
      }).then(function(result){
        return App.markAdopted();
      }).catch(function(err){
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
