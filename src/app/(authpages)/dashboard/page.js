"use client"

import { Button } from "@/components/ui/button"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import useSession from "@/lib/supabase/use-session";
import axios from "axios";
import { useRouter } from "next/navigation";

function Dashboard() {
    const user = useSession()?.user;

    const supabase = createSupabaseBrowserClient();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        sessionStorage.clear();
        await axios.get('/api/auth/signout');
        router.push("/");
    };



    return (
        <div>
            {user ? (
                <>
                    <p>{`username: ${user?.user_metadata?.full_name}`}</p>
                    <p>{`email: ${user?.email}`}</p>
                </>
            ) : (
                <p>Loading ...</p>
            )}

            <Button onClick={handleSignOut}>
                Sign Out
            </Button>
        </div>
    )
}

export default Dashboard