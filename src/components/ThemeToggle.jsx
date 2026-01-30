import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {theme === 'dark' ? (
                <FaSun className="w-5 h-5 text-yellow-400 transition-transform duration-500 hover:rotate-90" />
            ) : (
                <FaMoon className="w-5 h-5 text-slate-600 transition-transform duration-500 hover:-rotate-12" />
            )}
        </button>
    );
};

export default ThemeToggle;
