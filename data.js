import Project from "./project.js";
import TodoItem from "./todoitem.js";


export let mathProj = new Project("Math");
export let projects = [];



export let todoItems = [];


export const projectContainer = document.getElementById("projectContainer");
export const mainScreen = document.querySelector(".todo-details");
export const titleBar = mainScreen.querySelector("h2");
export const desc = mainScreen.querySelector(".desc");
export const due = mainScreen.querySelector(".due-date");
export const done = mainScreen.querySelector("#done");
export const label = mainScreen.querySelector("label");
export const projectModal = document.getElementById("addProject");
export const projectNameInput = document.getElementById("projectNameInput");
export const todoItemModal = document.getElementById("addTodoItem");
export const todoTitle = document.getElementById("todoTitleInput");
export const todoDesc = document.getElementById("todoDescInput");
export const todoDue = document.getElementById("todoDueDateInput");
export const todoDone = document.getElementById("todoDoneInput");
export const updateTodoTitle = document.getElementById("updateTodoTitle");
export const updateTodoDesc = document.getElementById("updateTodoDesc");
export const updateTodoDue = document.getElementById("updateTodoDueDate");
export const updateTodoDone = document.getElementById("updateTodoDone");
export const updateModal = document.getElementById("updateTodoDialog");

export function clearAddFields() {
    todoTitle.value = "";
    todoDesc.value = "";
    todoDue.value = "";
    todoDone.checked = false;
    
}

export function clearProjectNameField(){
    projectNameInput.value = "";
}

export function clearUpdateFields(todoItem){
    updateTodoTitle.value=todoItem.title;
    updateTodoDesc.value = todoItem.desc;
    updateTodoDue.value = validDateFormat(todoItem.due);
    updateTodoDone.checked=todoItem.done;
}

//returns a string with the valid date format
export function validDateFormat(date){
    return date.getFullYear() + "-" + (getProperNumber(date.getMonth()+1)) + "-" + getProperNumber(date.getDate());
}

export function getProperNumber(month){
    if(month < 10){
        return "0" + month;
    }

    return "" + month;
}



export function saveList(key, items){
    const list = [];
    items.forEach(item => {
        list.push(item.jsonVersion());
    })

    localStorage.setItem(key, JSON.stringify(list));
}


export function loadList(key, list){
    let parseText = localStorage.getItem(key);
    if(parseText == null || parseText.length === 0){
        return;
    }
    const jsonList = JSON.parse(parseText);

    for(const item of jsonList){
        if(key === "todos"){
            list.push(TodoItem.reconstructObject(item, projects));
        }else{
            list.push(Project.reconstructObject(item));
        }
    }
}