import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import OAuth from "../components/OAuth";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      // auth.currentUser is null just after above (it waits
      // for the response from the server). But getAuth() does not
      // behave like async function, I don't understand it
      // 100%. auth needs to be passed to another function,
      // like below createUserWithEmailAndPassword and that
      // function somehow waits for the response, so auth
      // is updated with currentUser value

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Seems to me like userCredential.user and auth.currentUser are the same thing in this particular situation
      // userCredential.user === auth.currentUser returns true

      const user = userCredential.user;

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, formDataCopy);

      navigate("/");
    } catch (error) {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong with registration");
      }
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Create new user</p>
        </header>

        <main></main>

        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="nameInput"
            placeholder="Name"
            id="name"
            value={name}
            onChange={onChange}
          />
          <input
            type="email"
            className="emailInput"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
          />
          <div className="passwordInputDiv">
            <input
              type={showPassword ? "text" : "password"}
              className="passwordInput"
              placeholder="Password"
              id="password"
              value={password}
              onChange={onChange}
            />

            <img
              src={visibilityIcon}
              alt="show password"
              className="showPassword"
              onClick={() => setShowPassword(!showPassword)}
              // tutaj zrobiłem inaczej, zamiast przekazywać funkcję strzałkową anonimową z prevState przekazuję od razu negację obecnego stanu i działa bez błędów hmm...
            />
          </div>

          <div className="signUpBar">
            <p className="signUpText">Sign up</p>
            <button className="signUpButton">
              <ArrowRightIcon fill="#fff" width="34px" height="34px" />
            </button>
          </div>
        </form>

        <OAuth />

        <Link to="/sign-in" className="registerLink">
          Or sign in here
        </Link>
      </div>
    </>
  );
}

export default SignUp;
