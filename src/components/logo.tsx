import { Sprout } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="JivanIndia.co">
        <Sprout className="h-7 w-7 text-primary" />
        <span className="font-headline text-2xl font-bold text-shadow">JivanIndia.co</span>
    </div>
  );
}
