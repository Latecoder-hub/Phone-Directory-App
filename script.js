// ===== Default users==========================
const defaultUsers = [{
    userName: "admin",
    phone: 1234567890,
    email: "test1@test"
},
{
    userName: "cadmin2",
    phone: 1233454555,
    email: "test2@test"
}, {
    userName: "badmin3",
    phone: 9987454555,
    email: "test3@test"
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
        noResult: ".noResult",
        nameColumn: "#nameColumn",
        error: ".error",


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
            document.querySelector(view.domstr.noResult).style.display = container1 ? "none" : "block"
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
    let tempAllUsers
    
    const searchMobile = () => {
        const searchBox = document.querySelector(view.domstr.search);

        // return elements equal to phone number's parts
        const searchNumber = (number, arr) =>
            arr.filter(element => {
                const temp = element.phone.toString()
                return number === temp.slice(0, -(temp.length - number.length))
            }
            )
            

        searchBox.addEventListener('keyup', (event) => {
            state.users = event.target.value ? searchNumber(searchBox.value,tempAllUsers) : [...tempAllUsers]

            


        });

    }

    // convert table to alphabetic order
    const alphabeticOrder = () => {
        const nameButton = document.querySelector(view.domstr.nameColumn)
        let clickCount = 0
        nameButton.addEventListener('click', () => {

            const sorted = state.allUsers.sort(function (a, b) {
                return a.userName.localeCompare(b.userName);
            });

            state.users = clickCount % 2 === 0 ? [...sorted] : [...sorted].reverse()
            clickCount++
            
        })
    }

    const addUser = () => {

        const submit = document.getElementById(view.domstr.submit)
        const name = document.getElementById(view.domstr.name)
        const email = document.getElementById(view.domstr.email)
        const phone = document.getElementById(view.domstr.mobile)
        const checkInputValues = (name, phone, email) => {
            const regexName = /^[a-zA-Z ]*$/
            const regexPhone = /^[0-9]*$/
            const regexEmail = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/

            const checkName = (name) => (regexName.test(name)) && (name.length < 21)
            const checkPhone = (phone) => regexPhone.test(phone) && phone.length < 11
            const checkEmail = (email) => regexEmail.test(email) && email.length < 41
            return checkName(name) && checkPhone(phone) && checkEmail(email)
        }
        submit.addEventListener("click", () => {
            // check values of input
            if (checkInputValues(name.value, phone.value, email.value)) {
                const newUser = new model.User(name.value, phone.value, email.value)
               const temp=[...state.allUsers]
               temp.push(newUser)
                state.users = [...temp]
                tempAllUsers=[...state.allUsers]
                // reset inputs

                name.value = ""
                email.value = ""
                phone.value = ""
            }
            else {
                document.querySelector(view.domstr.error).style.display = "block"
            }




        })








    }


    const init = () => {
        const defaultUsers = model.defaultUsers

        state.users = [...defaultUsers]
        tempAllUsers=[...state.allUsers]

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
