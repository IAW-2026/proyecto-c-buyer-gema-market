"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Avatar, Field, Input, Button, Icon } from "@/app/components/ui";
import { completeProfileAction } from "@/app/lib/actions/completeProfile";
import { CompleteProfileSchema } from "@/app/lib/schemas/completeProfile";

interface CompleteProfileModalProps {
  fullName: string;
  email: string;
}

type FieldKey = "fullName" | "phoneNumber" | "street" | "number" | "zip";

function getFieldErrors(values: Record<FieldKey, string>) {
  const result = CompleteProfileSchema.safeParse({
    fullName: values.fullName,
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

const ALL_FIELDS: FieldKey[] = ["fullName", "phoneNumber", "street", "number", "zip"];

export default function CompleteProfileModal({
  fullName,
  email,
}: CompleteProfileModalProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(completeProfileAction, null);

  const [values, setValues] = useState<Record<FieldKey, string>>({
    fullName,
    phoneNumber: "",
    street: "",
    number: "",
    zip: "",
  });
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});

  const fieldErrors = getFieldErrors(values);
  const isValid = Object.keys(fieldErrors).length === 0;

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-[4px]">
      <div className="w-full max-w-[480px]">
        <Card padding={24}>
          <div className="flex items-center gap-3.5 mb-5">
            <Avatar name={values.fullName || fullName} size={48} />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-base truncate">
                {values.fullName || "Tu nombre"}
              </div>
              <div className="text-[13px] text-ink-3 [overflow-wrap:anywhere]">
                {email}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-bone flex items-center justify-center text-olive shrink-0">
              <Icon name="user" size={18} />
            </div>
            <div>
              <h2 className="m-0 text-[17px] font-bold leading-tight">
                Completá tu perfil
              </h2>
              <div className="text-xs text-ink-3">
                Necesitamos estos datos para procesar tus pedidos.
              </div>
            </div>
          </div>

          <form action={formAction} onSubmit={handleSubmit}>
            <input type="hidden" name="fullName" value={values.fullName} />
            <input type="hidden" name="phoneNumber" value={values.phoneNumber} />
            <input type="hidden" name="street" value={values.street} />
            <input type="hidden" name="number" value={values.number} />
            <input type="hidden" name="zip" value={values.zip} />

            <div className="grid grid-cols-1 gap-3.5">
              <Field
                label="Nombre completo"
                error={touched.fullName ? fieldErrors.fullName : undefined}
                inputId="cp-fullName"
              >
                <Input
                  id="cp-fullName"
                  icon="user"
                  placeholder="Juan Pérez"
                  value={values.fullName}
                  onChange={handleChange("fullName")}
                  onBlur={handleBlur("fullName")}
                  aria-invalid={!!(touched.fullName && fieldErrors.fullName)}
                />
              </Field>
              <Field
                label="Teléfono"
                error={touched.phoneNumber ? fieldErrors.phoneNumber : undefined}
                inputId="cp-phone"
              >
                <Input
                  id="cp-phone"
                  icon="phone"
                  placeholder="+54 9 11 1234 5678"
                  value={values.phoneNumber}
                  onChange={handleChange("phoneNumber")}
                  onBlur={handleBlur("phoneNumber")}
                  aria-invalid={!!(touched.phoneNumber && fieldErrors.phoneNumber)}
                />
              </Field>
              <Field
                label="Calle"
                error={touched.street ? fieldErrors.street : undefined}
                inputId="cp-street"
              >
                <Input
                  id="cp-street"
                  icon="pin"
                  placeholder="Av. Colón"
                  value={values.street}
                  onChange={handleChange("street")}
                  onBlur={handleBlur("street")}
                  aria-invalid={!!(touched.street && fieldErrors.street)}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Número"
                  error={touched.number ? fieldErrors.number : undefined}
                  inputId="cp-number"
                >
                  <Input
                    id="cp-number"
                    placeholder="1234"
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
                  inputId="cp-zip"
                >
                  <Input
                    id="cp-zip"
                    placeholder="8000"
                    inputMode="numeric"
                    value={values.zip}
                    onChange={handleChange("zip", true)}
                    onBlur={handleBlur("zip")}
                    aria-invalid={!!(touched.zip && fieldErrors.zip)}
                  />
                </Field>
              </div>
            </div>

            {state && !state.ok && (
              <div className="mt-4 p-3 rounded-2xl flex items-center gap-3 bg-danger/10 text-danger">
                <div className="w-7 h-7 rounded-full flex items-center justify-center bg-danger/20 shrink-0">
                  <Icon name="alert" size={16} />
                </div>
                <span className="text-sm font-semibold">{state.error}</span>
              </div>
            )}

            <div className="mt-5">
              <Button
                full
                type="submit"
                variant="accent"
                icon={isPending ? undefined : "check"}
                disabled={isPending || !isValid}
              >
                {isPending ? "Guardando..." : "Guardar y continuar"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
