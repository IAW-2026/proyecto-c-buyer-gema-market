"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui";
import { deleteUsuarioAdminAction } from "@/app/lib/actions/admin/usuarios";

interface Props {
  id: string;
  disabled?: boolean;
}

export function DeleteUsuarioButton({ id, disabled }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onClick = () => {
    if (!window.confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteUsuarioAdminAction(id);
      if (result.ok) {
        router.push("/admin/usuarios");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      <Button
        variant="danger"
        icon="trash"
        onClick={onClick}
        disabled={disabled || isPending}
      >
        {isPending ? "Eliminando..." : "Eliminar"}
      </Button>
      {error && (
        <span className="text-xs text-danger max-w-[280px] text-right">
          {error}
        </span>
      )}
    </div>
  );
}
