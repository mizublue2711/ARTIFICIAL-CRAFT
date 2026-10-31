import React, { useState } from 'react';
import { SPEC_MODELS } from '../../data/robotAssembly';
import { SpecModel } from '../../types/telemetry';
import { Code, Terminal, Copy, Check, Play, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import { sfx } from '../../utils/audio';

const CODE_SNIPPETS = {
  python: `import rclpy
from vindynamics_sdk import RobotArm, DexterousHand, PhysicalAIPolicy

def main():
    rclpy.init()
    # Initialize VinDynamics VD-Arm Alpha with 11-DOF Dexterous Hand
    arm = RobotArm(device_id="VD-ARM-001", bus_protocol="EtherCAT")
    hand = DexterousHand(device_id="VD-HAND-MK4")
    
    # Connect to Physical AI Neural Diffusion Core
    policy = PhysicalAIPolicy.load("vindynamics/spatial-diffusion-v4")
    
    print(f"[STATUS] Initialized {arm.model_name} with IP67 Sealing: {arm.is_sealed}")
    print(f"[KINEMATICS] Homing 7-axis joints to ±0.008mm precision...")
    arm.home_joints()

    # Stream 300k pts/sec LiDAR dataset and execute closed-loop trajectory
    while rclpy.ok():
        spatial_cloud = arm.get_lidar_stream()
        trajectory = policy.infer_trajectory(spatial_cloud)
        
        # Closed-loop trajectory actuation with 1024-node tactile compliance
        arm.execute_impedance_trajectory(trajectory, velocity_limit=4.5)
        hand.set_tactile_grasp(mode="cylindrical", max_force_n=42.5)

if __name__ == '__main__':
    main()`,

  cpp: `#include <rclcpp/rclcpp.hpp>
#include <vindynamics_core/harmonic_controller.hpp>
#include <vindynamics_msgs/msg/tactile_matrix.hpp>

class VinDynamicsActuationNode : public rclcpp::Node {
public:
  VinDynamicsActuationNode() : Node("vindynamics_actuation_node") {
    // Zero-jitter 1 kHz real-time EtherCAT actuation cycle
    actuator_ = std::make_unique<vindynamics::HarmonicDriveCore>("VD-HD-160");
    actuator_->set_gear_ratio(100);
    actuator_->enable_drift_guard(true);

    RCLCPP_INFO(this->get_logger(), "HD-160 Actuator armed. Backlash < 0.1 arcmin");
  }

  void execute_kinematics_step() {
    double target_torque_nm = 145.0;
    actuator_->apply_torque_step(target_torque_nm, /*safety_cutoff=*/180.0);
  }

private:
  std::unique_ptr<vindynamics::HarmonicDriveCore> actuator_;
};`,

  ros2_cli: `# VinDynamics ROS2 Humble / Iron Launch & Telemetry Configuration
ros2 launch vindynamics_bringup physical_ai_plant.launch.py \\
    robot_model:=vd_arm_alpha \\
    end_effector:=vd_hand_mk4 \\
    ethercat_interface:=eth0 \\
    lidar_stream_fps:=60 \\
    safety_envelope:=strict

# Inspect real-time 1024-node tactile matrix topic
ros2 topic echo /vindynamics/dexterous_hand/tactile_matrix --flow

# Stream harmonic drive motor diagnostics
ros2 topic hz /vindynamics/harmonic_core/joint_states
# Expected SLA: 1000.00 Hz (±0.04 µs Jitter)`
};

export const SpecsAndSandboxSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'arm' | 'hand' | 'actuator' | 'humanoid'>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'cpp' | 'ros2_cli'>('python');
  const [copied, setCopied] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [simOutput, setSimOutput] = useState<string[]>([]);

  const filteredModels = SPEC_MODELS.filter((m) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'arm') return m.id.includes('arm');
    if (selectedFilter === 'hand') return m.id.includes('hand');
    if (selectedFilter === 'actuator') return m.id.includes('harmonic');
    if (selectedFilter === 'humanoid') return m.id.includes('atlas');
    return true;
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[selectedLanguage]);
    setCopied(true);
    sfx.playTacticalClick(2200, 0.02);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSimulation = () => {
    setSimRunning(true);
    setSimOutput([
      '>> [INITIALIZE] Loading VinDynamics hardware virtualization layer...',
      '>> [BUS] EtherCAT master bound to virtual interface veth0 (1000 Hz cycle)',
    ]);
    sfx.playLaserLock();

    setTimeout(() => {
      setSimOutput((prev) => [
        ...prev,
        '>> [KINEMATICS] 7-Axis robot arm homed (Repeatability confirmed: ±0.008 mm)',
        '>> [TACTILE] 1,024-node piezoresistive array calibrated to zero baseline',
      ]);
    }, 700);

    setTimeout(() => {
      setSimOutput((prev) => [
        ...prev,
        '>> [POLICY] Physical AI diffusion inference verified: 1.79 ms',
        '>> [ACTUATION SUCCESS] Closed-loop impedance trajectory executed without collision.',
      ]);
      setSimRunning(false);
      sfx.playTacticalClick(2400, 0.04);
    }, 1500);
  };

  return (
    <section id="specs-sandbox" className="py-20 px-6 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2 font-mono-cad text-xs">
          <span className="w-2 h-2 bg-[#00E5FF] rounded-full" />
          <span className="text-[#00E5FF] uppercase tracking-wider font-semibold">SECTION 03 // TECHNICAL SPECIFICATIONS</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400">HARDWARE MATRIX & ROS2 SDK</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display uppercase tracking-tight">
          Specs Matrix & <span className="text-[#00E5FF]">Live Code Sandbox</span>
        </h2>
        <p className="mt-2 text-zinc-400 font-mono-cad text-xs sm:text-sm max-w-2xl">
          Complete hardware parameter matrix and open-source SDK snippets for controlling multi-axis harmonic joints and high-density tactile manipulators.
        </p>
      </div>

      {/* Part 1: Interactive Specs Matrix */}
      <div className="mb-16 bg-[#09090B] border border-white/10 rounded-sm p-6 cad-grid-pattern relative">
        <div className="cad-crosshair-tl cad-crosshair-tr" />

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6 font-mono-cad text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 text-[11px]">FILTER HARDWARE:</span>
            {(['all', 'arm', 'hand', 'actuator', 'humanoid'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setSelectedFilter(filter);
                  sfx.playTacticalClick(1800, 0.02);
                }}
                className={`px-2.5 py-1 border rounded-xs transition-colors uppercase text-[10px] ${
                  selectedFilter === filter
                    ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF] font-semibold'
                    : 'bg-zinc-950 border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ALL MODULES IP67 / IP68 FACTORY CERTIFIED</span>
          </div>
        </div>

        {/* Interactive Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono-cad text-xs">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 text-[10px] uppercase">
                <th className="pb-3 font-semibold">Model / Hardware Unit</th>
                <th className="pb-3 font-semibold">Class / Kinematics</th>
                <th className="pb-3 font-semibold">Rated Payload</th>
                <th className="pb-3 font-semibold">Repeatability</th>
                <th className="pb-3 font-semibold">IP Rating</th>
                <th className="pb-3 font-semibold">Efficiency</th>
                <th className="pb-3 font-semibold">ROS2 SDK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredModels.map((model) => (
                <tr key={model.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 pr-4">
                    <div className="font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                      {model.name}
                    </div>
                    <div className="text-[10px] text-zinc-500">{model.dof}</div>
                  </td>
                  <td className="py-4 pr-4 text-zinc-300">{model.type}</td>
                  <td className="py-4 pr-4 text-[#00E5FF] font-semibold">{model.payload}</td>
                  <td className="py-4 pr-4 text-emerald-400 font-semibold">{model.repeatability}</td>
                  <td className="py-4 pr-4">
                    <span className="px-2 py-0.5 bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-[10px] rounded-xs font-semibold">
                      {model.ipRating}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-white font-medium">{model.motorEfficiency}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-1.5 text-[#5322FF] font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                      <span>Humble / Iron Ready</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Part 2: Developer Code Sandbox */}
      <div className="bg-[#09090B] border border-white/10 rounded-sm p-6 cad-grid-pattern relative">
        <div className="cad-crosshair-tl cad-crosshair-tr" />

        {/* Code Header Bar */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-white/10 mb-4 gap-3 font-mono-cad">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-[#00E5FF]" />
            <strong className="text-white text-xs tracking-wider">DEVELOPER API SANDBOX</strong>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400 text-[11px]">OPEN PHYSICAL AI STACK</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center bg-black/60 border border-white/10 rounded-xs p-0.5 text-xs">
              {(['python', 'cpp', 'ros2_cli'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    sfx.playTacticalClick(1700, 0.02);
                  }}
                  className={`px-2.5 py-1 rounded-xs transition-colors uppercase text-[10px] ${
                    selectedLanguage === lang
                      ? 'bg-[#5322FF] text-white font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {lang.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 border border-white/15 hover:border-white/30 text-xs text-zinc-300 hover:text-white rounded-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{copied ? 'COPIED' : 'COPY'}</span>
            </button>

            {/* Execute Simulation Button */}
            <button
              onClick={handleRunSimulation}
              disabled={simRunning}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-black text-xs font-bold rounded-xs transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{simRunning ? 'SIMULATING...' : 'EXECUTE SIMULATION'}</span>
            </button>
          </div>
        </div>

        {/* Code Display Area */}
        <div className="relative bg-zinc-950 p-4 border border-white/10 rounded-xs font-mono-cad text-xs overflow-x-auto text-zinc-300 leading-relaxed shadow-inner">
          <pre className="whitespace-pre">
            <code>{CODE_SNIPPETS[selectedLanguage]}</code>
          </pre>
        </div>

        {/* Live Simulation Output Terminal Drawer */}
        {simOutput.length > 0 && (
          <div className="mt-4 p-4 bg-black/90 border border-[#00E5FF]/30 rounded-xs font-mono-cad text-xs text-zinc-300 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2 text-[10px]">
              <span className="text-[#00E5FF] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>PHYSICAL AI VIRTUAL HARDWARE SIMULATOR</span>
              </span>
              <span className="text-emerald-400">VIRTUAL EXECUTION COMPLETE</span>
            </div>
            <div className="space-y-1 text-[11px]">
              {simOutput.map((line, idx) => (
                <div key={idx} className={line.includes('SUCCESS') ? 'text-emerald-400 font-bold' : 'text-zinc-300'}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
