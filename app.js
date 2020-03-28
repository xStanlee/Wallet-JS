

    // BUDGET CONTROLLER

let budgetController = (function() {
    
    // Constructors
    
   let Expense = function(id, description, value, percentage) {
       
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
};
    
    Expense.prototype.calcPercentages = function(totalIncome) {
        if (totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            totalIncome = -1;
        }
    };
    
    Expense.prototype.getPercentages = function() {
        return this.percentage;
    };
   
   let Income = function(id, description, value) {
       
    this.id = id;
    this.description = description;
    this.value = value;
};
  
    let calculateTotal = function(type) {
        let sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
    }
   
    let data = {
        allItems: {
        exp: [],
        inc:[]
        },
        totals: {
        exp: 0,
        inc: 0
        },
        budget: 0,
        percentage: -1
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
        
        deleteItem: function(type, id){
            let ids, index;
          
                ids = data.allItems[type].map(function(current){
                
                return current.id;
                
            });
            
            index = ids.indexOf(id);
            
            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        
        calculateBudget: function(){
            
            //calculate total income&expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            
            //calculate the budget: income - expenses
            
            data.budget = data.totals.inc - data.totals.exp;
            
            //calculate the percentage of income that we spent
            if (data.totals.inc > 0){
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); 
        }   else {
            data.percentage = -1;
        }
        
        },
        
        calculatePercentages: function(){
        
        data.allItems.exp.forEach(function(cur){
        cur.calcPercentages(data.totals.inc);
        
    
        });
    }, 
                        
        getPercentages: function() {
            let allPerc = data.allItems.exp.map(function(cur){
               return cur.getPercentages(); 
            });
            return allPerc;
        
    },
        
        getBudget: function(){
            
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    

    let formatNumber = function(num, type) {
            let numSplit, int, dec;
            
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numSplit = num.split('.');
            
            int = numSplit[0];
            if(int.length > 3){
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length- 3, int.length);
            }
            
            dec = numSplit[1];
            
            return (type === 'exp' ?  '-' : '+') + ' ' + int + '.' + dec;
    };
    
    let nodeListForEach = function(list, callback){
                for (let i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

    return {

        getInput: function(){
            
            return {
            type : document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
            description : document.querySelector(DOMStrings.inputDescription).value,
            value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
            
        },
        
        addListItem: function(obj, type) {
            
            let html, newHtml, element;
            
            // Create HTML string with placeholder
            
            if(type === 'inc') {
            
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type === 'exp') {
            
                element = DOMStrings.expensesContainer;
                html =  '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            
        }
            
            // Replace the placeholder text with some actual data
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            // Insert the HTML into DOM 
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        }, 
        
        deleteListItem: function(selectorID){
            let el;
            
            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
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
        
        displayBudget: function(obj){
        
            let type;
            
        obj.budget > 0 ? type = 'inc' : type = 'exp'; 
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
    
            
            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },
        
        displayPercentages: function(percentages) {
            
            let fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
            
            nodeListForEach(fields, function(current, index){
                
                if(percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = "---";
                }
            });
},
        
        displayMonth: function(){
            
        let now, year, month, months;
            now = new Date();
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            
            
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        
        changedType: function(){
            
            let fields = document.querySelectorAll( DOMStrings.inputType +',' +
                                                    DOMStrings.inputDescription + ',' +
                                                    DOMStrings.inputValue
            );
            
            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });
            
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
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
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
};
    
    
    let updateBudget = function() {
        
        // 4. Calculate the budget
        
        budgetCtrl.calculateBudget();
        
        // 4.5 Return the budget
        
        let budget = budgetCtrl.getBudget();
        
        // 5. Display the budget on the UI view
        
        UICtrl.displayBudget(budget);
    };
    
    let updatePercentages = function () {
        
        // 1. Calculate percentages
        
            budgetCtrl.calculatePercentages();
        
        // 2. Read percentages from the budget controller
        
           let percentages = budgetCtrl.getPercentages();
        
        // 3. Update UI with values
        
           UICtrl.displayPercentages(percentages);
    }; 
    
    
    let ctrlAddItem = function() {
        
        let input, newItem;
        
        // 1. Get filed input data
        
        input = UICtrl.getInput();

        // 2. Add the item to the budget controller
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
        
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        // 3. Add the new item to the UI
        
        UICtrl.addListItem(newItem, input.type)
        
        // 3.A Clear fields
        
        UICtrl.clearFields();
        
        // 4. Calculate and update budget
            
        updateBudget();
            
        // 5. Update percentages
            
        updatePercentages();
    };
    };
    
    let ctrlDeleteItem = function(event) {
        let itemID, splitID, type, ID;
        
        itemID = (event.target.parentNode.parentNode.parentNode.parentNode.id);
    
        if(itemID){
            
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. Delete item from data structure
            
                budgetCtrl.deleteItem(type, ID);        
            
            // 2. Delete item from UI
            
                UICtrl.deleteListItem(itemID);
            
            // 3. Update and show the new budget
            
                updateBudget();
            
            // 4. Update percentages
            
                updatePercentages();
        }
    }
    
        return {
            init: function(){
                console.log('Application has started.');
                UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
                setupEventListeners();
                UICtrl.displayMonth();
            }
        }

    
})(budgetController, UIController);


controller.init();