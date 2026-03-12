import { useState, useEffect, useRef } from "react";

const T={bg:"#F4F2ED",surface:"#FFF",ink:"#13120F",ink2:"#524C43",ink3:"#9E9488",rule:"#DDD8CE",accent:"#D94E1A",green:"#157A42",greenBg:"#E4F5EC",amber:"#C07800",amberBg:"#FFF3D0",blue:"#1762B5",blueBg:"#E0EAFC",violet:"#7035C4",violetBg:"#EDE5F9",red:"#D12626",redBg:"#FDEAEA",sidebar:"#13120F",sidebarT:"#F4F2ED",sidebarM:"#5E584F"};
const MEM=new Map();
const S={
  async get(k){try{if(typeof window!=="undefined"&&window.storage){const r=await window.storage.get(k,true);return r?JSON.parse(r.value):null;}}catch{}const v=MEM.get(k);return v!==undefined?JSON.parse(v):null;},
  async set(k,v){const s=JSON.stringify(v);MEM.set(k,s);try{if(typeof window!=="undefined"&&window.storage)await window.storage.set(k,s,true);}catch{}return true;},
};

const STAGES=["Oportunidad","Referencias","Formulacion","Contexto","Metodologia","Comunicacion"];
const SC={Oportunidad:T.accent,Referencias:T.blue,Formulacion:T.violet,Contexto:T.green,Metodologia:T.amber,Comunicacion:"#2B7A9E"};
const SECS={
  Oportunidad:[{id:"op1",t:"Problema u oportunidad",ph:"Describe el problema o la oportunidad detectada."},{id:"op2",t:"Tematicas esenciales",ph:"Tematicas centrales del proyecto."},{id:"op3",t:"Antecedentes y marco teorico",ph:"Antecedentes pertinentes."}],
  Referencias:[{id:"ref1",t:"Estado del arte",ph:"Estado del arte pertinente."},{id:"ref2",t:"Fuentes historicas y contemporaneas",ph:"Fuentes historicas y contemporaneas."},{id:"ref3",t:"Referencias complementarias",ph:"Casos, proyectos, datos."}],
  Formulacion:[{id:"form1",t:"Pregunta e objetivos",ph:"Formulacion y objetivos."},{id:"form2",t:"Referentes del proyecto",ph:"Referentes del proyecto."},{id:"form3",t:"Justificacion y etica",ph:"Relevancia, pertinencia, viabilidad. Etica."}],
  Contexto:[{id:"ctx1",t:"Unidad de analisis",ph:"Unidad de analisis y actores."},{id:"ctx2",t:"Levantamiento de informacion",ph:"Herramientas etnograficas y datos."},{id:"ctx3",t:"Interacciones criticas",ph:"Interacciones criticas."}],
  Metodologia:[{id:"met1",t:"Propuesta metodologica",ph:"Estrategia metodologica."},{id:"met2",t:"Indicadores IOV",ph:"Indicadores IOV por objetivo."},{id:"met3",t:"Propuesta formal anticipada",ph:"Esquemas y bocetos."}],
  Comunicacion:[{id:"com1",t:"Lenguaje escrito",ph:"Ortografia, sintesis y argumentos."},{id:"com2",t:"Recursos graficos",ph:"Fotografias, ilustraciones, esquemas."},{id:"com3",t:"Diagramacion",ph:"Diagramacion segun formato."}],
};
const CRIT={
  Oportunidad:[{id:"oc1",t:"Detecta problema u oportunidad relevante"},{id:"oc2",t:"Reconoce tematicas esenciales del proyecto"},{id:"oc3",t:"Revisa antecedentes y los relaciona con marco teorico"}],
  Referencias:[{id:"rc1",t:"Realiza estado del arte pertinente"},{id:"rc2",t:"Utiliza fuentes historicas y contemporaneas"},{id:"rc3",t:"Identifica referencias complementarias"}],
  Formulacion:[{id:"fc1",t:"Define formulacion y objetivos especificos"},{id:"fc2",t:"Analiza referentes vinculados con objetivos"},{id:"fc3",t:"Justifica propuesta (relevancia, pertinencia, viabilidad)"},{id:"fc4",t:"Identifica aspectos eticos de la propuesta"}],
  Contexto:[{id:"cc1",t:"Identifica y define la unidad de analisis"},{id:"cc2",t:"Realiza levantamiento de informacion"},{id:"cc3",t:"Detecta interacciones criticas y propuesta de valor"}],
  Metodologia:[{id:"mc1",t:"Presenta propuesta metodologica delimitada"},{id:"mc2",t:"Propone IOV por cada objetivo especifico"},{id:"mc3",t:"Anticipa propuesta formal del proyecto"}],
  Comunicacion:[{id:"comc1",t:"Lenguaje escrito riguroso (ortografia, sintesis, argumentos)"},{id:"comc2",t:"Recursos graficos que apoyan los contenidos"},{id:"comc3",t:"Diagramacion segun formato de entrega"}],
};
const CROSS_CRIT=[{id:"xc1",t:"Ambito de intervencion (delimitado, pertinente, viable)"},{id:"xc2",t:"Fundamentacion y antecedentes (justifica eleccion)"},{id:"xc3",t:"Relevancia de la problematica (social, cultural, disciplinar)"},{id:"xc4",t:"Rol del diseno (aporta a la problematica)"},{id:"xc5",t:"Proyeccion del proceso (pasos definidos y coherentes)"},{id:"xc6",t:"Claridad y estructura de la presentacion"}];
const CROSS_LVL=["Inicial","En desarrollo","Logrado","Destacado"];
const RUBDIMS=[
  {id:"D1",t:"Compromiso y gestion del proceso",pct:20,levels:{1:"Inasistencias; incumple acuerdos; sin avances.",4:"Asistencia minima; cumple parcialmente hitos.",5:"Asistencia regular; cumple hitos; llega con material.",6:"Alta consistencia; anticipa obstaculos; cumple plazos.",7:"Autonomia sostenida; gestion ejemplar; liderazgo."}},
  {id:"D2",t:"Investigacion y antecedentes",pct:20,levels:{1:"Busqueda superficial; fuentes no pertinentes.",4:"Antecedentes basicos; relaciones debiles.",5:"Antecedentes pertinentes; sintesis que informa decisiones.",6:"Lectura critica; contrasta posturas; sustenta arte.",7:"Corpus solido; insight propio; criterio avanzado."}},
  {id:"D3",t:"Delimitacion del problema y coherencia",pct:25,levels:{1:"Problema difuso; propuesta no deriva del diagnostico.",4:"Delimita debilmente; justificacion generica.",5:"Problema claro; justificacion pertinente; coherencia.",6:"Encuadre convincente; explicita decisiones de alcance.",7:"Formulacion precisa; alto potencial disciplinar."}},
  {id:"D4",t:"Estrategia metodologica e IOV",pct:25,levels:{1:"Metodologia ausente; sin IOV; sin consideracion etica.",4:"Metodologia poco justificada; IOV poco medibles.",5:"Metodos pertinentes; plan ejecutable; IOV trazables.",6:"Estrategia solida; IOV afinados; anticipa riesgos.",7:"Diseno metodologico ejemplar; IOV precisos; etica clara."}},
  {id:"D5",t:"Retroalimentacion y comunicacion",pct:10,levels:{1:"No incorpora feedback; comunicacion confusa.",4:"Incorpora feedback reactivamente; poco argumentado.",5:"Integra feedback; explicita decisiones; avances claros.",6:"Iteracion deliberada; justifica trade-offs; consistente.",7:"Transforma feedback en mejora; madurez reflexiva."}},
];
const RUB_LVL=[{v:"1",l:"No cumple",range:"1.0-3.9",c:T.red,bg:T.redBg},{v:"4",l:"Cumple",range:"4.0-4.9",c:T.amber,bg:T.amberBg},{v:"5",l:"Logra",range:"5.0-5.9",c:"#C07800",bg:T.amberBg},{v:"6",l:"Aporta",range:"6.0-6.9",c:T.blue,bg:T.blueBg},{v:"7",l:"Sobresaliente",range:"7.0",c:T.green,bg:T.greenBg}];
const SM={verde:{l:"Verde",c:T.green,bg:T.greenBg},amarillo:{l:"Amarillo",c:T.amber,bg:T.amberBg},rojo:{l:"Rojo",c:T.red,bg:T.redBg}};
const SCFG={BORRADOR:{l:"Borrador",c:T.ink3,bg:"#eee"},LISTO_PARA_PROFESOR:{l:"Listo Prof.",c:T.amber,bg:T.amberBg},SOLICITA_PARES:{l:"Sol. Par",c:T.violet,bg:T.violetBg},EN_REVISION_PARES:{l:"En Revision",c:T.blue,bg:T.blueBg},CIERRE_PARES:{l:"Revisado",c:T.green,bg:T.greenBg},CERRADA:{l:"Cerrada",c:T.green,bg:T.greenBg}};
const STSTATS=["BORRADOR","LISTO_PARA_PROFESOR","SOLICITA_PARES","EN_REVISION_PARES","CIERRE_PARES","CERRADA"];
const mkAE=(stage)=>Object.fromEntries((CRIT[stage]||[]).map(c=>[c.id,{sm:"",falta:""}]));
const mkPE=(stage)=>Object.fromEntries((CRIT[stage]||[]).map(c=>[c.id,{sm:"",logrado:"",sugerencia:""}]));
const mkStages=()=>Object.fromEntries(STAGES.map(st=>[st,{status:"BORRADOR",secs:Object.fromEntries((SECS[st]||[]).map(s=>[s.id,{content:"",profFeedback:""}])),autoEval:mkAE(st),peer:{assigneeId:null,assigneeName:null,dueAt:null,submitted:false,eval:mkPE(st)},files:[]}]));
const TBG={clase:T.blueBg,evaluacion:T.amberBg,peer:T.violetBg,cierre:T.greenBg};
const IGANG=[
  {id:1,fecha:"Mar 2026",modulo:"Inicio semestre",objetivo:"Inicio Docencia Tutorial - mapeo intereses",tipo:"clase"},
  {id:2,fecha:"17 Mar",modulo:"Oportunidad",objetivo:"Identificacion de oportunidad de diseno",tipo:"clase"},
  {id:3,fecha:"31 Mar",modulo:"Referencias",objetivo:"Estado del arte y antecedentes",tipo:"clase"},
  {id:4,fecha:"6-10 Abr",modulo:"Eval. Cruzada",objetivo:"Evaluacion Cruzada entre secciones (5 min c/u)",tipo:"evaluacion"},
  {id:5,fecha:"14 Abr",modulo:"Formulacion",objetivo:"Formulacion del proyecto - cuatro objetivos",tipo:"clase"},
  {id:6,fecha:"21 Abr",modulo:"Peer Review",objetivo:"Revision entre pares - 72h (anonimo)",tipo:"peer"},
  {id:7,fecha:"5 May",modulo:"Contexto",objetivo:"Contexto e implementacion - unidad de analisis",tipo:"clase"},
  {id:8,fecha:"19 May",modulo:"Metodologia",objetivo:"Estrategia metodologica e IOV",tipo:"clase"},
  {id:9,fecha:"2 Jun",modulo:"Comunicacion",objetivo:"Comunicacion visual y escrita",tipo:"clase"},
  {id:10,fecha:"26 Jun",modulo:"Nota Proceso (30%)",objetivo:"Cierre semestre - Nota proceso (Profesor guia)",tipo:"evaluacion"},
  {id:11,fecha:"6 Jul",modulo:"Informe (30%)",objetivo:"Entrega Informe (prof. de otra seccion)",tipo:"evaluacion"},
  {id:12,fecha:"13-17 Jul",modulo:"Presentacion (40%)",objetivo:"Presentaciones (20%+20%) - 2 profes otras secciones",tipo:"evaluacion"},
];
const GLOBAL_RES=[
  {id:"gr1",title:"Instrumento: Autoevaluacion",desc:"Semaforo (verde/amarillo/rojo) por criterio + que me falta. En cada etapa.",type:"instrumento",builtin:true},
  {id:"gr2",title:"Instrumento: Evaluacion de Pares",desc:"Semaforo + logrado + sugerencias. 1 par por etapa, 72h, anonimo.",type:"instrumento",builtin:true},
  {id:"gr3",title:"Instrumento: Evaluacion Cruzada",desc:"Presentacion 5 min. 6 criterios. Niveles: Inicial/En desarrollo/Logrado/Destacado.",type:"instrumento",builtin:true},
  {id:"gr4",title:"Rubrica: Nota de Proceso (30%)",desc:"5 dimensiones: Compromiso 20%, Investigacion 20%, Delimitacion 25%, Metodologia 25%, Retroalimentacion 10%. Escala 1.0-7.0.",type:"rubrica",builtin:true},
  {id:"gr5",title:"Modelo Titulacion 2026: Hitos",desc:"Nota proceso 30% + Informe 30% + Presentacion 40% = 100%. Minimo 4.0 para Pase a Taller.",type:"proceso",builtin:true},
];
const DS="sec_demo",DP="prof_demo",DST="stu_demo";
const ISECS_DEMO=[{id:DS,code:"DIS301-D",name:"Seccion Demo - Seminario de Titulo",schedule:"Lunes y Miercoles 14:00-16:00",room:"Sala Diseno 201",profId:DP}];
const IUSERS_DEMO=[
  {id:DP,name:"Profesor Demo",email:"demo.profesor@seminariodiseno.cl",role:"professor",av:"PD",sectionId:null,pw:"Demo2026",mc:false},
  {id:DST,name:"Estudiante Demo",email:"demo.estudiante@seminariodiseno.cl",role:"student",av:"ED",sectionId:DS,pw:"Demo2026",mc:false},
];
const DB={
  async init(){
    if(await S.get("init:v7"))return;
    const users=IUSERS_DEMO.map(({pw:_,mc:__,...u})=>u);
    await S.set("users:all",users);
    const auth={};IUSERS_DEMO.forEach(u=>{auth[u.email]={pw:u.pw,mustChange:u.mc};});
    await S.set("auth:all",auth);
    await S.set("sections:all",ISECS_DEMO);
    await S.set("gantt:"+DS,IGANG);
    await S.set("stages:"+DST,mkStages());
    await S.set("invites:all",[]);
    await S.set("init:v7",true);
  },
  async getUsers(){return(await S.get("users:all"))||[];},
  async setUsers(d){await S.set("users:all",d);},
  async getAuth(){return(await S.get("auth:all"))||{};},
  async setAuth(d){await S.set("auth:all",d);},
  async getSections(){return(await S.get("sections:all"))||[];},
  async setSections(d){await S.set("sections:all",d);},
  async getGantt(sid){return(await S.get("gantt:"+sid))||IGANG;},
  async setGantt(sid,d){await S.set("gantt:"+sid,d);},
  async getStages(uid){return(await S.get("stages:"+uid))||mkStages();},
  async setStages(uid,d){await S.set("stages:"+uid,d);},
  async getRes(sid){return(await S.get("res:"+sid))||[];},
  async setRes(sid,d){await S.set("res:"+sid,d);},
  async getRubric(uid){return(await S.get("rubric:"+uid))||{};},
  async setRubric(uid,d){await S.set("rubric:"+uid,d);},
  async getCrossEval(uid){return(await S.get("crosseval:"+uid))||{};},
  async setCrossEval(uid,d){await S.set("crosseval:"+uid,d);},
  async getInvites(){return(await S.get("invites:all"))||[];},
  async setInvites(d){await S.set("invites:all",d);},
  async findInvite(email){const inv=await this.getInvites();return inv.find(i=>i.email.toLowerCase()===email.toLowerCase())||null;},
  async getResetTokens(){return(await S.get("reset:tokens"))||[];},
  async setResetTokens(d){await S.set("reset:tokens",d);},
};

const GS=()=>(
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;background:#F4F2ED;font-family:'Outfit',sans-serif;color:#13120F;-webkit-font-smoothing:antialiased}input,textarea,select,button{font-family:'Outfit',sans-serif}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:#DDD8CE}::placeholder{color:#9E9488}textarea:focus,input:focus,select:focus{outline:1.5px solid #D94E1A;outline-offset:0}@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fadeUp 0.25s ease forwards}@keyframes spin{to{transform:rotate(360deg)}}.spin{animation:spin 0.9s linear infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}.pulse{animation:pulse 1.5s ease infinite}`}</style>
);
const Sp=()=><div className="spin" style={{width:16,height:16,border:"2px solid "+T.rule,borderTopColor:T.accent,borderRadius:"50%",display:"inline-block"}}/>;
const Av=({t="?",sz=32})=>{const bg=[T.accent,T.green,T.blue,T.violet,T.amber,T.red][(t||"A").charCodeAt(0)%6];return <div style={{width:sz,height:sz,background:bg,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:sz*0.33,fontWeight:700,flexShrink:0,borderRadius:2}}>{(t||"?").slice(0,2)}</div>;};
const mkFieldName=(name,id,placeholder)=>{
  if(name)return name;
  if(id)return id;
  if(placeholder)return placeholder.toString().replace(/[^a-zA-Z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,24).toLowerCase();
  return "field";
};
const Lbl=({c,s})=><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:T.ink3,...s}}>{c}</div>;
const Btn=({children,onClick,v="ghost",sz="md",dis,s,...r})=>{
  const sz2={sm:{fontSize:11,padding:"5px 11px"},md:{fontSize:12,padding:"8px 15px"},lg:{fontSize:13,padding:"11px 22px"}};
  const vs={primary:{background:T.ink,color:T.sidebarT,border:"none",opacity:dis?0.4:1},accent:{background:T.accent,color:"#fff",border:"none",opacity:dis?0.4:1},ghost:{background:"transparent",color:T.ink2,border:"1px solid "+T.rule},link:{background:"transparent",color:T.accent,border:"none",padding:0},danger:{background:T.redBg,color:T.red,border:"1px solid #F8CECE"},success:{background:T.greenBg,color:T.green,border:"1px solid "+T.green}};
  return <button onClick={onClick} disabled={dis} style={{display:"inline-flex",alignItems:"center",gap:6,cursor:dis?"not-allowed":"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:500,lineHeight:1,transition:"all 0.15s",...sz2[sz],...vs[v],...s}} {...r}>{children}</button>;
};
const Inp=({s,name,id,placeholder,...p})=>{
  const computedName=mkFieldName(name,id,placeholder);
  return <input id={id} name={computedName} placeholder={placeholder} style={{width:"100%",border:"1px solid "+T.rule,padding:"9px 12px",fontSize:13,background:T.surface,color:T.ink,...s}} {...p}/>;
};
const Sel=({s,name,id,children,...p})=>{
  const computedName=mkFieldName(name,id);
  return <select id={id} name={computedName} style={{border:"1px solid "+T.rule,padding:"8px 10px",fontSize:12,background:T.surface,color:T.ink,...s}} {...p}>{children}</select>;
};
const Txa=({s,name,id,placeholder,...p})=>{
  const computedName=mkFieldName(name,id,placeholder);
  return <textarea id={id} name={computedName} placeholder={placeholder} style={{width:"100%",border:"1px solid "+T.rule,padding:"10px 12px",fontSize:13,background:T.surface,color:T.ink,resize:"vertical",lineHeight:1.6,...s}} {...p}/>;
};
const Pill=({st})=>{const c=SCFG[st]||SCFG.BORRADOR;return <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",background:c.bg,color:c.c,letterSpacing:"0.05em",whiteSpace:"nowrap",borderRadius:2}}>{c.l}</span>;};
const Card=({children,s})=><div style={{background:T.surface,border:"1px solid "+T.rule,padding:"16px",...s}}>{children}</div>;

function Timeline(){
  const hitos=[
    {date:"Marzo 2026",title:"Inicio proceso",sub:"Docencia Tutorial",clr:T.blue,ev:""},
    {date:"2a sem. Abril\n6-10 Abr",title:"Eval. Cruzada",sub:"Formativa",clr:T.violet,ev:"Formativa"},
    {date:"26 Jun 2026",title:"Nota Proceso",sub:"Profesor guia (30%)",clr:T.amber,ev:"30%"},
    {date:"6 Jul 2026",title:"Informe",sub:"Otro profesor (30%)",clr:T.accent,ev:"30%"},
    {date:"13-17 Jul 2026",title:"Presentacion",sub:"2 profes otras secciones",clr:T.green,ev:"40%"},
  ];
  return (
    <div style={{background:T.surface,border:"1px solid "+T.rule,padding:"20px 24px",marginBottom:18}}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:T.ink,marginBottom:4}}>Modelo Titulacion 2026 - Proceso, Hitos y Evaluaciones</div>
      <div style={{fontSize:11,color:T.ink3,marginBottom:20}}>Nota final: Nota proceso 30% + Informe 30% + Presentacion 40% = 100%. Minimo 4.0 para pase a Taller de Titulacion.</div>
      <div style={{overflowX:"auto"}}>
        <div style={{position:"relative",minWidth:700,padding:"30px 0 10px"}}>
          <div style={{position:"absolute",top:44,left:40,right:40,height:2,background:T.rule}}/>
          <div style={{display:"flex",justifyContent:"space-between",position:"relative"}}>
            {hitos.map((h,i)=>(
              <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",width:"18%",position:"relative"}}>
                <div style={{width:16,height:16,background:h.clr,borderRadius:"50%",border:"3px solid "+T.surface,zIndex:2,marginBottom:12}}/>
                {h.ev&&<div style={{position:"absolute",top:-24,fontSize:10,fontWeight:700,color:h.clr,whiteSpace:"nowrap"}}>{h.ev}</div>}
                <div style={{fontSize:9,color:T.ink3,textAlign:"center",whiteSpace:"pre-line",marginBottom:4}}>{h.date}</div>
                <div style={{fontSize:11,fontWeight:700,color:T.ink,textAlign:"center",marginBottom:2}}>{h.title}</div>
                <div style={{fontSize:10,color:T.ink2,textAlign:"center"}}>{h.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EvalForm({stage,mode,data,onChange,readOnly}){
  const crits=CRIT[stage]||[];
  const upd=(id,patch)=>{if(readOnly)return;onChange({...data,[id]:{...(data[id]||{}),...patch}});};
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {crits.map(c=>{
        const d=data[c.id]||{};
        return (
          <div key={c.id} style={{border:"1px solid "+T.rule,borderRadius:2}}>
            <div style={{padding:"8px 12px",background:T.bg,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <span style={{flex:1,fontSize:12,color:T.ink}}>{c.t}</span>
              <div style={{display:"flex",gap:4}}>
                {Object.entries(SM).map(([k,cfg])=>(
                  <button key={k} onClick={()=>upd(c.id,{sm:d.sm===k?"":k})} style={{padding:"3px 10px",fontSize:10,fontWeight:700,background:d.sm===k?cfg.bg:"transparent",color:d.sm===k?cfg.c:T.ink3,border:"1px solid "+(d.sm===k?cfg.c:T.rule),cursor:readOnly?"default":"pointer",borderRadius:2}}>{cfg.l}</button>
                ))}
              </div>
            </div>
            {!readOnly&&mode==="auto"&&<div style={{padding:"6px 12px 10px"}}><Txa value={d.falta||""} onChange={e=>upd(c.id,{falta:e.target.value})} rows={2} placeholder="Que me falta por saber o hacer..." s={{fontSize:12}}/></div>}
            {readOnly&&mode==="auto"&&d.falta&&<div style={{padding:"6px 12px 10px",fontSize:12,color:T.ink2,fontStyle:"italic"}}>{d.falta}</div>}
            {!readOnly&&mode==="peer"&&(
              <div style={{padding:"6px 12px 10px",display:"flex",flexDirection:"column",gap:6}}>
                <Txa value={d.logrado||""} onChange={e=>upd(c.id,{logrado:e.target.value})} rows={2} placeholder="Que esta logrado en este criterio..." s={{fontSize:12}}/>
                <Txa value={d.sugerencia||""} onChange={e=>upd(c.id,{sugerencia:e.target.value})} rows={2} placeholder="Sugerencia para fortalecer..." s={{fontSize:12}}/>
              </div>
            )}
            {readOnly&&mode==="peer"&&(d.logrado||d.sugerencia)&&(
              <div style={{padding:"6px 12px 10px"}}>
                {d.logrado&&<div style={{fontSize:12,color:T.green,marginBottom:4}}><b>Logrado:</b> {d.logrado}</div>}
                {d.sugerencia&&<div style={{fontSize:12,color:T.amber}}><b>Sugerencia:</b> {d.sugerencia}</div>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RubricaProf({uid,initial,onSave,readOnly}){
  const [data,setData]=useState(initial||{});
  const [saved,setSaved]=useState(false);
  const upd=(dim,lvl)=>{if(readOnly)return;setData(p=>({...p,[dim]:{level:lvl}}));};
  const totalW=RUBDIMS.reduce((s,d)=>{const lv=data[d.id]&&data[d.id].level?parseFloat(data[d.id].level):null;return lv?s+(lv*d.pct/100):s;},0);
  const nota=parseFloat(totalW.toFixed(1));
  const save=async()=>{await onSave({...data,notaCalculada:nota,date:new Date().toLocaleDateString("es-CL")});setSaved(true);setTimeout(()=>setSaved(false),2000);};

  return (
    <div className="fu">
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:T.ink,marginBottom:6}}>Rubrica - Nota de Proceso (30%)</div>
      <div style={{fontSize:11,color:T.ink3,marginBottom:14}}>Evaluacion del profesor guia. Selecciona el nivel logrado por dimension.</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
        {RUBDIMS.map(d=>{
          const sel=data[d.id]&&data[d.id].level;
          const selCfg=RUB_LVL.find(l=>l.v===sel);
          return (
            <div key={d.id} style={{border:"1px solid "+T.rule,borderRadius:2,overflow:"hidden"}}>
              <div style={{padding:"8px 14px",background:T.bg,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <span style={{fontSize:10,fontWeight:700,color:T.ink3,minWidth:24}}>{d.id}</span>
                <span style={{flex:1,fontSize:12,fontWeight:600,color:T.ink}}>{d.t}</span>
                <span style={{fontSize:10,color:T.ink3}}>{d.pct}%</span>
                {sel&&selCfg&&<span style={{fontSize:10,fontWeight:700,padding:"2px 8px",background:selCfg.bg,color:selCfg.c,borderRadius:2}}>{selCfg.l} ({selCfg.range})</span>}
              </div>
              <div style={{padding:"8px 14px",display:"flex",gap:6,flexWrap:"wrap"}}>
                {RUB_LVL.map(lvl=>(
                  <button key={lvl.v} onClick={()=>upd(d.id,lvl.v)} title={d.levels[lvl.v]||""} style={{padding:"4px 12px",fontSize:11,fontWeight:sel===lvl.v?700:400,background:sel===lvl.v?lvl.bg:"transparent",color:sel===lvl.v?lvl.c:T.ink3,border:"1px solid "+(sel===lvl.v?lvl.c:T.rule),cursor:readOnly?"default":"pointer",borderRadius:2}}>{lvl.l}<span style={{display:"block",fontSize:8,fontWeight:400}}>{lvl.range}</span></button>
                ))}
              </div>
              {sel&&<div style={{padding:"2px 14px 8px",fontSize:11,color:T.ink2,fontStyle:"italic"}}>{RUBDIMS.find(x=>x.id===d.id).levels[sel]}</div>}
            </div>
          );
        })}
      </div>
      <div style={{padding:"12px 16px",background:T.bg,border:"1px solid "+T.rule,display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <span style={{fontSize:13,fontWeight:600}}>Nota calculada:</span>
        <span style={{fontSize:22,fontFamily:"'Cormorant Garamond',serif",fontWeight:600,color:nota>=4?T.green:T.red}}>{nota>0?nota.toFixed(1):"--"}</span>
      </div>
      {!readOnly&&<Btn v="primary" sz="md" onClick={save} dis={!RUBDIMS.every(d=>data[d.id]&&data[d.id].level)}>{saved?"Guardado":"Guardar evaluacion"}</Btn>}
      {data.date&&<div style={{fontSize:10,color:T.ink3,marginTop:8}}>Evaluado el {data.date}</div>}
    </div>
  );
}

function CrossEval({uid,initial,onSave,readOnly}){
  const [data,setData]=useState(initial||{});
  const [saved,setSaved]=useState(false);
  const upd=(id,v)=>{if(readOnly)return;setData(p=>({...p,[id]:{...(p[id]||{}),...v}}));};
  const save=async()=>{await onSave({...data,date:new Date().toLocaleDateString("es-CL")});setSaved(true);setTimeout(()=>setSaved(false),2000);};
  return (
    <div className="fu">
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:T.ink,marginBottom:4}}>Evaluacion Cruzada entre Secciones</div>
      <div style={{fontSize:11,color:T.ink3,marginBottom:14}}>Presentacion de 5 minutos. Niveles: Inicial / En desarrollo / Logrado / Destacado.</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
        {CROSS_CRIT.map(c=>{
          const d=data[c.id]||{};
          return (
            <div key={c.id} style={{border:"1px solid "+T.rule,borderRadius:2}}>
              <div style={{padding:"8px 12px",background:T.bg,fontSize:12,fontWeight:500,color:T.ink}}>{c.t}</div>
              <div style={{padding:"8px 12px",display:"flex",gap:6,flexWrap:"wrap",borderTop:"1px solid "+T.rule}}>
                {CROSS_LVL.map(lv=>{
                  const clrs={Inicial:{c:T.red,bg:T.redBg},["En desarrollo"]:{c:T.amber,bg:T.amberBg},Logrado:{c:T.blue,bg:T.blueBg},Destacado:{c:T.green,bg:T.greenBg}};
                  const cfg=clrs[lv]||{c:T.ink3,bg:T.bg};
                  return <button key={lv} onClick={()=>upd(c.id,{level:d.level===lv?"":lv})} style={{padding:"4px 12px",fontSize:11,fontWeight:d.level===lv?700:400,background:d.level===lv?cfg.bg:"transparent",color:d.level===lv?cfg.c:T.ink3,border:"1px solid "+(d.level===lv?cfg.c:T.rule),cursor:readOnly?"default":"pointer",borderRadius:2}}>{lv}</button>;
                })}
              </div>
              {!readOnly&&<div style={{padding:"0 12px 10px"}}><Txa value={d.comment||""} onChange={e=>upd(c.id,{comment:e.target.value})} rows={2} placeholder="Comentarios..." s={{fontSize:12}}/></div>}
              {readOnly&&d.comment&&<div style={{padding:"4px 12px 10px",fontSize:12,color:T.ink2,fontStyle:"italic"}}>{d.comment}</div>}
            </div>
          );
        })}
      </div>
      {!readOnly&&(
        <>
          <Lbl c="Comentario general" s={{marginBottom:6}}/>
          <Txa value={data.generalComment||""} onChange={e=>setData(p=>({...p,generalComment:e.target.value}))} rows={3} placeholder="Retroalimentacion general de la presentacion..." s={{marginBottom:12}}/>
          <Btn v="primary" sz="md" onClick={save}>{saved?"Guardado":"Guardar evaluacion"}</Btn>
        </>
      )}
      {readOnly&&data.generalComment&&<div style={{padding:"10px 14px",background:T.greenBg,border:"1px solid "+T.green,fontSize:12,color:T.ink,marginTop:8}}><b>Comentario general:</b> {data.generalComment}</div>}
      {data.date&&<div style={{fontSize:10,color:T.ink3,marginTop:8}}>Evaluado el {data.date}</div>}
    </div>
  );
}

function FileUpload({files,onAdd,onRemove,canEdit=true}){
  const inp=useRef(null);
  const [uploadMsg,setUploadMsg]=useState("");
  const [uploadSeverity,setUploadSeverity]=useState("info");
  const [uploadBusy,setUploadBusy]=useState(false);
  const handle=e=>{
    const file=e.target.files[0];if(!file)return;
    const allowed=["pdf","doc","docx","jpg","jpeg","png","gif","txt"];
    const ext=(file.name.split(".").pop()||"").toLowerCase();
    if(!allowed.includes(ext)){setUploadMsg("Formato no permitido.");setUploadSeverity("error");return;}
    const maxSize=1.5*1024*1024;
    if(file.size>maxSize){setUploadMsg("Archivo supera 1.5MB.");setUploadSeverity("error");return;}
    setUploadBusy(true);
    setUploadMsg("Adjuntando archivo...");
    setUploadSeverity("info");
    const reader=new FileReader();
    reader.onload=async(ev)=>{
      const entry={id:Date.now()+"",name:file.name,type:file.type,size:Math.round(file.size/1024)+"KB",data:ev.target.result,date:new Date().toLocaleDateString("es-CL")};
      try{
        if(onAdd)await onAdd(entry);
        setUploadMsg("Archivo adjuntado.");
        setUploadSeverity("success");
        setTimeout(()=>setUploadMsg(""),3500);
      }catch(err){
        setUploadMsg("Error al guardar el archivo.");
        setUploadSeverity("error");
      }finally{
        setUploadBusy(false);
      }
    };
    reader.onerror=()=>{setUploadMsg("No se pudo leer el archivo.");setUploadSeverity("error");setUploadBusy(false);};
    reader.readAsDataURL(file);
    e.target.value="";
  };
  const dl=(f)=>{const a=document.createElement("a");a.href=f.data;a.download=f.name;a.click();};
  return (
    <div>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:canEdit?8:0}}>
        {(files||[]).map(f=>(
          <div key={f.id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",background:T.bg,border:"1px solid "+T.rule,borderRadius:2}}>
            <div style={{fontSize:10,padding:"2px 6px",background:T.blueBg,color:T.blue,fontWeight:700}}>{f.type&&f.type.includes("image")?"IMG":f.type&&f.type.includes("pdf")?"PDF":"DOC"}</div>
            <span style={{flex:1,fontSize:12,color:T.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</span>
            <span style={{fontSize:10,color:T.ink3}}>{f.size}</span>
            <Btn v="link" sz="sm" onClick={()=>dl(f)}>Descargar</Btn>
            {canEdit&&onRemove&&<Btn v="danger" sz="sm" onClick={()=>onRemove(f.id)}>X</Btn>}
          </div>
        ))}
        {(files||[]).length===0&&<div style={{fontSize:12,color:T.ink3,fontStyle:"italic"}}>Sin archivos adjuntos.</div>}
      </div>
      {canEdit&&(
        <>
          <input name="attachment" type="file" ref={inp} onChange={handle} style={{display:"none"}} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"/>
          <Btn v="ghost" sz="sm" onClick={()=>inp.current&&inp.current.click()} dis={uploadBusy}>+ Adjuntar archivo (max 1.5MB)</Btn>
          <div style={{fontSize:10,color:T.ink3,marginTop:4}}>Formatos: PDF, Word, imagenes. Max 1.5MB por archivo.</div>
          {uploadBusy&&<div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:T.ink3,marginTop:6}}><Sp/> {uploadMsg}</div>}
          {!uploadBusy&&uploadMsg&&<div style={{fontSize:11,color:uploadSeverity==="error"?T.red:uploadSeverity==="success"?T.green:T.ink3,marginTop:6,padding:"6px 10px",background:uploadSeverity==="error"?T.redBg:uploadSeverity==="success"?T.greenBg:"transparent",border:uploadSeverity==="error"?"1px solid "+T.red:uploadSeverity==="success"?"1px solid "+T.green:"1px solid "+T.rule}}>{uploadMsg}</div>}
        </>
      )}
    </div>
  );
}

function AuthPage({onLogin}){
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");const [pw,setPw]=useState("");const [name,setName]=useState("");const [pw2,setPw2]=useState("");const [role,setRole]=useState("student");const [step,setStep]=useState(1);const [err,setErr]=useState("");const [busy,setBusy]=useState(false);const [demo,setDemo]=useState(false);const [regOk,setRegOk]=useState("");
  const [showResetPanel,setShowResetPanel]=useState(false);
  const [resetEmail,setResetEmail]=useState("");
  const [resetToken,setResetToken]=useState("");
  const [resetNewPw,setResetNewPw]=useState("");
  const [resetNewPw2,setResetNewPw2]=useState("");
  const [resetMsg,setResetMsg]=useState("");
  const [resetErr,setResetErr]=useState("");
  const [resetStage,setResetStage]=useState(1);
  const [resetBusy,setResetBusy]=useState(false);

  const reset=()=>{setEmail("");setPw("");setName("");setPw2("");setErr("");setStep(1);setRegOk("");};
  const switchMode=m=>{setMode(m);reset();};

  const openResetPanel=()=>{
    setResetEmail(email);
    setResetToken("");
    setResetNewPw("");
    setResetNewPw2("");
    setResetMsg("");
    setResetErr("");
    setResetStage(1);
    setShowResetPanel(true);
  };
  const closeResetPanel=()=>{setShowResetPanel(false);setResetStage(1);setResetErr("");setResetMsg("");};
  const requestResetToken=async()=>{
    setResetErr("");
    const targetEmail=resetEmail.trim().toLowerCase();
    if(!targetEmail||!targetEmail.includes("@")){setResetErr("Correo invalido");return;}
    const users=await DB.getUsers();
    const target=users.find(u=>u.email.toLowerCase()===targetEmail);
    if(!target){setResetErr("Correo no registrado");return;}
    setResetBusy(true);
    const now=Date.now();
    const tokens=(await DB.getResetTokens()).filter(t=>t.expiresAt&&t.expiresAt>now).filter(t=>t.email!==targetEmail);
    const token=Math.random().toString(36).slice(2,8).toUpperCase();
    const newToken={id:"reset_"+now,email:targetEmail,token,expiresAt:now+1000*60*60};
    await DB.setResetTokens([...tokens,newToken]);
    setResetBusy(false);
    setResetStage(2);
    setResetToken(token);
    setResetMsg("Token listo. En entorno real se enviaria por correo; aqui puedes copiarlo.");
  };
  const completeReset=async()=>{
    setResetErr("");
    const targetEmail=resetEmail.trim().toLowerCase();
    if(!resetToken.trim()){setResetErr("Ingresa el token de recuperacion");return;}
    if(resetNewPw.length<6){setResetErr("La nueva contrasena debe tener al menos 6 caracteres");return;}
    if(resetNewPw!==resetNewPw2){setResetErr("Las contrasenas no coinciden");return;}
    setResetBusy(true);
    const tokens=await DB.getResetTokens();
    const match=tokens.find(t=>t.email===targetEmail&&t.token===resetToken&&t.expiresAt>Date.now());
    if(!match){setResetErr("Token invalido o vencido");setResetBusy(false);return;}
    const auth=await DB.getAuth();
    const key=Object.keys(auth).find(k=>k.toLowerCase()===targetEmail);
    if(!key){setResetErr("Cuenta no encontrada");setResetBusy(false);return;}
    auth[key]={pw:resetNewPw,mustChange:false};
    await DB.setAuth(auth);
    await DB.setResetTokens(tokens.filter(t=>t.id!==match.id));
    setResetBusy(false);
    setResetStage(3);
    setResetMsg("Contrasena actualizada. Ya puedes iniciar sesion.");
    setMode("login");
    setStep(1);
    setEmail(targetEmail);
    setTimeout(()=>{closeResetPanel();},2000);
  };

  const loginNext=async()=>{
    if(!email.trim()){setErr("Ingresa tu correo");return;}
    const users=await DB.getUsers();
    if(!users.find(u=>u.email.toLowerCase()===email.trim().toLowerCase())){setErr("Correo no registrado. Crea una cuenta primero.");return;}
    setErr("");setStep(2);
  };
  const loginDo=async()=>{
    if(!pw){setErr("Ingresa tu contrasena");return;}setBusy(true);
    const[auth,users]=await Promise.all([DB.getAuth(),DB.getUsers()]);
    const key=Object.keys(auth).find(k=>k.toLowerCase()===email.trim().toLowerCase());
    const user=users.find(u=>u.email.toLowerCase()===email.trim().toLowerCase());
    if(!key||auth[key].pw!==pw){setErr("Contrasena incorrecta");setBusy(false);return;}
    if(auth[key].mustChange){onLogin(user,true);return;}
    onLogin(user,false);
  };

  const registerDo=async()=>{
    setErr("");
    if(!name.trim()){setErr("Ingresa tu nombre completo");return;}
    if(!email.trim()||!email.includes("@")){setErr("Correo invalido");return;}
    if(pw.length<6){setErr("Contrasena minimo 6 caracteres");return;}
    if(pw!==pw2){setErr("Las contrasenas no coinciden");return;}
    setBusy(true);
    const el=email.trim().toLowerCase();
    const[users,auth,invites]=await Promise.all([DB.getUsers(),DB.getAuth(),DB.getInvites()]);
    if(users.find(u=>u.email.toLowerCase()===el)){setErr("Este correo ya esta registrado.");setBusy(false);return;}
    const invite=invites.find(i=>i.email.toLowerCase()===el);
    const forceRole=invite?"student":role;
    const av=(name.trim().split(" ").map(w=>w[0]||"").join("").slice(0,2)||"US").toUpperCase();
    const id=(forceRole==="professor"?"prof_":"stu_")+Date.now();
    const sectionId=invite?invite.sectionId:null;
    const newUser={id,name:name.trim(),email:el,role:forceRole,av,sectionId};
    await DB.setUsers([...users,newUser]);
    auth[el]={pw,mustChange:false};await DB.setAuth(auth);
    if(forceRole==="student"){await DB.setStages(id,mkStages());}
    if(invite){const upd=invites.filter(i=>i.email.toLowerCase()!==el);await DB.setInvites(upd);}
    setBusy(false);
    const msg=invite?"Cuenta creada. Asignado/a a la seccion de tu profesor.":"Cuenta creada. Iniciando sesion...";
    setRegOk(msg);
    setTimeout(()=>onLogin(newUser,false),1200);
  };

  const DEMOS=[{label:"PROFESOR DEMO",email:"demo.profesor@seminariodiseno.cl",pw:"Demo2026"},{label:"ESTUDIANTE DEMO",email:"demo.estudiante@seminariodiseno.cl",pw:"Demo2026"}];

  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column"}} className="fu">
      <GS/>
      <div style={{background:T.ink,padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:T.sidebarT}}>Seminario de Titulo</span><span style={{fontSize:10,color:T.sidebarM,marginLeft:10,letterSpacing:"0.08em"}}>DISENO UC</span></div>
        <button onClick={()=>setDemo(v=>!v)} style={{background:"none",border:"1px solid #3a3830",color:T.sidebarM,fontSize:11,padding:"4px 11px",cursor:"pointer"}}>{demo?"Ocultar demo":"Cuentas demo"}</button>
      </div>
      {demo&&(
        <div style={{background:"#152B45",borderBottom:"1px solid #1E3F62",padding:"14px 24px"}}>
          <div style={{maxWidth:720,margin:"0 auto"}}>
            <div style={{fontSize:9,color:"#6EB4F5",fontWeight:700,letterSpacing:"0.1em",marginBottom:10}}>CUENTAS DE DEMOSTRACION</div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              {DEMOS.map(d=>(
                <div key={d.email} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",padding:"10px 14px",minWidth:250}}>
                  <div style={{fontSize:9,color:"#6EB4F5",fontWeight:700,letterSpacing:"0.1em",marginBottom:4}}>{d.label}</div>
                  <div style={{fontSize:12,color:"#fff",fontFamily:"monospace"}}>{d.email}</div>
                  <div style={{fontSize:12,color:"#fff",fontFamily:"monospace",marginBottom:8}}>{d.pw}</div>
                  <Btn v="accent" sz="sm" onClick={()=>{setEmail(d.email);setPw(d.pw);setMode("login");setStep(2);setDemo(false);}}>Ingresar -{">"}</Btn>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 20px"}}>
        <div style={{width:"100%",maxWidth:400}}>
          <div style={{background:T.surface,border:"1px solid "+T.rule,padding:"32px 28px",marginBottom:14}}>
            {mode==="login"&&(
              <>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,marginBottom:4}}>{step===1?"Bienvenido/a":"Ingresa tu contrasena"}</div>
                <div style={{fontSize:12,color:T.ink3,marginBottom:20}}>Seminario Titulo 2026</div>
                {step===1?(
                  <>
                    <Lbl c="Correo electronico" s={{marginBottom:5}}/>
                    <Inp value={email} onChange={e=>{setEmail(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&loginNext()} placeholder="nombre@universidad.cl" s={{marginBottom:err?8:16}} autoFocus/>
                    {err&&<div style={{fontSize:11,color:T.red,marginBottom:12,padding:"7px 10px",background:T.redBg}}>{err}</div>}
                    <Btn v="primary" sz="lg" onClick={loginNext} s={{width:"100%",justifyContent:"center",marginBottom:14}}>Continuar</Btn>
                  </>
                ):(
                  <>
                    <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:T.bg,border:"1px solid "+T.rule,marginBottom:14,borderRadius:2}}><Av t={email[0]||"?"} sz={22}/><span style={{fontSize:12,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{email}</span><Btn v="link" sz="sm" onClick={()=>{setStep(1);setPw("");setErr("");}}>Cambiar</Btn></div>
                    <Lbl c="Contrasena" s={{marginBottom:5}}/>
                    <Inp type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&loginDo()} placeholder="..." s={{marginBottom:err?8:16}} autoFocus/>
                    {err&&<div style={{fontSize:11,color:T.red,marginBottom:12,padding:"7px 10px",background:T.redBg}}>{err}</div>}
                    <Btn v="primary" sz="lg" onClick={loginDo} dis={busy} s={{width:"100%",justifyContent:"center"}}>{busy?<><Sp/>&nbsp;Verificando...</>:"Iniciar sesion"}</Btn>
                    <div style={{marginTop:12,textAlign:"center",fontSize:11}}><button type="button" onClick={openResetPanel} style={{background:"none",border:"none",color:T.accent,cursor:"pointer",fontWeight:600,padding:0}}>¿Olvidaste tu contraseña?</button></div>
                  </>
                )}
              </>
            )}
            {mode==="register"&&(
              <>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,marginBottom:4}}>Crear cuenta</div>
                <div style={{fontSize:12,color:T.ink3,marginBottom:20}}>Registro en Seminario Titulo 2026</div>
                {regOk?(
                  <div style={{padding:"16px",background:T.greenBg,border:"1px solid "+T.green,textAlign:"center"}}>
                    <div style={{fontSize:14,color:T.green,fontWeight:600,marginBottom:4}}>Cuenta creada</div>
                    <div style={{fontSize:12,color:T.ink}}>{regOk}</div>
                    <div style={{fontSize:11,color:T.ink3,marginTop:6}}>Redirigiendo...</div>
                  </div>
                ):(
                  <>
                    <Lbl c="Nombre completo" s={{marginBottom:5}}/>
                    <Inp value={name} onChange={e=>{setName(e.target.value);setErr("");}} placeholder="Nombre Apellido" s={{marginBottom:12}} autoFocus/>
                    <Lbl c="Correo electronico" s={{marginBottom:5}}/>
                    <Inp value={email} onChange={e=>{setEmail(e.target.value);setErr("");}} placeholder="nombre@universidad.cl" s={{marginBottom:12}}/>
                    <Lbl c="Soy" s={{marginBottom:5}}/>
                    <div style={{display:"flex",gap:8,marginBottom:12}}>
                      {[["student","Estudiante"],["professor","Profesor/a"]].map(([k,l])=>(
                        <button key={k} onClick={()=>setRole(k)} style={{flex:1,padding:"9px",fontSize:12,fontWeight:role===k?700:400,background:role===k?T.ink:T.bg,color:role===k?"#fff":T.ink2,border:"1px solid "+(role===k?T.ink:T.rule),cursor:"pointer",transition:"all 0.15s"}}>{l}</button>
                      ))}
                    </div>
                    {role==="student"&&<div style={{fontSize:11,color:T.ink3,padding:"8px 10px",background:T.bg,border:"1px solid "+T.rule,marginBottom:12}}>Si tu profesor registro tu correo, quedas asignado/a automaticamente a su seccion.</div>}
                    <Lbl c="Contrasena" s={{marginBottom:5}}/>
                    <Inp type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} placeholder="Minimo 6 caracteres" s={{marginBottom:12}}/>
                    <Lbl c="Confirmar contrasena" s={{marginBottom:5}}/>
                    <Inp type="password" value={pw2} onChange={e=>{setPw2(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&registerDo()} placeholder="Repite la contrasena" s={{marginBottom:err?8:16}}/>
                    {err&&<div style={{fontSize:11,color:T.red,marginBottom:12,padding:"7px 10px",background:T.redBg}}>{err}</div>}
                    <Btn v="primary" sz="lg" onClick={registerDo} dis={busy} s={{width:"100%",justifyContent:"center",marginBottom:14}}>{busy?<><Sp/>&nbsp;Creando cuenta...</>:"Crear cuenta"}</Btn>
                  </>
                )}
              </>
            )}
          </div>
          {showResetPanel&&(
            <div style={{width:"100%",maxWidth:400,margin:"12px auto 18px"}}>
              <Card s={{padding:"18px 20px"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:T.ink}}>Restablecer contraseña</div>
                  <button type="button" onClick={closeResetPanel} style={{background:"none",border:"none",color:T.ink3,fontSize:11,cursor:"pointer"}}>Cerrar</button>
                </div>
                <div style={{fontSize:11,color:T.ink3,marginBottom:12,lineHeight:1.4}}>
                  Solicita un token para actualizar tu contraseña. El token dura 60 minutos y puede copiarse aquí para pruebas locales.
                </div>
                {resetMsg&&resetStage!==3&&<div style={{fontSize:11,color:T.green,marginBottom:10,padding:"8px",background:T.greenBg,border:"1px solid "+T.green}}>{resetMsg} {resetToken&&<span style={{fontWeight:700}}>{resetToken}</span>}</div>}
                {resetStage===1&&(
                  <>
                    <Lbl c="Correo electronico" s={{marginBottom:5}}/>
                    <Inp value={resetEmail} onChange={e=>{setResetEmail(e.target.value);setResetErr("");}} placeholder="nombre@universidad.cl" s={{marginBottom:12}}/>
                    <Btn v="primary" sz="md" onClick={requestResetToken} dis={resetBusy} s={{width:"100%",justifyContent:"center"}}>{resetBusy?<><Sp/>&nbsp;Generando token...</>:"Solicitar token"}</Btn>
                  </>
                )}
                {resetStage===2&&(
                  <>
                    <Lbl c="Token" s={{marginBottom:5}}/>
                    <Inp value={resetToken} onChange={e=>setResetToken(e.target.value)} placeholder="XXXXXX" s={{marginBottom:12}}/>
                    <Lbl c="Nueva contrasena" s={{marginBottom:5}}/>
                    <Inp type="password" value={resetNewPw} onChange={e=>{setResetNewPw(e.target.value);setResetErr("");}} placeholder="Minimo 6 caracteres" s={{marginBottom:12}}/>
                    <Lbl c="Confirmar contrasena" s={{marginBottom:5}}/>
                    <Inp type="password" value={resetNewPw2} onChange={e=>{setResetNewPw2(e.target.value);setResetErr("");}} placeholder="Repite la contrasena" s={{marginBottom:12}} onKeyDown={e=>e.key==="Enter"&&completeReset()}/>
                    {resetErr&&<div style={{fontSize:11,color:T.red,marginBottom:10,padding:"7px 10px",background:T.redBg}}>{resetErr}</div>}
                    <Btn v="primary" sz="md" onClick={completeReset} dis={resetBusy} s={{width:"100%",justifyContent:"center"}}>{resetBusy?<><Sp/>&nbsp;Actualizando...</>:"Actualizar contraseña"}</Btn>
                  </>
                )}
                {resetErr&&resetStage===1&&<div style={{fontSize:11,color:T.red,marginTop:10,padding:"7px 10px",background:T.redBg}}>{resetErr}</div>}
                {resetStage===3&&(
                  <div style={{fontSize:12,color:T.green,background:T.greenBg,padding:"10px",border:"1px solid "+T.green}}>{resetMsg}</div>
                )}
              </Card>
            </div>
          )}
          <div style={{padding:"10px 14px",background:T.bg,border:"1px solid "+T.rule,fontSize:11,color:T.ink3}}>
            {mode==="login"?<>No tienes cuenta? <button onClick={()=>switchMode("register")} style={{background:"none",border:"none",color:T.accent,cursor:"pointer",fontSize:11,fontWeight:600,padding:0}}>Crear cuenta</button></>:<>Ya tienes cuenta? <button onClick={()=>switchMode("login")} style={{background:"none",border:"none",color:T.accent,cursor:"pointer",fontSize:11,fontWeight:600,padding:0}}>Iniciar sesion</button></>}
            <span style={{margin:"0 8px",color:T.rule}}>|</span><span style={{cursor:"pointer",color:T.accent}} onClick={()=>setDemo(true)}>Cuentas demo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChangePw({user,onDone,forced=false}){
  const [cur,setCur]=useState("");const [nw,setNw]=useState("");const [nw2,setNw2]=useState("");const [err,setErr]=useState("");const [ok,setOk]=useState(false);
  const save=async()=>{if(!forced&&!cur){setErr("Ingresa tu contrasena actual");return;}if(nw.length<6){setErr("Minimo 6 caracteres");return;}if(nw!==nw2){setErr("Las contrasenas no coinciden");return;}const auth=await DB.getAuth();const key=Object.keys(auth).find(k=>k.toLowerCase()===user.email.toLowerCase());if(!key)return;if(!forced&&auth[key].pw!==cur){setErr("Contrasena actual incorrecta");return;}auth[key]={pw:nw,mustChange:false};await DB.setAuth(auth);setOk(true);setTimeout(onDone,800);};
  if(ok)return <div style={{padding:24,color:T.green,textAlign:"center"}}>Contrasena actualizada</div>;
  return (
    <div style={{padding:"24px",maxWidth:360}}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,marginBottom:6}}>{forced?"Crear contrasena":"Cambiar contrasena"}</div>
      <div style={{fontSize:12,color:T.ink3,marginBottom:18}}>{forced?"Primer ingreso. Define tu contrasena.":""}</div>
      {!forced&&<><Lbl c="Contrasena actual" s={{marginBottom:5}}/><Inp type="password" value={cur} onChange={e=>{setCur(e.target.value);setErr("");}} s={{marginBottom:12}} placeholder="..."/></>}
      <Lbl c="Nueva contrasena" s={{marginBottom:5}}/><Inp type="password" value={nw} onChange={e=>{setNw(e.target.value);setErr("");}} s={{marginBottom:12}} placeholder="Minimo 6 caracteres"/>
      <Lbl c="Confirmar" s={{marginBottom:5}}/><Inp type="password" value={nw2} onChange={e=>{setNw2(e.target.value);setErr("");}} s={{marginBottom:err?10:16}} placeholder="Repite la contrasena"/>
      {err&&<div style={{fontSize:11,color:T.red,marginBottom:12,padding:"7px 10px",background:T.redBg}}>{err}</div>}
      <Btn v="primary" sz="lg" onClick={save} s={{width:"100%",justifyContent:"center"}}>{forced?"Crear y entrar":"Guardar"}</Btn>
    </div>
  );
}

const AISYS="Eres un asistente del Seminario de Titulo de la Escuela de Diseno UC. Apoyas en las 6 etapas: Oportunidad, Referencias, Formulacion, Contexto, Metodologia, Comunicacion. Nota proceso 30% (D1 Compromiso 20%, D2 Investigacion 20%, D3 Delimitacion 25%, D4 Metodologia 25%, D5 Retroalimentacion 10%). Responde en espanol. Tono cercano y academico. Retroalimentacion concreta: que esta bien, que falta, siguiente paso.";
function AiAssistant({user}){
  const hi="Hola "+user.name.split(" ")[0]+" - Soy tu asistente del Seminario. Puedo ayudarte con tus etapas, criterios de evaluacion, metodologia o retroalimentacion. En que estas trabajando?";
  const [msgs,setMsgs]=useState([{role:"assistant",content:hi}]);const [inp,setInp]=useState("");const [busy,setBusy]=useState(false);const [errt,setErrt]=useState("");const bot=useRef(null);
  const proxyUrl=(import.meta.env.VITE_ANTHROPIC_PROXY_URL||"").trim();
  const aiModel=import.meta.env.VITE_ANTHROPIC_MODEL||"claude-2.1";
  const hasProxy=Boolean(proxyUrl);
  useEffect(()=>{bot.current&&bot.current.scrollIntoView({behavior:"smooth"});},[msgs]);
  const send=async()=>{const txt=inp.trim();if(!txt||busy){return;}if(!hasProxy){setErrt("Activa VITE_ANTHROPIC_PROXY_URL para habilitar el asistente.");return;}const next=[...msgs,{role:"user",content:txt}];setMsgs(next);setInp("");setBusy(true);setErrt("");try{const res=await fetch(proxyUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:aiModel,messages:next.map(m=>({role:m.role,content:m.content})),meta:{userId:user.id}})});const payload=await res.json().catch(()=>null);if(!res.ok){setErrt("Proxy: "+(payload?.message||res.statusText));setBusy(false);return;}const assistantText=payload?.response?.content?.[0]?.text||payload?.content?.[0]?.text||payload?.text||payload?.message;setMsgs(p=>[...p,{role:"assistant",content:assistantText||"Sin respuesta desde el proxy."}]);}catch(e){setErrt("Error de conexion con el proxy.");}setBusy(false);};
  const sugs=user.role==="student"?["Como formulo mi pregunta de investigacion?","Que son los IOV?","Como identifico mi unidad de analisis?","Que se evalua en nota proceso?"]:["Como dar retroalimentacion efectiva?","Como evaluar la delimitacion del problema?","Explica la rubrica de nota proceso","Que diferencia un buen problema de diseno?"];
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",height:"100%",maxWidth:820}} className="fu">
      <div style={{padding:"14px 22px 12px",borderBottom:"1px solid "+T.rule,background:T.surface,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,background:"linear-gradient(135deg,#7035C4,#D94E1A)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,fontWeight:700}}>AI</div>
          <div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20}}>Asistente de Seminario</div><div style={{fontSize:10,color:T.ink3}}>Powered by Claude - Especializado en Diseno UC</div></div>
        </div>
      </div>
      {!hasProxy&&<div style={{padding:"10px 22px",background:"#fff4eb",borderBottom:"1px solid #f1d7c4",color:"#a4490a",fontSize:12}}>El asistente requiere un proxy con clave protegida. Define <code style={{fontSize:11}}>VITE_ANTHROPIC_PROXY_URL</code> apuntando a tu servidor que maneje el key (puede usar la API de Anthropic o un proxy propio) y vuelve a cargar.</div>}
      <div style={{flex:1,overflowY:"auto",padding:"16px 22px",display:"flex",flexDirection:"column",gap:12}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",gap:10,flexDirection:m.role==="user"?"row-reverse":"row"}}>
            {m.role==="assistant"?<div style={{width:26,height:26,background:"linear-gradient(135deg,#7035C4,#D94E1A)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:9,fontWeight:700,flexShrink:0}}>AI</div>:<Av t={user.av} sz={26}/>}
            <div style={{maxWidth:"78%",padding:"10px 14px",background:m.role==="user"?T.ink:T.surface,border:"1px solid "+(m.role==="user"?"transparent":T.rule)}}><div style={{fontSize:13,color:m.role==="user"?"#fff":T.ink,lineHeight:1.7,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{m.content}</div></div>
          </div>
        ))}
        {busy&&<div style={{display:"flex",gap:10,padding:"4px 0"}}><div style={{width:26,height:26,background:"linear-gradient(135deg,#7035C4,#D94E1A)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:9,fontWeight:700,flexShrink:0}}>AI</div><div style={{padding:"10px 14px",background:T.surface,border:"1px solid "+T.rule,display:"flex",gap:3}}>{[0,1,2].map(n=><div key={n} className="pulse" style={{width:5,height:5,background:T.violet,borderRadius:"50%",animationDelay:(n*0.18)+"s"}}/>)}</div></div>}
        {errt&&<div style={{padding:"8px 12px",background:T.redBg,fontSize:12,color:T.red}}>{errt}</div>}
        <div ref={bot}/>
      </div>
      {msgs.length<=1&&<div style={{padding:"0 22px 12px",flexShrink:0}}><Lbl c="Sugerencias" s={{marginBottom:7}}/><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{sugs.map((s,i)=><button key={i} onClick={()=>setInp(s)} style={{padding:"5px 11px",border:"1px solid "+T.rule,background:T.surface,color:T.ink2,fontSize:11,cursor:"pointer"}}>{s}</button>)}</div></div>}
      <div style={{padding:"10px 22px",borderTop:"1px solid "+T.rule,background:T.surface,flexShrink:0}}>
        <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
          <Txa value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Escribe tu pregunta... (Enter enviar)" rows={2} s={{flex:1,fontSize:13,resize:"none",maxHeight:100}}/>
          <Btn v="primary" sz="md" onClick={send} dis={!inp.trim()||busy||!hasProxy} s={{padding:"10px 15px",height:40,flexShrink:0}}>{busy?<Sp/>:"->"}</Btn>
        </div>
        <div style={{fontSize:9,color:T.ink3,marginTop:5}}>Respuestas generadas por IA - Valida siempre con tu profesor/a</div>
      </div>
    </div>
  );
}

function StageCard({stage,stageData,onUpdate,isProf,allStudents}){
  const [tab,setTab]=useState("contenido");
  const [aeData,setAeData]=useState(stageData.autoEval||mkAE(stage));
  const [aeChg,setAeChg]=useState(false);
  const [sv,setSv]=useState(false);
  const sd=stageData.secs||{};
  const secs=SECS[stage]||[];
  const peer=stageData.peer||{assigneeId:null,submitted:false,eval:mkPE(stage)};
  const canEdit=!["EN_REVISION_PARES","CERRADA"].includes(stageData.status);
  const ST=SCFG[stageData.status]||SCFG.BORRADOR;

  const updSec=async(secId,content,pfb)=>{setSv(true);const ns={...sd,[secId]:{content:content!==undefined?content:sd[secId]&&sd[secId].content||"",profFeedback:pfb!==undefined?pfb:sd[secId]&&sd[secId].profFeedback||""}};await onUpdate({...stageData,secs:ns});setSv(false);};
  const updFiles=async(files)=>onUpdate({...stageData,files});
  const addFile=async(f)=>updFiles([...(stageData.files||[]),f]);
  const rmFile=async(id)=>updFiles((stageData.files||[]).filter(x=>x.id!==id));
  const updStatus=async(s)=>onUpdate({...stageData,status:s});
  const saveAE=async()=>{setSv(true);await onUpdate({...stageData,autoEval:aeData});setAeChg(false);setSv(false);};
  const TABS=isProf?["contenido","autoeval","pares","archivos"]:["contenido","autoeval","archivos"];

  const dueOk=peer.dueAt?new Date(peer.dueAt)>new Date():false;
  const peerActive=stageData.status==="EN_REVISION_PARES"&&peer.assigneeId&&!peer.submitted&&dueOk;

  return (
    <div style={{border:"1px solid "+T.rule,background:T.surface}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 15px",background:T.bg}}>
        <div style={{width:7,height:7,background:ST.c,borderRadius:1,flexShrink:0}}/>
        <span style={{flex:1,fontSize:13,fontWeight:600,color:T.ink}}>{stage}</span>
        <Pill st={stageData.status}/>
        {peer.assigneeId&&!peer.submitted&&<span style={{fontSize:9,color:T.violet,fontWeight:700}}>Par asignado</span>}
        {peer.submitted&&<span style={{fontSize:9,color:T.green,fontWeight:700}}>Par completado</span>}
      </div>
      <div style={{borderTop:"1px solid "+T.rule,display:"flex",background:T.bg}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"6px 13px",fontSize:11,fontWeight:tab===t?700:400,color:tab===t?T.accent:T.ink3,background:"transparent",border:"none",borderBottom:tab===t?"2px solid "+T.accent:"2px solid transparent",cursor:"pointer"}}>
            {t==="contenido"?"Contenido":t==="autoeval"?"Autoevaluacion":t==="pares"?"Revision Pares":"Archivos"}
          </button>
        ))}
      </div>
      <div style={{padding:"14px 16px"}}>
        {tab==="contenido"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {secs.map(sec=>(
              <div key={sec.id} style={{borderBottom:"1px solid "+T.rule,paddingBottom:12}}>
                <Lbl c={sec.t} s={{marginBottom:6}}/>
                {canEdit?(
                  <Txa defaultValue={(sd[sec.id]&&sd[sec.id].content)||""} rows={4} placeholder={sec.ph} onBlur={e=>updSec(sec.id,e.target.value,undefined)}/>
                ):(
                  <div style={{fontSize:13,color:T.ink,lineHeight:1.7,whiteSpace:"pre-wrap",minHeight:40}}>{(sd[sec.id]&&sd[sec.id].content)||<span style={{color:T.ink3,fontStyle:"italic"}}>Sin contenido.</span>}</div>
                )}
                {isProf&&(
                  <div style={{marginTop:8}}>
                    <Lbl c="Feedback del profesor" s={{marginBottom:5}}/>
                    <Txa defaultValue={(sd[sec.id]&&sd[sec.id].profFeedback)||""} rows={2} placeholder="Retroalimentacion para esta seccion..." onBlur={e=>updSec(sec.id,undefined,e.target.value)} s={{fontSize:12}}/>
                  </div>
                )}
                {!isProf&&sd[sec.id]&&sd[sec.id].profFeedback&&(
                  <div style={{marginTop:8,padding:"8px 12px",background:T.greenBg,border:"1px solid "+T.green,fontSize:12,color:T.ink}}><b style={{color:T.green}}>Feedback Profesor:</b> {sd[sec.id].profFeedback}</div>
                )}
              </div>
            ))}
            <div style={{display:"flex",gap:8,flexWrap:"wrap",paddingTop:4}}>
              {!isProf&&stageData.status==="BORRADOR"&&<Btn v="ghost" sz="sm" onClick={()=>updStatus("LISTO_PARA_PROFESOR")}>Enviar a Profesor</Btn>}
              {!isProf&&["BORRADOR","LISTO_PARA_PROFESOR"].includes(stageData.status)&&<Btn v="ghost" sz="sm" onClick={()=>updStatus("SOLICITA_PARES")}>Solicitar revision par</Btn>}
              {isProf&&STSTATS.slice(1).map(st=><Btn key={st} v="ghost" sz="sm" onClick={()=>updStatus(st)} s={{fontSize:10}}>{SCFG[st].l}</Btn>)}
              {sv&&<span style={{fontSize:11,color:T.ink3,alignSelf:"center"}}>Guardando...</span>}
            </div>
            {peer.submitted&&!isProf&&(
              <div style={{padding:"12px 14px",background:T.blueBg,border:"1px solid "+T.blue}}>
                <Lbl c="Revision de par (anonimo)" s={{marginBottom:8,color:T.blue}}/>
                <EvalForm stage={stage} mode="peer" data={peer.eval} onChange={()=>{}} readOnly={true}/>
              </div>
            )}
          </div>
        )}
        {tab==="autoeval"&&(
          <div>
            <div style={{fontSize:12,color:T.ink3,marginBottom:12}}>Evalua tu propio avance en esta etapa. Para cada criterio, selecciona un color e indica que te falta.</div>
            <EvalForm stage={stage} mode="auto" data={aeData} onChange={d=>{setAeData(d);setAeChg(true);}} readOnly={isProf}/>
            {!isProf&&aeChg&&<Btn v="primary" sz="sm" onClick={saveAE} s={{marginTop:12}}>{sv?"Guardando...":"Guardar autoevaluacion"}</Btn>}
            {isProf&&<div style={{fontSize:11,color:T.ink3,marginTop:8,fontStyle:"italic"}}>Vista de lectura - autoevaluacion del estudiante.</div>}
          </div>
        )}
        {tab==="pares"&&isProf&&(
          <div>
            <div style={{marginBottom:12}}>
              <Lbl c="Par evaluador asignado" s={{marginBottom:6}}/>
              {peer.assigneeId?(
                <div style={{padding:"10px 14px",background:T.bg,border:"1px solid "+T.rule,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                  <Av t={peer.assigneeName?peer.assigneeName.slice(0,2):"P"} sz={28}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600}}>{peer.assigneeName}</div>
                    <div style={{fontSize:10,color:T.ink3}}>Plazo: {peer.dueAt?new Date(peer.dueAt).toLocaleString("es-CL"):"--"}</div>
                  </div>
                  <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",background:peer.submitted?T.greenBg:dueOk?T.amberBg:T.redBg,color:peer.submitted?T.green:dueOk?T.amber:T.red}}>{peer.submitted?"Completado":dueOk?"Pendiente":"Vencido"}</span>
                </div>
              ):<div style={{fontSize:12,color:T.ink3}}>Sin par asignado.</div>}
              {peer.submitted&&(
                <div style={{marginTop:12}}>
                  <Lbl c="Resultado de la revision" s={{marginBottom:8}}/>
                  <EvalForm stage={stage} mode="peer" data={peer.eval} onChange={()=>{}} readOnly={true}/>
                </div>
              )}
            </div>
          </div>
        )}
        {tab==="archivos"&&(
          <FileUpload files={stageData.files||[]} onAdd={addFile} onRemove={rmFile} canEdit={canEdit||isProf}/>
        )}
      </div>
    </div>
  );
}

function PeerReviewView({assignment,onSubmit}){
  const {stage,studentName,due}=assignment;
  const [evalData,setEvalData]=useState(mkPE(stage));
  const [comment,setComment]=useState("");
  const [sub,setSub]=useState(false);
  const dueD=new Date(due);
  const expired=dueD<new Date();
  const hoursLeft=Math.max(0,Math.round((dueD-new Date())/3600000));

  const submit=async()=>{
    if(expired){alert("El plazo de revision ha vencido.");return;}
    await onSubmit({eval:evalData,comment,date:new Date().toLocaleDateString("es-CL")});
    setSub(true);
  };

  if(sub)return <div style={{padding:24,textAlign:"center",color:T.green,fontSize:16}}>Revision enviada correctamente.</div>;

  return (
    <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}} className="fu">
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,marginBottom:6}}>Revision de par</div>
      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        <div style={{padding:"8px 14px",background:T.bg,border:"1px solid "+T.rule,fontSize:12}}><b>Etapa:</b> {stage}</div>
        <div style={{padding:"8px 14px",background:T.bg,border:"1px solid "+T.rule,fontSize:12}}><b>Plazo:</b> {dueD.toLocaleString("es-CL")}</div>
        {!expired&&<div style={{padding:"8px 14px",background:T.amberBg,border:"1px solid "+T.amber,fontSize:12,color:T.amber,fontWeight:600}}>{hoursLeft}h restantes</div>}
        {expired&&<div style={{padding:"8px 14px",background:T.redBg,border:"1px solid "+T.red,fontSize:12,color:T.red,fontWeight:600}}>Plazo vencido</div>}
      </div>
      <div style={{fontSize:12,color:T.ink3,marginBottom:16}}>Evalua el trabajo segun los criterios de la etapa. Para cada criterio: selecciona semaforo, indica que esta logrado y da una sugerencia.</div>
      <EvalForm stage={stage} mode="peer" data={evalData} onChange={setEvalData} readOnly={expired}/>
      {!expired&&(
        <div style={{marginTop:16}}>
          <Lbl c="Comentario general" s={{marginBottom:6}}/>
          <Txa value={comment} onChange={e=>setComment(e.target.value)} rows={3} placeholder="Comentario general..." s={{marginBottom:12}}/>
          <Btn v="primary" sz="md" onClick={submit}>Enviar revision</Btn>
        </div>
      )}
    </div>
  );
}

function StudentProject({user,stages,onUpdateStages,section,peerAssignments,onPeerSubmit}){
  const [selStage,setSelStage]=useState(null);
  const [selPeer,setSelPeer]=useState(null);
  const myPeers=(peerAssignments||[]).filter(a=>a.reviewerId===user.id&&!a.submitted);

  if(selPeer){
    return <PeerReviewView assignment={selPeer} onSubmit={async r=>{await onPeerSubmit(selPeer,r);setSelPeer(null);}}/>;
  }

  if(selStage){
    const sd=stages[selStage]||{status:"BORRADOR",secs:{},autoEval:mkAE(selStage),peer:{},files:[]};
    return (
      <div style={{flex:1,display:"flex",flexDirection:"column",height:"100%"}}>
        <div style={{padding:"10px 20px",borderBottom:"1px solid "+T.rule,background:T.surface,display:"flex",alignItems:"center",gap:10}}>
          <Btn v="link" sz="sm" onClick={()=>setSelStage(null)}>{"<"} Volver</Btn>
          <span style={{fontSize:14,fontWeight:600}}>{selStage}</span>
          <Pill st={sd.status}/>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
          <StageCard stage={selStage} stageData={sd} onUpdate={async nd=>onUpdateStages({...stages,[selStage]:nd})} isProf={false}/>
        </div>
      </div>
    );
  }

  return (
    <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}} className="fu">
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,flex:1}}>Mi Proyecto</div>
        {section&&<span style={{fontSize:10,color:T.ink3}}>{section.code}</span>}
      </div>
      {myPeers.length>0&&(
        <div style={{marginBottom:16,padding:"12px 16px",background:T.violetBg,border:"1px solid "+T.violet}}>
          <div style={{fontWeight:700,color:T.violet,fontSize:12,marginBottom:8}}>Tienes {myPeers.length} revision(es) de par pendiente(s)</div>
          {myPeers.map(a=>(
            <div key={a.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <span style={{fontSize:12}}>{a.stage}</span>
              <Btn v="accent" sz="sm" onClick={()=>setSelPeer(a)}>Revisar ahora</Btn>
              <span style={{fontSize:10,color:T.ink3}}>Vence: {new Date(a.due).toLocaleString("es-CL")}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {STAGES.map(st=>{
          const sd=stages[st]||{status:"BORRADOR"};
          const pending=sd.status==="SOLICITA_PARES";
          return (
            <div key={st} onClick={()=>setSelStage(st)} style={{background:T.surface,border:"1px solid "+(pending?T.violet:T.rule),padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"border-color 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=SC[st]} onMouseLeave={e=>e.currentTarget.style.borderColor=pending?T.violet:T.rule}>
              <div style={{width:8,height:8,background:SC[st],borderRadius:1}}/>
              <span style={{flex:1,fontSize:13,fontWeight:600,color:T.ink}}>{st}</span>
              {sd.peer&&sd.peer.submitted&&<span style={{fontSize:10,color:T.green,fontWeight:700}}>Par completado</span>}
              <Pill st={sd.status}/>
              <span style={{color:T.ink3,fontSize:11}}>{">"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfPanel({students,section,allStudents,onUpdateStudent,onAssignPeer}){
  const [tab,setTab]=useState("matriz");
  const [selStu,setSelStu]=useState(null);
  const [selSt,setSelSt]=useState(STAGES[0]);
  const [evalTab,setEvalTab]=useState("rubrica");
  const [rubData,setRubData]=useState({});
  const [crossData,setCrossData]=useState({});
  const [modal,setModal]=useState(null);
  const [peerSel,setPeerSel]=useState("");
  const ST2COL={BORRADOR:"#ccc",LISTO_PARA_PROFESOR:T.amber,SOLICITA_PARES:T.violet,EN_REVISION_PARES:T.blue,CIERRE_PARES:T.green,CERRADA:T.green};
  const getSol=()=>students.flatMap(s=>STAGES.filter(st=>{const d=s.stages&&s.stages[st];return d&&d.status==="SOLICITA_PARES";}).map(st=>({s,st})));
  const sol=getSol();

  useEffect(()=>{
    if(!selStu)return;
    (async()=>{
      const [rb,cx]=await Promise.all([DB.getRubric(selStu.id),DB.getCrossEval(selStu.id)]);
      setRubData(rb||{});setCrossData(cx||{});
    })();
  },[selStu]);

  const doAssign=async()=>{
    if(!peerSel){alert("Selecciona un estudiante");return;}
    const stu=allStudents.find(s=>s.id===peerSel);
    const due=new Date(Date.now()+72*3600000).toISOString();
    await onAssignPeer(modal.sid,modal.st,{assigneeId:peerSel,assigneeName:stu?stu.name:"?",dueAt:due,submitted:false,eval:mkPE(modal.st)});
    setModal(null);setPeerSel("");
  };

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",height:"100%"}} className="fu">
      <div style={{padding:"12px 20px 0",borderBottom:"1px solid "+T.rule,background:T.surface,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,flexWrap:"wrap"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,flex:1}}>Panel del Curso</div>
          {section&&<span style={{fontSize:10,color:T.ink3,fontWeight:600}}>{section.code}</span>}
        </div>
        <div style={{display:"flex",gap:0}}>
          {[["matriz","Matriz"],["sol","Solicitudes"+(sol.length>0?" ("+sol.length+")":"")],["detalle","Detalle Estudiante"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{padding:"7px 14px",fontSize:12,fontWeight:tab===k?700:400,color:tab===k?T.accent:T.ink2,background:"transparent",border:"none",borderBottom:tab===k?"2px solid "+T.accent:"2px solid transparent",cursor:"pointer"}}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
        {tab==="matriz"&&(
          <div style={{overflowX:"auto"}}>
            <table style={{borderCollapse:"collapse",width:"100%",minWidth:600}}>
              <thead>
                <tr><th style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:T.ink3,background:T.bg,border:"1px solid "+T.rule,minWidth:140}}>ESTUDIANTE</th>{STAGES.map(s=><th key={s} style={{padding:"5px 6px",textAlign:"center",fontSize:9,fontWeight:700,color:"#fff",background:SC[s],border:"1px solid "+T.rule,minWidth:80}}>{s.toUpperCase()}</th>)}</tr>
              </thead>
              <tbody>
                {students.map(s=>(
                  <tr key={s.id}>
                    <td style={{padding:"7px 10px",fontSize:12,border:"1px solid "+T.rule,background:T.surface}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}><Av t={s.av||s.name.slice(0,2)} sz={20}/>
                        <button onClick={()=>{setSelStu(s);setTab("detalle");}} style={{background:"none",border:"none",color:T.accent,cursor:"pointer",fontSize:12,textAlign:"left"}}>{s.name}</button>
                      </div>
                    </td>
                    {STAGES.map(st=>{
                      const d=(s.stages&&s.stages[st])||{};
                      const status=d.status||"BORRADOR";
                      return <td key={st} style={{padding:"6px",textAlign:"center",border:"1px solid "+T.rule,background:T.surface}}><div style={{width:12,height:12,background:ST2COL[status]||"#ccc",margin:"0 auto",borderRadius:2,cursor:"pointer"}} title={st+": "+SCFG[status].l} onClick={()=>{setSelStu(s);setSelSt(st);setTab("detalle");}}/></td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{marginTop:8,display:"flex",gap:10,flexWrap:"wrap",fontSize:10,color:T.ink3}}>
              {Object.entries(ST2COL).slice(0,5).map(([k,c])=><span key={k} style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:9,height:9,background:c,display:"inline-block",borderRadius:1}}/>{SCFG[k].l}</span>)}
            </div>
          </div>
        )}
        {tab==="sol"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {sol.length===0&&<div style={{fontSize:13,color:T.ink3,padding:"20px 0"}}>Sin solicitudes de revision entre pares pendientes.</div>}
            {sol.map(({s,st},i)=>(
              <Card key={i}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                  <div><div style={{fontSize:13,fontWeight:600,color:T.ink,marginBottom:2}}>{s.name}</div><div style={{fontSize:11,color:T.ink3}}>Etapa: {st}</div></div>
                  <Btn v="accent" sz="sm" onClick={()=>{setModal({sid:s.id,st});setPeerSel("");}}>Asignar par evaluador</Btn>
                </div>
              </Card>
            ))}
          </div>
        )}
        {tab==="detalle"&&(
          selStu?(
            <div>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,flexWrap:"wrap"}}>
                <Av t={selStu.av||selStu.name.slice(0,2)} sz={36}/>
                <div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20}}>{selStu.name}</div><div style={{fontSize:11,color:T.ink3}}>{selStu.email}</div></div>
                <Btn v="ghost" sz="sm" onClick={()=>setSelStu(null)} s={{marginLeft:"auto"}}>Volver</Btn>
              </div>
              <div style={{display:"flex",gap:0,borderBottom:"1px solid "+T.rule,marginBottom:14}}>
                {[["rubrica","Rubrica Proceso"],["crosseval","Eval. Cruzada"],["etapas","Etapas y Feedback"]].map(([k,l])=>(
                  <button key={k} onClick={()=>setEvalTab(k)} style={{padding:"7px 14px",fontSize:12,fontWeight:evalTab===k?700:400,color:evalTab===k?T.accent:T.ink2,background:"transparent",border:"none",borderBottom:evalTab===k?"2px solid "+T.accent:"2px solid transparent",cursor:"pointer"}}>{l}</button>
                ))}
              </div>
              {evalTab==="rubrica"&&(
                <RubricaProf uid={selStu.id} initial={rubData} onSave={async d=>{await DB.setRubric(selStu.id,d);setRubData(d);}} readOnly={false}/>
              )}
              {evalTab==="crosseval"&&(
                <CrossEval uid={selStu.id} initial={crossData} onSave={async d=>{await DB.setCrossEval(selStu.id,d);setCrossData(d);}} readOnly={false}/>
              )}
              {evalTab==="etapas"&&(
                <div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
                    {STAGES.map(s=><button key={s} onClick={()=>setSelSt(s)} style={{padding:"5px 11px",fontSize:11,fontWeight:600,border:"1px solid "+(selSt===s?SC[s]:T.rule),background:selSt===s?SC[s]:"transparent",color:selSt===s?"#fff":T.ink2,cursor:"pointer",borderRadius:2}}>{s}</button>)}
                  </div>
                  <StageCard stage={selSt} stageData={(selStu.stages&&selStu.stages[selSt])||{status:"BORRADOR",secs:{},autoEval:mkAE(selSt),peer:{},files:[]}} isProf={true}
                    onUpdate={async nd=>{const ns={...selStu.stages,[selSt]:nd};await onUpdateStudent(selStu.id,ns);setSelStu(prev=>({...prev,stages:ns}));}}
                    allStudents={allStudents}/>
                </div>
              )}
            </div>
          ):<div style={{fontSize:13,color:T.ink3,padding:"20px 0"}}>Selecciona un estudiante de la matriz.</div>
        )}
      </div>
      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}}>
          <div style={{background:T.surface,border:"1px solid "+T.rule,padding:26,maxWidth:400,width:"90%"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,marginBottom:4}}>Asignar par evaluador</div>
            <div style={{fontSize:12,color:T.ink3,marginBottom:14}}>Etapa: {modal.st}. El par tiene 72 horas para completar la revision. El evaluado no vera la identidad del par.</div>
            <Lbl c="Par evaluador" s={{marginBottom:6}}/>
            <Sel value={peerSel} onChange={e=>setPeerSel(e.target.value)} s={{width:"100%",marginBottom:16}}>
              <option value="">-- Seleccionar estudiante --</option>
              {allStudents.filter(s=>s.id!==modal.sid).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </Sel>
            <div style={{display:"flex",gap:8}}>
              <Btn v="ghost" sz="md" onClick={()=>setModal(null)}>Cancelar</Btn>
              <Btn v="primary" sz="md" dis={!peerSel} onClick={doAssign}>Asignar (72h plazo)</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GanttView({user,gantt,onUpdate}){
  const isProf=user.role==="professor";
  const [rows,setRows]=useState(gantt||IGANG);
  const [adding,setAdding]=useState(false);
  const [nr,setNr]=useState({fecha:"",modulo:"",objetivo:"",tipo:"clase"});
  const [editing,setEditing]=useState(null);
  useEffect(()=>{setRows(gantt||IGANG);},[gantt]);
  const save=async u=>{setRows(u);if(onUpdate)await onUpdate(u);};
  const del=async id=>save(rows.filter(r=>r.id!==id));
  const add=async()=>{if(!nr.fecha||!nr.modulo||!nr.objetivo)return;await save([...rows,{...nr,id:Date.now()}]);setNr({fecha:"",modulo:"",objetivo:"",tipo:"clase"});setAdding(false);};
  return (
    <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}} className="fu">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:10}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22}}>Carta Gantt</div>
        {isProf&&<Btn v="accent" sz="sm" onClick={()=>setAdding(v=>!v)}>{adding?"Cancelar":"+ Sesion"}</Btn>}
      </div>
      {isProf&&adding&&(
        <Card s={{marginBottom:14}}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
            <div style={{flex:"1 1 90px"}}><Lbl c="Fecha" s={{marginBottom:4}}/><Inp value={nr.fecha} onChange={e=>setNr(r=>({...r,fecha:e.target.value}))} placeholder="ej: 14 Mar"/></div>
            <div style={{flex:"1 1 120px"}}><Lbl c="Modulo" s={{marginBottom:4}}/><Inp value={nr.modulo} onChange={e=>setNr(r=>({...r,modulo:e.target.value}))} placeholder="ej: Contexto"/></div>
            <div style={{flex:"2 1 200px"}}><Lbl c="Objetivo" s={{marginBottom:4}}/><Inp value={nr.objetivo} onChange={e=>setNr(r=>({...r,objetivo:e.target.value}))} placeholder="Descripcion"/></div>
            <div style={{flex:"1 1 100px"}}><Lbl c="Tipo" s={{marginBottom:4}}/><Sel value={nr.tipo} onChange={e=>setNr(r=>({...r,tipo:e.target.value}))} s={{width:"100%"}}><option value="clase">Clase</option><option value="evaluacion">Evaluacion</option><option value="peer">Peer Review</option><option value="cierre">Cierre</option></Sel></div>
          </div>
          <Btn v="primary" sz="sm" dis={!nr.fecha||!nr.modulo||!nr.objetivo} onClick={add}>Agregar</Btn>
        </Card>
      )}
      <div style={{overflowX:"auto"}}>
        <table style={{borderCollapse:"collapse",width:"100%",minWidth:500}}>
          <thead><tr style={{background:T.ink}}>{["Fecha","Modulo","Objetivo","Tipo",isProf?"":null].filter(Boolean).map((h,i)=><th key={i} style={{padding:"7px 10px",textAlign:"left",fontSize:9,fontWeight:700,color:T.sidebarT,letterSpacing:"0.08em",whiteSpace:"nowrap"}}>{h.toUpperCase()}</th>)}</tr></thead>
          <tbody>
            {rows.map((row,i)=>(
              editing===row.id?(
                <tr key={row.id} style={{background:T.blueBg}}>
                  <td style={{padding:"5px 8px",border:"1px solid "+T.rule}}><Inp defaultValue={row.fecha} onBlur={e=>{const u=rows.map(r=>r.id===row.id?{...r,fecha:e.target.value}:r);setRows(u);}} s={{fontSize:12,padding:"4px 8px"}}/></td>
                  <td style={{padding:"5px 8px",border:"1px solid "+T.rule}}><Inp defaultValue={row.modulo} onBlur={e=>{const u=rows.map(r=>r.id===row.id?{...r,modulo:e.target.value}:r);setRows(u);}} s={{fontSize:12,padding:"4px 8px"}}/></td>
                  <td style={{padding:"5px 8px",border:"1px solid "+T.rule}}><Inp defaultValue={row.objetivo} onBlur={e=>{const u=rows.map(r=>r.id===row.id?{...r,objetivo:e.target.value}:r);setRows(u);}} s={{fontSize:12,padding:"4px 8px"}}/></td>
                  <td style={{padding:"5px 8px",border:"1px solid "+T.rule}}><Sel defaultValue={row.tipo} onChange={e=>{const u=rows.map(r=>r.id===row.id?{...r,tipo:e.target.value}:r);setRows(u);}} s={{fontSize:12}}>{["clase","evaluacion","peer","cierre"].map(t=><option key={t} value={t}>{t}</option>)}</Sel></td>
                  <td style={{padding:"5px 8px",border:"1px solid "+T.rule,whiteSpace:"nowrap"}}><Btn v="success" sz="sm" onClick={()=>{save(rows);setEditing(null);}}>OK</Btn></td>
                </tr>
              ):(
                <tr key={row.id} style={{background:i%2===0?T.surface:T.bg}}>
                  <td style={{padding:"7px 10px",fontSize:12,color:T.ink3,border:"1px solid "+T.rule,whiteSpace:"nowrap"}}>{row.fecha}</td>
                  <td style={{padding:"7px 10px",fontSize:12,fontWeight:500,color:T.ink,border:"1px solid "+T.rule}}>{row.modulo}</td>
                  <td style={{padding:"7px 10px",fontSize:12,color:T.ink2,border:"1px solid "+T.rule}}>{row.objetivo}</td>
                  <td style={{padding:"6px 8px",border:"1px solid "+T.rule}}><span style={{fontSize:9,fontWeight:700,padding:"2px 7px",background:TBG[row.tipo]||T.bg,color:T.ink2,borderRadius:2}}>{row.tipo}</span></td>
                  {isProf&&<td style={{padding:"5px 8px",border:"1px solid "+T.rule,whiteSpace:"nowrap"}}><Btn v="ghost" sz="sm" onClick={()=>setEditing(row.id)} s={{marginRight:4,fontSize:10}}>Edit</Btn><Btn v="danger" sz="sm" onClick={()=>del(row.id)} s={{fontSize:10}}>X</Btn></td>}
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Resources({user,resources,onUpdate,section}){
  const isProf=user.role==="professor";
  const [title,setTitle]=useState("");const [desc,setDesc]=useState("");const [link,setLink]=useState("");
  const add=async()=>{if(!title.trim())return;await onUpdate([...resources,{id:Date.now()+"",title,desc,link,by:user.name,date:new Date().toLocaleDateString("es-CL"),files:[]}]);setTitle("");setDesc("");setLink("");};
  const addFileToRes=async(resId,f)=>onUpdate(resources.map(r=>r.id===resId?{...r,files:[...(r.files||[]),f]}:r));
  const rmFileFromRes=async(resId,fid)=>onUpdate(resources.map(r=>r.id===resId?{...r,files:(r.files||[]).filter(x=>x.id!==fid)}:r));

  return (
    <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}} className="fu">
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,marginBottom:4}}>Recursos</div>
      <div style={{fontSize:12,color:T.ink3,marginBottom:16}}>Materiales, instrumentos y documentos del curso.</div>
      <div style={{marginBottom:20}}>
        <Lbl c="Instrumentos integrados en la plataforma" s={{marginBottom:8}}/>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {GLOBAL_RES.map(r=>(
            <div key={r.id} style={{padding:"8px 12px",background:T.bg,border:"1px solid "+T.rule,display:"flex",gap:10,alignItems:"flex-start"}}>
              <span style={{fontSize:9,fontWeight:700,padding:"2px 6px",background:r.type==="rubrica"?T.amberBg:r.type==="proceso"?T.greenBg:T.blueBg,color:r.type==="rubrica"?T.amber:r.type==="proceso"?T.green:T.blue,flexShrink:0,marginTop:1}}>{r.type.slice(0,3).toUpperCase()}</span>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:T.ink,marginBottom:2}}>{r.title}</div><div style={{fontSize:11,color:T.ink2}}>{r.desc}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{height:1,background:T.rule,marginBottom:18}}/>
      {isProf&&(
        <Card s={{marginBottom:20}}>
          <Lbl c="Nuevo recurso" s={{marginBottom:10}}/>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <Inp value={title} onChange={e=>setTitle(e.target.value)} placeholder="Titulo"/>
            <Inp value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Descripcion"/>
            <Inp value={link} onChange={e=>setLink(e.target.value)} placeholder="URL (opcional)"/>
            <Btn v="primary" sz="sm" dis={!title.trim()} onClick={add}>Agregar recurso</Btn>
          </div>
        </Card>
      )}
      {resources.length===0&&<div style={{fontSize:13,color:T.ink3}}>Sin recursos adicionales de la seccion.</div>}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {resources.map(r=>(
          <Card key={r.id} s={{padding:"12px 16px"}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:T.ink,marginBottom:3}}>{r.title}</div>
                {r.desc&&<div style={{fontSize:12,color:T.ink2,marginBottom:3}}>{r.desc}</div>}
                {r.link&&<a href={r.link} target="_blank" rel="noreferrer" style={{fontSize:11,color:T.blue}}>{r.link}</a>}
                <div style={{fontSize:10,color:T.ink3,marginTop:4}}>{r.by} - {r.date}</div>
                <div style={{marginTop:10}}>
                  <Lbl c="Archivos adjuntos" s={{marginBottom:6}}/>
                  <FileUpload files={r.files||[]} onAdd={f=>addFileToRes(r.id,f)} onRemove={fid=>rmFileFromRes(r.id,fid)} canEdit={isProf}/>
                </div>
              </div>
              {isProf&&<Btn v="danger" sz="sm" onClick={()=>onUpdate(resources.filter(x=>x.id!==r.id))}>X</Btn>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SectionConfig({section,onSave}){
  const [form,setForm]=useState({code:section.code,name:section.name,schedule:section.schedule||"",room:section.room||""});const [ok,setOk]=useState(false);
  const save=async()=>{await onSave({...section,...form});setOk(true);setTimeout(()=>setOk(false),2000);};
  return (
    <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}} className="fu">
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,marginBottom:16}}>Configuracion de Seccion</div>
      <Card s={{maxWidth:520}}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div><Lbl c="Codigo" s={{marginBottom:5}}/><Inp value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value}))} placeholder="ej: DIS301-1"/></div>
          <div><Lbl c="Nombre" s={{marginBottom:5}}/><Inp value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="ej: Seminario Titulo Seccion 1"/></div>
          <div><Lbl c="Horario" s={{marginBottom:5}}/><Inp value={form.schedule} onChange={e=>setForm(f=>({...f,schedule:e.target.value}))} placeholder="ej: Lunes 14:00-17:00"/></div>
          <div><Lbl c="Sala" s={{marginBottom:5}}/><Inp value={form.room} onChange={e=>setForm(f=>({...f,room:e.target.value}))} placeholder="ej: Sala 301"/></div>
          <div style={{display:"flex",alignItems:"center",gap:12}}><Btn v="primary" sz="md" onClick={save}>Guardar</Btn>{ok&&<span style={{fontSize:12,color:T.green}}>Guardado</span>}</div>
        </div>
      </Card>
    </div>
  );
}

function StudentManager({section,students,allUsers,onRemoveStudent}){
  const [email,setEmail]=useState("");const [err,setErr]=useState("");const [ok,setOk]=useState("");const [invites,setInvites]=useState([]);const [busy,setBusy]=useState(false);

  useEffect(()=>{(async()=>{const all=await DB.getInvites();const now=Date.now();const valid=all.filter(i=>!i.expiresAt||i.expiresAt>now);if(valid.length!==all.length)await DB.setInvites(valid);setInvites(valid.filter(i=>i.sectionId===section.id));})();},[section.id]);

  const addInvite=async()=>{
    setErr("");setOk("");const el=email.trim().toLowerCase();
    if(!el||!el.includes("@")){setErr("Correo invalido");return;}
    setBusy(true);
    const[users,inv]=await Promise.all([DB.getUsers(),DB.getInvites()]);
    if(users.find(u=>u.email.toLowerCase()===el)){setErr("Este correo ya tiene cuenta registrada.");setBusy(false);return;}
    if(inv.find(i=>i.email.toLowerCase()===el)){setErr("Este correo ya fue invitado.");setBusy(false);return;}
    const newInv={id:"inv_"+Date.now(),email:el,sectionId:section.id,profId:section.profId,addedAt:new Date().toLocaleDateString("es-CL"),expiresAt:Date.now()+7*24*60*60*1000};
    const updInv=[...inv,newInv];await DB.setInvites(updInv);
    setInvites(updInv.filter(i=>i.sectionId===section.id));
    setEmail("");setOk("Invitacion guardada. Al registrarse, el estudiante queda en tu seccion.");
    setBusy(false);
  };
  const removeInvite=async(id)=>{const all=await DB.getInvites();const upd=all.filter(i=>i.id!==id);await DB.setInvites(upd);setInvites(upd.filter(i=>i.sectionId===section.id));};

  return (
    <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}} className="fu">
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,marginBottom:4}}>Estudiantes</div>
      <div style={{fontSize:12,color:T.ink3,marginBottom:16}}>{students.length} estudiante(s) registrado(s) en esta seccion.</div>
      <Card s={{marginBottom:20,maxWidth:540}}>
        <Lbl c="Invitar por correo" s={{marginBottom:8}}/>
        <div style={{fontSize:11,color:T.ink3,marginBottom:10,padding:"8px 10px",background:T.bg,border:"1px solid "+T.rule,lineHeight:1.6}}>
          Al registrarse con este correo, el/la estudiante queda asignado/a automaticamente a esta seccion.
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Inp value={email} onChange={e=>{setEmail(e.target.value);setErr("");setOk("");}} placeholder="estudiante@universidad.cl" onKeyDown={e=>e.key==="Enter"&&addInvite()} s={{flex:"1 1 200px"}}/>
          <Btn v="primary" sz="md" dis={!email.trim()||busy} onClick={addInvite}>Invitar</Btn>
        </div>
        {err&&<div style={{fontSize:11,color:T.red,padding:"6px 10px",background:T.redBg,marginTop:8}}>{err}</div>}
        {ok&&<div style={{fontSize:11,color:T.green,padding:"6px 10px",background:T.greenBg,marginTop:8,lineHeight:1.5}}>{ok}</div>}
      </Card>
      {invites.length>0&&(
        <div style={{marginBottom:18}}>
          <Lbl c={"Invitaciones pendientes ("+invites.length+")"} s={{marginBottom:8}}/>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {invites.map(inv=>(
              <div key={inv.id} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 14px",background:T.amberBg,border:"1px solid "+T.amber}}>
                <div style={{width:8,height:8,background:T.amber,borderRadius:"50%"}}/>
                <span style={{flex:1,fontSize:12,color:T.ink}}>{inv.email}</span>
                <span style={{fontSize:10,color:T.ink3}}>
                  Invitado {inv.addedAt}
                  {inv.expiresAt&&" • Vence "+new Date(inv.expiresAt).toLocaleDateString("es-CL")}
                </span>
                <Btn v="danger" sz="sm" onClick={()=>removeInvite(inv.id)}>X</Btn>
              </div>
            ))}
          </div>
        </div>
      )}
      <Lbl c={"Estudiantes ("+students.length+")"} s={{marginBottom:8}}/>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {students.length===0&&<div style={{fontSize:13,color:T.ink3,fontStyle:"italic"}}>Sin estudiantes registrados aun.</div>}
        {students.map(s=>(
          <div key={s.id} style={{background:T.surface,border:"1px solid "+T.rule,padding:"10px 14px",display:"flex",alignItems:"center",gap:12}}>
            <Av t={s.av||s.name.slice(0,2)} sz={30}/>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{s.name}</div><div style={{fontSize:11,color:T.ink3}}>{s.email}</div></div>
            <Btn v="danger" sz="sm" onClick={()=>onRemoveStudent(s.id)}>Quitar</Btn>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfHome({user,sections,allUsers,onSelectSection,onCreateSection}){
  const [code,setCode]=useState("");const [name,setName]=useState("");const [sched,setSched]=useState("");const [room,setRoom]=useState("");const [creating,setCreating]=useState(false);
  const mySecs=sections.filter(s=>s.profId===user.id);
  const create=async()=>{if(!code.trim()||!name.trim())return;const ns={id:"sec_"+Date.now(),code:code.trim(),name:name.trim(),schedule:sched.trim(),room:room.trim(),profId:user.id};await onCreateSection(ns);setCode("");setName("");setSched("");setRoom("");setCreating(false);};
  return (
    <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}} className="fu">
      <Timeline/>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,marginBottom:4}}>Mis Secciones</div>
      <div style={{fontSize:12,color:T.ink3,marginBottom:16}}>Gestiona tus secciones de Seminario de Titulo 2026.</div>
      {mySecs.length===0&&!creating&&(
        <div style={{padding:"16px 20px",background:T.amberBg,border:"1px solid "+T.amber,marginBottom:18}}>
          <div style={{fontSize:13,fontWeight:600,color:T.ink,marginBottom:4}}>Bienvenido/a</div>
          <div style={{fontSize:12,color:T.ink2,marginBottom:10}}>Crea tu primera seccion para comenzar. Luego invita estudiantes, configura el Gantt y aplica instrumentos de evaluacion.</div>
          <Btn v="accent" sz="md" onClick={()=>setCreating(true)}>Crear primera seccion -{">"}</Btn>
        </div>
      )}
      {!creating&&mySecs.length>0&&<Btn v="accent" sz="md" onClick={()=>setCreating(true)} s={{marginBottom:16}}>+ Crear nueva seccion</Btn>}
      {creating&&(
        <Card s={{marginBottom:18,maxWidth:540}}>
          <Lbl c="Nueva seccion" s={{marginBottom:10}}/>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
            <div style={{flex:"1 1 100px"}}><Lbl c="Codigo" s={{marginBottom:4}}/><Inp value={code} onChange={e=>setCode(e.target.value)} placeholder="DIS301-2"/></div>
            <div style={{flex:"2 1 180px"}}><Lbl c="Nombre" s={{marginBottom:4}}/><Inp value={name} onChange={e=>setName(e.target.value)} placeholder="Seminario Titulo Seccion 2"/></div>
            <div style={{flex:"1 1 140px"}}><Lbl c="Horario" s={{marginBottom:4}}/><Inp value={sched} onChange={e=>setSched(e.target.value)} placeholder="Martes 10:00-13:00"/></div>
            <div style={{flex:"1 1 100px"}}><Lbl c="Sala" s={{marginBottom:4}}/><Inp value={room} onChange={e=>setRoom(e.target.value)} placeholder="Sala 201"/></div>
          </div>
          <div style={{display:"flex",gap:8}}><Btn v="primary" sz="sm" dis={!code.trim()||!name.trim()} onClick={create}>Crear</Btn><Btn v="ghost" sz="sm" onClick={()=>setCreating(false)}>Cancelar</Btn></div>
        </Card>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {mySecs.map(sec=>{
          const cnt=allUsers.filter(u=>u.role==="student"&&u.sectionId===sec.id).length;
          return (
            <div key={sec.id} style={{background:T.surface,border:"1px solid "+T.rule,padding:"16px 20px",cursor:"pointer",transition:"border-color 0.15s"}}
              onClick={()=>onSelectSection(sec)} onMouseEnter={e=>e.currentTarget.style.borderColor=T.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=T.rule}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",background:"#FAEEE8",color:T.accent}}>{sec.code}</span>
                    <span style={{fontSize:10,color:T.ink3}}>{cnt} estudiante(s)</span>
                  </div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,marginBottom:3}}>{sec.name}</div>
                  {sec.schedule&&<div style={{fontSize:11,color:T.ink3}}>{sec.schedule}{sec.room?" - "+sec.room:""}</div>}
                </div>
                <Btn v="primary" sz="sm" onClick={e=>{e.stopPropagation();onSelectSection(sec);}}>Abrir -{">"}</Btn>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Sidebar({user,view,setView,section,sections,onSelectSection,onLogout,open,onClose}){
  const isProf=user.role==="professor";
  const nav=section&&isProf
    ?[{k:"panel",l:"Panel"},{k:"gantt",l:"Carta Gantt"},{k:"estudiantes",l:"Estudiantes"},{k:"recursos",l:"Recursos"},{k:"config",l:"Configuracion"},{k:"asistente",l:"Asistente IA"}]
    :isProf
      ?[{k:"home",l:"Mis Secciones"},{k:"asistente",l:"Asistente IA"}]
      :[{k:"proyecto",l:"Mi Proyecto"},{k:"proceso",l:"Proceso y Hitos"},{k:"gantt",l:"Carta Gantt"},{k:"recursos",l:"Recursos"},{k:"asistente",l:"Asistente IA"}];
  const click=k=>{setView(k);onClose();};
  return (
    <>
      {open&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:198}} onClick={onClose}/>}
      <div style={{width:210,background:T.ink,display:"flex",flexDirection:"column",flexShrink:0,zIndex:200,position:"fixed",top:0,left:0,height:"100vh",transform:open?"translateX(0)":"translateX(-100%)",transition:"transform 0.25s"}}>
        <div style={{padding:"16px 18px 10px"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:T.sidebarT,marginBottom:2}}>Seminario UC</div>
          <div style={{fontSize:9,color:T.sidebarM,letterSpacing:"0.1em"}}>DISENO 2026</div>
        </div>
        {section&&isProf&&(
          <div style={{padding:"8px 16px",background:"rgba(255,255,255,0.05)",borderTop:"1px solid #22201B",borderBottom:"1px solid #22201B",marginBottom:4}}>
            <div style={{fontSize:9,color:T.sidebarM,fontWeight:700,letterSpacing:"0.08em",marginBottom:2}}>SECCION ACTUAL</div>
            <div style={{fontSize:11,color:T.sidebarT,fontWeight:600}}>{section.code}</div>
            <div style={{fontSize:10,color:T.sidebarM,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{section.name}</div>
            <button onClick={()=>{click("home");onSelectSection(null);}} style={{background:"none",border:"none",color:T.accent,cursor:"pointer",fontSize:10,padding:"4px 0",marginTop:2}}>Ver todas las secciones</button>
          </div>
        )}
        {isProf&&!section&&sections&&sections.filter(s=>s.profId===user.id).length>0&&(
          <div style={{padding:"8px 16px",borderTop:"1px solid #22201B",borderBottom:"1px solid #22201B",marginBottom:4}}>
            <div style={{fontSize:9,color:T.sidebarM,fontWeight:700,letterSpacing:"0.08em",marginBottom:4}}>MIS SECCIONES</div>
            {sections.filter(s=>s.profId===user.id).slice(0,4).map(s=>(
              <button key={s.id} onClick={()=>{onSelectSection(s);click("panel");}} style={{display:"block",width:"100%",textAlign:"left",background:"none",border:"none",color:T.sidebarM,fontSize:11,padding:"3px 0",cursor:"pointer"}}>{s.code}</button>
            ))}
          </div>
        )}
        <nav style={{flex:1,padding:"8px 0",overflowY:"auto"}}>
          {nav.map(({k,l})=>(
            <button key={k} onClick={()=>click(k)} style={{display:"block",width:"100%",padding:"8px 18px",textAlign:"left",background:view===k?"rgba(255,255,255,0.07)":"transparent",color:view===k?T.sidebarT:T.sidebarM,fontSize:12,fontWeight:view===k?600:400,border:"none",borderLeft:view===k?"2px solid "+T.accent:"2px solid transparent",cursor:"pointer"}}>{l}</button>
          ))}
        </nav>
        <div style={{padding:"10px 18px",borderTop:"1px solid #22201B"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><Av t={user.av||user.name.slice(0,2)} sz={24}/><div><div style={{fontSize:11,color:T.sidebarT,fontWeight:500}}>{user.name.split(" ")[0]}</div><div style={{fontSize:9,color:T.sidebarM}}>{isProf?"Profesor":"Estudiante"}</div></div></div>
          <button onClick={()=>click("changepw")} style={{display:"block",width:"100%",padding:"3px 0",background:"none",border:"none",color:T.sidebarM,fontSize:10,textAlign:"left",cursor:"pointer",marginBottom:4}}>Cambiar contrasena</button>
          <Btn v="ghost" sz="sm" onClick={onLogout} s={{width:"100%",justifyContent:"center",borderColor:"#2a2820",color:T.sidebarM,fontSize:10}}>Cerrar sesion</Btn>
        </div>
      </div>
    </>
  );
}

export default function App(){
  const [ready,setReady]=useState(false);const [user,setUser]=useState(null);const [mustChg,setMustChg]=useState(false);const [view,setView]=useState("home");const [sbOpen,setSbOpen]=useState(false);const [allUsers,setAllUsers]=useState([]);const [sections,setSections]=useState([]);const [curSec,setCurSec]=useState(null);const [stuData,setStuData]=useState({});const [ganttData,setGanttData]=useState({});const [resData,setResData]=useState({});const [peerAssigns,setPeerAssigns]=useState([]);

  useEffect(()=>{(async()=>{try{await DB.init();const[u,secs]=await Promise.all([DB.getUsers(),DB.getSections()]);setAllUsers(u||[]);setSections(secs||ISECS);}catch(e){setAllUsers(IUSERS.map(({pw:_,mc:__,...u})=>u));setSections(ISECS);}setReady(true);})();},[]);

  useEffect(()=>{if(!user)return;(async()=>{const stus=allUsers.filter(u=>u.role==="student");const d={};for(const s of stus){d[s.id]={stages:await DB.getStages(s.id)||mkStages()};}setStuData(d);const sids=[...new Set(allUsers.filter(u=>u.role==="student"&&u.sectionId).map(u=>u.sectionId))];const g={},r={};for(const sid of sids){g[sid]=await DB.getGantt(sid);r[sid]=await DB.getRes(sid);}setGanttData(g);setResData(r);})();},[user,allUsers]);

  const handleLogin=async(u,must)=>{
    const[freshUsers,freshSecs]=await Promise.all([DB.getUsers(),DB.getSections()]);
    setAllUsers(freshUsers||[]);setSections(freshSecs||[]);
    setUser(u);setMustChg(must||false);
    if(u.role==="professor"){setView("home");setCurSec(null);}
    else{const ms=(freshSecs||[]).find(s=>s.id===u.sectionId)||null;setCurSec(ms);setView("proyecto");}
  };
  const handleLogout=()=>{setUser(null);setMustChg(false);setSbOpen(false);setCurSec(null);};
  const selSec=async sec=>{setCurSec(sec);if(sec){const[g,r]=await Promise.all([DB.getGantt(sec.id),DB.getRes(sec.id)]);setGanttData(p=>({...p,[sec.id]:g}));setResData(p=>({...p,[sec.id]:r}));setView("panel");}else setView("home");};
  const createSec=async sec=>{const upd=[...sections,sec];setSections(upd);await DB.setSections(upd);await DB.setGantt(sec.id,IGANG);setGanttData(p=>({...p,[sec.id]:IGANG}));setResData(p=>({...p,[sec.id]:[]}));};
  const updSec=async us=>{const upd=sections.map(s=>s.id===us.id?us:s);setSections(upd);await DB.setSections(upd);if(curSec&&curSec.id===us.id)setCurSec(us);};
  const rmStu=async id=>{const upd=allUsers.map(u=>u.id===id?{...u,sectionId:null}:u);setAllUsers(upd);await DB.setUsers(upd);};
  const updStuStages=async(uid,stages)=>{await DB.setStages(uid,stages);setStuData(p=>({...p,[uid]:{...p[uid],stages}}));};
  const profUpdStu=async(uid,stages)=>{await DB.setStages(uid,stages);setStuData(p=>({...p,[uid]:{...p[uid],stages}}));};
  const updGantt=async(sid,g)=>{setGanttData(p=>({...p,[sid]:g}));await DB.setGantt(sid,g);};
  const updRes=async(sid,r)=>{setResData(p=>({...p,[sid]:r}));await DB.setRes(sid,r);};

  const assignPeer=async(stuId,stage,peerData)=>{
    const stuStages=(stuData[stuId]&&stuData[stuId].stages)||mkStages();
    const ns={...stuStages,[stage]:{...(stuStages[stage]||{}),status:"EN_REVISION_PARES",peer:peerData}};
    await updStuStages(stuId,ns);
    const newAssign={id:Date.now()+"",reviewerId:peerData.assigneeId,stage,studentId:stuId,studentName:allUsers.find(u=>u.id===stuId)?.name||"?",due:peerData.dueAt,submitted:false};
    const updA=[...peerAssigns,newAssign];setPeerAssigns(updA);
  };

  const submitPeer=async(assign,result)=>{
    const stuStages=(stuData[assign.studentId]&&stuData[assign.studentId].stages)||mkStages();
    const cur=stuStages[assign.stage]||{};
    const ns={...stuStages,[assign.stage]:{...cur,status:"CIERRE_PARES",peer:{...cur.peer,submitted:true,eval:result.eval,comment:result.comment,submittedDate:result.date}}};
    await updStuStages(assign.studentId,ns);
    setPeerAssigns(p=>p.map(a=>a.id===assign.id?{...a,submitted:true}:a));
  };

  const secStudents=curSec?allUsers.filter(u=>u.role==="student"&&u.sectionId===curSec.id):[];
  const secStudentsData=secStudents.map(s=>({...s,...(stuData[s.id]||{stages:mkStages()})}));
  const myStages=user&&user.role==="student"?(stuData[user.id]||{stages:mkStages()}).stages:null;
  const mySection=user&&user.role==="student"?sections.find(s=>s.id===user.sectionId)||null:null;
  const myPeerAssigns=user?peerAssigns.filter(a=>a.reviewerId===user.id&&!a.submitted):[];
  const VN={home:"Mis Secciones",panel:"Panel del Curso",gantt:"Carta Gantt",estudiantes:"Estudiantes",recursos:"Recursos",config:"Configuracion",asistente:"Asistente IA",proyecto:"Mi Proyecto",proceso:"Proceso y Hitos",changepw:"Contrasena"};

  if(!ready)return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center"}}><GS/><div style={{textAlign:"center"}}><Sp/><div style={{marginTop:12,fontSize:12,color:T.ink3}}>Cargando...</div></div></div>;
  if(!user)return <AuthPage onLogin={handleLogin}/>;
  if(mustChg)return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} className="fu"><GS/><div style={{width:"100%",maxWidth:380,background:T.surface,border:"1px solid "+T.rule}}><ChangePw user={user} forced onDone={()=>setMustChg(false)}/></div></div>;

  return (
    <div className="app-shell">
      <div className="app-layout" style={{display:"flex",height:"100vh",overflow:"hidden"}}>
        <GS/>
        <Sidebar user={user} view={view} setView={setView} section={curSec} sections={sections} onSelectSection={selSec} onLogout={handleLogout} open={sbOpen} onClose={()=>setSbOpen(false)}/>
        <div className="app-content" style={{flex:1,display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden",minWidth:0}}>
          <div className="app-header" style={{height:44,background:T.surface,borderBottom:"1px solid "+T.rule,display:"flex",alignItems:"center",padding:"0 16px",gap:12,flexShrink:0,zIndex:10}}>
            <button onClick={()=>setSbOpen(v=>!v)} style={{background:"none",border:"1px solid "+T.rule,padding:"5px 8px",cursor:"pointer",color:T.ink2,fontSize:13,lineHeight:1,minWidth:32,borderRadius:2}}>{sbOpen?"X":"="}</button>
            <span style={{fontSize:11,color:T.ink,fontWeight:500}}>{VN[view]||view}</span>
            {curSec&&user&&user.role==="professor"&&<span style={{fontSize:10,color:T.ink3}}>{curSec.code}</span>}
            {myPeerAssigns.length>0&&<div style={{marginLeft:"auto",padding:"4px 10px",background:T.violetBg,border:"1px solid "+T.violet,fontSize:11,color:T.violet,fontWeight:700}}>{myPeerAssigns.length} revision(es) pendiente(s)</div>}
            <div style={{fontSize:10,color:T.ink3,fontWeight:600}} aria-label="Version beta 1">version beta_1</div>
            <div style={{flex:1}}/>
            <Av t={user.av||user.name.slice(0,2)} sz={26}/>
          </div>
          <div className="app-main" style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
            {view==="changepw"&&<div style={{flex:1,overflowY:"auto",padding:24}}><ChangePw user={user} onDone={()=>setView(user.role==="professor"?curSec?"panel":"home":"proyecto")}/></div>}
            {view==="asistente"&&<AiAssistant user={user}/>}
            {view==="home"&&user.role==="professor"&&<ProfHome user={user} sections={sections} allUsers={allUsers} onSelectSection={selSec} onCreateSection={createSec}/>}
            {view==="panel"&&user.role==="professor"&&curSec&&<ProfPanel students={secStudentsData} section={curSec} allStudents={secStudents} onUpdateStudent={profUpdStu} onAssignPeer={assignPeer}/>}
            {view==="gantt"&&user.role==="professor"&&curSec&&<GanttView user={user} gantt={ganttData[curSec.id]||IGANG} onUpdate={g=>updGantt(curSec.id,g)}/>}
            {view==="recursos"&&user.role==="professor"&&curSec&&<Resources user={user} resources={resData[curSec.id]||[]} onUpdate={r=>updRes(curSec.id,r)} section={curSec}/>}
            {view==="config"&&user.role==="professor"&&curSec&&<SectionConfig section={curSec} onSave={updSec}/>}
            {view==="estudiantes"&&user.role==="professor"&&curSec&&<StudentManager section={curSec} students={secStudents} allUsers={allUsers} onRemoveStudent={rmStu}/>}
            {view==="proyecto"&&user.role==="student"&&myStages&&<StudentProject user={user} stages={myStages} onUpdateStages={s=>updStuStages(user.id,s)} section={mySection} peerAssignments={peerAssigns} onPeerSubmit={submitPeer}/>}
            {view==="proceso"&&user.role==="student"&&<div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}><Timeline/></div>}
            {view==="gantt"&&user.role==="student"&&mySection&&<GanttView user={user} gantt={ganttData[mySection.id]||IGANG}/>}
            {view==="recursos"&&user.role==="student"&&<Resources user={user} resources={mySection?resData[mySection.id]||[]:[]} onUpdate={r=>mySection&&updRes(mySection.id,r)} section={mySection}/>}
          </div>
        </div>
      </div>
    </div>
  );
}
