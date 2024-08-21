import React from 'react'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'

// Code for navBar links 
const navLinks = [
    { name: 'Home', route: '/' },
    { name: 'Instructors', route: '/instructors' },
    { name: 'Classes', route: '/classes' },
]

export const NavBar = () => {

    const [navBg, setNavBg] = useState('bg-[#15151580]');

    return (
        <nav>
            <div className='lg:w-[95%] mx-auto sm:px-6 lg:px-6'>

                <div className='px-4 py-4 flex items-center justify-center'>
                    {/* Logo */}
                    <div>
                        <h1 className='text-2xl inline-flex gap-3 items-center font-bold'>FitnessClass
                            <img src="../../../public/App-logo.png" alt="Logo"
                                className='w-8 h-8' />
                        </h1>
                        <p className='font-bold text-[13px] tracking-[8px]'>Quick Explore</p>
                    </div>

                    {/* Mobile menu icons */}

                    {/* Navigational Links */}
                    <div className='hidden md:block text-black dark:text-white'>
                        <div className='flex'>
                            <ul className='ml-10 flex items-center space-x-4 pr-4'>
                                {
                                    // Code for navBar links 
                                    navLinks.map((link) => (
                                        <li key={link.route} >
                                            <NavLink to={link.route} className={({ isActive }) =>
                                                `font-bold ${isActive ? 'text-secondary' :  `${navBg.includes('bg-transparent') ? 'text-white' : 'text-black dark:text-white'} `} hover:text-secondary duration-300`

                                            }>{link.name}</NavLink>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </nav>
    )
}
