import { Form, Link, useLoaderData } from "@remix-run/react";
import { ModeToggle } from "./mode-toggle";
import { authenticator, requireUserId } from "~/utils/auth.server";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Button } from "./ui/button";
import { prisma } from "~/db.server";

const Navbar = ({ isAuthenticated }: { isAuthenticated: Boolean }) => {
  return (
    <header className="container flex justify-between items-center py-10 border-b">
      <div className="w-full">
        <Link to="/">
          <span>Movie</span>
          <span>Diary</span>
        </Link>
      </div>

      <nav className="flex gap-8 items-center">
        <Link to="/profile">Profile</Link>
        <Link to="/movies">Movies</Link>
        {isAuthenticated ? (
          <>
            <Form action="/logout" method="POST">
              <Button variant="secondary" type="submit">
                Logout
              </Button>
            </Form>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}

        <ModeToggle />
      </nav>
    </header>
  );
};

export default Navbar;
