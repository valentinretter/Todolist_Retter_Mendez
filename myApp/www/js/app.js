// App logic.
window.myApp = {};

document.addEventListener('init', function(event) {
  var page = event.target;

  // Initialsiation
  if (myApp.controllers.hasOwnProperty(page.id)) {
    myApp.controllers[page.id](page);
  }

  // Fill the lists with initial data when the pages we need are ready.
  // This only happens once at the beginning of the app.
  if (page.id === 'menuPage' || page.id === 'pendingTasksPage') {
    if (document.querySelector('#menuPage')
      && document.querySelector('#pendingTasksPage')
      && !document.querySelector('#pendingTasksPage ons-list-item')
    ) {
      if(storage.getItem("compteur")===null){ //initatilisation
        let cpt = 0;
        let tab = []
        myApp.services.fixtures.forEach(e => {
          cpt++;
          tab.push(e);
        });
        console.log(tab);
        storage.setItem("taches",JSON.stringify(tab));
        storage.setItem("compteur",cpt);
      }
      let compteur = storage.getItem("compteur")
      let taches = JSON.parse(storage.getItem("taches"));
      for(let i = 0; i<compteur;i++){
        myApp.services.tasks.create(taches[i]);
      }
    }
  }
});
