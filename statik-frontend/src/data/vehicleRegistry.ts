export type VehicleRegistryNode = {
  make: string;
  vehicleType: 'car' | 'bike' | 'truck' | 'other';
  models: Array<{
    name: string;
    generations?: string[];
    trims?: string[];
    specialEditions?: string[];
    bodyStyles?: string[];
    drivetrains?: string[];
    engines?: string[];
    transmissions?: string[];
  }>;
};

export const vehicleRegistry: VehicleRegistryNode[] = [
  {
    vehicleType: 'car',
    make: 'Ford',
    models: [
      { name: 'Falcon', generations: ['EA-ED', 'EF-EL', 'AU', 'BA-BF', 'FG', 'FG X'], trims: ['XT', 'XR6', 'XR6 Turbo', 'XR8', 'G6E', 'FPV GT', 'FPV F6'], specialEditions: ['Sprint', 'Tickford'], bodyStyles: ['Sedan', 'Ute'], drivetrains: ['RWD'], engines: ['Barra I6', 'Boss V8', 'Miami V8'], transmissions: ['Manual', 'Auto'] },
      { name: 'Mustang', generations: ['SN95', 'S197', 'S550', 'S650'], trims: ['GT', 'EcoBoost', 'Mach 1', 'Dark Horse', 'Shelby GT350', 'Shelby GT500'], bodyStyles: ['Coupe', 'Convertible'], drivetrains: ['RWD'], engines: ['Coyote V8', 'EcoBoost I4', 'Voodoo V8', 'Predator V8'], transmissions: ['Manual', 'Auto'] },
      { name: 'Focus', generations: ['Mk2', 'Mk3', 'Mk4'], trims: ['ST', 'RS'], bodyStyles: ['Hatch'], drivetrains: ['FWD', 'AWD'], engines: ['EcoBoost I4'], transmissions: ['Manual', 'Auto'] },
      { name: 'Ranger', generations: ['PX', 'Next-Gen'], trims: ['XLT', 'Wildtrak', 'Raptor'], bodyStyles: ['Dual Cab', 'Single Cab'], drivetrains: ['4x2', '4x4'], engines: ['Bi-Turbo Diesel', 'V6 Petrol', 'V6 Diesel'], transmissions: ['Auto'] },
    ],
  },
  {
    vehicleType: 'car',
    make: 'Holden',
    models: [
      { name: 'Commodore', generations: ['VN-VP', 'VR-VS', 'VT-VX', 'VY-VZ', 'VE', 'VF'], trims: ['Executive', 'SS', 'SS-V', 'SV6', 'Calais', 'HSV Clubsport', 'HSV GTS', 'Maloo'], specialEditions: ['Motorsport Edition', 'Director', 'Bathurst S', 'Redline'], bodyStyles: ['Sedan', 'Wagon', 'Ute'], drivetrains: ['RWD'], engines: ['Ecotec V6', 'Alloytec V6', 'LS1 V8', 'LS2 V8', 'LS3 V8', 'LSA V8'], transmissions: ['Manual', 'Auto'] },
      { name: 'Monaro', generations: ['V2', 'VZ'], trims: ['CV6', 'CV8', 'CV8-Z', 'HSV Coupe 4', 'HSV GTO'], bodyStyles: ['Coupe'], drivetrains: ['RWD'], engines: ['V6', 'LS1 V8', 'LS2 V8'], transmissions: ['Manual', 'Auto'] },
      { name: 'Torana', generations: ['LC', 'LJ', 'LX', 'A9X'], trims: ['SL/R 5000', 'A9X'], bodyStyles: ['Sedan', 'Hatch'], drivetrains: ['RWD'], engines: ['308 V8', 'I6'], transmissions: ['Manual', 'Auto'] },
    ],
  },
  {
    vehicleType: 'car',
    make: 'Nissan',
    models: [
      { name: 'Skyline', generations: ['R31', 'R32', 'R33', 'R34', 'V35', 'V36'], trims: ['GTS-T', 'GT-T', 'GT-R', '25GT-T'], specialEditions: ['V-Spec', 'N1', 'M-Spec', 'Nür'], bodyStyles: ['Sedan', 'Coupe'], drivetrains: ['RWD', 'AWD'], engines: ['RB20', 'RB25', 'RB26', 'VQ35'], transmissions: ['Manual', 'Auto'] },
      { name: 'Silvia', generations: ['S13', 'S14', 'S15'], trims: ['Qs', 'Ks', 'Spec S', 'Spec R'], specialEditions: ['Autech'], bodyStyles: ['Coupe'], drivetrains: ['RWD'], engines: ['CA18DET', 'SR20DET'], transmissions: ['Manual', 'Auto'] },
      { name: '180SX', generations: ['RPS13'], trims: ['Type X', 'Type S'], bodyStyles: ['Hatch'], drivetrains: ['RWD'], engines: ['CA18DET', 'SR20DET'], transmissions: ['Manual', 'Auto'] },
      { name: '350Z', generations: ['Z33'], trims: ['Touring', 'Track'], specialEditions: ['Nismo'], bodyStyles: ['Coupe', 'Roadster'], drivetrains: ['RWD'], engines: ['VQ35DE', 'VQ35HR'], transmissions: ['Manual', 'Auto'] },
      { name: '370Z', generations: ['Z34'], trims: ['Base', 'Sport', 'Nismo'], bodyStyles: ['Coupe'], drivetrains: ['RWD'], engines: ['VQ37VHR'], transmissions: ['Manual', 'Auto'] },
      { name: 'Patrol', generations: ['GQ', 'GU', 'Y62'], trims: ['ST', 'Ti', 'Ti-L', 'Warrior'], bodyStyles: ['Wagon'], drivetrains: ['4x4'], engines: ['TB42', 'TD42', 'ZD30', 'VK56'], transmissions: ['Manual', 'Auto'] },
    ],
  },
  {
    vehicleType: 'car',
    make: 'Toyota',
    models: [
      { name: 'Supra', generations: ['A70', 'A80', 'A90'], trims: ['SZ', 'RZ', 'GT', 'GTS'], specialEditions: ['GRMN'], bodyStyles: ['Coupe'], drivetrains: ['RWD'], engines: ['1JZ', '2JZ', 'B58'], transmissions: ['Manual', 'Auto'] },
      { name: '86 / GR86', generations: ['ZN6', 'ZN8'], trims: ['GT', 'GTS', 'GR86 GTS'], specialEditions: ['Hakone', '10th Anniversary'], bodyStyles: ['Coupe'], drivetrains: ['RWD'], engines: ['FA20', 'FA24'], transmissions: ['Manual', 'Auto'] },
      { name: 'LandCruiser', generations: ['80 Series', '100 Series', '200 Series', '300 Series', '79 Series'], trims: ['GX', 'GXL', 'VX', 'Sahara', 'GR Sport'], bodyStyles: ['Wagon', 'Single Cab', 'Dual Cab'], drivetrains: ['4x4'], engines: ['1HD', '1HZ', '1VD', 'F33A'], transmissions: ['Manual', 'Auto'] },
      { name: 'Hilux', generations: ['N70', 'N80'], trims: ['SR', 'SR5', 'Rogue', 'GR Sport'], bodyStyles: ['Single Cab', 'Extra Cab', 'Dual Cab'], drivetrains: ['4x2', '4x4'], engines: ['2.8 Diesel', '4.0 V6'], transmissions: ['Manual', 'Auto'] },
      { name: 'Chaser', generations: ['X90', 'X100'], trims: ['Tourer S', 'Tourer V'], bodyStyles: ['Sedan'], drivetrains: ['RWD'], engines: ['1JZ-GE', '1JZ-GTE'], transmissions: ['Manual', 'Auto'] },
      { name: 'MR2', generations: ['SW20', 'ZZW30'], trims: ['GT-S', 'G-Limited', 'Roadster'], bodyStyles: ['Coupe', 'Roadster'], drivetrains: ['RWD'], engines: ['3S-GTE', '1ZZ-FE'], transmissions: ['Manual', 'Auto'] },
    ],
  },
  {
    vehicleType: 'car',
    make: 'Mazda',
    models: [
      { name: 'RX-7', generations: ['FB', 'FC', 'FD'], trims: ['GT-X', 'Spirit R', 'Type RZ'], bodyStyles: ['Coupe'], drivetrains: ['RWD'], engines: ['13B', '13B-REW'], transmissions: ['Manual', 'Auto'] },
      { name: 'MX-5', generations: ['NA', 'NB', 'NC', 'ND'], trims: ['Base', 'Club', 'GT', 'RF'], bodyStyles: ['Roadster', 'Targa'], drivetrains: ['RWD'], engines: ['B6', 'BP', 'LF', 'Skyactiv-G'], transmissions: ['Manual', 'Auto'] },
      { name: 'Mazda3', generations: ['BK', 'BL', 'BM', 'BP'], trims: ['SP23', 'MPS', 'Astina'], bodyStyles: ['Sedan', 'Hatch'], drivetrains: ['FWD', 'AWD'], engines: ['MZR', '2.3 Turbo'], transmissions: ['Manual', 'Auto'] },
    ],
  },
  {
    vehicleType: 'car',
    make: 'Subaru',
    models: [
      { name: 'Impreza WRX', generations: ['GC8', 'GD', 'GR', 'VA', 'VB'], trims: ['WRX', 'WRX STI', 'tS'], specialEditions: ['22B', 'Spec C', 'S209'], bodyStyles: ['Sedan', 'Hatch'], drivetrains: ['AWD'], engines: ['EJ20', 'EJ25', 'FA24'], transmissions: ['Manual', 'Auto'] },
      { name: 'BRZ', generations: ['ZC6', 'ZD8'], trims: ['S', 'tS', 'STI Sport'], bodyStyles: ['Coupe'], drivetrains: ['RWD'], engines: ['FA20', 'FA24'], transmissions: ['Manual', 'Auto'] },
      { name: 'Liberty', generations: ['BL', 'BP', 'BM', 'BN'], trims: ['GT', '3.0R', 'Spec B'], bodyStyles: ['Sedan', 'Wagon'], drivetrains: ['AWD'], engines: ['EJ20 Turbo', 'EZ30'], transmissions: ['Manual', 'Auto'] },
    ],
  },
  {
    vehicleType: 'car',
    make: 'Mitsubishi',
    models: [
      { name: 'Lancer Evolution', generations: ['I-III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'], trims: ['GSR', 'RS', 'MR'], specialEditions: ['Tommi Makinen Edition', 'FQ', 'Final Edition'], bodyStyles: ['Sedan'], drivetrains: ['AWD'], engines: ['4G63', '4B11T'], transmissions: ['Manual', 'SST'] },
      { name: 'Pajero', generations: ['NH-NL', 'NM-NP', 'NS-NT', 'NX'], trims: ['GLX', 'Exceed'], bodyStyles: ['Wagon'], drivetrains: ['4x4'], engines: ['3.2 Diesel', '3.8 V6'], transmissions: ['Manual', 'Auto'] },
      { name: 'Triton', generations: ['MQ', 'MR', 'MV'], trims: ['GLX', 'GLS', 'GSR'], bodyStyles: ['Single Cab', 'Dual Cab'], drivetrains: ['4x2', '4x4'], engines: ['2.4 Diesel'], transmissions: ['Manual', 'Auto'] },
    ],
  },
  {
    vehicleType: 'car',
    make: 'Honda',
    models: [
      { name: 'Civic', generations: ['EG', 'EK', 'EP3', 'FN2', 'FK2', 'FK8', 'FL5'], trims: ['VTi-R', 'SiR', 'Type R', 'RS'], bodyStyles: ['Hatch', 'Sedan'], drivetrains: ['FWD'], engines: ['B16', 'B18C', 'K20', 'K24', 'L15T'], transmissions: ['Manual', 'Auto'] },
      { name: 'Integra', generations: ['DC2', 'DC5'], trims: ['Type R', 'Luxury', 'Type S'], bodyStyles: ['Coupe'], drivetrains: ['FWD'], engines: ['B18C', 'K20A'], transmissions: ['Manual', 'Auto'] },
      { name: 'S2000', generations: ['AP1', 'AP2'], trims: ['Base', 'GT'], bodyStyles: ['Roadster'], drivetrains: ['RWD'], engines: ['F20C', 'F22C'], transmissions: ['Manual'] },
    ],
  },
  {
    vehicleType: 'car',
    make: 'BMW',
    models: [
      { name: '3 Series', generations: ['E30', 'E36', 'E46', 'E90', 'F80', 'G80'], trims: ['325i', '328i', '335i', 'M3'], specialEditions: ['CSL', 'Competition', 'GTS'], bodyStyles: ['Sedan', 'Coupe', 'Touring'], drivetrains: ['RWD', 'AWD'], engines: ['S14', 'S54', 'N54', 'S55', 'S58'], transmissions: ['Manual', 'DCT', 'Auto'] },
      { name: '1 Series', generations: ['E82', 'F20', 'F40'], trims: ['135i', '1M', 'M140i', 'M135i'], bodyStyles: ['Coupe', 'Hatch'], drivetrains: ['RWD', 'AWD'], engines: ['N54', 'N55', 'B58'], transmissions: ['Manual', 'Auto', 'DCT'] },
    ],
  },
  {
    vehicleType: 'car',
    make: 'Hyundai',
    models: [
      { name: 'i30 N', generations: ['PD', 'CN7'], trims: ['Hatch', 'Fastback', 'Sedan N'], bodyStyles: ['Hatch', 'Fastback', 'Sedan'], drivetrains: ['FWD'], engines: ['2.0T'], transmissions: ['Manual', 'DCT'] },
      { name: 'Genesis Coupe', generations: ['BK'], trims: ['GT', 'Ultimate'], bodyStyles: ['Coupe'], drivetrains: ['RWD'], engines: ['2.0T', '3.8 V6'], transmissions: ['Manual', 'Auto'] },
    ],
  },
  {
    vehicleType: 'bike',
    make: 'Yamaha',
    models: [
      { name: 'YZF-R1', trims: ['Base', 'M'], engines: ['998cc'], transmissions: ['Manual'] },
      { name: 'MT-09', trims: ['Base', 'SP'], engines: ['890cc'], transmissions: ['Manual'] },
      { name: 'WR450F', trims: ['Base'], engines: ['450cc'], transmissions: ['Manual'] },
    ],
  },
  {
    vehicleType: 'bike',
    make: 'Kawasaki',
    models: [
      { name: 'Ninja ZX-10R', trims: ['Base', 'KRT'], engines: ['998cc'], transmissions: ['Manual'] },
      { name: 'Ninja 400', trims: ['Base', 'KRT'], engines: ['399cc'], transmissions: ['Manual'] },
      { name: 'Z900', trims: ['Base', 'SE'], engines: ['948cc'], transmissions: ['Manual'] },
    ],
  },
  {
    vehicleType: 'bike',
    make: 'Ducati',
    models: [
      { name: 'Panigale', trims: ['V2', 'V4', 'V4 S'], engines: ['955cc', '1103cc'], transmissions: ['Manual'] },
      { name: 'Streetfighter', trims: ['V2', 'V4 S'], engines: ['955cc', '1103cc'], transmissions: ['Manual'] },
    ],
  },
  {
    vehicleType: 'truck',
    make: 'Isuzu',
    models: [
      { name: 'D-MAX', generations: ['RG'], trims: ['LS-U', 'X-Terrain', 'Blade'], bodyStyles: ['Dual Cab', 'Single Cab'], drivetrains: ['4x2', '4x4'], engines: ['3.0 Diesel'], transmissions: ['Manual', 'Auto'] },
      { name: 'MU-X', generations: ['RJ'], trims: ['LS-M', 'LS-U', 'LS-T'], bodyStyles: ['Wagon'], drivetrains: ['4x4'], engines: ['3.0 Diesel'], transmissions: ['Auto'] },
    ],
  },
  {
    vehicleType: 'truck',
    make: 'Chevrolet',
    models: [
      { name: 'Silverado', generations: ['T1'], trims: ['1500 LTZ', '1500 ZR2'], bodyStyles: ['Pickup'], drivetrains: ['4x4'], engines: ['6.2 V8', '3.0 Diesel'], transmissions: ['Auto'] },
    ],
  },

  {
    vehicleType: 'car',
    make: 'Mercedes-Benz',
    models: [
      { name: 'C-Class', generations: ['W201', 'W202', 'W203', 'W204', 'W205', 'W206'], trims: ['C63 AMG', 'C43 AMG', 'C200', 'C300'], specialEditions: ['Black Series', 'Edition 1'], bodyStyles: ['Sedan', 'Coupe', 'Wagon'], drivetrains: ['RWD', 'AWD'], engines: ['M156', 'M177', 'M139', 'M274'], transmissions: ['Auto'] },
      { name: 'A-Class', generations: ['W176', 'W177'], trims: ['A45 AMG', 'A35 AMG', 'A250'], specialEditions: ['Edition 1'], bodyStyles: ['Hatch', 'Sedan'], drivetrains: ['AWD', 'FWD'], engines: ['M133', 'M139'], transmissions: ['DCT'] },
    ],
  },
  {
    vehicleType: 'car',
    make: 'Audi',
    models: [
      { name: 'A4 / S4 / RS4', generations: ['B5', 'B6', 'B7', 'B8', 'B9'], trims: ['A4', 'S4', 'RS4'], specialEditions: ['Competition', 'Avant'], bodyStyles: ['Sedan', 'Avant'], drivetrains: ['FWD', 'Quattro'], engines: ['1.8T', '2.0TFSI', '2.7 BiTurbo', '4.2 V8', '2.9 TFSI'], transmissions: ['Manual', 'Auto', 'DSG'] },
      { name: 'TT / TTS / TT RS', generations: ['8N', '8J', '8S'], trims: ['TT', 'TTS', 'TT RS'], bodyStyles: ['Coupe', 'Roadster'], drivetrains: ['FWD', 'Quattro'], engines: ['1.8T', '2.0TFSI', '2.5 TFSI'], transmissions: ['Manual', 'DSG'] },
    ],
  },
  {
    vehicleType: 'car',
    make: 'Volkswagen',
    models: [
      { name: 'Golf', generations: ['Mk1', 'Mk2', 'Mk3', 'Mk4', 'Mk5', 'Mk6', 'Mk7', 'Mk8'], trims: ['GTI', 'R', 'Clubsport'], specialEditions: ['Edition 35', '40 Years', 'TCR'], bodyStyles: ['Hatch', 'Wagon'], drivetrains: ['FWD', 'AWD'], engines: ['EA113', 'EA888', 'VR6'], transmissions: ['Manual', 'DSG'] },
      { name: 'Amarok', generations: ['2H', 'NF'], trims: ['Core', 'Highline', 'Aventura', 'W580'], bodyStyles: ['Dual Cab'], drivetrains: ['4x4'], engines: ['2.0 BiTDI', 'V6 TDI'], transmissions: ['Manual', 'Auto'] },
    ],
  },
  {
    vehicleType: 'car',
    make: 'Porsche',
    models: [
      { name: '911', generations: ['964', '993', '996', '997', '991', '992'], trims: ['Carrera', 'S', 'Turbo', 'GT3', 'GT3 RS', 'GT2 RS'], specialEditions: ['Touring', 'RS', 'Sport Classic', 'Dakar'], bodyStyles: ['Coupe', 'Targa', 'Convertible'], drivetrains: ['RWD', 'AWD'], engines: ['Mezger', '9A1', 'MA1', '9A2'], transmissions: ['Manual', 'PDK'] },
      { name: 'Cayman / Boxster', generations: ['987', '981', '718'], trims: ['S', 'GTS', 'GT4', 'Spyder'], specialEditions: ['RS', '25 Years'], bodyStyles: ['Coupe', 'Roadster'], drivetrains: ['RWD'], engines: ['Flat-6', 'Flat-4 Turbo'], transmissions: ['Manual', 'PDK'] },
    ],
  },
  {
    vehicleType: 'car',
    make: 'Chevrolet',
    models: [
      { name: 'Corvette', generations: ['C3', 'C4', 'C5', 'C6', 'C7', 'C8'], trims: ['Stingray', 'Z06', 'ZR1', 'Grand Sport'], specialEditions: ['Z07', '70th Anniversary'], bodyStyles: ['Coupe', 'Convertible'], drivetrains: ['RWD'], engines: ['LS1', 'LS3', 'LS7', 'LT2', 'LT6'], transmissions: ['Manual', 'Auto', 'DCT'] },
      { name: 'Camaro', generations: ['3rd Gen', '4th Gen', '5th Gen', '6th Gen'], trims: ['SS', 'ZL1', 'Z/28'], specialEditions: ['1LE'], bodyStyles: ['Coupe', 'Convertible'], drivetrains: ['RWD'], engines: ['LS1', 'LS3', 'LT1', 'LT4'], transmissions: ['Manual', 'Auto'] },
    ],
  },
  {
    vehicleType: 'car',
    make: 'Dodge',
    models: [
      { name: 'Challenger', generations: ['LC', 'LA'], trims: ['R/T', 'Scat Pack', 'Hellcat', 'Redeye'], specialEditions: ['Demon', 'Super Stock', 'Shakedown'], bodyStyles: ['Coupe'], drivetrains: ['RWD'], engines: ['5.7 Hemi', '6.4 Hemi', '6.2 Supercharged'], transmissions: ['Manual', 'Auto'] },
      { name: 'Charger', generations: ['LX', 'LD'], trims: ['R/T', 'Scat Pack', 'Hellcat'], specialEditions: ['Daytona'], bodyStyles: ['Sedan'], drivetrains: ['RWD', 'AWD'], engines: ['5.7 Hemi', '6.4 Hemi', '6.2 Supercharged'], transmissions: ['Auto'] },
    ],
  },
  {
    vehicleType: 'bike',
    make: 'Suzuki',
    models: [
      { name: 'GSX-R1000', trims: ['Base', 'R'], engines: ['999cc'], transmissions: ['Manual'] },
      { name: 'Hayabusa', trims: ['Gen 1', 'Gen 2', 'Gen 3'], engines: ['1299cc', '1340cc'], transmissions: ['Manual'] },
    ],
  },
  {
    vehicleType: 'bike',
    make: 'Harley-Davidson',
    models: [
      { name: 'Sportster', trims: ['Iron 883', 'Forty-Eight', 'S'], engines: ['883cc', '1200cc', 'Revolution Max'], transmissions: ['Manual'] },
      { name: 'Low Rider', trims: ['S', 'ST'], engines: ['Milwaukee-Eight 117'], transmissions: ['Manual'] },
    ],
  },
];

export const buildStages = ['Concept', 'Collecting parts', 'Under rebuild', 'Street setup', 'Track setup', 'Show build', 'Dialled in', 'Sold'];
export const ownershipStatuses = ['Current owner', 'Previous owner', 'Shared build', 'Workshop car', 'For sale'];
export const purposeTags = ['Street', 'Track', 'Drag', 'Drift', 'Show', 'Media', 'Weekend', 'Daily', 'Off-road', 'Touring'];
export const setupTags = ['Bagged', 'Coilovers', 'Air-to-air', 'Turbo', 'Supercharged', 'NA', 'Widebody', 'OEM+', 'Forged', 'Track tyre'];

export function makeOptions(vehicleType: 'car' | 'bike' | 'truck' | 'other') {
  return vehicleRegistry.filter((item) => item.vehicleType === vehicleType).map((item) => item.make).sort();
}

export function findMake(vehicleType: 'car' | 'bike' | 'truck' | 'other', make: string) {
  return vehicleRegistry.find((item) => item.vehicleType === vehicleType && item.make.toLowerCase() === make.toLowerCase());
}

export function findModel(vehicleType: 'car' | 'bike' | 'truck' | 'other', make: string, model: string) {
  return findMake(vehicleType, make)?.models.find((item) => item.name.toLowerCase() === model.toLowerCase());
}
