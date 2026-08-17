"use client";

import { type UseFormRegister, type FieldErrors, type FieldPath } from "react-hook-form";
import { getFieldError } from "@/lib/form-field-error";
import { socialLinks } from "@/data/social-links";
import type { ContentCreateInput } from "@/lib/validation";

type FormData = ContentCreateInput;

interface SocialLinksFieldsProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export default function SocialLinksFields({ register, errors }: SocialLinksFieldsProps) {
  return (
    <>
      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent border-b border-primary/10 pb-4 mb-8">Social Media Links</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { platform: "instagram", url: socialLinks.instagram },
          { platform: "facebook", url: socialLinks.facebook },
          { platform: "behance", url: socialLinks.behance },
          { platform: "twitter", url: "" },
          { platform: "youtube", url: "" },
          { platform: "linkedin", url: socialLinks.linkedin },
        ].map(({ platform, url }) => {
          const errorKey = `socialLinks.${platform}` as unknown as FieldPath<FormData>;
          return (
            <div key={platform} className="space-y-2">
              <label className="pixel-text text-[10px] text-foreground/40 block uppercase">{platform}</label>
              <input
                type="url"
                {...register(errorKey)}
                className="w-full bg-background border border-primary/20 p-4 outline-none focus:border-accent text-sm"
                placeholder={url}
                defaultValue={url}
              />
              {getFieldError(errors, `socialLinks.${platform}`) && (
                <p className="text-[10px] text-red-500">{getFieldError(errors, `socialLinks.${platform}`)}</p>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
