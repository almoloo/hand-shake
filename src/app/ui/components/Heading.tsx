import { LucideIcon } from "lucide-react";

export default function Heading({
  className,
  title,
  description,
  icon,
}: {
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ReactElement;
}) {
  return (
    <section className={`${className} pt-10 pb-5`}>
      <h2 className="flex items-center text-xl font-bold">
        {icon && <span className="mr-2 text-neutral-500">{icon}</span>}
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm text-neutral-500">{description}</p>
      )}
    </section>
  );
}
