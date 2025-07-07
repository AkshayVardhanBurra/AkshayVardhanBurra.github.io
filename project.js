export default class Project{



    constructor(name){
        this.name = name.trim();
        this.id = crypto.randomUUID();
    }

    title(){
       let sp = this.name.split(" ");
       let result = "";
       for(let i = 0; i < sp.length - 1; i++){
            if(sp[i].length == 1){
                result += sp[i].toUpperCase() + " ";
            }else{
                result += sp[i].substring(0,1).toUpperCase() + sp[i].substring(1,sp[i].length).toLowerCase() + " ";
            }
       }

       if(sp[sp.length - 1].length == 1){
                result += sp[sp.length - 1].toUpperCase() + " ";
            }else{
                result += sp[sp.length - 1].substring(0,1).toUpperCase() + sp[sp.length-1].substring(1,sp[sp.length-1].length).toLowerCase();
        }
        console.log(result);
        return result;
    }

    //returns a list of todoitems that match this object
    filter(todoItems, done=false){
        let filteredTodoItems = [];

        todoItems.forEach(element => {
            if(element.project === this && !done){
                filteredTodoItems.push(element);
            }else if(element.project === this && done && element.done !== true){
                filteredTodoItems.push(element);
            }
        });

        filteredTodoItems.sort((a, b) => {
            if(a.due < b.due){
                return -1;
            }else if(a.due > b.due){
                return 1;
            }else{
                return 0;
            }
        })

        console.log(todoItems);

        return filteredTodoItems;
    }

    removeFrom(todoItems){
        for(let i = 0; i < todoItems.length; i++){

            if(todoItems[i].project == this){
                todoItems.splice(todoItems[i], 1);
                i--;
            }
        }
    }

    //returns a json object
    jsonVersion(){
        return {
            "id":this.id,
            "name":this.name

        }

    }

    static reconstructObject(projectJson){
        let project = new Project(projectJson.name);
        project.id = projectJson.id;

        return project;
    }



}
