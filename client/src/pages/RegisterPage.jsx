import { useState } from "react";
import { useAuth } from "../contexts/authentication";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { register } = useAuth();

  const handleSubmit = (event) => {
    event.preventDefault();
    // 🐨 Todo: Exercise #2
    // นำ Function `register` ใน AuthContext มา Execute ใน Event Handler ตรงนี้
    const data = {
      username,
      password,
      firstName,
      lastName,
      email,
    };
    register(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Register Form</h1>
        <div>
          <label>
            Username
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username here"
              onChange={(event) => {
                setUsername(event.target.value);
              }}
              value={username}
            />
          </label>
        </div>
        <div>
          <label>
            Password
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password here"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              value={password}
            />
          </label>
        </div>
        <div>
          <label>
            First Name
            <input
              id="firstname"
              name="firstname"
              type="text"
              placeholder="Enter first name here"
              onChange={(event) => {
                setFirstName(event.target.value);
              }}
              value={firstName}
            />
          </label>
        </div>
        <div>
          <label>
            Last Name
            <input
              id="lastname"
              name="lastname"
              type="text"
              placeholder="Enter last name here"
              onChange={(event) => {
                setLastName(event.target.value);
              }}
              value={lastName}
            />
          </label>
        </div>
        <div >
          <label>
            Email
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter last name here"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              value={email}
            />
          </label>
        </div>
        <div >
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
