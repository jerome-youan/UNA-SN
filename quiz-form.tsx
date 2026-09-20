"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";

type Subject={id:string;name:string;level:"L1"|"L2"};
type QuestionDraft={text:string;options:string[];answerIndex:number;explanation:string};

function emptyQuestion():QuestionDraft{
  return {text:"",options:["","","",""],answerIndex:0,explanation:""};
}

export default function QuizForm({subjects}:{subjects:Subject[]}){
  const router=useRouter();
  const [title,setTitle]=useState("");
  const [description,setDescription]=useState("");
  const [level,setLevel]=useState<"L1"|"L2">("L1");
  const [subjectId,setSubjectId]=useState("");
  const [questions,setQuestions]=useState<QuestionDraft[]>([emptyQuestion()]);
  const [err,setErr]=useState("");
  const [busy,setBusy]=useState(false);

  const levelSubjects=subjects.filter(s=>s.level===level);

  function updateQuestion(i:number,patch:Partial<QuestionDraft>){
    setQuestions(qs=>qs.map((q,idx)=>idx===i?{...q,...patch}:q));
  }
  function updateOption(i:number,j:number,value:string){
    setQuestions(qs=>qs.map((q,idx)=>idx===i?{...q,options:q.options.map((o,oj)=>oj===j?value:o)}:q));
  }
  function addQuestion(){setQuestions(qs=>[...qs,emptyQuestion()])}
  function removeQuestion(i:number){setQuestions(qs=>qs.length>1?qs.filter((_,idx)=>idx!==i):qs)}

  async function submit(e:any){
    e.preventDefault();
    setErr("");
    if(!subjectId){setErr("Choisis une matière.");return}
    setBusy(true);
    try{
      const r=await fetch("/api/admin/quizzes",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({title,description,level,subjectId,questions})
      });
      const d=await r.json();
      if(!r.ok){setErr(d.error||"Erreur lors de la création.");return}
      router.push("/admin/quizzes");
      router.refresh();
    }finally{setBusy(false)}
  }

  return <form className="card" onSubmit={submit} style={{maxWidth:760}}>
    <label>Titre du quiz</label>
    <input value={title} onChange={e=>setTitle(e.target.value)} required/>

    <label>Description (optionnelle)</label>
    <textarea value={description} onChange={e=>setDescription(e.target.value)}/>

    <label>Niveau</label>
    <select value={level} onChange={e=>{setLevel(e.target.value as "L1"|"L2");setSubjectId("")}}>
      <option value="L1">L1</option>
      <option value="L2">L2</option>
    </select>

    <label>Matière</label>
    <select value={subjectId} onChange={e=>setSubjectId(e.target.value)} required>
      <option value="">— Choisir —</option>
      {levelSubjects.map(s=><option value={s.id} key={s.id}>{s.name}</option>)}
    </select>
    {levelSubjects.length===0&&<p className="muted">Aucune matière {level} disponible. Ajoute d'abord une ressource pour créer la matière.</p>}

    <h2 style={{marginTop:30}}>Questions</h2>
    {questions.map((q,i)=><div className="card" key={i} style={{marginBottom:16,background:"#f9fafc"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <strong>Question {i+1}</strong>
        {questions.length>1&&<button type="button" className="btn secondary" onClick={()=>removeQuestion(i)}>Retirer</button>}
      </div>
      <label>Énoncé</label>
      <textarea value={q.text} onChange={e=>updateQuestion(i,{text:e.target.value})} required/>
      <label>Options (coche la bonne réponse)</label>
      {q.options.map((o,j)=><div key={j} style={{display:"flex",alignItems:"center",gap:10,margin:"6px 0"}}>
        <input type="radio" name={`answer-${i}`} checked={q.answerIndex===j} onChange={()=>updateQuestion(i,{answerIndex:j})}/>
        <input style={{margin:0,flex:1}} value={o} onChange={e=>updateOption(i,j,e.target.value)} placeholder={`Option ${j+1}${j<2?" (obligatoire)":""}`} required={j<2}/>
      </div>)}
      <label>Explication (optionnelle, affichée après correction)</label>
      <textarea value={q.explanation} onChange={e=>updateQuestion(i,{explanation:e.target.value})}/>
    </div>)}

    <button type="button" className="btn secondary" onClick={addQuestion}>+ Ajouter une question</button>

    <div style={{marginTop:24}}>
      <button className="btn" disabled={busy}>{busy?"Création…":"Créer le quiz"}</button>
    </div>
    {err&&<p style={{color:"#c0392b"}}>{err}</p>}
  </form>;
}
