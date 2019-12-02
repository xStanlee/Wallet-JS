

    // BUDGET CONTROLLER

let budgetController = (function() {
    
   
    
})();



    //  UI CONTROLLER


let UIController = (function(){

  


})();



    // GLOBAL APP CONTROLLER


let controller = (function(budgetCtrl, UICtrl){
    
    let ctrlAddItem = function() {
        
        // 1. Get filed input data

        // 2. Add the item to the budget controller
        
        // 3. Add the new item to the UI
        
        // 4. Calculate the budget
        
        // 5. Display the budget on the UI view
        
        console.log('It Works!');
    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(eventHandler) {
            
        if (eventHandler.keyCode === 13 || eventHandler.which === 13) {
            
            ctrlAddItem();
            
        }
});
    
})(budgetController, UIController);