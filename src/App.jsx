import { useState } from "react";
import { auth, googleProvider } from "./firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const googleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    setUser(result.user);
  };

  const signup = async () => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    setUser(result.user);
  };

  const login = async () => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    setUser(result.user);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Firebase Auth</h1>

      {user ? (
        <>
          <h3>Welcome {user.email}</h3>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={googleLogin}>Sign in with Google</button>

          <br /><br />

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <br />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <br /><br />

          <button onClick={signup}>Sign Up</button>
          <button onClick={login}>Login</button>
        </>
      )}
    </div>
  );
}

export default App;