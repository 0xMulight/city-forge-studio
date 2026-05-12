import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Html, OrbitControls, Stars } from '@react-three/drei';

const availableModules = [
  modulePreset('solar-crown', '光伏冠层', 'S', 42, -28, 34, 12, 'from-cyan-300 to-sky-500', '#22d3ee', 'solar'),
  modulePreset('habitat-ring', '居住环舱', 'H', 58, 18, 12, 28, 'from-blue-300 to-indigo-500', '#60a5fa', 'habitat'),
  modulePreset('green-core', '生态核心', 'E', 50, 8, 46, 18, 'from-emerald-300 to-teal-500', '#34d399', 'eco'),
  modulePreset('transit-node', '交通节点', 'T', 36, 12, 8, 22, 'from-violet-300 to-fuchsia-500', '#c084fc', 'transit'),
  modulePreset('support-frame', '承重框架', 'F', 30, 6, 4, 44, 'from-slate-200 to-cyan-300', '#cbd5e1', 'frame'),
  modulePreset('data-spire', '数据尖塔', 'D', 64, 24, 10, 24, 'from-fuchsia-300 to-cyan-400', '#f0abfc', 'data'),
  modulePreset('drone-port', '无人机港', 'P', 48, 16, 14, 20, 'from-amber-200 to-cyan-300', '#fde68a', 'drone'),
  modulePreset('sky-garden', '空中花园', 'G', 46, 4, 55, 16, 'from-lime-300 to-emerald-500', '#a3e635', 'garden'),
  modulePreset('fusion-core', '聚变能源核', 'R', 72, -42, 18, 30, 'from-rose-300 to-cyan-300', '#fb7185', 'reactor'),
];

const defaultWorld = {
  density: 9,
  neon: 70,
  traffic: true,
  grid: true,
  autoRotate: false,
  scan: true,
  cameraMode: 'free',
  weather: 'clear',
};

const weatherOptions = [
  { id: 'clear', label: '晴天' },
  { id: 'rain', label: '雨天' },
  { id: 'fog', label: '雾天' },
  { id: 'snow', label: '雪天' },
  { id: 'storm', label: '风暴' },
];

const weatherProfiles = {
  clear: { background: '#020617', fogColor: '#020617', fogNear: 14, fogFar: 34, ambient: 0.48, sun: 2.15 },
  rain: { background: '#07111f', fogColor: '#0f172a', fogNear: 8, fogFar: 24, ambient: 0.36, sun: 1.35 },
  fog: { background: '#111827', fogColor: '#94a3b8', fogNear: 4, fogFar: 15, ambient: 0.62, sun: 0.9 },
  snow: { background: '#0f172a', fogColor: '#dbeafe', fogNear: 7, fogFar: 22, ambient: 0.7, sun: 1.45 },
  storm: { background: '#020617', fogColor: '#172554', fogNear: 5, fogFar: 18, ambient: 0.28, sun: 0.75 },
};

function modulePreset(id, name, icon, cost, energy, eco, structure, color, meshColor, model) {
  return { id, name, icon, cost, energy, eco, structure, color, meshColor, model };
}

function calculateStats(currentBuild) {
  return currentBuild.reduce(
    (total, module) => ({
      cost: total.cost + module.cost,
      energy: total.energy + module.energy,
      eco: total.eco + module.eco,
      structure: total.structure + module.structure,
    }),
    { cost: 0, energy: 0, eco: 0, structure: 0 }
  );
}

export default function App() {
  const [currentBuild, setCurrentBuild] = useState([]);
  const [world, setWorld] = useState(defaultWorld);
  const [buildPosition, setBuildPosition] = useState({ x: 0, z: 0 });
  const stats = useMemo(() => calculateStats(currentBuild), [currentBuild]);
  const weather = weatherProfiles[world.weather] || weatherProfiles.clear;

  function addModule(module) {
    setCurrentBuild((build) => [
      ...build,
      {
        ...module,
        instanceId: `${module.id}-${Date.now()}-${build.length}`,
      },
    ]);
  }

  function clearBuild() {
    setCurrentBuild([]);
  }

  function updateWorld(key, value) {
    setWorld((current) => ({ ...current, [key]: value }));
  }

  function moveBuild(dx, dz) {
    setBuildPosition((position) => ({
      x: Math.max(-4.8, Math.min(4.8, Number((position.x + dx).toFixed(1)))),
      z: Math.max(-4.8, Math.min(4.8, Number((position.z + dz).toFixed(1)))),
    }));
  }

  function resetBuildPosition() {
    setBuildPosition({ x: 0, z: 0 });
  }

  return (
    <main className="tech-shell min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.14),transparent_32%)]" />
      <div className="tech-scanline pointer-events-none fixed inset-0 z-20" />
      <section className="relative z-10 flex min-h-screen flex-col gap-4 p-4 xl:grid xl:grid-cols-[320px_minmax(0,1fr)_340px]">
        <header className="tech-commandbar xl:col-span-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="tech-brand-mark">CF</span>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">City Forge Studio</p>
              <h1 className="truncate text-xl font-semibold text-white">未来城市数字孪生控制台</h1>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-xs text-slate-300 md:flex">
            <span className="tech-pill">WEBGL ONLINE</span>
            <span className="tech-pill">WEATHER {world.weather.toUpperCase()}</span>
            <span className="tech-pill">MODULES {currentBuild.length}</span>
          </div>
        </header>

        <aside className="tech-panel rounded-lg border border-cyan-300/20 bg-slate-900/80 p-4 shadow-neon backdrop-blur">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Module Bank</p>
            <h1 className="mt-2 text-xl font-semibold text-white">未来城市自由建造系统</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">点击模块，把建筑部件堆进中间的未来城市沙盘。</p>
          </div>

          <div className="max-h-[calc(100vh-170px)] space-y-3 overflow-y-auto pr-1">
            {availableModules.map((module) => (
              <button
                key={module.id}
                onClick={() => addModule(module)}
                className="group grid w-full grid-cols-[44px_1fr] gap-3 rounded-md border border-slate-700/80 bg-slate-900/90 p-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/70 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
              >
                <span className={`grid h-11 w-11 place-items-center rounded-md bg-gradient-to-br ${module.color} text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/20`}>
                  {module.icon}
                </span>
                <span>
                  <span className="block font-medium text-slate-50">{module.name}</span>
                  <span className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-400">
                    <span>造价 {module.cost}</span>
                    <span className={module.energy < 0 ? 'text-emerald-300' : ''}>能耗 {module.energy}</span>
                    <span>生态 {module.eco}</span>
                    <span>强度 {module.structure}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="tech-panel flex min-h-[680px] flex-col rounded-lg border border-cyan-300/20 bg-slate-950/70 p-4 shadow-neon backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-300/10 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Open World Preview</p>
              <h2 className="mt-1 text-lg font-semibold">未来城市自由探索沙盘</h2>
            </div>
            <button
              onClick={clearBuild}
              disabled={currentBuild.length === 0}
              className="rounded-md border border-cyan-300/30 px-4 py-2 text-sm text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500 disabled:hover:bg-transparent"
            >
              清空建筑
            </button>
          </div>

          <div className="tech-viewport relative flex flex-1 overflow-hidden rounded-lg border border-cyan-300/20 bg-slate-950">
            <Canvas camera={{ position: [8.4, 6.2, 10.2], fov: world.cameraMode === 'cinematic' ? 36 : 48 }} shadows>
              <color attach="background" args={[weather.background]} />
              <fog attach="fog" args={[weather.fogColor, weather.fogNear, weather.fogFar]} />
              <Stars radius={70} depth={38} count={1700} factor={4} saturation={0.25} fade speed={0.55} />
              <ambientLight intensity={weather.ambient + world.neon / 320} />
              <directionalLight position={[7, 10, 6]} intensity={weather.sun} castShadow />
              <pointLight position={[-4, 5, -3]} intensity={2 + world.neon / 28} color="#22d3ee" />
              <pointLight position={[5, 3, 5]} intensity={1.2 + world.neon / 60} color="#d946ef" />
              <CityWorld settings={world} />
              <BuildingScene modules={currentBuild} settings={world} position={buildPosition} />
              <WeatherSystem weather={world.weather} neon={world.neon / 100} />
              <ContactShadows position={[0, -0.04, 0]} opacity={0.5} scale={18} blur={2.8} far={8} />
              <OrbitControls
                enablePan
                autoRotate={world.autoRotate}
                autoRotateSpeed={0.75}
                minDistance={3.8}
                maxDistance={24}
                maxPolarAngle={Math.PI / 2.02}
              />
            </Canvas>

            <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-cyan-300/20 bg-slate-950/70 px-3 py-2 text-xs text-cyan-100 backdrop-blur">
              左键旋转 · 右键平移 · 滚轮缩放
            </div>
            <HudOverlay world={world} stats={stats} buildPosition={buildPosition} moduleCount={currentBuild.length} />
            <div className="pointer-events-none absolute bottom-4 left-4 rounded-md border border-fuchsia-300/20 bg-slate-950/70 px-3 py-2 text-xs text-fuchsia-100 backdrop-blur">
              当前天气 {weatherOptions.find((item) => item.id === world.weather)?.label} · 建筑坐标 X {buildPosition.x} / Z {buildPosition.z}
            </div>
          </div>
        </section>

        <aside className="tech-panel space-y-4 rounded-lg border border-cyan-300/20 bg-slate-900/80 p-4 shadow-neon backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Live Stats</p>
              <h2 className="mt-2 text-xl font-semibold text-white">实时数据</h2>
            </div>
            <span className="rounded-md bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
              {currentBuild.length} 层
            </span>
          </div>

          <div className="space-y-3">
            <StatCard label="总造价" value={stats.cost} suffix="M" tone="cyan" />
            <StatCard label="总能耗" value={stats.energy} suffix="MW" tone={stats.energy < 0 ? 'green' : 'amber'} />
            <StatCard label="生态值" value={stats.eco} suffix="pts" tone="green" />
            <StatCard label="结构强度" value={stats.structure} suffix="kN" tone="blue" />
          </div>

          <WorldSettings world={world} updateWorld={updateWorld} />

          <MovementControls position={buildPosition} moveBuild={moveBuild} resetBuildPosition={resetBuildPosition} />

          <div className="rounded-lg border border-slate-700/70 bg-slate-950/70 p-4">
            <p className="text-sm font-medium text-slate-200">系统判断</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {currentBuild.length === 0
                ? '等待模块输入。'
                : stats.energy < 0
                  ? '建筑正在反向发电，适合作为城市能源核心。'
                  : '建筑运行稳定，可以继续加入生态或能源模块。'}
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

function WorldSettings({ world, updateWorld }) {
  return (
    <div className="rounded-lg border border-cyan-300/15 bg-slate-950/70 p-4">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">World Settings</p>
        <h3 className="mt-1 font-semibold text-white">世界设置</h3>
      </div>

      <SliderControl label="城市密度" value={world.density} min={4} max={16} onChange={(value) => updateWorld('density', value)} />
      <SliderControl label="霓虹强度" value={world.neon} min={20} max={100} onChange={(value) => updateWorld('neon', value)} />

      <div className="mt-4">
        <p className="mb-2 text-sm text-slate-300">天气系统</p>
        <div className="grid grid-cols-3 gap-2">
          {weatherOptions.map((option) => (
            <ToggleButton
              key={option.id}
              active={world.weather === option.id}
              onClick={() => updateWorld('weather', option.id)}
              label={option.label}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <ToggleButton active={world.traffic} onClick={() => updateWorld('traffic', !world.traffic)} label="空中交通" />
        <ToggleButton active={world.grid} onClick={() => updateWorld('grid', !world.grid)} label="地面网格" />
        <ToggleButton active={world.scan} onClick={() => updateWorld('scan', !world.scan)} label="扫描光环" />
        <ToggleButton active={world.autoRotate} onClick={() => updateWorld('autoRotate', !world.autoRotate)} label="自动巡航" />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm text-slate-300">镜头风格</p>
        <div className="grid grid-cols-2 gap-2">
          <ToggleButton active={world.cameraMode === 'free'} onClick={() => updateWorld('cameraMode', 'free')} label="自由探索" />
          <ToggleButton active={world.cameraMode === 'cinematic'} onClick={() => updateWorld('cameraMode', 'cinematic')} label="电影视角" />
        </div>
      </div>
    </div>
  );
}

function HudOverlay({ world, stats, buildPosition, moduleCount }) {
  const energyState = stats.energy < 0 ? 'REGEN' : 'LOAD';
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="hud-corner left-4 top-16" />
      <div className="hud-corner right-4 top-4 rotate-90" />
      <div className="hud-corner bottom-4 right-4 rotate-180" />
      <div className="hud-corner bottom-4 left-4 -rotate-90" />

      <div className="absolute right-4 top-4 w-56 rounded-md border border-cyan-300/25 bg-slate-950/65 p-3 text-xs text-cyan-100 backdrop-blur">
        <div className="mb-2 flex items-center justify-between">
          <span className="tracking-[0.2em] text-cyan-200/80">CITY OS</span>
          <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
        </div>
        <div className="space-y-1 text-slate-300">
          <p>WEATHER / {world.weather.toUpperCase()}</p>
          <p>ENERGY / {energyState}</p>
          <p>MODULES / {moduleCount}</p>
          <p>VECTOR / X {buildPosition.x} Z {buildPosition.z}</p>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 w-64 rounded-md border border-fuchsia-300/25 bg-slate-950/65 p-3 backdrop-blur">
        <div className="mb-2 flex items-center justify-between text-xs text-fuchsia-100">
          <span className="tracking-[0.2em]">SIGNAL MATRIX</span>
          <span>{world.neon}%</span>
        </div>
        <div className="grid grid-cols-16 gap-1">
          {Array.from({ length: 48 }, (_, index) => (
            <span
              key={index}
              className={`h-1 rounded-full ${index % 5 === 0 ? 'bg-fuchsia-300' : index % 3 === 0 ? 'bg-cyan-300' : 'bg-slate-700'}`}
              style={{ opacity: 0.25 + ((index * 7) % 10) / 14 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MovementControls({ position, moveBuild, resetBuildPosition }) {
  return (
    <div className="rounded-lg border border-cyan-300/15 bg-slate-950/70 p-4">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">Move Building</p>
        <h3 className="mt-1 font-semibold text-white">移动中心建筑</h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <span />
        <MoveButton label="前" onClick={() => moveBuild(0, -0.8)} />
        <span />
        <MoveButton label="左" onClick={() => moveBuild(-0.8, 0)} />
        <button
          onClick={resetBuildPosition}
          className="rounded-md border border-fuchsia-300/40 bg-fuchsia-300/10 px-3 py-2 text-sm text-fuchsia-100 transition hover:bg-fuchsia-300/20"
        >
          归中
        </button>
        <MoveButton label="右" onClick={() => moveBuild(0.8, 0)} />
        <span />
        <MoveButton label="后" onClick={() => moveBuild(0, 0.8)} />
        <span />
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-400">
        坐标：X {position.x} / Z {position.z}
      </p>
    </div>
  );
}

function MoveButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/20"
    >
      {label}
    </button>
  );
}

function SliderControl({ label, value, min, max, onChange }) {
  return (
    <label className="mb-4 block">
      <span className="mb-2 flex items-center justify-between text-sm text-slate-300">
        <span>{label}</span>
        <span className="text-cyan-200">{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-cyan-300"
      />
    </label>
  );
}

function ToggleButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md border px-3 py-2 text-sm transition ${
        active
          ? 'border-cyan-300/70 bg-cyan-300/15 text-cyan-100'
          : 'border-slate-700 bg-slate-900/70 text-slate-400 hover:border-slate-500'
      }`}
    >
      {label}
    </button>
  );
}

function CityWorld({ settings }) {
  const ringRef = useRef(null);
  const trafficRef = useRef(null);
  const towers = useMemo(() => createCityTowers(settings.density), [settings.density]);
  const neonOpacity = settings.neon / 100;
  const isWet = settings.weather === 'rain' || settings.weather === 'storm';

  useFrame(({ clock }) => {
    if (ringRef.current && settings.scan) {
      ringRef.current.rotation.z = clock.elapsedTime * 0.32;
    }
    if (trafficRef.current && settings.traffic) {
      trafficRef.current.rotation.y = clock.elapsedTime * 0.22;
    }
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.02, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color={isWet ? '#07111f' : '#030712'} metalness={isWet ? 0.72 : 0.26} roughness={isWet ? 0.16 : 0.58} />
      </mesh>

      {settings.grid && <GroundGrid opacity={0.18 + neonOpacity * 0.28} />}
      {isWet && <PuddleReflections neon={neonOpacity} />}

      {towers.map((tower) => (
        <CityTower key={tower.id} tower={tower} neon={neonOpacity} />
      ))}

      <RoadNetwork neon={neonOpacity} />
      <LightTrails neon={neonOpacity} />
      <HologramDistrict neon={neonOpacity} />
      <DistantMegastructures neon={neonOpacity} />
      <DataBeacons neon={neonOpacity} />
      {settings.traffic && <AirTraffic refObject={trafficRef} neon={neonOpacity} />}

      {settings.scan && (
        <group ref={ringRef} position={[0, -1.88, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[4.25, 4.31, 128]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.14 + neonOpacity * 0.34} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[6.9, 6.96, 128]} />
            <meshBasicMaterial color="#d946ef" transparent opacity={0.1 + neonOpacity * 0.2} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function createCityTowers(density) {
  const towers = [];
  const positions = [
    [-6.4, -5.1], [-4.6, -6.9], [-2.2, -6.2], [3.2, -6.8], [6.2, -4.8],
    [-7.2, -1.8], [6.9, -1.6], [-6.6, 2.2], [6.4, 2.6], [-4.4, 5.8],
    [-1.8, 6.8], [2.2, 6.3], [5.4, 5.3], [-8.2, 4.6], [8.1, 4.2],
    [-8.0, -4.2],
  ];

  positions.slice(0, density).forEach(([x, z], index) => {
    towers.push({
      id: `${x}-${z}`,
      x,
      z,
      height: 0.9 + ((index * 7) % 11) * 0.23,
      width: 0.48 + ((index * 5) % 4) * 0.1,
      color: index % 3 === 0 ? '#22d3ee' : index % 3 === 1 ? '#d946ef' : '#60a5fa',
    });
  });
  return towers;
}

function CityTower({ tower, neon }) {
  return (
    <group position={[tower.x, -2 + tower.height / 2, tower.z]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[tower.width, tower.height, tower.width * 0.82]} />
        <meshStandardMaterial color="#0f172a" emissive="#020617" emissiveIntensity={0.08} metalness={0.55} roughness={0.2} />
      </mesh>
      <mesh position={[0, tower.height / 2 + 0.025, 0]}>
        <boxGeometry args={[tower.width * 1.08, 0.05, tower.width * 0.9]} />
        <meshBasicMaterial color={tower.color} transparent opacity={0.38 + neon * 0.35} />
      </mesh>
      <WindowGrid color={tower.color} z={tower.width * 0.43} rows={Math.max(3, Math.floor(tower.height * 3))} cols={2} width={tower.width * 0.16} />
      <WindowGrid color={tower.color} z={-tower.width * 0.43} rows={Math.max(3, Math.floor(tower.height * 3))} cols={2} width={tower.width * 0.16} rotationY={Math.PI} />
      <mesh position={[0, tower.height / 2 + 0.28, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.45, 8]} />
        <meshBasicMaterial color={tower.color} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, tower.height / 2 + 0.54, 0]}>
        <sphereGeometry args={[0.055, 10, 8]} />
        <meshBasicMaterial color={tower.color} transparent opacity={0.92} />
      </mesh>
    </group>
  );
}

function GroundGrid({ opacity }) {
  const lines = [];
  for (let i = -10; i <= 10; i += 1) {
    lines.push(
      <mesh key={`x-${i}`} position={[i, -1.985, 0]}>
        <boxGeometry args={[0.014, 0.014, 20]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={opacity} />
      </mesh>
    );
    lines.push(
      <mesh key={`z-${i}`} position={[0, -1.984, i]}>
        <boxGeometry args={[20, 0.014, 0.014]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={opacity * 0.75} />
      </mesh>
    );
  }
  return <group>{lines}</group>;
}

function RoadNetwork({ neon }) {
  return (
    <group position={[0, -1.96, 0]}>
      <mesh>
        <boxGeometry args={[18, 0.035, 0.22]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.22 + neon * 0.34} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.22, 0.035, 18]} />
        <meshBasicMaterial color="#d946ef" transparent opacity={0.2 + neon * 0.28} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.25, 3.36, 96]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.18 + neon * 0.3} />
      </mesh>
    </group>
  );
}

function PuddleReflections({ neon }) {
  const puddles = [
    [-4.8, -3.2, 1.2, 0.55],
    [4.6, -2.8, 0.9, 0.42],
    [-2.2, 4.1, 0.78, 0.38],
    [3.4, 3.8, 1.08, 0.46],
    [0.8, -5.2, 0.72, 0.34],
  ];
  return (
    <group position={[0, -1.955, 0]}>
      {puddles.map(([x, z, sx, sz]) => (
        <mesh key={`${x}-${z}`} position={[x, 0, z]} rotation={[-Math.PI / 2, 0, 0]} scale={[sx, sz, 1]}>
          <circleGeometry args={[1, 36]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.06 + neon * 0.12} />
        </mesh>
      ))}
    </group>
  );
}

function LightTrails({ neon }) {
  const ref = useRef(null);
  const lanes = useMemo(
    () => Array.from({ length: 12 }, (_, index) => ({
      id: index,
      vertical: index % 2 === 0,
      offset: ((index * 17) % 80) / 10 - 4,
      lane: index % 3 === 0 ? -0.18 : index % 3 === 1 ? 0 : 0.18,
      color: index % 2 === 0 ? '#22d3ee' : '#f0abfc',
      speed: 0.8 + (index % 5) * 0.18,
    })),
    []
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.children.forEach((child, index) => {
      const lane = lanes[index];
      const t = ((clock.elapsedTime * lane.speed + index * 1.7) % 12) - 6;
      if (lane.vertical) {
        child.position.x = lane.lane;
        child.position.z = t;
      } else {
        child.position.x = t;
        child.position.z = lane.lane;
      }
    });
  });

  return (
    <group ref={ref} position={[0, -1.89, 0]}>
      {lanes.map((lane) => (
        <mesh key={lane.id} position={[lane.vertical ? lane.lane : lane.offset, 0, lane.vertical ? lane.offset : lane.lane]}>
          <boxGeometry args={lane.vertical ? [0.045, 0.035, 0.72] : [0.72, 0.035, 0.045]} />
          <meshBasicMaterial color={lane.color} transparent opacity={0.36 + neon * 0.38} />
        </mesh>
      ))}
    </group>
  );
}

function HologramDistrict({ neon }) {
  const panels = [
    [-5.8, -0.6, -2.6, '#22d3ee'],
    [5.6, -0.4, -2.2, '#f0abfc'],
    [-3.6, -0.2, 4.8, '#a3e635'],
    [4.2, 0, 4.6, '#60a5fa'],
  ];
  return (
    <group>
      {panels.map(([x, y, z, color], index) => (
        <group key={`${x}-${z}`} position={[x, y, z]} rotation={[0, index % 2 ? -0.45 : 0.45, 0]}>
          <mesh>
            <boxGeometry args={[1.08, 0.58, 0.025]} />
            <meshBasicMaterial color={color} transparent opacity={0.16 + neon * 0.34} />
          </mesh>
          {[0, 1, 2].map((bar) => (
            <mesh key={bar} position={[-0.28 + bar * 0.28, 0.02 - bar * 0.13, 0.03]}>
              <boxGeometry args={[0.18 + bar * 0.08, 0.028, 0.025]} />
              <meshBasicMaterial color="#e0f2fe" transparent opacity={0.36 + neon * 0.28} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function DistantMegastructures({ neon }) {
  const structures = [
    [-10.2, -8.8, 3.4, 1.2, '#22d3ee'],
    [10.5, -7.5, 4.2, 1.4, '#d946ef'],
    [-9.2, 8.8, 3.8, 1.1, '#60a5fa'],
    [9.5, 8.2, 3.2, 1.25, '#a3e635'],
  ];
  return (
    <group>
      {structures.map(([x, z, h, width, color]) => (
        <group key={`${x}-${z}`} position={[x, -2 + h / 2, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[width * 0.42, width * 0.62, h, 7]} />
            <meshStandardMaterial color="#0b1120" emissive={color} emissiveIntensity={0.06 + neon * 0.08} metalness={0.58} roughness={0.22} />
          </mesh>
          <mesh position={[0, h / 2 + 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[width * 0.62, width * 0.68, 48]} />
            <meshBasicMaterial color={color} transparent opacity={0.18 + neon * 0.34} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DataBeacons({ neon }) {
  const ref = useRef(null);
  const beacons = [
    [-3.3, -3.4, 1.8, '#22d3ee'],
    [3.6, -3.1, 1.4, '#d946ef'],
    [-4.6, 2.9, 1.6, '#60a5fa'],
    [4.8, 2.6, 1.9, '#a3e635'],
    [0, 4.7, 1.3, '#f0abfc'],
  ];

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.children.forEach((child, index) => {
      child.rotation.y = clock.elapsedTime * (0.22 + index * 0.04);
    });
  });

  return (
    <group ref={ref}>
      {beacons.map(([x, z, height, color], index) => (
        <group key={`${x}-${z}`} position={[x, -1.18 + height / 2, z]}>
          <mesh>
            <cylinderGeometry args={[0.018, 0.018, height, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.24 + neon * 0.42} />
          </mesh>
          <mesh position={[0, height / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.22 + index * 0.03, 0.25 + index * 0.03, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.3 + neon * 0.35} />
          </mesh>
          <mesh position={[0, -height / 2 - 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.34, 0.37, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.2 + neon * 0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function AirTraffic({ refObject, neon }) {
  const pods = [
    [2.9, 0, 0],
    [-2.9, Math.PI, 0],
    [0, Math.PI / 2, 2.9],
    [0, -Math.PI / 2, -2.9],
  ];
  return (
    <group ref={refObject} position={[0, 1.2, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.1, 0.012, 8, 96]} />
        <meshBasicMaterial color="#e879f9" transparent opacity={0.2 + neon * 0.35} />
      </mesh>
      {pods.map(([x, rotation, z], index) => (
        <mesh key={index} position={[x, 0, z]} rotation={[0, rotation, 0]} castShadow>
          <capsuleGeometry args={[0.055, 0.28, 8, 16]} />
          <meshBasicMaterial color={index % 2 ? '#22d3ee' : '#f0abfc'} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function WeatherSystem({ weather, neon }) {
  const weatherRef = useRef(null);
  const stormRef = useRef(null);
  const particles = useMemo(() => {
    return Array.from({ length: weather === 'snow' ? 90 : 120 }, (_, index) => ({
      id: index,
      x: ((index * 37) % 120) / 10 - 6,
      y: ((index * 19) % 80) / 10 + 1.8,
      z: ((index * 53) % 120) / 10 - 6,
      speed: 0.018 + ((index * 11) % 9) * 0.004,
      drift: (((index * 17) % 10) - 5) * 0.002,
    }));
  }, [weather]);

  useFrame(({ clock }) => {
    if (weatherRef.current && (weather === 'rain' || weather === 'snow' || weather === 'storm')) {
      weatherRef.current.children.forEach((particle, index) => {
        const data = particles[index];
        particle.position.y -= data.speed * (weather === 'snow' ? 0.45 : 1.8);
        particle.position.x += data.drift * (weather === 'snow' ? 1.4 : 0.5);
        if (particle.position.y < -1.4) {
          particle.position.y = data.y;
          particle.position.x = data.x;
          particle.position.z = data.z;
        }
      });
    }
    if (stormRef.current) {
      stormRef.current.intensity = weather === 'storm' && Math.sin(clock.elapsedTime * 5.8) > 0.84 ? 6.5 : 0;
    }
  });

  if (weather === 'clear') {
    return (
      <group>
        <mesh position={[-5.2, 6.6, -4.2]}>
          <sphereGeometry args={[0.34, 24, 16]} />
          <meshBasicMaterial color="#fde68a" transparent opacity={0.75} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      {(weather === 'fog' || weather === 'rain' || weather === 'storm') && <CloudLayer opacity={weather === 'fog' ? 0.32 : 0.16} />}

      {(weather === 'rain' || weather === 'storm') && (
        <group ref={weatherRef}>
          {particles.map((particle) => (
            <mesh key={particle.id} position={[particle.x, particle.y, particle.z]} rotation={[0.35, 0, 0]}>
              <boxGeometry args={[0.012, weather === 'storm' ? 0.42 : 0.28, 0.012]} />
              <meshBasicMaterial color={weather === 'storm' ? '#93c5fd' : '#67e8f9'} transparent opacity={weather === 'storm' ? 0.72 : 0.48 + neon * 0.18} />
            </mesh>
          ))}
        </group>
      )}

      {weather === 'snow' && (
        <group ref={weatherRef}>
          {particles.map((particle) => (
            <mesh key={particle.id} position={[particle.x, particle.y, particle.z]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshBasicMaterial color="#e0f2fe" transparent opacity={0.76} />
            </mesh>
          ))}
        </group>
      )}

      {weather === 'storm' && (
        <>
          <pointLight ref={stormRef} position={[0, 6, -3]} intensity={0} color="#bfdbfe" />
          <LightningBolt />
        </>
      )}
    </group>
  );
}

function CloudLayer({ opacity }) {
  return (
    <group position={[0, 3.8, 0]}>
      {[
        [-4.2, 0, -2.2, 1.5],
        [-1.3, 0.3, -3.3, 1.1],
        [2.7, 0.1, -2.5, 1.4],
        [4.5, -0.2, 0.7, 1.25],
        [-3.8, 0.2, 2.4, 1.2],
      ].map(([x, y, z, scale]) => (
        <mesh key={`${x}-${z}`} position={[x, y, z]} scale={[scale, 0.32, scale * 0.72]}>
          <sphereGeometry args={[1, 18, 10]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
}

function LightningBolt() {
  const boltRef = useRef(null);

  useFrame(({ clock }) => {
    if (boltRef.current) {
      boltRef.current.visible = Math.sin(clock.elapsedTime * 5.8) > 0.84;
    }
  });

  return (
    <group ref={boltRef} position={[3.4, 3.2, -2.4]} visible={false}>
      <mesh rotation={[0, 0, -0.32]}>
        <boxGeometry args={[0.06, 1.3, 0.06]} />
        <meshBasicMaterial color="#bfdbfe" transparent opacity={0.92} />
      </mesh>
      <mesh position={[-0.2, -0.72, 0]} rotation={[0, 0, 0.48]}>
        <boxGeometry args={[0.055, 0.86, 0.055]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function BuildingScene({ modules, settings, position }) {
  const groupRef = useRef(null);
  const height = Math.max(1, modules.length) * 0.78;

  useFrame(({ clock }) => {
    if (groupRef.current && settings.autoRotate) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.18;
    }
  });

  return (
    <group position={[position.x, -1.78, position.z]}>
      <CentralPlatform neon={settings.neon / 100} />

      {modules.length === 0 ? (
        <Html center position={[0, 1.05, 0]}>
          <div className="w-72 rounded-lg border border-dashed border-cyan-300/30 bg-slate-950/80 p-4 text-center text-sm text-slate-300 shadow-neon backdrop-blur">
            从左侧选择模块，未来建筑会在城市中心生成。
          </div>
        </Html>
      ) : (
        <group ref={groupRef} position={[0, Math.max(0, 1.4 - height * 0.18), 0]}>
          {modules.map((module, index) => (
            <ModuleMesh key={module.instanceId} module={module} index={index} />
          ))}
          <Antenna top={modules.length * 0.78} />
        </group>
      )}
    </group>
  );
}

function CentralPlatform({ neon }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3.25, 96]} />
        <meshStandardMaterial color="#07111f" metalness={0.35} roughness={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[2.08, 2.14, 96]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.35 + neon * 0.38} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[2.88, 2.93, 96]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.22 + neon * 0.26} />
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 2.7, 10]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.16 + neon * 0.3} />
      </mesh>
      {[0.58, 1.12, 1.72].map((y, index) => (
        <mesh key={y} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
          <ringGeometry args={[1.18 + index * 0.34, 1.21 + index * 0.34, 72]} />
          <meshBasicMaterial color={index % 2 ? '#d946ef' : '#22d3ee'} transparent opacity={0.18 + neon * 0.22} />
        </mesh>
      ))}
    </group>
  );
}

function ModuleMesh({ module, index }) {
  const ref = useRef(null);
  const y = index * 0.78 + 0.42;
  const scale = Math.max(0.64, 1.16 - index * 0.032);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.y += (y - ref.current.position.y) * Math.min(delta * 8, 1);
  });

  return (
    <group ref={ref} position={[0, y - 0.82, 0]} scale={[scale, 1, scale]}>
      <ArchitecturalModule module={module} />
      <Html center position={[0, 0.52, 0]}>
        <div className="rounded-md border border-white/15 bg-slate-950/70 px-2 py-1 text-[11px] font-semibold text-cyan-50 backdrop-blur">
          {module.icon}
        </div>
      </Html>
    </group>
  );
}

function ArchitecturalModule({ module }) {
  if (module.model === 'solar') return <SolarCrown color={module.meshColor} />;
  if (module.model === 'habitat') return <HabitatRing color={module.meshColor} />;
  if (module.model === 'eco') return <GreenCore color={module.meshColor} />;
  if (module.model === 'transit') return <TransitNode color={module.meshColor} />;
  if (module.model === 'data') return <DataSpire color={module.meshColor} />;
  if (module.model === 'drone') return <DronePort color={module.meshColor} />;
  if (module.model === 'garden') return <SkyGarden color={module.meshColor} />;
  if (module.model === 'reactor') return <FusionCore color={module.meshColor} />;
  return <SupportFrame color={module.meshColor} />;
}

function TowerCore({ color = '#60a5fa', height = 0.62, width = 1.15 }) {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, width * 0.72]} />
        <meshStandardMaterial color="#102033" metalness={0.42} roughness={0.28} />
      </mesh>
      <WindowGrid color={color} z={width * 0.365} rows={3} cols={4} width={width * 0.18} />
      <WindowGrid color={color} z={-width * 0.365} rows={3} cols={4} width={width * 0.18} rotationY={Math.PI} />
      <mesh position={[0, height / 2 + 0.035, 0]} castShadow>
        <boxGeometry args={[width * 1.14, 0.07, width * 0.86]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.18} metalness={0.35} roughness={0.22} />
      </mesh>
    </group>
  );
}

function WindowGrid({ color, z, rows, cols, width, rotationY = 0 }) {
  const panes = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      panes.push(
        <mesh key={`${row}-${col}`} position={[(col - (cols - 1) / 2) * width * 1.55, (row - 1) * 0.16, z + Math.sign(z) * 0.006]} rotation={[0, rotationY, 0]}>
          <boxGeometry args={[width, 0.055, 0.018]} />
          <meshBasicMaterial color={color} transparent opacity={0.78} />
        </mesh>
      );
    }
  }
  return <group>{panes}</group>;
}

function SolarCrown({ color }) {
  return (
    <group>
      <TowerCore color={color} height={0.48} width={1.08} />
      {[-0.72, 0, 0.72].map((x) => (
        <group key={x} position={[x, 0.42, 0]} rotation={[0, 0, x * 0.12]}>
          <mesh rotation={[0.34, 0, 0]} castShadow>
            <boxGeometry args={[0.52, 0.045, 0.92]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.18} />
          </mesh>
          <mesh position={[0, 0.03, 0.01]} rotation={[0.34, 0, 0]}>
            <boxGeometry args={[0.44, 0.012, 0.78]} />
            <meshBasicMaterial color="#67e8f9" transparent opacity={0.74} />
          </mesh>
        </group>
      ))}
      <GlowRing y={0.62} radius={0.78} color="#22d3ee" />
    </group>
  );
}

function HabitatRing({ color }) {
  return (
    <group>
      <TowerCore color={color} height={0.7} width={1.22} />
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} castShadow>
        <torusGeometry args={[1.06, 0.08, 12, 80]} />
        <meshStandardMaterial color="#1e3a8a" emissive={color} emissiveIntensity={0.2} metalness={0.38} roughness={0.22} />
      </mesh>
      {[-0.74, 0.74].map((x) => (
        <mesh key={x} position={[x, 0.03, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.54, 18]} />
          <meshStandardMaterial color="#dbeafe" emissive="#60a5fa" emissiveIntensity={0.12} metalness={0.3} roughness={0.22} />
        </mesh>
      ))}
    </group>
  );
}

function GreenCore({ color }) {
  return (
    <group>
      <TowerCore color={color} height={0.52} width={1.05} />
      <mesh position={[0, 0.39, 0]} castShadow>
        <cylinderGeometry args={[0.82, 0.92, 0.18, 36]} />
        <meshStandardMaterial color="#14532d" emissive="#16a34a" emissiveIntensity={0.18} roughness={0.48} />
      </mesh>
      {[-0.48, 0, 0.48].map((x, index) => (
        <Plant key={x} x={x} z={index === 1 ? 0.18 : -0.12} color={color} />
      ))}
      <GlowRing y={0.5} radius={0.58} color="#bbf7d0" opacity={0.34} />
    </group>
  );
}

function TransitNode({ color }) {
  return (
    <group>
      <TowerCore color={color} height={0.46} width={0.92} />
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[2.05, 0.16, 0.28]} />
        <meshStandardMaterial color="#312e81" emissive={color} emissiveIntensity={0.2} metalness={0.42} roughness={0.25} />
      </mesh>
      {[-0.82, 0.82].map((x) => (
        <mesh key={x} position={[x, 0.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <capsuleGeometry args={[0.13, 0.36, 8, 16]} />
          <meshStandardMaterial color="#f5d0fe" emissive={color} emissiveIntensity={0.25} metalness={0.24} roughness={0.2} />
        </mesh>
      ))}
      <GlowRing y={0.34} radius={0.62} color={color} opacity={0.65} />
    </group>
  );
}

function SupportFrame({ color }) {
  const columns = [
    [-0.82, 0, -0.42],
    [0.82, 0, -0.42],
    [-0.82, 0, 0.42],
    [0.82, 0, 0.42],
  ];
  return (
    <group>
      <mesh position={[0, -0.16, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.12, 1.12]} />
        <meshStandardMaterial color="#334155" metalness={0.56} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.14, 0.12, 1.24]} />
        <meshStandardMaterial color={color} emissive="#67e8f9" emissiveIntensity={0.12} metalness={0.48} roughness={0.26} />
      </mesh>
      {columns.map(([x, y, z]) => (
        <mesh key={`${x}-${z}`} position={[x, y + 0.05, z]} castShadow>
          <cylinderGeometry args={[0.055, 0.055, 0.86, 10]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.58} roughness={0.22} />
        </mesh>
      ))}
      <mesh position={[0, 0.07, 0]} rotation={[0, 0, 0.18]}>
        <boxGeometry args={[2.1, 0.045, 0.055]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

function DataSpire({ color }) {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.52, 0.72, 0.78, 6]} />
        <meshStandardMaterial color="#111827" emissive="#581c87" emissiveIntensity={0.2} metalness={0.6} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <coneGeometry args={[0.42, 0.72, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.36} metalness={0.42} roughness={0.2} />
      </mesh>
      {[0, 1, 2].map((index) => (
        <GlowRing key={index} y={0.02 + index * 0.22} radius={0.76 + index * 0.12} color={index % 2 ? '#22d3ee' : '#f0abfc'} opacity={0.42} />
      ))}
    </group>
  );
}

function DronePort({ color }) {
  return (
    <group>
      <TowerCore color={color} height={0.38} width={0.92} />
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[1.0, 0.84, 0.16, 8]} />
        <meshStandardMaterial color="#334155" emissive={color} emissiveIntensity={0.18} metalness={0.42} roughness={0.24} />
      </mesh>
      {[
        [-0.72, 0.42, 0],
        [0.72, 0.42, 0],
        [0, 0.42, -0.55],
        [0, 0.42, 0.55],
      ].map(([x, y, z]) => (
        <mesh key={`${x}-${z}`} position={[x, y, z]}>
          <cylinderGeometry args={[0.18, 0.18, 0.018, 32]} />
          <meshBasicMaterial color="#fde68a" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function SkyGarden({ color }) {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.94, 1.02, 0.3, 36]} />
        <meshStandardMaterial color="#064e3b" emissive="#16a34a" emissiveIntensity={0.16} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[1.8, 0.08, 0.34]} />
        <meshStandardMaterial color="#166534" emissive={color} emissiveIntensity={0.15} roughness={0.42} />
      </mesh>
      {[-0.54, 0, 0.54].map((x) => (
        <Plant key={x} x={x} z={0.18} color={color} />
      ))}
      <GlowRing y={0.26} radius={0.92} color={color} opacity={0.42} />
    </group>
  );
}

function FusionCore({ color }) {
  const coreRef = useRef(null);
  useFrame(({ clock }) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = clock.elapsedTime * 1.5;
    }
  });
  return (
    <group>
      <TowerCore color={color} height={0.46} width={1.0} />
      <mesh ref={coreRef} position={[0, 0.38, 0]}>
        <torusKnotGeometry args={[0.35, 0.055, 80, 12]} />
        <meshStandardMaterial color={color} emissive="#22d3ee" emissiveIntensity={0.45} metalness={0.38} roughness={0.16} />
      </mesh>
      <GlowRing y={0.38} radius={0.82} color="#22d3ee" opacity={0.62} />
    </group>
  );
}

function Plant({ x, z, color }) {
  return (
    <group position={[x, 0.56, z]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.035, 0.05, 0.18, 8]} />
        <meshStandardMaterial color="#7c4a24" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.13, 0]} castShadow>
        <sphereGeometry args={[0.16, 14, 10]} />
        <meshStandardMaterial color={color} emissive="#22c55e" emissiveIntensity={0.24} roughness={0.45} />
      </mesh>
    </group>
  );
}

function GlowRing({ y, radius, color, opacity = 0.65 }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <ringGeometry args={[radius, radius + 0.045, 64]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function Antenna({ top }) {
  return (
    <group position={[0, top + 0.5, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.7, 12]} />
        <meshStandardMaterial color="#e0f2fe" emissive="#22d3ee" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>
    </group>
  );
}

function StatCard({ label, value, suffix, tone }) {
  const tones = {
    cyan: 'text-cyan-200 border-cyan-300/20 bg-cyan-300/10',
    green: 'text-emerald-200 border-emerald-300/20 bg-emerald-300/10',
    amber: 'text-amber-200 border-amber-300/20 bg-amber-300/10',
    blue: 'text-blue-200 border-blue-300/20 bg-blue-300/10',
  };

  return (
    <div className={`rounded-lg border p-4 transition duration-300 ${tones[tone]}`}>
      <p className="text-sm text-slate-300">{label}</p>
      <div className="mt-2 flex items-end gap-2">
        <span key={value} className="stat-number text-4xl font-black tabular-nums text-white">
          {value}
        </span>
        <span className="pb-1 text-sm font-semibold opacity-80">{suffix}</span>
      </div>
    </div>
  );
}
