"use server"

import sql from "@/db";
import { decrypt, encrypt } from "@/lib/utils";

export async function getUserFromDB(id){
    try{        
        const user = await sql
        .from('users')
        .select('*')
        .eq('uuid', id)
        if(user.data.length === 0){
            return {
                dbUser: null,
                error: null
            };
        }
        let decryptedEmail = decrypt(user.data[0].email);
        let decryptedFullName = decrypt(user.data[0].fullname);
        let decryptedUser = {
            ...user.data[0],
            email: decryptedEmail,
            fullname: decryptedFullName,
        }
        return {
            dbUser:decryptedUser,
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

export async function setUserInDB({email, id:uuid, image, fullname,usecase}){
    try{
        email = encrypt(email);
        fullname = encrypt(fullname);
        const user = await sql.from("users").insert({email,uuid,usecase,fullname,image})
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