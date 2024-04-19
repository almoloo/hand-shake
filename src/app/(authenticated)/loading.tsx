import { LoaderIcon } from "lucide-react";

export default function Loading() {
  return (
    <section className="flex h-full grow items-center justify-center">
      <LoaderIcon className="h-16 w-16 animate-spin text-indigo-950" />
    </section>
  );
}
