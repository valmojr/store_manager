'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export default function LoginForm() {
  const loginFormSchema = z.object({
    username: z.string().min(2).max(50),
    password: z.string().min(8).max(100)
  });

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  const router = useRouter();
  const { toast } = useToast();

  function onSubmitLogin(values: z.infer<typeof loginFormSchema>) {
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(values),
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();

        if (data.status === 200) {
          toast({
            description: "Logado com Sucesso",
          });

          router.push('/dashboard');
        } else if (data.status === 401) {
          toast({
            description: "Usuário ou senha inválido",
          })
        } else {
          toast({
            description: "Algo deu errado",
          })
        }
      } else {
        const errorData = await response.json();
        toast({
          description: errorData.error,
        })
        alert(errorData.error);
      }
    })
      .catch((error) => {
        console.error("Error during login", error);
      });
  }

  return (
    <>
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className={cn(
          "flex flex-col flex-nowrap",
          "w-full space-y-4")}>
          <FormField
            control={loginForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" type={'password'} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" variant={'default'} type="submit">Login</Button>
          <Link className="w-full" href={"/register"}><Button className="w-full" variant={'secondary'} type="submit">Registrar-se</Button></Link>
        </form>
      </Form>
    </>
  )
}