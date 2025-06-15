"use server"

import { cookies } from "next/headers"
import { NextResponse } from "next/server";

export async function GET(req){
    try{
        let cookieStore = await cookies();
        cookieStore.getAll().forEach(cookie => {
            console.log(cookie)
            cookieStore.delete(cookie.name);
          });
        return new NextResponse(JSON.stringify({}),{status:200})
    }
    catch(err){
        console.log(err.message)
        return new NextResponse(JSON.stringify({}),{status:500})
    }
}