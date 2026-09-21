import { PrismaClient, Role, UserStatus, VerificationStatus, Availability, RequestStatus, LocationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Sajilo Khoj...');

  // Clean existing tables in proper relational order
  await prisma.review.deleteMany();
  await prisma.serviceRequest.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.service.deleteMany();
  await prisma.technicianProfile.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.adminLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.locationItem.deleteMany();
  await prisma.siteSetting.deleteMany();

  console.log('🧹 Cleaned existing data.');

  // 1. Password Hashes
  const adminPassword = await bcrypt.hash('admin123', 10);
  const customerPassword = await bcrypt.hash('customer123', 10);
  const techPassword = await bcrypt.hash('tech123', 10);

  // 2. Create Site Settings
  await prisma.siteSetting.createMany({
    data: [
      { key: 'site_name', value: 'Sajilo Khoj', description: 'Platform branding name' },
      { key: 'tagline', value: 'Find Trusted Technicians Near You', description: 'Hero tagline' },
      { key: 'require_approval', value: 'true', description: 'Require admin approval before technicians appear publicly' },
      { key: 'support_phone', value: '+977-1-4567890', description: 'Helpline customer support' },
      { key: 'support_email', value: 'support@sajilokhoj.com', description: 'Customer support email' },
      { key: 'service_fee_percent', value: '0', description: 'Platform service commission percentage' },
    ],
  });

  // 3. Create Locations Hierarchy for Nepal
  const bagmati = await prisma.locationItem.create({
    data: { name: 'Bagmati Province', type: LocationType.PROVINCE },
  });
  const gandaki = await prisma.locationItem.create({
    data: { name: 'Gandaki Province', type: LocationType.PROVINCE },
  });
  const koshi = await prisma.locationItem.create({
    data: { name: 'Koshi Province', type: LocationType.PROVINCE },
  });
  const lumbini = await prisma.locationItem.create({
    data: { name: 'Lumbini Province', type: LocationType.PROVINCE },
  });

  // Districts
  const ktmDist = await prisma.locationItem.create({
    data: { name: 'Kathmandu', type: LocationType.DISTRICT, parentId: bagmati.id },
  });
  const lalitpurDist = await prisma.locationItem.create({
    data: { name: 'Lalitpur', type: LocationType.DISTRICT, parentId: bagmati.id },
  });
  const bhaktapurDist = await prisma.locationItem.create({
    data: { name: 'Bhaktapur', type: LocationType.DISTRICT, parentId: bagmati.id },
  });
  const kaskiDist = await prisma.locationItem.create({
    data: { name: 'Kaski (Pokhara)', type: LocationType.DISTRICT, parentId: gandaki.id },
  });
  const chitwanDist = await prisma.locationItem.create({
    data: { name: 'Chitwan', type: LocationType.DISTRICT, parentId: bagmati.id },
  });

  // Cities
  const ktmCity = await prisma.locationItem.create({
    data: { name: 'Kathmandu Metropolitan', type: LocationType.CITY, parentId: ktmDist.id },
  });
  const lalitpurCity = await prisma.locationItem.create({
    data: { name: 'Lalitpur Metropolitan', type: LocationType.CITY, parentId: lalitpurDist.id },
  });
  const bhaktapurCity = await prisma.locationItem.create({
    data: { name: 'Bhaktapur Municipality', type: LocationType.CITY, parentId: bhaktapurDist.id },
  });
  const pokharaCity = await prisma.locationItem.create({
    data: { name: 'Pokhara Metropolitan', type: LocationType.CITY, parentId: kaskiDist.id },
  });

  // Localities
  const localities = [
    { name: 'New Baneshwor', parentId: ktmCity.id },
    { name: 'Thamel', parentId: ktmCity.id },
    { name: 'Lazimpat', parentId: ktmCity.id },
    { name: 'Koteshwor', parentId: ktmCity.id },
    { name: 'Boudha', parentId: ktmCity.id },
    { name: 'Jhamsikhel', parentId: lalitpurCity.id },
    { name: 'Kupondole', parentId: lalitpurCity.id },
    { name: 'Patan Durbar Area', parentId: lalitpurCity.id },
    { name: 'Sanothimi', parentId: bhaktapurCity.id },
    { name: 'Lakeside', parentId: pokharaCity.id },
    { name: 'Mahendrapool', parentId: pokharaCity.id },
  ];
  for (const loc of localities) {
    await prisma.locationItem.create({
      data: { name: loc.name, type: LocationType.LOCALITY, parentId: loc.parentId },
    });
  }

  // 4. Create Categories
  const categoriesData = [
    {
      name: 'Plumbing',
      slug: 'plumbing',
      icon: 'Wrench',
      description: 'Pipe leakage repairs, bathroom sanitary installation, water tank cleaning, tap & valve fixes.',
    },
    {
      name: 'Electrical',
      slug: 'electrical',
      icon: 'Zap',
      description: 'House wiring, circuit breakers, switchboard repair, backup inverter & generator setup.',
    },
    {
      name: 'AC & HVAC',
      slug: 'ac-repair',
      icon: 'Wind',
      description: 'AC servicing, refrigerant gas refill, compressor repair, heating system installation.',
    },
    {
      name: 'Appliance Repair',
      slug: 'appliance-repair',
      icon: 'Tv',
      description: 'Washing machine, refrigerator, microwave oven, geyser, and water purifier diagnostics & repair.',
    },
    {
      name: 'Carpentry',
      slug: 'carpentry',
      icon: 'Hammer',
      description: 'Custom furniture, door lock installation, kitchen cabinets, wooden flooring & repairs.',
    },
    {
      name: 'Painting',
      slug: 'painting',
      icon: 'Paintbrush',
      description: 'Interior & exterior wall painting, waterproofing, texture coatings, drywall putty work.',
    },
    {
      name: 'Cleaning & Sanitation',
      slug: 'cleaning',
      icon: 'Sparkles',
      description: 'Deep house cleaning, sofa & carpet shampooing, water tank disinfection, move-in cleaning.',
    },
    {
      name: 'Handyman Services',
      slug: 'handyman',
      icon: 'Tool',
      description: 'General household repairs, TV wall mounting, curtain rod installation, shelf drilling.',
    },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.slug] = created.id;
  }

  // 5. Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      name: 'Sajilo Khoj Admin',
      email: 'admin@sajilokhoj.com',
      phone: '+977-9800000001',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  // 6. Create Customer Users
  const customer1 = await prisma.user.create({
    data: {
      name: 'Ram Shrestha',
      email: 'ram.shrestha@example.com',
      phone: '+977-9841234567',
      passwordHash: customerPassword,
      role: Role.CUSTOMER,
      status: UserStatus.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Sita Sharma',
      email: 'sita.sharma@example.com',
      phone: '+977-9851098765',
      passwordHash: customerPassword,
      role: Role.CUSTOMER,
      status: UserStatus.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      name: 'Bikash Gurung',
      email: 'bikash.gurung@example.com',
      phone: '+977-9801234890',
      passwordHash: customerPassword,
      role: Role.CUSTOMER,
      status: UserStatus.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    },
  });

  // 7. Create Technicians with rich profiles & services
  const techProfilesData = [
    {
      user: {
        name: 'Hari Bahadur Thapa',
        email: 'hari.plumber@example.com',
        phone: '+977-9841555111',
        passwordHash: techPassword,
        role: Role.TECHNICIAN,
        avatar: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&auto=format&fit=crop&q=80',
      },
      profile: {
        categoryId: categories['plumbing'],
        businessName: 'Thapa Plumbing & Sanitary Works',
        bio: 'Licensed Master Plumber with over 8 years of hands-on experience in residential and commercial plumbing throughout Kathmandu Valley. Specializes in rapid leak detection, sanitary bathroom fittings, high-pressure water tank pump installation, and drain unclogging.',
        experienceYears: 8,
        startingPrice: 500,
        hourlyRate: 600,
        skills: 'Pipe Welding, PPR / CPVC Piping, Leak Detection, Sanitary Ware, Submersible Pumps, Water Filtration',
        certifications: 'CTEVT Certified Master Plumber Level 2',
        profileImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1200&auto=format&fit=crop&q=80',
        workingHours: '7:00 AM - 8:00 PM (Everyday)',
        province: 'Bagmati Province',
        district: 'Kathmandu',
        city: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan',
        locality: 'New Baneshwor',
        address: 'Shankhamul Road, New Baneshwor, Ward No. 10',
        availability: Availability.AVAILABLE_NOW,
        verificationStatus: VerificationStatus.APPROVED,
        rating: 4.9,
        reviewCount: 28,
        isFeatured: true,
      },
      services: [
        { title: 'Emergency Pipe Leak Repair', price: 600, description: 'Rapid diagnosis and repair of burst, cracked, or leaking PPR, GI, or PVC pipes.' },
        { title: 'Tap & Bathroom Fixture Installation', price: 500, description: 'Fitting taps, mixers, showerheads, health faucets, and angle valves.' },
        { title: 'Complete Sanitary Commode & Basin Setup', price: 1500, description: 'Full installation and sealing of commodes, flush tanks, washbasins and vanity units.' },
        { title: 'Overhead Water Tank & Pump Plumbing', price: 2500, description: 'New water tank plumbing connections, automatic float switch, and pressure pump setup.' },
      ],
    },
    {
      user: {
        name: 'Suresh Maharjan',
        email: 'suresh.electric@example.com',
        phone: '+977-9851444222',
        passwordHash: techPassword,
        role: Role.TECHNICIAN,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      },
      profile: {
        categoryId: categories['electrical'],
        businessName: 'Maharjan Electrical & Solar Solutions',
        bio: 'Expert certified electrician serving Lalitpur and Kathmandu with 10 years of trusted experience. Specializing in complete home rewiring, short-circuit diagnostics, solar inverter backups, distribution box wiring, and LED lighting design.',
        experienceYears: 10,
        startingPrice: 600,
        hourlyRate: 750,
        skills: '3-Phase Wiring, Inverter / Solar Backup, DB Box Balancing, Short Circuit Troubleshooting, Smart Switches',
        certifications: 'Nepal Engineering Council Certified Electrician',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
        workingHours: '8:00 AM - 7:30 PM (Sun - Fri)',
        province: 'Bagmati Province',
        district: 'Lalitpur',
        city: 'Lalitpur',
        municipality: 'Lalitpur Metropolitan',
        locality: 'Jhamsikhel',
        address: 'Jhamsikhel Road, Near St. Marys School',
        availability: Availability.AVAILABLE_TODAY,
        verificationStatus: VerificationStatus.APPROVED,
        rating: 4.8,
        reviewCount: 34,
        isFeatured: true,
      },
      services: [
        { title: 'Short Circuit Diagnostic & Fuse Repair', price: 800, description: 'Quick troubleshooting of electrical trips, burnt wires, and main fuse failures.' },
        { title: 'MCB & Distribution Board Upgrade', price: 1200, description: 'Replacing outdated fuses with modern RCCB/MCB safety circuit breakers.' },
        { title: 'Inverter & Battery Backup Installation', price: 2000, description: 'Complete solar or pure sine wave inverter system wiring and load testing.' },
        { title: 'Switchboard & Wall Light Fitting (Up to 5 points)', price: 700, description: 'Installation and testing of modular switch plates, sockets, and ceiling fixtures.' },
      ],
    },
    {
      user: {
        name: 'Dipen Sunar',
        email: 'dipen.ac@example.com',
        phone: '+977-9841888333',
        passwordHash: techPassword,
        role: Role.TECHNICIAN,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      },
      profile: {
        categoryId: categories['ac-repair'],
        businessName: 'Cooling Point HVAC Nepal',
        bio: 'HVAC technician with 6+ years experience in split, cassette, and inverter air conditioning systems. Expert in prompt gas top-up (R32, R410A), high-pressure water jet coil cleaning, compressor replacement, and copper piping.',
        experienceYears: 6,
        startingPrice: 1000,
        hourlyRate: 900,
        skills: 'AC Servicing, Gas Charging, Inverter PCB Repair, Copper Flaring, Cassette AC, Cooling Diagnostics',
        certifications: 'Carrier & Daikin Certified HVAC Technician',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&auto=format&fit=crop&q=80',
        workingHours: '8:30 AM - 6:30 PM',
        province: 'Bagmati Province',
        district: 'Kathmandu',
        city: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan',
        locality: 'Lazimpat',
        address: 'Lazimpat North Gate, Near Radisson',
        availability: Availability.AVAILABLE_NOW,
        verificationStatus: VerificationStatus.APPROVED,
        rating: 4.7,
        reviewCount: 22,
        isFeatured: true,
      },
      services: [
        { title: 'Split AC Deep Water-Jet Servicing', price: 1200, description: 'Indoor and outdoor unit pressure jet washing, filter disinfection, and drainage flush.' },
        { title: 'AC Refrigerant Gas Top-Up (R32/R410A)', price: 2800, description: 'Leak testing and pure eco-friendly refrigerant gas refill for maximum cooling.' },
        { title: 'AC Installation / Relocation', price: 2500, description: 'Wall mounting, bracket fitting, vacuuming, and copper piping setup.' },
      ],
    },
    {
      user: {
        name: 'Krishna Prasad Sharma',
        email: 'krishna.carpenter@example.com',
        phone: '+977-9841777444',
        passwordHash: techPassword,
        role: Role.TECHNICIAN,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
      },
      profile: {
        categoryId: categories['carpentry'],
        businessName: 'Sharma Wood Crafts & Modular Living',
        bio: 'Master woodworker with 12 years of craftsmanship in modern woodwork, custom furniture, door framing, laminate flooring, and modular kitchen hardware repairs. Precise measurements and durable finishes guaranteed.',
        experienceYears: 12,
        startingPrice: 800,
        hourlyRate: 850,
        skills: 'Modular Kitchen, Solid Wood Carving, Hettich/Hafele Hardware, Door Lock Mounting, Wooden Wardrobes',
        certifications: 'Diploma in Furniture & Wood Craftsmanship',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1200&auto=format&fit=crop&q=80',
        workingHours: '8:00 AM - 6:00 PM (Sat Closed)',
        province: 'Bagmati Province',
        district: 'Bhaktapur',
        city: 'Bhaktapur',
        municipality: 'Bhaktapur Municipality',
        locality: 'Sanothimi',
        address: 'Sanothimi Chowk, Near SOS Children Village',
        availability: Availability.AVAILABLE_THIS_WEEK,
        verificationStatus: VerificationStatus.APPROVED,
        rating: 4.9,
        reviewCount: 18,
        isFeatured: false,
      },
      services: [
        { title: 'Main Door Lock & Mortise Fitting', price: 900, description: 'Fitting security multi-point mortise locks, cylinder deadbolts, and door handles.' },
        { title: 'Modular Kitchen Cabinet Alignment & Soft-Close Hinges', price: 1500, description: 'Repairing sagging drawers, soft-close hydraulic hinges, and sliding channels.' },
        { title: 'Custom Wooden Bookshelf / Shelf Assembly', price: 2800, description: 'Custom wall-mounted shelves, particle board furniture assembly, and polishing.' },
      ],
    },
    {
      user: {
        name: 'Sunil Tamang',
        email: 'sunil.painter@example.com',
        phone: '+977-9801333555',
        passwordHash: techPassword,
        role: Role.TECHNICIAN,
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
      },
      profile: {
        categoryId: categories['painting'],
        businessName: 'Pokhara Color World & Waterproofing',
        bio: 'Professional painter and waterproofing specialist based in Pokhara. 7 years experience delivering flawless interior emulsion finishes, exterior weather-coat, texture wall art, and damp wall waterproofing.',
        experienceYears: 7,
        startingPrice: 1500,
        hourlyRate: 700,
        skills: 'Asian Paints / Berger Certified, Waterproofing, Wall Putty, Texture Stencil, Spray Painting',
        certifications: 'Asian Paints Certified Master Painter',
        profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&auto=format&fit=crop&q=80',
        workingHours: '8:00 AM - 6:00 PM',
        province: 'Gandaki Province',
        district: 'Kaski (Pokhara)',
        city: 'Pokhara',
        municipality: 'Pokhara Metropolitan',
        locality: 'Lakeside',
        address: 'Lakeside Center, Baidam Ward 6, Pokhara',
        availability: Availability.AVAILABLE_TODAY,
        verificationStatus: VerificationStatus.APPROVED,
        rating: 4.6,
        reviewCount: 14,
        isFeatured: false,
      },
      services: [
        { title: 'Single Room Interior Luxury Emulsion', price: 3500, description: 'Wall sanding, 2 coats primer, crack filling, and 2 coats luxury emulsion paint.' },
        { title: 'Damp Wall Waterproofing & Sealing', price: 2800, description: 'Anti-fungal treatment, polymer waterproofing coating, and putty application.' },
      ],
    },
    {
      user: {
        name: 'Manju Pariyar',
        email: 'manju.cleaning@example.com',
        phone: '+977-9841666777',
        passwordHash: techPassword,
        role: Role.TECHNICIAN,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      },
      profile: {
        categoryId: categories['cleaning'],
        businessName: 'Sparkle Clean Nepal Services',
        bio: 'Leader of a trusted 5-member deep cleaning squad. We use professional German vacuum extractors, eco-friendly detergents, and steam sanitizers to make your home, sofa, and kitchen shine like new.',
        experienceYears: 5,
        startingPrice: 1200,
        hourlyRate: 500,
        skills: 'Deep Home Cleaning, Sofa Steam Cleaning, Carpet Extraction, Kitchen Chimney De-greasing, Move-in Disinfection',
        certifications: 'Professional Hospitality Cleaning Certified',
        profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&auto=format&fit=crop&q=80',
        workingHours: '7:30 AM - 7:00 PM',
        province: 'Bagmati Province',
        district: 'Kathmandu',
        city: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan',
        locality: 'Boudha',
        address: 'Boudha Tusal, Ward 6',
        availability: Availability.AVAILABLE_NOW,
        verificationStatus: VerificationStatus.APPROVED,
        rating: 5.0,
        reviewCount: 31,
        isFeatured: true,
      },
      services: [
        { title: 'Full 2BHK Apartment Deep Cleaning', price: 4500, description: 'Floor scrubbing, glass windows, bathroom tile descaling, balcony wash, and dust extraction.' },
        { title: '5-Seater Sofa Steam Shampooing', price: 1800, description: 'Fabric stain removal, disinfectant foam wash, and high-suction extraction.' },
        { title: 'Modular Kitchen & Chimney Degreasing', price: 1600, description: 'Thorough grease removal from chimney filters, cooktop, tiles, and under-cabinet areas.' },
      ],
    },
    {
      user: {
        name: 'Ramesh Karki',
        email: 'ramesh.appliance@example.com',
        phone: '+977-9851222888',
        passwordHash: techPassword,
        role: Role.TECHNICIAN,
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
      },
      profile: {
        categoryId: categories['appliance-repair'],
        businessName: 'Karki Home Appliance Care',
        bio: 'Specialist in Samsung, LG, Whirlpool, IFB, and Godrej home appliances with 9 years of service. Fast doorstep diagnosis and genuine spare parts for washing machines, refrigerators, microwaves, and water purifiers.',
        experienceYears: 9,
        startingPrice: 700,
        hourlyRate: 650,
        skills: 'Inverter PCB Repair, Washing Machine Drum Replacement, Refrigerator Thermostat & Gas, Microwave Magnetron, RO Filter',
        certifications: 'Authorized Multi-Brand Appliance Technician',
        profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&auto=format&fit=crop&q=80',
        workingHours: '8:00 AM - 8:00 PM',
        province: 'Bagmati Province',
        district: 'Kathmandu',
        city: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan',
        locality: 'Koteshwor',
        address: 'Koteshwor Chowk, Near Bhatbhateni Supermarket',
        availability: Availability.AVAILABLE_TODAY,
        verificationStatus: VerificationStatus.APPROVED,
        rating: 4.8,
        reviewCount: 25,
        isFeatured: true,
      },
      services: [
        { title: 'Washing Machine Not Spinning / Water Drain Fault', price: 1200, description: 'Diagnosis and fix of drain pumps, belt slipping, clutch assembly, or PCB issues.' },
        { title: 'Refrigerator Not Cooling Diagnostic & Thermostat Fix', price: 1400, description: 'Inspection of compressor relay, condenser fan, defrost heater, and thermostat.' },
        { title: 'RO Water Purifier Complete Filter Replacement', price: 800, description: 'Sediment, carbon, and RO membrane filter replacement with TDS water testing.' },
      ],
    },
    {
      user: {
        name: 'Nabin Shrestha',
        email: 'nabin.handyman@example.com',
        phone: '+977-9841999000',
        passwordHash: techPassword,
        role: Role.TECHNICIAN,
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
      },
      profile: {
        categoryId: categories['handyman'],
        businessName: 'Sajilo Handyman Express',
        bio: 'Your go-to neighbourhood handyman for quick household fixes. Equipped with heavy-duty rotary hammer drills, stud finders, and precision levels to mount televisions, artwork, mirrors, curtain brackets, and replace damaged door handles.',
        experienceYears: 4,
        startingPrice: 400,
        hourlyRate: 450,
        skills: 'TV Mounting, Wall Drilling, Curtain Brackets, Mirror & Frame Hanging, Door Handles, Shelf Assembly',
        certifications: 'General Home Maintenance Level 1',
        profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=1200&auto=format&fit=crop&q=80',
        workingHours: '9:00 AM - 7:00 PM',
        province: 'Bagmati Province',
        district: 'Lalitpur',
        city: 'Lalitpur',
        municipality: 'Lalitpur Metropolitan',
        locality: 'Kupondole',
        address: 'Kupondole Heights, Lalitpur',
        availability: Availability.AVAILABLE_NOW,
        verificationStatus: VerificationStatus.APPROVED,
        rating: 4.5,
        reviewCount: 9,
        isFeatured: false,
      },
      services: [
        { title: 'LED/OLED TV Wall Bracket Mount (Up to 65 inch)', price: 700, description: 'Secure wall anchoring with heavy-duty fasteners, level alignment, and cable management.' },
        { title: 'Curtain Rod & Roller Blind Installation', price: 500, description: 'Wall drilling and mounting of single/double curtain rods or window roller blinds.' },
        { title: 'Wall Shelves & Heavy Mirror Installation', price: 450, description: 'Precision mounting of floating shelves, bathroom vanity mirrors, and wall art.' },
      ],
    },
    // New Pending Applicant for testing Admin Approval Workflow
    {
      user: {
        name: 'Aman KC',
        email: 'aman.plumber@example.com',
        phone: '+977-9801999888',
        passwordHash: techPassword,
        role: Role.TECHNICIAN,
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      },
      profile: {
        categoryId: categories['plumbing'],
        businessName: 'Aman Pokhara Plumber Services',
        bio: 'Passionate young plumber with 3 years of residential plumbing experience seeking to expand service coverage in Pokhara.',
        experienceYears: 3,
        startingPrice: 450,
        hourlyRate: 500,
        skills: 'Pipe Fitting, Water Tank Cleaning, Bathroom Fixtures',
        certifications: 'CTEVT Basic Plumbing Certificate',
        profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80',
        workingHours: '8:00 AM - 5:00 PM',
        province: 'Gandaki Province',
        district: 'Kaski (Pokhara)',
        city: 'Pokhara',
        municipality: 'Pokhara Metropolitan',
        locality: 'Mahendrapool',
        address: 'Mahendrapool Bazaar, Ward 9',
        availability: Availability.AVAILABLE_TODAY,
        verificationStatus: VerificationStatus.PENDING, // PENDING ADMIN APPROVAL
        rating: 0,
        reviewCount: 0,
        isFeatured: false,
      },
      services: [
        { title: 'General Plumbing Inspection', price: 450, description: 'Complete pipeline and tap leakage inspection.' },
      ],
    },
  ];

  const createdTechProfiles: any[] = [];

  for (const item of techProfilesData) {
    const u = await prisma.user.create({ data: item.user });
    const p = await prisma.technicianProfile.create({
      data: {
        userId: u.id,
        ...item.profile,
      },
    });

    for (const s of item.services) {
      await prisma.service.create({
        data: {
          technicianProfileId: p.id,
          title: s.title,
          description: s.description,
          price: s.price,
        },
      });
    }

    createdTechProfiles.push({ user: u, profile: p });
  }

  // 8. Create Sample Completed Service Requests & Reviews
  const hariProfile = createdTechProfiles[0].profile;
  const sureshProfile = createdTechProfiles[1].profile;
  const manjuProfile = createdTechProfiles[5].profile;

  // Request 1: Completed by Hari for Ram
  const req1 = await prisma.serviceRequest.create({
    data: {
      customerId: customer1.id,
      technicianProfileId: hariProfile.id,
      serviceTitle: 'Emergency Pipe Leak Repair',
      description: 'Major leak under the kitchen sink in Baneshwor. Water leaking continuously.',
      preferredDate: '2026-09-18',
      preferredTime: '10:00 AM',
      address: 'New Baneshwor, House #24, Near Civil Bank',
      phone: customer1.phone || '+977-9841234567',
      status: RequestStatus.COMPLETED,
    },
  });

  await prisma.review.create({
    data: {
      customerId: customer1.id,
      technicianProfileId: hariProfile.id,
      serviceRequestId: req1.id,
      rating: 5,
      comment: 'Hari Dai arrived within 30 minutes with all replacement PPR pipes and tools. Fixed the kitchen leak cleanly and charged very reasonable rates. Highly recommended in Baneshwor!',
      technicianReply: 'Thank you Ram ji! Happy to help anytime.',
    },
  });

  // Request 2: Completed by Suresh for Sita
  const req2 = await prisma.serviceRequest.create({
    data: {
      customerId: customer2.id,
      technicianProfileId: sureshProfile.id,
      serviceTitle: 'MCB & Distribution Board Upgrade',
      description: 'Frequent tripping in 2nd floor wiring. Need MCB upgrade and testing.',
      preferredDate: '2026-09-19',
      preferredTime: '02:30 PM',
      address: 'Jhamsikhel, Lalitpur, Ward 3',
      phone: customer2.phone || '+977-9851098765',
      status: RequestStatus.COMPLETED,
    },
  });

  await prisma.review.create({
    data: {
      customerId: customer2.id,
      technicianProfileId: sureshProfile.id,
      serviceRequestId: req2.id,
      rating: 5,
      comment: 'Very professional electrical technician! Suresh diagnosed an overloaded neutral wire in our main DB box and installed proper Schneider MCBs. Super tidy work.',
    },
  });

  // Request 3: Completed by Manju for Bikash
  const req3 = await prisma.serviceRequest.create({
    data: {
      customerId: customer3.id,
      technicianProfileId: manjuProfile.id,
      serviceTitle: 'Full 2BHK Apartment Deep Cleaning',
      description: 'Post-renovation deep cleaning for our apartment in Boudha.',
      preferredDate: '2026-09-20',
      preferredTime: '09:00 AM',
      address: 'Boudha Tusal, Kathmandu',
      phone: customer3.phone || '+977-9801234890',
      status: RequestStatus.COMPLETED,
    },
  });

  await prisma.review.create({
    data: {
      customerId: customer3.id,
      technicianProfileId: manjuProfile.id,
      serviceRequestId: req3.id,
      rating: 5,
      comment: 'The Sparkle Clean team did an extraordinary job! The bathrooms and kitchen look brand new. 10/10 service!',
    },
  });

  // Request 4: In Progress
  await prisma.serviceRequest.create({
    data: {
      customerId: customer2.id,
      technicianProfileId: hariProfile.id,
      serviceTitle: 'Overhead Water Tank & Pump Plumbing',
      description: 'Water tank automatic sensor installation and pressure valve fix.',
      preferredDate: '2026-09-22',
      preferredTime: '11:00 AM',
      address: 'Jhamsikhel, Lalitpur',
      phone: customer2.phone || '+977-9851098765',
      status: RequestStatus.IN_PROGRESS,
    },
  });

  // Request 5: Pending for Ram
  await prisma.serviceRequest.create({
    data: {
      customerId: customer1.id,
      technicianProfileId: sureshProfile.id,
      serviceTitle: 'Inverter & Battery Backup Installation',
      description: 'Need 1.5 kVA luminous inverter wiring to power living room and home office.',
      preferredDate: '2026-09-23',
      preferredTime: '01:00 PM',
      address: 'New Baneshwor, Kathmandu',
      phone: customer1.phone || '+977-9841234567',
      status: RequestStatus.PENDING,
    },
  });

  // 9. Create Favorites
  await prisma.favorite.create({
    data: {
      customerId: customer1.id,
      technicianProfileId: hariProfile.id,
    },
  });
  await prisma.favorite.create({
    data: {
      customerId: customer1.id,
      technicianProfileId: sureshProfile.id,
    },
  });

  // 10. Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: customer1.id,
        title: 'Service Completed',
        message: 'Your plumbing service with Hari Bahadur Thapa has been marked completed. Leave a review!',
        link: '/dashboard/customer',
        type: 'SUCCESS',
      },
      {
        userId: createdTechProfiles[0].user.id,
        title: 'New Service Request',
        message: 'You have a pending service request from Ram Shrestha.',
        link: '/dashboard/technician',
        type: 'INFO',
      },
      {
        userId: adminUser.id,
        title: 'New Technician Application',
        message: 'Aman KC has registered as a Plumber and is awaiting approval.',
        link: '/admin/technicians',
        type: 'WARNING',
      },
    ],
  });

  // 11. Create Admin Log
  await prisma.adminLog.create({
    data: {
      adminId: adminUser.id,
      action: 'APPROVE_TECHNICIAN',
      targetType: 'TechnicianProfile',
      targetId: hariProfile.id,
      details: 'Approved technician Hari Bahadur Thapa after phone verification and CTEVT certificate check.',
    },
  });

  console.log('✅ Seeding completed successfully!');
  console.log('----------------------------------------------------');
  console.log('🔑 Seeded Demo Accounts:');
  console.log('1. Admin:      admin@sajilokhoj.com        / admin123');
  console.log('2. Customer:   ram.shrestha@example.com    / customer123');
  console.log('3. Technician: hari.plumber@example.com    / tech123');
  console.log('4. Technician: suresh.electric@example.com / tech123');
  console.log('5. Pending Tech: aman.plumber@example.com  / tech123');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
