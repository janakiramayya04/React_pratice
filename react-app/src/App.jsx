import { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handlelogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("username or password not to be empty");
      return;
    }
    setError("");
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail || "Login Failed");
        return;
      }
      console.log("API Response:", data);
      localStorage.setItem("token",data.access_token)
      setSuccess("Login successful!");
      const token=localStorage.getItem("token");
      const protectedResponse=await fetch("http://localhost:8000/protected",{
        method:"GET",
        headers:{
          Authorization:`Bearer ${token}`,
        },
      })
       if (!protectedResponse.ok) {
      setError("Unauthorized access");
      return;
    }
    const protectedData = await protectedResponse.json();
    console.log("Protected API response:", protectedData);
    alert(protectedData.message)
    } catch (err) {
      console.error("API Error", err);
      setError("Something went wrong");
    }
  };
  return (
    <div>
      <form onSubmit={handlelogin}>
        <input
          type="text"
          value={username}
          placeholder="enter you username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="enter you password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        {/* <button onClick={handlelogin}> Login</button> */}

        <button type="submit"> submit</button>
      </form>
    </div>
  );
}

export default App;
