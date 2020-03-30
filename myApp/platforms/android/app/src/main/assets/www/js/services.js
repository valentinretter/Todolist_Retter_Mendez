/***********************************************************************************
 * App Services. This contains the logic of the application organised in modules/objects. *
 ***********************************************************************************/
var storage = window.localStorage;
myApp.services = {

  //DEBUG DEBUG DEBUG AJOTUER UN ATTRIBUT POUR SAVOIR L'ETAT D'UNE TACHE

  /////////////////
  // Task Service //
  /////////////////
  tasks: {

    // Creates a new task and attaches it to the pending task list.
    create: function (data) {
      // Task item template.
      var checkbox = '<ons-checkbox></ons-checkbox>';
      if(data.checked){
        checkbox = '<ons-checkbox checked></ons-checkbox>';
      }
      var taskItem = ons.createElement(
        //'<ons-list-item tappable category="' + myApp.services.categories.parseId(data.category)+ '">' +
        '<ons-list-item tappable category="' + data.category + '">' +
        '<label class="left">' +
        checkbox +
        '</label>' +
        '<div class="center">' +
        data.title +
        '</div>' +
        '<div class="right">' +
        '<ons-button class="passEnCours">En cours</ons-button>' +
        '<ons-button class="passFinie">Finie</ons-button>' +
        '<ons-icon class="suppr" style="color: grey; padding-left: 4px" icon="ion-ios-trash-outline, material:md-delete"></ons-icon>' +
        '</div>' +
        '</ons-list-item>'
      );

      // Store data within the element.
      taskItem.data = data;

      var pendingList = document.querySelector('#pending-list');
      pendingList.insertBefore(taskItem, taskItem.data.urgent ? pendingList.firstChild : null);

      // Add 'completion' functionality when the checkbox changes.
      taskItem.data.onCheckboxChange = function(event) {
        var tabData = JSON.parse(storage.getItem("data"));
        tabData.map((x)=>{
          if(x.title==taskItem.data.title){x.checked=!x.checked}
        });
        storage.setItem("data",JSON.stringify(tabData));
      };

      taskItem.addEventListener('change', taskItem.data.onCheckboxChange);

      // Add button functionality to remove a task.
      taskItem.querySelector('.suppr').onclick = function() {
        myApp.services.remove(taskItem);
      };

      taskItem.querySelector('.passEnCours').onclick = function() {
        myApp.services.passageEnCours(taskItem);
      };
      taskItem.querySelector('.passFinie').onclick = function() {
        myApp.services.passageFinie(taskItem);
      };
    },


  },

  // Deletes a task item and its listeners.
remove: function(taskItem) {
  taskItem.removeEventListener('change', taskItem.data.onCheckboxChange);
  var tabData = JSON.parse(storage.getItem("data"));
  var indice = 0;
  var indiceVal = -1;
  tabData.map((x)=>{
    if(x.title==taskItem.data.title){indiceVal=indice;}
    indice++;
  });
  tabData.splice(indiceVal);
  storage.setItem("data",JSON.stringify(tabData));
  taskItem.remove();
},

passageEnCours: function(taskItem){
  taskItem.remove();
  var activeList = document.querySelector('#active-list');
  activeList.insertBefore(taskItem, taskItem.data.urgent ? pendingList.firstChild : null);
},

passageFinie: function(taskItem){
  taskItem.remove();
  var completedList = document.querySelector('#completed-list');
  completedList.insertBefore(taskItem, taskItem.data.urgent ? pendingList.firstChild : null);
},

  ////////////////////////
  // Initial Data Service //
  ////////////////////////
  fixtures: [
    {
      title: 'Rejoindre l\'IUT Charlemagne',
      category: 'Etude',
      description: 'Bienvenue!',
      checked : false,
      state : "pending"
    },
    {
      title: 'Commencer à étudier',
      category: 'Programming',
      description: '',
      checked : false,
      state : "pending"
    },
    {
      title: 'Valider la première année',
      category: '',
      description: 'ça se fête!',
      checked : false,
      state : "pending"
    },
    {
      title: 'Devenir un expert en informatique',
      category: 'Programming',
      description: '',
      checked : false,
      state : "pending"
    },
    {
      title: 'Commencer le développement d\'application mobile',
      category: 'Super important',
      description: '',
      checked : false,
      state : "pending"
    },
    {
      title: 'Apprendre Cordova',
      category: 'Mobile',
      description: '',
      checked : false,
      state : "pending"
    },
    {
      title: 'Aprendre Onsen UI',
      category: 'Mobile',
      description: '',
      checked : false,
      state : "pending"
    },
    {
      title: 'Oublier toutes les autres étapes et tout aller copier/coller depuis un dépôt GIT',
      category: '-.-',
      description: 'Ah bah ça explique tout',
      checked : false,
      state : "pending"
    }
  ]
};
