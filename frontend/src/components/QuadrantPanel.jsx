import React, { useState, useEffect, useRef } from 'react';
import { useExam } from '../context/ExamContext';
import { Atom, FlaskConical, Dna, Video, VideoOff, ChevronRight, Lock } from 'lucide-react';

// 📚 COMPREHENSIVE 90 DISTINCT HIGH-STAKES QUESTION BANK Matrix
const questionBank = {
  physics: [
    { id: 'p-1', subject: 'Physics', txt: 'A particle moves in a circle of radius R with constant speed v. What is the magnitude of its average acceleration over a time interval of pi*R / (2v)?', options: ['zero', 'v²/R', '2v²/R', '2√2 v²/πR'], correct: 3 },
    { id: 'p-2', subject: 'Physics', txt: 'Two capacitors of capacities C1 and C2 are charged to voltages V1 and V2 respectively. When connected in parallel, the common potential is:', options: ['(C1V1 + C2V2) / (C1 + C2)', '(C1V1 - C2V2) / (C1 + C2)', '√(V1V2)', '(C1V1² + C2V2²) / (C1+C2)'], correct: 0 },
    { id: 'p-3', subject: 'Physics', txt: 'The work done in pulling a body up a rough inclined plane of inclination theta and length l with a coefficient of friction mu is:', options: ['mgl sin(theta)', 'mgl cos(theta)', 'mgl (sin(theta) + mu cos(theta))', 'mgl (sin(theta) - mu cos(theta))'], correct: 2 },
    { id: 'p-4', subject: 'Physics', txt: 'A cyclic heat engine operates between source temperature 800K and sink temperature 400K. What is the maximum theoretical efficiency possible?', options: ['25%', '50%', '75%', '100%'], correct: 1 },
    { id: 'p-5', subject: 'Physics', txt: 'An electron enters a uniform magnetic field perpendicular to its direction of velocity. The trajectory of the electron inside the field will be:', options: ['Linear', 'Parabolic', 'Circular', 'Elliptical'], correct: 2 },
    { id: 'p-6', subject: 'Physics', txt: 'A spring of force constant k is cut into three equal parts. The force constant of each individual part becomes:', options: ['k/3', 'k', '3k', '9k'], correct: 2 },
    { id: 'p-7', subject: 'Physics', txt: 'The absolute temperature of an ideal gas is increased by three times. The root-mean-square velocity of the gas molecules will increase by:', options: ['3 times', '9 times', '√3 times', '1/√3 times'], correct: 2 },
    { id: 'p-8', subject: 'Physics', txt: 'A convex lens of focal length 20 cm is placed in contact with a concave lens of focal length 40 cm. The power of the combined system is:', options: ['+2.5 D', '+5.0 D', '-2.5 D', '-5.0 D'], correct: 0 },
    { id: 'p-9', subject: 'Physics', txt: 'In a photoelectric effect setup, if the frequency of the incident light radiation is doubled, the stopping potential will:', options: ['Be doubled', 'Be halved', 'Increase by more than double', 'Increase by less than double'], correct: 2 },
    { id: 'p-10', subject: 'Physics', txt: 'The half-life of a radioactive sample is 10 days. What fraction of the original nucleus remains un-decayed after 30 days?', options: ['1/3', '1/4', '1/6', '1/8'], correct: 3 },
    { id: 'p-11', subject: 'Physics', txt: 'A fluid is flowing through a horizontal pipeline of non-uniform cross-section. Where the velocity of fluid is maximum, the pressure is:', options: ['Maximum', 'Minimum', 'Atmospheric', 'Zero'], correct: 1 },
    { id: 'p-12', subject: 'Physics', txt: 'The dimensional formula for the universal gravitational constant (G) is evaluated as:', options: ['[M⁻¹ L³ T⁻²]', '[M¹ L³ T⁻²]', '[M⁻¹ L² T⁻³]', '[M⁻² L³ T⁻¹]'], correct: 0 },
    { id: 'p-13', subject: 'Physics', txt: 'A uniform heavy rod of weight W is suspended from a ceiling. The tension in the rod at a distance of three-quarters down from the top edge is:', options: ['W', '3W/4', 'W/4', 'Zero'], correct: 2 },
    { id: 'p-14', subject: 'Physics', txt: 'An object is dropped from a high tower. The ratio of the distances traveled by it in the 1st, 2nd, and 3rd seconds of its fall is:', options: ['1 : 2 : 3', '1 : 4 : 9', '1 : 3 : 5', '1 : 5 : 9'], correct: 2 },
    { id: 'p-15', subject: 'Physics', txt: 'The escape velocity of a body from the surface of Earth is v. If the radius of earth shrinks by 1% keeping mass constant, escape velocity will:', options: ['Increase by 0.5%', 'Decrease by 0.5%', 'Increase by 1%', 'Decrease by 1%'], correct: 0 },
    { id: 'p-16', subject: 'Physics', txt: 'A thermodynamic engine cycle is executed in a closed path clockwise on a standard P-V diagram. The net work done by the gas is:', options: ['Positive', 'Negative', 'Zero', 'Infinite'], correct: 0 },
    { id: 'p-17', subject: 'Physics', txt: 'The phase difference between velocity and acceleration of a simple harmonic oscillator is:', options: ['Zero', 'π/4 radians', 'π/2 radians', 'π radians'], correct: 2 },
    { id: 'p-18', subject: 'Physics', txt: 'A fundamental sound wave transitions from air medium into water. Which of the following parameters remains completely unchanged?', options: ['Velocity', 'Wavelength', 'Frequency', 'Amplitude'], correct: 2 },
    { id: 'p-19', subject: 'Physics', txt: 'The electric potential at an equatorial point situated at distance r from the center of an electric dipole is:', options: ['k*p/r²', 'Zero', '2k*p/r³', 'k*p/r'], correct: 1 },
    { id: 'p-20', subject: 'Physics', txt: 'A copper wire is stretched to increase its total length by 0.1%. The percentage change in its electrical resistance value will be:', options: ['0.1%', '0.2%', '0.4%', '0.05%'], correct: 1 },
    { id: 'p-21', subject: 'Physics', txt: 'A galvanometer of resistance 100 ohms gives full scale deflection for 1mA current. To convert it into a 10V voltmeter, series resistance needed is:', options: ['9900 ohms', '10000 ohms', '9000 ohms', '10100 ohms'], correct: 0 },
    { id: 'p-22', subject: 'Physics', txt: 'The magnetic susceptibility of a perfectly diamagnetic material sample is always:', options: ['Zero', 'Infinity', '+1', '-1'], correct: 3 },
    { id: 'p-23', subject: 'Physics', txt: 'Self-inductance of a solenoid inductor core is directly proportional to which of the following variables?', options: ['Number of turns', 'Square of number of turns', 'Area of cross section only', 'Both 2 and 3'], correct: 3 },
    { id: 'p-24', subject: 'Physics', txt: 'In an electromagnetic wave propagation vector matrix, the angle between the electric field E and magnetic field B vectors is:', options: ['0 degrees', '45 degrees', '90 degrees', '180 degrees'], correct: 2 },
    { id: 'p-25', subject: 'Physics', txt: 'The ratio of the longest wavelength to shortest wavelength in the Balmer series of hydrogen spectrum lines is:', options: ['9:5', '5:9', '4:3', '7:4'], correct: 0 },
    { id: 'p-26', subject: 'Physics', txt: 'What is the de-Broglie wavelength of an electron accelerated through a potential difference of 100 Volts?', options: ['1.227 Å', '12.27 Å', '0.1227 Å', '122.7 Å'], correct: 0 },
    { id: 'p-27', subject: 'Physics', txt: 'In a common-emitter transistor amplifier configuration setup, the phase difference between the input and output signal voltage waves is:', options: ['0 degrees', '90 degrees', '180 degrees', '270 degrees'], correct: 2 },
    { id: 'p-28', subject: 'Physics', txt: 'Identify the Boolean logic output equation generated by a standard two-input NAND gate configuration:', options: ['Y = A + B', 'Y = A * B', 'Y = NOT(A + B)', 'Y = NOT(A * B)'], correct: 3 },
    { id: 'p-29', subject: 'Physics', txt: 'The displacement of a particle is given by x = at² - bt³. At what time coordinate does the acceleration of the particle drop to zero?', options: ['a/b', 'a/(3b)', '2a/(3b)', '3a/b'], correct: 1 },
    { id: 'p-30', subject: 'Physics', txt: 'A block of mass m is placed on a smooth wedge of inclination theta. If the wedge is accelerated horizontally by a, the block remains stationary relative to wedge. Value of a is:', options: ['g sin(theta)', 'g cos(theta)', 'g tan(theta)', 'g / tan(theta)'], correct: 2 }
  ],
  chemistry: [
    { id: 'c-1', subject: 'Chemistry', txt: 'Which of the following organic compounds will exhibit distinct geometrical isomerism patterns?', options: ['1-Butene', '2-Butene', '2-Methyl-2-butene', 'Propene'], correct: 1 },
    { id: 'c-2', subject: 'Chemistry', txt: 'What is the hybridization configuration state of the central Boron atom inside a standard Diborane (B2H6) molecular structure?', options: ['sp', 'sp²', 'sp³', 'dsp²'], correct: 2 },
    { id: 'c-3', subject: 'Chemistry', txt: 'The correct order of increasing acid strength among the halogen acid variants listed below is:', options: ['HF < HCl < HBr < HI', 'HI < HBr < HCl < HF', 'HCl < HF < HBr < HI', 'HF < HBr < HCl < HI'], correct: 0 },
    { id: 'c-4', subject: 'Chemistry', txt: 'Which of the following transitional metal complexes exhibits a completely square planar coordination geometry shape?', options: ['[Ni(Cl)₄]²⁻', '[Ni(CN)₄]²⁻', '[Fe(Cl)₄]²⁻', '[Cu(NH₃)₄]²⁺'], correct: 1 },
    { id: 'c-5', subject: 'Chemistry', txt: 'During a standard SN2 substitution mechanism pathway reaction, the configuration at the chiral carbon atom undergoes:', options: ['Complete Retention', 'Complete Inversion', 'Partial Racemization', 'No transformation shift'], correct: 1 },
    { id: 'c-6', subject: 'Chemistry', txt: 'Which of the following organic reagents will successfully differentiate between Acetone and Acetaldehyde structures?', options: ['Schiff reagent', 'Tollen reagent', 'Fehling solution', 'All of the above'], correct: 3 },
    { id: 'c-7', subject: 'Chemistry', txt: 'The rate constant of a chemical reaction depends directly on which of the following environmental metrics?', options: ['Reactant Concentration', 'Temperature', 'Time elapsed', 'Extent of reaction'], correct: 1 },
    { id: 'c-8', subject: 'Chemistry', txt: 'Which of the following aqueous solution metrics will demonstrate the highest boiling point elevation magnitude?', options: ['1.0 M Glucose', '1.0 M NaCl', '1.0 M CaCl₂', '1.0 M AlCl³'], correct: 3 },
    { id: 'c-9', subject: 'Chemistry', txt: 'What is the oxidation state score assigned to the central Sulfur element inside a Caro acid (H2SO5) molecule?', options: ['+4', '+6', '+8', '+5'], correct: 1 },
    { id: 'c-10', subject: 'Chemistry', txt: 'The standard reduction potential metrics for three metals A, B, C are +0.5V, -3.0V, and -1.2V. The reducing power order is:', options: ['B > C > A', 'A > C > B', 'C > B > A', 'A > B > C'], correct: 0 },
    { id: 'c-11', subject: 'Chemistry', txt: 'An element crystallized in a Body-Centered Cubic (BCC) lattice grid system. What is the total number of atoms contained per unit cell?', options: ['1', '2', '4', '6'], correct: 1 },
    { id: 'c-12', subject: 'Chemistry', txt: 'Which of the following parameters represents a true non-path dependent state function variable?', options: ['Reversible Heat (q)', 'Work done (w)', 'Enthalpy (H)', 'Both q and w'], correct: 2 },
    { id: 'c-13', subject: 'Chemistry', txt: 'The solubility product expression parameter for a standard Zr3(PO4)4 binary compound matrix is represented as:', options: ['6912 x⁷', '108 x⁵', '27 x⁴', '9 x³'], correct: 0 },
    { id: 'c-14', subject: 'Chemistry', txt: 'Which of the following specific gaseous pairs fails to obey the basic parameters of Dalton Law of Partial Pressures?', options: ['O₂ and N₂', 'CO₂ and He', 'NH₃ and HCl', 'H₂ and O₂'], correct: 2 },
    { id: 'c-15', subject: 'Chemistry', txt: 'The maximum total number of atomic orbitals associated with a principal quantum shell parameter level of n = 3 is:', options: ['3', '6', '9', '12'], correct: 2 },
    { id: 'c-16', subject: 'Chemistry', txt: 'Which of the following elements demonstrates the absolute highest first ionization enthalpy value across the period row?', options: ['Carbon', 'Nitrogen', 'Oxygen', 'Fluorine'], correct: 1 },
    { id: 'c-17', subject: 'Chemistry', txt: 'According to Molecular Orbital Theory, which of the following diatomic molecular species possesses a bond order score of exactly 2.5?', options: ['O₂', 'N₂', 'O₂⁺', 'C₂'], correct: 2 },
    { id: 'c-18', subject: 'Chemistry', txt: 'The volume of water required to dilute 10 mL of 10 M HCl to prepare an exact concentration solution of 1 M HCl is:', options: ['90 mL', '100 mL', '990 mL', '50 mL'], correct: 0 },
    { id: 'c-19', subject: 'Chemistry', txt: 'Which of the following oxides is completely amphoteric in its chemical reaction behavior?', options: ['CaO', 'CO₂', 'Al₂O₃', 'SiO₂'], correct: 2 },
    { id: 'c-20', subject: 'Chemistry', txt: 'The structural compound formed when Phosphorous Trichloride reacts completely with a water molecule is:', options: ['H₃PO₃ + HCl', 'H₃PO₄ + HCl', 'PH₃ + HCl', 'P₂O₅ + HCl'], correct: 0 },
    { id: 'c-21', subject: 'Chemistry', txt: 'Which of the following transitional elements fails to show variable oxidation states due to a completely filled d-shell?', options: ['Iron', 'Manganese', 'Copper', 'Zinc'], correct: 3 },
    { id: 'c-22', subject: 'Chemistry', txt: 'The IUPAC nomenclature name designation for the complex compound K3[Fe(CN)6] is:', options: ['Potassium hexacyanoferrate(II)', 'Potassium hexacyanoferrate(III)', 'Tripotassium hexacyanoiron', 'Potassium cyanoferrate'], correct: 1 },
    { id: 'c-23', subject: 'Chemistry', txt: 'Which of the following specific polymers belongs to the structural family classification of Polyamides?', options: ['Teflon', 'Nylon-6,6', 'Terylene', 'Bakelite'], correct: 1 },
    { id: 'c-24', subject: 'Chemistry', txt: 'The specific structural conformation modification component of Glucose known as Alpha-D-Glucose and Beta-D-Glucose are labeled as:', options: ['Epimers', 'Anomers', 'Enantiomers', 'Conformers'], correct: 1 },
    { id: 'c-25', subject: 'Chemistry', txt: 'Which of the following organic test procedures is specifically engineered to identify primary amine structural matrices?', options: ['Reimer-Tiemann Reaction', 'Carbylamine Reaction', 'Cannizzaro Reaction', 'Wurtz Fitting Reaction'], correct: 1 },
    { id: 'c-26', subject: 'Chemistry', txt: 'The reaction of Aniline with nitrous acid at low temperature (0-5 degrees C) yields which stable aromatic intermediate product?', options: ['Nitrobenzene', 'Benzene Diazonium Chloride', 'Phenol', 'Chlorobenzene'], correct: 1 },
    { id: 'c-27', subject: 'Chemistry', txt: 'When Phenol is heated with Zinc dust, the primary aromatic organic compound harvested is:', options: ['Benzene', 'Toluene', 'Benzoquinone', 'Catechol'], correct: 0 },
    { id: 'c-28', subject: 'Chemistry', txt: 'The major organic product harvested when Propene undergoes Hydroboration-Oxidation sequential processing steps is:', options: ['1-Propanol', '2-Propanol', 'Propanone', 'Propandiol'], correct: 0 },
    { id: 'c-29', subject: 'Chemistry', txt: 'Which of the following gaseous options serves as the chief structural ingredient component inside standard Natural Gas?', options: ['Methane', 'Ethane', 'Propane', 'Butane'], correct: 0 },
    { id: 'c-30', subject: 'Chemistry', txt: 'The legal chemical composition used in structural formulation of standard tear gas deployment agents is:', options: ['Nitrochloroform (Chloropicrin)', 'Iodoacetate', 'Chloroacetophenone', 'Both 1 and 3'], correct: 3 }
  ],
  biology: [
    { id: 'b-1', subject: 'Biology', txt: 'During replication of DNA, Okazaki fragments are synthesized in which specific direction along the template line?', options: ["3' -> 5'", "5' -> 3'", 'Continuous both ways', 'Randomly distributed steps'], correct: 1 },
    { id: 'b-2', subject: 'Biology', txt: 'Which of the following plant hormones is specifically responsible for fruit ripening and abscission processes?', options: ['Auxin', 'Gibberellin', 'Cytokinin', 'Ethylene'], correct: 3 },
    { id: 'b-3', subject: 'Biology', txt: 'The structural and functional unit of the human kidney system responsible for blood filtration is labeled as:', options: ['Neuron', 'Nephron', 'Henle Loop', 'Glomerulus capsule'], correct: 1 },
    { id: 'b-4', subject: 'Biology', txt: 'Which of the following specific cell organelle matrices is directly involved in lipid synthesis transformations?', options: ['Rough Endoplasmic Reticulum', 'Smooth Endoplasmic Reticulum', 'Golgi Apparatus', 'Lysosome body'], correct: 1 },
    { id: 'b-5', subject: 'Biology', txt: 'In a standard Mendel dihybrid cross matrix tracking layout, what is the phenotypic ratio observed across the F2 generation array?', options: ['3:1', '1:2:1', '9:3:3:1', '9:7'], correct: 2 },
    { id: 'b-6', subject: 'Biology', txt: 'The process of conversion of atmospheric nitrogen gas into direct usable Ammonia variants by living microbes is called:', options: ['Nitrification', 'Denitrification', 'Nitrogen Fixation', 'Ammonification'], correct: 2 },
    { id: 'b-7', subject: 'Biology', txt: 'Which of the following cell types present inside human gastric glands is responsible for secreting Intrinsic Factor?', options: ['Peptic Cells', 'Oxyntic (Parietal) Cells', 'Mucous Neck Cells', 'G-cells'], correct: 1 },
    { id: 'b-8', subject: 'Biology', txt: 'During the phase sequences of Mitosis cell division, the actual division of the centromere occurs precisely during:', options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'], correct: 2 },
    { id: 'b-9', subject: 'Biology', txt: 'Which of the following primary ecological biomes demonstrates the absolute highest biodiversity score per square meter?', options: ['Tropical Rainforest', 'Temperate Deciduous Forest', 'Taiga Woodland', 'Savanna Grassland'], correct: 0 },
    { id: 'b-10', subject: 'Biology', txt: 'The unique structural restriction endonuclease enzymes utilized in recombinant DNA engineering function to:', options: ['Ligate DNA strands', 'Cut DNA at specific palindromic sequences', 'Amplify gene copies', 'Degrade cellular RNA arrays'], correct: 1 },
    { id: 'b-11', subject: 'Biology', txt: 'Which of the following vector options is responsible for spreading the microfilarial pathogen causing Elephantiasis?', options: ['Anopheles mosquito', 'Culex mosquito', 'Aedes mosquito', 'Glossina fly'], correct: 1 },
    { id: 'b-12', subject: 'Biology', txt: 'The oxygen-evolving complex system responsible for photolysis of water is structurally tied with:', options: ['Photosystem I (PSI)', 'Photosystem II (PSII)', 'Cytochrome b6f complex', 'ATP Synthase engine'], correct: 1 },
    { id: 'b-13', subject: 'Biology', txt: 'Which of the following structures represents the primary site for light perception triggers inside tracking plant networks?', options: ['Stem apex', 'Axillary bud', 'Leaf blade matrix', 'Root elongation zone'], correct: 2 },
    { id: 'b-14', subject: 'Biology', txt: 'The unique connective tissue bundle layer connecting an individual skeletal muscle line to a bone structure is:', options: ['Tendon', 'Ligament', 'Cartilage', 'Adipose sheath'], correct: 0 },
    { id: 'b-15', subject: 'Biology', txt: 'Which of the following hormone elements triggers high-volume calcium level reabsorption from bone matrices back into the blood stream?', options: ['Calcitonin', 'Parathyroid Hormone (PTH)', 'Thyroxine', 'Aldosterone'], correct: 1 },
    { id: 'b-16', subject: 'Biology', txt: 'The fundamental biological classification system grouping organisms into Three Domains is primarily built upon studying:', options: ['Morphological variations', 'Ribosomal RNA (rRNA) sequences', 'Storage protein structures', 'Lipid bilayer thickness'], correct: 1 },
    { id: 'b-17', subject: 'Biology', txt: 'Which of the following specific fungal options lacks a standard multicellular hyphal network, existing as a unicellular body?', options: ['Mucor', 'Penicillium', 'Saccharomyces (Yeast)', 'Agaricus'], correct: 2 },
    { id: 'b-18', subject: 'Biology', txt: 'The modification pattern where structural leaf elements transform into rigid climbing spines inside a desert cactus is a form of:', options: ['Phylloclade adaptation', 'Tendril modification', 'Cladode structure', 'Thorn defense system'], correct: 0 },
    { id: 'b-19', subject: 'Biology', txt: 'Which of the following structural layer components accounts for the primary water barrier property inside plant cork tissue cells?', options: ['Lignin deposition', 'Suberin structural matrix', 'Pectin adhesive layer', 'Cellulose fibrils'], correct: 1 },
    { id: 'b-20', subject: 'Biology', txt: 'During standard human ECG tracking procedures, the visible T-wave coordinate represents which cardiac cycle event?', options: ['Atrial Depolarization', 'Ventricular Depolarization', 'Ventricular Repolarization', 'Atrial Repolarization'], correct: 2 },
    { id: 'b-21', subject: 'Biology', txt: 'What is the exact volume count designated as the Residual Volume (RV) metric inside normal adult human respiratory loops?', options: ['500 mL', '1100 mL - 1200 mL', '2500 mL', '3500 mL'], correct: 1 },
    { id: 'b-22', subject: 'Biology', txt: 'Which type of immunoglobin molecule class is found in high concentrations inside initial maternal colostrum fluids?', options: ['IgG', 'IgM', 'IgA', 'IgE'], correct: 2 },
    { id: 'b-23', subject: 'Biology', txt: 'The primary anatomical location where functional T-lymphocyte cell populations undergo maturation training is:', options: ['Bone Marrow', 'Spleen Core', 'Thymus Gland', 'Lymph Node array'], correct: 2 },
    { id: 'b-24', subject: 'Biology', txt: 'The unique evolutionary relationship observed between a standard mycorrhizal fungus and a vascular plant root system is:', options: ['Amensalism', 'Parasitism', 'Mutualism', 'Commensalism'], correct: 2 },
    { id: 'b-25', subject: 'Biology', txt: 'Which of the following base elements represents the start codon sequence found across mRNA translation templates?', options: ['UAA', 'UAG', 'UGA', 'AUG'], correct: 3 },
    { id: 'b-26', subject: 'Biology', txt: 'The unique double-membrane structural layout wrapping around the human heart muscle tissue layer is labeled as:', options: ['Pleural Membrane', 'Pericardium Sheath', 'Peritoneum Layer', 'Meninges system'], correct: 1 },
    { id: 'b-27', subject: 'Biology', txt: 'Which of the following organic structures forms the primary component inside the exoskeleton shells of arthropod organisms?', options: ['Cellulose polymer', 'Chitin polysaccharide', 'Peptidoglycan matrix', 'Keratin matrix'], correct: 1 },
    { id: 'b-28', subject: 'Biology', txt: 'The critical cranial nerve asset responsible for regulating autonomic parasitic functions over the heart and digestive tract is:', options: ['Vagus Nerve (X)', 'Facial Nerve (VII)', 'Optic Nerve (II)', 'Trigeminal Nerve (V)'], correct: 0 },
    { id: 'b-29', subject: 'Biology', txt: 'Identify the structural site inside human testicles responsible for managing active spermatogenesis generation steps:', options: ['Vasa Efferentia tubes', 'Seminiferous Tubules network', 'Leydig interstitial cells', 'Prostate channels'], correct: 1 },
    { id: 'b-30', subject: 'Biology', txt: 'Which of the following geological conservation steps is labeled as an Ex-Situ biodiversity preservation program asset?', options: ['National Park reserves', 'Wildlife Sanctuaries', 'Seed Banks and Botanical Gardens', 'Biosphere Reserves'], correct: 2 }
  ]
};

// 🎲 Reliable Fisher-Yates shuffle implementation
const shuffleArray = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const QuadrantPanel = () => {
  const { 
    examStarted, 
    scoreMetrics, 
    globalTimeLeft, 
    warnings, 
    answers, 
    setAnswers, 
    handleFinalSubmission,
    setExamStarted // Context dispatcher to route back to verification view
  } = useExam();
  
  // 🔀 True randomized sequence tracking path
  const [sequencePath, setSequencePath] = useState(['physics', 'chemistry', 'biology']);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);

  const [activePhysicsQ, setActivePhysicsQ] = useState(null);
  const [activeChemQ, setActiveChemQ] = useState(null);
  const [activeBioQ, setActiveBioQ] = useState(null);

  const [selectedPhysicsOpt, setSelectedPhysicsOpt] = useState(null);
  const [selectedChemOpt, setSelectedChemOpt] = useState(null);
  const [selectedBioOpt, setSelectedBioOpt] = useState(null);

  const videoRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  // Initialize questions and a truly randomized path loop
  useEffect(() => {
    if (examStarted) {
      const shuffledPath = shuffleArray(['physics', 'chemistry', 'biology']);
      setSequencePath(shuffledPath);
      setCurrentPathIndex(0);

      setActivePhysicsQ(questionBank.physics[Math.floor(Math.random() * 30)]);
      setActiveChemQ(questionBank.chemistry[Math.floor(Math.random() * 30)]);
      setActiveBioQ(questionBank.biology[Math.floor(Math.random() * 30)]);
    }
  }, [examStarted]);

  useEffect(() => {
    let localStream = null;
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480, frameRate: { ideal: 30 } }, 
          audio: false 
        });
        localStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } catch (err) {
        setCameraError(true);
      }
    }
    if (examStarted) startCamera();
    return () => {
      if (localStream) localStream.getTracks().forEach(track => track.stop());
    };
  }, [examStarted]);

  const activeSubject = sequencePath[currentPathIndex];

  const advanceQuestion = (currentSubject) => {
    if (currentSubject === 'physics') {
      const isCorrect = selectedPhysicsOpt === activePhysicsQ.correct;
      setAnswers(prev => ({ ...prev, [activePhysicsQ.id]: { optionIndex: selectedPhysicsOpt, isCorrect } }));
      setActivePhysicsQ(questionBank.physics[Math.floor(Math.random() * 30)]);
      setSelectedPhysicsOpt(null);
    } 
    else if (currentSubject === 'chemistry') {
      const isCorrect = selectedChemOpt === activeChemQ.correct;
      setAnswers(prev => ({ ...prev, [activeChemQ.id]: { optionIndex: selectedChemOpt, isCorrect } }));
      setActiveChemQ(questionBank.chemistry[Math.floor(Math.random() * 30)]);
      setSelectedChemOpt(null);
    } 
    else if (currentSubject === 'biology') {
      const isCorrect = selectedBioOpt === activeBioQ.correct;
      setAnswers(prev => ({ ...prev, [activeBioQ.id]: { optionIndex: selectedBioOpt, isCorrect } }));
      setActiveBioQ(questionBank.biology[Math.floor(Math.random() * 30)]);
      setSelectedBioOpt(null);
    }

    // Cycle through the randomized sequence path array safely
    setCurrentPathIndex((prevIndex) => (prevIndex + 1) % sequencePath.length);
  };

  // Terminate test and redirect back to verification
  const processFinalSubmission = () => {
    handleFinalSubmission(); 
    alert(`Submission Successful!\nYour score: ${scoreMetrics.finalScore.toFixed(1)}`);
    if (setExamStarted) {
      setExamStarted(false); // Resets flag, routing back to face identification component
    }
  };

  if (!examStarted || !activePhysicsQ || !activeChemQ || !activeBioQ) return null;

  return (
    <div className="quadrant-container">
      
      {/* 1️⃣ QUADRANT 1: STERILE CAMERA COMPARTMENT */}
      <div className="quadrant-card" style={{ background: '#090d16', border: '2px solid #ef4444' }}>
        <div className="scroll-content-wrapper" style={{ width: '100%' }}>
          <div className="quadrant-header">
            <span style={{ color: '#ef4444', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Video size={16} /> VIGILQUAD AI LIVE FEED
            </span>
          </div>
          <div style={{ width: '100%', maxWidth: '340px', height: '210px', margin: '0 auto', background: '#020617', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e293b', display: 'flex' }}>
            {cameraError ? (
              <div style={{ margin: 'auto', color: '#f43f5e', textAlign: 'center' }}><VideoOff /><p style={{ fontSize: '0.75rem' }}>Camera Blocked</p></div>
            ) : (
              <video 
                ref={videoRef} autoPlay playsInline muted disablePictureInPicture disableRemotePlayback
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', pointerEvents: 'none' }} 
              />
            )}
          </div>
        </div>
      </div>

      {/* 2️⃣ QUADRANT 2: PHYSICS */}
      <div className="quadrant-card" style={{ opacity: activeSubject === 'physics' ? 1 : 0.25, transition: 'all 0.3s ease' }}>
        <div className="scroll-content-wrapper">
          <div className="quadrant-header">
            <span style={{ color: '#f43f5e', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Atom size={16} /> PHYSICS</span>
            {activeSubject === 'physics' && <span style={{ fontSize: '11px', color: '#f43f5e' }}>Active Query: {activePhysicsQ.id}</span>}
          </div>
          {activeSubject === 'physics' ? (
            <>
              <p style={{ fontSize: '0.9rem', color: '#f1f5f9', minHeight: '55px', lineHeight: '1.4' }}>{activePhysicsQ.txt}</p>
              {activePhysicsQ.options.map((opt, i) => (
                <button 
                  key={i} onClick={() => setSelectedPhysicsOpt(i)} className="btn-option" 
                  style={{ background: selectedPhysicsOpt === i ? '#1e293b' : '', borderColor: selectedPhysicsOpt === i ? '#f43f5e' : '' }}
                >
                  {opt}
                </button>
              ))}
              <button 
                disabled={selectedPhysicsOpt === null} onClick={() => advanceQuestion('physics')}
                style={{ width: '100%', background: selectedPhysicsOpt === null ? '#1e293b' : '#f43f5e', color: selectedPhysicsOpt === null ? '#64748b' : '#fff', border: 'none', padding: '0.6rem', borderRadius: '6px', marginTop: '1rem', cursor: selectedPhysicsOpt === null ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.85rem' }}
              >
                Next Sequence Segment <ChevronRight size={14} />
              </button>
            </>
          ) : (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#475569', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={20} />
              <p style={{ fontSize: '0.8rem', margin: 0, fontStyle: 'italic' }}>Awaiting structural rotation array sync...</p>
            </div>
          )}
        </div>
      </div>

      {/* 3️⃣ QUADRANT 3: BIOLOGY */}
      <div className="quadrant-card" style={{ opacity: activeSubject === 'biology' ? 1 : 0.25, transition: 'all 0.3s ease' }}>
        <div className="scroll-content-wrapper">
          <div className="quadrant-header">
            <span style={{ color: '#4ade80', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Dna size={16} /> BIOLOGY</span>
            {activeSubject === 'biology' && <span style={{ fontSize: '11px', color: '#4ade80' }}>Active Query: {activeBioQ.id}</span>}
          </div>
          {activeSubject === 'biology' ? (
            <>
              <p style={{ fontSize: '0.9rem', color: '#f1f5f9', minHeight: '55px', lineHeight: '1.4' }}>{activeBioQ.txt}</p>
              {activeBioQ.options.map((opt, i) => (
                <button 
                  key={i} onClick={() => setSelectedBioOpt(i)} className="btn-option" 
                  style={{ background: selectedBioOpt === i ? '#1e293b' : '', borderColor: selectedBioOpt === i ? '#4ade80' : '' }}
                >
                  {opt}
                </button>
              ))}
              <button 
                disabled={selectedBioOpt === null} onClick={() => advanceQuestion('biology')}
                style={{ width: '100%', background: selectedBioOpt === null ? '#1e293b' : '#4ade80', color: selectedBioOpt === null ? '#64748b' : '#020617', border: 'none', padding: '0.6rem', borderRadius: '6px', marginTop: '1rem', cursor: selectedBioOpt === null ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.85rem' }}
              >
                Next Sequence Segment <ChevronRight size={14} />
              </button>
            </>
          ) : (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#475569', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={20} />
              <p style={{ fontSize: '0.8rem', margin: 0, fontStyle: 'italic' }}>Awaiting structural rotation array sync...</p>
            </div>
          )}
        </div>
      </div>

      {/* 4️⃣ QUADRANT 4: CHEMISTRY */}
      <div className="quadrant-card" style={{ opacity: activeSubject === 'chemistry' ? 1 : 0.25, transition: 'all 0.3s ease' }}>
        <div className="scroll-content-wrapper">
          <div className="quadrant-header">
            <span style={{ color: '#38bdf8', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FlaskConical size={16} /> CHEMISTRY</span>
            {activeSubject === 'chemistry' && <span style={{ fontSize: '11px', color: '#38bdf8' }}>Active Query: {activeChemQ.id}</span>}
          </div>
          {activeSubject === 'chemistry' ? (
            <>
              <p style={{ fontSize: '0.9rem', color: '#f1f5f9', minHeight: '55px', lineHeight: '1.4' }}>{activeChemQ.txt}</p>
              {activeChemQ.options.map((opt, i) => (
                <button 
                  key={i} onClick={() => setSelectedChemOpt(i)} className="btn-option" 
                  style={{ background: selectedChemOpt === i ? '#1e293b' : '', borderColor: selectedChemOpt === i ? '#38bdf8' : '' }}
                >
                  {opt}
                </button>
              ))}
              <button 
                disabled={selectedChemOpt === null} onClick={() => advanceQuestion('chemistry')}
                style={{ width: '100%', background: selectedChemOpt === null ? '#1e293b' : '#38bdf8', color: selectedChemOpt === null ? '#64748b' : '#020617', border: 'none', padding: '0.6rem', borderRadius: '6px', marginTop: '1rem', cursor: selectedChemOpt === null ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.85rem' }}
              >
                Next Sequence Segment <ChevronRight size={14} />
              </button>
            </>
          ) : (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#475569', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={20} />
              <p style={{ fontSize: '0.8rem', margin: 0, fontStyle: 'italic' }}>Awaiting structural rotation array sync...</p>
            </div>
          )}
        </div>
      </div>

      {/* FLOATING ACTION CONTROL DASH HUD PANEL STRIP */}
      <div className="master-hud">
        <div>
          <span style={{ fontSize: '8px', color: '#94a3b8', display: 'block', fontWeight: 'bold', lineHeight: '1' }}>TIME LEFT</span>
          <span style={{ fontFamily: 'monospace', color: '#f59e0b', fontSize: '0.95rem', fontWeight: 'bold' }}>
            {Math.floor(globalTimeLeft / 60)}m {globalTimeLeft % 60}s
          </span>
        </div>
        <div style={{ width: '1px', height: '14px', backgroundColor: '#334155' }}></div>
        <div>
          <span style={{ fontSize: '8px', color: '#94a3b8', display: 'block', fontWeight: 'bold', lineHeight: '1' }}>LIVE SCORE</span>
          <span style={{ color: '#10b981', fontSize: '0.95rem', fontWeight: 'bold' }}>{scoreMetrics.finalScore.toFixed(1)}</span>
        </div>
        <div style={{ width: '1px', height: '14px', backgroundColor: '#334155' }}></div>
        <div>
          <span style={{ fontSize: '8px', color: '#94a3b8', display: 'block', fontWeight: 'bold', lineHeight: '1' }}>INFRACTIONS</span>
          <span style={{ color: '#ef4444', fontSize: '0.95rem', fontWeight: 'bold' }}>{warnings.totalCount}</span>
        </div>
        <div style={{ width: '1px', height: '14px', backgroundColor: '#334155' }}></div>
        <button 
          onClick={processFinalSubmission} 
          style={{ background: '#10b981', color: '#020617', border: 'none', padding: '0.2rem 0.75rem', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer', fontSize: '0.75rem' }}
        >
          SUBMIT
        </button>
      </div>

    </div>
  );
};