
// Zebra Health EDS Tracker — app.jsx v2
function Card({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{
      background:"var(--bg-card)", border:"1px solid var(--border)",
      borderRadius:16, padding:18, marginBottom:10, ...style
    }}>{children}</div>
  );
}

function Btn({ children, onClick, v, style, disabled }) {
  const base = { border:"none", borderRadius:10, cursor:disabled?"default":"pointer", fontFamily:"inherit", fontSize:14, fontWeight:500, padding:"9px 20px", opacity:disabled?0.45:1, transition:"opacity 0.2s" };
  const vs = {
    p:   { background:"linear-gradient(135deg,#7c3aed,#a855f7)", color:"#fff" },
    sm:  { background:"var(--bg-btn-sm)", color:"var(--txt-accent)", fontSize:13, padding:"6px 14px", borderRadius:8 },
    del:{background:"#dc2626",color:"#0f172a",fontSize:12,padding:"6px 14px",borderRadius:8,border:"none",fontWeight:700,cursor:"pointer"},
    chip:{ borderRadius:100, fontSize:12, padding:"5px 12px", background:"var(--bg-chip)", border:"1.5px solid var(--border)", color:"var(--txt-mute)" },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...(vs[v||"p"]), ...style }}>{children}</button>;
}

function Inp({ value, onChange, placeholder, type, style, step }) {
  return (
    <input value={value} onChange={onChange} placeholder={placeholder} type={type||"text"} step={step}
      style={{ background:"var(--bg-input)", border:"1px solid var(--border-input)", borderRadius:10, color:"var(--txt)", padding:"9px 13px", fontFamily:"inherit", fontSize:14, width:"100%", outline:"none", boxSizing:"border-box", ...style }} />
  );
}

function Sel({ value, onChange, children, style }) {
  return (
    <select value={value} onChange={onChange} style={{ background:"var(--bg-select)", border:"1px solid var(--border-input)", borderRadius:10, color:"var(--txt)", padding:"9px 13px", fontFamily:"inherit", fontSize:14, width:"100%", outline:"none", boxSizing:"border-box", ...style }}>
      {children}
    </select>
  );
}

function Textarea({ value, onChange, placeholder }) {
  return (
    <textarea value={value} onChange={onChange} placeholder={placeholder}
      style={{ background:"var(--bg-input)", border:"1px solid var(--border-input)", borderRadius:10, color:"var(--txt)", padding:"9px 13px", fontFamily:"inherit", fontSize:14, width:"100%", outline:"none", resize:"vertical", minHeight:80, boxSizing:"border-box" }} />
  );
}

function Label({ children }) {
  return <div style={{ fontFamily:"sans-serif", fontSize:12, color:"var(--txt-mute)", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:5 }}>{children}</div>;
}

function Slider({ label, value, onChange, max }) {
  return (
    <div style={{ marginBottom:14 }}>
      <Label>{label}: {value}/{max||10}</Label>
      <input type="range" min={0} max={max||10} value={value} onChange={onChange} style={{ width:"100%", accentColor:"#9878e8" }} />
    </div>
  );
}

function Row({ children, gap }) {
  return <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:gap||10 }}>{children}</div>;
}

function T({ size, color, weight, children, style }) {
  return <div style={{ fontFamily:"sans-serif", fontSize:size||13, color:color||"var(--txt-dim)", fontWeight:weight||500, lineHeight:1.7, ...style }}>{children}</div>;
}

function H({ children }) {
  return <div style={{ fontFamily:"serif", fontSize:22, fontWeight:600, color:"var(--txt-accent)", letterSpacing:"0.4px", marginBottom:16 }}>{children}</div>;
}

function SubH({ children }) {
  return <div style={{ fontFamily:"serif", fontSize:17, fontWeight:700, color:"var(--txt-accent)", marginBottom:10 }}>{children}</div>;
}

function Alert({ children, color }) {
  const c = color||"#dc2626";
  return <div style={{ background:c+"22", border:"2px solid "+c+"80", borderRadius:12, padding:"12px 16px", marginBottom:12 }}>{children}</div>;
}

function Badge({ label, color }) {
  return <span style={{ display:"inline-block", padding:"1px 7px", borderRadius:5, fontSize:11, fontWeight:600, background:color+"18", color:color, border:"1px solid "+color+"30", marginRight:4, marginBottom:3 }}>{label}</span>;
}

function Chips({ items, selected, onSelect, getColor }) {
  return (
    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
      {items.map(item => {
        const c = getColor ? getColor(item) : "#9878e8";
        const active = selected === item;
        return (
          <Btn key={item} v="chip" onClick={() => onSelect(item)}
            style={{ borderColor:active?c:"var(--border)", background:active?c+"22":"var(--bg-chip)", color:active?c:"var(--txt-mute)" }}>
            {item}
          </Btn>
        );
      })}
    </div>
  );
}

function condColor(c) {
  return c==="EDS"?"#6d28d9":c==="POTS"?"#0891b2":c==="MCAS"?"#9333ea":c==="WOMENS"?"#db2777":c==="LC"?"#059669":"#94a3b8";
}

function yogaSteps(y) {
  if (!y || !y.instructions) return [];
  return y.instructions.split(/\.\s+/).map(function(s) { return s.replace(/\.$/, "").trim(); }).filter(function(s) { return s.length > 0; });
}


// ─── MAIN APP ─────────────────────────────────────────────────────────────────

function ZebraHealth() {
  const today = new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});

  // Nav
  const [activeTab, setActiveTab] = useState("dashboard");




  const [editNav,   setEditNav]   = useState(false);

  // Daily log
  const [symptoms,  setSymptoms]  = useState([]);
  const [vitals,    setVitals]    = useState({hr:"",bp_s:"",bp_d:"",o2:"",temp:""});
  const [energy,    setEnergy]    = useState(5);
  const [sleepH,    setSleepH]    = useState("");
  const [sleepQ,    setSleepQ]    = useState(5);
  const [hydration, setHydration] = useState(0);
  const [period,    setPeriod]    = useState("");
  const [cycle,     setCycle]     = useState(28);
  const [notes,     setNotes]     = useState("");
  const [weather,   setWeather]   = useState("");

  // Medications
  const [meds, setMeds] = useState([
    {id:1, name:"Cetirizine",  dose:"10mg", freq:"Daily AM",     refill:"2026-04-01", cat:"Antihistamine H1"},
    {id:2, name:"Famotidine",  dose:"20mg", freq:"Daily AM/PM",  refill:"2026-04-15", cat:"Antihistamine H2"},
  ]);
  const [newMed, setNewMed] = useState({name:"",dose:"",freq:"",refill:"",cat:""});

  // Appointments
  const [appts, setAppts] = useState([
    {id:1, type:"Cardiologist (POTS specialist)", date:"2026-03-28", time:"10:00", notes:"Tilt table follow-up"},
    {id:2, type:"Allergist/Immunologist (MCAS)",  date:"2026-04-10", time:"14:00", notes:"LTE4 results review"},
  ]);
  const [newAppt, setNewAppt] = useState({type:"",date:"",time:"",notes:""});

  // POTS checker
  const [potsLying, setPotsLying] = useState("");
  const [potsSt1,   setPotsSt1]   = useState("");

  // Food checker
  const [foodQ,      setFoodQ]      = useState("");
  const [currentAudio,  setCurrentAudio]  = useState(null);
  const [audioPlaying,  setAudioPlaying]  = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [recFilter,     setRecFilter]     = useState("All");
  const audioRef = React.useRef(null);
  const [foodR,      setFoodR]      = useState(null);
  const [foodSubTab, setFoodSubTab] = useState("database");
  const [activeDiet, setActiveDiet] = useState(null);
  const [dietView,   setDietView]   = useState(null);
  const [foodCat,    setFoodCat]    = useState("high_histamine");
  const [foodLog,    setFoodLog]    = useState([]);
  const [newFoodEntry, setNewFoodEntry] = useState({date:"",meal:"",foods:"",reactions:"",severity:"none",notes:""});

  // Yoga
  const [yogaView,    setYogaView]    = useState("library");
  const [yogaCat,     setYogaCat]     = useState("All");
  const [yogaCond,    setYogaCond]    = useState("All");
  const [favorites,   setFavorites]   = useState(["Diaphragmatic Breathing","Legs-Up-the-Wall (Viparita Karani)"]);
  const [programs,    setPrograms]    = useState([
    {id:1, name:"Morning Calm", emoji:"🌅", techniques:["Diaphragmatic Breathing","Legs-Up-the-Wall (Viparita Karani)"], notes:"Before rising"},
  ]);
  const [editProg,    setEditProg]    = useState(null);
  const [session,     setSession]     = useState(null);
  const [newProgName, setNewProgName] = useState("");
  const [newProgEmoji,setNewProgEmoji]= useState("🧘");
  const [selYoga,     setSelYoga]     = useState(null);

  // Specialists
  const [specs, setSpecs] = useState([
    {id:1, name:"Dr. Sarah Chen", type:"Cardiologist (POTS specialist)", phone:"555-0100", address:"123 Medical Blvd", notes:"Familiar with EDS/POTS overlap"},
  ]);
  const [newSpec, setNewSpec] = useState({name:"",type:"",phone:"",address:"",notes:""});

  // Labs
  const [labs, setLabs] = useState([
    {id:1, test:"Urinary LTE4", value:"elevated", date:"2026-03-01", notes:"Positive mast cell indicator"},
  ]);
  const [newLab, setNewLab] = useState({test:"",value:"",date:"",notes:""});

  // Joints
  const [joints,   setJoints]   = useState([]);
  const [newJoint, setNewJoint] = useState({joint:"",severity:"",time:"",notes:""});

  // Resources
  const [resTab,        setResTab]        = useState("clinics");
  const [clinicCountry, setClinicCountry] = useState("All");
  const [clinicCond,    setClinicCond]    = useState("All");
  const [clinicOffers,  setClinicOffers]  = useState([]);
  const [clinicSearch,  setClinicSearch]  = useState("");
  const [clinicOpen,    setClinicOpen]    = useState(null);
  const [orgCat,        setOrgCat]        = useState("All");
  const [orgCond,       setOrgCond]       = useState("All");
  const [orgSearch,     setOrgSearch]     = useState("");
  const [orgOpen,       setOrgOpen]       = useState(null);

  // Long COVID
  const [lcTab,      setLcTab]      = useState("daily");
  const [lcSyms,     setLcSyms]     = useState([]);
  const [lcFatigue,  setLcFatigue]  = useState(0);
  const [lcFog,      setLcFog]      = useState(0);
  const [lcBreath,   setLcBreath]   = useState(0);
  const [lcHrRest,   setLcHrRest]   = useState("");
  const [lcHrPeak,   setLcHrPeak]   = useState("");
  const [lcAtHR,     setLcAtHR]     = useState("");
  const [lcAtAge,    setLcAtAge]    = useState("");
  const [lcAtRest,   setLcAtRest]   = useState("");
  const [lcRecovery, setLcRecovery] = useState([]);
  const [lcNewDate,  setLcNewDate]  = useState("");
  const [lcNewPct,   setLcNewPct]   = useState(50);
  const [lcNewMile,  setLcNewMile]  = useState("");
  const [lcNewNote,  setLcNewNote]  = useState("");
  const [lcSelSym,   setLcSelSym]   = useState(null);

  // Journal
  const [journalEntries, setJournalEntries] = useState([]);
  const [journalLoading, setJournalLoading] = useState(false);
  const [journalSearch,  setJournalSearch]  = useState("");
  const [journalView,    setJournalView]    = useState("list");
  const [journalEdit,    setJournalEdit]    = useState(null);
  const [journalForm,    setJournalForm]    = useState({title:"", body:"", entryDate:new Date().toISOString().split("T")[0]});

  // Modal
  const [selSym,         setSelSym]         = useState(null);
  const [customSymInput, setCustomSymInput] = useState("");
  const [customSymNotes, setCustomSymNotes] = useState("");
  const [customSymSev,   setCustomSymSev]   = useState("moderate");
  const [customSymptoms, setCustomSymptoms] = useState([]);
  const [editMedId,      setEditMedId]      = useState(null);
  const [editMedData,    setEditMedData]    = useState({});
  const [cycleLog,       setCycleLog]       = useState([]);
  const [cycleSym,       setCycleSym]       = useState({date:"",symptoms:"",severity:"none",notes:"",mood:"",energy:""});
  const [cycleSymLog,    setCycleSymLog]    = useState([]);
  const [cycleView,      setCycleView]      = useState("tracker");


  // ── LOCAL STORAGE: Load saved data on app start ─────────────
  const [storageReady, setStorageReady] = React.useState(false);
  React.useEffect(function() {
    var saved = loadAll();
    if (saved) {
      if (saved.symptoms !== undefined) setSymptoms(saved.symptoms);
      if (saved.vitals !== undefined) setVitals(saved.vitals);
      if (saved.energy !== undefined) setEnergy(saved.energy);
      if (saved.sleepH !== undefined) setSleepH(saved.sleepH);
      if (saved.sleepQ !== undefined) setSleepQ(saved.sleepQ);
      if (saved.hydration !== undefined) setHydration(saved.hydration);
      if (saved.period !== undefined) setPeriod(saved.period);
      if (saved.cycleLog !== undefined) setCycleLog(saved.cycleLog);
      if (saved.cycleSymLog !== undefined) setCycleSymLog(saved.cycleSymLog);
      if (saved.customSymptoms !== undefined) setCustomSymptoms(saved.customSymptoms);
      if (saved.cycle !== undefined) setCycle(saved.cycle);
      if (saved.notes !== undefined) setNotes(saved.notes);
      if (saved.weather !== undefined) setWeather(saved.weather);
      if (saved.meds !== undefined) setMeds(saved.meds);
      if (saved.appts !== undefined) setAppts(saved.appts);
      if (saved.potsLying !== undefined) setPotsLying(saved.potsLying);
      if (saved.potsSt1 !== undefined) setPotsSt1(saved.potsSt1);
      if (saved.favorites !== undefined) setFavorites(saved.favorites);
      if (saved.programs !== undefined) setPrograms(saved.programs);
      if (saved.session !== undefined) setSession(saved.session);
      if (saved.specs !== undefined) setSpecs(saved.specs);
      if (saved.labs !== undefined) setLabs(saved.labs);
      if (saved.joints !== undefined) setJoints(saved.joints);
      if (saved.clinicCountry !== undefined) setClinicCountry(saved.clinicCountry);
      if (saved.clinicOffers !== undefined) setClinicOffers(saved.clinicOffers);
      if (saved.orgCat !== undefined) setOrgCat(saved.orgCat);
      if (saved.lcSyms !== undefined) setLcSyms(saved.lcSyms);
      if (saved.lcFatigue !== undefined) setLcFatigue(saved.lcFatigue);
      if (saved.lcFog !== undefined) setLcFog(saved.lcFog);
      if (saved.lcBreath !== undefined) setLcBreath(saved.lcBreath);
      if (saved.lcHrRest !== undefined) setLcHrRest(saved.lcHrRest);
      if (saved.lcHrPeak !== undefined) setLcHrPeak(saved.lcHrPeak);
      if (saved.lcAtHR !== undefined) setLcAtHR(saved.lcAtHR);
      if (saved.lcAtAge !== undefined) setLcAtAge(saved.lcAtAge);
      if (saved.lcAtRest !== undefined) setLcAtRest(saved.lcAtRest);
      if (saved.lcRecovery !== undefined) setLcRecovery(saved.lcRecovery);
      if (saved.foodLog !== undefined) setFoodLog(saved.foodLog);
      if (saved.activeDiet !== undefined) setActiveDiet(saved.activeDiet);
      if (saved.recFilter !== undefined) setRecFilter(saved.recFilter);
      if (saved.tabs !== undefined) {
        var savedIds = new Set(saved.tabs.map(function(t){ return t.id; }));
        var merged = saved.tabs.slice();
        DEFAULT_TABS.forEach(function(dt) {
          if (!savedIds.has(dt.id)) merged.push(dt);
        });
        merged = merged.filter(function(t) {
          return DEFAULT_TABS.some(function(dt){ return dt.id === t.id; });
        });
        setTabs(merged);
      }
    }
    setStorageReady(true);
  }, []);

  // ── LOCAL STORAGE: Save whenever user data changes ───────────
  React.useEffect(function() {
    if (!storageReady) return; // don't save before load completes
    saveAll({
      symptoms: symptoms,
      vitals: vitals,
      energy: energy,
      sleepH: sleepH,
      sleepQ: sleepQ,
      hydration: hydration,
      period: period,
      cycleLog: cycleLog,
      cycleSymLog: cycleSymLog,
      customSymptoms: customSymptoms,
      cycle: cycle,
      notes: notes,
      weather: weather,
      meds: meds,
      appts: appts,
      potsLying: potsLying,
      potsSt1: potsSt1,
      favorites: favorites,
      programs: programs,
      session: session,
      specs: specs,
      labs: labs,
      joints: joints,
      clinicCountry: clinicCountry,
      clinicOffers: clinicOffers,
      orgCat: orgCat,
      lcSyms: lcSyms,
      lcFatigue: lcFatigue,
      lcFog: lcFog,
      lcBreath: lcBreath,
      lcHrRest: lcHrRest,
      lcHrPeak: lcHrPeak,
      lcAtHR: lcAtHR,
      lcAtAge: lcAtAge,
      lcAtRest: lcAtRest,
      lcRecovery: lcRecovery,
      foodLog: foodLog,
      activeDiet: activeDiet,
      recFilter: recFilter,
      tabs: tabs,
    });
  }, [storageReady, symptoms, foodLog, activeDiet, recFilter, vitals, energy, sleepH, sleepQ, hydration, period, cycle, notes, weather, meds, appts, potsLying, potsSt1, favorites, programs, session, specs, labs, joints, clinicCountry, clinicOffers, orgCat, lcSyms, lcFatigue, lcFog, lcBreath, lcHrRest, lcHrPeak, lcAtHR, lcAtAge, lcAtRest, lcRecovery, tabs]);







  // ── EXPORT: collect current state for export functions ───────
  function getExportState() {
    return {
      symptoms: symptoms,
      vitalLog: symptoms.filter(function(s){ return s.type === "vital"; }),
      meds: meds,
      appts: appts,
      labs: labs,
      joints: joints,
      lcRecovery: lcRecovery,
    };
  }


  // ── Computed
  const refillsSoon = meds.filter(m => !isNaN(new Date(m.refill)) && (new Date(m.refill)-new Date())/86400000 <= 14);
  const upcomingAppts = [...appts].sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(0,3);
  const potsDiff = (potsLying && potsSt1) ? parseInt(potsSt1)-parseInt(potsLying) : null;
  const potsResult = potsDiff===null ? null
    : potsDiff>=40 ? {text:"Significant POTS criteria met (40+ bpm rise)", color:"#dc2626"}
    : potsDiff>=30 ? {text:"POTS criteria met (30+ bpm rise)", color:"#0284c7"}
    : potsDiff>=20 ? {text:"Borderline orthostatic (20-29 bpm rise)", color:"#0284c7"}
    : {text:"Mild rise ("+potsDiff+" bpm) — within range", color:"#0d9488"};
  const pemRisk = lcSyms.length>=4 || lcFatigue>=8 || (lcAtHR && lcHrPeak && parseInt(lcHrPeak)>parseInt(lcAtHR));
  const lcAtResult = (lcAtAge && lcAtRest) ? Math.round(parseInt(lcAtRest)+(220-parseInt(lcAtAge)-parseInt(lcAtRest))*0.50) : null;

  // ── Helpers
  function toggleSym(id) {
    setSymptoms(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  }

  function checkFood(q) {
    if (!q.trim()) return;
    const lq = q.toLowerCase();
    for (const [cat, data] of Object.entries(MCAS_FOODS)) {
      if (!data.subcats) continue;
      for (const [subcat, foods] of Object.entries(data.subcats)) {
        if (foods.some(f => f.toLowerCase().includes(lq))) {
          setFoodR({cat, label:data.label, color:data.color, icon:data.icon, note:data.note, subcat, food:foods.find(f=>f.toLowerCase().includes(lq))});
          return;
        }
      }
    }
    setFoodR("unknown");
  }

  function moveTab(i, dir) {
    setTabs(prev => {
      const vis = prev.filter(t=>!t.hidden);
      const hid = prev.filter(t=>t.hidden);
      const arr = [...vis];
      const j = i+dir;
      if (j<0||j>=arr.length) return prev;
      [arr[i],arr[j]]=[arr[j],arr[i]];
      return [...arr,...hid];
    });
  }

  const [dragIdx, setDragIdx] = useState(null);
  const [dropIdx, setDropIdx] = useState(null);
  const touchRef = useRef(null);

  function reorderTabs(fromIdx, toIdx) {
    if (fromIdx === toIdx || fromIdx == null || toIdx == null) return;
    setTabs(prev => {
      const vis = prev.filter(t => !t.hidden);
      const hid = prev.filter(t => t.hidden);
      const arr = [...vis];
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, moved);
      return [...arr, ...hid];
    });
  }

  function handleDragStart(e, i) {
    setDragIdx(i);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(i));
    if (e.target) e.target.style.opacity = "0.5";
  }

  function handleDragEnd(e) {
    if (e.target) e.target.style.opacity = "1";
    setDragIdx(null);
    setDropIdx(null);
  }

  function handleDragOver(e, i) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (i !== dropIdx) setDropIdx(i);
  }

  function handleDrop(e, i) {
    e.preventDefault();
    reorderTabs(dragIdx, i);
    setDragIdx(null);
    setDropIdx(null);
  }

  function handleTouchStart(e, i) {
    var touch = e.touches[0];
    touchRef.current = { idx: i, startX: touch.clientX, startY: touch.clientY, moved: false, el: e.currentTarget };
  }

  function handleTouchMove(e) {
    if (!touchRef.current) return;
    var touch = e.touches[0];
    var dx = Math.abs(touch.clientX - touchRef.current.startX);
    var dy = Math.abs(touch.clientY - touchRef.current.startY);
    if (dx > 10) touchRef.current.moved = true;
    if (!touchRef.current.moved) return;
    e.preventDefault();
    var el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (el) {
      var tabEl = el.closest("[data-tab-idx]");
      if (tabEl) {
        var toIdx = parseInt(tabEl.getAttribute("data-tab-idx"), 10);
        if (!isNaN(toIdx)) setDropIdx(toIdx);
      }
    }
  }

  function handleTouchEnd() {
    if (touchRef.current && touchRef.current.moved && dropIdx != null) {
      reorderTabs(touchRef.current.idx, dropIdx);
    }
    touchRef.current = null;
    setDragIdx(null);
    setDropIdx(null);
  }

  // Journal — stored in localStorage, never sent to any server
  function loadJournalFromStorage() {
    try {
      var saved = localStorage.getItem("zheds_journal_v1");
      return saved ? JSON.parse(saved) : [];
    } catch(e) { return []; }
  }

  function saveJournalToStorage(entries) {
    try { localStorage.setItem("zheds_journal_v1", JSON.stringify(entries)); } catch(e) {}
  }

  function fetchJournal(q) {
    setJournalLoading(true);
    var all = loadJournalFromStorage();
    var filtered = q ? all.filter(function(e){
      var term = q.toLowerCase();
      return (e.title||"").toLowerCase().includes(term) || (e.body||"").toLowerCase().includes(term);
    }) : all;
    // Sort newest first
    filtered.sort(function(a,b){ return (b.entryDate||"") > (a.entryDate||"") ? 1 : -1; });
    setJournalEntries(filtered);
    setJournalLoading(false);
  }

  function saveJournalEntry() {
    var all = loadJournalFromStorage();
    if (journalEdit) {
      var updated = all.map(function(e){
        return e.id === journalEdit.id
          ? { ...e, title:journalForm.title, body:journalForm.body, entryDate:journalForm.entryDate, updatedAt:new Date().toISOString() }
          : e;
      });
      saveJournalToStorage(updated);
    } else {
      var newEntry = { id:Date.now(), title:journalForm.title, body:journalForm.body, entryDate:journalForm.entryDate, createdAt:new Date().toISOString() };
      saveJournalToStorage([newEntry].concat(all));
    }
    setJournalForm({title:"", body:"", entryDate:new Date().toISOString().split("T")[0]});
    setJournalEdit(null);
    setJournalView("list");
    fetchJournal(journalSearch);
  }

  function deleteJournalEntry(id) {
    if (!window.confirm("Delete this journal entry?")) return;
    var all = loadJournalFromStorage().filter(function(e){ return e.id !== id; });
    saveJournalToStorage(all);
    fetchJournal(journalSearch);
  }

  React.useEffect(function() {
    if (activeTab === "journal") fetchJournal(journalSearch);
  }, [activeTab]);

  const visTabs = tabs.filter(t=>!t.hidden);

  // ─── STYLES ──────────────────────────────────────────────────────────────────



  return (
    <div  style={{fontFamily:"Georgia,serif",background:"linear-gradient(160deg,#f8fafc 0%,#f0f4ff 50%,#f8fafc 100%)",minHeight:"100vh",color:"#f8fafc",transition:"background 0.3s ease, color 0.3s ease"}}>


      {/* HEADER */}
      <div style={{background:"var(--bg-header)",borderBottom:"1px solid var(--border)",padding:"14px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(12px)"}}>
        <div>
          <div style={{fontSize:24,fontWeight:300,letterSpacing:1,color:"var(--txt-accent)"}}>✦ Zebra Health</div>
          <div style={{fontFamily:"sans-serif",fontSize:12,color:"var(--txt-mute)",marginTop:2}}>EDS · POTS · MCAS Tracker</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>

            style={{background:"linear-gradient(160deg,#f8fafc 0%,#f0f4ff 50%,#f8fafc 100%)",border:"2px solid "+("rgba(124,58,237,0.5)"),borderRadius:20,fontSize:18,lineHeight:1,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",padding:"5px 12px",cursor:"pointer",fontFamily:"sans-serif",fontSize:18,lineHeight:1,color:"var(--txt-accent)",transition:"all 0.2s"}}>
            {"🌙"}
          </button>
          <div style={{fontFamily:"sans-serif",fontSize:13,color:"var(--txt-dim)",textAlign:"right"}}>
            <div>{today}</div>
            {refillsSoon.length > 0 && <div style={{color:"#0284c7",fontSize:12}}>⚠ {refillsSoon.length} refill(s) due soon</div>}
          </div>
        </div>
      </div>

      {/* NAV */}
      <div style={{background:"var(--bg-nav)",borderBottom:"1px solid var(--border)"}}>
        {editNav && (
          <div style={{padding:"7px 18px",background:"var(--edit-nav-bg)",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <T size={12} color="var(--txt-accent)">Drag tabs to reorder · ✕ to hide · + to restore</T>
            <Btn v="p" style={{padding:"3px 12px",fontSize:12}} onClick={()=>setEditNav(false)}>Done</Btn>
            <Btn v="sm" style={{fontSize:12,padding:"3px 10px"}} onClick={()=>setTabs(DEFAULT_TABS)}>Reset</Btn>
          </div>
        )}
        <div style={{display:"flex",padding:"3px 8px",gap:2,overflowX:"auto",alignItems:"center"}}>
          {visTabs.map((t,i) => (
            <div key={t.id} data-tab-idx={i}
              draggable
              onDragStart={function(e){handleDragStart(e,i)}}
              onDragEnd={handleDragEnd}
              onDragOver={function(e){handleDragOver(e,i)}}
              onDrop={function(e){handleDrop(e,i)}}
              onTouchStart={function(e){handleTouchStart(e,i)}}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{display:"flex",alignItems:"center",borderLeft:dropIdx===i&&dragIdx!==i?"2px solid var(--txt-accent)":"2px solid transparent",transition:"border-left 0.15s"}}>
              {editNav && i>0 && (
                <button onClick={()=>moveTab(i,-1)} style={{background:"none",border:"none",color:"var(--nav-arrow)",cursor:"pointer",fontSize:13,padding:"0 1px"}}>←</button>
              )}
              <button onClick={()=>{ if(!editNav) setActiveTab(t.id); }}
                style={{background:"none",border:"none",cursor:editNav?"grab":"pointer",padding:"9px 12px",color:activeTab===t.id&&!editNav?"var(--txt-accent)":"var(--txt-mute)",borderBottom:activeTab===t.id&&!editNav?"2px solid var(--tab-active-border)":"2px solid transparent",fontFamily:"sans-serif",fontSize:13,display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap",outline:editNav?"1px dashed var(--border)":"none",borderRadius:editNav?6:0}}>
                {t.icon} {t.label}
                {editNav && (
                  <span onClick={e=>{e.stopPropagation();setTabs(prev=>prev.map(x=>x.id===t.id?{...x,hidden:true}:x));if(activeTab===t.id)setActiveTab("dashboard");}} style={{marginLeft:3,color:"#dc2626",cursor:"pointer",fontSize:13,fontWeight:700}}>✕</span>
                )}
              </button>
              {editNav && i<visTabs.length-1 && (
                <button onClick={()=>moveTab(i,1)} style={{background:"none",border:"none",color:"var(--nav-arrow)",cursor:"pointer",fontSize:13,padding:"0 1px"}}>→</button>
              )}
            </div>
          ))}
          {editNav && tabs.filter(t=>t.hidden).map(t=>(
            <button key={t.id+"_h"} onClick={()=>setTabs(prev=>prev.map(x=>x.id===t.id?{...x,hidden:false}:x))}
              style={{padding:"4px 10px",background:"var(--bg-card)",border:"1px dashed var(--border-input)",borderRadius:8,cursor:"pointer",fontFamily:"sans-serif",fontSize:12,color:"#0d9488",whiteSpace:"nowrap"}}>
              + {t.icon} {t.label}
            </button>
          ))}
          <button onClick={()=>setEditNav(e=>!e)} title="Customize tabs"
            style={{marginLeft:6,padding:"5px 9px",background:editNav?"rgba(140,100,220,0.35)":"var(--bg-chip)",border:"1px solid "+(editNav?"rgba(212,184,255,0.5)":"var(--border)"),borderRadius:8,cursor:"pointer",color:editNav?"var(--txt-accent)":"var(--nav-arrow)",fontSize:14}}>⚙</button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{padding:"22px",maxWidth:1100,margin:"0 auto"}}>


        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="fade">
            <H>Today's Overview</H>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:20}}>
              {[["📋","Symptoms",symptoms.length,"#6d28d9"],["⚡","Energy",energy+"/10","#0891b2"],["💧","Hydration",hydration+"/8","#0d9488"],["🌙","Sleep Hrs",sleepH||"—","var(--txt-accent)"]].map(([icon,label,value,color])=>(
                <Card key={label} style={{textAlign:"center"}}>
                  <div style={{fontSize:26,marginBottom:6}}>{icon}</div>
                  <div style={{fontSize:30,fontWeight:300,color,fontFamily:"serif"}}>{value}</div>
                  <T size={12} color="var(--txt-dim)" style={{marginTop:4}}>{label}</T>
                </Card>
              ))}
            </div>
            {refillsSoon.length > 0 && (
              <Alert color="#0284c7">
                <T size={14} color="#0284c7" weight={600} style={{marginBottom:6}}>⚠ Refills Due Within 14 Days</T>
                {refillsSoon.map(m=><T key={m.id} size={13} color="#0284c7">• {m.name} {m.dose} — {m.refill}</T>)}
              </Alert>
            )}
            <Row>
              <Card>
                <SubH>Upcoming Appointments</SubH>
                {upcomingAppts.length===0 ? <T size={13} color="var(--txt-mute)">None scheduled</T> : upcomingAppts.map(a=>(
                  <div key={a.id} style={{padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                    <T size={14} color="var(--txt-accent)">{a.type}</T>
                    <T size={12}>{a.date} at {a.time}</T>
                    {a.notes && <T size={12} color="var(--txt-mute)" style={{fontStyle:"italic"}}>{a.notes}</T>}
                  </div>
                ))}
              </Card>
              <Card>
                <SubH>Active Symptoms</SubH>
                {symptoms.length===0 ? <T size={13} color="var(--txt-mute)">None logged yet</T> : (
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {symptoms.map(sid=>{
                      const s=ALL_SYMPTOMS.find(x=>x.id===sid);
                      return s ? <span key={sid} style={{background:"rgba(140,100,220,0.25)",border:"1px solid rgba(140,100,220,0.35)",borderRadius:6,padding:"2px 8px",fontSize:12,color:"var(--txt-dim)"}}>{s.icon} {s.name}</span> : null;
                    })}
                  </div>
                )}
              </Card>
            </Row>
            <Card style={{marginTop:14}}>
              <SubH>🌦 Weather and Barometric Notes</SubH>
              <Inp value={weather} onChange={e=>setWeather(e.target.value)} placeholder="Note today's weather or pressure changes and how they affect your symptoms..." />
              <T size={12} color="var(--txt-mute)">Barometric pressure drops often precede EDS joint pain, POTS flares, and MCAS reactions.</T>
            </Card>
          </div>
        )}

        {/* SYMPTOMS */}
        {activeTab === "symptoms" && (
          <div className="fade">
            <H>Symptom Tracker</H>
            <T size={13} style={{marginBottom:16}}>Tap any symptom to log it. Tap info for causes and yoga protocols.</T>

            {[["EDS","#6d28d9","Ehlers-Danlos Syndrome"],["POTS","#0891b2","POTS / Dysautonomia"],["MCAS","#9333ea","Mast Cell Activation"],["WOMENS","#db2777","Women's Health"],["LC","#059669","Long COVID"]].map(function(item){ var cond=item[0],color=item[1],label=item[2]; return (
              <div key={cond} style={{marginBottom:22}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{width:4,height:20,background:color,borderRadius:2}} />
                  <T size={16} color={color} weight={700} style={{fontFamily:"serif"}}>{label}</T>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {(COND_SYMPTOMS[cond]||[]).map(function(s){
                    const active=symptoms.includes(s.id);
                    return (
                      <div key={s.id} onClick={function(){toggleSym(s.id);}}
                        style={{display:"flex",alignItems:"center",gap:5,padding:"5px 11px",borderRadius:20,cursor:"pointer",
                          border:"1.5px solid "+(active?color:"var(--border)"),
                          background:active?color+"25":"var(--bg-card)",transition:"all 0.15s"}}>
                        <span style={{fontSize:13}}>{s.icon}</span>
                        <span style={{fontFamily:"sans-serif",fontSize:12,fontWeight:600,color:active?color:"var(--txt-dim)"}}>{s.name}</span>
                        {active && <span style={{fontSize:10,color:color}}>✓</span>}
                        <span onClick={function(e){e.stopPropagation();setSelSym(selSym&&selSym.id===s.id?null:s);}}
                          style={{fontSize:10,color:"var(--txt-mute)",cursor:"pointer",marginLeft:2,textDecoration:"underline"}}>info</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );})}

            <Card style={{marginTop:8}}>
              <SubH>+ Add Custom Symptom</SubH>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <Inp value={customSymInput} onChange={function(e){setCustomSymInput(e.target.value);}} placeholder="Describe your symptom..." />
                <Sel value={customSymSev} onChange={function(e){setCustomSymSev(e.target.value);}}>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </Sel>
              </div>
              <Inp value={customSymNotes} onChange={function(e){setCustomSymNotes(e.target.value);}} placeholder="Notes (optional)..." style={{marginBottom:10}} />
              <Btn onClick={function(){
                if(!customSymInput.trim()) return;
                var entry={id:"custom_"+Date.now(),name:customSymInput.trim(),severity:customSymSev,notes:customSymNotes,date:new Date().toLocaleDateString(),custom:true};
                setCustomSymptoms(function(prev){return [entry].concat(prev);});
                setCustomSymInput(""); setCustomSymNotes("");
              }}>Save</Btn>
            </Card>

            {customSymptoms.length > 0 && (
              <div style={{marginTop:12}}>
                <SubH>Your Custom Symptoms</SubH>
                {customSymptoms.map(function(s){ return (
                  <Card key={s.id} style={{marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <T size={14} weight={600}>{s.name}</T>
                      <T size={12} color="var(--txt-mute)">{s.severity} · {s.date}{s.notes?" · "+s.notes:""}</T>
                    </div>
                    <Btn v="del" onClick={function(){setCustomSymptoms(function(prev){return prev.filter(function(x){return x.id!==s.id;});});}}>Remove</Btn>
                  </Card>
                );})}
              </div>
            )}

            {selSym && (
              <div style={{position:"fixed",inset:0,background:"var(--overlay)",zIndex:50,display:"flex",alignItems:"flex-end",justifyContent:"center"}}
                onClick={function(){setSelSym(null);}}>
                <div onClick={function(e){e.stopPropagation();}} style={{background:"var(--bg-modal)",borderRadius:"20px 20px 0 0",padding:28,width:"100%",maxWidth:600,maxHeight:"80vh",overflowY:"auto"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <T size={20} weight={700} color="var(--txt-accent)" style={{fontFamily:"serif"}}>{selSym.icon} {selSym.name}</T>
                    <Btn v="sm" onClick={function(){setSelSym(null);}}>✕ Close</Btn>
                  </div>
                  {selSym.causes && <div style={{marginBottom:14}}><SubH>Causes</SubH>{selSym.causes.map(function(c,i){return <T key={i} size={13} style={{marginBottom:4}}>• {c}</T>;})}</div>}
                  {selSym.relief && <div style={{marginBottom:14}}><SubH>Relief Strategies</SubH>{selSym.relief.map(function(r,i){return <T key={i} size={13} style={{marginBottom:4}}>• {r}</T>;})}</div>}
                  {selSym.yoga && <div><SubH>Yoga Therapy</SubH><T size={13}>{selSym.yoga}</T></div>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VITALS */}
        {activeTab === "vitals" && (
          <div className="fade">
            <H>Daily Vitals and Log</H>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:14}}>
              <Card>
                <SubH>💓 Vitals</SubH>
                <Row>
                  {[["Heart Rate (bpm)","hr"],["O2 Sat (%)","o2"],["BP Systolic","bp_s"],["BP Diastolic","bp_d"]].map(([lbl,k])=>(
                    <div key={k}><Label>{lbl}</Label><Inp type="number" value={vitals[k]} onChange={e=>setVitals(v=>({...v,[k]:e.target.value}))} placeholder="—" /></div>
                  ))}
                </Row>
                <Label>Temperature (°F)</Label>
                <Inp type="number" value={vitals.temp} onChange={e=>setVitals(v=>({...v,temp:e.target.value}))} placeholder="—" />
              </Card>
              <Card>
                <SubH>⚡ Energy and Sleep</SubH>
                <Slider label="Energy Level" value={energy} onChange={e=>setEnergy(parseInt(e.target.value))} />
                <Label>Sleep Hours</Label>
                <Inp type="number" step="0.5" value={sleepH} onChange={e=>setSleepH(e.target.value)} placeholder="Hours slept" />
                <Slider label="Sleep Quality" value={sleepQ} onChange={e=>setSleepQ(parseInt(e.target.value))} />
              </Card>
              <Card>
                <SubH>💧 Hydration</SubH>
                <Label>Glasses today: {hydration}/8</Label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                  {[0,1,2,3,4,5,6,7].map(i=>(
                    <div key={i} onClick={()=>setHydration(i+1)}
                      style={{width:34,height:34,borderRadius:8,cursor:"pointer",background:i<hydration?"#0d9488":"var(--bg-input)",border:"1px solid "+(i<hydration?"#0d9488":"var(--border)"),display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>💧</div>
                  ))}
                </div>
                <T size={12} color="var(--txt-mute)">POTS patients typically need 2-3L per day.</T>
              </Card>
              <Card>
                <SubH>🌸 Menstrual Cycle</SubH>
                <Label>Last Period Start</Label>
                <Inp type="date" value={period} onChange={e=>setPeriod(e.target.value)} />
                <Label>Cycle Length (days)</Label>
                <Inp type="number" value={cycle} onChange={e=>setCycle(parseInt(e.target.value))} />
                <T size={12} color="var(--txt-mute)">Estrogen fluctuations affect collagen laxity, mast cell reactivity, and vascular tone.</T>
              </Card>
            </div>
            <Card style={{marginTop:14}}>
              <SubH>📝 Daily Notes</SubH>
              <Textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="New triggers, medication reactions, activities, stress levels..." />
            </Card>
          </div>
        )}

        {/* MEDICATIONS */}
        {activeTab === "meds" && (
          <div className="fade">
            <H>Medication Manager</H>
            {meds.map(function(m){
              const days=Math.ceil((new Date(m.refill)-new Date())/86400000);
              const isEditing = editMedId === m.id;
              return (
                <Card key={m.id} style={{marginBottom:10}}>
                  {isEditing ? (
                    <div>
                      <SubH>Edit Medication</SubH>
                      <Row>
                        <div><Label>Name</Label><Inp value={editMedData.name} onChange={function(e){setEditMedData(function(d){return {...d,name:e.target.value};});}} /></div>
                        <div><Label>Dose</Label><Inp value={editMedData.dose} onChange={function(e){setEditMedData(function(d){return {...d,dose:e.target.value};});}} /></div>
                      </Row>
                      <Row>
                        <div><Label>Frequency</Label><Inp value={editMedData.freq} onChange={function(e){setEditMedData(function(d){return {...d,freq:e.target.value};});}} /></div>
                        <div><Label>Refill Date</Label><Inp type="date" value={editMedData.refill} onChange={function(e){setEditMedData(function(d){return {...d,refill:e.target.value};});}} /></div>
                      </Row>
                      <Label>Notes</Label>
                      <Inp value={editMedData.notes||""} onChange={function(e){setEditMedData(function(d){return {...d,notes:e.target.value};});}} placeholder="Dosage notes, instructions..." style={{marginBottom:10}} />
                      <div style={{display:"flex",gap:8}}>
                        <Btn onClick={function(){setMeds(function(prev){return prev.map(function(x){return x.id===m.id?{...x,...editMedData}:x;});});setEditMedId(null);}}>Save Changes</Btn>
                        <Btn v="sm" onClick={function(){setEditMedId(null);}}>Cancel</Btn>
                      </div>
                    </div>
                  ) : (
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div style={{flex:1}}>
                        <T size={15} weight={600} color="var(--txt-accent)">{m.name} <span style={{fontWeight:400,fontSize:13,color:"var(--txt-mute)"}}>{m.dose}</span></T>
                        <T size={13} style={{marginTop:3}}>{m.freq}{m.cat?" · "+m.cat:""}</T>
                        {m.notes && <T size={12} color="var(--txt-mute)" style={{marginTop:2}}>{m.notes}</T>}
                        <T size={12} color={days<=7?"#dc2626":days<=14?"#0284c7":"#0d9488"} style={{marginTop:4}}>
                          {days<=0?"⚠ Refill OVERDUE":"Refill in "+days+" days ("+m.refill+")"}
                        </T>
                      </div>
                      <div style={{display:"flex",gap:6,flexShrink:0,marginLeft:8}}>
                        <Btn v="sm" onClick={function(){setEditMedId(m.id);setEditMedData({name:m.name,dose:m.dose,freq:m.freq,refill:m.refill,cat:m.cat||"",notes:m.notes||""});}}>Edit</Btn>
                        <Btn v="del" onClick={function(){setMeds(function(prev){return prev.filter(function(x){return x.id!==m.id;});});}}>Remove</Btn>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
            <Card style={{marginTop:6}}>
              <SubH>+ Add Medication</SubH>
              <Row>
                <div><Label>Name</Label><Inp value={newMed.name} onChange={function(e){setNewMed(function(n){return {...n,name:e.target.value};});}} /></div>
                <div><Label>Dose</Label><Inp value={newMed.dose} onChange={function(e){setNewMed(function(n){return {...n,dose:e.target.value};});}} /></div>
                <div><Label>Frequency</Label><Inp value={newMed.freq} onChange={function(e){setNewMed(function(n){return {...n,freq:e.target.value};});}} /></div>
                <div><Label>Refill Date</Label><Inp type="date" value={newMed.refill} onChange={function(e){setNewMed(function(n){return {...n,refill:e.target.value};});}} /></div>
              </Row>
              <Label>Category</Label>
              <Sel value={newMed.cat} onChange={function(e){setNewMed(function(n){return {...n,cat:e.target.value};});}}>
                <option value="">Select...</option>
                {["Antihistamine H1","Antihistamine H2","Mast Cell Stabilizer","Beta Blocker","Fludrocortisone","SSRI / SNRI","Sleep Aid","Pain Relief","Supplement","Other"].map(function(c){return <option key={c} value={c}>{c}</option>;})}
              </Sel>
              <Btn style={{marginTop:10}} onClick={function(){if(newMed.name){setMeds(function(prev){return [...prev,{...newMed,id:Date.now()}];});setNewMed({name:"",dose:"",freq:"",refill:"",cat:"",notes:""});}}}>Add Medication</Btn>
            </Card>
          </div>
        )}

        {/* APPOINTMENTS */}
        {activeTab === "appts" && (
          <div className="fade">
            <H>Appointments</H>
            {[...appts].sort((a,b)=>new Date(a.date)-new Date(b.date)).map(a=>(
              <Card key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                <div>
                  <T size={15} weight={500} color="var(--txt-accent)">{a.type}</T>
                  <T size={13} style={{marginTop:3}}>📅 {a.date} at {a.time}</T>
                  {a.notes && <T size={13} color="var(--txt-mute)" style={{fontStyle:"italic"}}>{a.notes}</T>}
                </div>
                <Btn v="del" onClick={()=>setAppts(prev=>prev.filter(x=>x.id!==a.id))}>Remove</Btn>
              </Card>
            ))}
            <Card>
              <SubH>+ Schedule Appointment</SubH>
              <Label>Specialist Type</Label>
              <Sel value={newAppt.type} onChange={e=>setNewAppt(n=>({...n,type:e.target.value}))}>
                <option value="">Select...</option>
                {SPEC_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
              </Sel>
              <Row>
                <div><Label>Date</Label><Inp type="date" value={newAppt.date} onChange={e=>setNewAppt(n=>({...n,date:e.target.value}))} /></div>
                <div><Label>Time</Label><Inp type="time" value={newAppt.time} onChange={e=>setNewAppt(n=>({...n,time:e.target.value}))} /></div>
              </Row>
              <Label>Notes</Label>
              <Inp value={newAppt.notes} onChange={e=>setNewAppt(n=>({...n,notes:e.target.value}))} placeholder="Purpose of visit..." />
              <Btn onClick={()=>{if(newAppt.type&&newAppt.date){setAppts(prev=>[...prev,{...newAppt,id:Date.now()}]);setNewAppt({type:"",date:"",time:"",notes:""});}}}>Add Appointment</Btn>
            </Card>
          </div>
        )}

        {/* POTS CHECKER */}
        {activeTab === "pots" && (
          <div className="fade">
            <H>POTS Orthostatic HR Checker</H>
            <Card style={{marginBottom:14}}>
              <T size={13} style={{marginBottom:14,lineHeight:1.8}}>Rest supine for 10 minutes, record HR, then stand and record at 1 minute and 3 minutes. A rise of 30+ bpm (40+ under age 19) without orthostatic hypotension indicates POTS.</T>
              <Row>
                <div><Label>Lying (10 min rest)</Label><Inp type="number" value={potsLying} onChange={e=>setPotsLying(e.target.value)} placeholder="HR bpm" /></div>
                <div><Label>Standing (1 min)</Label><Inp type="number" value={potsSt1} onChange={e=>setPotsSt1(e.target.value)} placeholder="HR bpm" /></div>
              </Row>
              {potsResult && (
                <div style={{marginTop:12,padding:"12px 16px",borderRadius:10,border:"1px solid "+potsResult.color+"40",background:potsResult.color+"15"}}>
                  <T size={14} weight={500} color={potsResult.color}>{potsResult.text}</T>
                </div>
              )}
              <hr style={{border:"none",borderTop:"1px solid var(--border)",margin:"16px 0"}} />
              <SubH>Management Reminders</SubH>
              {["Compression garments (waist-high) before rising","2-3L water daily + 3-6g sodium (per MD)","Elevate head of bed 30 degrees","Rise slowly — dangle legs 1-2 min before standing","Recumbent exercise first (rowing, recumbent bike)","Cool environment; avoid hot showers"].map((t,i)=>(
                <T key={i} size={13} style={{padding:"5px 0",borderBottom:"1px solid var(--border)"}}>✓ {t}</T>
              ))}
            </Card>
          </div>
        )}

        {/* FOOD */}
        {activeTab === "food" && (
          <div className="fade">
            <H>Food & Diet</H>

            {/* Sub-tab nav */}
            <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
              {[["database","🔍 Food Database"],["protocols","🥗 Diet Protocols"],["log","📓 Food Log"]].map(([id,label])=>(
                <button key={id} onClick={()=>setFoodSubTab(id)} style={{
                  background:foodSubTab===id?"linear-gradient(135deg,#8850f0,#d4b8ff)":"var(--bg-input)",
                  border:"1px solid "+(foodSubTab===id?"transparent":"var(--border)"),
                  borderRadius:8,padding:"7px 14px",cursor:"pointer",color:foodSubTab===id?"#fff":"var(--txt-dim)",
                  fontFamily:"sans-serif",fontSize:13,whiteSpace:"nowrap",fontWeight:foodSubTab===id?500:400
                }}>{label}</button>
              ))}
            </div>

            {/* ── FOOD DATABASE ─────────────────────────── */}
            {foodSubTab === "database" && (
              <div>
                {/* Search */}
                <Card style={{marginBottom:14}}>
                  <SubH>🔍 Check a Food or Ingredient</SubH>
                  <T size={13} style={{marginBottom:10,color:"var(--txt-dim)"}}>Search any food to see its histamine, salicylate, oxalate, and mast cell trigger status.</T>
                  <div style={{display:"flex",gap:10,marginBottom:10}}>
                    <Inp value={foodQ} onChange={e=>{setFoodQ(e.target.value);setFoodR(null);}} placeholder="e.g. spinach, avocado, salmon..." />
                    <Btn onClick={()=>checkFood(foodQ)}>Check</Btn>
                  </div>
                  {foodR && foodR !== "unknown" && (
                    <Alert color={foodR.color}>
                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                        <span style={{fontSize:20}}>{foodR.icon}</span>
                        <T size={14} weight={500} color={foodR.color}>{foodR.label}</T>
                      </div>
                      <T size={13} style={{marginBottom:6}}><strong>Found in:</strong> {foodR.subcat}</T>
                      <T size={13} style={{marginBottom:6}}>{foodR.note}</T>
                    </Alert>
                  )}
                  {foodR === "unknown" && (
                    <Card><T size={13} color="var(--txt-dim)">Not found in database. This food may be untested or neutral — track your personal reaction.</T></Card>
                  )}
                </Card>

                {/* Category selector */}
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
                  {Object.entries(MCAS_FOODS).map(([key,data])=>(
                    <button key={key} onClick={()=>setFoodCat(key)} style={{
                      background:foodCat===key?data.color+"22":"var(--bg-card)",
                      border:"1px solid "+(foodCat===key?data.color:"var(--border)"),
                      borderRadius:8,padding:"6px 12px",cursor:"pointer",
                      color:foodCat===key?data.color:"var(--txt-dim)",fontFamily:"sans-serif",fontSize:12,
                      display:"flex",alignItems:"center",gap:5
                    }}>
                      <span>{data.icon}</span>{data.label}
                    </button>
                  ))}
                </div>

                {/* Selected category content */}
                {MCAS_FOODS[foodCat] && (
                  <Card>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                      <span style={{fontSize:24}}>{MCAS_FOODS[foodCat].icon}</span>
                      <SubH style={{color:MCAS_FOODS[foodCat].color,marginBottom:0}}>{MCAS_FOODS[foodCat].label}</SubH>
                    </div>
                    <Alert color={MCAS_FOODS[foodCat].color} style={{marginBottom:14}}>
                      <T size={12}>{MCAS_FOODS[foodCat].note}</T>
                    </Alert>
                    {Object.entries(MCAS_FOODS[foodCat].subcats).map(([subcat,foods])=>(
                      <div key={subcat} style={{marginBottom:16}}>
                        <T size={12} color="var(--txt-dim)" style={{textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:8,fontWeight:500}}>{subcat}</T>
                        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                          {foods.map(f=>(
                            <span key={f} style={{
                              background:MCAS_FOODS[foodCat].color+"18",
                              border:"1px solid "+MCAS_FOODS[foodCat].color+"30",
                              borderRadius:6,padding:"3px 9px",
                              fontSize:12,color:MCAS_FOODS[foodCat].color
                            }}>{f}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </Card>
                )}
              </div>
            )}

            {/* ── DIET PROTOCOLS ────────────────────────── */}
            {foodSubTab === "protocols" && (
              <div>
                {!dietView ? (
                  <div>
                    <Card style={{marginBottom:14,borderColor:"rgba(212,184,255,0.4)"}}>
                      <T size={13} style={{lineHeight:1.8,color:"var(--txt-dim)"}}>
                        Select a dietary protocol to view foods to avoid, safe foods, key rules, and supplement considerations.
                        These protocols are for informational purposes — always work with your medical team before making significant dietary changes.
                      </T>
                      {activeDiet && (
                        <div style={{marginTop:10,padding:"8px 12px",background:"rgba(16,217,196,0.18)",border:"1px solid rgba(16,217,196,0.5)",borderRadius:8}}>
                          <T size={12} color="#0d9488">✓ Active protocol: <strong>{(DIET_PROTOCOLS.find(function(d){return d.id===activeDiet;})||{}).name}</strong></T>
                        </div>
                      )}
                    </Card>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:10}}>
                      {DIET_PROTOCOLS.map(p=>(
                        <div key={p.id} onClick={()=>setDietView(p.id)} style={{
                          background:activeDiet===p.id?p.color+"12":"rgba(79,70,229,0.04)",
                          border:"1px solid "+(activeDiet===p.id?p.color:"var(--border)"),
                          borderRadius:14,padding:18,cursor:"pointer",
                          transition:"border-color 0.2s,background 0.2s"
                        }}>
                          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                            <span style={{fontSize:24}}>{p.icon}</span>
                            <div>
                              <T size={14} weight={500} color={p.color}>{p.name}</T>
                              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:3}}>
                                {p.conditions.map(c=>(
                                  <span key={c} style={{fontSize:10,padding:"1px 6px",borderRadius:4,background:p.color+"18",color:p.color}}>{c}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <T size={12} style={{lineHeight:1.7,color:"var(--txt-dim)"}}>{p.description.slice(0,100)}...</T>
                          {activeDiet===p.id && <T size={11} color="#0d9488" style={{marginTop:6}}>✓ Currently active</T>}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    {(() => {
                      const p = DIET_PROTOCOLS.find(d=>d.id===dietView);
                      if (!p) return null;
                      return (
                        <div>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <span style={{fontSize:28}}>{p.icon}</span>
                              <div>
                                <SubH style={{color:p.color,marginBottom:2}}>{p.name}</SubH>
                                <div style={{display:"flex",gap:4}}>
                                  {p.conditions.map(c=>(
                                    <span key={c} style={{fontSize:11,padding:"2px 8px",borderRadius:4,background:p.color+"18",color:p.color}}>{c}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div style={{display:"flex",gap:8}}>
                              <button onClick={()=>setActiveDiet(activeDiet===p.id?null:p.id)} style={{
                                background:activeDiet===p.id?"rgba(16,217,196,0.25)":"linear-gradient(135deg,#8850f0,#d4b8ff)",
                                border:"1px solid "+(activeDiet===p.id?"rgba(16,217,196,0.5)":"transparent"),
                                borderRadius:8,padding:"6px 14px",cursor:"pointer",
                                color:activeDiet===p.id?"#0d9488":"#fff",fontFamily:"sans-serif",fontSize:13
                              }}>{activeDiet===p.id?"✓ Active":"Set Active"}</button>
                              <button onClick={()=>setDietView(null)} style={{background:"var(--bg-input)",border:"1px solid var(--border)",borderRadius:8,padding:"6px 12px",cursor:"pointer",color:"var(--txt-dim)",fontFamily:"sans-serif",fontSize:13}}>← Back</button>
                            </div>
                          </div>

                          <Alert color={p.color} style={{marginBottom:14}}>
                            <T size={13} style={{lineHeight:1.8}}>{p.description}</T>
                          </Alert>

                          <Card style={{marginBottom:12}}>
                            <SubH>Key Rules</SubH>
                            {p.keyRules.map((r,i)=>(
                              <div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:"1px solid rgba(79,70,229,0.04)"}}>
                                <span style={{color:p.color,fontWeight:600,flexShrink:0}}>{i+1}.</span>
                                <T size={13}>{r}</T>
                              </div>
                            ))}
                          </Card>

                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                            <Card style={{borderColor:"rgba(224,112,112,0.4)"}}>
                              <SubH style={{color:"#dc2626"}}>🚫 Avoid</SubH>
                              {p.avoid.map((f,i)=>(
                                <div key={i} style={{padding:"5px 0",borderBottom:"1px solid rgba(79,70,229,0.04)",fontSize:13,color:"#dc2626"}}>• {f}</div>
                              ))}
                            </Card>
                            <Card style={{borderColor:"rgba(16,217,196,0.5)"}}>
                              <SubH style={{color:"#0d9488"}}>✓ Allowed</SubH>
                              {p.allowed.map((f,i)=>(
                                <div key={i} style={{padding:"5px 0",borderBottom:"1px solid rgba(79,70,229,0.04)",fontSize:13,color:"#0d9488"}}>• {f}</div>
                              ))}
                            </Card>
                          </div>

                          <Card style={{marginBottom:12}}>
                            <SubH>💊 Supplements to Discuss with MD</SubH>
                            {p.supplements.map((s,i)=>(
                              <div key={i} style={{padding:"5px 0",borderBottom:"1px solid rgba(79,70,229,0.04)",fontSize:13,color:"var(--txt-dim)"}}>• {s}</div>
                            ))}
                          </Card>

                          <Alert color="#0891b2">
                            <T size={12} weight={500} color="#0891b2">Resources & Guidance</T>
                            <T size={12} style={{marginTop:4,lineHeight:1.7}}>{p.resources}</T>
                          </Alert>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* ── FOOD LOG ──────────────────────────────── */}
            {foodSubTab === "log" && (
              <div>
                <Card style={{marginBottom:14}}>
                  <SubH>Log a Meal or Reaction</SubH>
                  <div style={{marginBottom:10}}>
                    <T size={11} color="var(--txt-mute)" style={{textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:4}}>Date</T>
                    <Inp type="date" value={newFoodEntry.date} onChange={e=>setNewFoodEntry({...newFoodEntry,date:e.target.value})} />
                  </div>
                  <div style={{marginBottom:10}}>
                    <T size={11} color="var(--txt-mute)" style={{textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:4}}>Meal / Time</T>
                    <Inp value={newFoodEntry.meal} onChange={e=>setNewFoodEntry({...newFoodEntry,meal:e.target.value})} placeholder="e.g. Breakfast, Lunch, Dinner, Snack" />
                  </div>
                  <div style={{marginBottom:10}}>
                    <T size={11} color="var(--txt-mute)" style={{textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:4}}>Foods eaten</T>
                    <Inp value={newFoodEntry.foods} onChange={e=>setNewFoodEntry({...newFoodEntry,foods:e.target.value})} placeholder="List foods eaten..." />
                  </div>
                  <div style={{marginBottom:10}}>
                    <T size={11} color="var(--txt-mute)" style={{textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:4}}>Reactions (if any)</T>
                    <Inp value={newFoodEntry.reactions} onChange={e=>setNewFoodEntry({...newFoodEntry,reactions:e.target.value})} placeholder="e.g. flushing, hives, GI pain, brain fog..." />
                  </div>
                  <div style={{marginBottom:10}}>
                    <T size={11} color="var(--txt-mute)" style={{textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:4}}>Reaction severity</T>
                    <div style={{display:"flex",gap:6}}>
                      {[["none","None","#0d9488"],["mild","Mild","#0284c7"],["moderate","Moderate","#0284c7"],["severe","Severe","#dc2626"]].map(([val,label,col])=>(
                        <button key={val} onClick={()=>setNewFoodEntry({...newFoodEntry,severity:val})} style={{
                          flex:1,padding:"7px 4px",borderRadius:8,border:"1px solid "+(newFoodEntry.severity===val?col:"var(--border)"),
                          background:newFoodEntry.severity===val?col+"22":"transparent",
                          color:newFoodEntry.severity===val?col:"var(--txt-dim)",cursor:"pointer",fontFamily:"sans-serif",fontSize:12
                        }}>{label}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{marginBottom:14}}>
                    <T size={11} color="var(--txt-mute)" style={{textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:4}}>Notes</T>
                    <Inp value={newFoodEntry.notes} onChange={e=>setNewFoodEntry({...newFoodEntry,notes:e.target.value})} placeholder="Context: stress level, time since last meal, medications taken..." />
                  </div>
                  <Btn onClick={()=>{
                    if(!newFoodEntry.date||!newFoodEntry.foods) return;
                    setFoodLog(prev=>[{...newFoodEntry,id:Date.now()},...prev]);
                    setNewFoodEntry({date:"",meal:"",foods:"",reactions:"",severity:"none",notes:""});
                  }}>Save Entry</Btn>
                </Card>

                {foodLog.length === 0 ? (
                  <Card><T size={13} color="var(--txt-dim)" style={{textAlign:"center",padding:16}}>No food log entries yet. Start tracking your meals and reactions to identify patterns.</T></Card>
                ) : (
                  <div>
                    <T size={11} color="var(--txt-mute)" style={{textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:10}}>{foodLog.length} entries</T>
                    {foodLog.map(entry=>{
                      const sevColor = entry.severity==="none"?"#0d9488":entry.severity==="mild"?"#0284c7":entry.severity==="moderate"?"#0284c7":"#dc2626";
                      return (
                        <Card key={entry.id} style={{marginBottom:10,borderLeft:"3px solid "+sevColor}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                            <div>
                              <T size={14} weight={500} color="var(--txt-accent)">{entry.date}</T>
                              {entry.meal && <T size={12} color="var(--txt-dim)"> · {entry.meal}</T>}
                            </div>
                            <span style={{fontSize:11,padding:"2px 8px",borderRadius:4,background:sevColor+"18",color:sevColor,border:"1px solid "+sevColor+"30"}}>{entry.severity}</span>
                          </div>
                          <T size={13} style={{marginBottom:entry.reactions?6:0}}><strong>Foods:</strong> {entry.foods}</T>
                          {entry.reactions && <T size={13} color="#dc2626" style={{marginBottom:entry.notes?6:0}}><strong>Reactions:</strong> {entry.reactions}</T>}
                          {entry.notes && <T size={12} color="var(--txt-dim)">{entry.notes}</T>}
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        )}
        {/* YOGA */}
        {activeTab === "yoga" && (
          <div className="fade">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}}>
              <H style={{marginBottom:0}}>Yoga Therapy</H>
              <div style={{display:"flex",background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:10,overflow:"hidden"}}>
                {[["library","📚 Library"],["recordings","🎙 Recordings"],["programs","✦ My Programs"]].map(([id,lbl])=>(
                  <button key={id} onClick={()=>setYogaView(id)}
                    style={{padding:"7px 18px",fontSize:13,color:yogaView===id?"#fff":"var(--txt-mute)",background:yogaView===id?"linear-gradient(135deg,#7c3aed,#a855f7)":"none",border:"none",cursor:"pointer",fontFamily:"sans-serif",borderRight:"1px solid var(--border)"}}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {yogaView === "library" && (
              <div>
                <T size={13} style={{marginBottom:14}}>{YOGA.length} practices across 8 categories, adapted for EDS, POTS, and MCAS. ★ to favorite · tap any card for full instructions.</T>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                  {YOGA_CATS.map(c=>(
                    <Btn key={c} v="chip" onClick={()=>setYogaCat(c)}
                      style={{borderColor:yogaCat===c?"#9878e8":"var(--border)",background:yogaCat===c?"rgba(140,100,220,0.35)":"var(--bg-chip)",color:yogaCat===c?"var(--txt-accent)":"var(--txt-mute)"}}>
                      {c}
                    </Btn>
                  ))}
                </div>
                <div style={{display:"flex",gap:6,marginBottom:18}}>
                  {["All","EDS","POTS","MCAS"].map(c=>(
                    <Btn key={c} v="chip" onClick={()=>setYogaCond(c)}
                      style={{borderColor:yogaCond===c?condColor(c):"var(--border)",background:yogaCond===c?condColor(c)+"22":"var(--bg-chip)",color:yogaCond===c?condColor(c):"var(--txt-mute)"}}>
                      {c==="All"?"All Conditions":c}
                    </Btn>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
                  {YOGA.filter(y=>(yogaCat==="All"||y.cat===yogaCat)&&(yogaCond==="All"||y.conds.includes(yogaCond))).map(y=>{
                    const isFav=favorites.includes(y.name);
                    const catClr=y.cat==="Breathwork"?"#88d0f0":y.cat==="Supine Poses"?"#6d28d9":y.cat==="Seated Poses"?"var(--txt-accent)":y.cat==="Restorative Poses"?"#0d9488":y.cat==="Gentle Movement"?"#0284c7":"#9333ea";
                    return (
                      <Card key={y.name} style={{borderColor:isFav?"rgba(167,139,250,0.50)":"var(--border)"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:7}}>
                          <span style={{fontFamily:"sans-serif",fontSize:10,color:catClr,background:catClr+"18",border:"1px solid "+catClr+"30",borderRadius:100,padding:"2px 8px",textTransform:"uppercase",letterSpacing:"0.5px"}}>{y.cat}</span>
                          <button onClick={()=>setFavorites(f=>isFav?f.filter(n=>n!==y.name):[...f,y.name])}
                            style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:isFav?"#0284c7":"#6850a0",lineHeight:1}}>
                            {isFav?"★":"☆"}
                          </button>
                        </div>
                        <T size={16} color="var(--txt-accent)" style={{marginBottom:5,fontFamily:"serif"}}>🧘 {y.name}</T>
                        <div style={{display:"flex",gap:7,marginBottom:7,flexWrap:"wrap"}}>
                          <T size={11} color="var(--txt-mute)">⏱ {y.dur}</T>
                          <T size={11} color="var(--txt-mute)">📍 {y.pos}</T>
                          {y.conds.map(c=><Badge key={c} label={c} color={condColor(c)} />)}
                        </div>
                        <T size={13} style={{marginBottom:8,lineHeight:1.6}}>{y.benefits}</T>
                        {y.contra && !y.contra.startsWith("None") && (
                          <T size={11} color="#0284c7" style={{background:"rgba(56,189,248,0.18)",borderRadius:5,padding:"3px 7px",marginBottom:8}}>⚠ {y.contra}</T>
                        )}
                        <Btn v="sm" style={{fontSize:12}} onClick={()=>setSelYoga(y)}>View {yogaSteps(y).length} steps →</Btn>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}


            {yogaView === "recordings" && (
              <div>
                {/* Audio player - shows when a recording is selected */}
                {currentAudio && (
                  <Card style={{marginBottom:16,borderColor:"rgba(212,184,255,0.5)",background:"rgba(140,100,220,0.15)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                      <span style={{fontSize:28}}>🎙</span>
                      <div style={{flex:1}}>
                        <T size={15} weight={500} color="var(--txt-accent)">{currentAudio.title}</T>
                        <T size={12} color="var(--txt-mute)">{currentAudio.duration} · {currentAudio.type}</T>
                      </div>
                      <button onClick={()=>{setCurrentAudio(null);setAudioPlaying(false);if(audioRef.current){audioRef.current.pause();}}} style={{background:"none",border:"none",color:"var(--txt-mute)",cursor:"pointer",fontSize:18}}>✕</button>
                    </div>
                    <audio ref={audioRef} src={currentAudio.audio_url}
                      onTimeUpdate={e=>{if(e.target.duration)setAudioProgress((e.target.currentTime/e.target.duration)*100);}}
                      onEnded={()=>setAudioPlaying(false)}
                      style={{width:"100%",marginBottom:10}}
                      controls
                    />
                    <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
                      <button onClick={()=>{if(audioRef.current){if(audioPlaying){audioRef.current.pause();setAudioPlaying(false);}else{audioRef.current.play();setAudioPlaying(true);}}}}
                        style={{background:"linear-gradient(135deg,#8850f0,#d4b8ff)",border:"none",borderRadius:10,padding:"10px 24px",cursor:"pointer",color:"#fff",fontFamily:"sans-serif",fontSize:14,fontWeight:500}}>
                        {audioPlaying?"⏸ Pause":"▶ Play"}
                      </button>
                      <button onClick={()=>{if(audioRef.current){audioRef.current.currentTime=0;setAudioProgress(0);}}}
                        style={{background:"var(--bg-input)",border:"1px solid var(--border)",borderRadius:10,padding:"10px 16px",cursor:"pointer",color:"var(--txt-dim)",fontFamily:"sans-serif",fontSize:14}}>
                        ↩ Restart
                      </button>
                    </div>
                  </Card>
                )}

                {/* About section */}
                <Card style={{marginBottom:14,borderColor:"rgba(212,184,255,0.35)"}}>
                  <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <span style={{fontSize:36,flexShrink:0}}>🎙</span>
                    <div>
                      <SubH style={{color:"var(--txt-accent)"}}>Vicki's Recordings</SubH>
                      <T size={13} style={{lineHeight:1.8,color:"var(--txt-dim)"}}>
                        Guided yoga nidra, breathwork, and meditation recordings by Vicki Schmitz, C-IAYT —
                        a yoga therapist and person living with EDS, POTS, and MCAS. Each recording is
                        designed specifically for this population, with adaptations for hypermobility,
                        dysautonomia, and mast cell conditions.
                      </T>
                    </div>
                  </div>
                </Card>

                {/* Filter */}
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
                  {["All","Yoga Nidra","iRest","Breathwork","Meditation","Restorative"].map(f=>(
                    <button key={f} onClick={()=>setRecFilter(f)} style={{
                      background:recFilter===f?"linear-gradient(135deg,#8850f0,#d4b8ff)":"var(--bg-card)",
                      border:"1px solid "+(recFilter===f?"transparent":"var(--border)"),
                      borderRadius:8,padding:"5px 12px",cursor:"pointer",
                      color:recFilter===f?"#fff":"var(--txt-dim)",fontFamily:"sans-serif",fontSize:12
                    }}>{f}</button>
                  ))}
                </div>

                {/* Recordings list */}
                {RECORDINGS.length === 0 ? (
                  <Card style={{textAlign:"center",padding:"40px 20px"}}>
                    <span style={{fontSize:48,display:"block",marginBottom:16}}>🎙</span>
                    <SubH style={{marginBottom:8}}>Recordings Coming Soon</SubH>
                    <T size={13} style={{lineHeight:1.8,color:"var(--txt-dim)",maxWidth:400,margin:"0 auto"}}>
                      Vicki's guided yoga nidra, breathwork, and meditation recordings will appear here
                      as they become available. Each recording is designed specifically for EDS, POTS,
                      MCAS, and Long COVID bodies.
                    </T>
                    <div style={{marginTop:20,padding:"12px 16px",background:"rgba(140,100,220,0.15)",border:"1px solid rgba(212,184,255,0.30)",borderRadius:10,display:"inline-block",textAlign:"left"}}>
                      <T size={12} color="var(--txt-accent)" style={{fontWeight:500,marginBottom:6}}>Planned recordings include:</T>
                      {["Yoga Nidra for Chronic Pain (30 min)","Yoga Nidra for POTS Recovery (45 min)","iRest for Trauma and PTSD (45 min)","Sleep Nidra for Insomnia (30 min)","MCAS Calming Breathwork (15 min)","Morning Gentle Breathwork for POTS (10 min)","Brain Fog Grounding Meditation (10 min)","Pain Flare Restorative Practice (20 min)"].map(r=>(
                        <div key={r} style={{fontSize:12,color:"var(--txt-dim)",padding:"3px 0",borderBottom:"1px solid rgba(79,70,229,0.04)"}}>· {r}</div>
                      ))}
                    </div>
                  </Card>
                ) : (
                  <div>
                    {RECORDINGS.filter(r=>recFilter==="All"||r.type===recFilter).map(rec=>(
                      <Card key={rec.id} style={{marginBottom:10,cursor:"pointer",borderColor:currentAudio&&currentAudio.id===rec.id?"rgba(212,184,255,0.6)":"var(--border)"}}
                        onClick={()=>setCurrentAudio(rec)}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6}}>
                              <span style={{fontSize:11,padding:"2px 8px",borderRadius:4,background:"rgba(140,100,220,0.25)",color:"var(--txt-accent)",border:"1px solid rgba(212,184,255,0.30)"}}>{rec.type}</span>
                              <span style={{fontSize:11,color:"var(--txt-mute)"}}>⏱ {rec.duration}</span>
                            </div>
                            <T size={15} weight={500} color="var(--txt-accent)" style={{marginBottom:4}}>{rec.title}</T>
                            <T size={13} style={{lineHeight:1.7,color:"var(--txt-dim)"}}>{rec.description}</T>
                            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:8}}>
                              {rec.conditions.map(c=>(
                                <span key={c} style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:"rgba(140,100,220,0.15)",color:"var(--txt-accent)"}}>{c}</span>
                              ))}
                            </div>
                          </div>
                          <button style={{background:"linear-gradient(135deg,#8850f0,#d4b8ff)",border:"none",borderRadius:8,padding:"8px 14px",cursor:"pointer",color:"#fff",fontFamily:"sans-serif",fontSize:13,flexShrink:0,marginLeft:10}}>
                            {currentAudio&&currentAudio.id===rec.id&&audioPlaying?"⏸":"▶"}
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Instructions for adding recordings */}
                <Card style={{marginTop:16,borderColor:"rgba(91,184,196,0.40)",background:"rgba(91,184,196,0.10)"}}>
                  <T size={11} color="#0891b2" style={{textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:6,fontWeight:500}}>For Vicki — Adding New Recordings</T>
                  <T size={12} style={{lineHeight:1.8,color:"var(--txt-dim)"}}>
                    To add a new recording: record your audio, upload it to Supabase Storage or your Netlify site,
                    then add an entry to the RECORDINGS array in the app source file (eds-pots-mcas-tracker.jsx).
                    Each entry needs: id, title, description, duration, type, conditions, and audio_url.
                    The full instructions are in the RECORDINGS array comments at the top of the file.
                  </T>
                </Card>
              </div>
            )}


            {yogaView === "programs" && !editProg && !session && (
              <div>
                <T size={13} style={{marginBottom:18}}>Build personal daily programs from your favorite techniques. Run a guided session with step-by-step instructions.</T>
                {programs.map(prog=>{
                  const totalMin=prog.techniques.reduce((sum,name)=>{const t=YOGA.find(y=>y.name===name);const n=t?t.dur.match(/\d+/):null;return sum+(n?parseInt(n[0]):5);},0);
                  return (
                    <Card key={prog.id} style={{borderColor:"rgba(212,184,255,0.30)"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:10}}>
                        <div>
                          <T size={20} color="var(--txt-accent)" style={{fontFamily:"serif"}}>{prog.emoji} {prog.name}</T>
                          <T size={12} color="var(--txt-mute)" style={{marginTop:2}}>{prog.techniques.length} technique{prog.techniques.length!==1?"s":""} · ~{totalMin}+ min</T>
                          {prog.notes && <T size={12} color="var(--txt-mute)" style={{fontStyle:"italic"}}>{prog.notes}</T>}
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          <Btn v="sm" onClick={()=>setEditProg({...prog,techniques:[...prog.techniques]})}>✏ Edit</Btn>
                          <Btn style={{padding:"7px 16px",fontSize:13}} onClick={()=>setSession({program:prog,step:0})}>▶ Start</Btn>
                          <Btn v="del" onClick={()=>setPrograms(prev=>prev.filter(x=>x.id!==prog.id))}>✕</Btn>
                        </div>
                      </div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                        {prog.techniques.map((name,i)=>{
                          const t=YOGA.find(y=>y.name===name);
                          return (
                            <div key={i} style={{background:"rgba(140,100,220,0.18)",border:"1px solid rgba(124,82,204,0.22)",borderRadius:8,padding:"4px 10px",display:"flex",gap:6,alignItems:"center"}}>
                              <T size={12} color="var(--txt-accent)" weight={500}>{i+1}. {name}</T>
                              {t && <T size={11} color="var(--txt-mute)">⏱{t.dur}</T>}
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  );
                })}
                <Card style={{borderStyle:"dashed",borderColor:"var(--border-input)",background:"rgba(140,100,220,0.10)"}}>
                  <SubH>+ Create New Program</SubH>
                  <div style={{display:"flex",gap:10,marginBottom:12}}>
                    <div style={{width:58}}>
                      <Label>Icon</Label>
                      <Inp value={newProgEmoji} onChange={e=>setNewProgEmoji(e.target.value)} style={{textAlign:"center",fontSize:20}} />
                    </div>
                    <div style={{flex:1}}>
                      <Label>Program Name</Label>
                      <Inp value={newProgName} onChange={e=>setNewProgName(e.target.value)} placeholder="e.g. Evening Wind-Down, Flare Day Rescue..." />
                    </div>
                  </div>
                  <Btn onClick={()=>{
                    if(!newProgName.trim()) return;
                    const p={id:Date.now(),name:newProgName.trim(),emoji:newProgEmoji||"🧘",techniques:[...favorites],notes:""};
                    setPrograms(prev=>[...prev,p]);
                    setEditProg({...p,techniques:[...p.techniques]});
                    setNewProgName(""); setNewProgEmoji("🧘");
                  }}>Create and Edit Program</Btn>
                </Card>
              </div>
            )}

            {yogaView === "programs" && editProg && !session && (
              <div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
                  <Btn v="sm" onClick={()=>setEditProg(null)}>← Back</Btn>
                  <T size={20} color="var(--txt-accent)" style={{fontFamily:"serif"}}>{editProg.emoji} {editProg.name}</T>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
                  <div>
                    <SubH>Available Techniques</SubH>
                    {YOGA.map(y=>{
                      const inP=editProg.techniques.includes(y.name);
                      const isFav=favorites.includes(y.name);
                      return (
                        <div key={y.name} style={{padding:"9px 12px",borderRadius:10,border:"1px solid "+(inP?"rgba(16,217,196,0,0.5)":"var(--border)"),background:inP?"rgba(16,217,196,0,0.15)":"var(--bg-chip)",marginBottom:7,display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
                          <div>
                            <T size={13} weight={500} color={inP?"#0d9488":"#d8c8f0"}>{isFav?"★ ":""}{y.name}</T>
                            <T size={11} color="var(--txt-mute)">⏱ {y.dur}</T>
                          </div>
                          <Btn v={inP?"del":"sm"} style={{whiteSpace:"nowrap",fontSize:12}}
                            onClick={()=>setEditProg(p=>({...p,techniques:inP?p.techniques.filter(n=>n!==y.name):[...p.techniques,y.name]}))}>
                            {inP?"− Remove":"+ Add"}
                          </Btn>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <SubH>Your Sequence</SubH>
                    {editProg.techniques.length===0 && (
                      <T size={13} color="var(--txt-mute)" style={{padding:18,textAlign:"center",border:"1px dashed var(--border)",borderRadius:10}}>Add techniques from the left.</T>
                    )}
                    {editProg.techniques.map((name,i)=>{
                      const t=YOGA.find(y=>y.name===name);
                      return (
                        <div key={name} style={{padding:"9px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--bg-chip)",marginBottom:7,display:"flex",alignItems:"center",gap:10}}>
                          <div style={{flex:1}}>
                            <T size={13} color="var(--txt)"><span style={{color:"var(--txt-mute)",marginRight:6}}>{i+1}.</span>{name}</T>
                            {t && <T size={11} color="var(--txt-mute)">⏱ {t.dur}</T>}
                          </div>
                          <div style={{display:"flex",gap:4}}>
                            <button style={{background:"none",border:"none",cursor:"pointer",color:"var(--txt-mute)",fontSize:14}} onClick={()=>setEditProg(p=>{const arr=[...p.techniques];if(i>0){[arr[i-1],arr[i]]=[arr[i],arr[i-1]];}return{...p,techniques:arr};})}>↑</button>
                            <button style={{background:"none",border:"none",cursor:"pointer",color:"var(--txt-mute)",fontSize:14}} onClick={()=>setEditProg(p=>{const arr=[...p.techniques];if(i<arr.length-1){[arr[i],arr[i+1]]=[arr[i+1],arr[i]];}return{...p,techniques:arr};})}>↓</button>
                            <Btn v="del" style={{fontSize:11,padding:"3px 8px"}} onClick={()=>setEditProg(p=>({...p,techniques:p.techniques.filter((_,j)=>j!==i)}))}>✕</Btn>
                          </div>
                        </div>
                      );
                    })}
                    <hr style={{border:"none",borderTop:"1px solid var(--border)",margin:"12px 0"}} />
                    <Label>Program Notes</Label>
                    <Textarea value={editProg.notes} onChange={e=>setEditProg(p=>({...p,notes:e.target.value}))} placeholder="When to use this program..." />
                    <div style={{display:"flex",gap:10,marginTop:10}}>
                      <Btn onClick={()=>{
                        setPrograms(prev=>prev.some(x=>x.id===editProg.id)?prev.map(x=>x.id===editProg.id?{...editProg}:x):[...prev,{...editProg}]);
                        setEditProg(null);
                      }}>💾 Save Program</Btn>
                      <Btn v="sm" onClick={()=>setEditProg(null)}>Cancel</Btn>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {session && (
              <div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
                  <Btn v="sm" onClick={()=>setSession(null)}>✕ End Session</Btn>
                  <T size={20} color="var(--txt-accent)" style={{fontFamily:"serif"}}>{session.program.emoji} {session.program.name}</T>
                </div>
                <div style={{background:"var(--bg-input)",borderRadius:100,height:6,marginBottom:22,overflow:"hidden"}}>
                  <div style={{height:"100%",background:"linear-gradient(90deg,#6b50b8,#9068e0)",borderRadius:100,width:((session.step+1)/session.program.techniques.length*100)+"%",transition:"width 0.5s ease"}} />
                </div>
                <T size={13} color="var(--txt-mute)" style={{textAlign:"center",marginBottom:18}}>Step {session.step+1} of {session.program.techniques.length}</T>
                {session.program.techniques[session.step] && YOGA.find(y=>y.name===session.program.techniques[session.step]) && (
                  <Card style={{maxWidth:560,margin:"0 auto",borderColor:"rgba(212,184,255,0.4)",textAlign:"center"}}>
                    <T size={24} color="var(--txt-accent)" style={{marginBottom:6,fontFamily:"serif"}}>🧘 {session.program.techniques[session.step]}</T>
                    <T size={13} color="var(--txt-dim)" style={{marginBottom:4}}>⏱ {YOGA.find(y=>y.name===session.program.techniques[session.step]).dur}</T>
                    <T size={14} color="#c8b0f0" style={{marginBottom:22}}>{YOGA.find(y=>y.name===session.program.techniques[session.step]).benefits}</T>
                    <div style={{textAlign:"left",marginBottom:22}}>
                      {yogaSteps(YOGA.find(y=>y.name===session.program.techniques[session.step])).map((s,i)=>(
                        <div key={i} style={{display:"flex",gap:12,padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
                          <div style={{minWidth:24,height:24,borderRadius:"50%",background:"rgba(140,100,220,0.35)",color:"var(--txt-accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600}}>{i+1}</div>
                          <T size={14} color="var(--txt)">{s}</T>
                        </div>
                      ))}
                    </div>
                    <div style={{display:"flex",gap:12,justifyContent:"center"}}>
                      <Btn v="sm" disabled={session.step===0} onClick={()=>setSession(s=>({...s,step:s.step-1}))}>← Previous</Btn>
                      {session.step < session.program.techniques.length-1
                        ? <Btn onClick={()=>setSession(s=>({...s,step:s.step+1}))}>Next →</Btn>
                        : <Btn style={{background:"linear-gradient(135deg,#059669,#10b981)"}} onClick={()=>setSession(null)}>✓ Complete</Btn>
                      }
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {/* SPECIALISTS */}
        {activeTab === "specialists" && (
          <div className="fade">
            <H>My Specialist Directory</H>
            {specs.map(s=>(
              <Card key={s.id} style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                <div>
                  <T size={15} weight={500} color="var(--txt-accent)">{s.name}</T>
                  <T size={13} style={{marginTop:3}}>{s.type}</T>
                  <T size={13} color="var(--txt-mute)" style={{marginTop:4}}>📞 {s.phone} · 📍 {s.address}</T>
                  {s.notes && <T size={13} color="var(--txt-mute)" style={{fontStyle:"italic"}}>{s.notes}</T>}
                </div>
                <Btn v="del" onClick={()=>setSpecs(prev=>prev.filter(x=>x.id!==s.id))}>Remove</Btn>
              </Card>
            ))}
            <Card>
              <SubH>+ Add Specialist</SubH>
              <Row>
                <div><Label>Name</Label><Inp value={newSpec.name} onChange={e=>setNewSpec(n=>({...n,name:e.target.value}))} placeholder="Dr. Name" /></div>
                <div><Label>Type</Label>
                  <Sel value={newSpec.type} onChange={e=>setNewSpec(n=>({...n,type:e.target.value}))}>
                    <option value="">Select...</option>
                    {SPEC_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                  </Sel>
                </div>
                <div><Label>Phone</Label><Inp value={newSpec.phone} onChange={e=>setNewSpec(n=>({...n,phone:e.target.value}))} placeholder="555-0000" /></div>
                <div><Label>Address</Label><Inp value={newSpec.address} onChange={e=>setNewSpec(n=>({...n,address:e.target.value}))} placeholder="Clinic address" /></div>
              </Row>
              <Label>Notes</Label>
              <Inp value={newSpec.notes} onChange={e=>setNewSpec(n=>({...n,notes:e.target.value}))} placeholder="e.g. Familiar with EDS/POTS overlap" />
              <Btn onClick={()=>{if(newSpec.name){setSpecs(prev=>[...prev,{...newSpec,id:Date.now()}]);setNewSpec({name:"",type:"",phone:"",address:"",notes:""});}}}>Add Specialist</Btn>
            </Card>
          </div>
        )}

        {/* LABS */}
        {activeTab === "labs" && (
          <div className="fade">
            <H>Lab Results Tracker</H>
            {labs.map(l=>(
              <Card key={l.id} style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                <div>
                  <T size={15} weight={500} color="var(--txt-accent)">{l.test}</T>
                  <T size={13} style={{marginTop:3}}>Result: <span style={{color:"var(--txt)"}}>{l.value}</span> · {l.date}</T>
                  {l.notes && <T size={13} color="var(--txt-mute)" style={{fontStyle:"italic"}}>{l.notes}</T>}
                </div>
                <Btn v="del" onClick={()=>setLabs(prev=>prev.filter(x=>x.id!==l.id))}>Remove</Btn>
              </Card>
            ))}
            <Card>
              <SubH>+ Add Lab Result</SubH>
              <Row>
                <div><Label>Test Name</Label><Inp value={newLab.test} onChange={e=>setNewLab(n=>({...n,test:e.target.value}))} placeholder="e.g. Serum tryptase" /></div>
                <div><Label>Result</Label><Inp value={newLab.value} onChange={e=>setNewLab(n=>({...n,value:e.target.value}))} placeholder="e.g. 14.2 ng/mL" /></div>
                <div><Label>Date</Label><Inp type="date" value={newLab.date} onChange={e=>setNewLab(n=>({...n,date:e.target.value}))} /></div>
                <div><Label>Notes</Label><Inp value={newLab.notes} onChange={e=>setNewLab(n=>({...n,notes:e.target.value}))} placeholder="Context..." /></div>
              </Row>
              <Btn onClick={()=>{if(newLab.test){setLabs(prev=>[...prev,{...newLab,id:Date.now()}]);setNewLab({test:"",value:"",date:"",notes:""});}}}>Add Result</Btn>
            </Card>
            <Card style={{marginTop:10}}>
              <SubH>Key Labs for EDS / POTS / MCAS</SubH>
              {[["Serum Tryptase","MCAS baseline — elevations suggest systemic mastocytosis"],["Urinary LTE4 (24h)","Leukotriene mediator — elevated in MCAS"],["Urinary Prostaglandin D2","Mast cell mediator — unstable, requires careful collection"],["CBC with differential","Anemia, eosinophilia patterns"],["Comprehensive metabolic panel","Renal, hepatic function, electrolytes"],["Tilt Table Test","Gold standard for POTS diagnosis"],["Upright/Supine Catecholamines","NE above 600 pg/mL standing suggests hyperadrenergic POTS"],["Genetic panel (COL5A1, COL3A1, FBN1, TNXB)","EDS subtype identification"]].map(([t,d])=>(
                <div key={t} style={{padding:"7px 0",borderBottom:"1px solid var(--border)"}}>
                  <T size={14} color="var(--txt-accent)">{t}</T>
                  <T size={12} color="var(--txt-mute)">{d}</T>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* JOINTS */}
        {activeTab === "joints" && (
          <div className="fade">
            <H>Joint Subluxation and Dislocation Log</H>
            {joints.map(j=>(
              <Card key={j.id} style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                <div>
                  <T size={15} weight={500} color="var(--txt-accent)">{j.joint}</T>
                  <T size={13} style={{marginTop:3}}>Severity: {j.severity} · {j.time}</T>
                  {j.notes && <T size={13} color="var(--txt-mute)" style={{fontStyle:"italic"}}>{j.notes}</T>}
                </div>
                <Btn v="del" onClick={()=>setJoints(prev=>prev.filter(x=>x.id!==j.id))}>Remove</Btn>
              </Card>
            ))}
            <Card>
              <SubH>+ Log Event</SubH>
              <Row>
                <div><Label>Joint</Label>
                  <Sel value={newJoint.joint} onChange={e=>setNewJoint(n=>({...n,joint:e.target.value}))}>
                    <option value="">Select...</option>
                    {["Right shoulder","Left shoulder","Right hip","Left hip","Right knee","Left knee","Right ankle","Left ankle","Right wrist","Left wrist","Jaw (TMJ)","Rib","Cervical spine","Lumbar spine","Sacroiliac","Patella"].map(j=><option key={j} value={j}>{j}</option>)}
                  </Sel>
                </div>
                <div><Label>Severity</Label>
                  <Sel value={newJoint.severity} onChange={e=>setNewJoint(n=>({...n,severity:e.target.value}))}>
                    <option value="">Select...</option>
                    <option value="Subluxation (partial)">Subluxation (partial)</option>
                    <option value="Dislocation (full)">Dislocation (full)</option>
                    <option value="Instability only">Instability only</option>
                  </Sel>
                </div>
                <div><Label>Time</Label><Inp type="datetime-local" value={newJoint.time} onChange={e=>setNewJoint(n=>({...n,time:e.target.value}))} /></div>
                <div><Label>Activity</Label><Inp value={newJoint.notes} onChange={e=>setNewJoint(n=>({...n,notes:e.target.value}))} placeholder="What were you doing?" /></div>
              </Row>
              <Btn onClick={()=>{if(newJoint.joint){setJoints(prev=>[...prev,{...newJoint,id:Date.now()}]);setNewJoint({joint:"",severity:"",time:"",notes:""});}}}>Log Event</Btn>
            </Card>
          </div>
        )}


        {/* RESOURCES */}
        {activeTab === "resources" && (
          <div className="fade">
            <H>Resources and Specialty Clinics</H>
            <div style={{display:"flex",background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:10,overflow:"hidden",marginBottom:20,width:"fit-content"}}>
              {[["clinics","🏥 Specialty Clinics"],["orgs","📚 Organizations and Resources"]].map(([id,lbl])=>(
                <button key={id} onClick={()=>setResTab(id)}
                  style={{padding:"8px 18px",fontSize:13,color:resTab===id?"#fff":"var(--txt-mute)",background:resTab===id?"linear-gradient(135deg,#7c3aed,#a855f7)":"none",border:"none",cursor:"pointer",fontFamily:"sans-serif",borderRight:"1px solid var(--border)",whiteSpace:"nowrap"}}>
                  {lbl}
                </button>
              ))}
            </div>

            {resTab === "clinics" && (
              <div>
                <Alert color="#0284c7" style={{marginBottom:14}}>
                  <T size={13} color="#0284c7">⚠ Verified March 2026. For the full current EDS Society-designated centers list visit ehlers-danlos.com/core/current-cne/ — for POTS specialists visit dysautonomiainternational.org. Always verify availability directly.</T>
                </Alert>
                <Inp value={clinicSearch} onChange={e=>setClinicSearch(e.target.value)} placeholder="Search by name, city, or keyword..." />
                <Label>Country</Label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                  {CLINIC_COUNTRIES.map(c=>(
                    <Btn key={c} v="chip" onClick={()=>setClinicCountry(c)}
                      style={{borderColor:clinicCountry===c?"#9878e8":"var(--border)",background:clinicCountry===c?"rgba(140,100,220,0.35)":"var(--bg-chip)",color:clinicCountry===c?"var(--txt-accent)":"var(--txt-mute)"}}>
                      {c}
                    </Btn>
                  ))}
                </div>
                <Label>Condition</Label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                  {CLINIC_CONDS.map(c=>(
                    <Btn key={c} v="chip" onClick={()=>setClinicCond(c)}
                      style={{borderColor:clinicCond===c?condColor(c):"var(--border)",background:clinicCond===c?condColor(c)+"22":"var(--bg-chip)",color:clinicCond===c?condColor(c):"var(--txt-mute)"}}>
                      {c}
                    </Btn>
                  ))}
                </div>
                <Label>Offers</Label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
                  {CLINIC_OFFERS_LIST.map(([key,lbl])=>{
                    const active=clinicOffers.includes(key);
                    return (
                      <Btn key={key} v="chip" onClick={()=>setClinicOffers(prev=>active?prev.filter(x=>x!==key):[...prev,key])}
                        style={{borderColor:active?"#0d9488":"var(--border)",background:active?"rgba(16,217,196,0,0.25)":"var(--bg-chip)",color:active?"#0d9488":"var(--txt-mute)"}}>
                        {lbl}
                      </Btn>
                    );
                  })}
                </div>
                {SPECIALTY_CLINICS
                  .filter(c=>(clinicCountry==="All"||c.country===clinicCountry)&&(clinicCond==="All"||c.conds.includes(clinicCond))&&(clinicOffers.length===0||clinicOffers.every(o=>c.offers.includes(o)))&&(!clinicSearch||c.name.toLowerCase().includes(clinicSearch.toLowerCase())||c.city.toLowerCase().includes(clinicSearch.toLowerCase())||c.notes.toLowerCase().includes(clinicSearch.toLowerCase())))
                  .map(clinic=>(
                    <Card key={clinic.id} style={{cursor:"pointer",borderColor:clinicOpen===clinic.id?"rgba(212,184,255,0.5)":"var(--border)"}} onClick={()=>setClinicOpen(clinicOpen===clinic.id?null:clinic.id)}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                        <div style={{flex:1}}>
                          <T size={16} color="var(--txt-accent)" style={{marginBottom:4,fontFamily:"serif"}}>🏥 {clinic.name}</T>
                          <T size={12} color="var(--txt-dim)" style={{marginBottom:5}}>📍 {[clinic.city,clinic.state,clinic.country].filter(Boolean).join(", ")}</T>
                          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                            {clinic.conds.map(c=><Badge key={c} label={c} color={condColor(c)} />)}
                            {clinic.offers.map(o=>{const f=CLINIC_OFFERS_LIST.find(x=>x[0]===o);return f?<Badge key={o} label={f[1]} color="#0d9488" />:null;})}
                          </div>
                        </div>
                        <T size={14} color="var(--txt-mute)">{clinicOpen===clinic.id?"▲":"▼"}</T>
                      </div>
                      {clinicOpen===clinic.id && (
                        <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid var(--border)"}}>
                          <T size={13} color="var(--txt)" style={{marginBottom:8}}>{clinic.notes}</T>
                          {clinic.phone && <T size={12} color="var(--txt-dim)" style={{marginBottom:3}}>📞 {clinic.phone}</T>}
                          {clinic.url && <T size={12} color="#9878e8">🌐 {clinic.url}</T>}
                        </div>
                      )}
                    </Card>
                  ))
                }
              </div>
            )}

            {resTab === "orgs" && (
              <div>
                <Inp value={orgSearch} onChange={e=>setOrgSearch(e.target.value)} placeholder="Search resources..." />
                <Label>Category</Label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                  {ORG_CATS.map(c=>(
                    <Btn key={c} v="chip" onClick={()=>setOrgCat(c)}
                      style={{borderColor:orgCat===c?"#9878e8":"var(--border)",background:orgCat===c?"rgba(140,100,220,0.35)":"var(--bg-chip)",color:orgCat===c?"var(--txt-accent)":"var(--txt-mute)",fontSize:11}}>
                      {c}
                    </Btn>
                  ))}
                </div>
                <Label>Condition</Label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
                  {["All","EDS","POTS","MCAS"].map(c=>(
                    <Btn key={c} v="chip" onClick={()=>setOrgCond(c)}
                      style={{borderColor:orgCond===c?condColor(c):"var(--border)",background:orgCond===c?condColor(c)+"22":"var(--bg-chip)",color:orgCond===c?condColor(c):"var(--txt-mute)"}}>
                      {c==="All"?"All Conditions":c}
                    </Btn>
                  ))}
                </div>
                {ORGANIZATIONS.filter(r=>(orgCat==="All"||r.cat===orgCat)&&(orgCond==="All"||r.conds.includes(orgCond))&&(!orgSearch||r.name.toLowerCase().includes(orgSearch.toLowerCase())||r.desc.toLowerCase().includes(orgSearch.toLowerCase())))
                  .map(r=>(
                    <Card key={r.id} style={{cursor:"pointer",borderColor:orgOpen===r.id?"rgba(212,184,255,0.5)":"var(--border)"}} onClick={()=>setOrgOpen(orgOpen===r.id?null:r.id)}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                        <div style={{flex:1}}>
                          <T size={14} weight={500} color="var(--txt-accent)" style={{marginBottom:4}}>{r.name}</T>
                          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                            {r.conds.map(c=><Badge key={c} label={c} color={condColor(c)} />)}
                          </div>
                        </div>
                        <T size={14} color="var(--txt-mute)">{orgOpen===r.id?"▲":"▼"}</T>
                      </div>
                      {orgOpen===r.id && (
                        <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid var(--border)"}}>
                          <T size={13} color="var(--txt)" style={{marginBottom:8}}>{r.desc}</T>
                          {r.services && r.services.length>0 && (
                            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>
                              {r.services.map(sv=><span key={sv} style={{background:"rgba(140,100,220,0.18)",borderRadius:5,padding:"2px 8px",fontSize:11,color:"var(--txt-dim)",border:"1px solid rgba(124,82,204,0.2)"}}>{sv}</span>)}
                            </div>
                          )}
                          <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
                            {r.phone && <T size={12} color="var(--txt-dim)">📞 {r.phone}</T>}
                            {r.url && <T size={12} color="#9878e8">🌐 {r.url}</T>}
                          </div>
                        </div>
                      )}
                    </Card>
                  ))
                }
              </div>
            )}
          </div>
        )}


        {/* LONG COVID */}
        {activeTab === "longcovid" && (
          <div className="fade">
            <H>Long COVID</H>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:20,borderBottom:"1px solid var(--border)",paddingBottom:4}}>
              {[["daily","📋 Daily Log"],["pacing","⚡ Pacing"],["symptoms","🔍 Symptoms"],["recovery","📈 Recovery"],["clinics","🏥 Clinics"],["info","📚 Info"]].map(([id,lbl])=>(
                <button key={id} onClick={()=>setLcTab(id)}
                  style={{background:"none",border:"none",cursor:"pointer",padding:"8px 14px",fontFamily:"sans-serif",fontSize:13,color:lcTab===id?"var(--txt-accent)":"var(--txt-mute)",borderBottom:lcTab===id?"2px solid #9068e0":"2px solid transparent",whiteSpace:"nowrap"}}>
                  {lbl}
                </button>
              ))}
            </div>

            {lcTab === "daily" && (
              <div>
                {pemRisk && (
                  <Alert color="#dc2626" style={{marginBottom:14}}>
                    <T size={14} weight={600} color="#dc2626" style={{marginBottom:5}}>⚠ PEM RISK DETECTED</T>
                    <T size={13} color="#fca5a5">Stop all activity now. Lie down with legs elevated. Rest completely. PEM typically appears 12-72 hours after exertion — do not wait for the crash to start resting.</T>
                  </Alert>
                )}
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:14}}>
                  <Card>
                    <SubH>Today's Symptoms</SubH>
                    <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                      {LC_SYMPTOMS.map(s=>{
                        const active=lcSyms.includes(s.id);
                        return (
                          <button key={s.id} onClick={()=>setLcSyms(prev=>prev.includes(s.id)?prev.filter(x=>x!==s.id):[...prev,s.id])}
                            style={{padding:"6px 12px",borderRadius:100,border:"1.5px solid "+(active?(s.key?"#dc2626":"#6d28d9"):"var(--border)"),background:active?(s.key?"rgba(224,112,112,0.25)":"rgba(155,127,232,0.15)"):"var(--bg-chip)",color:active?(s.key?"#dc2626":"var(--txt-accent)"):"var(--txt-mute)",cursor:"pointer",fontFamily:"sans-serif",fontSize:12}}>
                            {s.icon} {s.name.split(" ")[0]}{s.key?" ⚠":""}
                          </button>
                        );
                      })}
                    </div>
                  </Card>
                  <Card>
                    <SubH>Severity Levels</SubH>
                    <Slider label="Fatigue" value={lcFatigue} onChange={e=>setLcFatigue(parseInt(e.target.value))} />
                    <Slider label="Brain Fog" value={lcFog} onChange={e=>setLcFog(parseInt(e.target.value))} />
                    <Slider label="Breathlessness" value={lcBreath} onChange={e=>setLcBreath(parseInt(e.target.value))} />
                  </Card>
                  <Card>
                    <SubH>Heart Rate</SubH>
                    {lcAtHR && (
                      <div style={{background:"rgba(16,217,196,0.18)",border:"1px solid rgba(16,217,196,0.25)",borderRadius:8,padding:"7px 11px",marginBottom:10}}>
                        <T size={12} color="#0d9488">AT threshold: {lcAtHR} bpm — stay below this</T>
                      </div>
                    )}
                    <Label>Resting HR (bpm)</Label>
                    <Inp type="number" value={lcHrRest} onChange={e=>setLcHrRest(e.target.value)} placeholder="e.g. 72" />
                    <Label>Peak HR Today (bpm)</Label>
                    <Inp type="number" value={lcHrPeak} onChange={e=>setLcHrPeak(e.target.value)} placeholder="e.g. 95" />
                    {lcHrPeak && lcAtHR && parseInt(lcHrPeak)>parseInt(lcAtHR) && <T size={12} color="#dc2626" style={{marginTop:4,marginBottom:8}}>⚠ Peak HR exceeded AT — PEM risk elevated.</T>}
                    {lcHrPeak && lcAtHR && parseInt(lcHrPeak)<=parseInt(lcAtHR) && <T size={12} color="#0d9488" style={{marginTop:4,marginBottom:8}}>✓ Peak HR within safe zone.</T>}
                  </Card>
                </div>
              </div>
            )}

            {lcTab === "pacing" && (
              <div>
                <Alert color="#dc2626" style={{marginBottom:20}}>
                  <T size={14} weight={600} color="#dc2626" style={{marginBottom:6}}>Graded Exercise Therapy (GET) is contraindicated in PEM-positive Long COVID</T>
                  <T size={13} color="#fca5a5">GET worsens outcomes in patients with post-exertional malaise. The correct approach is pacing — staying within your energy envelope. Share this with any provider who recommends GET.</T>
                </Alert>
                <Card style={{marginBottom:14}}>
                  <SubH>Anaerobic Threshold Calculator</SubH>
                  <T size={13} style={{marginBottom:12}}>Your AT is approximately 50% of your heart rate reserve (Workwell Foundation method). Do not exceed this number.</T>
                  <Row>
                    <div><Label>Your Age</Label><Inp type="number" value={lcAtAge} onChange={e=>setLcAtAge(e.target.value)} placeholder="e.g. 34" /></div>
                    <div><Label>Resting HR (bpm)</Label><Inp type="number" value={lcAtRest} onChange={e=>setLcAtRest(e.target.value)} placeholder="e.g. 68" /></div>
                  </Row>
                  {lcAtResult && (
                    <div style={{background:"rgba(16,217,196,0.18)",border:"1px solid rgba(16,217,196,0.5)",borderRadius:12,padding:16,marginTop:10}}>
                      <T size={26} color="#0d9488" style={{fontFamily:"serif",marginBottom:4}}>AT: {lcAtResult} bpm</T>
                      <T size={13} style={{marginBottom:10}}>Stay below {lcAtResult} bpm during all activity. Estimated max HR: {220-parseInt(lcAtAge)} bpm.</T>
                      <Btn v="sm" onClick={()=>setLcAtHR(String(lcAtResult))}>
                        {lcAtHR===String(lcAtResult)?"✓ Set as my threshold":"Use this as my AT threshold"}
                      </Btn>
                    </div>
                  )}
                </Card>
                <Card style={{marginBottom:14}}>
                  <SubH>Pacing Zones</SubH>
                  {PACING_ZONES.map(z=>(
                    <div key={z.zone} style={{padding:"12px 14px",borderRadius:10,border:"1px solid "+z.color+"40",background:z.color+"10",marginBottom:10}}>
                      <T size={14} weight={600} color={z.color} style={{marginBottom:3}}>{z.zone}</T>
                      <T size={12} color="var(--txt-dim)" style={{marginBottom:3}}>{z.hrDesc}</T>
                      <T size={13} color="var(--txt)" style={{marginBottom:3}}>{z.description}</T>
                      <T size={13} color={z.color} weight={500}>→ {z.advice}</T>
                    </div>
                  ))}
                </Card>
                <Card>
                  <SubH>The Energy Envelope Theory</SubH>
                  {[["What is the energy envelope?","Your energy envelope is the total physical, cognitive, and emotional energy you can spend in a day without triggering PEM. In Long COVID this envelope is dramatically reduced — and exceeding it causes compounding damage, not ordinary tiredness."],["The 3 types of exertion","All three count equally: (1) Physical — walking, standing, chores. (2) Cognitive — reading, screens, conversations. (3) Emotional — stress, anxiety, social situations. A difficult conversation can trigger PEM as effectively as exercise."],["Why push-through fails","In Long COVID PEM, pushing through causes immune activation and cellular damage. Rest after exertion does not prevent PEM once threshold is exceeded — prevention only works beforehand."],["Pacing strategy","1) Find your AT above. 2) Stay below it during all activity using a HR monitor. 3) Stop before you feel tired, not after. 4) Budget cognitive and emotional energy the same as physical. 5) Build in mandatory rest before fatigue hits."],["EDS / POTS / MCAS interaction","POTS pushes HR toward AT on standing even at rest. MCAS flares consume immune resources needed for recovery. EDS pain disrupts sleep, reducing repair capacity. All three conditions shrink the energy envelope and make pacing more critical."]].map(([title,body])=>(
                    <div key={title} style={{paddingBottom:12,marginBottom:12,borderBottom:"1px solid var(--border)"}}>
                      <T size={14} weight={600} color="var(--txt-accent)" style={{marginBottom:5}}>{title}</T>
                      <T size={13} color="var(--txt-dim)">{body}</T>
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {lcTab === "symptoms" && (
              <div>
                <T size={13} style={{marginBottom:16}}>Tap any card for causes, relief strategies, and EDS/POTS/MCAS overlap explanation.</T>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:14}}>
                  {LC_SYMPTOMS.map(s=>(
                    <Card key={s.id} style={{cursor:"pointer",borderColor:s.key?"rgba(224,112,112,0.4)":"var(--border)"}} onClick={()=>setLcSelSym(lcSelSym===s.id?null:s.id)}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                        <T size={16} color={s.key?"#dc2626":"var(--txt-accent)"} style={{fontFamily:"serif"}}>{s.icon} {s.name}</T>
                        {s.key && <span style={{fontFamily:"sans-serif",fontSize:10,color:"#dc2626",background:"rgba(224,112,112,0.20)",border:"1px solid rgba(224,112,112,0.4)",borderRadius:4,padding:"2px 6px",flexShrink:0}}>KEY</span>}
                      </div>
                      {lcSelSym===s.id && (
                        <div style={{marginTop:12}}>
                          <T size={11} color="#6d28d9" style={{textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:6}}>Causes</T>
                          {s.causes.map((c,i)=><T key={i} size={13} color="var(--txt)" style={{padding:"4px 0",borderBottom:"1px solid var(--border)"}}>• {c}</T>)}
                          <T size={11} color="#0d9488" style={{textTransform:"uppercase",letterSpacing:"0.8px",margin:"10px 0 6px"}}>Relief Strategies</T>
                          {s.relief.map((r,i)=><T key={i} size={13} color="var(--txt)" style={{padding:"4px 0",borderBottom:"1px solid var(--border)"}}>• {r}</T>)}
                          <div style={{background:"rgba(155,127,232,0.18)",border:"1px solid rgba(155,127,232,0.3)",borderRadius:8,padding:"10px 12px",marginTop:10}}>
                            <T size={11} color="#6d28d9" style={{textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:4}}>EDS / POTS / MCAS Overlap</T>
                            <T size={13} color="#c8b0f0">{s.overlap}</T>
                          </div>
                        </div>
                      )}
                      {lcSelSym!==s.id && <T size={12} color="var(--txt-mute)" style={{marginTop:6}}>Tap to expand</T>}
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {lcTab === "recovery" && (
              <div>
                <T size={13} style={{marginBottom:16}}>Log energy capacity and milestones over time to track progress and communicate with providers.</T>
                <Card style={{marginBottom:14}}>
                  <SubH>+ Add Recovery Entry</SubH>
                  <Row>
                    <div><Label>Date</Label><Inp type="date" value={lcNewDate} onChange={e=>setLcNewDate(e.target.value)} /></div>
                    <div><Slider label="Energy Capacity" value={lcNewPct} onChange={e=>setLcNewPct(parseInt(e.target.value))} max={100} /></div>
                  </Row>
                  <Label>Milestone</Label>
                  <Inp value={lcNewMile} onChange={e=>setLcNewMile(e.target.value)} placeholder="e.g. Walked to mailbox, 20 min upright..." />
                  <Label>Notes</Label>
                  <Textarea value={lcNewNote} onChange={e=>setLcNewNote(e.target.value)} placeholder="How are you feeling?" />
                  <Btn style={{marginTop:8}} onClick={()=>{
                    if(!lcNewDate) return;
                    setLcRecovery(prev=>[...prev,{id:Date.now(),date:lcNewDate,pct:lcNewPct,milestone:lcNewMile,notes:lcNewNote}].sort((a,b)=>new Date(b.date)-new Date(a.date)));
                    setLcNewDate(""); setLcNewPct(50); setLcNewMile(""); setLcNewNote("");
                  }}>Save Entry</Btn>
                </Card>
                {lcRecovery.length===0 ? (
                  <Card style={{textAlign:"center",padding:32}}>
                    <T size={14} color="var(--txt-dim)">No entries yet. Add your first recovery entry above.</T>
                  </Card>
                ) : (
                  <div>
                    <Card style={{marginBottom:14}}>
                      <SubH>Energy Capacity Over Time</SubH>
                      <div style={{display:"flex",alignItems:"flex-end",gap:3,height:80,marginBottom:8}}>
                        {[...lcRecovery].reverse().slice(-16).map(e=>(
                          <div key={e.id} style={{flex:1,borderRadius:"3px 3px 0 0",background:e.pct>60?"#0d9488":e.pct>30?"#0284c7":"#dc2626",height:Math.max(e.pct*0.8,4)+"%",minHeight:4}} />
                        ))}
                      </div>
                      <T size={11} color="var(--txt-mute)">Last {Math.min(lcRecovery.length,16)} entries · Green above 60% · Yellow 30-59% · Red below 30%</T>
                    </Card>
                    {lcRecovery.map(e=>(
                      <Card key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                        <div>
                          <T size={14} weight={500} color="var(--txt-accent)">{e.date}</T>
                          {e.milestone && <T size={13} color="#0d9488" style={{marginTop:2}}>🎯 {e.milestone}</T>}
                          {e.notes && <T size={13} color="var(--txt-dim)" style={{fontStyle:"italic"}}>{e.notes}</T>}
                        </div>
                        <div style={{textAlign:"center"}}>
                          <T size={28} color={e.pct>60?"#0d9488":e.pct>30?"#0284c7":"#dc2626"} style={{fontFamily:"serif",fontWeight:300}}>{e.pct}%</T>
                          <T size={11} color="var(--txt-mute)">energy</T>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {lcTab === "clinics" && (
              <div>
                <Card style={{marginBottom:14,borderColor:"rgba(16,217,196,0,0.25)"}}>
                  <T size={13} color="var(--txt-dim)">Long COVID specialist clinics verified early 2026. Always confirm current availability directly with each institution.</T>
                </Card>
                {LC_CLINICS.map((c,i)=>(
                  <Card key={i} style={{marginBottom:10}}>
                    <T size={16} color="var(--txt-accent)" style={{marginBottom:4,fontFamily:"serif"}}>🏥 {c.name}</T>
                    <T size={12} color="var(--txt-dim)" style={{marginBottom:6}}>📍 {[c.city,c.state,c.country].filter(Boolean).join(", ")}</T>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
                      {c.offers.map(o=>{const labels={telehealth:"📱 Telehealth",pediatric:"👶 Pediatric",research:"🔬 Research"};return <Badge key={o} label={labels[o]} color="#0d9488" />;}) }
                    </div>
                    <T size={13} color="var(--txt)" style={{marginBottom:6}}>{c.notes}</T>
                    <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
                      {c.phone && <T size={12} color="var(--txt-dim)">📞 {c.phone}</T>}
                      {c.url && <T size={12} color="#9878e8">🌐 {c.url}</T>}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {lcTab === "info" && (
              <div>
                <Card style={{marginBottom:14,borderColor:"rgba(155,127,232,0.3)"}}>
                  <SubH>EDS / POTS / MCAS and Long COVID Overlap</SubH>
                  {[["Why the overlap is so common","A significant proportion of Long COVID patients are later diagnosed with pre-existing undiagnosed hEDS, POTS, or MCAS. COVID-19 appears to unmask or dramatically worsen all three conditions through autoantibody formation, mast cell activation, and autonomic neuropathy."],["POTS as a Long COVID outcome","New-onset POTS is one of the most documented Long COVID presentations. Studies confirm autoantibodies against adrenergic and muscarinic receptors in post-COVID POTS — distinct from EDS-associated POTS, though symptoms overlap completely."],["MCAS activation by COVID","COVID-19 spike protein directly activates mast cells. Long COVID patients frequently meet MCAS diagnostic criteria. In pre-existing MCAS patients, COVID often dramatically worsens reactivity and expands the trigger list."],["The ME/CFS connection","Long COVID with PEM is now classified by many researchers as a form of ME/CFS triggered by COVID-19. The Bateman Horne Center, NIH RECOVER, and patient-led research groups treat these as overlapping conditions sharing the same energy metabolism dysfunction."]].map(([title,body])=>(
                    <div key={title} style={{paddingBottom:12,marginBottom:12,borderBottom:"1px solid var(--border)"}}>
                      <T size={14} weight={600} color="var(--txt-accent)" style={{marginBottom:5}}>{title}</T>
                      <T size={13} color="var(--txt-dim)">{body}</T>
                    </div>
                  ))}
                </Card>
                {LC_RESOURCES.map((r,i)=>(
                  <Card key={i} style={{marginBottom:10}}>
                    <T size={14} weight={500} color="var(--txt-accent)" style={{marginBottom:4}}>{r.name}</T>
                    <T size={13} color="var(--txt-dim)" style={{marginBottom:6}}>{r.desc}</T>
                    <T size={12} color="#9878e8">🌐 {r.url}</T>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}


        {/* EMERGENCY */}
        {activeTab === "womens" && (
          <div className="fade">
            <H>Women's Health</H>

            <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
              {[["tracker","📅 Cycle Tracker"],["symptoms","🌸 Symptoms"],["guide","📖 Phase Guide"]].map(function(item){
                var id=item[0], label=item[1];
                return (
                  <button key={id} onClick={function(){setCycleView(id);}}
                    style={{background:cycleView===id?"linear-gradient(135deg,#db2777,#9333ea)":"var(--bg-card)",
                      border:"1px solid "+(cycleView===id?"transparent":"var(--border)"),
                      borderRadius:8,padding:"7px 14px",cursor:"pointer",
                      color:cycleView===id?"#fff":"var(--txt-dim)",
                      fontFamily:"sans-serif",fontSize:13,whiteSpace:"nowrap",fontWeight:cycleView===id?600:400}}>
                    {label}
                  </button>
                );
              })}
            </div>

            {cycleView === "tracker" && (
              <div>
                {period && (function(){
                  var start=new Date(period), today=new Date();
                  var dayOfCycle=Math.floor((today-start)/86400000)+1;
                  var cl=parseInt(cycle)||28;
                  var phaseName=dayOfCycle<=5?"Menstruation":dayOfCycle<=13?"Follicular":dayOfCycle<=16?"Ovulation":dayOfCycle<=cl?"Luteal":"Next period due";
                  var phaseColor=dayOfCycle<=5?"#dc2626":dayOfCycle<=13?"#0284c7":dayOfCycle<=16?"#db2777":"#4f46e5";
                  var phaseDesc=dayOfCycle<=5?"Rest and restore. Highest inflammation phase — low-histamine diet essential.":dayOfCycle<=13?"Energy rising. Gradually reintroduce gentle movement.":dayOfCycle<=16?"Estrogen peaks — mast cells most reactive. Watch for MCAS flares.":"Progesterone phase. Symptoms worsen as it drops in final days.";
                  var nextP=new Date(start); nextP.setDate(nextP.getDate()+cl);
                  var daysToNext=Math.ceil((nextP-today)/86400000);
                  return (
                    <div>
                      <Card style={{marginBottom:12,borderColor:phaseColor+"60",background:phaseColor+"10"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                          <div>
                            <T size={12} color="var(--txt-mute)" style={{marginBottom:2}}>Current phase</T>
                            <T size={22} weight={700} color={phaseColor} style={{fontFamily:"serif"}}>{phaseName}</T>
                            <T size={13} color="var(--txt-dim)" style={{marginTop:4}}>Day {dayOfCycle} of {cl}</T>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <T size={11} color="var(--txt-mute)">Next period</T>
                            <T size={14} weight={600} color={phaseColor}>{daysToNext>0?"in "+daysToNext+" days":"today / overdue"}</T>
                          </div>
                        </div>
                        <div style={{height:6,background:"rgba(79,70,229,0.04)",borderRadius:3,marginBottom:8,overflow:"hidden"}}>
                          <div style={{height:"100%",width:Math.min(100,(dayOfCycle/cl)*100)+"%",background:phaseColor,borderRadius:3}} />
                        </div>
                        <T size={12} style={{lineHeight:1.7}}>{phaseDesc}</T>
                      </Card>

                      <Card style={{marginBottom:12}}>
                        <SubH>Cycle Map</SubH>
                        <div style={{display:"flex",gap:2,marginBottom:8}}>
                          {Array.from({length:cl}).map(function(_,i){
                            var d=i+1, isToday=d===dayOfCycle;
                            var col=d<=5?"#dc2626":d<=13?"#0284c7":d<=16?"#db2777":"#4f46e5";
                            return (
                              <div key={d} style={{flex:1,height:isToday?20:12,borderRadius:2,
                                background:isToday?col:col+"50",border:isToday?"2px solid "+col:"none",minWidth:2}} />
                            );
                          })}
                        </div>
                        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                          {[["#dc2626","1-5 Period"],["#0284c7","6-13 Follicular"],["#db2777","14-16 Ovulation"],["#4f46e5","17+ Luteal"]].map(function(item){
                            var col=item[0], lbl=item[1];
                            return (
                              <div key={lbl} style={{display:"flex",alignItems:"center",gap:4}}>
                                <div style={{width:10,height:10,borderRadius:2,background:col}} />
                                <T size={10} color="var(--txt-mute)">{lbl}</T>
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                    </div>
                  );
                })()}

                <Card style={{marginBottom:12}}>
                  <SubH>Period Settings</SubH>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                    <div><Label>Last period start</Label><Inp type="date" value={period} onChange={function(e){setPeriod(e.target.value);}} /></div>
                    <div><Label>Cycle length (days)</Label><Inp type="number" min="21" max="45" value={cycle} onChange={function(e){setCycle(e.target.value);}} /></div>
                  </div>
                  <Btn onClick={function(){
                    if(!period) return;
                    setCycleLog(function(prev){return [{id:Date.now(),date:period,cycleLength:cycle}].concat(prev);});
                  }}>Log This Period</Btn>
                </Card>

                <Card style={{marginBottom:12}}>
                  <SubH>Daily Symptom Log</SubH>
                  <T size={12} color="var(--txt-mute)" style={{marginBottom:10}}>Track symptoms by cycle day to find patterns.</T>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                    <div><Label>Date</Label><Inp type="date" value={cycleSym.date} onChange={function(e){setCycleSym(function(s){return {...s,date:e.target.value};});}} /></div>
                    <div><Label>Severity</Label>
                      <Sel value={cycleSym.severity} onChange={function(e){setCycleSym(function(s){return {...s,severity:e.target.value};});}}>
                        <option value="none">None</option>
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                      </Sel>
                    </div>
                  </div>
                  <div style={{marginBottom:8}}><Label>Symptoms</Label>
                    <Inp value={cycleSym.symptoms} onChange={function(e){setCycleSym(function(s){return {...s,symptoms:e.target.value};});}} placeholder="flushing, joint pain, brain fog, cramps..." />
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                    <div><Label>Mood</Label>
                      <Sel value={cycleSym.mood} onChange={function(e){setCycleSym(function(s){return {...s,mood:e.target.value};});}}>
                        <option value="">Select...</option>
                        <option value="good">Good</option>
                        <option value="anxious">Anxious</option>
                        <option value="irritable">Irritable</option>
                        <option value="low">Low</option>
                        <option value="tearful">Tearful</option>
                        <option value="neutral">Neutral</option>
                      </Sel>
                    </div>
                    <div><Label>Energy</Label>
                      <Sel value={cycleSym.energy} onChange={function(e){setCycleSym(function(s){return {...s,energy:e.target.value};});}}>
                        <option value="">Select...</option>
                        <option value="high">High</option>
                        <option value="moderate">Moderate</option>
                        <option value="low">Low</option>
                        <option value="crash">Crash / PEM</option>
                      </Sel>
                    </div>
                  </div>
                  <div style={{marginBottom:10}}><Label>Notes</Label>
                    <Inp value={cycleSym.notes} onChange={function(e){setCycleSym(function(s){return {...s,notes:e.target.value};});}} placeholder="Anything else..." />
                  </div>
                  <Btn onClick={function(){
                    if(!cycleSym.date||!cycleSym.symptoms) return;
                    var start=period?new Date(period):null;
                    var entryDate=new Date(cycleSym.date);
                    var cycleDay=start?Math.floor((entryDate-start)/86400000)+1:null;
                    setCycleSymLog(function(prev){return [{...cycleSym,id:Date.now(),cycleDay:cycleDay}].concat(prev);});
                    setCycleSym({date:"",symptoms:"",severity:"none",notes:"",mood:"",energy:""});
                  }}>Save Entry</Btn>
                </Card>

                {cycleSymLog.length>0 && (
                  <div style={{marginBottom:12}}>
                    <SubH>Symptom History</SubH>
                    {cycleSymLog.map(function(e){
                      var sevColor=e.severity==="none"?"#0d9488":e.severity==="severe"?"#dc2626":"#0284c7";
                      return (
                        <Card key={e.id} style={{marginBottom:8,borderLeft:"3px solid "+sevColor}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                            <div style={{display:"flex",gap:8}}>
                              <T size={13} weight={600} color="#db2777">{e.date}</T>
                              {e.cycleDay && <T size={11} color="var(--txt-mute)">Day {e.cycleDay}</T>}
                            </div>
                            <div style={{display:"flex",gap:6}}>
                              <span style={{fontSize:11,padding:"2px 7px",borderRadius:4,background:sevColor+"20",color:sevColor,fontWeight:600}}>{e.severity}</span>
                              <Btn v="del" onClick={function(){setCycleSymLog(function(prev){return prev.filter(function(x){return x.id!==e.id;});});}}>✕</Btn>
                            </div>
                          </div>
                          <T size={13}>{e.symptoms}</T>
                          {(e.mood||e.energy) && <T size={12} color="var(--txt-mute)" style={{marginTop:3}}>{e.mood?"Mood: "+e.mood:""}{e.mood&&e.energy?" · ":""}{e.energy?"Energy: "+e.energy:""}</T>}
                          {e.notes && <T size={12} color="var(--txt-mute)" style={{marginTop:2}}>{e.notes}</T>}
                        </Card>
                      );
                    })}
                  </div>
                )}

                {cycleLog.length>0 && (
                  <div>
                    <SubH>Period History</SubH>
                    {cycleLog.map(function(e){return (
                      <Card key={e.id} style={{marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <T size={14} weight={600} color="#db2777">{e.date}</T>
                          <T size={12} color="var(--txt-mute)">Cycle length: {e.cycleLength} days</T>
                        </div>
                        <Btn v="del" onClick={function(){setCycleLog(function(prev){return prev.filter(function(x){return x.id!==e.id;});});}}>Remove</Btn>
                      </Card>
                    );})}
                  </div>
                )}
              </div>
            )}

            {cycleView === "symptoms" && (
              <div>
                <T size={13} style={{marginBottom:14}}>All conditions specific to women living with EDS, POTS, and MCAS. Tap any card to expand.</T>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
                  {(COND_SYMPTOMS.WOMENS||[]).map(function(s){return (
                    <Card key={s.id} style={{borderColor:"rgba(244,114,182,0.25)",cursor:"pointer"}}
                      onClick={function(){setSelSym(selSym&&selSym.id===s.id?null:s);}}>
                      <div style={{fontSize:22,marginBottom:6}}>{s.icon}</div>
                      <T size={14} weight={700} color="#db2777" style={{marginBottom:6}}>{s.name}</T>
                      <T size={12} style={{lineHeight:1.6,color:"var(--txt-dim)"}}>{s.causes[0]}.</T>
                      {selSym&&selSym.id===s.id && (
                        <div style={{marginTop:10}}>
                          <div style={{marginBottom:8}}>
                            <T size={11} color="#db2777" style={{fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>Causes</T>
                            {s.causes.map(function(c,i){return <T key={i} size={12} style={{marginBottom:3}}>• {c}</T>;})}
                          </div>
                          <div style={{marginBottom:8}}>
                            <T size={11} color="#db2777" style={{fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>Relief</T>
                            {s.relief.map(function(r,i){return <T key={i} size={12} style={{marginBottom:3}}>• {r}</T>;})}
                          </div>
                          {s.yoga && <div style={{padding:"8px 10px",background:"rgba(244,114,182,0.08)",borderRadius:8,borderLeft:"3px solid #f472b6"}}>
                            <T size={11} color="#db2777" style={{fontWeight:700,marginBottom:2}}>Yoga</T>
                            <T size={12}>{s.yoga}</T>
                          </div>}
                        </div>
                      )}
                    </Card>
                  );})}
                </div>
              </div>
            )}

            {cycleView === "guide" && (
              <div>
                <Card style={{marginBottom:14,borderColor:"rgba(244,114,182,0.35)",background:"rgba(244,114,182,0.06)"}}>
                  <SubH style={{color:"#db2777"}}>The Hormone-Histamine Connection</SubH>
                  <T size={13} style={{lineHeight:1.8}}>Estrogen stimulates mast cells to release histamine, and histamine stimulates more estrogen production. This cycle amplifies MCAS symptoms around ovulation and before menstruation. Progesterone stabilizes mast cells, which is why many women feel better mid-cycle and worse in the luteal phase. Tracking symptoms alongside your cycle is one of the most clinically useful things you can do.</T>
                </Card>
                {[
                  {phase:"Days 1-5 — Menstruation",color:"#dc2626",icon:"🔴",diet:"Strictly low-histamine. Magnesium glycinate for cramps. Anti-inflammatory foods. No alcohol.",yoga:"Restorative only — Supta Baddha Konasana, Yoga Nidra, Supported Savasana. No inversions during heavy flow.",mcas:"Highest mast cell reactivity. Increase antihistamines if your protocol allows. Avoid known triggers.",general:"Rest is a clinical prescription here, not laziness. This is the highest inflammation phase."},
                  {phase:"Days 6-13 — Follicular",color:"#0284c7",icon:"🔵",diet:"Gradually liberalize as symptoms ease. Increase protein for energy. Fermented foods cautiously if tolerated.",yoga:"Reintroduce gentle active practices. Good time for breathwork and seated sequences.",mcas:"Symptom burden typically lighter. Good time for new activities within your energy envelope.",general:"Cognitive function often best here. Schedule demanding appointments and tasks in this window."},
                  {phase:"Days 14-16 — Ovulation",color:"#db2777",icon:"🩷",diet:"Low-histamine even if feeling well — estrogen peaks and mast cells are most reactive. No alcohol.",yoga:"Shorter gentler practices. This is not the time to push even if energy feels high.",mcas:"Estrogen peak = highest mast cell risk. Antihistamines per your protocol. Watch for flushing and hives.",general:"Many women feel good here but overdo it. The mast cell reactivity is also at its highest. Pace carefully."},
                  {phase:"Days 17-28 — Luteal",color:"#4f46e5",icon:"🟣",diet:"Strictest low-histamine phase. Magnesium glycinate daily. No alcohol. Quercetin-rich foods if tolerated.",yoga:"Yoga Nidra daily. Reduce exertion progressively. Restorative from day 24 onward.",mcas:"Progesterone falls in final days, triggering histamine release. Symptoms typically worsen days 21-28.",general:"Prepare your environment before menstruation arrives. Reduce commitments in the final 5 days."},
                ].map(function(p){return (
                  <Card key={p.phase} style={{marginBottom:12,borderLeft:"4px solid "+p.color}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                      <span style={{fontSize:20}}>{p.icon}</span>
                      <T size={16} weight={700} color={p.color} style={{fontFamily:"serif"}}>{p.phase}</T>
                    </div>
                    {[["Diet",p.diet],["Yoga",p.yoga],["MCAS",p.mcas],["General",p.general]].map(function(item){
                      var lbl=item[0], text=item[1];
                      return (
                        <div key={lbl} style={{marginBottom:8}}>
                          <T size={11} color={p.color} style={{fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:3}}>{lbl}</T>
                          <T size={12} style={{lineHeight:1.7}}>{text}</T>
                        </div>
                      );
                    })}
                  </Card>
                );})}
              </div>
            )}

          </div>
        )}


        {activeTab === "emergency" && (
          <div className="fade">
            <H>Emergency Protocol Card</H>
            <Alert color="#dc2626" style={{marginBottom:16}}>
              <T size={14} weight={500} color="#dc2626" style={{marginBottom:8}}>For First Responders and ER Staff</T>
              <T size={13} color="#fca5a5">This patient has Ehlers-Danlos Syndrome (EDS), POTS, and/or MCAS.</T>
              <T size={13} color="#fca5a5">• Handle joints gently — hypermobility risk of iatrogenic subluxation</T>
              <T size={13} color="#fca5a5">• Supine positioning may be required for BP stability</T>
              <T size={13} color="#fca5a5">• MCAS: use low-histamine IV fluids (normal saline preferred); avoid dextran, morphine, vancomycin, NSAIDs if reactive</T>
              <T size={13} color="#fca5a5">• Latex allergy common — use latex-free supplies</T>
              <T size={13} color="#fca5a5">• Epinephrine auto-injectors may be carried — patient may need to self-administer</T>
              <T size={13} color="#fca5a5">• IV access: veins may be fragile and difficult</T>
            </Alert>
            {[
              {title:"MCAS Anaphylaxis Protocol", color:"#dc2626", steps:["Administer epinephrine auto-injector (thigh)","Call 911 immediately","Lay flat, legs elevated (if no breathing difficulty)","Second epi at 5-15 minutes if no improvement","IV normal saline — avoid histamine-releasing agents","Diphenhydramine IV + famotidine IV","Corticosteroids (methylprednisolone) if available","Monitor for biphasic reaction 4-8 hours post"]},
              {title:"POTS Crisis Protocol", color:"#0891b2", steps:["Lie down immediately, elevate legs","Oral/IV fluid bolus if available","Compression garments if accessible","Cool environment, remove heat sources","Slow nasal breathing (4 counts in, 6 out)","Salt packet if conscious and tolerating","If HR above 150 or presyncope — call MD"]},
              {title:"EDS Dislocation Protocol", color:"#6d28d9", steps:["Do NOT attempt to force reduction","Stabilize and immobilize in position found","Ice wrapped in cloth for 15-20 min","Call EDS-knowledgeable provider or ER","Document which joint and mechanism","Do NOT weight bear on affected joint"]},
            ].map(p=>(
              <Card key={p.title} style={{marginBottom:14,borderColor:p.color+"30"}}>
                <T size={18} color={p.color} style={{marginBottom:12,fontFamily:"serif"}}>{p.title}</T>
                {p.steps.map((s,i)=>(
                  <div key={i} style={{fontFamily:"sans-serif",fontSize:13,color:"var(--txt)",padding:"5px 0",borderBottom:"1px solid var(--border)",display:"flex",gap:10}}>
                    <span style={{color:p.color,minWidth:20,fontWeight:600}}>{i+1}.</span>{s}
                  </div>
                ))}
              </Card>
            ))}
            <Card>
              <SubH>Export Patient Summary</SubH>
              <T size={13} style={{marginBottom:14}}>Download a summary of your medications, symptoms, vitals, and labs to share with providers.</T>
              <Btn onClick={()=>{
                const allSymList=[...COND_SYMPTOMS.EDS,...COND_SYMPTOMS.POTS,...COND_SYMPTOMS.MCAS];
                const txt=[
                  "ZEBRA HEALTH — PATIENT SUMMARY",
                  "Generated: "+new Date().toLocaleDateString(),
                  "",
                  "=== MEDICATIONS ===",
                  ...meds.map(m=>"• "+m.name+" "+m.dose+" — "+m.freq+" ["+m.cat+"]"),
                  "",
                  "=== ACTIVE SYMPTOMS ===",
                  ...(symptoms.length ? symptoms.map(sid=>{const s=allSymList.find(x=>x.id===sid);return s?"• "+s.name:"";}).filter(Boolean) : ["None logged"]),
                  "",
                  "=== VITALS ===",
                  "HR: "+(vitals.hr||"—")+" bpm | BP: "+(vitals.bp_s||"—")+"/"+(vitals.bp_d||"—")+" mmHg | O2: "+(vitals.o2||"—")+"% | Temp: "+(vitals.temp||"—")+"°F",
                  "Energy: "+energy+"/10 | Sleep: "+(sleepH||"—")+" hrs | Hydration: "+hydration+"/8",
                  "",
                  "=== LAB RESULTS ===",
                  ...labs.map(l=>"• "+l.test+": "+l.value+" ("+l.date+")"),
                  "",
                  "=== SPECIALISTS ===",
                  ...specs.map(s=>"• "+s.name+" — "+s.type+" — "+s.phone),
                  "",
                  "=== NOTES ===",
                  notes||"None",
                ].join("\n");
                const blob=new Blob([txt],{type:"text/plain"});
                const a=document.createElement("a");
                a.href=URL.createObjectURL(blob);
                a.download="zebra-health-summary-"+new Date().toISOString().split("T")[0]+".txt";
                a.click();
              }}>⬇ Download Patient Summary</Btn>
            </Card>
          </div>
        )}

        {/* JOURNAL */}
        {activeTab === "journal" && (
          <div className="fade">
            <H>Journal</H>

            {journalView === "list" && (
              <div>
                <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
                  <div style={{flex:1,minWidth:200}}>
                    <Inp placeholder="Search by title or content..." value={journalSearch} onChange={function(e){setJournalSearch(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")fetchJournal(journalSearch);}} />
                  </div>
                  <Btn v="sm" onClick={function(){fetchJournal(journalSearch);}}>Search</Btn>
                  {journalSearch && <Btn v="sm" onClick={function(){setJournalSearch("");fetchJournal("");}}>Clear</Btn>}
                  <Btn onClick={function(){setJournalEdit(null);setJournalForm({title:"",body:"",entryDate:new Date().toISOString().split("T")[0]});setJournalView("edit");}}>+ New Entry</Btn>
                </div>

                {journalLoading && <T size={14} color="var(--txt-mute)" style={{textAlign:"center",padding:40}}>Loading entries...</T>}

                {!journalLoading && journalEntries.length === 0 && (
                  <Card style={{textAlign:"center",padding:40}}>
                    <T size={36} style={{marginBottom:12}}>📓</T>
                    <T size={16} color="var(--txt-accent)" style={{fontFamily:"serif",marginBottom:8}}>
                      {journalSearch ? "No entries match your search" : "Your journal is empty"}
                    </T>
                    <T size={13} color="var(--txt-dim)" style={{marginBottom:16}}>
                      {journalSearch ? "Try different search terms." : "Start writing to keep track of your thoughts, symptoms, and experiences."}
                    </T>
                    {!journalSearch && <Btn onClick={function(){setJournalEdit(null);setJournalForm({title:"",body:"",entryDate:new Date().toISOString().split("T")[0]});setJournalView("edit");}}>Write Your First Entry</Btn>}
                  </Card>
                )}

                {!journalLoading && journalEntries.map(function(entry){
                  return (
                    <Card key={entry.id} style={{marginBottom:12,cursor:"pointer"}} onClick={function(){setJournalEdit(entry);setJournalForm({title:entry.title,body:entry.body,entryDate:entry.entryDate||entry.entry_date});setJournalView("edit");}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                        <div style={{flex:1,minWidth:0}}>
                          <T size={16} color="var(--txt-accent)" weight={600} style={{fontFamily:"serif",marginBottom:4}}>{entry.title}</T>
                          <T size={12} color="var(--txt-mute)" style={{marginBottom:6}}>
                            {new Date(entry.entryDate||entry.entry_date).toLocaleDateString("en-US",{weekday:"short",year:"numeric",month:"long",day:"numeric"})}
                          </T>
                          <T size={13} color="var(--txt-dim)" style={{overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
                            {entry.body}
                          </T>
                        </div>
                        <button onClick={function(e){e.stopPropagation();deleteJournalEntry(entry.id);}} style={{background:"none",border:"none",color:"#dc2626",cursor:"pointer",fontSize:16,padding:"4px 8px",flexShrink:0}} title="Delete entry">🗑</button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {journalView === "edit" && (
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <SubH>{journalEdit ? "Edit Entry" : "New Entry"}</SubH>
                  <Btn v="sm" onClick={function(){setJournalView("list");setJournalEdit(null);}}>← Back</Btn>
                </div>
                <Card>
                  <Label>Date</Label>
                  <Inp type="date" value={journalForm.entryDate} onChange={function(e){setJournalForm(function(p){return Object.assign({},p,{entryDate:e.target.value});});}} style={{marginBottom:14}} />
                  <Label>Title</Label>
                  <Inp placeholder="Entry title..." value={journalForm.title} onChange={function(e){setJournalForm(function(p){return Object.assign({},p,{title:e.target.value});});}} style={{marginBottom:14}} />
                  <Label>Content</Label>
                  <Textarea value={journalForm.body} onChange={function(e){setJournalForm(function(p){return Object.assign({},p,{body:e.target.value});});}} placeholder="Write your thoughts, experiences, observations..." style={{minHeight:200,marginBottom:16}} />
                  <div style={{display:"flex",gap:10}}>
                    <Btn onClick={function(){if(journalForm.title.trim()&&journalForm.entryDate){saveJournalEntry();}else{window.alert("Please enter a title and date.");}}}>
                      {journalEdit ? "Save Changes" : "Save Entry"}
                    </Btn>
                    <Btn v="sm" onClick={function(){setJournalView("list");setJournalEdit(null);}}>Cancel</Btn>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* EXPORT & DATA */}
        {activeTab === "export" && (
          <div className="fade">
            <H>Export & Data</H>

            <Card style={{marginBottom:16}}>
              <SubH>Your data stays on this device</SubH>
              <T size={13} style={{lineHeight:1.8,marginBottom:12}}>
                All your symptom logs, vitals, medications, appointments, and lab results
                are stored locally on your phone. Nothing is sent to any server.
                Use the export options below to share data with your medical team
                or back it up for safekeeping.
              </T>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <Badge label="📱 On-device only" color="#0d9488" />
                <Badge label="🔒 No account needed" color="#0891b2" />
                <Badge label="✈ Works offline" color="var(--txt-accent)" />
              </div>
            </Card>

            <Card style={{marginBottom:16}}>
              <SubH>Export to CSV</SubH>
              <T size={13} style={{lineHeight:1.8,marginBottom:16}}>
                Download all your logged data as a spreadsheet file. 
                Open in Excel, Numbers, or Google Sheets. 
                Perfect for sharing with your medical team or keeping a backup.
              </T>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10}}>
                {[
                  {label:"All Data (Complete Export)", icon:"📊", fn:()=>exportAllData(getExportState()), primary:true},
                  {label:"Symptom Log", icon:"📋", fn:()=>downloadCSV(toCSV(symptoms,["date","condition","symptom","severity","notes"]),"symptom-log.csv")},
                  {label:"Medications List", icon:"💊", fn:()=>downloadCSV(toCSV(meds,["name","dose","freq","cat","refill","notes"]),"medications.csv")},
                  {label:"Appointments", icon:"📅", fn:()=>downloadCSV(toCSV(appts,["type","date","time","notes"]),"appointments.csv")},
                  {label:"Lab Results", icon:"🔬", fn:()=>downloadCSV(toCSV(labs,["test","value","date","notes"]),"lab-results.csv")},
                  {label:"Joint Log", icon:"🦴", fn:()=>downloadCSV(toCSV(joints,["joint","severity","time","notes"]),"joint-log.csv")},
                ].map(({label,icon,fn,primary})=>(
                  <button key={label} onClick={fn}
                    style={{
                      background:primary?"linear-gradient(135deg,#8850f0,#d4b8ff)":"rgba(140,100,220,0.18)",
                      border:"1px solid "+(primary?"transparent":"var(--border-input)"),
                      borderRadius:10,padding:"12px 16px",cursor:"pointer",textAlign:"left",
                      color:primary?"#fff":"var(--txt-accent)",fontFamily:"sans-serif"
                    }}>
                    <div style={{fontSize:20,marginBottom:6}}>{icon}</div>
                    <div style={{fontSize:13,fontWeight:500}}>{label}</div>
                  </button>
                ))}
              </div>
            </Card>

            <Card style={{marginBottom:16}}>
              <SubH>Patient Summary (Print / PDF)</SubH>
              <T size={13} style={{lineHeight:1.8,marginBottom:14}}>
                Generate a formatted health summary showing your current medications,
                upcoming appointments, and recent lab results. Print it or save as PDF
                to bring to medical appointments.
              </T>
              <button onClick={()=>exportHealthSummary(getExportState())}
                style={{background:"linear-gradient(135deg,#0891b2,#06b6d4)",border:"none",
                  borderRadius:10,padding:"12px 20px",cursor:"pointer",color:"#fff",
                  fontFamily:"sans-serif",fontSize:14,fontWeight:500}}>
                🖨 Open Print / Save PDF
              </button>
            </Card>

            <Card style={{borderColor:"rgba(224,112,112,0.4)",background:"rgba(224,112,112,0.10)"}}>
              <SubH style={{color:"#dc2626"}}>Reset All Data</SubH>
              <T size={13} style={{lineHeight:1.8,marginBottom:14}}>
                This permanently deletes all your logged data from this device.
                Export a backup first. This cannot be undone.
              </T>
              <button
                onClick={()=>{
                  if(window.confirm("Delete ALL data? This cannot be undone. Export a backup first.")) {
                    clearAll();
                    window.location.reload();
                  }
                }}
                style={{background:"rgba(224,112,112,0.25)",border:"1px solid rgba(224,112,112,0.4)",
                  borderRadius:10,padding:"10px 18px",cursor:"pointer",color:"#dc2626",
                  fontFamily:"sans-serif",fontSize:13,fontWeight:500}}>
                🗑 Delete All My Data
              </button>
            </Card>

          </div>
        )}


      </div>

      {/* SYMPTOM DETAIL MODAL */}
      {selSym && (
        <div onClick={()=>setSelSym(null)} style={{position:"fixed",inset:0,background:"var(--overlay)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(4px)"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"var(--bg-modal)",border:"1px solid var(--border-input)",borderRadius:20,padding:28,maxWidth:560,width:"90%",maxHeight:"85vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <T size={22} color="var(--txt-accent)" style={{fontFamily:"serif"}}>{selSym.icon} {selSym.name}</T>
              <button onClick={()=>setSelSym(null)} style={{background:"none",border:"none",color:"var(--txt-mute)",cursor:"pointer",fontSize:20}}>✕</button>
            </div>
            <div style={{marginBottom:14}}>
              <T size={12} color="#6d28d9" style={{textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:8}}>Causes and Triggers</T>
              {selSym.causes.map((c,i)=><T key={i} size={13} color="var(--txt)" style={{padding:"5px 0",borderBottom:"1px solid var(--border)"}}>• {c}</T>)}
            </div>
            <div style={{marginBottom:14}}>
              <T size={12} color="#0d9488" style={{textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:8}}>Relief Strategies</T>
              {selSym.relief.map((r,i)=><T key={i} size={13} color="var(--txt)" style={{padding:"5px 0",borderBottom:"1px solid var(--border)"}}>• {r}</T>)}
            </div>
            <div style={{background:"var(--edit-nav-bg)",border:"1px solid var(--border-input)",borderRadius:12,padding:14,marginBottom:14}}>
              <T size={12} color="var(--txt-accent)" style={{textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:8}}>Yoga Therapy</T>
              <T size={13} color="var(--txt-dim)">{selSym.yoga}</T>
            </div>
            <Btn style={{width:"100%"}} onClick={()=>{toggleSym(selSym.id);setSelSym(null);}}>
              {symptoms.includes(selSym.id)?"✓ Remove from Today's Log":"+ Add to Today's Log"}
            </Btn>
          </div>
        </div>
      )}

      {/* YOGA DETAIL MODAL */}
      {selYoga && (
        <div onClick={()=>setSelYoga(null)} style={{position:"fixed",inset:0,background:"var(--overlay)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(4px)"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"var(--bg-modal)",border:"1px solid var(--border-input)",borderRadius:20,padding:28,maxWidth:560,width:"90%",maxHeight:"85vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div>
                <T size={22} color="var(--txt-accent)" style={{fontFamily:"serif"}}>🧘 {selYoga.name}</T>
                <span style={{fontFamily:"sans-serif",fontSize:11,color:"#88d0f0",background:"rgba(124,196,232,0.20)",border:"1px solid rgba(124,196,232,0.35)",borderRadius:100,padding:"2px 8px",display:"inline-block",marginTop:4}}>{selYoga.cat}</span>
              </div>
              <button onClick={()=>setSelYoga(null)} style={{background:"none",border:"none",color:"var(--txt-mute)",cursor:"pointer",fontSize:20}}>✕</button>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
              <T size={12} color="var(--txt-dim)">⏱ {selYoga.dur}</T>
              <T size={12} color="var(--txt-dim)">📍 {selYoga.pos}</T>
              {selYoga.conds.map(c=><Badge key={c} label={c} color={condColor(c)} />)}
            </div>
            <div style={{background:"var(--edit-nav-bg)",border:"1px solid var(--border)",borderRadius:10,padding:"10px 14px",marginBottom:14}}>
              <T size={13} color="var(--txt-dim)">{selYoga.benefits}</T>
            </div>
            {selYoga.contra && !selYoga.contra.startsWith("None") && (
              <div style={{background:"rgba(56,189,248,0.18)",border:"1px solid rgba(56,189,248,0.3)",borderRadius:10,padding:"10px 14px",marginBottom:14}}>
                <T size={12} color="#0284c7">⚠ {selYoga.contra}</T>
              </div>
            )}
            {selYoga.mods && (
              <T size={12} color="var(--txt-mute)" style={{marginBottom:14}}>🎒 Modifications: {selYoga.mods}</T>
            )}
            <T size={12} color="var(--txt-dim)" style={{textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:10}}>Step-by-Step ({yogaSteps(selYoga).length} steps)</T>
            {yogaSteps(selYoga).map((s,i)=>(
              <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                <div style={{minWidth:24,height:24,borderRadius:"50%",background:"rgba(140,100,220,0.35)",color:"var(--txt-accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,flexShrink:0}}>{i+1}</div>
                <T size={13} color="var(--txt)">{s}</T>
              </div>
            ))}
            <div style={{display:"flex",gap:10,marginTop:16}}>
              <Btn onClick={()=>setFavorites(f=>f.includes(selYoga.name)?f.filter(n=>n!==selYoga.name):[...f,selYoga.name])}>
                {favorites.includes(selYoga.name)?"★ Unfavorite":"☆ Add to Favorites"}
              </Btn>
              <Btn v="sm" onClick={()=>setSelYoga(null)}>Close</Btn>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
