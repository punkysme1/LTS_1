
import React from 'react';
import { APP_NAME } from '../constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; {currentYear} {APP_NAME}. All rights reserved.</p>
        <p className="text-sm mt-1">Didesain dengan ❤️ untuk pelestarian khazanah intelektual.</p>
      </div>
    </footer>
  );
};

export default Footer;
