import "./globals.css";
import Link from "next/link";
import {getSession} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import LogoutButton from "./logout-button";

export const metadata={title:"Sciences Nature Campus",description:"Cours, TD, TP et IA pour L1 et L2."};

export default async function Layout({children}:{children:React.ReactNode}){
  const session=await getSession();
  const user=session?await prisma.user.findUnique({where:{id:session.id}}):null;

  return <>
    <header className="nav">
      <div className="container navin">
        <Link href="/" className="brand">Sciences Nature <span>Campus</span></Link>
        <nav className="links">
          <Link href="/ressources">Ressources</Link>
          <Link href="/professeur-ia">Professeur IA</Link>
          <Link href="/quiz">Quiz</Link>
          {user?<Link href="/dashboard">Mon espace</Link>:null}
          {user?.role==="ADMIN"?<Link href="/admin">Admin</Link>:null}
          {user
            ?<LogoutButton/>
            :<><Link href="/login">Connexion</Link><Link href="/register">Créer mon compte</Link></>
          }
        </nav>
      </div>
    </header>
    {children}
    <footer className="footer">Sciences Nature Campus — L1 & L2 Sciences de la Nature</footer>
  </>;
}
