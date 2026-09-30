import { useEffect,useRef,useState } from 'react'
import { downloadAudio,downloaded,removeDownload,type DownloadAsset } from './courseDownloads.ts'
import type { CourseLanguage } from '../i18n/courseUi.ts'
const videoCopy={
 de:{remove:"Offline-Video entfernen",ready:"Dieses Video ist offline verfügbar.",network:"Dieses Video braucht noch eine Verbindung. Der Lesekurs funktioniert offline."},
 en:{remove:"Remove offline video",ready:"This video is available offline.",network:"This video still needs a connection. The reading course works offline."},
 fr:{remove:"Supprimer la vidéo hors ligne",ready:"Cette vidéo est disponible hors ligne.",network:"Cette vidéo nécessite encore une connexion. Le cours écrit fonctionne hors ligne."},
}
const copy={
 de:{download:'Für offline laden / fortsetzen',cancel:'Download anhalten',remove:'Offline-Tonspur entfernen',ready:'Diese Tonspur ist offline verfügbar.',network:'Diese Tonspur braucht noch eine Verbindung. Der Lesekurs funktioniert offline.',failed:'Der Download konnte nicht abgeschlossen werden. Prüfe Verbindung und freien Speicher; bereits geladene Teile können fortgesetzt werden.',paused:'Download angehalten. Du kannst ihn später fortsetzen.'},
 en:{download:'Download / resume for offline use',cancel:'Pause download',remove:'Remove offline audio',ready:'This audio track is available offline.',network:'This audio track still needs a connection. The reading course works offline.',failed:'The download could not finish. Check your connection and free storage; downloaded parts can be resumed.',paused:'Download paused. You can resume it later.'},
 fr:{download:'Télécharger / reprendre hors ligne',cancel:'Suspendre le téléchargement',remove:'Supprimer la piste hors ligne',ready:'Cette piste est disponible hors ligne.',network:'Cette piste nécessite encore une connexion. Le cours écrit fonctionne hors ligne.',failed:'Le téléchargement n’a pas abouti. Vérifie la connexion et l’espace libre ; les parties téléchargées peuvent être reprises.',paused:'Téléchargement suspendu. Tu peux le reprendre plus tard.'},
}
export function CourseDownload({asset,locale}:{asset:DownloadAsset;locale:CourseLanguage}){
 const t={...copy[locale],...(asset.mime==='video/mp4'?videoCopy[locale]:{})},abort=useRef<AbortController>()
 const [ready,setReady]=useState(false),[busy,setBusy]=useState(false),[bytes,setBytes]=useState(0),[notice,setNotice]=useState('')
 useEffect(()=>{let active=true;void downloaded(asset).then(value=>{if(active)setReady(value)}).catch(()=>{if(active)setNotice(t.failed)});return()=>{active=false;abort.current?.abort()}},[asset.src,t.failed])
 async function start(){const controller=new AbortController();abort.current=controller;setBusy(true);setNotice('');try{await downloadAudio(asset,controller.signal,setBytes);setReady(true)}catch{setNotice(controller.signal.aborted?t.paused:t.failed)}finally{setBusy(false)}}
 return <section className="course-download">
  <p className="hint">{ready?t.ready:t.network} ({(asset.bytes/1_000_000).toFixed(1)} MB)</p>
  {busy?<><progress value={bytes} max={asset.bytes} aria-label={t.download}/><button type="button" onClick={()=>abort.current?.abort()}>{t.cancel}</button></>:ready?<button type="button" onClick={()=>{void removeDownload(asset).then(()=>{setReady(false);setBytes(0);setNotice('')}).catch(()=>setNotice(t.failed))}}>{t.remove}</button>:<button type="button" onClick={()=>void start()}>{t.download}</button>}
  <p role="status">{notice}</p>
 </section>
}
