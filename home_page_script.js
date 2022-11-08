let myDiv = document.createElement(`div`)
document.body.appendChild(myDiv)
myDiv.className = `myDiv`


let registerBtn = document.createElement(`button`)
myDiv.append(registerBtn)
registerBtn.textContent = `Register`

let loginBtn = document.createElement(`button`)
myDiv.append(loginBtn)
loginBtn.textContent = `Login`

registerBtn.addEventListener(`click`,()=>{
    window.location.href=`http://127.0.0.1:${port}/register/register.html`
})

loginBtn.addEventListener(`click`, ()=>{
    window.location.href=`http://127.0.0.1:${port}/login/login.html`
})