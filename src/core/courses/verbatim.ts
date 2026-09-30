export interface TextDifference { text:string; kind:'same'|'missing'|'extra' }
const tokens=(text:string)=>text.normalize('NFC').match(/[\p{L}\p{M}\p{N}]+|[^\s]/gu)??[]
/** Literal word/punctuation comparison; no semantic judgement or memory score. */
export function compareVerbatim(expected:string,answer:string):TextDifference[]|null {
 const a=tokens(expected),b=tokens(answer)
 if(a.length*b.length>1_000_000)return null
 const width=b.length+1,table=new Uint16Array((a.length+1)*width)
 for(let i=a.length-1;i>=0;i--)for(let j=b.length-1;j>=0;j--)table[i*width+j]=a[i]===b[j]?1+table[(i+1)*width+j+1]!:Math.max(table[(i+1)*width+j]!,table[i*width+j+1]!)
 const result:TextDifference[]=[]
 let i=0,j=0
 while(i<a.length||j<b.length){
  if(i<a.length&&j<b.length&&a[i]===b[j]){result.push({text:a[i++]!,kind:'same'});j++}
  else if(i<a.length&&(j===b.length||table[(i+1)*width+j]!>=table[i*width+j+1]!))result.push({text:a[i++]!,kind:'missing'})
  else result.push({text:b[j++]!,kind:'extra'})
 }
 return result
}
