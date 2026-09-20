"use client";
import {useEffect,useState} from "react";

export default function QuizClient(){
  const [quizzes,setQ]=useState<any[]>([]),[quiz,setQuiz]=useState<any>(null),[answers,setA]=useState<any[]>([]),[result,setR]=useState<any>(null),[err,setErr]=useState("");

  useEffect(()=>{fetch("/api/quizzes").then(r=>r.json()).then(setQ)},[]);

  if(!quiz) return <div className="grid">
    {quizzes.map(q=><div className="card" key={q.id}>
      <span className="badge">{q.level}</span>
      <h3>{q.title}</h3>
      <p className="muted">{q.description}</p>
      <p className="muted">{q.questions.length} question{q.questions.length>1?"s":""}</p>
      <button className="btn" onClick={()=>{setQuiz(q);setA([]);setR(null);setErr("")}}>Commencer</button>
    </div>)}
    {quizzes.length===0&&<p className="muted">Aucun quiz disponible pour le moment.</p>}
  </div>;

  async function submit(){
    const unanswered=quiz.questions.findIndex((_:any,i:number)=>answers[i]===undefined);
    if(unanswered!==-1){setErr(`Réponds à la question ${unanswered+1} avant de valider.`);return}
    setErr("");
    const r=await fetch("/api/quizzes/attempt",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({quizId:quiz.id,answers})
    });
    const d=await r.json();
    if(!r.ok){setErr(d.error||"Erreur lors de la correction.");return}
    setR(d);
  }

  return <div className="card">
    <button className="btn secondary" onClick={()=>setQuiz(null)}>← Quiz</button>
    <h2>{quiz.title}</h2>
    {quiz.questions.map((q:any,i:number)=><div style={{margin:"25px 0"}} key={q.id}>
      <h3>{i+1}. {q.text}</h3>
      {q.options.map((o:string,j:number)=><label key={j} style={{display:"block",padding:"8px"}}>
        <input type="radio" name={q.id} checked={answers[i]===j} onChange={()=>{const a=[...answers];a[i]=j;setA(a)}}/> {o}
      </label>)}
    </div>)}
    {err&&<p style={{color:"#c0392b"}}>{err}</p>}
    {result?<div className="card">
      <h2>Résultat : {result.score}/{result.total}</h2>
      <p>{Math.round(result.score/result.total*100)}%</p>
      <button className="btn" onClick={()=>{setR(null);setA([]);setErr("")}}>Recommencer</button>
    </div>:<button className="btn" onClick={submit}>Corriger</button>}
  </div>;
}
