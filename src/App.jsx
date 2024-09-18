import React,{useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Header from './components/header.jsx';
import Home from './components/home.jsx';
import SearchPage from './components/searchPage.jsx'; 

function App() {
  const [pincode, setPinCode] = useState(['742136']);
  
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home pincode={pincode} setPinCode={setPinCode}/>} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;

