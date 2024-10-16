import Availability from "@/components/availability";
import LoginWithGoogleButton from "@/components/login-with-google-button";
import { H1, P } from "@/components/typography";
import { createClient } from "@/utils/supabase/server";

export default async function Index() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex-1 flex flex-col gap-6 px-4">
      {!user && (
        <div className="flex flex-col justify-center items-center gap-4 mt-10">
          <H1 className="text-center">Velkommen til Ledig</H1>
          <P className="text-center max-w-md">
            Se og eksporter enkelt din tilgjengelighet basert på dine Google
            Kalender-hendelser. Logg inn for å komme i gang.
          </P>
          <LoginWithGoogleButton />
        </div>
      )}

      {user && <Availability user={user} />}
    </main>
  );
}
