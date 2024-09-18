
const nombreInput = document.querySelector("#nombre")
const apellidoInput = document.querySelector("#apellido")
const email = document.querySelector("#email")
const edad = document.querySelector("#edad")
const password = document.querySelector("#password")
const botonRegister = document.querySelector("#botonRegister")

const newUser = {
  nombre: "",
  apellido: "",
  email: "",
  edad: "",
  password: ""
}

const handleChange = (e)=>{
  const {name, value} = e.target
  newUser[name] = value
}

nombreInput.addEventListener("input", handleChange)
apellidoInput.addEventListener("input", handleChange)
email.addEventListener("input", handleChange)
edad.addEventListener("input", handleChange)
password.addEventListener("input", handleChange)  

botonRegister.addEventListener("click", async ()=>{
  try{
    const response = await fetch("/api/sessions/register", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json"
      }
    })
    if(response.status === 200 || response.status < 300)
      window.location.href = "/login"
  }catch(e){
    console.log("Error", e)
  }
})
