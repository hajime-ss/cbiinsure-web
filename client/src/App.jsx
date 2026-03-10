import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CustomerForm from './pages/CustomerForm';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import WhyUs from './pages/WhyUs';
import QuoteResults from './pages/QuoteResults';

import InsuranceInfo from './pages/InsuranceInfo';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import About from './pages/About';
import Policies from './pages/Policies';
import Claims from './pages/Claims';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/quotes" element={<QuoteResults />} />
          <Route path="/insurance-info" element={<InsuranceInfo />} />
          <Route path="/apply" element={<CustomerForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/why-us" element={<WhyUs />} />
          <Route path="/why-us" element={<WhyUs />} />
          <Route path="/about" element={<About />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
