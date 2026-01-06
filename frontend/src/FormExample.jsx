import { useState } from "react";

function FormExample() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault(); // stops refresh
    console.log("Form submitted!");
    console.log("Name:", name);
    console.log("Email:", email);
  }

  return (
    <div>
      <h2>React Form Example</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <br /><br />

        <label>
          Email:
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <br /><br />

        <button>Submit</button>
      </form>

      <h3>Live Preview</h3>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
    </div>
  );
}

export default FormExample;
