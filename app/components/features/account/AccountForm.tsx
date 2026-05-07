"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, Avatar, Field, Input, Button, Icon } from "@/app/components/ui";
import type { Usuario } from "@prisma/client";
import { Address } from "@/app/lib/db/user";
import { updateAccountAction } from "../../../lib/actions/account";

interface AccountFormProps {
  initialData: Usuario;
}

export default function AccountForm({ initialData }: AccountFormProps) {
  const router = useRouter();

  // Cast del JSON de Prisma al tipo Address conocido
  const initialAddress = (initialData.address as unknown as Address) || {
    street: "",
    city: "",
    postalCode: "",
  };

  const [form, setForm] = useState({
    fullName: initialData.fullName || "",
    email: initialData.email || "",
    phoneNumber: initialData.phoneNumber || "",
    address: initialAddress,
  });

  const [isPending, setIsPending] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Manejador para campos de primer nivel
  const updateField =
    (key: keyof Omit<typeof form, "address">) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [key]: e.target.value });

  // Manejador para campos anidados de dirección
  const updateAddress =
    (key: keyof Address) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm({
        ...form,
        address: { ...form.address, [key]: e.target.value },
      });

  const handleSave = async () => {
    setIsPending(true);
    setNotification(null);
    try {
      const result = await updateAccountAction(form);
      if (result.success) {
        setNotification({
          type: "success",
          message: "¡Perfil actualizado con éxito!",
        });
      } else {
        setNotification({
          type: "error",
          message: result.error || "No se pudieron guardar los cambios.",
        });
      }
    } catch (error) {
      console.error(error);
      setNotification({
        type: "error",
        message: "Error inesperado al guardar los datos.",
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="p-4 min-[600px]:max-w-[760px] min-[600px]:mx-auto min-[600px]:p-6 lgx:max-w-[760px] lgx:mx-auto lgx:p-0">
      <Card padding={20} className="mb-4">
        <div className="flex items-center gap-3.5">
          <Avatar name={form.fullName} size={64} />
          <div className="flex-1 min-w-0">
            <div className="text-lg font-bold">{form.fullName}</div>
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
            <h2 className="m-0 text-[17px] font-bold">Información de perfil</h2>
            <div className="text-xs text-ink-3">
              Estos datos se usan para tus compras y entregas.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5 min-[600px]:grid-cols-2 lgx:grid-cols-2 lgx:gap-4">
          <Field label="Nombre completo">
            <Input
              icon="user"
              value={form.fullName}
              onChange={updateField("fullName")}
            />
          </Field>
          <Field label="Email">
            <Input
              icon="mail"
              type="email"
              value={form.email}
              onChange={updateField("email")}
            />
          </Field>
          <Field label="Teléfono">
            <Input
              icon="phone"
              value={form.phoneNumber}
              onChange={updateField("phoneNumber")}
            />
          </Field>
          <Field label="Ciudad">
            <Input
              icon="pin"
              value={form.address.city}
              onChange={updateAddress("city")}
            />
          </Field>
          <Field label="Código postal">
            <Input
              value={form.address.postalCode}
              onChange={updateAddress("postalCode")}
            />
          </Field>
          <Field label="Dirección">
            <Input
              icon="pin"
              value={form.address.street}
              onChange={updateAddress("street")}
            />
          </Field>
        </div>

        {notification && (
          <div
            className={`mt-6 p-3.5 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
              notification.type === "success"
                ? "bg-forest/10 text-forest"
                : "bg-danger/10 text-danger"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                notification.type === "success"
                  ? "bg-forest/20"
                  : "bg-danger/20"
              }`}
            >
              <Icon
                name={notification.type === "success" ? "sparkle" : "alert"}
                size={18}
              />
            </div>
            <span className="text-sm font-semibold">
              {notification.message}
            </span>
          </div>
        )}
      </Card>

      <div className="fixed bottom-[74px] lgx:bottom-0 left-0 right-0 bg-paper/95 backdrop-blur-[12px] border-t border-line p-4 z-[45] lgx:!static lgx:!bg-transparent lgx:!border-t-0 lgx:!px-7 lgx:!pb-8 lgx:!pt-0">
        <div className="flex gap-2.5 max-w-[760px] mx-auto max-[420px]:flex-col lgx:pt-[18px] lgx:border-t lgx:border-line">
          <Button
            full
            variant="accent"
            icon={isPending ? undefined : "check"}
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
          <Button
            full
            variant="danger"
            icon="logout"
            onClick={handleLogout}
            disabled={isPending}
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}

