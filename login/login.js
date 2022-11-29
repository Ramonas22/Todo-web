let mainDiv = document.createElement(`div`)
document.body.appendChild(mainDiv)
mainDiv.className = `mainDiv`


let myForm = document.createElement(`form`)
mainDiv.append(myForm)

//Name field
let nameDiv = document.createElement(`div`)
myForm.appendChild(nameDiv)
nameDiv.classList = `innerDivs`
let nameLabel = document.createElement(`label`)
nameDiv.appendChild(nameLabel)
nameLabel.textContent = "Name"

let nameInput = document.createElement(`input`)
nameDiv.appendChild(nameInput)
nameInput.type = `text`
nameInput.placeholder = `Enter name`


//Surname field
let surnameDiv = document.createElement(`div`)
myForm.appendChild(surnameDiv)
surnameDiv.classList = `innerDivs`
let surnnameLabel = document.createElement(`label`)
surnameDiv.appendChild(surnnameLabel)
surnnameLabel.textContent = "Surname"

let surnameInput = document.createElement(`input`)
surnameDiv.appendChild(surnameInput)
surnameInput.type = `text`
surnameInput.placeholder = `Enter surname`

//Login field
let submitDiv = document.createElement(`div`)
myForm.appendChild(submitDiv)
submitDiv.classList = `innerDivs`
let submitBtn = document.createElement(`input`)
submitDiv.appendChild(submitBtn)
submitBtn.type = `submit`
submitBtn.value = `Login`

//cancel field
let cancelDiv = document.createElement(`div`)
myForm.appendChild(cancelDiv)
cancelDiv.classList = `innerDivs`
let cancelBtn = document.createElement(`input`)
submitDiv.appendChild(cancelBtn)
cancelBtn.type = `submit`
cancelBtn.value = `Cancel`

cancelBtn.addEventListener(`click`, (e) => {
    e.preventDefault()
    window.location.href = `http://127.0.0.1:${port}/index.html`
})

//Error field
let errorField = document.createElement(`span`)
mainDiv.appendChild(errorField)
errorField.textContent = "User does not exist"
errorField.classList = "error"
errorField.style.visibility = "hidden"

submitBtn.addEventListener(`click`, (eve) => login(eve))

function login(e) {
    e.preventDefault()
    //fetch(`https://testapi.io/api/Ramonas/resource/user`)
    fetch(`http://localhost:8092/User/`)
        .then(res => res.json())
        .then(data => {
            // let users = data.data
            let users = data
            console.log(users)
            let flag = true;
            for (let i = 0; i < users.length; i++) {
                if (users[i].name == nameInput.value && users[i].surname == surnameInput.value) {
                    localStorage.setItem("user", JSON.stringify({
                        id: users[i].id,
                        name: users[i].name,
                        surname: users[i].surname,
                        email: users[i].email
                    }))
                    window.location.href = `http://127.0.0.1:${port}/todo/todo.html`
                    flag = false
                }
            }
            if (flag) {
                errorField.style.visibility = "visible"
            }

        })
}