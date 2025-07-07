export default class TodoItem{
    constructor(title, desc, due, project){

        this.title = title;
        this.desc = desc;
        this.due = due;

        this.done = false;
        this.project = project;

        this.id = crypto.randomUUID();
    }


    setDone(tf) {
        this.done = tf;
    }


    stringify(){
        return `${this.title}: \n${this.desc}\n${this.due}\n${this.done ? "Done":"Not Done"}\nProject: ${this.project.name}`
    }

    jsonVersion(){
        console.log(this);
        return {
            title: this.title,
            desc: this.desc,
            due: this.due,
            done: this.done,
            project: this.project.id,
            id: this.id
        }
    }

    static reconstructObject(jsonTodo, projects){
        const item = new TodoItem(
            jsonTodo.title,
            jsonTodo.desc,
            new Date(jsonTodo.due),
            this.findProjectById(jsonTodo.project, projects)
        );
        item.done = jsonTodo.done;
        item.id = jsonTodo.id;
        return item;
    }

    static findProjectById(id, projects){
        for(let i = 0; i < projects.length; i++){
            if(projects[i].id === id){
                return projects[i];
            }
        }

        return null;
    }
}