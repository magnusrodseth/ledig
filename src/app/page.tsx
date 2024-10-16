import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default async function Index() {
  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
        <Button variant="outline" className="flex gap-2">
          <Icons.googleCalendar className="w-5 h-5 " />
          Jeg er ledig...
        </Button>
      </main>
    </>
  );
}
