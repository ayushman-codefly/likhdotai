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

export async function getUserCredits(id){
    try{        
        const user = await sql
        .from('credits')
        .select('*')
        .eq('user_id', id)
        
        if(user.data.length === 0){
            return {
                credits: 30,
                error: null
            };
        }
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        // Check if credits are for current month/year
        if (user.data[0].chat_credits.month !== currentMonth || user.data[0].chat_credits.year !== currentYear) {
            return {
                credits: 30, // Reset to 30 for new month
                error: null
            };
        }
        
        return {
            credits: user.data[0].chat_credits.credits,
            error: null
        };
    }
    catch(err){
        console.log(err);
        return {
            credits: 0,
            error: err
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

export async function updateUserInDB({email, id:uuid, image, fullname, usecase}){
    try{
        email = encrypt(email);
        fullname = encrypt(fullname);
        const user = await sql.from("users").update({email, usecase, fullname, image}).eq("uuid", uuid)
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