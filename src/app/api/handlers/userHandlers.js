"use server"

import sql from "@/db";

export async function getUserFromDB(email){
    try{
        const user = await sql`
            select *
            from next_auth.users
            where email = ${ email }
        `
        return {
            dbUser:user,
            error:null
        };
    }
    catch(err){
        console.log(err);
        return {
            dbUser:null,
            error:err
        };
    }
}

export async function setUserInDB({email, id, image, name, onboarded,usecase}){
    try{
        const user = await sql`
            INSERT INTO next_auth.users (id, name, email, image, onboarded, usecase)
            VALUES (${id}, ${name}, ${email}, ${image}, ${onboarded}, ${usecase})
            ON CONFLICT (email) 
            DO UPDATE SET 
                name = EXCLUDED.name,
                image = EXCLUDED.image
            RETURNING *
        `
        return {
            dbUser: user,
            error: null
        };
    }
    catch(err){
        console.log(err);
        return {
            dbUser: null,
            error: err
        };
    }
}