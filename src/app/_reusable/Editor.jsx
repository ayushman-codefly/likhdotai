"use client"

import Quill from "quill";
import { useEffect, useState } from "react"
import "quill/dist/quill.core.css";
import Link from 'quill/formats/link';
import { Delta } from 'quill';
import Toolbar from "quill/modules/toolbar";
import Snow from "quill/themes/snow";
import Bold from "quill/formats/bold";
import Italic from "quill/formats/italic";
import Header from "quill/formats/header";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, BoldIcon, Image, ItalicIcon, Link2, Space, Table, Table2, UnderlineIcon } from "lucide-react";

function EditorPage({}) {
    const [quill,setQuill] = useState(null);

    const validationKey = "09c565dd-7e6c-4680-a699-edf5bfc509f4";

    const loadSwalekh = async (lang = "hi", mode = "keyboard") => {
        if (!window.initSwalekh || !window.loadSwalekh) return;

        await window.initSwalekh({ 
            validationKey, 
            optional: { 
                theme: "fresh" 
            }, 
            creds:{
                querySel: '.ql-editor',
                lang,
                mode,
                langToggle: true,
                modeToggle: true,  
            }
        });
    }

    useEffect(()=>{
        console.log("inside")
        Quill.register({
            "modules/toolbar": Toolbar,
            "themes/snow": Snow,
            "formats/bold": Bold,
            "formats/italic": Italic,
            "formats/header": Header,
            "formats/link": Link
          });
          
            const q = new Quill('#editor', {
            theme: 'snow'
          });
          setQuill(q);
    },[])

    useEffect(()=>{
        if(!quill){
            return;
        }

        loadSwalekh();

    },[quill])
    return(
        <div className=" w-full px-10 flex flex-col mt-20 items-center align-center justify-center h-24 text-black">
            <div id="toolbar" className="mt-10 grid grid-cols-24 w-10/11">
                <BoldIcon className={`border-1 border-blue-600 bg-blue-100 h-10 w-10 p-2 rounded-md`} />
                <ItalicIcon className={`border-1 border-blue-600 bg-blue-100 h-10 w-10 p-2 rounded-md`}  />
                <UnderlineIcon className={`border-1 border-blue-600 bg-blue-100 h-10 w-10 p-2 rounded-md`}  />
                <Space className="invisible" />
                <AlignLeft className={`border-1 border-blue-600 bg-blue-100 h-10 w-10 p-2 rounded-md`} />
                <AlignCenter className={`border-1 border-blue-600 bg-blue-100 h-10 w-10 p-2 rounded-md`}  />
                <AlignRight className={`border-1 border-blue-600 bg-blue-100 h-10 w-10 p-2 rounded-md`} />
                <AlignJustify className={`border-1 border-blue-600 bg-blue-100 h-10 w-10 p-2 rounded-md`}  />
                <Space className="invisible" />
                <Link2 className={`border-1 border-blue-600 bg-blue-100 h-10 w-10 p-2 rounded-md`}  />
                <Image className={`border-1 border-blue-600 bg-blue-100 h-10 w-10 p-2 rounded-md`}  />
                <Table className={`border-1 border-blue-600 bg-blue-100 h-10 w-10 p-2 rounded-md`} />
                <Space className="invisible" />

            </div>
            <div id="editor" className="border-1 bg-white border-slate-400 rounded-md w-10/11"></div>
        </div>
    )
}

export default EditorPage