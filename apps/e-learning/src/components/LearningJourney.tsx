import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight, Check, Play, RotateCcw } from 'lucide-react';
import './learning-journey.css';
import './sop-paper.css';

import { SOPPaper as SOPDocument } from './SOPPaper';
function CourseScreen(){const [playing,setPlaying]=useState(false);const [answer,setAnswer]=useState<number|null>(null);return <div className="journey-course"><div className="course-chrome"><span className="window-controls">● ● ●</span><span>TEAM COMMUNICATION / A 2-MINUTE EXPERIENCE</span><Check size={14}/></div><div className="course-body"><div className="course-film"><img src="/images/meeting-scene.webp" alt="A team learning how to communicate clearly"/>{!playing?<button onClick={()=>setPlaying(true)} aria-label="Start the interactive communication preview"><Play fill="currentColor" size={25}/></button>:<div className="course-question"><strong>A colleague is quiet. What next?</strong><button onClick={()=>setAnswer(0)}>Keep talking</button><button onClick={()=>setAnswer(1)}>Invite their perspective</button>{answer!==null&&<p role="status">{answer===1?'Exactly. Make room for another voice.':'Pause first. An invitation makes space.'}</p>}</div>}<span className="course-caption">{playing?'A small choice. A better conversation.':'Ask. Listen. Agree a next step.'}</span></div><div className="course-lesson"><span>01 / PRACTISE IT</span><h3>Make space for<br/>a good conversation.</h3><p>See the moment.<br/>Choose your response.<br/>Take it into your next meeting.</p><div><Check size={14}/> Useful feedback</div><div><Check size={14}/> Ready for your LMS</div></div></div><div className="course-progress"><Play size={12}/><i><b/></i><span>{playing?'Interactive':'00:00 / 02:00'}</span>{playing && <button className="course-replay" onClick={()=>{setPlaying(false);setAnswer(null);}}><RotateCcw size={12}/> Replay</button>}</div></div>}

export function LearningJourney({onOpen}:{onOpen:()=>void}){
 const root=useRef<HTMLDivElement>(null);const object=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  gsap.registerPlugin(ScrollTrigger);const media=gsap.matchMedia();
  media.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)',()=>{
   const el=root.current!,card=object.current!;
   const point=(id:string)=>{const r=el.querySelector(id)!.getBoundingClientRect(),p=el.getBoundingClientRect();return{x:r.left-p.left,y:r.top-p.top,width:r.width,height:r.height};};
   const ctx=gsap.context(()=>{
    const start=()=>point('[data-journey-anchor="0"]');const middle=()=>point('[data-journey-anchor="1"]');const end=()=>point('[data-journey-anchor="2"]');
    const phase={value:0};
    const clamp=(n:number)=>Math.max(0,Math.min(1,n));
    const smooth=(n:number)=>{const t=clamp(n);return t*t*t*(t*(t*6-15)+10);};
    const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
    const paper=el.querySelector('.journey-paper-face');
    const lesson=el.querySelector('.journey-lesson-face');
    const glow=el.querySelector('.journey-glow');
    const render=()=>{
      const second=phase.value>1;
      const from=second?middle():start(),to=second?end():middle();
      const u=smooth((phase.value-(second?1.02:.06))/(second?.64:.68));
      const arc=Math.sin(Math.PI*u);
      // A cubic path keeps translation continuous; easing settles the paper at each chapter.
      const x=mix(from.x,to.x,u)+(second?1:-1)*Math.sin(2*Math.PI*u)*35;
      const y=mix(from.y,to.y,u)-arc*65;
      const morph=second?smooth((u-.65)/.3):0;
      const settled=u===1;
      gsap.set(card,{left:settled?x:0,top:settled?y:0,x:settled?0:x,y:settled?0:y,width:mix(from.width,to.width,second?morph:u),height:mix(from.height,to.height,second?morph:u),
        rotationY:settled?0:(second?360:0)+360*u-(second?0:8)*(1-u),
        rotationX:settled?0:mix(second?0:3,0,u)+arc*9,
        rotationZ:settled?0:mix(second?0:2,0,u)+(second?12:-12)*arc,
        scale:1-arc*.035,transformPerspective:1800,visibility:'visible'});
      gsap.set(paper,{autoAlpha:1-morph});
      gsap.set(lesson,{autoAlpha:morph});
      gsap.set(glow,{opacity:Math.sin(Math.PI*morph)*.25,scale:1+morph*.2});
      card.style.setProperty('--paper-shade',String(.04+arc*.13));
    };
    render();
    gsap.to(phase,{value:2,ease:'none',scrollTrigger:{trigger:el,start:'top top',end:'bottom bottom',scrub:.55,onRefresh:render},onUpdate:render});
    gsap.fromTo('.learner-before',{y:35,opacity:0},{y:0,opacity:1,scrollTrigger:{trigger:'#problems',start:'top 70%',end:'top 25%',scrub:.6}});
    gsap.fromTo('.learner-after',{y:35,opacity:0},{y:0,opacity:1,scrollTrigger:{trigger:'#transformed',start:'top 70%',end:'top 25%',scrub:.6}});
    gsap.fromTo('#problems .journey-copy',{y:56,opacity:0,filter:'blur(12px)'},{y:0,opacity:1,filter:'blur(0px)',scrollTrigger:{trigger:'#problems',start:'top 78%',end:'top 28%',scrub:.55}});
    gsap.fromTo('#transformed .journey-copy',{y:56,opacity:0,filter:'blur(12px)'},{y:0,opacity:1,filter:'blur(0px)',scrollTrigger:{trigger:'#transformed',start:'top 78%',end:'top 28%',scrub:.55}});
   },el);
   const refresh=()=>ScrollTrigger.refresh();el.querySelectorAll('img').forEach(img=>img.addEventListener('load',refresh));
   return()=>{el.querySelectorAll('img').forEach(img=>img.removeEventListener('load',refresh));ctx.revert();};
  });
  return()=>media.revert();
 },[]);
 return <div className="learning-journey" ref={root}>
  <section id="document-intro" className="journey-document-origin" aria-label="The original SOP document"><div data-journey-anchor="0" className="journey-anchor hero-paper-slot"/><div className="journey-mobile-paper"><SOPDocument/></div><span className="journey-document-hint">Scroll to open the document</span></section>
  <section id="problems" className="journey-chapter journey-before" aria-labelledby="before-heading"><div className="journey-chapter-inner"><div className="journey-visual"><div data-journey-anchor="1" className="journey-anchor before-paper-slot"/><div className="journey-static-paper"><SOPDocument/></div><div className="learner-portrait learner-before" role="img" aria-label="A puzzled learner trying to understand a long procedure"/><span className="learner-thought">“Where do I even start?”</span></div><div className="journey-copy"><span className="eyebrow">01 / THE EVERYDAY STARTING POINT</span><h2 id="before-heading">A boring SOP.<br/><em>A useful idea<br/>waiting inside.</em></h2><p>A familiar document. Important information. And a person who needs to know what to do next.</p><p>We keep the knowledge. Then we give it a story, a moment to practise, and a reason to remember.</p><a href="#transformed">Let’s bring it to life <ArrowDown size={17}/></a><div className="journey-chips"><span>Dense documents</span><span>Long presentations</span><span>Process manuals</span></div></div></div></section>
  <section id="transformed" className="journey-chapter journey-after" aria-labelledby="after-heading"><div className="journey-chapter-inner"><div className="journey-copy"><span className="eyebrow">02 / THE SAME KNOWLEDGE, REIMAGINED</span><h2 id="after-heading">Now it’s a lesson.<br/><em>And a little<br/>“I’ve got this.”</em></h2><p>The same SOP becomes a short, visual learning experience. Watch a real situation. Make a choice. Get feedback you can use.</p><a href="#depth">Try the full experience <ArrowRight size={17}/></a><div className="journey-chips"><span><Check size={12}/> Interactive</span><span><Check size={12}/> Bite-sized</span><span><Check size={12}/> SCORM + xAPI</span></div></div><div className="journey-visual"><div data-journey-anchor="2" className="journey-anchor after-screen-slot"/><div className="journey-static-course"><CourseScreen/></div><div className="learner-portrait learner-after" role="img" aria-label="The same learner smiling with understanding and confidence"/><span className="learner-thought">“That makes sense. Let me try.”</span></div></div></section>
  <div ref={object} className="journey-traveller"><div className="journey-glow"/><div className="journey-paper-face"><div className="paper-back" aria-hidden="true"/><SOPDocument/></div><div className="journey-lesson-face"><CourseScreen/></div></div>
 </div>;
}
