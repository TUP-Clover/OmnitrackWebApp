import {BrowserRouter,Routes,Route} from "react-router-dom";
import WelcomePage1 from "./Pages/WelcomePage/WelcomePage1";
import WelcomePage2 from "./Pages//WelcomePage/WelcomePage2";
import SignUp  from "./Pages/LoginSignUpPage/SignUp";
import Login from "./Pages/LoginSignUpPage/Login";
import Profile from "./Pages/Profile";
import Settings from "./Pages/Settings";
import Monitor from "./Pages/MonitoringPage/Monitor"
import './App.css';

function App() {
  return (
    <div className="App">
     <BrowserRouter>
     <Routes>
      <Route path="/" element={<WelcomePage1/>}></Route>
      <Route path="/WelcomePage2" element={<WelcomePage2/>}></Route>
      <Route path="/SignUp" element={<SignUp/>}></Route>
      <Route path="/Login" element={<Login/>}></Route>
      <Route path="/Monitor" element={<Monitor/>}></Route>
      <Route path="/Profile" element={<Profile/>}></Route>
      <Route path="/Settings" element={<Settings/>}></Route>
     </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
