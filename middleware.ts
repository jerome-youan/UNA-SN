import {NextRequest,NextResponse} from "next/server";
const buckets=new Map<string,{count:number,reset:number}>();
export function middleware(req:NextRequest){
  const path=req.nextUrl.pathname;
  if(!path.startsWith("/api/")) return NextResponse.next();
  const key=`${req.ip||req.headers.get("x-forwarded-for")||"unknown"}:${path}`; const now=Date.now(); const windowMs=60_000; const max=path==="/api/chat"?20:60;
  const b=buckets.get(key);
  if(!b||now>b.reset)buckets.set(key,{count:1,reset:now+windowMs}); else {b.count++; if(b.count>max)return NextResponse.json({error:"Trop de requêtes. Réessayez dans une minute."},{status:429});}
  return NextResponse.next();
}
export const config={matcher:"/api/:path*"};
