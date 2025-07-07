import  TodoItem  from "./todoitem.js";
import  Project  from "./project.js";
import * as data from "./data.js";


let currentTodoItem = null; //this is here for updating purposes. set to null when todoItem is removed.
let filterStatus = {

}
let addToProject = null;

//loading
data.loadList("projects", data.projects);
data.loadList("todos", data.todoItems);

console.log(data.todoItems);
console.log(data.projects);



showPlaceHolder();

function deleteChildren(element){
    while(element.firstChild){
        element.removeChild(element.lastChild);
    }
}

function displayElements(projects, todoItems){
    deleteChildren(data.projectContainer);
    projects.forEach(project => {
        let projectSection = createProjectSection(project);
        let todoItemss = project.filter(todoItems);
        console.log("Here are todoItems while loading: ");
        console.log(todoItemss);
        todoItemss.forEach(td => {
            addTodoCardToSection(createTodoTab(td), projectSection);
        })

        data.projectContainer.appendChild(projectSection);


    });
}

//performs an action of adding the tdCard to the projectSection.
function addTodoCardToSection(tdCard, projectSection){
    const cardContainer = projectSection.querySelector(".todo-list")
    cardContainer.appendChild(tdCard);
}




function updateMainScreen(todoItem){
    console.log(todoItem);
    data.titleBar.textContent = todoItem.title;
    data.desc.textContent = todoItem.desc;
    data.due.querySelector("div").textContent = prettyDate(todoItem.due);
    data.done.checked = todoItem.done;
    data.done.onchange = (e) => {
        if(currentTodoItem != null){
            todoItem.done = e.target.checked;

            let card = document.getElementById(todoItem.id);
            if(card != null){
                card.classList.toggle("doneT");
            }
            let project = todoItem.project;
            updateProjectCard(project);

            data.saveList("todos", data.todoItems);

        }
    }

}

function prettyDate(date){
    console.log(typeof date);
    return getDay(date.getDay()) + " " + date.getDate() + ", " + getMonthName(date.getMonth()) + " " + date.getFullYear();
}

function getMonthName(number){
    let months = ["January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"];

    return months[number];
}

function getDay(day){
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[day];
}

function showPlaceHolder(){
    console.log("showPlaceHOlder was called!")
    updateMainScreen(new TodoItem("Choose a Todo Item!", "Choose a todo Item on th left. Add one if you need to.", new Date(), null))
}

function createTodoTab(todoItem){
    const todoDiv = document.createElement("div");
    
    todoDiv.onclick = () => {
        
        currentTodoItem = todoItem;
        if(todoItemExists(currentTodoItem, data.todoItems)){
            updateMainScreen(todoItem);
        }else{
            showPlaceHolder();
        }
    }
    todoDiv.id = todoItem.id;
    todoDiv.className = "todo-item";
    if(todoItem.done){
        console.log("HERE!!!!")
        console.log(todoItem);
        todoDiv.classList.remove("doneT");
        todoDiv.classList.add("doneT");
    }else{
        todoDiv.classList.remove("doneT");
    }
    todoDiv.textContent = shortenTitle(todoItem.title, 15) || "Untitled Task";
    
    const deleteSpan = document.createElement("span");
    deleteSpan.style.cssText = "float:right; color:#eebbc3; cursor:pointer; font-weight:bold;";
    deleteSpan.title = "Delete";
    deleteSpan.innerHTML = "&#10005;";

    deleteSpan.onclick = (e) => {
        //delete the element.
        let projectNode = document.getElementById(todoItem.project.id).querySelector(".todo-list");
        console.log(projectNode)
        projectNode.removeChild(document.getElementById(todoItem.id));
        //remove todo item from todoitems
        if(currentTodoItem == todoItem){
            console.log("currentTodoItem is the same")
            currentTodoItem = null;
            showPlaceHolder();
        }
        console.log(data.todoItems);
        data.todoItems.splice(data.todoItems.indexOf(todoItem), 1);
        console.log(data.todoItems);
        data.saveList("todos", data.todoItems);

    }

    todoDiv.appendChild(deleteSpan);

    return todoDiv;
}

function shortenTitle(title, chars){
    if(title.length > chars){
        return title.substring(0, 12) + "...";
    }else{
        return title;
    }
}


function updateProjectCard(project) {
    let filteredTodos = project.filter(data.todoItems, filterStatus[project.id]);
    console.log(`Filtered todos with status ${filterStatus[project.id]}:`);
    console.log(filteredTodos);

    let todoList = document.getElementById(project.id).querySelector(".todo-list");
    deleteChildren(todoList);
    reInsertChildren(filteredTodos, todoList);
}

function createProjectSection(project){
    const projectDiv = document.createElement("div");
    projectDiv.id= project.id;
    projectDiv.className = "project";

    const filterBtn = document.createElement("button");
    filterBtn.className = "filter-btn";
    filterBtn.title = "Filter Todos";
    // SVG filter icon (funnel shape)
    filterBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14l-5.5 7.5V17l-3 1v-8.5L3 5z" stroke="#eebbc3" stroke-width="2" fill="none" stroke-linejoin="round"/>
        </svg>
    `;

    filterBtn.style.position = "absolute";
    filterBtn.style.left = "10px";
    filterBtn.style.bottom = "10px";
    filterBtn.style.background = "transparent";
    filterBtn.style.border = "none";
    filterBtn.style.cursor = "pointer";
    filterBtn.style.fontSize = "18px";
    filterBtn.style.padding = "0";

    filterBtn.onclick = (e) => {
        if(!(project.id in filterStatus)){
            filterStatus[project.id] = true;
        }else{
            filterStatus[project.id] = !filterStatus[project.id];
        }

        updateProjectCard(project);

    }


    

    projectDiv.style.position = "relative";
    projectDiv.appendChild(filterBtn);

    const titleDiv = document.createElement("div");
    titleDiv.className = "project-title";
    titleDiv.textContent = shortenTitle(project.title(), 20) || "Untitled Project";

    const deleteSpan = document.createElement("span");
    deleteSpan.style.cssText = "float:right; color:#eebbc3; cursor:pointer; font-weight:bold;";
    deleteSpan.title = "Delete Project";
    deleteSpan.innerHTML = "&#10005;";

    const addSpan = document.createElement("button");
    addSpan.style.cssText = "float:left; color:#eebbc3; cursor:pointer; font-weight:bold; background-color:#232946; border:none; border-radius:4px; padding:2px 8px; margin-right:8px; font-size:18px;";
    addSpan.title = "Add Todo Item";
    addSpan.innerHTML = "&#43;";

    addSpan.onclick = (e) => {
        addToProject = project;
        data.todoItemModal.showModal();
    }

    projectDiv.appendChild(addSpan);

    deleteSpan.onclick = (e) => {
        projectContainer.removeChild(document.getElementById(project.id));

        data.projects.splice(data.projects.indexOf(project), 1);

        project.removeFrom(data.todoItems);

        data.saveList("todos", data.todoItems);
        data.saveList("projects", data.projects);
    }

    titleDiv.appendChild(deleteSpan);

    const todoListDiv = document.createElement("div");
    todoListDiv.className = "todo-list";

    projectDiv.appendChild(titleDiv);
    projectDiv.appendChild(todoListDiv);

    return projectDiv;
}

//reinserts all the children back into the section.
function reInsertChildren(todoItems, todoList){
    todoItems.forEach(td => {
        let todoTab = createTodoTab(td);
        todoList.appendChild(todoTab);
    })
}


//removes all the todo items related to that project



displayElements(data.projects, data.todoItems);


document.getElementById("addProjectBtn").onclick = (e) => {
    data.projectModal.showModal();
}

document.getElementById("confirmBtn").onclick = (e) => {
    data.projectModal.close();
    let projectName = data.projectNameInput.value;
    let project = new Project(projectName);
    data.projects.push(project);
    data.projectContainer.appendChild(createProjectSection(project));
    data.clearProjectNameField();
    data.saveList("projects", data.projects);

}

document.getElementById("confirmBtnTodo").onclick = () => {
    data.todoItemModal.close();
    let todoItem = constructTodoItem(addToProject);
    data.todoItems.push(todoItem);
    console.log(data.todoItems);
    let filteredTodos = todoItem.project.filter(data.todoItems);
    console.log(filteredTodos);
   
    filterStatus[todoItem.project.id] = false;
   
    let todoList = document.getElementById(todoItem.project.id).querySelector(".todo-list");
    deleteChildren(todoList);
    
    reInsertChildren(filteredTodos, todoList);

    data.clearAddFields();
    data.saveList("todos", data.todoItems);
}

document.getElementById("updateTodoBtn").onclick = () =>{
    console.log(currentTodoItem + " " + todoItemExists(currentTodoItem, data.todoItems));
    if(currentTodoItem != null && todoItemExists(currentTodoItem, data.todoItems)){
        data.updateModal.showModal();
        data.clearUpdateFields(currentTodoItem);
    }


}

document.getElementById("updateTodoConfirmBtn").onclick = () => {
    data.updateModal.close();
    if(currentTodoItem != null && todoItemExists(currentTodoItem, data.todoItems)){
        updateFields(currentTodoItem);
        let project = currentTodoItem.project;
        console.log(project);
        let filteredTodos = project.filter(data.todoItems);
   
        filterStatus[project.id] = false;
   
        let todoList = document.getElementById(project.id).querySelector(".todo-list");
        deleteChildren(todoList);
    
        reInsertChildren(filteredTodos, todoList);
        updateMainScreen(currentTodoItem);
        data.clearUpdateFields(currentTodoItem);
        data.saveList("todos", data.todoItems);

    }
}

function updateFields(todoItem){
    todoItem.title = data.updateTodoTitle.value;
    todoItem.desc = data.updateTodoDesc.value;
    todoItem.due = data.updateTodoDue.valueAsDate;
    todoItem.due.setDate(todoItem.due.getDate() + 1);
    todoItem.done = data.updateTodoDone.checked;
}

function todoItemExists(todoItem, todoItems){
    
    for(let i = 0; i < todoItems.length; i++){
       
        if(todoItems[i] === todoItem){
            return true;
        }
    }

    return false;
}


//returns a todo Item.
function constructTodoItem(project){
    console.log(data.todoDone.value);
    console.log(data.todoDue.valueAsDate);
    let date = data.todoDue.valueAsDate;
    date.setDate(date.getDate()+1);
    let todoItem = new TodoItem(
        data.todoTitle.value, data.todoDesc.value, date, project
    );

    todoItem.done = data.todoDone.checked;

    return todoItem;
}

console.log(JSON.stringify(data.projects[0]));





//every time user wants to add.

    //open a modal window

    //once add button on modal window is clicked:
        // add our todo item to the main list

        // filter the todo items (get a new list);

        // sort the filtered list.

        //display them under the proper project.

        //display the task.


//every time user wants to delete a todo item:

    // remove our todoItem from the list.

    // using the special id, remove the element from the dom.


//every time user wants to update a todo item
    //open a modal window

    //once the update button on the modal is clicked:

        //close the modal
        
        //using the data, update the correct todo item.

        //display the task.





//every time user adds a project:

    //add a project the main list.
    //add the element to the display with id as the crypto id.


//every time user deletes a project:
    //remove all todo items that have the project specified.
    //remove the project from the main list.
    //remove the element from the display using the cryptoid.

