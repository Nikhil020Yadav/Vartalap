import React from 'react'
import logo from '../assets/logo.png'
const AuthLayouts = ({children}) => {
  return (
    <>

        <header className='flex justify-center items-center py-3 h-20 shadow-md bg-slate-400'>
            <img
                src={logo}
                alt='logo'
                width={150}
                height={30}
            >
            </img>
        </header>

        {children}
    </>
  )
}

export default AuthLayouts
