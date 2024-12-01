import {BrowserRouter,Routes,Route} from "react-router-dom";
import WelcomePage1 from "./Pages/WelcomePage/WelcomePage1";
import WelcomePage2 from "./Pages//WelcomePage/WelcomePage2";

import { UserProvider } from "./Pages/LoginSignUpPage/UserContext";
import SignUp  from "./Pages/LoginSignUpPage/SignUp";
import Login from "./Pages/LoginSignUpPage/Login";

//import Profile from "./Pages/Profile";

import Monitor from "./Pages/MonitoringPage/Monitor"
import Settings from "./Pages/SettingsPage/Settings";

import './App.css';

function App() {
  return (
    <div className="App">
		<UserProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<WelcomePage1/>}></Route>
					<Route path="/WelcomePage2" element={<WelcomePage2/>}></Route>
					<Route path="/SignUp" element={<SignUp/>}></Route>
					<Route path="/Login" element={<Login/>}></Route>
					<Route path="/Monitor" element={<Monitor/>}></Route>
					<Route path="/Settings" element={<Settings/>}></Route>
					{/*<Route path="/Profile" element={<Profile/>}></Route>
					*/}
				</Routes>
			</BrowserRouter>
		</UserProvider>
    </div>
  );
}

export default App;
