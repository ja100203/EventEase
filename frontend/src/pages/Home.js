// Home.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import '../styles/main.css';
import { CalendarDays, Clock, LayoutGrid, Users } from 'lucide-react';
import image4 from '../images/image4.jpg';
import image3 from '../images/image3.jpg';
import image2 from '../images/image2.jpg';
import image1 from '../images/image1.jpg';


const Home = () => {
  const features = [
    {
      title: 'Easy Bookings',
      desc: 'Manage guests, venues, and services with a click.',
      icon: <CalendarDays size={32} color="#f43f5e" />,
      image: image3
    },
    {
      title: 'Real-time Updates',
      desc: 'Get instant notifications and live guest tracking.',
      icon: <Clock size={32} color="#f43f5e" />,
      image: image4,
    },
    {
      title: 'Interactive Event Planner',
      desc: 'Create and manage your own events effortlessly.',
      icon: <LayoutGrid size={32} color="#f43f5e" />,
      image: image2,
    },
    {
      title: 'Team Management',
      desc: 'Collaborate with your team in real time.',
      icon: <Users size={32} color="#f43f5e" />,
      image: image1,
    },
  ];

  return (
    <div className="homepage-wrapper">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="body-padding">
        <section className="main-box text-center">
          <div className="container" style={{ position: "relative", zIndex: 2 }}>
            <h1 className="hero-title">Plan. <span style={{ color: "#f43f5e" }}> Manage.</span> Celebrate.</h1>
            <p className="hero-tagline">Your all-in-one event management solution for private & public events.</p>
            <a href="#" className="btn get-started-btn">Get Started</a>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <h2>Our Features</h2>
            <div className="row g-4">
              {features.map((feature, idx) => (
                <div className="col-md-6 col-lg-3" key={idx}>
                  <div className="feature-card">
                    <img src={feature.image} alt={feature.title} />
                    <div className="feature-icon text-center">{feature.icon}</div>
                    <div className="feature-title text-center">{feature.title}</div>
                    <div className="feature-desc text-center">{feature.desc}</div>
                    <button className="learn-btn">Learn More</button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer mt-5">
        <div className="container text-center">
          <small>&copy; {new Date().getFullYear()} EventEase. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
};

export default Home;
