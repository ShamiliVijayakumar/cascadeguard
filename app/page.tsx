'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  BarChart3,
  Bell,
  ChevronDown,
  CloudRain,
  Droplets,
  Factory,
  Gauge,
  Globe2,
  Layers3,
  MapPin,
  Menu,
  Mountain,
  PackageCheck,
  Radio,
  Settings2,
  ShieldAlert,
  Siren,
  SlidersHorizontal,
  Truck,
  Users,
  Waves,
  Wind,
  X,
  Zap,
} from 'lucide-react'

const initialInputs = {
  rainfall: 184,
  river: 4.8,
  soil: 72,
  slope: 28,
  elevation: 412,
  temperature: 23,
  density: 1260,
  distance: 1.2,
  roads: 64,
  infrastructure: 71,
}

const zones = [
  { name: 'Zone A', label: 'Riverside', lat: '14.612° N', lon: '75.019° E', population: '18,420', risk: 89, vulnerability: 82, priority: 94, color: 'high', x: 19, y: 50 },
  { name: 'Zone B', label: 'North Ridge', lat: '14.642° N', lon: '75.047° E', population: '9,870', risk: 74, vulnerability: 66, priority: 78, color: 'medium', x: 53, y: 23 },
  { name: 'Zone C', label: 'East Junction', lat: '14.588° N', lon: '75.071° E', population: '12,610', risk: 68, vulnerability: 71, priority: 76, color: 'medium', x: 78, y: 55 },
  { name: 'Zone D', label: 'Old Market', lat: '14.570° N', lon: '74.989° E', population: '7,240', risk: 41, vulnerability: 48, priority: 46, color: 'low', x: 45, y: 73 },
  { name: 'Zone E', label: 'South Fields', lat: '14.548° N', lon: '75.034° E', population: '5,980', risk: 32, vulnerability: 38, priority: 35, color: 'low', x: 69, y: 84 },
]

const initialRisks = { flood: 82, landslide: 67, power: 54, water: 71 }

type RiskKey = keyof typeof initialRisks

function riskTone(value: number) {
  if (value >= 75) return 'critical'
  if (value >= 50) return 'elevated'
  return 'stable'
}

function MetricCard({ label, value, unit, icon: Icon, tone, detail }: { label: string; value: string; unit?: string; icon: typeof CloudRain; tone?: string; detail: string }) {
  return (
    <div className="metric-card">
      <div className="metric-topline"><span>{label}</span><Icon size={16} /></div>
      <div className="metric-value">{value}<small>{unit}</small></div>
      <div className={`metric-detail ${tone ?? ''}`}><span className="metric-dot" />{detail}</div>
    </div>
  )
}

function RiskBar({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Waves }) {
  return <div className="risk-row">
    <div className="risk-label"><Icon size={15} /><span>{label}</span><strong>{value}%</strong></div>
    <div className="risk-track"><div className={`risk-fill ${riskTone(value)}`} style={{ width: `${value}%` }} /></div>
  </div>
}

function MapPanel({ selected, onSelect }: { selected: string; onSelect: (name: string) => void }) {
  return <div className="map-panel">
    <div className="map-grid" aria-hidden="true" />
    <svg className="map-river" viewBox="0 0 600 330" preserveAspectRatio="none" aria-hidden="true"><path d="M80 0 C150 65 92 105 180 142 S250 220 198 330" fill="none" stroke="rgba(48,182,205,.35)" strokeWidth="26" /><path d="M80 0 C150 65 92 105 180 142 S250 220 198 330" fill="none" stroke="rgba(96,220,229,.48)" strokeWidth="2" /></svg>
    <div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" />
    {zones.map((zone) => <button aria-label={`Select ${zone.name}`} key={zone.name} onClick={() => onSelect(zone.name)} className={`map-marker ${zone.color} ${selected === zone.name ? 'selected' : ''}`} style={{ left: `${zone.x}%`, top: `${zone.y}%` }}><span>{zone.name.replace('Zone ', '')}</span></button>)}
    <div className="map-label river-label"><Droplets size={12} /> Kaveri basin</div>
    <div className="map-legend"><span><i className="legend-dot high" />High risk</span><span><i className="legend-dot medium" />Elevated</span><span><i className="legend-dot low" />Stable</span></div>
    <div className="map-controls"><button aria-label="Zoom in">+</button><button aria-label="Zoom out">−</button></div>
  </div>
}

export default function Page() {
  const [inputs, setInputs] = useState(initialInputs)
  const [risks, setRisks] = useState(initialRisks)
  const [selected, setSelected] = useState('Zone A')
  const [activeNav, setActiveNav] = useState('Overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [running, setRunning] = useState(false)
  const [lastRun, setLastRun] = useState('Today, 14:32:08')

  const overall = Math.round((risks.flood * .36 + risks.landslide * .24 + risks.power * .18 + risks.water * .22))
  const vulnerable = useMemo(() => (18420 + 9870 + 12610 + 7240 + 5980).toLocaleString(), [])
  const selectedZone = zones.find((zone) => zone.name === selected) ?? zones[0]

  function updateInput(key: keyof typeof inputs, value: string) {
    setInputs((current) => ({ ...current, [key]: Number(value) }))
  }

  function runSimulation() {
    setRunning(true)
    window.setTimeout(() => {
      const rainfallDelta = (inputs.rainfall - 160) / 8
      const riverDelta = (inputs.river - 4) * 7
      setRisks({
        flood: Math.max(12, Math.min(98, Math.round(76 + rainfallDelta + riverDelta))),
        landslide: Math.max(8, Math.min(96, Math.round(53 + rainfallDelta * .65 + inputs.slope * .35 + inputs.soil * .08))),
        power: Math.max(8, Math.min(94, Math.round(38 + rainfallDelta * .45 + riverDelta * .55))),
        water: Math.max(10, Math.min(97, Math.round(57 + rainfallDelta * .6 + riverDelta * .5))),
      })
      setRunning(false)
      setLastRun('Just now')
    }, 600)
  }

  const navItems = [
    { label: 'Overview', icon: Gauge }, { label: 'Risk zones', icon: MapPin }, { label: 'Resources', icon: PackageCheck }, { label: 'Cascade model', icon: Layers3 }, { label: 'Reports', icon: BarChart3 },
  ]

  return <main className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><ShieldAlert size={19} /></div><div><strong>Cascade<span>Guard</span></strong><small>AI RESPONSE SYSTEM</small></div><button className="mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={18} /></button></div>
      <div className="system-status"><span className="pulse" /> SYSTEM OPERATIONAL <span className="status-time">LIVE</span></div>
      <nav>{navItems.map(({ label, icon: Icon }) => <button key={label} onClick={() => { setActiveNav(label); setSidebarOpen(false) }} className={activeNav === label ? 'active' : ''}><Icon size={17} />{label}{label === 'Risk zones' && <span className="nav-count">5</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-caption">SIMULATION MODE</div><div className="demo-note"><Radio size={15} /><span><b>Demo environment</b><small>Predictions use synthetic data</small></span></div><button className="settings"><Settings2 size={16} /> System settings</button></div>
    </aside>
    <section className="content">
      <header className="topbar"><button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu /></button><div className="breadcrumb"><span>Operations center</span><ChevronDown size={14} /><b>{activeNav}</b></div><div className="topbar-actions"><div className="last-updated"><span className="live-dot" /> Live data <small>{lastRun}</small></div><button className="icon-button" aria-label="Notifications"><Bell size={18} /><i /></button><div className="operator"><div className="avatar">RS</div><span><b>Response desk</b><small>Operator</small></span><ChevronDown size={15} /></div></div></header>
      <div className="page-content">
        <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> DECISION SUPPORT / DISTRICT 07</div><h1>Disaster cascade <em>monitor</em></h1><p>Predict cascading impacts and direct emergency response where it matters most.</p></div><div className="heading-actions"><button className="outline-button"><SlidersHorizontal size={15} /> Configure view</button><button className="primary-button" onClick={runSimulation}><Activity size={16} /> {running ? 'Running model...' : 'Run simulation'}</button></div></div>
        <div className="prototype-banner"><AlertTriangle size={16} /><span><b>Simulation prototype</b> — predictions are for demonstration and decision-support purposes only.</span><button aria-label="Dismiss notice">×</button></div>
        <section className="metrics-grid"><MetricCard label="Rainfall intensity" value={String(inputs.rainfall)} unit="mm" icon={CloudRain} detail="Above seasonal threshold" tone="critical" /><MetricCard label="River level" value={inputs.river.toFixed(1)} unit="m" icon={Waves} detail="Rising · +0.8m / 3h" tone="critical" /><MetricCard label="Overall disaster risk" value={`${overall}%`} icon={ShieldAlert} detail={overall > 70 ? 'Critical response posture' : 'Elevated posture'} tone="critical" /><MetricCard label="People at risk" value={vulnerable} icon={Users} detail="Across 5 monitored zones" tone="elevated" /><MetricCard label="High-risk zones" value="2" icon={MapPin} detail="Priority intervention needed" tone="critical" /> </section>
        <div className="dashboard-grid">
          <section className="panel cascade-panel"><div className="panel-header"><div><div className="section-kicker">01 / CASCADE ENGINE</div><h2>Predicted disaster chain</h2><p>How the current event is expected to propagate</p></div><span className="confidence"><span className="live-dot" /> Model confidence <b>91%</b></span></div><div className="cascade-flow"><div className="cascade-node origin"><div className="node-icon"><CloudRain size={20} /></div><span className="node-step">PRIMARY EVENT</span><strong>Extreme rainfall</strong><small>{inputs.rainfall} mm / 24 hours</small></div><ArrowDown className="flow-arrow" size={18} /><div className={`cascade-node ${riskTone(risks.flood)}`}><div className="node-icon"><Waves size={20} /></div><span className="node-step">CASCADE 01</span><strong>Flooding</strong><small><b>{risks.flood}%</b> probability</small></div><ArrowDown className="flow-arrow" size={18} /><div className={`cascade-node ${riskTone(risks.landslide)}`}><div className="node-icon"><Mountain size={20} /></div><span className="node-step">CASCADE 02</span><strong>Landslide</strong><small><b>{risks.landslide}%</b> probability</small></div><ArrowDown className="flow-arrow" size={18} /><div className={`cascade-node ${riskTone(risks.power)}`}><div className="node-icon"><Zap size={20} /></div><span className="node-step">CASCADE 03</span><strong>Power failure</strong><small><b>{risks.power}%</b> probability</small></div><ArrowDown className="flow-arrow" size={18} /><div className={`cascade-node ${riskTone(risks.water)}`}><div className="node-icon"><Droplets size={20} /></div><span className="node-step">CASCADE 04</span><strong>Water contamination</strong><small><b>{risks.water}%</b> probability</small></div></div><div className="cascade-insight"><Siren size={17} /><span><b>Model insight</b> — high soil moisture and river levels are creating a strong flood-to-contamination dependency.</span><ArrowRight size={16} /></div></section>
          <section className="panel risk-panel"><div className="panel-header"><div><div className="section-kicker">02 / RISK PROFILE</div><h2>Probability by hazard</h2></div><button className="more-button">View model <ArrowRight size={15} /></button></div><div className="risk-bars"><RiskBar label="Flooding" value={risks.flood} icon={Waves} /><RiskBar label="Landslide" value={risks.landslide} icon={Mountain} /><RiskBar label="Power failure" value={risks.power} icon={Zap} /><RiskBar label="Water contamination" value={risks.water} icon={Droplets} /></div><div className="risk-footer"><span><i className="legend-dot high" /> Critical &gt;75%</span><span><i className="legend-dot medium" /> Elevated 50–75%</span><span><i className="legend-dot low" /> Stable &lt;50%</span></div></section>
        </div>
        <div className="dashboard-grid lower-grid">
          <section className="panel map-section"><div className="panel-header"><div><div className="section-kicker">03 / GEOSPATIAL RISK</div><h2>Monitored risk zones</h2><p>Click a zone to inspect vulnerability and response priority</p></div><button className="outline-button small"><Globe2 size={15} /> Full map</button></div><div className="map-wrap"><MapPanel selected={selected} onSelect={setSelected} /><div className="zone-detail"><div className="zone-detail-title"><div><span className={`zone-badge ${selectedZone.color}`}>{selectedZone.color === 'high' ? 'CRITICAL' : selectedZone.color === 'medium' ? 'ELEVATED' : 'STABLE'}</span><h3>{selectedZone.name} <small>{selectedZone.label}</small></h3></div><MapPin size={17} /></div><div className="zone-location">{selectedZone.lat} · {selectedZone.lon}</div><div className="zone-stat-grid"><div><span>Population</span><b>{selectedZone.population}</b></div><div><span>Risk index</span><b className="red-text">{selectedZone.risk}%</b></div><div><span>Vulnerability</span><b>{selectedZone.vulnerability}%</b></div><div><span>Priority score</span><b className="orange-text">{selectedZone.priority}</b></div></div><div className="priority-meter"><div><span>Emergency priority</span><b>{selectedZone.priority} / 100</b></div><div className="meter-track"><div style={{ width: `${selectedZone.priority}%` }} /></div></div><button className="zone-action">Allocate resources <ArrowRight size={15} /></button></div></div></section>
          <section className="panel input-panel"><div className="panel-header"><div><div className="section-kicker">04 / INPUT SIMULATION</div><h2>Environmental conditions</h2><p>Adjust inputs and re-run the cascade model</p></div><CloudRain size={18} className="panel-icon" /></div><div className="input-grid">{([['rainfall','Rainfall','mm'],['river','River level','m'],['soil','Soil moisture','%'],['slope','Slope angle','°'],['elevation','Elevation','m'],['temperature','Temperature','°C'],['density','Population density','/km²'],['distance','Distance from river','km'],['roads','Road accessibility','%'],['infrastructure','Infrastructure density','%']] as const).map(([key, label, unit]) => <label key={key}><span>{label}</span><div className="input-wrap"><input type="number" value={inputs[key]} onChange={(event) => updateInput(key, event.target.value)} /><small>{unit}</small></div></label>)}</div><button className="simulate-button" onClick={runSimulation}><Activity size={16} /> {running ? 'Calculating cascade...' : 'Run disaster simulation'}<span>⌘ ↵</span></button></section>
        </div>
        <div className="dashboard-grid bottom-grid"><section className="panel allocation-panel"><div className="panel-header"><div><div className="section-kicker">05 / RESPONSE OPTIMISATION</div><h2>Resource allocation</h2><p>Priority-weighted distribution across monitored zones</p></div><span className="optimized-badge"><PackageCheck size={14} /> OPTIMISED</span></div><div className="allocation-table"><div className="allocation-row table-head"><span>Zone</span><span>Priority</span><span>Teams</span><span>Ambulances</span><span>Water units</span><span>Food kits</span></div>{zones.slice(0, 4).map((zone, index) => <div className="allocation-row" key={zone.name}><span><i className={`table-dot ${zone.color}`} /> <b>{zone.name}</b><small>{zone.label}</small></span><strong className={zone.priority > 80 ? 'red-text' : ''}>{zone.priority}</strong><span><Truck size={13} /> {index === 0 ? 2 : 1}</span><span><Siren size={13} /> 1</span><span>{index === 0 ? 50 : index === 1 ? 30 : 20}</span><span>{index === 0 ? 40 : index === 1 ? 25 : 15}</span></div>)}</div><div className="allocation-footer"><span><PackageCheck size={15} /> 74% of available resources deployed</span><button className="more-button">View all zones <ArrowRight size={15} /></button></div></section><section className="panel damage-panel"><div className="panel-header"><div><div className="section-kicker">06 / IMPACT OUTLOOK</div><h2>Damage estimation</h2></div><span className="trend-up">↓ 28% after optimisation</span></div><div className="damage-stats"><div><span>Population affected</span><strong>11,840</strong><small>people</small></div><div><span>Infrastructure exposure</span><strong>₹8.4Cr</strong><small>estimated</small></div><div><span>Response efficiency</span><strong className="cyan-text">+42%</strong><small>vs. baseline</small></div></div><div className="comparison"><div className="comparison-head"><span>Potential impact</span><span>Before <i /> After</span></div><div className="compare-row"><span>Damage severity</span><div className="compare-bars"><i className="before" style={{ width: '82%' }} /><i className="after" style={{ width: '58%' }} /></div><b>−29%</b></div><div className="compare-row"><span>Response delay</span><div className="compare-bars"><i className="before" style={{ width: '76%' }} /><i className="after" style={{ width: '43%' }} /></div><b>−43%</b></div></div></section></div>
        <footer className="page-footer"><span><ShieldAlert size={14} /> CascadeGuard AI · Decision support prototype</span><span>Model v0.8.4 · Synthetic data · Last trained 24 Oct 2026</span></footer>
      </div>
    </section>
  </main>
}
