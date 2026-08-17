import { describe, it, expect } from "vitest";
import ContactIntroFields from "@/components/admin/ContactIntroFields";
import DirectContactFields from "@/components/admin/DirectContactFields";
import SocialLinksFields from "@/components/admin/SocialLinksFields";
import { contentCreateSchema } from "@/lib/validation";

describe("ContactIntroFields", () => {
  it("exports a valid React component", () => {
    expect(typeof ContactIntroFields).toBe("function");
  });
});

describe("DirectContactFields", () => {
  it("exports a valid React component", () => {
    expect(typeof DirectContactFields).toBe("function");
  });
});

describe("SocialLinksFields", () => {
  it("exports a valid React component", () => {
    expect(typeof SocialLinksFields).toBe("function");
  });
});

describe("Contact field names are valid ContentCreateInput paths", () => {
  const shape = contentCreateSchema.shape;

  it("contactHeading is a valid field", () => {
    expect(shape).toHaveProperty("contactHeading");
  });

  it("contactSubheading is a valid field", () => {
    expect(shape).toHaveProperty("contactSubheading");
  });

  it("contactAvailability is a valid field", () => {
    expect(shape).toHaveProperty("contactAvailability");
  });

  it("contactEmail is a valid field", () => {
    expect(shape).toHaveProperty("contactEmail");
  });

  it("whatsappNumber is a valid field", () => {
    expect(shape).toHaveProperty("whatsappNumber");
  });

  it("socialLinks is a valid field", () => {
    expect(shape).toHaveProperty("socialLinks");
  });
});
