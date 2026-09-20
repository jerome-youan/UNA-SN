import {prisma} from "@/lib/prisma";
import {getSession} from "@/lib/auth";
import FavoriteButton from "./favorite-button";

export default async function R({searchParams}:{searchParams:Promise<{level?:string;subject?:string}>}){
  const q=await searchParams;
  const level=q.level==="L2"?"L2":"L1";

  const resources=await prisma.resource.findMany({
    where:{level:level as any,...(q.subject?{subjectId:q.subject}:{})},
    include:{subject:true},
    orderBy:{createdAt:"desc"}
  });
  const subjects=await prisma.subject.findMany({where:{level:level as any}});

  const session=await getSession();
  const favoriteIds=session
    ?new Set((await prisma.favorite.findMany({where:{userId:session.id},select:{resourceId:true}})).map(f=>f.resourceId))
    :new Set<string>();

  return <main className="container"><section className="section">
    <span className="badge">{level}</span>
    <h1>Bibliothèque pédagogique</h1>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:25}}>
      <a className="btn secondary" href={`/ressources?level=${level}`}>Toutes</a>
      {subjects.map(s=><a className="btn secondary" href={`/ressources?level=${level}&subject=${s.id}`} key={s.id}>{s.name}</a>)}
    </div>
    <div className="grid">
      {resources.map(x=><article className="card" key={x.id}>
        <span className="badge">{x.type}</span>
        <h3>{x.title}</h3>
        <p className="muted">{x.subject.name}</p>
        <p>{x.description}</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10}}>
          {x.fileUrl?<a className="btn" href={x.fileUrl} download>Télécharger</a>:<span className="muted">PDF à importer</span>}
          <FavoriteButton resourceId={x.id} initialFavorited={favoriteIds.has(x.id)} loggedIn={!!session}/>
        </div>
      </article>)}
      {resources.length===0&&<p className="muted">Aucune ressource pour ce niveau pour le moment.</p>}
    </div>
  </section></main>;
}
