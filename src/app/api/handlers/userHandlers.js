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
                credits: 100, // Updated to 100 for new users
                error: null
            };
        }
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        // Check if credits are for current month/year
        if (user.data[0].chat_credits.month !== currentMonth || user.data[0].chat_credits.year !== currentYear) {
            return {
                credits: 100, // Reset to 100 for new month
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

export async function assignInitialCredits(userId) {
    try {
        // Check if credits already exist for this user
        const existingCredits = await sql
            .from('credits')
            .select('*')
            .eq('user_id', userId)
        
        // If credits already exist, don't do anything
        if (existingCredits.data.length > 0) {
            console.log(`Credits already exist for user ${userId}, skipping assignment`);
            return {
                success: true,
                message: "Credits already exist",
                error: null
            };
        }
        
        // Create initial credits for the user
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const creditData = {
            user_id: userId,
            chat_credits: {
                credits: 100,
                month: currentMonth,
                year: currentYear
            }
        };
        
        const result = await sql
            .from('credits')
            .insert(creditData);
        
        console.log(`Successfully assigned 100 initial credits to user ${userId}`);
        
        return {
            success: true,
            message: "Initial credits assigned successfully",
            error: null
        };
    }
    catch(err) {
        console.log("Error assigning initial credits:", err);
        return {
            success: false,
            message: "Failed to assign initial credits",
            error: err
        };
    }
}

export async function setUserInDB({email, id:uuid, image, fullname,usecase}){
    try{
        email = encrypt(email);
        fullname = encrypt(fullname);
        const user = await sql.from("users").insert({email,uuid,usecase,fullname,image})
        
        // Automatically assign initial credits to new user
        await assignInitialCredits(uuid);
        
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