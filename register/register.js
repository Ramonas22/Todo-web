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


//Email field
let emailDiv = document.createElement(`div`)
myForm.appendChild(emailDiv)
emailDiv.classList = `innerDivs`
let emailLabel = document.createElement(`label`)
emailDiv.appendChild(emailLabel)
emailLabel.textContent = "Email"

let emailInput = document.createElement(`input`)
emailDiv.appendChild(emailInput)
emailInput.type = `email`
emailInput.placeholder = `Enter email@gmail.com`

//Submit field
let submitDiv = document.createElement(`div`)
myForm.appendChild(submitDiv)
submitDiv.classList = `innerDivs`
let submitBtn = document.createElement(`input`)
submitDiv.appendChild(submitBtn)
submitBtn.type = `submit`
submitBtn.value = `Register`

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
errorField.className = "error"
errorField.style.visibility = "hidden"

submitBtn.addEventListener(`click`,
    (eve) => register(eve)
)

//Register function
function register(e) {
    e.preventDefault()
    if (checkIfNotEmpoty()) {
        checkUser().then((doesUserExist) => {
            if (doesUserExist) {
                fetch("https://testapi.io/api/Ramonas/resource/user", {
                    method: `POST`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ Name: nameInput.value, Surname: surnameInput.value, Email: emailInput.value })
                }).then(res => {
                    if (res.status == 201) {
                        localStorage.setItem(`user`, JSON.stringify({
                            id: nameInput.value,
                            name: nameInput.value,
                            surname: surnameInput.value,
                            email: emailInput.value
                        }))
                        window.location.href = `http://127.0.0.1:${port}/todo/todo.html`
                    }
                })
            } else {
                errorField.style.visibility = "visible"
                errorField.textContent = "Something went wrong, there are not exceptions prepared"
            }
        })
    }
}

async function checkUser() {
    let flag = true
    await fetch("https://testapi.io/api/Ramonas/resource/user")
        .then(res => res.json())
        .then(data => {
            let users = data.data
            for (let i = 0; i < users.length && flag; i++) {
                if (users[i].Name == nameInput.value) {
                    errorField.style.visibility = "visible"
                    errorField.textContent = "User with same name already exists"
                    flag = false
                } else if (users[i].Surname == surnameInput.value) {
                    errorField.style.visibility = "visible"
                    errorField.textContent = "User with same surname already exists"
                    flag = false
                } else if (users[i].Email == emailInput.value) {
                    errorField.style.visibility = "visible"
                    errorField.textContent = "User with same email already exists"
                    flag = false
                }
            }
            return flag
        })
    return flag
}

function checkIfNotEmpoty() {
    if (nameInput.value == "" || nameInput.value.length < 1) {
        errorField.style.visibility = "visible"
        errorField.textContent = "Name is required"
        return false
    } else if (surnameInput.value == "" || surnameInput.value.length < 1) {
        errorField.style.visibility = "visible"
        errorField.textContent = "Surname is required"
        return false
    } else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailInput.value))) {
        errorField.style.visibility = "visible"
        errorField.textContent = "Email is required"
        return false
    } else {
        return true
    }
}