

    // BUDGET CONTROLLER

let budgetController = (function() {
    
    // Constructors
    
   let Expense = function(id, description, value) {
       
    this.id = id;
    this.description = description;
    this.value = value;
}
   
   let Income = function(id, description, value) {
       
    this.id = id;
    this.description = description;
    this.value = value;
}
    
   
    let data = {
        allItems: {
        exp: [],
        inc:[]
        },
        totals: {
        exp: 0,
        inc: 0
        }
};
    
    
    return {
        addItem: function(type, des, val){
            
            let newItem, ID;

            // Create new ID
            if(data.allItems[type].length > 0) {
            
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {

                ID = 0;
            }
            // Create new item based on 'inc' or 'exp' type
            
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);    
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
          
            // Push into our data structure
            
            data.allItems[type].push(newItem);
            
            // Return the new element
            
            return newItem;
        },
        
        testing: function(){
            console.log(data);
        }
    }
})();



    //  UI CONTROLLER


let UIController = (function(){
    
    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list', 
        expensesContainer: '.expenses__list'
    }

    return {

        getInput: function(){
            
            return {
            type : document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
            description : document.querySelector(DOMStrings.inputDescription).value,
            value : document.querySelector(DOMStrings.inputValue).value
            };
            
        },
        
        addListItem: function(obj, type) {
            
            let html, newHtml, element;
            
            // Create HTML string with placeholder
            
             if(type === 'inc') {
            
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

             } else if (type === 'exp') {
             
                element = DOMStrings.expensesContainer;
                html =  '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            
        }
            
            // Replace the placeholder text with some actual data
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            // Insert the HTML into DOM 
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        }, 
        
            clearFields: function() {
                let fields, fieldsArray;
                
                fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
                
                fieldsArray = Array.prototype.slice.call(fields);
                fieldsArray.forEach(function(cur, i, arr) {
                cur.value = "" ;
        });  
                fieldsArray[0].focus();
            },
        
        getDOMStrings: function() {
        return DOMStrings;
        }
    };
    

})();



    // GLOBAL APP CONTROLLER


let controller = (function(budgetCtrl, UICtrl){
    
    let setupEventListeners = function(){
        
            let DOM = UICtrl.getDOMStrings(); // New object same references!
           
            document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

            document.addEventListener('keypress', function(eventHandler) {
            
            if (eventHandler.keyCode === 13 || eventHandler.which === 13) {

                ctrlAddItem();

        }
    });
}
    
    
    let ctrlAddItem = function() {
        
        let input, newItem;
        
        // 1. Get filed input data
        
        input = UICtrl.getInput();

        // 2. Add the item to the budget controller
        
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        // 3. Add the new item to the UI
        
        UICtrl.addListItem(newItem, input.type)
        
        // 3.A Clear fields
        
        UICtrl.clearFields();
        
        // 4. Calculate the budget
        
        
        
        // 5. Display the budget on the UI view
    };
    
        return {
            init: function(){
                console.log('Application has started.');
                setupEventListeners();
            }
        }

    
})(budgetController, UIController);


controller.init();