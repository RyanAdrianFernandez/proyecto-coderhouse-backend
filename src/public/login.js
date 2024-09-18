const buttonLogin = document.querySelector("#botonLogin")
const emailInput = document.querySelector("#email")
const passwordInput = document.querySelector("#password")

const user = {
  email: "",
  password: ""
}

const handleChange = (e)=>{
  const { name, value } = e.target
  user[name] = value
}   

emailInput.addEventListener("input", handleChange)
passwordInput.addEventListener("input", handleChange)

buttonLogin.addEventListener("click", async()=>{
  try{
    const response = await fetch("/api/sessions/login", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json"
      }

    })
    if(response.status === 200 || response.status < 300)
      window.location.href = "/perfil"
    }catch(e){
      console.log("Error", e)
  }
})