import {openai} from "./openai";
import fs from "fs";

export async function getOrCreateVectorStore(level:"L1"|"L2", getSetting:(key:string)=>Promise<string|undefined>, setSetting:(key:string,value:string)=>Promise<void>) {
  const key=`VECTOR_STORE_${level}`;
  let id=await getSetting(key);
  if(id) return id;
  const vs=await openai.vectorStores.create({name:`Sciences Nature Campus — ${level}`});
  await setSetting(key,vs.id);
  return vs.id;
}

export async function uploadPdfToVectorStore(filePath:string, filename:string, vectorStoreId:string) {
  const file=await openai.files.create({
    file: fs.createReadStream(filePath),
    purpose:"assistants"
  });
  await openai.vectorStores.files.create(vectorStoreId,{file_id:file.id});
  return {id:file.id,filename};
}