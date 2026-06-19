"use client";

import { useActionState, useState, useEffect } from "react";
import { Card, Avatar, Field, Input, Button, Icon } from "@/app/components/ui";
import { SignOutButton } from "@clerk/nextjs";
import type { Usuario } from "@prisma/client";
import type { Address } from "@/app/lib/types/user";
import { updateAccountAction } from "../../lib/actions/account";
import { AccountSchema } from "@/app/lib/schemas/account";

interface AccountFormProps {
  initialData: Usuario;
}

type FieldKey = "fullName" | "email" | "phoneNumber" | "street" | "number" | "zip";

function getFieldErrors(values: Record<FieldKey, string>) {
  const result = AccountSchema.safeParse({
    fullName: values.fullName,
    email: values.email,
    phoneNumber: values.phoneNumber,
    address: {
      street: values.street,
      number: values.number,
      zip: values.zip,
    },
  });
  const errors: Partial<Record<FieldKey, string>> = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      const path = issue.path;
      const key = (path[0] === "address" ? path[1] : path[0]) as FieldKey;
      if (key && !errors[key]) errors[key] = issue.message;
    }
  }
  return errors;
}

const ALL_FIELDS: FieldKey[] = [
  "fullName", "email", "phoneNumber", "street", "number", "zip",
];

export default function AccountForm({ initialData }: AccountFormProps) {
  const initialAddress = (initialData.address as unknown as Address) || {
    street: "",
    number: "",
    zip: "",
  };

  const [values, setValues] = useState<Record<FieldKey, string>>({
    fullName: initialData.fullName ?? "",
    email: initialData.email ?? "",
    phoneNumber: initialData.phoneNumber ?? "",
    street: initialAddress.street ?? "",
    number: initialAddress.number ?? "",
    zip: initialAddress.zip ?? "",
  });
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [state, formAction, isPending] = useActionState(updateAccountAction, null);
  const [showBanner, setShowBanner] = useState(false);

  const fieldErrors = getFieldErrors(values);
  const isValid = Object.keys(fieldErrors).length === 0;

  useEffect(() => {
    if (!state) return;
    const showTimer = setTimeout(() => setShowBanner(true), 0);
    const hideTimer = setTimeout(() => setShowBanner(false), 3500);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [state]);

  const handleChange =
    (field: FieldKey, digitsOnly = false) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = digitsOnly ? e.target.value.replace(/\D/g, "") : e.target.value;
      setValues((prev) => ({ ...prev, [field]: val }));
    };

  const handleBlur = (field: FieldKey) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = () => {
    const all: Partial<Record<FieldKey, boolean>> = {};
    ALL_FIELDS.forEach((f) => (all[f] = true));
    setTouched(all);
  };

  return (
    <div className="p-4 min-[600px]:max-w-[760px] min-[600px]:mx-auto min-[600px]:p-6 lgx:max-w-[760px] lgx:mx-auto lgx:p-0">
      <Card padding={20} className="mb-4">
        <div className="flex items-center gap-3.5">
          <Avatar name={values.fullName} size={64} />
          <div className="flex-1 min-w-0">
            <div className="text-lg font-bold">{values.fullName}</div>
            <div className="text-[13px] text-ink-3 [overflow-wrap:anywhere]">
              {values.email}
            </div>
          </div>
        </div>
      </Card>

      <form action={formAction} onSubmit={handleSubmit}>
        {/* Hidden inputs para el server action */}
        <input type="hidden" name="fullName" value={values.fullName} />
        <input type="hidden" name="email" value={values.email} />
        <input type="hidden" name="phoneNumber" value={values.phoneNumber} />
        <input type="hidden" name="street" value={values.street} />
        <input type="hidden" name="number" value={values.number} />
        <input type="hidden" name="zip" value={values.zip} />

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
            <Field
              label="Nombre completo"
              error={touched.fullName ? fieldErrors.fullName : undefined}
              inputId="acc-fullName"
            >
              <Input
                id="acc-fullName"
                icon="user"
                value={values.fullName}
                onChange={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                aria-invalid={!!(touched.fullName && fieldErrors.fullName)}
              />
            </Field>
            <Field
              label="Email"
              error={touched.email ? fieldErrors.email : undefined}
              inputId="acc-email"
            >
              <Input
                id="acc-email"
                icon="mail"
                type="email"
                value={values.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                aria-invalid={!!(touched.email && fieldErrors.email)}
              />
            </Field>
            <Field
              label="Teléfono"
              error={touched.phoneNumber ? fieldErrors.phoneNumber : undefined}
              inputId="acc-phone"
            >
              <Input
                id="acc-phone"
                icon="phone"
                value={values.phoneNumber}
                onChange={handleChange("phoneNumber")}
                onBlur={handleBlur("phoneNumber")}
                aria-invalid={!!(touched.phoneNumber && fieldErrors.phoneNumber)}
              />
            </Field>
            <Field
              label="Dirección"
              error={touched.street ? fieldErrors.street : undefined}
              inputId="acc-street"
            >
              <Input
                id="acc-street"
                icon="pin"
                value={values.street}
                onChange={handleChange("street")}
                onBlur={handleBlur("street")}
                aria-invalid={!!(touched.street && fieldErrors.street)}
              />
            </Field>
            <Field
              label="Número"
              error={touched.number ? fieldErrors.number : undefined}
              inputId="acc-number"
            >
              <Input
                id="acc-number"
                inputMode="numeric"
                value={values.number}
                onChange={handleChange("number", true)}
                onBlur={handleBlur("number")}
                aria-invalid={!!(touched.number && fieldErrors.number)}
              />
            </Field>
            <Field
              label="Código postal"
              error={touched.zip ? fieldErrors.zip : undefined}
              inputId="acc-zip"
            >
              <Input
                id="acc-zip"
                inputMode="numeric"
                value={values.zip}
                onChange={handleChange("zip", true)}
                onBlur={handleBlur("zip")}
                aria-invalid={!!(touched.zip && fieldErrors.zip)}
              />
            </Field>
          </div>

          {state && showBanner && (
            <div
              className={`mt-6 p-3.5 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                state.ok
                  ? "bg-forest/10 text-forest"
                  : "bg-danger/10 text-danger"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  state.ok ? "bg-forest/20" : "bg-danger/20"
                }`}
              >
                <Icon name={state.ok ? "sparkle" : "alert"} size={18} />
              </div>
              <span className="text-sm font-semibold">
                {state.ok ? "¡Perfil actualizado con éxito!" : state.error}
              </span>
            </div>
          )}
        </Card>

        <div className="fixed bottom-[74px] lgx:bottom-0 left-0 right-0 bg-paper/95 backdrop-blur-[12px] border-t border-line p-4 z-[45] lgx:!static lgx:!bg-transparent lgx:!border-t-0 lgx:!px-7 lgx:!pb-8 lgx:!pt-0">
          <div className="flex gap-2.5 max-w-[760px] mx-auto max-[420px]:flex-col lgx:pt-[18px] lgx:border-t lgx:border-line">
            <Button
              full
              type="submit"
              variant="accent"
              icon={isPending ? undefined : "check"}
              disabled={isPending || !isValid}
            >
              {isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
            <SignOutButton>
              <Button full variant="danger" icon="logout" disabled={isPending}>
                Cerrar sesión
              </Button>
            </SignOutButton>
          </div>
        </div>
      </form>
    </div>
  );
}
