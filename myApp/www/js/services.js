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
      let checkbox = '<ons-checkbox></ons-checkbox>';
      if(data.checked){
        checkbox = '<ons-checkbox checked></ons-checkbox>';
      }
      let boutons = "";
      if(data.state=="pending"){
        boutons='<ons-button class="passEnCours">En cours</ons-button><ons-button class="passFinie">Finie</ons-button>';
      }else if(data.state=="en_cours"){
        boutons='<ons-button class="passEnAtt">En attente</ons-button><ons-button class="passFinie">Finie</ons-button>';
      }else if(data.state=="finie"){
        boutons='<ons-button class="passEnAtt">En attente</ons-button><ons-button class="passEnCours">En cours</ons-button>';
      }

      let taskItem = ons.createElement(
        //'<ons-list-item tappable category="' + myApp.services.categories.parseId(data.category)+ '">' +
        '<ons-list-item tappable category="' + data.category + '">' +
        '<label class="left">' +
        checkbox +
        '</label>' +
        '<div class="center">' +
        data.title +
        '</div>' +
        '<div class="right">' +
        boutons +
        '<ons-icon class="suppr" style="color: grey; padding-left: 4px" icon="ion-ios-trash-outline, material:md-delete"></ons-icon>' +
        '</div>' +
        '</ons-list-item>'
      );

      // Store data within the element.
      taskItem.data = data;
      if (document.querySelector('#activeTasksPage')
        && document.querySelector('#completedTasksPage') || true
      ) {
        if(taskItem.data.state=="pending"){
          let pendingList = document.querySelector('#pending-list');
          pendingList.insertBefore(taskItem, taskItem.data.urgent ? pendingList.firstChild : null);
        }else if(taskItem.data.state=="en_cours"){
          let activeList = document.querySelector('#active-list');
          activeList.insertBefore(taskItem, taskItem.data.urgent ? pendingList.firstChild : null);
        }else if(taskItem.data.state=="finie"){
          let completedList = document.querySelector('#completed-list');
          completedList.insertBefore(taskItem, taskItem.data.urgent ? pendingList.firstChild : null);
        }
      }

      // Add 'completion' functionality when the checkbox changes.
      taskItem.data.onCheckboxChange = function(event) {
        var tabTaches = JSON.parse(storage.getItem("taches"));
        tabTaches.map((x)=>{
          if(x.title==taskItem.data.title){x.checked=!x.checked}
        });
        storage.setItem("taches",JSON.stringify(tabTaches));
      };

      taskItem.addEventListener('change', taskItem.data.onCheckboxChange);

      // Add button functionality to remove a task.
      taskItem.querySelector('.suppr').onclick = function() {
        myApp.services.remove(taskItem);
      };

      if(data.state!="pending"){
        taskItem.querySelector('.passEnAtt').onclick = function() {
          myApp.services.passageEnAttente(taskItem);
        };
      }
      if(data.state!="en_cours"){
        taskItem.querySelector('.passEnCours').onclick = function() {
          myApp.services.passageEnCours(taskItem);
        };
      }
      if(data.state!="finie"){
        taskItem.querySelector('.passFinie').onclick = function() {
          myApp.services.passageFinie(taskItem);
        };
      }
    },


  },

  // Deletes a task item and its listeners.
remove: function(taskItem) {
  taskItem.removeEventListener('change', taskItem.data.onCheckboxChange);
  let tabTaches = JSON.parse(storage.getItem("taches"));
  let indice = 0;
  let indiceVal = -1;
  tabTaches.map((x)=>{
    if(x.title==taskItem.data.title){indiceVal=indice;}
    indice++;
  });
  tabTaches.splice(indiceVal);
  storage.setItem("compteur",parseInt(storage.getItem("compteur"))-1);
  storage.setItem("taches",JSON.stringify(tabTaches));
  taskItem.remove();
},

passageEnAttente: function(taskItem){
  taskItem.remove();
  let tabTaches = JSON.parse(storage.getItem("taches"));
  tabTaches.map((x)=>{
    if(x.title==taskItem.data.title){x.state="pending";myApp.services.tasks.create(x);}
  });
  storage.setItem("taches",JSON.stringify(tabTaches));
},

passageEnCours: function(taskItem){
  taskItem.remove();
  let tabTaches = JSON.parse(storage.getItem("taches"));
  tabTaches.map((x)=>{
    if(x.title==taskItem.data.title){x.state="en_cours";myApp.services.tasks.create(x);}
  });
  storage.setItem("taches",JSON.stringify(tabTaches));
},

passageFinie: function(taskItem){
  taskItem.remove();
  let tabTaches = JSON.parse(storage.getItem("taches"));
  tabTaches.map((x)=>{
    if(x.title==taskItem.data.title){x.state="finie";myApp.services.tasks.create(x);}
  });
  storage.setItem("taches",JSON.stringify(tabTaches));
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
