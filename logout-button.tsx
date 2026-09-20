"use client";
import {useRouter} from "next/navigation";

export default function LogoutButton(){
  const router=useRouter();
  async function go(){
    await fetch("/api/auth/logout",{method:"POST"});
    router.push("/");
    router.refresh();
  }
  return <a href="#" onClick={e=>{e.preventDefault();go()}}>Déconnexion</a>;
}
