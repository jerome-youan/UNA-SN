"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";

export default function DeleteQuizButton({id,title}:{id:string;title:string}){
  const [busy,setBusy]=useState(false);
  const router=useRouter();

  async function del(){
    if(!confirm(`Supprimer le quiz « ${title} » ? Les résultats des étudiants seront aussi supprimés.`)) return;
    setBusy(true);
    try{
      const r=await fetch(`/api/admin/quizzes/${id}`,{method:"DELETE"});
      if(r.ok) router.refresh();
      else{const d=await r.json();alert(d.error||"Suppression impossible.")}
    }finally{setBusy(false)}
  }

  return <button className="btn secondary" onClick={del} disabled={busy}>{busy?"...":"Supprimer"}</button>;
}
