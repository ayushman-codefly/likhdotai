"use client"

import { getUserFromDB } from "@/app/api/handlers/userHandlers";
import { Button } from "@/components/ui/button"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import useSession from "@/lib/supabase/use-session";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Dashboard() {
    const user = useSession()?.user;

    const supabase = createSupabaseBrowserClient();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        sessionStorage.clear();
        router.push("/");
    };

    const checkUserOnboarded = async() => {
        let email = user?.email;
        let {dbUser ,error} = await getUserFromDB(email);
        console.log({error,dbUser})
        if(!error && dbUser.length === 0){
            router.push('/onboarding');

        }

    }

    useEffect(()=>{
        if(!user){
            return;

        }
        checkUserOnboarded();        
    },[user])



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