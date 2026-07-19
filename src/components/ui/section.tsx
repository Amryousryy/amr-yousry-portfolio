import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Section({ children, className, id, ...props }: SectionProps) {
  return (
    <section id={id} className={cn("py-20 md:py-28 lg:py-32", className)} {...props}>
      {children}
    </section>
  );
}
