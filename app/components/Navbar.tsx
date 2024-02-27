import { Link } from "@remix-run/react";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
  return (
    <header className="container flex justify-between items-center py-10">
      <div className="w-full">
        <Link to="/">
          <span>Movie</span>
          <span>Diary</span>
        </Link>
      </div>

      <nav className="flex gap-8 items-center">
        <Link to="/profile">Profile</Link>
        <Link to="/login">Login</Link>
        <ModeToggle />
      </nav>
    </header>
  );
};

export default Navbar;
