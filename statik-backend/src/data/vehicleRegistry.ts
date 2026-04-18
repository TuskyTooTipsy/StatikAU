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
    regionMarkets?: string[];
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


const supplementalVehicleRegistry: VehicleRegistryNode[] = [
  {
    "vehicleType": "car",
    "make": "HSV",
    "models": [
      {
        "name": "Clubsport",
        "generations": [
          "VN-VP",
          "VR-VS",
          "VT-VX",
          "VY-VZ",
          "E Series",
          "Gen-F"
        ],
        "trims": [
          "Clubsport",
          "R8",
          "LSA"
        ],
        "specialEditions": [
          "GTSR",
          "SV Black"
        ],
        "bodyStyles": [
          "Sedan",
          "Wagon"
        ],
        "drivetrains": [
          "RWD"
        ],
        "engines": [
          "5.0 Holden V8",
          "LS1",
          "LS2",
          "LS3",
          "LSA"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "GTS",
        "generations": [
          "VN-VP",
          "VR-VS",
          "VT-VX",
          "VY-VZ",
          "E Series",
          "Gen-F"
        ],
        "trims": [
          "GTS",
          "GTS 300",
          "GTS LSA"
        ],
        "specialEditions": [
          "GTSR",
          "W1"
        ],
        "bodyStyles": [
          "Sedan"
        ],
        "drivetrains": [
          "RWD"
        ],
        "engines": [
          "5.7 Stroker",
          "C4B",
          "LS2",
          "LS3",
          "LSA"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Maloo",
        "generations": [
          "VG",
          "VR-VS",
          "VU",
          "VY-VZ",
          "E Series",
          "Gen-F"
        ],
        "trims": [
          "Maloo",
          "R8",
          "LSA"
        ],
        "specialEditions": [
          "GTSR Maloo",
          "30 Years"
        ],
        "bodyStyles": [
          "Ute"
        ],
        "drivetrains": [
          "RWD"
        ],
        "engines": [
          "5.0 V8",
          "LS1",
          "LS2",
          "LS3",
          "LSA"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Senator",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Grange",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "W427",
        "generations": [
          "VE"
        ],
        "trims": [
          "W427"
        ],
        "specialEditions": [
          "Limited Edition"
        ],
        "bodyStyles": [
          "Sedan"
        ],
        "drivetrains": [
          "RWD"
        ],
        "engines": [
          "LS7"
        ],
        "transmissions": [
          "Manual"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Ford Australia",
    "models": [
      {
        "name": "Falcon",
        "generations": [
          "XR-XT-XW-XY",
          "XA-XB-XC",
          "XD-XE-XF",
          "EA-ED",
          "EF-EL",
          "AU",
          "BA-BF",
          "FG",
          "FG X"
        ],
        "trims": [
          "GL",
          "Futura",
          "Fairmont",
          "XR6",
          "XR6 Turbo",
          "XR8",
          "G6E",
          "G6E Turbo"
        ],
        "specialEditions": [
          "Sprint",
          "Cobra",
          "HO-style",
          "Bathurst"
        ],
        "bodyStyles": [
          "Sedan",
          "Wagon",
          "Ute"
        ],
        "drivetrains": [
          "RWD"
        ],
        "engines": [
          "Windsor V8",
          "Cleveland V8",
          "Barra I6",
          "Boss V8",
          "Miami V8"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Fairmont",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Fairlane",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "LTD",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Territory",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Laser",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Focus",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Fiesta",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Mondeo",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Mustang",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Ranger",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Everest",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "F-Series",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "FPV",
    "models": [
      {
        "name": "GT",
        "generations": [
          "BA",
          "BF",
          "FG",
          "FG X"
        ],
        "trims": [
          "GT",
          "GT-P",
          "GT-E"
        ],
        "specialEditions": [
          "GT-F 351",
          "Cobra"
        ],
        "bodyStyles": [
          "Sedan"
        ],
        "drivetrains": [
          "RWD"
        ],
        "engines": [
          "Boss 290",
          "Boss 315",
          "Miami 5.0"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "F6 Typhoon",
        "generations": [
          "BA",
          "BF",
          "FG"
        ],
        "trims": [
          "F6",
          "F6 Typhoon"
        ],
        "specialEditions": [],
        "bodyStyles": [
          "Sedan"
        ],
        "drivetrains": [
          "RWD"
        ],
        "engines": [
          "Barra Turbo"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "F6 Tornado",
        "generations": [
          "BA",
          "BF"
        ],
        "trims": [
          "F6 Tornado"
        ],
        "specialEditions": [],
        "bodyStyles": [
          "Ute"
        ],
        "drivetrains": [
          "RWD"
        ],
        "engines": [
          "Barra Turbo"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "GS",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Pursuit",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Super Pursuit",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Tickford",
    "models": [
      {
        "name": "T-Series",
        "generations": [
          "AU"
        ],
        "trims": [
          "TE50",
          "TS50",
          "TL50"
        ],
        "specialEditions": [],
        "bodyStyles": [
          "Sedan"
        ],
        "drivetrains": [
          "RWD"
        ],
        "engines": [
          "Windsor V8"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "XR variants",
        "generations": [
          "EL",
          "AU"
        ],
        "trims": [
          "XR6 Tickford",
          "XR8 Tickford"
        ],
        "specialEditions": [],
        "bodyStyles": [
          "Sedan",
          "Ute"
        ],
        "drivetrains": [
          "RWD"
        ],
        "engines": [
          "I6",
          "V8"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Hyundai N",
    "models": [
      {
        "name": "i20 N",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "i30 N",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Kona N",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Elantra N / i30 Sedan N",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Veloster N",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Kia performance",
    "models": [
      {
        "name": "Stinger",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Cerato GT",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Picanto GT",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "EV6 GT",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "BMW",
    "models": [
      {
        "name": "1 Series",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "2 Series",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "3 Series",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "4 Series",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "5 Series",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "M2",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "M3",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "M4",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "M5",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Z3 / Z4",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "X5 M",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Mercedes-Benz",
    "models": [
      {
        "name": "A-Class",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "C-Class",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "E-Class",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "CLA",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "CLK",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "SLK/SLC",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "AMG GT",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "G-Class",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "CLS",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "AMG",
    "models": [
      {
        "name": "A45",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "C43",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "C63",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "E63",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "GT",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Black Series",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "G63",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Audi",
    "models": [
      {
        "name": "A3 / S3 / RS3",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "A4 / S4 / RS4",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "A5 / S5 / RS5",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "A6 / S6 / RS6",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "TT / TTS / TT RS",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "R8",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Q5 / SQ5",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Q7 / SQ7",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Volkswagen",
    "models": [
      {
        "name": "Golf",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Polo",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Scirocco",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Passat R36",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Arteon",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Jetta / Bora",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Amarok",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Porsche",
    "models": [
      {
        "name": "911",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Cayman",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Boxster",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Panamera",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Macan",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Cayenne",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Taycan",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Lexus",
    "models": [
      {
        "name": "IS",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "RC",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "GS",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "LC",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "LFA",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "LS",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "LX",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "GX",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Infiniti",
    "models": [
      {
        "name": "G35/G37",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Q50",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Q60",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "FX/QX70",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "M/Q70",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Volvo",
    "models": [
      {
        "name": "240",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "850",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "S60",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "V60",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "S90",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "XC60",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "XC90",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Peugeot",
    "models": [
      {
        "name": "205 GTI",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "206 GTI",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "208 GTI",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "306 GTI-6",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "308 GTI",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "RCZ",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Renault",
    "models": [
      {
        "name": "Clio RS",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Megane RS",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "R5 Turbo",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Alpine A110",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Alfa Romeo",
    "models": [
      {
        "name": "Giulia",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Giulietta",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "147 GTA",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "156 GTA",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "4C",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Stelvio Quadrifoglio",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Fiat/Abarth",
    "models": [
      {
        "name": "500 Abarth",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "595",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "695",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "124 Spider",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Punto Abarth",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Mini",
    "models": [
      {
        "name": "Cooper S",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "John Cooper Works",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Clubman JCW",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Countryman JCW",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "MG",
    "models": [
      {
        "name": "MG3",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "MG4 XPower",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "MG ZS",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "MG Cyberster",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "MGB",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Tesla",
    "models": [
      {
        "name": "Model 3",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Model Y",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Model S",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Model X",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Cybertruck",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "BYD",
    "models": [
      {
        "name": "Atto 3",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Seal",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Dolphin",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Shark 6",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Tang",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Polestar",
    "models": [
      {
        "name": "Polestar 2",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Polestar 3",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Polestar 4",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Polestar 1",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Lotus",
    "models": [
      {
        "name": "Elise",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Exige",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Evora",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Emira",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Esprit",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Eletre",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "McLaren",
    "models": [
      {
        "name": "MP4-12C",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "570S",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "600LT",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "720S",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "765LT",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Artura",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Ferrari",
    "models": [
      {
        "name": "308/328",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "F355",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "360",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "430",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "458",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "488",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "F8",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Roma",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "812",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Lamborghini",
    "models": [
      {
        "name": "Gallardo",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Huracan",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Aventador",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Murcielago",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Urus",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Countach",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Maserati",
    "models": [
      {
        "name": "GranTurismo",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Ghibli",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Quattroporte",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "MC20",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Levante",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Aston Martin",
    "models": [
      {
        "name": "Vantage",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "DB9",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "DB11",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "DB12",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "DBS",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Rapide",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Bentley",
    "models": [
      {
        "name": "Continental GT",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Flying Spur",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Bentayga",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Mulsanne",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Rolls-Royce",
    "models": [
      {
        "name": "Ghost",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Phantom",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Wraith",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Dawn",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Cullinan",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Land Rover",
    "models": [
      {
        "name": "Defender",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Discovery",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Range Rover Sport",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Freelander",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Range Rover",
    "models": [
      {
        "name": "Range Rover",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Sport",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Velar",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Evoque",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Classic",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Jeep",
    "models": [
      {
        "name": "Wrangler",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Grand Cherokee",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Cherokee",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Gladiator",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Compass",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Chevrolet",
    "models": [
      {
        "name": "Corvette",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Camaro",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Impala",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Chevelle",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Nova",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "C10",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Silverado",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "SS",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Dodge",
    "models": [
      {
        "name": "Challenger",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Charger",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Viper",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Dart",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Durango SRT",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Ram SRT-10",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "RAM",
    "models": [
      {
        "name": "1500",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "2500",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "3500",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "TRX",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Warlock",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "GMC",
    "models": [
      {
        "name": "Sierra",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Yukon",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Syclone",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Typhoon",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Canyon",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Cadillac",
    "models": [
      {
        "name": "CTS-V",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "ATS-V",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "CT4-V",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "CT5-V Blackwing",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Escalade",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Lincoln",
    "models": [
      {
        "name": "Continental",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Navigator",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Mark VIII",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Town Car",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Genesis",
    "models": [
      {
        "name": "G70",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "G80",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "G90",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "GV70",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "GV80",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Smart",
    "models": [
      {
        "name": "Fortwo",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Roadster",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Forfour",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Skoda",
    "models": [
      {
        "name": "Octavia RS",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Fabia RS",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Superb",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Kodiaq RS",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Cupra",
    "models": [
      {
        "name": "Leon",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Formentor",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Ateca",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Born",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Seat",
    "models": [
      {
        "name": "Leon Cupra",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Ibiza Cupra",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Toledo",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Opel",
    "models": [
      {
        "name": "Corsa OPC",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Astra OPC",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Insignia OPC",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Manta",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Citroen",
    "models": [
      {
        "name": "Saxo VTS",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "C2 VTS",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "DS3 Racing",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "C4 VTS",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Great Wall",
    "models": [
      {
        "name": "Cannon",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Steed",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Tank 300",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Tank 500",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Haval",
    "models": [
      {
        "name": "H6",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Jolion",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "H9",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "H6 GT",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Chery",
    "models": [
      {
        "name": "Omoda 5",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Tiggo 7",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Tiggo 8",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "J1",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "LDV",
    "models": [
      {
        "name": "T60",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "D90",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Deliver 9",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "G10",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "SsangYong / KGM",
    "models": [
      {
        "name": "Musso",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Rexton",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Korando",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Tivoli",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Mahindra",
    "models": [
      {
        "name": "Pik-Up",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Scorpio",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "XUV700",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Proton",
    "models": [
      {
        "name": "Satria GTI",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Jumbuck",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Persona",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Wira",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Perodua",
    "models": [
      {
        "name": "Kelisa",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Myvi",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Viva",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Kancil",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Saab",
    "models": [
      {
        "name": "900 Turbo",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "9-3 Aero",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "9-5 Aero",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Sonett",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Hummer",
    "models": [
      {
        "name": "H1",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "H2",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "H3",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "EV",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Pontiac",
    "models": [
      {
        "name": "Firebird",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "GTO",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Trans Am",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "G8",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Fiero",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Plymouth",
    "models": [
      {
        "name": "Barracuda",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Road Runner",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Duster",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Superbird",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Chrysler",
    "models": [
      {
        "name": "300C",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Valiant",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Charger",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Crossfire",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "PT Cruiser",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Acura",
    "models": [
      {
        "name": "Integra",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "RSX",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "NSX",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "TL Type-S",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "TSX",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Scion",
    "models": [
      {
        "name": "FR-S",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "tC",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "xB",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "xA",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Datsun",
    "models": [
      {
        "name": "240Z",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "260Z",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "280ZX",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "510",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "1600",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Sunny",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Daewoo",
    "models": [
      {
        "name": "Lanos",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Nubira",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Leganza",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Matiz",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Daihatsu",
    "models": [
      {
        "name": "Charade",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Mira",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Copen",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Feroza",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Rocky",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Rover",
    "models": [
      {
        "name": "Mini",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "SD1",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "75",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "MG ZT",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "TVR",
    "models": [
      {
        "name": "Griffith",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Chimaera",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Cerbera",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Tuscan",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Sagaris",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Noble",
    "models": [
      {
        "name": "M12",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "M400",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "M600",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Caterham",
    "models": [
      {
        "name": "Seven",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Super Seven",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "CSR",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Ariel",
    "models": [
      {
        "name": "Atom",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Nomad",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Hipercar",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Morgan",
    "models": [
      {
        "name": "Plus Four",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Plus Six",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "3 Wheeler",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Aero 8",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Isuzu",
    "models": [
      {
        "name": "Gemini",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Piazza",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "D-MAX",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "MU-X",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Suzuki",
    "models": [
      {
        "name": "Swift Sport",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Jimny",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Vitara",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Sierra",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Cappuccino",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Koenigsegg",
    "models": [
      {
        "name": "CCX",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Agera",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Regera",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Jesko",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Gemera",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Pagani",
    "models": [
      {
        "name": "Zonda",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Huayra",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Utopia",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Bugatti",
    "models": [
      {
        "name": "Veyron",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Chiron",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Divo",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Bolide",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Rimac",
    "models": [
      {
        "name": "Nevera",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Concept One",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Lucid",
    "models": [
      {
        "name": "Air",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Gravity",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Rivian",
    "models": [
      {
        "name": "R1T",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "R1S",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "car",
    "make": "Opel / Vauxhall",
    "models": [
      {
        "name": "Astra VXR",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Corsa VXR",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Monaro VXR",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Insignia VXR",
        "generations": [
          "Classic",
          "Modern"
        ],
        "trims": [
          "Base",
          "Sport",
          "Performance",
          "Premium"
        ],
        "specialEditions": [
          "RS",
          "GT",
          "Competition",
          "Limited",
          "Special Edition"
        ],
        "bodyStyles": [
          "Coupe",
          "Sedan",
          "Hatch"
        ],
        "drivetrains": [
          "FWD",
          "RWD",
          "AWD"
        ],
        "engines": [
          "Factory engine",
          "Performance engine"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "Yamaha",
    "models": [
      {
        "name": "YZF-R1",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "YZF-R6",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "MT-09",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "MT-07",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "XSR900",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "WR450F",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Tenere 700",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "Kawasaki",
    "models": [
      {
        "name": "Ninja ZX-10R",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Ninja ZX-6R",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Ninja 400",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Z900",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Z H2",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "KLR650",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "KX450",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "Suzuki",
    "models": [
      {
        "name": "GSX-R1000",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "GSX-R750",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Hayabusa",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "GSX-S1000",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "DR-Z400",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "RM-Z450",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "Honda",
    "models": [
      {
        "name": "CBR1000RR",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "CBR600RR",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "CB650R",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "CRF450R",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Africa Twin",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Grom",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "Ducati",
    "models": [
      {
        "name": "Panigale V2",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Panigale V4",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Streetfighter V4",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Monster",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Multistrada",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Diavel",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "Harley-Davidson",
    "models": [
      {
        "name": "Sportster",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Low Rider S",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Low Rider ST",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Fat Boy",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Street Glide",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Road Glide",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "BMW Motorrad",
    "models": [
      {
        "name": "S 1000 RR",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "M 1000 RR",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "R 1250 GS",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "R nineT",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "F 900 R",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "Triumph",
    "models": [
      {
        "name": "Street Triple",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Speed Triple",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Bonneville",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Thruxton",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Tiger",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Rocket 3",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "KTM",
    "models": [
      {
        "name": "Duke 390",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Duke 790",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Duke 890",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Super Duke R",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "RC 390",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "EXC-F",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "Husqvarna",
    "models": [
      {
        "name": "Vitpilen",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Svartpilen",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "FE 501",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "TE 300",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Norden 901",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "Aprilia",
    "models": [
      {
        "name": "RSV4",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Tuono V4",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "RS 660",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Tuareg 660",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Dorsoduro",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "Moto Guzzi",
    "models": [
      {
        "name": "V7",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "V85 TT",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "California",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Le Mans",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Mandello",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "Royal Enfield",
    "models": [
      {
        "name": "Interceptor 650",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Continental GT",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Himalayan",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Classic 350",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Bullet",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "Indian",
    "models": [
      {
        "name": "Scout",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Chief",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "FTR",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Challenger",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Roadmaster",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "MV Agusta",
    "models": [
      {
        "name": "F4",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "F3",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Brutale",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Dragster",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Turismo Veloce",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "Benelli",
    "models": [
      {
        "name": "TNT",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Leoncino",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "TRK 502",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Tornado",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "CFMoto",
    "models": [
      {
        "name": "450SR",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "650NK",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "800MT",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Papio",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "300SR",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "Kymco",
    "models": [
      {
        "name": "AK550",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Downtown",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Agility",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Like",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "Vespa",
    "models": [
      {
        "name": "Primavera",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Sprint",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "GTS",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "PX",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "Piaggio",
    "models": [
      {
        "name": "Beverly",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "MP3",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Liberty",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Zip",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "Can-Am",
    "models": [
      {
        "name": "Ryker",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Spyder F3",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Spyder RT",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Maverick",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "Buell",
    "models": [
      {
        "name": "XB12R",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "1125R",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "Hammerhead",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "bike",
    "make": "Bimota",
    "models": [
      {
        "name": "Tesi",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "DB7",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      },
      {
        "name": "KB4",
        "generations": [
          "Current",
          "Previous"
        ],
        "trims": [
          "Base",
          "S",
          "R",
          "SP",
          "Factory"
        ],
        "specialEditions": [
          "Limited",
          "Anniversary"
        ],
        "bodyStyles": [
          "Sport",
          "Naked",
          "Adventure",
          "Cruiser"
        ],
        "drivetrains": [
          "Chain drive",
          "Shaft drive",
          "Belt drive"
        ],
        "engines": [
          "Factory engine"
        ],
        "transmissions": [
          "Manual",
          "DCT",
          "CVT"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Toyota",
    "models": [
      {
        "name": "LandCruiser",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Hilux",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Prado",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Fortuner",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "HiAce",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Nissan",
    "models": [
      {
        "name": "Patrol",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Navara",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Titan",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Pathfinder",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "X-Trail",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Ford",
    "models": [
      {
        "name": "Ranger",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Everest",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "F-150",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "F-250",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Bronco",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Isuzu",
    "models": [
      {
        "name": "D-MAX",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "MU-X",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "N-Series",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "F-Series",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Mazda",
    "models": [
      {
        "name": "BT-50",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "B-Series",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "CX-5",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "CX-9",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Mitsubishi",
    "models": [
      {
        "name": "Triton",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Pajero",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Pajero Sport",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Delica",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Holden",
    "models": [
      {
        "name": "Colorado",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Rodeo",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Jackaroo",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Trailblazer",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Jeep",
    "models": [
      {
        "name": "Wrangler",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Gladiator",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Grand Cherokee",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Cherokee",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Land Rover",
    "models": [
      {
        "name": "Defender",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Discovery",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Range Rover",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Freelander",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Range Rover",
    "models": [
      {
        "name": "Classic",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Sport",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Vogue",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Velar",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "RAM",
    "models": [
      {
        "name": "1500",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "2500",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "3500",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "TRX",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Chevrolet",
    "models": [
      {
        "name": "Silverado",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Colorado",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Tahoe",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Suburban",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "GMC",
    "models": [
      {
        "name": "Sierra",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Canyon",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Yukon",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Hummer EV",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Mercedes-Benz",
    "models": [
      {
        "name": "X-Class",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "G-Class",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Sprinter",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Vito",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Volkswagen",
    "models": [
      {
        "name": "Amarok",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Transporter",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Crafter",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Touareg",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Iveco",
    "models": [
      {
        "name": "Daily",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Eurocargo",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "S-Way",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Hino",
    "models": [
      {
        "name": "300 Series",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "500 Series",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "700 Series",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Fuso",
    "models": [
      {
        "name": "Canter",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Fighter",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Shogun",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Kenworth",
    "models": [
      {
        "name": "T409",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "T610",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "T909",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "K200",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Mack",
    "models": [
      {
        "name": "Anthem",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Super-Liner",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Trident",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Granite",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Volvo Trucks",
    "models": [
      {
        "name": "FH",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "FM",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "FL",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "FE",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Scania",
    "models": [
      {
        "name": "R-Series",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "S-Series",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "P-Series",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "G-Series",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "MAN",
    "models": [
      {
        "name": "TGS",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "TGX",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "TGM",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "TGL",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Great Wall",
    "models": [
      {
        "name": "Cannon",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Steed",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Tank 300",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Tank 500",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Haval",
    "models": [
      {
        "name": "H6",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "H9",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Jolion",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "LDV",
    "models": [
      {
        "name": "T60",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "D90",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Deliver 9",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "G10",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Mahindra",
    "models": [
      {
        "name": "Pik-Up",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Scorpio",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "XUV700",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "truck",
    "make": "Suzuki",
    "models": [
      {
        "name": "Jimny",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Sierra",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Vitara",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      },
      {
        "name": "Grand Vitara",
        "generations": [
          "Classic",
          "Current"
        ],
        "trims": [
          "Base",
          "Workmate",
          "SR",
          "Sport",
          "Premium",
          "Raptor",
          "Warrior"
        ],
        "specialEditions": [
          "Limited",
          "Heritage",
          "Adventure"
        ],
        "bodyStyles": [
          "Single Cab",
          "Extra Cab",
          "Dual Cab",
          "Wagon",
          "Van"
        ],
        "drivetrains": [
          "4x2",
          "4x4",
          "AWD"
        ],
        "engines": [
          "Petrol",
          "Diesel",
          "Turbo Diesel",
          "Hybrid"
        ],
        "transmissions": [
          "Manual",
          "Auto"
        ]
      }
    ]
  },
  {
    "vehicleType": "other",
    "make": "Custom / Other",
    "models": [
      {
        "name": "One-off build",
        "generations": [
          "Custom"
        ],
        "trims": [
          "Custom"
        ],
        "specialEditions": [
          "Coachbuilt",
          "Kit car",
          "Prototype"
        ],
        "bodyStyles": [
          "Custom"
        ],
        "drivetrains": [
          "Custom"
        ],
        "engines": [
          "Custom"
        ],
        "transmissions": [
          "Custom"
        ]
      }
    ]
  }
];

function mergeVehicleRegistrySupplement() {
  for (const node of supplementalVehicleRegistry) {
    const existing = vehicleRegistry.find((item) => item.vehicleType === node.vehicleType && item.make.toLowerCase() === node.make.toLowerCase());
    if (!existing) {
      vehicleRegistry.push(node);
      continue;
    }
    const existingModelKeys = new Set(existing.models.map((model) => model.name.toLowerCase()));
    for (const incoming of node.models) {
      if (!existingModelKeys.has(incoming.name.toLowerCase())) {
        existing.models.push(incoming);
        existingModelKeys.add(incoming.name.toLowerCase());
      }
    }
  }
  vehicleRegistry.sort((a, b) => a.vehicleType.localeCompare(b.vehicleType) || a.make.localeCompare(b.make));
  vehicleRegistry.forEach((node) => node.models.sort((a, b) => a.name.localeCompare(b.name)));
}

mergeVehicleRegistrySupplement();

export const buildStages = ['Concept', 'Collecting parts', 'Under rebuild', 'Street setup', 'Track setup', 'Show build', 'Dialled in', 'Sold', 'Retired', 'Rebuild planned'];
export const ownershipStatuses = ['Current owner', 'Previous owner', 'Shared build', 'Workshop car', 'For sale', 'Customer build', 'Family build'];
export const purposeTags = ['Street', 'Track', 'Drag', 'Drift', 'Show', 'Media', 'Weekend', 'Daily', 'Off-road', 'Touring', 'Cruise', 'Ride day', 'Towing', 'Adventure'];
export const setupTags = ['Bagged', 'Coilovers', 'Air-to-air', 'Turbo', 'Twin turbo', 'Supercharged', 'NA', 'Widebody', 'OEM+', 'Forged', 'Track tyre', 'Semi slick', 'Big brake', 'Cage', 'Engine swap', 'Period correct'];

export function makeOptions(vehicleType: 'car' | 'bike' | 'truck' | 'other') {
  return vehicleRegistry.filter((item) => item.vehicleType === vehicleType).map((item) => item.make).sort();
}

export function findMake(vehicleType: 'car' | 'bike' | 'truck' | 'other', make: string) {
  return vehicleRegistry.find((item) => item.vehicleType === vehicleType && item.make.toLowerCase() === make.toLowerCase());
}

export function findModel(vehicleType: 'car' | 'bike' | 'truck' | 'other', make: string, model: string) {
  return findMake(vehicleType, make)?.models.find((item) => item.name.toLowerCase() === model.toLowerCase());
}
