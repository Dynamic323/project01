import React, { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  // const sendToWhatsApp = (event) => {

  // };
  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();

          if (name == "" || email == "") {
            alert("error can not be empty");
          }

          const msg = `
    Hello my name is ${name}
    `;

          console.log(name, email, phone);
        }}
      >
        <fieldset>
          <input
            type="text"
            id="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Your name"
            required
          />
          <br />
          <input
            type="email"
            id="email"
            onChange={(e) => setemail(e.target.value)}
            value={email}
            placeholder="Your email"
            required
          />
          <br />
          <input
            type="number"
            onChange={(e) => setphone(e.target.value)}
            value={phone}
            placeholder="+234"
          />
          <button type="submit">Send via WhatsApp</button>
        </fieldset>
      </form>
    </div>
  );
}

export default App;
