import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(req:Request){
  const {searchParams}=new URL(req.url);
  const level=searchParams.get("level");
  const subjects=await prisma.subject.findMany({
    where:level==="L1"||level==="L2"?{level}:undefined,
    orderBy:{name:"asc"}
  });
  return NextResponse.json(subjects);
}
