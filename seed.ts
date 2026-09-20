import {PrismaClient,Level,ResourceType} from "@prisma/client"; import bcrypt from "bcryptjs";
const p=new PrismaClient();
await p.setting.upsert({where:{key:"VECTOR_STORE_L1"},update:{},create:{key:"VECTOR_STORE_L1",value:""}});
await p.setting.upsert({where:{key:"VECTOR_STORE_L2"},update:{},create:{key:"VECTOR_STORE_L2",value:""}});
async function main(){const adminEmail=process.env.ADMIN_EMAIL||"admin@example.com"; const adminPassword=process.env.ADMIN_PASSWORD||"change-this-password"; const adminName=process.env.ADMIN_NAME||"Administrateur"; const admin=await bcrypt.hash(adminPassword,12); await p.user.upsert({where:{email:adminEmail},update:{name:adminName,passwordHash:admin,role:"ADMIN"},create:{name:adminName,email:adminEmail,passwordHash:admin,role:"ADMIN"}});
for(const [name,level] of [["Biologie cellulaire",Level.L1],["Chimie générale",Level.L1],["Physique générale",Level.L1],["Mathématiques",Level.L1],["Géologie",Level.L1],["Biologie animale",Level.L2],["Biochimie",Level.L2],["Chimie organique",Level.L2],["Physique",Level.L2],["Géologie structurale",Level.L2]] as const){const s=await p.subject.upsert({where:{id:`${level}-${name}`},update:{},create:{id:`${level}-${name}`,name,level}});await p.resource.create({data:{title:`Introduction — ${name}`,description:"Support de démonstration à remplacer par votre cours officiel.",type:ResourceType.COURSE,level,subjectId:s.id}})}}
const bio=await p.subject.findUnique({where:{id:`L1-Biologie cellulaire`}});
if(bio && !(await p.quiz.findFirst({where:{title:"Biologie cellulaire — Bases",level:Level.L1}}))){
  await p.quiz.create({data:{title:"Biologie cellulaire — Bases",description:"Quiz d'entraînement L1.",level:Level.L1,subjectId:bio.id,questions:{create:[
    {text:"Quelle structure contient l'ADN chez les cellules eucaryotes ?",options:JSON.stringify(["Le noyau","Le ribosome","La membrane plasmique","Le lysosome"]),answerIndex:0,explanation:"Chez les eucaryotes, l'essentiel de l'ADN nucléaire est contenu dans le noyau."},
    {text:"Quel organite est principalement associé à la production d'ATP ?",options:JSON.stringify(["Golgi","Mitochondrie","Lysosome","Réticulum endoplasmique"]),answerIndex:1,explanation:"La mitochondrie réalise une grande partie de la production d'ATP par respiration cellulaire."},
    {text:"La mitose produit normalement :",options:JSON.stringify(["Deux cellules filles génétiquement très proches de la cellule mère","Quatre gamètes","Une cellule haploïde uniquement","Deux cellules toujours différentes"]),answerIndex:0,explanation:"La mitose aboutit généralement à deux cellules filles conservant le même nombre de chromosomes."}
  ]}}})
}
main().finally(()=>p.$disconnect());