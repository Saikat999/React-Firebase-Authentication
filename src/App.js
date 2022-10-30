import './App.css';
import initializeAuthentication from './Firebase/Firebase.initialize';
import { getAuth, signInWithPopup, GoogleAuthProvider,createUserWithEmailAndPassword,signInWithEmailAndPassword,sendEmailVerification, sendPasswordResetEmail  } from "firebase/auth";
import { useState } from 'react';

initializeAuthentication();
const googleProvider = new GoogleAuthProvider();
function App() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] =useState('');
  const [isLogin, setIsLogin] = useState(false);

  const auth = getAuth();
  const handleGoogleSignIn =()=>{
  signInWithPopup(auth,googleProvider)
  .then(result =>{
    const user = result.user;
    console.log(user);
  })
  }

  const toggleLogin = e =>{
    setIsLogin(e.target.checked);
  }

  const handleEmailChange = e =>{
    setEmail(e.target.value);
  }

  const handlePasswordChange = e =>{
    setPassword(e.target.value);
  }

  const handleRegistration = e =>{
    e.preventDefault();
    console.log(email, password);
    if(password.length < 6){
      setError('Password must be at least 6 characters long');
      return;
    }
   
    isLogin? processLogin(email,password): registerNewUser(email,password)
    
  }
  const processLogin = (email,password)=>{
    signInWithEmailAndPassword(auth, email, password)
    .then(result => {
      const user = result.user;
      console.log(user);
      setError('');
    })
    .catch((error) => {
      setError(error.message);
    });

  }

  const registerNewUser = (email, password)=>{
    createUserWithEmailAndPassword(auth, email,password)
    .then(result=>{
      const user= result.user;
      console.log(user);
      setError('');
      verifyEmail();
    })
    .catch((error) => {
      setError(error.message);
    });
  }

  const verifyEmail = ()=>{
    sendEmailVerification(auth.currentUser)
    .then(result=> {
      console.log(result);
    });
  }

  const handleResetPassword = ()=>{
    sendPasswordResetEmail(auth, email)
    .then(result => {
      
    })
    .catch((error) => {
      setError(error.message);
    });
  }

  return (
    <div className="mx-5">
     <form onSubmit={handleRegistration}>
      <h3 className='text-center mb-3 text-primary'>{isLogin ? 'Login Form': 'Register Form'}</h3>
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input onBlur={handleEmailChange} type="email" className="form-control" id="inputEmail3" required/>
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <input onBlur={handlePasswordChange} type="password" className="form-control" id="inputPassword3" required/>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input onChange={toggleLogin} className="form-check-input" type="checkbox" id="gridCheck1"/>
              <label className="form-check-label" htmlFor="gridCheck1">
                Already registered?
              </label>
            </div>
          </div>
        </div>
        <div className="row mb-3 text-danger">{
        error}</div>
        <button type="submit" className="btn btn-primary mr-5">{isLogin ? 'Login': 'Register'}</button>
        <button type="button" onClick={handleResetPassword} className="btn btn-secondary btn-sm ml-3">Reset Password</button>
    </form>

<br /><br /><br />

      <button onClick={handleGoogleSignIn}>Google Sign In</button>
    </div>
  );
}

export default App;
