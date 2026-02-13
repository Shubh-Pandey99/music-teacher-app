import { AuthError } from "next-auth"
import { redirect } from "next/navigation"
import { z } from "zod"

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

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(1, "Password is required."),
})

type LoginSearchParams = {
    error?: string | string[]
}

type LoginPageProps = {
    searchParams: Promise<LoginSearchParams>
}

function getErrorMessage(error: string | string[] | undefined) {
    if (!error) return undefined

    return Array.isArray(error) ? error[0] : error
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const { error } = await searchParams
    const errorMessage = getErrorMessage(error)

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

                        const validated = loginSchema.safeParse({
                            email: formData.get("email"),
                            password: formData.get("password"),
                        })

                        if (!validated.success) {
                            const message = encodeURIComponent(validated.error.issues[0].message)
                            redirect(`/login?error=${message}`)
                        }

                        try {
                            await signIn("credentials", {
                                ...validated.data,
                                redirectTo: "/dashboard",
                            })
                        } catch (authError) {
                            if (authError instanceof AuthError && authError.type === "CredentialsSignin") {
                                const message = encodeURIComponent("Invalid email or password")
                                redirect(`/login?error=${message}`)
                            }

                            throw authError
                        }
                    }}
                >
                    <CardContent className="grid gap-4">
                        {errorMessage ? (
                            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                {errorMessage}
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
