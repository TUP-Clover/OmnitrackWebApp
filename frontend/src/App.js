import {BrowserRouter,Routes,Route} from "react-router-dom";
import WelcomePage1 from "./Pages/WelcomePage1";
import WelcomePage2 from "./Pages/WelcomePage2";
import SignUp  from "./Pages/SignUp";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Navigate from "./Pages/Navigate";
import Profile from "./Pages/Profile";
import Settings from "./Pages/Settings";
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
      <Route path="/Home" element={<Home/>}></Route>
      <Route path="/Navigate" element={<Navigate/>}></Route>
      <Route path="/Profile" element={<Profile/>}></Route>
      <Route path="/Settings" element={<Settings/>}></Route>
     </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
