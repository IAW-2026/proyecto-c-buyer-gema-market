"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Logo, Field, Input, Button, Icon } from "@/app/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock login delay
    setTimeout(() => {
      setLoading(false);
      router.push("/");
    }, 700);
  };

  return (
    <div className="w-screen min-h-screen bg-cream px-5 py-6 flex flex-col lgx:items-center lgx:justify-center lgx:p-12">
      <div className="mb-8 lgx:fixed lgx:top-8 lgx:left-8 lgx:m-0">
        <button
          onClick={() => router.push("/")}
          className="w-10 h-10 rounded-full bg-paper flex items-center justify-center active:scale-90 transition-transform shadow-sh-1"
        >
          <Icon name="arrowLeft" size={18} />
        </button>
      </div>
      <div className="max-w-[420px] mx-auto w-full flex-1 lgx:flex-none lgx:max-w-[520px] lgx:bg-paper lgx:border lgx:border-line lgx:rounded-[26px] lgx:shadow-sh-3 lgx:px-14 lgx:pt-[52px] lgx:pb-9">
        <button
          onClick={() => router.push("/")}
          className="inline-flex lgx:flex lgx:justify-center lgx:w-full active:scale-95 transition-transform"
        >
          <Logo size={32} />
        </button>
        <h1 className="text-[32px] font-semibold mt-8 mb-2 lgx:text-center lgx:text-4xl lgx:mt-7">
          {mode === "login" ? "Hola de nuevo." : "Bienvenido."}
        </h1>
        <p className="text-ink-3 m-0 mb-8 text-[15px] lgx:text-center lgx:mb-[34px]">
          {mode === "login"
            ? "Iniciá sesión para seguir comprando."
            : "Creá tu cuenta y empezá en menos de un minuto."}
        </p>
        <form onSubmit={submit} className="flex flex-col gap-4">
          {mode === "register" && (
            <Field label="Nombre completo">
              <Input
                icon="user"
                placeholder="Juliana Pérez"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                required
              />
            </Field>
          )}
          <Field label="Email">
            <Input
              icon="mail"
              type="email"
              placeholder="vos@uns.edu.ar"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
            />
          </Field>
          <Field
            label="Contraseña"
            hint={mode === "register" ? "Mínimo 8 caracteres." : undefined}
          >
            <Input
              icon="lock"
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPass(e.target.value)
              }
              required
            />
          </Field>
          {mode === "login" && (
            <a
              href="#"
              className="self-end text-[13px] text-moss font-medium hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          )}
          <Button full size="lg" type="submit" disabled={loading}>
            {loading
              ? "Cargando…"
              : mode === "login"
                ? "Ingresar"
                : "Crear cuenta"}
          </Button>
          <div className="flex items-center gap-3 my-2 text-ink-3">
            <div className="flex-1 h-px bg-line" />
            <span className="text-xs font-mono">o</span>
            <div className="flex-1 h-px bg-line" />
          </div>
          <Button full size="lg" variant="secondary" icon="user">
            Continuar con tu correo UNS
          </Button>
        </form>
      </div>
      <div className="text-center mt-6 text-sm text-ink-2 lgx:mt-[18px]">
        {mode === "login" ? "¿Sos nuevo? " : "¿Ya tenés cuenta? "}
        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-forest font-semibold hover:underline"
        >
          {mode === "login" ? "Creá tu cuenta" : "Iniciá sesión"}
        </button>
      </div>
    </div>
  );
}
