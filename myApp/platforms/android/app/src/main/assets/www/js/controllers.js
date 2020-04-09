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
  },

  ////////////////////////////
  // New Task Page Controller //
  ////////////////////////////
  newTaskPage: function(page) {
    var num = 0;
    var tabData = JSON.parse(storage.getItem("data"));
    var tab2 = [];
    tabData.forEach((x) => {
        var cat = x.category;
        if(!tab2.includes(cat)){tab2.push(cat);}
    });
    tab2.forEach(function (data) {
              var s = 'item'+num;
              if(data!=null && data!=''){
                    page.querySelector('#list-item').appendChild(ons._util.createElement('<ons-list-item modifier="longdivider" id="'+s+'"><div class="right"><ons-checkbox>'));
                    page.querySelector('#'+s).appendChild(document.createTextNode(''+data));
                    num++;
              }
    });
    // Set button functionality to save a new task.
    Array.prototype.forEach.call(page.querySelectorAll('[component="button/save-task"]'), function(element) {
      element.onclick = function() {
        var newTitle = page.querySelector('#title-input').value;
        var tabData = JSON.parse(storage.getItem("data"));
        var newCat = page.querySelector('#category-input').value;
        var check = false;
        var numero = 0;
        var n =0;
        var liste = page.querySelectorAll('ons-checkbox').forEach((x)=>{
            if(x.checked){check=true; numero=n;}
            console.log(n);
            n++;
        });
        if (newTitle) {
          // If input title is not empty, create a new task.
          if(newCat){
            var tab = {
                 title: newTitle,
                 category: newCat,
                 description: page.querySelector('#description-input').value,
                 checked: false,
                 state : "pending"
            };
          }else if(check){
             var tab = {
                  title: newTitle,
                  category: tab2[numero],
                  description: page.querySelector('#description-input').value,
                  checked: false,
                  state : "pending"
                  };
          }else{
            ons.notification.alert('Vous devez mettre une catégorie à la tâche');
          }

          tabData.push(tab);
          storage.setItem("data",JSON.stringify(tabData));
          myApp.services.tasks.create(tab);

          // Set selected category to 'All', refresh and pop page.
          document.querySelector('#default-category-list ons-list-item ons-radio').checked = true;
          document.querySelector('#myNavigator').popPage();


        } else {
          // Show alert if the input title is empty.
          ons.notification.alert('Vous devez mettre un titre à la tâche');
        }
      };
    });
  }

};
