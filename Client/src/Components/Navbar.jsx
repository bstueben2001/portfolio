import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/info" className={({ isActive }) => isActive ? 'active' : ''}>
        Info Mode
      </NavLink>
      <NavLink to="/fun" className={({ isActive }) => isActive ? 'active' : ''}>
        Fun Mode
      </NavLink>
    </nav>
  )
}

export default Navbar
