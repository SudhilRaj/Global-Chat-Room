import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase-client";
import { Session } from "@supabase/supabase-js";
import { Login, Chats } from "./components";
import { GlobalStyle } from "./styles";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <GlobalStyle />
      {!session ? <Login /> : <Chats session={session} />}
      {/* {!session ? <Login /> : <ChatRoom session={session} />} */}
    </>
  );
}

export default App;
