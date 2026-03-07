
import { useState } from "react"
import "../styles/register.css"
function Register(){
    const [form,setform]=useState({

        username:'',
        Email:'',
        Password:'',
        confirmpass:''

    })
    return (
        <form className="register-container" >
            <h2 style={{textAlign:'center'}}>Join Skill Swap</h2>
            <input type="text" name="name" placeholder="username" value={form.username}/>
            <input type="text" name="Email" placeholder="Email" value={form.Email}/>
            <input type="text" name="password" placeholder="Password" value={form.Password}/>
            <input type="text" name="confirm pass" placeholder="Confirm password" value={form.confirmpass}/>
            <button type="submit">Register</button>

            <div className="login-link">Already have an account? Login</div>
            </form>
        
    )
}
export default Register