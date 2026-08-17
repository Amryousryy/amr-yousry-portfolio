"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { getFieldError } from "@/lib/form-field-error";
import type { ContentCreateInput } from "@/lib/validation";

interface DirectContactFieldsProps {
  register: UseFormRegister<ContentCreateInput>;
  errors: FieldErrors<ContentCreateInput>;
}

export default function DirectContactFields({ register, errors }: DirectContactFieldsProps) {
  return (
    <>
      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent border-b border-primary/10 pb-4 mb-8">Direct Contact</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="pixel-text text-[10px] text-foreground/40 block uppercase">
            Public Contact Email
          </label>
          <input
            type="email"
            {...register("contactEmail")}
            className="w-full bg-background border border-primary/20 p-4 outline-none focus:border-accent text-sm"
            placeholder="amr@example.com"
          />
          {getFieldError(errors, "contactEmail") && (
            <p className="text-[10px] text-red-500">{getFieldError(errors, "contactEmail")}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="pixel-text text-[10px] text-foreground/40 block uppercase">WhatsApp Number (with country code)</label>
          <input
            type="text"
            {...register("whatsappNumber")}
            className="w-full bg-background border border-primary/20 p-4 outline-none focus:border-accent text-sm"
            placeholder="201000000000"
          />
        </div>
      </div>
    </>
  );
}
