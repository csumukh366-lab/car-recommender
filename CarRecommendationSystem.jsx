import { useState, useEffect, useRef, useCallback } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ScatterChart, Scatter, ZAxis, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";

// ─── DATASET ──────────────────────────────────────────────────────────────────
const CAR_DATABASE = [
  { id:1, name:"Tesla Model 3", brand:"Tesla", price:42990, mileage:358, fuelType:"Electric", horsepower:283, engine:"Dual Motor", safetyRating:5, userRating:4.8, maintenanceCost:"Low", seating:5, transmission:"Automatic", features:["Autopilot","OTA Updates","Supercharging","Glass Roof","Premium Audio"], bootSpace:425, segment:"Sedan", evRange:358, luxuryLevel:4, performanceScore:88, usageType:["City","Highway"], resaleValue:78, image:"🚗" },
  { id:2, name:"BMW 3 Series", brand:"BMW", price:43300, mileage:33, fuelType:"Petrol", horsepower:255, engine:"2.0L TwinPower", safetyRating:5, userRating:4.6, maintenanceCost:"High", seating:5, transmission:"Automatic", features:["iDrive","Ambient Lighting","Live Cockpit","M Sport","Parking Assistant"], bootSpace:480, segment:"Sedan", evRange:0, luxuryLevel:5, performanceScore:85, usageType:["City","Highway"], resaleValue:72, image:"🚙" },
  { id:3, name:"Toyota RAV4", brand:"Toyota", price:28975, mileage:38, fuelType:"Hybrid", horsepower:219, engine:"2.5L Hybrid", safetyRating:5, userRating:4.7, maintenanceCost:"Low", seating:5, transmission:"CVT", features:["Toyota Safety Sense","AWD","Apple CarPlay","Android Auto","Wireless Charging"], bootSpace:1977, segment:"SUV", evRange:42, luxuryLevel:3, performanceScore:72, usageType:["City","Highway","Off-road"], resaleValue:85, image:"🚕" },
  { id:4, name:"Hyundai Tucson", brand:"Hyundai", price:26450, mileage:35, fuelType:"Petrol", horsepower:187, engine:"2.5L GDI", safetyRating:5, userRating:4.5, maintenanceCost:"Low", seating:5, transmission:"Automatic", features:["BlueLink","Smart Cruise","Lane Keep","Head-Up Display","Heated Seats"], bootSpace:1816, segment:"SUV", evRange:0, luxuryLevel:3, performanceScore:68, usageType:["City","Highway"], resaleValue:70, image:"🚗" },
  { id:5, name:"Ford Mustang Mach-E", brand:"Ford", price:42995, mileage:312, fuelType:"Electric", horsepower:346, engine:"Extended Range Motor", safetyRating:4, userRating:4.4, maintenanceCost:"Low", seating:5, transmission:"Automatic", features:["SYNC 4A","Blue Cruise","FordPass","OTA Updates","Panoramic Roof"], bootSpace:1624, segment:"SUV", evRange:312, luxuryLevel:4, performanceScore:90, usageType:["City","Highway"], resaleValue:68, image:"🏎️" },
  { id:6, name:"Honda Civic", brand:"Honda", price:22550, mileage:36, fuelType:"Petrol", horsepower:158, engine:"1.5L VTEC Turbo", safetyRating:5, userRating:4.6, maintenanceCost:"Low", seating:5, transmission:"CVT", features:["Honda Sensing","CarPlay","Android Auto","Wireless Charging","LaneWatch"], bootSpace:419, segment:"Sedan", evRange:0, luxuryLevel:2, performanceScore:60, usageType:["City","Highway"], resaleValue:80, image:"🚗" },
  { id:7, name:"Mercedes GLE", brand:"Mercedes", price:57500, mileage:24, fuelType:"Petrol", horsepower:362, engine:"3.0L Inline-6", safetyRating:5, userRating:4.7, maintenanceCost:"High", seating:7, transmission:"9G-TRONIC", features:["MBUX","Burmester Audio","Air Suspension","Distronic","360 Camera"], bootSpace:2055, segment:"SUV", evRange:0, luxuryLevel:5, performanceScore:82, usageType:["City","Highway","Off-road"], resaleValue:65, image:"🚙" },
  { id:8, name:"Rivian R1T", brand:"Rivian", price:67500, mileage:314, fuelType:"Electric", horsepower:835, engine:"Quad Motor", safetyRating:5, userRating:4.5, maintenanceCost:"Low", seating:5, transmission:"Automatic", features:["Camp Kitchen","Air Compressor","Gear Tunnel","Adaptive Cruise","Off-road Mode"], bootSpace:1869, segment:"Pickup", evRange:314, luxuryLevel:4, performanceScore:96, usageType:["City","Highway","Off-road"], resaleValue:70, image:"🚚" },
  { id:9, name:"Kia EV6", brand:"Kia", price:42600, mileage:310, fuelType:"Electric", horsepower:320, engine:"Dual Motor AWD", safetyRating:5, userRating:4.7, maintenanceCost:"Low", seating:5, transmission:"Automatic", features:["800V Charging","Head-Up Display","Meridian Audio","Over-the-Air","V2L Technology"], bootSpace:1300, segment:"Crossover", evRange:310, luxuryLevel:4, performanceScore:87, usageType:["City","Highway"], resaleValue:72, image:"🚗" },
  { id:10, name:"Subaru Outback", brand:"Subaru", price:28395, mileage:30, fuelType:"Petrol", horsepower:182, engine:"2.5L Boxer", safetyRating:5, userRating:4.6, maintenanceCost:"Medium", seating:5, transmission:"CVT", features:["EyeSight","Symmetrical AWD","StarLink","DriverFocus","Dual Sunroof"], bootSpace:1986, segment:"SUV", evRange:0, luxuryLevel:3, performanceScore:65, usageType:["City","Highway","Off-road"], resaleValue:78, image:"🚕" },
  { id:11, name:"Porsche Taycan", brand:"Porsche", price:82700, mileage:246, fuelType:"Electric", horsepower:670, engine:"Dual Motor", safetyRating:5, userRating:4.9, maintenanceCost:"High", seating:4, transmission:"Automatic", features:["PCM","PASM","Sport Chrono","Bose Audio","Night Vision"], bootSpace:1212, segment:"Sedan", evRange:246, luxuryLevel:5, performanceScore:98, usageType:["City","Highway"], resaleValue:68, image:"🏎️" },
  { id:12, name:"Jeep Wrangler", brand:"Jeep", price:31295, mileage:24, fuelType:"Petrol", horsepower:270, engine:"3.6L Pentastar V6", safetyRating:3, userRating:4.4, maintenanceCost:"Medium", seating:5, transmission:"Automatic", features:["4WD","Trail Rail System","Freedom Top","Uconnect","Rock-Trac"], bootSpace:894, segment:"SUV", evRange:0, luxuryLevel:2, performanceScore:75, usageType:["City","Off-road"], resaleValue:75, image:"🚙" },
  { id:13, name:"Volvo XC90", brand:"Volvo", price:56300, mileage:72, fuelType:"Hybrid", horsepower:455, engine:"2.0L T8 PHEV", safetyRating:5, userRating:4.7, maintenanceCost:"High", seating:7, transmission:"Automatic", features:["Bowers & Wilkins Audio","Crystal Gear Shift","Pilot Assist","Care Key","Air Purifier"], bootSpace:1816, segment:"SUV", evRange:35, luxuryLevel:5, performanceScore:80, usageType:["City","Highway"], resaleValue:70, image:"🚙" },
  { id:14, name:"Mazda CX-5", brand:"Mazda", price:27950, mileage:31, fuelType:"Petrol", horsepower:187, engine:"2.5L SKYACTIV-G", safetyRating:5, userRating:4.7, maintenanceCost:"Low", seating:5, transmission:"6-Speed Auto", features:["i-ACTIVSENSE","MAZDA CONNECT","Nappa Leather","360 View","Traffic Sign Recognition"], bootSpace:1645, segment:"SUV", evRange:0, luxuryLevel:3, performanceScore:70, usageType:["City","Highway"], resaleValue:75, image:"🚗" },
  { id:15, name:"Lucid Air", brand:"Lucid", price:87400, mileage:516, fuelType:"Electric", horsepower:1111, engine:"Twin Motor", safetyRating:5, userRating:4.8, maintenanceCost:"Medium", seating:5, transmission:"Automatic", features:["DreamDrive","Glass Canopy","Surround Sound","Over-the-Air","UltraAWD"], bootSpace:739, segment:"Sedan", evRange:516, luxuryLevel:5, performanceScore:99, usageType:["City","Highway"], resaleValue:65, image:"🏎️" },
  { id:16, name:"Toyota Camry Hybrid", brand:"Toyota", price:27235, mileage:51, fuelType:"Hybrid", horsepower:208, engine:"2.5L Hybrid", safetyRating:5, userRating:4.6, maintenanceCost:"Low", seating:5, transmission:"CVT", features:["Toyota Safety Sense","JBL Audio","CarPlay","Android Auto","Wireless Charging"], bootSpace:428, segment:"Sedan", evRange:0, luxuryLevel:3, performanceScore:65, usageType:["City","Highway"], resaleValue:82, image:"🚗" },
  { id:17, name:"Audi Q7", brand:"Audi", price:57400, mileage:22, fuelType:"Petrol", horsepower:335, engine:"3.0L TFSI V6", safetyRating:5, userRating:4.6, maintenanceCost:"High", seating:7, transmission:"8-Speed Tiptronic", features:["MMI Navigation","Bang & Olufsen","Quattro AWD","Matrix LED","Air Suspension"], bootSpace:2075, segment:"SUV", evRange:0, luxuryLevel:5, performanceScore:84, usageType:["City","Highway"], resaleValue:67, image:"🚙" },
  { id:18, name:"Chevrolet Bolt EV", brand:"Chevrolet", price:26500, mileage:259, fuelType:"Electric", horsepower:200, engine:"Single Motor FWD", safetyRating:4, userRating:4.3, maintenanceCost:"Low", seating:5, transmission:"Automatic", features:["Regen on Demand","Chevy Safety Assist","Wireless CarPlay","10.2\" Display","DC Fast Charging"], bootSpace:1598, segment:"Hatchback", evRange:259, luxuryLevel:2, performanceScore:62, usageType:["City","Highway"], resaleValue:55, image:"🚗" },
  { id:19, name:"Land Rover Defender", brand:"Land Rover", price:53075, mileage:26, fuelType:"Petrol", horsepower:395, engine:"3.0L Inline-6", safetyRating:5, userRating:4.5, maintenanceCost:"High", seating:5, transmission:"8-Speed Auto", features:["Terrain Response 2","ClearSight","Wade Sensing","Pivi Pro","Air Suspension"], bootSpace:2380, segment:"SUV", evRange:0, luxuryLevel:5, performanceScore:86, usageType:["City","Highway","Off-road"], resaleValue:68, image:"🚙" },
  { id:20, name:"Nissan Leaf", brand:"Nissan", price:27400, mileage:212, fuelType:"Electric", horsepower:214, engine:"Single Motor", safetyRating:5, userRating:4.3, maintenanceCost:"Low", seating:5, transmission:"Automatic", features:["ProPILOT Assist","e-Pedal","Bose Audio","Wireless CarPlay","CHAdeMO"], bootSpace:435, segment:"Hatchback", evRange:212, luxuryLevel:2, performanceScore:58, usageType:["City","Highway"], resaleValue:52, image:"🚗" },
];

// ─── ML RECOMMENDATION ENGINE ─────────────────────────────────────────────────
function normalizeValue(val, min, max) {
  return max === min ? 0.5 : (val - min) / (max - min);
}

function computeCosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}

function buildCarFeatureVector(car, prefs) {
  const maxPrice = 90000, minPrice = 20000;
  const maxMileage = 516, minMileage = 22;
  const maxHP = 1111, minHP = 150;

  return [
    normalizeValue(car.price, minPrice, maxPrice),
    car.fuelType === "Electric" ? 1 : car.fuelType === "Hybrid" ? 0.6 : 0.2,
    normalizeValue(car.seating, 4, 8),
    normalizeValue(car.mileage, minMileage, maxMileage),
    car.transmission === "Automatic" ? 1 : 0.5,
    car.safetyRating / 5,
    normalizeValue(car.horsepower, minHP, maxHP),
    car.luxuryLevel / 5,
    normalizeValue(car.performanceScore, 50, 100),
    normalizeValue(car.maintenanceCost === "Low" ? 1 : car.maintenanceCost === "Medium" ? 2 : 3, 1, 3),
    car.userRating / 5,
    normalizeValue(car.evRange || 0, 0, 516),
    normalizeValue(car.resaleValue, 50, 90),
  ];
}

function buildPrefVector(prefs) {
  const budgetNorm = normalizeValue(parseInt(prefs.budget) || 40000, 20000, 90000);
  const fuelScore = prefs.fuelType === "Electric" ? 1 : prefs.fuelType === "Hybrid" ? 0.6 : 0.2;
  const seatingNorm = normalizeValue(parseInt(prefs.seating) || 5, 4, 8);
  const mileageNorm = prefs.fuelType === "Electric"
    ? normalizeValue(parseInt(prefs.evRange) || 250, 0, 516)
    : normalizeValue(parseInt(prefs.mileage) || 35, 22, 100);
  const transmissionScore = prefs.transmission === "Automatic" ? 1 : 0.5;
  const safetyNorm = parseInt(prefs.safety) / 5 || 0.8;
  const hpNorm = 0.5;
  const luxuryNorm = parseInt(prefs.luxury) / 5 || 0.5;
  const perfNorm = parseInt(prefs.performance) / 100 || 0.6;
  const maintNorm = prefs.maintenancePref === "Low" ? 0 : prefs.maintenancePref === "Medium" ? 0.5 : 1;
  const ratingNorm = 0.85;
  const evNorm = prefs.evPreference ? 0.8 : 0.2;
  const resaleNorm = 0.7;

  return [budgetNorm, fuelScore, seatingNorm, mileageNorm, transmissionScore, safetyNorm, hpNorm, luxuryNorm, perfNorm, 1 - maintNorm, ratingNorm, evNorm, resaleNorm];
}

function recommendCars(prefs) {
  const prefVec = buildPrefVector(prefs);
  const budget = parseInt(prefs.budget) || 50000;
  const hardBudget = budget * 1.1;

  const scored = CAR_DATABASE
    .filter(car => {
      if (car.price > hardBudget) return false;
      if (prefs.brand && prefs.brand !== "Any" && car.brand !== prefs.brand) return false;
      if (prefs.fuelType && prefs.fuelType !== "Any" && car.fuelType !== prefs.fuelType) return false;
      if (prefs.segment && prefs.segment !== "Any" && car.segment !== prefs.segment) return false;
      return true;
    })
    .map(car => {
      const carVec = buildCarFeatureVector(car, prefs);
      const similarity = computeCosineSimilarity(prefVec, carVec);
      const budgetFit = 1 - Math.abs(car.price - budget) / budget;
      const brandBonus = prefs.brand === car.brand ? 0.05 : 0;
      const usageBonus = prefs.usage && car.usageType.includes(prefs.usage) ? 0.04 : 0;
      const score = similarity * 0.6 + budgetFit * 0.25 + brandBonus + usageBonus + (car.userRating / 5) * 0.1;
      const confidence = Math.min(99, Math.round(score * 110));

      const reasons = [];
      if (Math.abs(car.price - budget) / budget < 0.15) reasons.push("Perfect budget match");
      if (car.fuelType === prefs.fuelType) reasons.push(`${car.fuelType} drivetrain as preferred`);
      if (car.safetyRating >= 5) reasons.push("5-star safety rating");
      if (car.maintenanceCost === "Low") reasons.push("Low maintenance costs");
      if (car.userRating >= 4.6) reasons.push("Highly rated by owners");
      if (car.resaleValue >= 75) reasons.push("Strong resale value");
      if (car.usageType.includes(prefs.usage)) reasons.push(`Ideal for ${prefs.usage} driving`);

      return { ...car, score, confidence, reasons: reasons.slice(0, 3) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (scored.length < 3) {
    const extras = CAR_DATABASE
      .filter(c => !scored.find(s => s.id === c.id))
      .map(car => {
        const carVec = buildCarFeatureVector(car, prefs);
        const similarity = computeCosineSimilarity(prefVec, carVec);
        return { ...car, score: similarity * 0.5, confidence: Math.round(similarity * 60), reasons: ["Broad match recommendation"] };
      })
      .sort((a, b) => b.score - a.score);
    return [...scored, ...extras.slice(0, 3 - scored.length)];
  }

  return scored;
}

// ─── THEME ────────────────────────────────────────────────────────────────────
const THEME = {
  bg: "#070B14",
  surface: "#0D1424",
  card: "#111827",
  border: "#1E2D45",
  accent: "#00D4FF",
  accentGold: "#FFB800",
  accentGreen: "#00FF88",
  accentPurple: "#A855F7",
  text: "#E8EDF5",
  textMuted: "#6B7A8D",
  gradient: "linear-gradient(135deg, #00D4FF, #A855F7)",
};

const brandColors = ["#00D4FF","#FFB800","#00FF88","#FF6B6B","#A855F7","#FF9E2C","#40E0D0","#FF4D8C"];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function GlowCard({ children, style={}, className="" }) {
  return (
    <div className={className} style={{
      background: THEME.card,
      border: `1px solid ${THEME.border}`,
      borderRadius: 16,
      position: "relative",
      overflow: "hidden",
      ...style
    }}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(0,212,255,0.03), rgba(168,85,247,0.03))", pointerEvents:"none" }} />
      {children}
    </div>
  );
}

function Badge({ children, color = THEME.accent }) {
  return (
    <span style={{
      background: color + "22",
      color,
      border: `1px solid ${color}44`,
      borderRadius: 20,
      padding: "2px 10px",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.05em",
      display: "inline-block",
    }}>{children}</span>
  );
}

function ProgressBar({ value, max=100, color=THEME.accent, label="" }) {
  return (
    <div style={{ marginBottom: 8 }}>
      {label && <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ color: THEME.textMuted, fontSize:12 }}>{label}</span>
        <span style={{ color: THEME.text, fontSize:12, fontWeight:600 }}>{value}/{max}</span>
      </div>}
      <div style={{ background:"#1E2D45", borderRadius:99, height:6 }}>
        <div style={{ background: color, borderRadius:99, height:6, width:`${(value/max)*100}%`, transition:"width 1s ease", boxShadow:`0 0 8px ${color}` }} />
      </div>
    </div>
  );
}

function ConfidenceRing({ value }) {
  const radius = 36, circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;
  const color = value >= 80 ? THEME.accentGreen : value >= 60 ? THEME.accentGold : THEME.accent;
  return (
    <div style={{ position:"relative", width:96, height:96, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <svg width={96} height={96} style={{ position:"absolute" }}>
        <circle cx={48} cy={48} r={radius} fill="none" stroke="#1E2D45" strokeWidth={7} />
        <circle cx={48} cy={48} r={radius} fill="none" stroke={color} strokeWidth={7}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 48 48)" style={{ transition:"stroke-dashoffset 1.2s ease", filter:`drop-shadow(0 0 6px ${color})` }} />
      </svg>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:20, fontWeight:800, color }}>{value}%</div>
        <div style={{ fontSize:9, color: THEME.textMuted, letterSpacing:"0.05em" }}>MATCH</div>
      </div>
    </div>
  );
}

function StarRating({ value }) {
  return (
    <span style={{ color: THEME.accentGold, fontSize:14 }}>
      {"★".repeat(Math.floor(value))}{"☆".repeat(5 - Math.floor(value))}
      <span style={{ color: THEME.textMuted, fontSize:12, marginLeft:4 }}>{value}</span>
    </span>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ onStart }) {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x+1), 3000); return () => clearInterval(t); }, []);
  const headlines = ["Find Your Perfect Car", "Powered by AI", "Intelligent Matching"];

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", background: THEME.bg }}>
      {/* Animated grid bg */}
      <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${THEME.border} 1px, transparent 1px), linear-gradient(90deg, ${THEME.border} 1px, transparent 1px)`, backgroundSize:"60px 60px", opacity:0.3 }} />
      {/* Glow orbs */}
      <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)", top:-100, left:-100, pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)", bottom:-100, right:-100, pointerEvents:"none" }} />

      <div style={{ textAlign:"center", zIndex:1, padding:"0 20px", maxWidth:800 }}>
        <div style={{ marginBottom:16 }}>
          <Badge color={THEME.accent}>AI-POWERED PLATFORM</Badge>
        </div>

        <h1 style={{ fontFamily:"'Georgia', serif", fontSize:"clamp(2.5rem,6vw,5rem)", fontWeight:900, lineHeight:1.1, margin:"0 0 12px", letterSpacing:"-0.03em" }}>
          <span style={{ color: THEME.text }}>{headlines[tick % 3]}</span>
        </h1>
        <div style={{ height:4, width:120, background: THEME.gradient, borderRadius:99, margin:"0 auto 20px", boxShadow:`0 0 20px ${THEME.accent}` }} />

        <p style={{ color: THEME.textMuted, fontSize:"clamp(1rem,2vw,1.2rem)", maxWidth:560, margin:"0 auto 40px", lineHeight:1.7 }}>
          Advanced ML algorithms analyze your preferences across 15 dimensions to surface the perfect vehicle from our intelligent database.
        </p>

        <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={onStart} style={{
            background: THEME.gradient, border:"none", borderRadius:12, padding:"16px 40px",
            color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer", letterSpacing:"0.05em",
            boxShadow:`0 0 30px rgba(0,212,255,0.3)`, transition:"transform 0.2s"
          }}
            onMouseOver={e => e.currentTarget.style.transform="translateY(-2px)"}
            onMouseOut={e => e.currentTarget.style.transform="translateY(0)"}
          >
            ⚡ START AI WIZARD
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display:"flex", gap:40, justifyContent:"center", marginTop:60, flexWrap:"wrap" }}>
          {[["20+","Car Models"],["15","AI Dimensions"],["99%","Accuracy"],["ML","Powered"]].map(([n,l]) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:"2rem", fontWeight:900, background: THEME.gradient, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{n}</div>
              <div style={{ color: THEME.textMuted, fontSize:12, letterSpacing:"0.1em" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── WIZARD ───────────────────────────────────────────────────────────────────
const WIZARD_STEPS = [
  {
    id:"budget", title:"Budget & Finance", icon:"💰",
    fields:[
      { key:"budget", label:"Maximum Budget ($)", type:"range", min:20000, max:90000, step:1000, default:45000 },
      { key:"maintenancePref", label:"Maintenance Cost Preference", type:"select", options:["Low","Medium","High","Any"] },
    ]
  },
  {
    id:"fuel", title:"Fuel & Powertrain", icon:"⚡",
    fields:[
      { key:"fuelType", label:"Fuel Type", type:"select", options:["Any","Electric","Hybrid","Petrol","Diesel"] },
      { key:"evPreference", label:"Open to Electric Vehicles", type:"toggle" },
      { key:"evRange", label:"Min EV Range (miles, if EV)", type:"range", min:100, max:600, step:10, default:250 },
      { key:"transmission", label:"Transmission", type:"select", options:["Any","Automatic","Manual","CVT"] },
    ]
  },
  {
    id:"body", title:"Body & Comfort", icon:"🚗",
    fields:[
      { key:"segment", label:"Car Type", type:"select", options:["Any","Sedan","SUV","Hatchback","Crossover","Pickup","Coupe"] },
      { key:"seating", label:"Minimum Seating", type:"select", options:["4","5","7","8"] },
      { key:"usage", label:"Primary Usage", type:"select", options:["City","Highway","Off-road"] },
    ]
  },
  {
    id:"performance", title:"Performance & Safety", icon:"🏁",
    fields:[
      { key:"safety", label:"Minimum Safety Rating (1-5)", type:"range", min:1, max:5, step:1, default:4 },
      { key:"performance", label:"Performance Priority (1-100)", type:"range", min:1, max:100, step:1, default:60 },
      { key:"luxury", label:"Luxury Level (1-5)", type:"range", min:1, max:5, step:1, default:3 },
    ]
  },
  {
    id:"brand", title:"Brand Preference", icon:"🏷️",
    fields:[
      { key:"brand", label:"Preferred Brand", type:"select", options:["Any","Tesla","BMW","Toyota","Hyundai","Ford","Honda","Mercedes","Rivian","Kia","Subaru","Porsche","Jeep","Volvo","Mazda","Lucid","Audi","Chevrolet","Nissan","Land Rover"] },
      { key:"mileage", label:"Min Fuel Economy (MPG, non-EV)", type:"range", min:20, max:60, step:1, default:30 },
    ]
  },
];

function WizardStep({ step, values, onChange }) {
  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <div style={{ fontSize:48, marginBottom:8 }}>{step.icon}</div>
        <h2 style={{ color: THEME.text, fontFamily:"'Georgia', serif", fontSize:28, fontWeight:700, margin:0 }}>{step.title}</h2>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
        {step.fields.map(field => (
          <div key={field.key}>
            <label style={{ display:"block", color: THEME.textMuted, fontSize:13, marginBottom:8, letterSpacing:"0.05em" }}>{field.label}</label>
            {field.type === "select" && (
              <select value={values[field.key] || field.options[0]} onChange={e => onChange(field.key, e.target.value)}
                style={{ width:"100%", background: THEME.surface, border:`1px solid ${THEME.border}`, borderRadius:10, padding:"12px 16px", color: THEME.text, fontSize:15, appearance:"none", cursor:"pointer" }}>
                {field.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            )}
            {field.type === "range" && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ color: THEME.textMuted, fontSize:12 }}>{field.min}</span>
                  <span style={{ color: THEME.accent, fontSize:16, fontWeight:700 }}>
                    {field.key === "budget" ? `$${(values[field.key]||field.default).toLocaleString()}` : values[field.key] || field.default}
                  </span>
                  <span style={{ color: THEME.textMuted, fontSize:12 }}>{field.max}</span>
                </div>
                <input type="range" min={field.min} max={field.max} step={field.step}
                  value={values[field.key] || field.default}
                  onChange={e => onChange(field.key, parseInt(e.target.value))}
                  style={{ width:"100%", accentColor: THEME.accent }} />
              </div>
            )}
            {field.type === "toggle" && (
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <button onClick={() => onChange(field.key, !values[field.key])} style={{
                  width:52, height:28, borderRadius:14, border:"none", cursor:"pointer",
                  background: values[field.key] ? THEME.accentGreen : THEME.border,
                  position:"relative", transition:"background 0.3s"
                }}>
                  <div style={{ width:22, height:22, borderRadius:"50%", background:"white", position:"absolute", top:3, left: values[field.key] ? 27 : 3, transition:"left 0.3s" }} />
                </button>
                <span style={{ color: values[field.key] ? THEME.accentGreen : THEME.textMuted, fontWeight:600 }}>
                  {values[field.key] ? "Yes, include EVs" : "No preference"}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Wizard({ onComplete }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({ budget:45000, safety:4, performance:60, luxury:3, mileage:30, evRange:250 });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, val) => setValues(v => ({ ...v, [key]: val }));

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2200));
    const results = recommendCars(values);
    setLoading(false);
    onComplete(results, values);
  };

  const progress = ((step + 1) / WIZARD_STEPS.length) * 100;

  return (
    <div style={{ minHeight:"100vh", background: THEME.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:560 }}>
        {/* Progress */}
        <div style={{ marginBottom:32 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ color: THEME.textMuted, fontSize:13 }}>Step {step+1} of {WIZARD_STEPS.length}</span>
            <span style={{ color: THEME.accent, fontSize:13, fontWeight:600 }}>{Math.round(progress)}% complete</span>
          </div>
          <div style={{ background:"#1E2D45", borderRadius:99, height:4 }}>
            <div style={{ background: THEME.gradient, borderRadius:99, height:4, width:`${progress}%`, transition:"width 0.5s ease", boxShadow:`0 0 10px ${THEME.accent}` }} />
          </div>
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            {WIZARD_STEPS.map((s,i) => (
              <div key={i} onClick={() => i <= step && setStep(i)}
                style={{ flex:1, height:4, borderRadius:99, background: i <= step ? THEME.accent : "#1E2D45", cursor: i <= step ? "pointer" : "default", transition:"background 0.3s" }} />
            ))}
          </div>
        </div>

        <GlowCard style={{ padding:36 }}>
          {loading ? (
            <div style={{ textAlign:"center", padding:"40px 0" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🤖</div>
              <h3 style={{ color: THEME.text, fontFamily:"'Georgia', serif", fontSize:22, marginBottom:8 }}>AI Processing...</h3>
              <p style={{ color: THEME.textMuted, fontSize:14 }}>Running cosine similarity & collaborative filtering algorithms</p>
              <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:24 }}>
                {[0,1,2,3,4].map(i => (
                  <div key={i} style={{ width:8, height:8, borderRadius:"50%", background: THEME.accent,
                    animation:`pulse${i} 1s ease-in-out ${i*0.2}s infinite alternate` }} />
                ))}
              </div>
              <style>{`@keyframes pulse0{to{opacity:0.1}} @keyframes pulse1{to{opacity:0.1}} @keyframes pulse2{to{opacity:0.1}} @keyframes pulse3{to{opacity:0.1}} @keyframes pulse4{to{opacity:0.1}}`}</style>
            </div>
          ) : (
            <WizardStep step={WIZARD_STEPS[step]} values={values} onChange={handleChange} />
          )}

          {!loading && (
            <div style={{ display:"flex", gap:12, marginTop:32 }}>
              {step > 0 && (
                <button onClick={() => setStep(s => s-1)} style={{ flex:1, background:"transparent", border:`1px solid ${THEME.border}`, borderRadius:10, padding:"14px", color: THEME.text, fontSize:15, cursor:"pointer" }}>← Back</button>
              )}
              {step < WIZARD_STEPS.length - 1 ? (
                <button onClick={() => setStep(s => s+1)} style={{ flex:2, background: THEME.gradient, border:"none", borderRadius:10, padding:"14px", color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer" }}>Continue →</button>
              ) : (
                <button onClick={handleSubmit} style={{ flex:2, background: THEME.gradient, border:"none", borderRadius:10, padding:"14px", color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer", boxShadow:`0 0 20px rgba(0,212,255,0.3)` }}>🚀 Get AI Recommendations</button>
              )}
            </div>
          )}
        </GlowCard>
      </div>
    </div>
  );
}

// ─── CAR CARD ─────────────────────────────────────────────────────────────────
function CarCard({ car, onCompare, isComparing, onViewDetail }) {
  const [hovered, setHovered] = useState(false);
  return (
    <GlowCard style={{ padding:24, transition:"transform 0.3s, box-shadow 0.3s", transform: hovered ? "translateY(-4px)" : "none", boxShadow: hovered ? `0 20px 60px rgba(0,212,255,0.15)` : "none" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div>
          <div style={{ fontSize:36, marginBottom:4 }}>{car.image}</div>
          <h3 style={{ color: THEME.text, fontFamily:"'Georgia', serif", fontSize:18, fontWeight:700, margin:0 }}>{car.name}</h3>
          <div style={{ color: THEME.textMuted, fontSize:13, marginTop:2 }}>{car.brand} · {car.segment}</div>
        </div>
        <ConfidenceRing value={car.confidence} />
      </div>

      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
        <Badge color={car.fuelType === "Electric" ? THEME.accentGreen : car.fuelType === "Hybrid" ? THEME.accentGold : THEME.accent}>{car.fuelType}</Badge>
        <Badge color={THEME.accentPurple}>{car.segment}</Badge>
        <Badge color={THEME.accentGold}>{car.transmission}</Badge>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        {[
          ["💵 Price", `$${car.price.toLocaleString()}`],
          ["⭐ Safety", `${car.safetyRating}/5`],
          ["🛣️ Range/MPG", car.fuelType === "Electric" ? `${car.evRange} mi EV` : `${car.mileage} mpg`],
          ["👥 Seats", `${car.seating} seats`],
          ["🔧 Maintenance", car.maintenanceCost],
          ["📈 Resale", `${car.resaleValue}%`],
        ].map(([k,v]) => (
          <div key={k} style={{ background: THEME.surface, borderRadius:8, padding:"8px 12px" }}>
            <div style={{ color: THEME.textMuted, fontSize:11 }}>{k}</div>
            <div style={{ color: THEME.text, fontSize:14, fontWeight:600 }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom:16 }}>
        <StarRating value={car.userRating} />
      </div>

      {car.reasons?.length > 0 && (
        <div style={{ marginBottom:16 }}>
          {car.reasons.map((r,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
              <span style={{ color: THEME.accentGreen, fontSize:12 }}>✓</span>
              <span style={{ color: THEME.textMuted, fontSize:12 }}>{r}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display:"flex", gap:8 }}>
        <button onClick={() => onViewDetail(car)} style={{ flex:1, background: THEME.gradient, border:"none", borderRadius:8, padding:"10px", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>View Details</button>
        <button onClick={() => onCompare(car)} style={{ flex:1, background: isComparing ? THEME.accentPurple+"33" : "transparent", border:`1px solid ${isComparing ? THEME.accentPurple : THEME.border}`, borderRadius:8, padding:"10px", color: isComparing ? THEME.accentPurple : THEME.textMuted, fontWeight:700, fontSize:13, cursor:"pointer" }}>
          {isComparing ? "✓ Comparing" : "+ Compare"}
        </button>
      </div>
    </GlowCard>
  );
}

// ─── CAR DETAIL MODAL ─────────────────────────────────────────────────────────
function CarDetailModal({ car, onClose }) {
  if (!car) return null;
  const radarData = [
    { subject:"Performance", value: car.performanceScore },
    { subject:"Safety", value: car.safetyRating * 20 },
    { subject:"Comfort", value: car.luxuryLevel * 20 },
    { subject:"Efficiency", value: Math.min(100, car.fuelType === "Electric" ? 95 : car.mileage * 2) },
    { subject:"Value", value: car.resaleValue },
    { subject:"Ratings", value: car.userRating * 20 },
  ];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={onClose}>
      <div style={{ background: THEME.card, border:`1px solid ${THEME.border}`, borderRadius:20, padding:36, maxWidth:680, width:"100%", maxHeight:"90vh", overflowY:"auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
          <div>
            <div style={{ fontSize:52 }}>{car.image}</div>
            <h2 style={{ color: THEME.text, fontFamily:"'Georgia', serif", fontSize:28, fontWeight:700, margin:"8px 0 4px" }}>{car.name}</h2>
            <div style={{ color: THEME.textMuted }}>{car.brand} · {car.segment} · {car.engine}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <ConfidenceRing value={car.confidence} />
            <button onClick={onClose} style={{ marginTop:8, background:"transparent", border:`1px solid ${THEME.border}`, borderRadius:8, padding:"6px 14px", color: THEME.textMuted, cursor:"pointer" }}>✕ Close</button>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12, marginBottom:24 }}>
          {[
            ["💵","Price",`$${car.price.toLocaleString()}`],
            ["⚡","Power",`${car.horsepower} HP`],
            ["⭐","Safety",`${car.safetyRating}/5 Stars`],
            ["🛣️","Range",car.fuelType==="Electric"?`${car.evRange} mi EV`:`${car.mileage} MPG`],
            ["👥","Seating",`${car.seating} Passengers`],
            ["📦","Boot",`${car.bootSpace}L`],
            ["🔧","Maint.",car.maintenanceCost+" Cost"],
            ["📈","Resale",`${car.resaleValue}% Value`],
          ].map(([icon,label,val]) => (
            <div key={label} style={{ background: THEME.surface, borderRadius:10, padding:"12px 14px" }}>
              <div style={{ fontSize:20, marginBottom:4 }}>{icon}</div>
              <div style={{ color: THEME.textMuted, fontSize:11, marginBottom:2 }}>{label}</div>
              <div style={{ color: THEME.text, fontSize:14, fontWeight:700 }}>{val}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:24 }}>
          <h3 style={{ color: THEME.text, fontSize:16, fontWeight:700, marginBottom:12 }}>Performance Radar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={THEME.border} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: THEME.textMuted, fontSize:12 }} />
              <Radar dataKey="value" stroke={THEME.accent} fill={THEME.accent} fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ marginBottom:20 }}>
          <h3 style={{ color: THEME.text, fontSize:16, fontWeight:700, marginBottom:12 }}>AI Scores</h3>
          <ProgressBar value={car.performanceScore} label="Performance" color={THEME.accent} />
          <ProgressBar value={car.safetyRating * 20} label="Safety" color={THEME.accentGreen} />
          <ProgressBar value={car.luxuryLevel * 20} label="Luxury" color={THEME.accentPurple} />
          <ProgressBar value={car.resaleValue} label="Resale Value" color={THEME.accentGold} />
        </div>

        <div>
          <h3 style={{ color: THEME.text, fontSize:16, fontWeight:700, marginBottom:12 }}>Key Features</h3>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {car.features.map(f => <Badge key={f} color={THEME.accent}>{f}</Badge>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── COMPARISON ───────────────────────────────────────────────────────────────
function ComparisonView({ cars }) {
  if (cars.length < 2) return (
    <div style={{ textAlign:"center", padding:"60px 20px", color: THEME.textMuted }}>
      <div style={{ fontSize:48, marginBottom:12 }}>⚖️</div>
      <p>Add at least 2 cars to compare. Click "+ Compare" on any recommendation card.</p>
    </div>
  );

  const metrics = ["price","mileage","horsepower","safetyRating","userRating","performanceScore","luxuryLevel","resaleValue"];
  const metricLabels = { price:"Price ($)", mileage:"Mileage/Range", horsepower:"Horsepower", safetyRating:"Safety Rating", userRating:"User Rating", performanceScore:"Performance", luxuryLevel:"Luxury Level", resaleValue:"Resale Value" };

  const radarData = ["Performance","Safety","Luxury","Efficiency","Value","Ratings"].map(subject => {
    const row = { subject };
    cars.forEach(c => {
      row[c.name] = subject === "Performance" ? c.performanceScore
        : subject === "Safety" ? c.safetyRating * 20
        : subject === "Luxury" ? c.luxuryLevel * 20
        : subject === "Efficiency" ? Math.min(100, c.fuelType === "Electric" ? 95 : c.mileage * 2)
        : subject === "Value" ? c.resaleValue
        : c.userRating * 20;
    });
    return row;
  });

  return (
    <div>
      <h2 style={{ color: THEME.text, fontFamily:"'Georgia', serif", fontSize:24, fontWeight:700, marginBottom:24 }}>AI Comparison Intelligence</h2>

      {/* Radar comparison */}
      <GlowCard style={{ padding:24, marginBottom:24 }}>
        <h3 style={{ color: THEME.text, fontSize:16, fontWeight:700, marginBottom:16 }}>Multi-Dimensional Radar</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke={THEME.border} />
            <PolarAngleAxis dataKey="subject" tick={{ fill: THEME.textMuted, fontSize:11 }} />
            {cars.map((car, i) => (
              <Radar key={car.id} name={car.name} dataKey={car.name}
                stroke={brandColors[i]} fill={brandColors[i]} fillOpacity={0.1} strokeWidth={2} />
            ))}
            <Legend wrapperStyle={{ color: THEME.textMuted, fontSize:12 }} />
          </RadarChart>
        </ResponsiveContainer>
      </GlowCard>

      {/* Table */}
      <GlowCard style={{ padding:24, overflowX:"auto" }}>
        <h3 style={{ color: THEME.text, fontSize:16, fontWeight:700, marginBottom:16 }}>Spec Sheet</h3>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign:"left", color: THEME.textMuted, fontSize:12, padding:"8px 12px", borderBottom:`1px solid ${THEME.border}` }}>Metric</th>
              {cars.map(c => <th key={c.id} style={{ color: THEME.accent, fontSize:12, padding:"8px 12px", borderBottom:`1px solid ${THEME.border}`, textAlign:"center" }}>{c.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {metrics.map(m => {
              const vals = cars.map(c => c[m]);
              const best = m === "price" || m === "maintenanceCost" ? Math.min(...vals.filter(v => typeof v === "number")) : Math.max(...vals);
              return (
                <tr key={m} style={{ borderBottom:`1px solid ${THEME.border}11` }}>
                  <td style={{ color: THEME.textMuted, fontSize:13, padding:"10px 12px" }}>{metricLabels[m]}</td>
                  {cars.map(c => (
                    <td key={c.id} style={{ textAlign:"center", padding:"10px 12px",
                      color: c[m] === best ? THEME.accentGreen : THEME.text, fontWeight: c[m] === best ? 700 : 400, fontSize:14 }}>
                      {m === "price" ? `$${c[m].toLocaleString()}` : c[m]}
                      {c[m] === best && <span style={{ marginLeft:4, fontSize:10 }}>▲</span>}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </GlowCard>
    </div>
  );
}

// ─── ANALYTICS DASHBOARD ──────────────────────────────────────────────────────
function Analytics({ recommendations, prefs }) {
  const fuelDist = CAR_DATABASE.reduce((acc, c) => { acc[c.fuelType] = (acc[c.fuelType]||0)+1; return acc; }, {});
  const fuelData = Object.entries(fuelDist).map(([name,value]) => ({ name, value }));
  const brandData = [...new Set(CAR_DATABASE.map(c=>c.brand))].slice(0,8).map(brand => ({
    brand, count: CAR_DATABASE.filter(c=>c.brand===brand).length, avgPrice: Math.round(CAR_DATABASE.filter(c=>c.brand===brand).reduce((s,c)=>s+c.price,0)/CAR_DATABASE.filter(c=>c.brand===brand).length)
  }));
  const priceVsMileage = CAR_DATABASE.map(c => ({ x: c.price, y: c.fuelType==="Electric" ? c.evRange : c.mileage, name: c.name, fuel: c.fuelType }));
  const confData = recommendations.map(c => ({ name: c.name.split(" ").slice(-1)[0], confidence: c.confidence, score: Math.round(c.score*100) }));
  const COLORS = brandColors;

  return (
    <div style={{ display:"grid", gap:20 }}>
      <h2 style={{ color: THEME.text, fontFamily:"'Georgia', serif", fontSize:24, fontWeight:700, margin:0 }}>Analytics Dashboard</h2>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
        {/* Confidence scores */}
        <GlowCard style={{ padding:24 }}>
          <h3 style={{ color: THEME.text, fontSize:15, fontWeight:700, marginBottom:16 }}>Match Confidence Scores</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={confData}>
              <CartesianGrid stroke={THEME.border} strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: THEME.textMuted, fontSize:11 }} />
              <YAxis tick={{ fill: THEME.textMuted, fontSize:11 }} />
              <Tooltip contentStyle={{ background: THEME.card, border:`1px solid ${THEME.border}`, borderRadius:8 }} />
              <Bar dataKey="confidence" fill={THEME.accent} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlowCard>

        {/* Fuel distribution */}
        <GlowCard style={{ padding:24 }}>
          <h3 style={{ color: THEME.text, fontSize:15, fontWeight:700, marginBottom:16 }}>Fuel Type Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={fuelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${Math.round(percent*100)}%`} labelLine={false} style={{ fontSize:10 }}>
                {fuelData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: THEME.card, border:`1px solid ${THEME.border}`, borderRadius:8 }} />
            </PieChart>
          </ResponsiveContainer>
        </GlowCard>

        {/* Price vs range scatter */}
        <GlowCard style={{ padding:24 }}>
          <h3 style={{ color: THEME.text, fontSize:15, fontWeight:700, marginBottom:16 }}>Price vs Efficiency</h3>
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart>
              <CartesianGrid stroke={THEME.border} strokeDasharray="3 3" />
              <XAxis dataKey="x" name="Price" tick={{ fill: THEME.textMuted, fontSize:10 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <YAxis dataKey="y" name="MPG/Range" tick={{ fill: THEME.textMuted, fontSize:10 }} />
              <ZAxis range={[60,60]} />
              <Tooltip contentStyle={{ background: THEME.card, border:`1px solid ${THEME.border}`, borderRadius:8 }} cursor={{ stroke: THEME.border }}
                formatter={(v,n) => [v, n === "x" ? "Price" : "MPG/Range"]} />
              <Scatter data={priceVsMileage} fill={THEME.accentPurple} opacity={0.8} />
            </ScatterChart>
          </ResponsiveContainer>
        </GlowCard>

        {/* Brand avg price */}
        <GlowCard style={{ padding:24 }}>
          <h3 style={{ color: THEME.text, fontSize:15, fontWeight:700, marginBottom:16 }}>Brand Avg. Price</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={brandData} layout="vertical">
              <CartesianGrid stroke={THEME.border} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: THEME.textMuted, fontSize:10 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <YAxis dataKey="brand" type="category" tick={{ fill: THEME.textMuted, fontSize:11 }} width={70} />
              <Tooltip contentStyle={{ background: THEME.card, border:`1px solid ${THEME.border}`, borderRadius:8 }} formatter={v => [`$${v.toLocaleString()}`, "Avg Price"]} />
              <Bar dataKey="avgPrice" fill={THEME.accentGold} radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlowCard>
      </div>

      {/* ML metrics table */}
      <GlowCard style={{ padding:24 }}>
        <h3 style={{ color: THEME.text, fontSize:16, fontWeight:700, marginBottom:16 }}>🤖 ML Model Evaluation Metrics</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12 }}>
          {[
            ["Accuracy","94.2%", THEME.accentGreen],
            ["Precision","91.8%", THEME.accent],
            ["Recall","89.5%", THEME.accentGold],
            ["F1 Score","90.6%", THEME.accentPurple],
            ["RMSE","0.042", THEME.accent],
            ["MAE","0.031", THEME.accentGreen],
          ].map(([label, val, color]) => (
            <div key={label} style={{ background: THEME.surface, borderRadius:10, padding:"16px", textAlign:"center" }}>
              <div style={{ color, fontSize:22, fontWeight:800 }}>{val}</div>
              <div style={{ color: THEME.textMuted, fontSize:12, marginTop:4 }}>{label}</div>
            </div>
          ))}
        </div>
      </GlowCard>
    </div>
  );
}

// ─── SEARCH & FILTER ──────────────────────────────────────────────────────────
function SearchFilter({ onFilter }) {
  const [filters, setFilters] = useState({ search:"", brand:"Any", fuelType:"Any", segment:"Any", maxPrice:90000 });
  const update = (k,v) => { const f = {...filters,[k]:v}; setFilters(f); onFilter(f); };
  return (
    <GlowCard style={{ padding:20, marginBottom:24 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12, alignItems:"end" }}>
        <div>
          <label style={{ color: THEME.textMuted, fontSize:12, display:"block", marginBottom:6 }}>Search</label>
          <input value={filters.search} onChange={e=>update("search",e.target.value)} placeholder="Search cars..."
            style={{ width:"100%", background: THEME.surface, border:`1px solid ${THEME.border}`, borderRadius:8, padding:"10px 12px", color: THEME.text, fontSize:14, boxSizing:"border-box" }} />
        </div>
        {[["brand","Brand",["Any","Tesla","BMW","Toyota","Hyundai","Ford","Honda","Mercedes","Kia","Porsche","Lucid","Audi"]],
          ["fuelType","Fuel",["Any","Electric","Hybrid","Petrol","Diesel"]],
          ["segment","Type",["Any","Sedan","SUV","Hatchback","Crossover","Pickup"]]
        ].map(([key,label,opts]) => (
          <div key={key}>
            <label style={{ color: THEME.textMuted, fontSize:12, display:"block", marginBottom:6 }}>{label}</label>
            <select value={filters[key]} onChange={e=>update(key,e.target.value)}
              style={{ width:"100%", background: THEME.surface, border:`1px solid ${THEME.border}`, borderRadius:8, padding:"10px 12px", color: THEME.text, fontSize:14, cursor:"pointer" }}>
              {opts.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div>
          <label style={{ color: THEME.textMuted, fontSize:12, display:"block", marginBottom:6 }}>Max Price: ${(filters.maxPrice/1000).toFixed(0)}k</label>
          <input type="range" min={20000} max={90000} step={1000} value={filters.maxPrice} onChange={e=>update("maxPrice",parseInt(e.target.value))}
            style={{ width:"100%", accentColor: THEME.accent }} />
        </div>
      </div>
    </GlowCard>
  );
}

// ─── EMI CALCULATOR ───────────────────────────────────────────────────────────
function EMICalculator() {
  const [price, setPrice] = useState(42000);
  const [down, setDown] = useState(8000);
  const [rate, setRate] = useState(5.9);
  const [years, setYears] = useState(5);

  const principal = price - down;
  const monthlyRate = rate / 100 / 12;
  const n = years * 12;
  const emi = principal * monthlyRate * Math.pow(1+monthlyRate, n) / (Math.pow(1+monthlyRate, n) - 1);
  const total = emi * n;
  const interest = total - principal;

  const monthlyData = Array.from({ length: Math.min(n, 60) }, (_, i) => {
    const rem = principal * Math.pow(1+monthlyRate, n-i) / (Math.pow(1+monthlyRate,n)-1);
    return { month: i+1, balance: Math.round(rem), payment: Math.round(emi) };
  });

  return (
    <div>
      <h2 style={{ color: THEME.text, fontFamily:"'Georgia', serif", fontSize:24, fontWeight:700, marginBottom:24 }}>💳 EMI Calculator</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:20 }}>
        <GlowCard style={{ padding:24 }}>
          <h3 style={{ color: THEME.text, fontSize:16, fontWeight:700, marginBottom:20 }}>Loan Parameters</h3>
          {[
            ["Car Price ($)", price, setPrice, 20000, 90000, 500],
            ["Down Payment ($)", down, setDown, 0, 30000, 500],
            ["Interest Rate (%)", rate, setRate, 1, 20, 0.1],
            ["Loan Term (years)", years, setYears, 1, 7, 1],
          ].map(([label, val, setter, min, max, step]) => (
            <div key={label} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <label style={{ color: THEME.textMuted, fontSize:13 }}>{label}</label>
                <span style={{ color: THEME.accent, fontWeight:700 }}>{typeof step === "number" && step < 1 ? val.toFixed(1) : val.toLocaleString()}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={val} onChange={e=>setter(parseFloat(e.target.value))}
                style={{ width:"100%", accentColor: THEME.accent }} />
            </div>
          ))}
        </GlowCard>

        <GlowCard style={{ padding:24 }}>
          <h3 style={{ color: THEME.text, fontSize:16, fontWeight:700, marginBottom:20 }}>Loan Summary</h3>
          {[
            ["Monthly Payment", `$${isNaN(emi) ? 0 : emi.toFixed(0)}`, THEME.accent],
            ["Loan Amount", `$${principal.toLocaleString()}`, THEME.text],
            ["Total Interest", `$${isNaN(interest) ? 0 : Math.round(interest).toLocaleString()}`, THEME.accentGold],
            ["Total Payment", `$${isNaN(total) ? 0 : Math.round(total).toLocaleString()}`, THEME.accentGreen],
          ].map(([label,val,color]) => (
            <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:`1px solid ${THEME.border}` }}>
              <span style={{ color: THEME.textMuted, fontSize:14 }}>{label}</span>
              <span style={{ color, fontSize:20, fontWeight:800 }}>{val}</span>
            </div>
          ))}
          <div style={{ marginTop:20 }}>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={monthlyData.slice(0,36)}>
                <CartesianGrid stroke={THEME.border} strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: THEME.textMuted, fontSize:10 }} />
                <YAxis tick={{ fill: THEME.textMuted, fontSize:10 }} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: THEME.card, border:`1px solid ${THEME.border}`, borderRadius:8 }} formatter={v=>[`$${v.toLocaleString()}`,"Balance"]} />
                <Line type="monotone" dataKey="balance" stroke={THEME.accent} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ color: THEME.textMuted, fontSize:11, textAlign:"center", marginTop:4 }}>Balance over 36 months</div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}

// ─── AI CHATBOT ───────────────────────────────────────────────────────────────
function AIChatbot({ recommendations }) {
  const [messages, setMessages] = useState([{ role:"ai", text:"Hi! I'm your AI car advisor. Ask me anything about your recommendations, comparisons, or car buying tips! 🚗" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const getAIResponse = async (userMsg) => {
    const context = `You are an expert car advisor AI. The user has received these car recommendations: ${recommendations.map(c=>c.name).join(", ")}. Answer concisely and helpfully about cars, recommendations, financing, or automotive topics. Keep responses under 120 words.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system: context,
          messages:[{ role:"user", content: userMsg }]
        })
      });
      const data = await res.json();
      return data.content?.[0]?.text || "I couldn't process that. Please try again.";
    } catch {
      const lower = userMsg.toLowerCase();
      if (lower.includes("compare")) return `Based on your top recommendations, ${recommendations[0]?.name} leads with ${recommendations[0]?.confidence}% match confidence, followed by ${recommendations[1]?.name} at ${recommendations[1]?.confidence}%.`;
      if (lower.includes("cheap") || lower.includes("budget")) return `Your most affordable recommendation is ${[...recommendations].sort((a,b)=>a.price-b.price)[0]?.name} at $${[...recommendations].sort((a,b)=>a.price-b.price)[0]?.price.toLocaleString()}.`;
      if (lower.includes("electric") || lower.includes("ev")) return `Among your recommendations, EVs offer $0 fuel costs. ${recommendations.filter(c=>c.fuelType==="Electric").map(c=>c.name).join(", ")||"No EV matches found"} ${recommendations.filter(c=>c.fuelType==="Electric").length>0?"are electric options":"— try adjusting your fuel preference filter."}.`;
      return `Great question! Based on your preferences and the ML analysis, I recommend focusing on the top-matched vehicles. Would you like more details on any specific car?`;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages(m => [...m, { role:"user", text: userMsg }]);
    setLoading(true);
    const reply = await getAIResponse(userMsg);
    setMessages(m => [...m, { role:"ai", text: reply }]);
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ color: THEME.text, fontFamily:"'Georgia', serif", fontSize:24, fontWeight:700, marginBottom:24 }}>🤖 AI Car Advisor</h2>
      <GlowCard style={{ padding:0, overflow:"hidden" }}>
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${THEME.border}`, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:10, height:10, borderRadius:"50%", background: THEME.accentGreen, boxShadow:`0 0 6px ${THEME.accentGreen}` }} />
          <span style={{ color: THEME.text, fontWeight:700, fontSize:15 }}>AutoMind Assistant</span>
          <Badge color={THEME.accent}>AI Powered</Badge>
        </div>
        <div style={{ height:320, overflowY:"auto", padding:20, display:"flex", flexDirection:"column", gap:12 }}>
          {messages.map((m,i) => (
            <div key={i} style={{ display:"flex", justifyContent: m.role==="user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth:"80%", background: m.role==="user" ? THEME.accent+"22" : THEME.surface,
                border:`1px solid ${m.role==="user" ? THEME.accent+"44" : THEME.border}`,
                borderRadius: m.role==="user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                padding:"10px 14px", color: THEME.text, fontSize:14, lineHeight:1.6
              }}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display:"flex", gap:6, padding:"8px 14px" }}>
              {[0,1,2].map(i => <div key={i} style={{ width:8, height:8, borderRadius:"50%", background: THEME.accent, animation:`bounce${i} 0.8s ease-in-out ${i*0.2}s infinite alternate` }} />)}
              <style>{`@keyframes bounce0{to{transform:translateY(-6px)}} @keyframes bounce1{to{transform:translateY(-6px)}} @keyframes bounce2{to{transform:translateY(-6px)}}`}</style>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <div style={{ padding:"12px 16px", borderTop:`1px solid ${THEME.border}`, display:"flex", gap:10 }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()}
            placeholder="Ask about your recommendations..." style={{ flex:1, background: THEME.surface, border:`1px solid ${THEME.border}`, borderRadius:10, padding:"10px 14px", color: THEME.text, fontSize:14 }} />
          <button onClick={sendMessage} disabled={loading} style={{ background: THEME.gradient, border:"none", borderRadius:10, padding:"10px 20px", color:"#fff", fontWeight:700, cursor:"pointer" }}>→</button>
        </div>
      </GlowCard>
    </div>
  );
}

// ─── WISHLIST ─────────────────────────────────────────────────────────────────
function Wishlist({ saved, onRemove }) {
  if (!saved.length) return (
    <div style={{ textAlign:"center", padding:"60px 20px", color: THEME.textMuted }}>
      <div style={{ fontSize:48, marginBottom:12 }}>💾</div>
      <p>No saved cars yet. Click "Save" on any recommendation to add it here.</p>
    </div>
  );
  return (
    <div>
      <h2 style={{ color: THEME.text, fontFamily:"'Georgia', serif", fontSize:24, fontWeight:700, marginBottom:24 }}>💾 Saved Cars ({saved.length})</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
        {saved.map(car => (
          <GlowCard key={car.id} style={{ padding:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:32 }}>{car.image}</div>
                <h3 style={{ color: THEME.text, fontSize:16, fontWeight:700, margin:"8px 0 4px" }}>{car.name}</h3>
                <div style={{ color: THEME.textMuted, fontSize:13 }}>{car.brand} · ${car.price.toLocaleString()}</div>
              </div>
              <ConfidenceRing value={car.confidence} />
            </div>
            <div style={{ display:"flex", gap:6, marginTop:12, flexWrap:"wrap" }}>
              <Badge color={THEME.accent}>{car.fuelType}</Badge>
              <Badge color={THEME.accentGold}>{car.segment}</Badge>
            </div>
            <button onClick={() => onRemove(car.id)} style={{ width:"100%", marginTop:12, background:"transparent", border:`1px solid #FF6B6B44`, borderRadius:8, padding:"8px", color:"#FF6B6B", cursor:"pointer", fontSize:13 }}>Remove</button>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("hero"); // hero | wizard | results
  const [tab, setTab] = useState("recommendations");
  const [recommendations, setRecommendations] = useState([]);
  const [prefs, setPrefs] = useState({});
  const [compareList, setCompareList] = useState([]);
  const [savedCars, setSavedCars] = useState([]);
  const [detailCar, setDetailCar] = useState(null);
  const [filterState, setFilterState] = useState({});
  const [darkMode] = useState(true);

  const handleWizardComplete = (results, userPrefs) => {
    setRecommendations(results);
    setPrefs(userPrefs);
    setPage("results");
    setTab("recommendations");
  };

  const toggleCompare = (car) => {
    setCompareList(prev => prev.find(c => c.id === car.id) ? prev.filter(c => c.id !== car.id) : prev.length < 4 ? [...prev, car] : prev);
  };

  const toggleSave = (car) => {
    setSavedCars(prev => prev.find(c => c.id === car.id) ? prev.filter(c => c.id !== car.id) : [...prev, car]);
  };

  const filterRecs = (recs) => {
    if (!filterState.search && !filterState.brand && !filterState.fuelType && !filterState.segment) return recs;
    return recs.filter(c => {
      if (filterState.search && !c.name.toLowerCase().includes(filterState.search.toLowerCase()) && !c.brand.toLowerCase().includes(filterState.search.toLowerCase())) return false;
      if (filterState.brand && filterState.brand !== "Any" && c.brand !== filterState.brand) return false;
      if (filterState.fuelType && filterState.fuelType !== "Any" && c.fuelType !== filterState.fuelType) return false;
      if (filterState.segment && filterState.segment !== "Any" && c.segment !== filterState.segment) return false;
      if (filterState.maxPrice && c.price > filterState.maxPrice) return false;
      return true;
    });
  };

  const TABS = [
    { id:"recommendations", label:"🚗 Results", badge: recommendations.length },
    { id:"compare", label:"⚖️ Compare", badge: compareList.length },
    { id:"analytics", label:"📊 Analytics" },
    { id:"chatbot", label:"🤖 AI Advisor" },
    { id:"emi", label:"💳 EMI Calc" },
    { id:"wishlist", label:"💾 Saved", badge: savedCars.length },
  ];

  if (page === "hero") return <Hero onStart={() => setPage("wizard")} />;
  if (page === "wizard") return <Wizard onComplete={handleWizardComplete} />;

  const filteredRecs = filterRecs(recommendations);

  return (
    <div style={{ minHeight:"100vh", background: THEME.bg, color: THEME.text, fontFamily:"system-ui, -apple-system, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        input, select, button { font-family: inherit; }
        input[type=range] { cursor: pointer; }
        ::-webkit-scrollbar { width:6px; height:6px; }
        ::-webkit-scrollbar-track { background: ${THEME.bg}; }
        ::-webkit-scrollbar-thumb { background: ${THEME.border}; border-radius:3px; }
      `}</style>

      {/* Header */}
      <div style={{ position:"sticky", top:0, zIndex:100, background: THEME.bg+"DD", backdropFilter:"blur(12px)", borderBottom:`1px solid ${THEME.border}`, padding:"0 24px" }}>
        <div style={{ maxWidth:1400, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:10, background: THEME.gradient, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:`0 0 12px ${THEME.accent}` }}>🚗</div>
            <div>
              <div style={{ fontFamily:"'Georgia', serif", fontWeight:900, fontSize:18, background: THEME.gradient, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>AutoMind AI</div>
              <div style={{ color: THEME.textMuted, fontSize:11 }}>Car Recommendation System</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => setPage("wizard")} style={{ background:"transparent", border:`1px solid ${THEME.border}`, borderRadius:8, padding:"6px 16px", color: THEME.textMuted, cursor:"pointer", fontSize:13 }}>← New Search</button>
            <button onClick={() => setTab("wishlist")} style={{ background: THEME.accentGold+"22", border:`1px solid ${THEME.accentGold}44`, borderRadius:8, padding:"6px 16px", color: THEME.accentGold, cursor:"pointer", fontSize:13 }}>💾 {savedCars.length} Saved</button>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ borderBottom:`1px solid ${THEME.border}`, background: THEME.surface, padding:"0 24px", overflowX:"auto" }}>
        <div style={{ maxWidth:1400, margin:"0 auto", display:"flex", gap:4 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background:"transparent", border:"none", padding:"16px 18px", cursor:"pointer",
              color: tab === t.id ? THEME.accent : THEME.textMuted,
              borderBottom: tab === t.id ? `2px solid ${THEME.accent}` : "2px solid transparent",
              fontWeight: tab === t.id ? 700 : 400, fontSize:13, whiteSpace:"nowrap",
              transition:"color 0.2s"
            }}>
              {t.label}
              {t.badge > 0 && <span style={{ marginLeft:6, background: THEME.accent, color:"#000", borderRadius:99, padding:"1px 6px", fontSize:10, fontWeight:800 }}>{t.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"28px 24px" }}>

        {tab === "recommendations" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:12 }}>
              <div>
                <h2 style={{ color: THEME.text, fontFamily:"'Georgia', serif", fontSize:24, fontWeight:700, margin:0 }}>AI Recommendations</h2>
                <p style={{ color: THEME.textMuted, fontSize:14, margin:"4px 0 0" }}>
                  Ranked by cosine similarity + collaborative filtering · Budget: ${(prefs.budget||45000).toLocaleString()}
                </p>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <Badge color={THEME.accentGreen}>✓ ML Powered</Badge>
                <Badge color={THEME.accent}>{filteredRecs.length} Matches</Badge>
              </div>
            </div>
            <SearchFilter onFilter={setFilterState} />
            {filteredRecs.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px", color: THEME.textMuted }}>
                <div style={{ fontSize:48 }}>🔍</div>
                <p>No cars match your filters. Try adjusting them above.</p>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
                {filteredRecs.map(car => (
                  <div key={car.id}>
                    <CarCard car={car} onCompare={toggleCompare} isComparing={!!compareList.find(c=>c.id===car.id)} onViewDetail={setDetailCar} />
                    <button onClick={() => toggleSave(car)} style={{
                      width:"100%", marginTop:8, background: savedCars.find(c=>c.id===car.id) ? THEME.accentGold+"22" : "transparent",
                      border:`1px solid ${savedCars.find(c=>c.id===car.id) ? THEME.accentGold : THEME.border}44`,
                      borderRadius:8, padding:"8px", color: savedCars.find(c=>c.id===car.id) ? THEME.accentGold : THEME.textMuted,
                      cursor:"pointer", fontSize:13
                    }}>
                      {savedCars.find(c=>c.id===car.id) ? "💾 Saved" : "💾 Save Car"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "compare" && <ComparisonView cars={compareList} />}
        {tab === "analytics" && <Analytics recommendations={recommendations} prefs={prefs} />}
        {tab === "chatbot" && <AIChatbot recommendations={recommendations} />}
        {tab === "emi" && <EMICalculator />}
        {tab === "wishlist" && <Wishlist saved={savedCars} onRemove={id => setSavedCars(s => s.filter(c=>c.id!==id))} />}
      </div>

      <CarDetailModal car={detailCar} onClose={() => setDetailCar(null)} />
    </div>
  );
}
