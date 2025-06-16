"use client"

import OnboardingPage from "@/components/onboarding-page";
import useSession from "@/lib/supabase/use-session";

function Onboarding({}){
    const user = useSession()?.user;
    console.log(user);
    return(
        <OnboardingPage userId={user?.id} email={user?.email} />
    )
}

export default Onboarding;