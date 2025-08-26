"use client"

import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { setTheme, theme } = useTheme();

  return (
    <>
      <Header title="Configurações" />
      <main className="flex-1 overflow-auto p-4 md:p-6 pt-28">
        <div className="max-w-2xl grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>
                Atualize as informações da sua conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" defaultValue="Estudante" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="estudante@email.com"
                  disabled
                />
              </div>
              <Button>Salvar Alterações</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>
                Personalize a aparência do aplicativo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                defaultValue={theme}
                onValueChange={setTheme}
                className="grid max-w-md grid-cols-2 gap-8 pt-2"
              >
                <Label className="[&:has([data-state=checked])>div]:border-primary">
                  <RadioGroupItem value="light" className="sr-only" />
                  <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                    <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                      <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                        <div className="h-2 w-4/5 rounded-lg bg-[#ecedef]" />
                        <div className="h-2 w-full rounded-lg bg-[#ecedef]" />
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                        <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                        <div className="h-2 w-full rounded-lg bg-[#ecedef]" />
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                        <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                        <div className="h-2 w-full rounded-lg bg-[#ecedef]" />
                      </div>
                    </div>
                  </div>
                  <span className="block w-full p-2 text-center font-normal">
                    Claro
                  </span>
                </Label>
                <Label className="[&:has([data-state=checked])>div]:border-primary">
                  <RadioGroupItem value="dark" className="sr-only" />
                  <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:border-accent">
                    <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                      <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                        <div className="h-2 w-4/5 rounded-lg bg-slate-400" />
                        <div className="h-2 w-full rounded-lg bg-slate-400" />
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                        <div className="h-4 w-4 rounded-full bg-slate-400" />
                        <div className="h-2 w-full rounded-lg bg-slate-400" />
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                        <div className="h-4 w-4 rounded-full bg-slate-400" />
                        <div className="h-2 w-full rounded-lg bg-slate-400" />
                      </div>
                    </div>
                  </div>
                  <span className="block w-full p-2 text-center font-normal">
                    Escuro
                  </span>
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Senha</CardTitle>
              <CardDescription>
                Altere sua senha. Recomendamos usar uma senha forte.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input id="new-password" type="password" />
              </div>
              <Button>Alterar Senha</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
