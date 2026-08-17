"use client";

import { Controller, type Control } from "react-hook-form";
import StringInput from "@/components/admin/BilingualInput";
import type { ContentCreateInput } from "@/lib/validation";

interface ContactIntroFieldsProps {
  control: Control<ContentCreateInput>;
}

export default function ContactIntroFields({ control }: ContactIntroFieldsProps) {
  return (
    <>
      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent border-b border-primary/10 pb-4 mb-8">Section Intro</h3>
      <div className="grid grid-cols-1 gap-6 mb-8">
        <Controller
          name="contactHeading"
          control={control}
          render={({ field }) => (
            <StringInput
              label="Contact Heading"
              value={field.value}
              onChange={field.onChange}
              placeholder="START\nMISSION."
            />
          )}
        />
        <Controller
          name="contactSubheading"
          control={control}
          render={({ field }) => (
            <StringInput
              label="Contact Subheading"
              value={field.value}
              onChange={field.onChange}
              type="textarea"
              rows={3}
            />
          )}
        />
        <Controller
          name="contactAvailability"
          control={control}
          render={({ field }) => (
            <StringInput
              label="Availability Text"
              value={field.value}
              onChange={field.onChange}
              placeholder="Usually replies within 24 hours..."
            />
          )}
        />
      </div>
    </>
  );
}
