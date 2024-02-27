import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function Login() {
  return (
    <main className="container flex-1 h-full flex flex-col items-center justify-center">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form method="post" action="/login" className="space-y-8">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input type="text" name="username" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" required />
            </div>

            <div className="flex justify-center items-center">
              <Button className="mx-auto" type="submit">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
