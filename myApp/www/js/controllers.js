/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/

myApp.controllers = {

  //////////////////////////
  // Tabbar Page Controller //
  //////////////////////////
  tabbarPage: function(page) {
    // Set button functionality to open/close the menu.
    page.querySelector('[component="button/menu"]').onclick = function() {
      document.querySelector('#mySplitter').left.toggle();
    };

    // Set button functionality to push 'new_task.html' page.
    Array.prototype.forEach.call(page.querySelectorAll('[component="button/new-task"]'), function(element) {
      element.onclick = function() {
        document.querySelector('#myNavigator').pushPage('html/new_task.html');
      };

      element.show && element.show(); // Fix ons-fab in Safari.
    });

    Array.prototype.forEach.call(page.querySelectorAll('[component="button/delete-selected"]'), function(element) {
      element.onclick = function() {
        ons.notification.confirm(
          {
            title : 'supprimer toutes les tâches?',
            message: 'Toutes les tâches (quelle que soit la catégorie) seront perdues.',
            buttonLabels : ['Oui','Non']
          }
        ).then(function(buttonIndex){
          if(buttonIndex==0){
            storage.setItem("compteur",0)
            storage.setItem("taches",JSON.stringify([]));
            document.querySelector('#pending-list').innerHTML = "";
            document.querySelector('#active-list').innerHTML = "";
            document.querySelector('#completed-list').innerHTML = "";
          }
        }
      )};

      element.show && element.show(); // Fix ons-fab in Safari.
    });
  },

  ////////////////////////////
  // New Task Page Controller //
  ////////////////////////////
  newTaskPage: function(page) {
    // Set button functionality to save a new task.
    Array.prototype.forEach.call(page.querySelectorAll('[component="button/save-task"]'), function(element) {
      element.onclick = function() {
        let newTitle = page.querySelector('#title-input').value;

        if (newTitle) {
          // If input title is not empty, create a new task.
          let tache = {
            title: newTitle,
            category: page.querySelector('#category-input').value,
            description: page.querySelector('#description-input').value,
            checked: false,
            state : "pending"
          };
          let tabTaches = JSON.parse(storage.getItem("taches"));
          tabTaches.push(tache);
          storage.setItem("taches",JSON.stringify(tabTaches));
          storage.setItem("compteur",parseInt(storage.getItem("compteur"))+1);
          myApp.services.tasks.create(tache);

          // Set selected category to 'All', refresh and pop page.
          document.querySelector('#default-category-list ons-list-item ons-radio').checked = true;
          document.querySelector('#myNavigator').popPage();

        } else {
          // Show alert if the input title is empty.
          ons.notification.alert('Vous devez nommer la tâche!');
        }
      };
    });
  }

};
