"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  TopBar,
  Card,
  Avatar,
  Field,
  Input,
  Button,
  Icon,
} from "@/app/components/ui";

export default function AccountPage() {
  const router = useRouter();

  // ACA DEBERA TRAER LOS DATOS DEL USUARIO
  // Hacer query a la base de datos y obtener los datos del usuario
  // Deberiamos tener una funcion en lib/db/user para obtener los datos del usuario

  const [form, setForm] = useState({
    name: "Lucía Méndez",
    email: "lucia.mendez@uns.edu.ar",
    phone: "+54 291 456 7821",
    dni: "41.284.903",
    street: "Av. Alem",
    number: "1253",
    apartment: "4B",
    zip: "8000",
    city: "Bahía Blanca",
  });

  const update =
    (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [key]: e.target.value });

  const handleSave = () => {
    alert("Datos actualizados");
  };

  const handleLogout = () => {
    router.push("/");
    // SALE DE LA SESION DE CLERK
    // USE LA FUNCION DE CLERK PARA CERRAR SESION
  };

  return (
    <div className="min-h-screen bg-cream pb-[188px] lgx:pt-8 lgx:px-7 lgx:pb-32">
      <div className="lgx:hidden">
        <TopBar title="Cuenta" />
      </div>
      <div className="p-4 min-[600px]:max-w-[760px] min-[600px]:mx-auto min-[600px]:p-6 lgx:max-w-[760px] lgx:mx-auto lgx:p-0">
        <Card padding={20} className="mb-4">
          <div className="flex items-center gap-3.5">
            <Avatar name={form.name} size={64} />
            <div className="flex-1 min-w-0">
              <div className="text-lg font-bold">{form.name}</div>
              <div className="text-[13px] text-ink-3 [overflow-wrap:anywhere]">
                {form.email}
              </div>
            </div>
          </div>
        </Card>

        <Card padding={20}>
          <div className="flex items-center gap-2.5 mb-[18px]">
            <div className="w-9 h-9 rounded-xl bg-bone flex items-center justify-center text-olive">
              <Icon name="user" size={18} />
            </div>
            <div>
              <h2 className="m-0 text-[17px] font-bold">
                Información de perfil
              </h2>
              <div className="text-xs text-ink-3">
                Estos datos se usan para tus compras y entregas.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 min-[600px]:grid-cols-2 lgx:grid-cols-2 lgx:gap-4">
            <Field label="Nombre completo">
              <Input icon="user" value={form.name} onChange={update("name")} />
            </Field>
            <Field label="Email">
              <Input
                icon="mail"
                type="email"
                value={form.email}
                onChange={update("email")}
              />
            </Field>
            <Field label="Teléfono">
              <Input
                icon="phone"
                value={form.phone}
                onChange={update("phone")}
              />
            </Field>
            <Field label="DNI">
              <Input value={form.dni} onChange={update("dni")} />
            </Field>
            <Field label="Ciudad">
              <Input icon="pin" value={form.city} onChange={update("city")} />
            </Field>
            <Field label="Código postal">
              <Input value={form.zip} onChange={update("zip")} />
            </Field>
            <Field label="Dirección">
              <Input
                icon="pin"
                value={form.street}
                onChange={update("street")}
              />
            </Field>
            <Field label="Número">
              <Input value={form.number} onChange={update("number")} />
            </Field>
            <Field label="Departamento" optional>
              <Input value={form.apartment} onChange={update("apartment")} />
            </Field>
          </div>
        </Card>
      </div>

      <div className="fixed bottom-[74px] lgx:bottom-0 left-0 right-0 bg-paper/95 backdrop-blur-[12px] border-t border-line p-4 z-[45] lgx:!static lgx:!bg-transparent lgx:!border-t-0 lgx:!px-7 lgx:!pb-8 lgx:!pt-0">
        <div className="flex gap-2.5 max-w-[760px] mx-auto max-[420px]:flex-col lgx:pt-[18px] lgx:border-t lgx:border-line">
          <Button full variant="accent" icon="check" onClick={handleSave}>
            Guardar cambios
          </Button>
          <Button full variant="danger" icon="logout" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
