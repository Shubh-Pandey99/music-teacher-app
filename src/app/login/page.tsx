import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LoginPageProps = {
    searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const { error } = await searchParams

    return (
        <div className="flex h-screen w-full items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account.
                    </CardDescription>
                </CardHeader>
                <form
                    action={async (formData) => {
                        "use server"

                        try {
                            await signIn("credentials", {
                                ...Object.fromEntries(formData),
                                redirectTo: "/dashboard",
                            })
                        } catch (authError) {
                            if (authError instanceof AuthError && authError.type === "CredentialsSignin") {
                                redirect("/login?error=Invalid%20email%20or%20password")
                            }

                            throw authError
                        }
                    }}
                >
                    <CardContent className="grid gap-4">
                        {error ? (
                            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                {error}
                            </p>
                        ) : null}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">Sign in</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
