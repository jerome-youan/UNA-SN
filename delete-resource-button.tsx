"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";

export default function DeleteResourceButton({id,title}:{id:string;title:string}){
  const [busy,setBusy]=useState(false);
  const router=useRouter();

  async function del(){
    if(!confirm(`Supprimer la ressource « ${title} » ?`)) return;
    setBusy(true);
    try{
      const r=await fetch(`/api/admin/resources/${id}`,{method:"DELETE"});
      if(r.ok) router.refresh();
      else{const d=await r.json();alert(d.error||"Suppression impossible.")}
    }finally{setBusy(false)}
  }

  return <button className="btn secondary" onClick={del} disabled={busy}>{busy?"...":"Supprimer"}</button>;
}
