import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FrontPage from '../components/login/frontpage';
import AdminLogin from '../components/login/adminlogin';
import UserLogin from '../components/login/userlogin';
import AdminFP from '../components/admin/adminfp';
import UserFP from "../components/user/userfp";
import AboutUs from "../components/user/aboutus";
import View from "../components/user/view";
import Other from "../components/events/other/other";
import Sport from "../components/events/sport/sport";
import Tech from "../components/events/tech/tech";
import WC from "../components/events/wc/wc";
import Fare from "../components/events/wc/fare";
import W from "../components/register/wc/w";
import T from "../components/register/tech/t";
import S from "../components/register/sport/s";
import O from "../components/register/other/o";
import F from "../components/register/wc/f"; 
import TieSheet from "../components/events/sport/TieSheet"; 

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<FrontPage />} />
      <Route path="/adminlogin" element={<AdminLogin />} />
      <Route path="/userlogin" element={<UserLogin />} />
      <Route path="/adminfp" element={<AdminFP />} />
      <Route path="/userfp" element={<UserFP />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/view" element={<View />} />
      <Route path="/events/other" element={<Other />} />
      <Route path="/events/sport" element={<Sport />} />
      <Route path="/events/tech" element={<Tech />} />
      <Route path="/events/wc" element={<WC />} />
      <Route path="/events/fare" element={<Fare />} />
      <Route path="/register/s" element={<S />} />
      <Route path="/register/t" element={<T />} />
      <Route path="/register/w" element={<W />} />
      <Route path="/register/f" element={<F />} /> {/* Corrected path */}
      <Route path="/register/o" element={<O />} />
    
        <Route path="/events/TieSheet" element={<TieSheet />} />
    </Routes>
  );
}

export default AppRoutes;
