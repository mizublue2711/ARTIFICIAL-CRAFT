import { MechanicalComponent, TactileGraspMode, SpecModel } from '../types/telemetry';

export const ROBOT_COMPONENTS: MechanicalComponent[] = [
  {
    id: 'base_turret',
    name: 'Harmonic Azimuth Base Turret VD-B1',
    code: 'VD-AZ-48V',
    category: 'Harmonic Core',
    position: [0, 0.35, 0],
    explodedOffset: [0, -0.45, 0],
    explodedStage: 33,
    specs: {
      material: 'Forged 7075-T6 Aerospace Aluminum',
      weight: '8.4 kg',
      torqueOrForce: '190 N·m Continuous',
      gearRatio: '1:100 Harmonic Reduction',
      precision: '±0.008 mm Repeatability',
      ipRating: 'IP67 Sealed Housing',
      sensors: '24-bit Absolute Magnetic Optical Hybrid'
    },
    description: 'Foundation structural base housing the primary azimuth harmonic drive and isolated high-power bus slip ring.',
    wireframeHighlightColor: '#00E5FF',
  },
  {
    id: 'shoulder_yoke',
    name: 'Shoulder Dual-Axis Articulation Yoke',
    code: 'VD-SH-160',
    category: 'Harmonic Core',
    position: [0, 1.05, 0],
    explodedOffset: [-0.65, 0.3, 0],
    explodedStage: 66,
    specs: {
      material: 'Titanium-Infiltrated Metal Matrix',
      weight: '6.1 kg',
      torqueOrForce: '280 N·m Peak Torque',
      gearRatio: '1:120 Strain Wave',
      precision: '±0.010 mm',
      ipRating: 'IP67',
      sensors: 'Dual Thermal Thermistors & EtherCAT Node'
    },
    description: 'High-rigidity shoulder fork engineered with dual harmonic reducers to counteract high moment arms under full payload.',
    wireframeHighlightColor: '#5322FF',
  },
  {
    id: 'outer_bicep_shell_left',
    name: 'Bicep Aerodynamic Exoshell [Port]',
    code: 'VD-SHL-01P',
    category: 'Structural',
    position: [-0.35, 1.95, 0],
    explodedOffset: [-1.45, 0.3, 0.7],
    explodedStage: 33,
    specs: {
      material: '6061-T6 Hard-Anodized Alloy + EMI Coating',
      weight: '1.25 kg',
      ipRating: 'IP67 Enclosure Rating',
      sensors: 'Ambient Impact Pressure Membrane'
    },
    description: 'Quick-release protective armor shielding inner carbon fiber trusses against welding spatter and industrial debris.',
    wireframeHighlightColor: '#00E5FF',
  },
  {
    id: 'outer_bicep_shell_right',
    name: 'Bicep Aerodynamic Exoshell [Starboard]',
    code: 'VD-SHL-01S',
    category: 'Structural',
    position: [0.35, 1.95, 0],
    explodedOffset: [1.45, 0.3, -0.7],
    explodedStage: 33,
    specs: {
      material: '6061-T6 Alloy with Heat Vents',
      weight: '1.25 kg',
      ipRating: 'IP67',
      sensors: 'Optical Status Strip & LED Bus'
    },
    description: 'Interlocking starboard shroud with passive convection cooling conduits for high-duty cycle manufacturing cycles.',
    wireframeHighlightColor: '#00E5FF',
  },
  {
    id: 'carbon_bicep_core',
    name: 'Ultralight Carbon-Composite Bicep Spar',
    code: 'VD-CF-BICEP',
    category: 'Structural',
    position: [0, 1.95, 0],
    explodedOffset: [0, 0.1, 0],
    explodedStage: 33,
    specs: {
      material: 'T1000G High-Modulus Carbon Fiber',
      weight: '2.8 kg',
      precision: '< 0.05 mm Deflection @ 35kg',
      sensors: 'Fiber-Bragg Grating (FBG) Strain Sensors'
    },
    description: 'Primary structural link designed with internal hollow conduits for high-voltage power transmission and gigabit data channels.',
    wireframeHighlightColor: '#5322FF',
  },
  {
    id: 'elbow_harmonic_core',
    name: 'Elbow Harmonic Drive Flexspline Core',
    code: 'VD-EL-80F',
    category: 'Harmonic Core',
    position: [0, 2.85, 0],
    explodedOffset: [-0.4, 0.85, 0.9],
    explodedStage: 66,
    specs: {
      material: 'Nitrided Alloy Steel & Ceramic Ball Bearings',
      weight: '3.4 kg',
      torqueOrForce: '145 N·m Rated Torque',
      gearRatio: '1:100 Ratio',
      precision: 'Backlash < 0.1 arcmin',
      sensors: 'Integrated Multi-Turn Magnetic Encoder'
    },
    description: 'Zero-backlash harmonic drive core executing sub-millimeter trajectory tracking with integrated dynamic brake holding.',
    wireframeHighlightColor: '#00E5FF',
  },
  {
    id: 'forearm_actuator_pack',
    name: 'Forearm Multi-Axis Tendon Actuator Pack',
    code: 'VD-FA-4X',
    category: 'Actuator',
    position: [0.25, 3.45, 0.25],
    explodedOffset: [0.85, 0.7, 0.95],
    explodedStage: 66,
    specs: {
      material: 'Brushless DC Slotless Micro-Cores',
      weight: '2.1 kg',
      torqueOrForce: '4.5 m/s Tendon Pull Rate',
      precision: '10,000 Counts/Rev Quad Encoder',
      sensors: '4-Channel Force Transducer Array'
    },
    description: 'High-speed quad micro-actuator pack providing synthetic muscle tendon tensioning to the distal dexterous hand.',
    wireframeHighlightColor: '#5322FF',
  },
  {
    id: 'wrist_gimbal_3axis',
    name: '3-Axis Tactical Wrist Gimbal VD-W3',
    code: 'VD-WR-TRI',
    category: 'Actuator',
    position: [0.55, 3.95, 0.5],
    explodedOffset: [1.4, 0.9, 1.3],
    explodedStage: 66,
    specs: {
      material: 'Hard-Coat Anodized 7075 & Titanium Axles',
      weight: '1.95 kg',
      torqueOrForce: '45 N·m Roll / 38 N·m Pitch',
      gearRatio: '1:80 Micro Harmonic',
      precision: '±0.005 mm Pointing Precision',
      sensors: '6-Axis F/T Sensor (Fx, Fy, Fz, Tx, Ty, Tz)'
    },
    description: 'Tri-axial roll-pitch-yaw spherical wrist delivering continuous dexterity and high-frequency tool impedance control.',
    wireframeHighlightColor: '#00E5FF',
  },
  {
    id: 'dexterous_palm_chassis',
    name: '11-DOF Dexterous Hand Palm Chassis Mk-IV',
    code: 'VD-HND-PALM',
    category: 'End-Effector',
    position: [0.8, 4.35, 0.7],
    explodedOffset: [2.1, 1.2, 1.8],
    explodedStage: 100,
    specs: {
      material: 'Bio-Inspired Magnesium-Lithium Alloy',
      weight: '0.85 kg',
      torqueOrForce: '45 N Total Grasp Force',
      precision: '11 Active Degrees of Freedom',
      sensors: '1,024 Piezoresistive Tactile Grid Matrix',
      ipRating: 'IP67 Sealed Palm Membrane'
    },
    description: 'The crowning end-effector designed for human-grade tool manipulation, micro-assembly, and delicate tactile sensing.',
    wireframeHighlightColor: '#00E5FF',
  },
  {
    id: 'tactile_finger_index',
    name: 'Index Articulated Tactile Phalanx & Tip',
    code: 'VD-FNG-IDX',
    category: 'Sensory',
    position: [0.95, 4.75, 0.75],
    explodedOffset: [2.7, 1.6, 1.9],
    explodedStage: 100,
    specs: {
      material: 'Kevlar-Reinforced Silicone & Piezoresistive Poly',
      weight: '95 grams',
      torqueOrForce: '12 N Tip Pinch Force',
      precision: '3-Joint Tendon Kinematics',
      sensors: '256 Tactile Force Nodes @ 1 kHz Sampling Rate'
    },
    description: 'Distal phalanx equipped with high-density pressure receptors detecting surface micro-texture, slip, and dynamic compliance.',
    wireframeHighlightColor: '#5322FF',
  },
  {
    id: 'tactile_finger_thumb',
    name: 'Opposable Bi-Axial Thumb Kinematic Joint',
    code: 'VD-FNG-THB',
    category: 'End-Effector',
    position: [0.65, 4.5, 0.95],
    explodedOffset: [2.3, 1.3, 2.6],
    explodedStage: 100,
    specs: {
      material: 'Ceramic-Coated Grade 5 Titanium',
      weight: '120 grams',
      torqueOrForce: '18 N Pinch Opposition Force',
      precision: '2 Bi-Axial Active DOF',
      sensors: '3-Axis Hall-Effect Angle + 256 Force Cells'
    },
    description: 'True anthropomorphic opposition and circumduction, enabling seamless tool switching and robust power grasps.',
    wireframeHighlightColor: '#00E5FF',
  }
];

export const TACTILE_GRASP_MODES: TactileGraspMode[] = [
  {
    id: 'cylindrical',
    name: 'Power Cylindrical Grasp',
    description: 'Full palm and 5-finger envelopment for heavy industrial tooling, shafts, and hydraulic components.',
    gripForceN: 42.5,
    contactAreaPercent: 88,
    primaryNodesActive: 912,
    pattern: 'power_cylinder',
  },
  {
    id: 'precision_pinch',
    name: 'Sub-Millimeter Precision Pinch',
    description: 'Opposed index and thumb fingertip contact for micro-fasteners, SMT components, and PCB insertion.',
    gripForceN: 4.8,
    contactAreaPercent: 18,
    primaryNodesActive: 196,
    pattern: 'pinch',
  },
  {
    id: 'spherical',
    name: 'Spherical Centering Grasp',
    description: 'Radial finger alignment providing even pressure distribution on spherical bearing housings and valves.',
    gripForceN: 28.0,
    contactAreaPercent: 64,
    primaryNodesActive: 670,
    pattern: 'spherical',
  },
  {
    id: 'tactile_probe',
    name: 'Dynamic Tactile Surface Probe',
    description: 'Single-node surface gliding at 1 kHz to measure surface roughness, micro-cracks, and friction coefficient.',
    gripForceN: 0.8,
    contactAreaPercent: 8,
    primaryNodesActive: 64,
    pattern: 'tactile_probe',
  },
];

export const SPEC_MODELS: SpecModel[] = [
  {
    id: 'vd_arm_alpha',
    name: 'VinDynamics VD-Arm Alpha',
    type: 'Industrial 7-Axis Manipulator',
    payload: '35.0 kg',
    reach: '1,450 mm',
    repeatability: '±0.008 mm',
    ipRating: 'IP67 Sealed',
    motorEfficiency: '96.4%',
    ros2Compatible: true,
    dof: '7-DOF Kinematic Chain',
    powerConsumption: '48V DC / 680W Nom.'
  },
  {
    id: 'vd_hand_mk4',
    name: 'VinDynamics VD-Hand Mk-IV',
    type: '11-DOF Dexterous Anthropomorphic Hand',
    payload: '15.0 kg Grasp',
    reach: '220 mm Palm-to-Tip',
    repeatability: '±0.010 mm',
    ipRating: 'IP67 Submersible',
    motorEfficiency: '94.2%',
    ros2Compatible: true,
    dof: '11 Active DOF (Tendons)',
    powerConsumption: '24V DC / 120W Peak'
  },
  {
    id: 'vd_core_harmonic',
    name: 'VD-Core HD-160 Harmonic Actuator',
    type: 'Integrated Precision Actuator Module',
    payload: '180 N·m Peak Torque',
    reach: 'Zero-Backlash Unit',
    repeatability: '< 0.1 arcmin Backlash',
    ipRating: 'IP68 Sealed',
    motorEfficiency: '97.8%',
    ros2Compatible: true,
    dof: 'Single Axis High-Torque',
    powerConsumption: '48V DC / 350W'
  },
  {
    id: 'vd_atlas_x',
    name: 'VD-Humanoid Atlas-X Platform',
    type: 'Full Bipedal Physical AI Robot',
    payload: '55.0 kg Full Payload',
    reach: '1,720 mm Stature',
    repeatability: '±0.015 mm CoM Stability',
    ipRating: 'IP65 Industrial',
    motorEfficiency: '95.1%',
    ros2Compatible: true,
    dof: '32 Total Actuated DOF',
    powerConsumption: '100V LiFePO4 / 1.8kW Nom.'
  }
];

export const INITIAL_TELEMETRY = [
  {
    id: 'node_sla',
    title: 'NODE 01: SYSTEM SLA',
    badge: 'LIVE 60FPS',
    metrics: [
      { label: 'Clock SLA', value: '60.0 FPS', status: 'optimal' as const },
      { label: 'GPU Load', value: '14.2%', status: 'nominal' as const },
      { label: 'Bus Latency', value: '4.2 ms', status: 'optimal' as const },
      { label: 'Uptime', value: '99.998%', status: 'optimal' as const },
    ]
  },
  {
    id: 'node_motor',
    title: 'NODE 02: MOTOR KINEMATICS',
    badge: 'HARMONIC CORE',
    metrics: [
      { label: 'Torque Precision', value: '±0.008 mm', status: 'optimal' as const },
      { label: 'Harmonic Ratio', value: '1:100 HD', status: 'optimal' as const },
      { label: 'Max Velocity', value: '4.5 m/s', status: 'optimal' as const },
      { label: 'Thermal Delta', value: '+4.2°C', status: 'nominal' as const },
    ]
  },
  {
    id: 'node_hands',
    title: 'NODE 03: DEXTEROUS HANDS',
    badge: '11-DOF ACTIVE',
    metrics: [
      { label: 'Active Kinematics', value: '11-DOF Tendon', status: 'optimal' as const },
      { label: 'Tactile Matrix', value: '1,024 Nodes', status: 'optimal' as const },
      { label: 'Grip Pressure', value: '0.5 - 45.0 N', status: 'optimal' as const },
      { label: 'Slip Detection', value: '0.00 ms (Predictive)', status: 'optimal' as const },
    ]
  },
  {
    id: 'node_brain',
    title: 'NODE 04: PHYSICAL AI BRAIN',
    badge: 'NEURAL STREAM',
    metrics: [
      { label: 'Ingestion Speed', value: '60 FPS Dataset', status: 'optimal' as const },
      { label: 'Spatial Memory', value: '0.00% Drift', status: 'optimal' as const },
      { label: 'Inference Latency', value: '1.8 ms', status: 'optimal' as const },
      { label: 'LiDAR Density', value: '300k pts/sec', status: 'optimal' as const },
    ]
  }
];
