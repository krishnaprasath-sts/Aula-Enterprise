import React from 'react';
import Hero from '../components/home/Hero';
import TrustStrip from '../components/home/TrustStrip';
import CompanyProfile from '../components/home/CompanyProfile';
import WhyChooseUs from '../components/home/WhyChooseUs';
import PermitProcess from '../components/home/PermitProcess';
import PermitTypes from '../components/home/PermitTypes';
import Benefits from '../components/home/Benefits';
import LeadCTA from '../components/home/LeadCTA';


const Home = () => {
  return (
    <div style={{ width: '100%', overflowX: 'clip' }}>
      <Hero />
      <TrustStrip />
      <CompanyProfile />
      <WhyChooseUs />
      <PermitProcess />
      <PermitTypes />
      <Benefits />
      <LeadCTA />
    </div>
  );
};

export default Home;
