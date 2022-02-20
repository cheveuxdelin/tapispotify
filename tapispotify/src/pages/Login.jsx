const base_url = "http://localhost:3001";

function Login() {
    function login() {
        window.location.href = `${base_url}/login`;
        localStorage.setItem("loggedin", "true");
    }

    return (
        <div>
            <button onClick={login}>login</button>
        </div>
    )
}

export default Login;