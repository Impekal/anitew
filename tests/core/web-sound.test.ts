import {afterEach,expect,it,vi} from 'vitest'
import {createWebSound,sharedWebSound,playInterfaceSound,interfaceSoundEnabled} from '../../src/platform/web/sound.ts'
function setup(){
 const oscillators:any[]=[];const curves:any[]=[];const listeners:Record<string,()=>void>={}
 const doc={hidden:false,addEventListener:(event:string,cb:()=>void)=>{listeners[event]=cb}}
 const node=()=>({connect(){return this},disconnect:vi.fn(),gain:{value:0,setValueCurveAtTime:vi.fn((...args)=>curves.push(args))}})
 class Context{
  currentTime=0;state='running';destination={}
  createGain=node
  createOscillator(){const o={...node(),type:'',frequency:{value:0},start:vi.fn(),stop:vi.fn(),onended:null};oscillators.push(o);return o}
  suspend=vi.fn(async()=>{this.state='suspended'})
  resume=vi.fn(async()=>{this.state='running'})
 }
 vi.stubGlobal('document',doc);vi.stubGlobal('window',{AudioContext:Context,addEventListener:vi.fn()});vi.stubGlobal('navigator',{})
 return {oscillators,curves,listeners,doc}
}
afterEach(()=>vi.unstubAllGlobals())
it('plays selected A with its original pitches, timing, envelope and soft partial',()=>{
 const {oscillators,curves}=setup();createWebSound(true).play('start')
 expect(oscillators).toHaveLength(6)
 for(const [i,note] of [0,7,4].entries()){
  expect(oscillators[i*2].frequency.value).toBeCloseTo(220*2**(note/12),6)
  expect(oscillators[i*2].start).toHaveBeenCalledWith([0,.18,.43][i])
  expect(curves[i][2]).toBe(.85)
  expect(curves[i][0][0]).toBe(0);expect(curves[i][0][255]).toBe(0)
 }
})
it('shares mute with navigation and cancels pending tones instead of replaying them later',()=>{
 const {oscillators}=setup();const sound=createWebSound(true);playInterfaceSound('start')
 sound.setEnabled(false);expect(sharedWebSound()).toBe(sound);expect(sharedWebSound().isEnabled()).toBe(false);expect(interfaceSoundEnabled()).toBe(false)
 for(const o of oscillators)expect(o.stop).toHaveBeenCalledTimes(2)
 playInterfaceSound('recall');expect(oscillators).toHaveLength(6)
 sound.setEnabled(true);playInterfaceSound('recall');expect(oscillators).toHaveLength(8)
})
it('cancels sounds when hidden and does not start background or automatic return sounds',()=>{
 const {oscillators,listeners,doc}=setup();const sound=createWebSound(true);sound.play('start')
 doc.hidden=true;listeners.visibilitychange();sound.play('done');expect(oscillators).toHaveLength(6)
 for(const o of oscillators)expect(o.stop).toHaveBeenCalledTimes(2)
 doc.hidden=false;listeners.visibilitychange();expect(oscillators).toHaveLength(6)
})
