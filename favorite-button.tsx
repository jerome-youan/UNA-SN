"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";

export default function FavoriteButton({resourceId,initialFavorited,loggedIn}:{resourceId:string;initialFavorited:boolean;loggedIn:boolean}){
  const [favorited,setFavorited]=useState(initialFavorited);
  const [busy,setBusy]=useState(false);
  const router=useRouter();

  async function toggle(){
    if(!loggedIn){router.push("/login");return}
    setBusy(true);
    try{
      const r=await fetch("/api/favorites",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({resourceId})
      });
      if(r.ok){
        const d=await r.json();
        setFavorited(d.favorited);
        router.refresh();
      }
    }finally{setBusy(false)}
  }

  return <button
    type="button"
    className="btn secondary"
    onClick={toggle}
    disabled={busy}
    style={favorited?{background:"#fff1e0",color:"#b5680a"}:undefined}
  >
    {favorited?"★ Favori":"☆ Ajouter aux favoris"}
  </button>;
}
