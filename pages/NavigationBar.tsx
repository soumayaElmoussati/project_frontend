import React from 'react';

interface NavigationBarProps {}

const NavigationBar: React.FC<NavigationBarProps> = () => {
  const categories = ['Animations', 'Branding', 'Illustration', 'Mobile', 'Print', 'Product Design', 'Typography', 'Web Design']; // Replace with your categories

  return (
    <nav className="navbar">
      <ul>
        {categories.map((category) => (
          <li key={category}>
            <a href="#">{category}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationBar;
