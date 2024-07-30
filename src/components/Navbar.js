import React from 'react'
import LogoImage from "../assets/images/transparent-quest-logo.png";

export default function Navbar() {
  return (
    <nav className="navbar bg-body-tertiary" data-bs-theme="dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src={LogoImage} alt="Logo" width="30" height="30" className="d-inline-block align-text-top"/>
          Chatbot
        </a>
      </div>
    </nav>
  )
}
