import React, { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ImpactStats from '../components/ImpactStats';
import DonateSection from '../components/DonateSection';

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'HopeMeals | Fighting Student Hunger in Pune';
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ImpactStats />
      <DonateSection />
    </>
  );
};

export default HomePage;