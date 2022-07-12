// ===== Default users==========================
const defaultUsers = [{
    userName: "admin",
    phone: 1234567890,
    email: "test1@test"
},
{
    userName:"cadmin2",
    phone:1233454555,
    email:"test2@test"
},{
    userName:"badmin3",
    phone:9987454555,
    email:"test3@test"
}

]



//===================View======================================= 
const View = (() => {
    // dom elements 
    const domstr = {
        container: "tbody",
        name: "name",
        mobile: "mobile",
        email: "email",
        submit: "submit",
        search: "#search",
        noResult:".noResult",
        nameColumn:"#nameColumn"

    }
    // render function
    const render = (element, value) => {
        element.innerHTML = value

    }
    // template callback function for createTemplate
    const createObjTmp = (obj) => {


        return `<td>${obj.userName}</td>
                 <td>${obj.phone}</td>
                <td>${obj.email}</td>
            `

    }
    // Create template for Dom
    const createTemplate = (arr, callback) => {

        let row = ""

        arr.forEach(element => {
            row += ` <tr>
            ${callback(element)}
            </tr>`


        })
        return row

    }
    return {
        domstr,
        render,
        createTemplate,
        createObjTmp,
    }
})()


//===================Model====================================
const Model = ((Users, view) => {
    // crete constructor class for state management

    class User {
        constructor(userName, phone, email) {
            this.userName = userName
            this.phone = phone,
            this.email = email
                
        }
    }
    // create state for state management
    class State {
        allUsers = []

        // getter
        get users() {

            return this.allUsers
        }
        //setter
        set users(newUserList) {
            this.allUsers = [...newUserList]
            const domElement = document.querySelector(view.domstr.container)
            const container1 = view.createTemplate(this.allUsers, view.createObjTmp)

            view.render(domElement, container1)



        }
    }
    const defaultUsers = [...Users]


    return {
        defaultUsers,
        State,
        User,
    };
})(defaultUsers, View);


//=================== Controller==========================
const Controller = ((model, view) => {
    // state
    const state = new model.State()
    const searchMobile = () => {
        const searchBox = document.querySelector(view.domstr.search);
        
        // return elements equal to phone number's parts
        const searchNumber = (number, arr) =>
            arr.filter(element =>{
                const temp=element.phone.toString()
                return number === temp.slice(0, -(temp.length - number.length))
            }
                )
                
        searchBox.addEventListener('keyup', (event) => {
            const searchResult=event.target.value?searchNumber(searchBox.value,state.allUsers):[...state.allUsers]
            
            const domElement = document.querySelector(view.domstr.container)
            const container1 = view.createTemplate(searchResult, view.createObjTmp)
            view.render(domElement, container1)
           document.querySelector(view.domstr.noResult).style.display=container1?"none":"block"
           
           
        });

    }
    const alphabeticOrder=()=>{
        const nameButton=document.querySelector(view.domstr.nameColumn)
        let clickCount=0
        nameButton.addEventListener('click', () => {

            const sorted=state.allUsers.sort(function(a, b) {
                return a.userName.localeCompare(b.userName);
             });
           
             state.users=clickCount%2===0?[...sorted]:[...sorted].reverse()
             clickCount++
        })
    }

    const addUser = () => {
        ///^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
        const submit = document.getElementById(view.domstr.submit)
        const name = document.getElementById(view.domstr.name)
        const email = document.getElementById(view.domstr.email)
        const phone = document.getElementById(view.domstr.mobile)
        submit.addEventListener("click", () => {
            // check values of input
            
            const newUser = new model.User(name.value,  phone.value,email.value)

            state.users = [newUser,...state.allUsers]
            // reset part
            name.value=""
            email.value=""
            phone.value=""
        })
        

        





    }


    const init = () => {
        const defaultUsers = model.defaultUsers

        state.users = [...defaultUsers]
     
    }

    const bootstrap = () => {
        init()
        searchMobile()
        addUser()
        alphabeticOrder()
    }

    return {
        bootstrap,
    }
})(Model, View)
Controller.bootstrap()
