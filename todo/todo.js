preventNoUserConnection()
let mainDiv = document.createElement(`div`)
document.body.appendChild(mainDiv)
mainDiv.className = `mainDiv`

//Types
let type = ["Vacation", "Shopping", "Job", "Craft", "Gym"]

//Name and surname
let nameSurnameDiv = document.createElement(`div`)
mainDiv.append(nameSurnameDiv)
nameSurnameDiv.className = `nameSurname`
let nameSurnameH1 = document.createElement(`h1`)
nameSurnameDiv.appendChild(nameSurnameH1)
nameSurnameH1.textContent =
    `${JSON.parse(localStorage.getItem("user")).name} ${JSON.parse(localStorage.getItem("user")).surname}`

//Add button
let addBtnDiv = document.createElement(`div`)
mainDiv.append(addBtnDiv)
let addBtn = document.createElement(`button`)
addBtnDiv.appendChild(addBtn)
addBtn.textContent = "Add"
addBtn.classList = "addButton"

let logoutBtn = document.createElement(`button`)
addBtnDiv.appendChild(logoutBtn)
logoutBtn.textContent = "Loagout"
logoutBtn.classList = "addButton"

//Loagout button
logoutBtn.addEventListener(`click`, (e) => {
    e.preventDefault()
    localStorage.removeItem(`user`)
    window.location.href = `http://127.0.0.1:${port}/index.html`
})



addBtn.addEventListener(`click`, () => innerFormDiv.style.visibility = "visible")

//Form for adding todo card
let innerFormDiv = document.createElement(`div`)
mainDiv.append(innerFormDiv)
//innerFormDiv.style.visibility = "hidden"
innerFormDiv.classList = "todoAddDiv"
let myForm = document.createElement(`form`)
innerFormDiv.appendChild(myForm)
myForm.className = `submitForm`

let addlabel = document.createElement(`label`)
myForm.appendChild(addlabel)
addlabel.textContent =`Add new todo`

let selectType = document.createElement(`select`)
myForm.appendChild(selectType)
selectType.class = `submitSelectType`
type.forEach(temp => {
    let option = document.createElement(`option`)
    selectType.appendChild(option)
    option.textContent = temp
})

let content = document.createElement(`textArea`)
myForm.appendChild(content)
content.type = "text"

let date = document.createElement(`input`)
myForm.appendChild(date)
date.type = "date"
date.value = new Date().toISOString().slice(0, 10)

let postData = document.createElement(`input`)
myForm.appendChild(postData)
postData.type = "submit"
postData.value = "Add"
postData.addEventListener(`click`, (eve) => postTodo(eve))

//Cards
let cardsDiv = document.createElement(`div`)
mainDiv.appendChild(cardsDiv)
cardsDiv.className = `cardsDiv`

getTodo()
//Posting data to database
function postTodo(e) {
    e.preventDefault()
    if (content.value == "") { content.value = "not described" }
    //fetch("https://testapi.io/api/Ramonas/resource/todoApp", {
    fetch(`http://localhost:8092/Todo/create`, {
        method: `POST`,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: selectType.value,
            content: content.value,
            endDate: date.value,
            key: JSON.parse(localStorage.getItem("user")).id
        })
    })
    selectType.value = type[0]
    content.value = ``
    date.value = new Date().toISOString().slice(0, 10)
    innerFormDiv.style.visibility = "hidden"
    setTimeout(() => getTodo(), 2000)
}

//Old way
/*
function getTodo1() {
    clearCards()
    //fetch("https://testapi.io/api/Ramonas/resource/todoApp")
    fetch(`http://localhost:8092/Todo/`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            let result = []
            //data.data.filter(todo => {
            data.filter(todo => {
                if (todo.key == JSON.parse(localStorage.getItem("user")).id) {
                    result.push(todo)
                }
            })
            result.forEach(card => createTodo(card))
        })
}*/

function getTodo() {
    clearCards()
    fetch(`http://localhost:8092/Todo/tasks/${JSON.parse(localStorage.getItem("user")).id}`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        data.forEach(card => createTodo(card))
    })
}

//Creating todo cards from backend
function createTodo(card) {
    //Backup values for cancel
    let backup = [card.type, card.content, card.endDate]

    //Form for adding todo card
    let innerCard = document.createElement(`div`)
    cardsDiv.append(innerCard)
    innerCard.className = `todoCard`
    let myFormCard = document.createElement(`form`)
    innerCard.appendChild(myFormCard)
    myFormCard.classList = `todoCardsForm`

    //Select type
    let selectTypeCard = document.createElement(`select`)
    myFormCard.appendChild(selectTypeCard)
    type.forEach(temp => {
        let option = document.createElement(`option`)
        selectTypeCard.appendChild(option)
        option.textContent = temp
    })
    selectTypeCard.value = card.type

    //Contnet
    let cardContent = document.createElement(`textArea`)
    myFormCard.appendChild(cardContent)
    cardContent.type = "text"
    cardContent.value = card.content

    //End date
    let cardDate = document.createElement(`input`)
    myFormCard.appendChild(cardDate)
    cardDate.type = "date"
    cardDate.value = card.endDate
    //Edit btn
    let cardEdit = document.createElement(`input`)
    myFormCard.appendChild(cardEdit)
    cardEdit.type = "submit"
    cardEdit.value = `Edit`
    selectTypeCard.disabled = true
    cardContent.disabled = true
    cardDate.disabled = true
    cardEdit.addEventListener(`click`, (eve) => editCard(eve, myFormCard))

    //Update btn
    let cardUpdate = document.createElement(`input`)
    myFormCard.appendChild(cardUpdate)
    cardUpdate.type = `submit`
    cardUpdate.value = `Update`
    cardUpdate.addEventListener(`click`, (eve) => updateCard(eve, card.id, myFormCard))

    //Cancel button
    let cardCancel = document.createElement(`input`)
    myFormCard.appendChild(cardCancel)
    cardCancel.type = `submit`
    cardCancel.value = `Cancel`
    cardCancel.addEventListener(`click`, (eve) => cancelUpdate(eve, backup, myFormCard))

    //Delete button
    let cardDelete = document.createElement(`input`)
    myFormCard.appendChild(cardDelete)
    cardDelete.type = `submit`
    cardDelete.value = `Delete`
    cardDelete.addEventListener(`click`, (eve) => deleteCard(eve, card.id))

}
//Edit card method
function editCard(event, myFormCard) {
    event.preventDefault()
    myFormCard.children[0].disabled = false
    myFormCard.children[1].disabled = false
    myFormCard.children[2].disabled = false
}

//Clear cards method
function clearCards() {
    while (cardsDiv.firstChild) {
        cardsDiv.removeChild(cardsDiv.firstChild)
    }
}

//Update card method
function updateCard(e, id, card) {
    e.preventDefault()
    if (card.children[1].value == "") { card.children[1].value = "not described" }
    card[0].disabled = true
    card[1].disabled = true
    card[2].disabled = true
    //fetch(`https://testapi.io/api/Ramonas/resource/todoApp/${id}`, {
        fetch(`http://localhost:8092/Todo/update`, {
        method: `PUT`,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: card.children[0].value,
            content: card.children[1].value,
            endDate: card.children[2].value,
            key: JSON.parse(localStorage.getItem("user")).id
        })
    })

    setTimeout(() => clearCards(), 2000)
    setTimeout(() => getTodo(), 2000)
}

//Cancel update method
function cancelUpdate(e, backup, card) {
    e.preventDefault()
    card.children[0].value = backup[0]
    card.children[1].value = backup[1]
    card.children[2].value = backup[2]

    card.children[0].disabled = true
    card.children[1].disabled = true
    card.children[2].disabled = true
}

//Delete method
function deleteCard(e, id) {
    e.preventDefault()
    //fetch(`https://testapi.io/api/Ramonas/resource/todoApp/${id}`, {
    fetch(`http://localhost:8092/Todo/delete/${id}`, {
        method: `DELETE`,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    setTimeout(() => clearCards(), 2000)
    setTimeout(() => getTodo(), 2000)
}

function preventNoUserConnection() {
    if (JSON.parse(localStorage.getItem("user")) == null || JSON.parse(localStorage.getItem("user")).name.length < 1) {
        window.location.href = `http://127.0.0.1:${port}/index.html`
    }
}