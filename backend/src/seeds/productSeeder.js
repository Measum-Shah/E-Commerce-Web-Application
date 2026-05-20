// Products are organized by category slug for easy mapping
const productsByCategory = {
  laptops: [
    {
      name: "Dell XPS 15 Core i7 (Refurbished)",
      slug: "dell-xps-15-core-i7-refurbished",
      description: "Dell XPS 15 9500 with 10th Gen Intel Core i7-10750H, 16GB RAM, 512GB NVMe SSD, 15.6\" FHD display. Excellent condition, fully tested.",
      brand: "Dell",
      sku: "LAP-DELL-XPS15-001",
      condition: "refurbished",
      price: 75000,
      stock: 8,
      lowStockThreshold: 3,
      images: [
        "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=600&auto=format&fit=crop"
      ],
      specifications: {
        processor: "Intel Core i7-10750H",
        ram: "16GB DDR4",
        storage: "512GB NVMe SSD",
        display: "15.6 inch FHD",
        os: "Windows 11 Pro",
        battery: "86WHr"
      },
      tags: ["dell", "xps", "laptop", "refurbished", "i7"],
      warranty: "3 months seller warranty",
      isFeatured: true,
      isActive: true
    },
    {
      name: "HP EliteBook 840 G6 (Used)",
      slug: "hp-elitebook-840-g6-used",
      description: "HP EliteBook 840 G6 business laptop. Intel Core i5-8365U, 8GB RAM, 256GB SSD, 14\" FHD IPS display. Military-grade durability. Ideal for professionals.",
      brand: "HP",
      sku: "LAP-HP-840G6-002",
      condition: "used",
      price: 42000,
      stock: 15,
      lowStockThreshold: 5,
      images: [
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop"
      ],
      specifications: {
        processor: "Intel Core i5-8365U",
        ram: "8GB DDR4",
        storage: "256GB SSD",
        display: "14 inch FHD IPS",
        os: "Windows 10 Pro",
        battery: "50WHr"
      },
      tags: ["hp", "elitebook", "business", "laptop", "i5"],
      warranty: "1 month seller warranty",
      isFeatured: false,
      isActive: true
    },
    {
      name: "Lenovo ThinkPad T490 (Refurbished)",
      slug: "lenovo-thinkpad-t490-refurbished",
      description: "Lenovo ThinkPad T490 with Intel Core i7-8565U, 16GB RAM, 512GB SSD, 14\" FHD IPS display. Famous ThinkPad keyboard and build quality.",
      brand: "Lenovo",
      sku: "LAP-LEN-T490-003",
      condition: "refurbished",
      price: 55000,
      stock: 10,
      lowStockThreshold: 3,
      images: [
        "https://images.unsplash.com/photo-1611186871525-6dbdb13a5a72?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop"
      ],
      specifications: {
        processor: "Intel Core i7-8565U",
        ram: "16GB DDR4",
        storage: "512GB SSD",
        display: "14 inch FHD IPS",
        os: "Windows 11 Pro",
        battery: "48WHr"
      },
      tags: ["lenovo", "thinkpad", "laptop", "refurbished", "i7"],
      warranty: "3 months seller warranty",
      isFeatured: true,
      isActive: true
    },
    {
      name: "Apple MacBook Pro 13\" M1 (Used)",
      slug: "apple-macbook-pro-13-m1-used",
      description: "Apple MacBook Pro 13-inch with M1 chip, 8GB unified memory, 256GB SSD. Stunning Retina display, exceptional battery life up to 17 hours.",
      brand: "Apple",
      sku: "LAP-APL-MBP13-004",
      condition: "used",
      price: 120000,
      stock: 6,
      lowStockThreshold: 2,
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1611186871525-6dbdb13a5a72?w=600&auto=format&fit=crop"
      ],
      specifications: {
        processor: "Apple M1 Chip",
        ram: "8GB Unified Memory",
        storage: "256GB SSD",
        display: "13.3 inch Retina",
        os: "macOS Ventura",
        battery: "Up to 17 hours"
      },
      tags: ["apple", "macbook", "m1", "laptop", "mac"],
      warranty: "No warranty",
      isFeatured: true,
      isActive: true
    },
    {
      name: "Acer Aspire 5 Core i3 (New)",
      slug: "acer-aspire-5-core-i3-new",
      description: "Brand new Acer Aspire 5 with Intel Core i3-1115G4, 4GB RAM, 256GB SSD, 15.6\" FHD display. Perfect budget laptop for students and everyday use.",
      brand: "Acer",
      sku: "LAP-ACR-ASP5-005",
      condition: "new",
      price: 38000,
      stock: 20,
      lowStockThreshold: 5,
      images: [
        "https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop"
      ],
      specifications: {
        processor: "Intel Core i3-1115G4",
        ram: "4GB DDR4",
        storage: "256GB SSD",
        display: "15.6 inch FHD",
        os: "Windows 11 Home",
        battery: "48WHr"
      },
      tags: ["acer", "aspire", "laptop", "new", "student", "budget"],
      warranty: "1 year brand warranty",
      isFeatured: false,
      isActive: true
    },
    {
      name: "ASUS VivoBook 15 Ryzen 5 (New)",
      slug: "asus-vivobook-15-ryzen5-new",
      description: "New ASUS VivoBook 15 with AMD Ryzen 5 5500U, 8GB RAM, 512GB SSD, 15.6\" FHD display. Great performance for multitasking and everyday computing.",
      brand: "ASUS",
      sku: "LAP-ASUS-VB15-006",
      condition: "new",
      price: 52000,
      stock: 12,
      lowStockThreshold: 4,
      images: [
        "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&auto=format&fit=crop"
      ],
      specifications: {
        processor: "AMD Ryzen 5 5500U",
        ram: "8GB DDR4",
        storage: "512GB SSD",
        display: "15.6 inch FHD",
        os: "Windows 11 Home",
        battery: "42WHr"
      },
      tags: ["asus", "vivobook", "laptop", "ryzen", "amd"],
      warranty: "1 year brand warranty",
      isFeatured: false,
      isActive: true
    }
  ],

  desktops: [
    {
      name: "Dell OptiPlex 7070 (Refurbished)",
      slug: "dell-optiplex-7070-refurbished",
      description: "Dell OptiPlex 7070 SFF desktop. Intel Core i5-9500, 8GB DDR4 RAM, 256GB SSD, runs Windows 10 Pro. Compact, quiet, and reliable for office use.",
      brand: "Dell",
      sku: "DSK-DELL-OP7070-001",
      condition: "refurbished",
      price: 28000,
      stock: 12,
      lowStockThreshold: 4,
      images: [
        "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593640408182-31c228bf27e3?w=600&auto=format&fit=crop"
      ],
      specifications: {
        processor: "Intel Core i5-9500",
        ram: "8GB DDR4",
        storage: "256GB SSD",
        formFactor: "Small Form Factor",
        os: "Windows 10 Pro",
        ports: "USB 3.1, HDMI, DisplayPort"
      },
      tags: ["dell", "optiplex", "desktop", "refurbished", "office"],
      warranty: "3 months seller warranty",
      isFeatured: true,
      isActive: true
    },
    {
      name: "HP ProDesk 600 G4 (Refurbished)",
      slug: "hp-prodesk-600-g4-refurbished",
      description: "HP ProDesk 600 G4 SFF. Intel Core i5-8500, 16GB RAM, 512GB SSD. Excellent for business workloads. Tested and cleaned before sale.",
      brand: "HP",
      sku: "DSK-HP-PD600-002",
      condition: "refurbished",
      price: 35000,
      stock: 8,
      lowStockThreshold: 3,
      images: [
        "https://images.unsplash.com/photo-1593640408182-31c228bf27e3?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&auto=format&fit=crop"
      ],
      specifications: {
        processor: "Intel Core i5-8500",
        ram: "16GB DDR4",
        storage: "512GB SSD",
        formFactor: "Small Form Factor",
        os: "Windows 11 Pro",
        ports: "USB-A, USB-C, DisplayPort, VGA"
      },
      tags: ["hp", "prodesk", "desktop", "refurbished", "business"],
      warranty: "3 months seller warranty",
      isFeatured: false,
      isActive: true
    },
    {
      name: "Custom Gaming Desktop (New Build)",
      slug: "custom-gaming-desktop-ryzen5-rtx3060",
      description: "Custom-built gaming PC. AMD Ryzen 5 5600X, 16GB DDR4 3200MHz, 1TB NVMe SSD, NVIDIA RTX 3060 12GB, 650W PSU, mid-tower ATX case with RGB.",
      brand: "Custom Build",
      sku: "DSK-CSTM-GAME-003",
      condition: "new",
      price: 145000,
      stock: 5,
      lowStockThreshold: 2,
      images: [
        "https://images.unsplash.com/photo-1593640408182-31c228bf27e3?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&auto=format&fit=crop"
      ],
      specifications: {
        processor: "AMD Ryzen 5 5600X",
        ram: "16GB DDR4 3200MHz",
        storage: "1TB NVMe SSD",
        gpu: "NVIDIA RTX 3060 12GB",
        psu: "650W 80+ Bronze",
        os: "Windows 11 Home"
      },
      tags: ["gaming", "desktop", "rtx3060", "ryzen", "custom", "rgb"],
      warranty: "1 year parts warranty",
      isFeatured: true,
      isActive: true
    },
    {
      name: "Lenovo ThinkCentre M710 (Used)",
      slug: "lenovo-thinkcentre-m710-used",
      description: "Lenovo ThinkCentre M710 Tiny. Intel Core i5-7500T, 8GB RAM, 256GB SSD. Ultra-small form factor, perfect where desk space is limited.",
      brand: "Lenovo",
      sku: "DSK-LEN-M710-004",
      condition: "used",
      price: 22000,
      stock: 10,
      lowStockThreshold: 3,
      images: [
        "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593640408182-31c228bf27e3?w=600&auto=format&fit=crop"
      ],
      specifications: {
        processor: "Intel Core i5-7500T",
        ram: "8GB DDR4",
        storage: "256GB SSD",
        formFactor: "Tiny",
        os: "Windows 10 Pro",
        ports: "USB 3.0, HDMI, DisplayPort"
      },
      tags: ["lenovo", "thinkcentre", "desktop", "used", "tiny", "mini"],
      warranty: "1 month seller warranty",
      isFeatured: false,
      isActive: true
    },
    {
      name: "Apple iMac 24\" M1 (Used)",
      slug: "apple-imac-24-m1-used",
      description: "Apple iMac 24-inch with M1 chip, 8GB memory, 256GB SSD, stunning 4.5K Retina display. Comes with Magic Keyboard and Magic Mouse.",
      brand: "Apple",
      sku: "DSK-APL-IMAC24-005",
      condition: "used",
      price: 185000,
      stock: 3,
      lowStockThreshold: 1,
      images: [
        "https://images.unsplash.com/photo-1581822261290-991b38693d1b?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593640408182-31c228bf27e3?w=600&auto=format&fit=crop"
      ],
      specifications: {
        processor: "Apple M1",
        ram: "8GB Unified Memory",
        storage: "256GB SSD",
        display: "24 inch 4.5K Retina",
        os: "macOS Ventura",
        ports: "Thunderbolt 4, USB 3"
      },
      tags: ["apple", "imac", "desktop", "m1", "all-in-one"],
      warranty: "No warranty",
      isFeatured: true,
      isActive: true
    }
  ],

  accessories: [
    {
      name: "Logitech MX Keys Advanced Keyboard",
      slug: "logitech-mx-keys-advanced-keyboard",
      description: "Logitech MX Keys Advanced Wireless Illuminated Keyboard. Smart backlighting, multi-device connectivity (up to 3 devices), USB-C charging. Works with Windows, Mac, Linux.",
      brand: "Logitech",
      sku: "ACC-LOG-MXKEYS-001",
      condition: "new",
      price: 14500,
      stock: 25,
      lowStockThreshold: 8,
      images: [
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&auto=format&fit=crop"
      ],
      specifications: {
        connectivity: "Bluetooth + USB receiver",
        batteryLife: "10 days (backlight on)",
        compatibility: "Windows, Mac, Linux",
        layout: "Full-size",
        charging: "USB-C"
      },
      tags: ["keyboard", "logitech", "wireless", "mx keys", "backlit"],
      warranty: "2 years brand warranty",
      isFeatured: true,
      isActive: true
    },
    {
      name: "Logitech MX Master 3 Wireless Mouse",
      slug: "logitech-mx-master-3-wireless-mouse",
      description: "Logitech MX Master 3 Advanced Wireless Mouse. MagSpeed electromagnetic scrolling, ergonomic design, 4000 DPI sensor, multi-device support, USB-C charging.",
      brand: "Logitech",
      sku: "ACC-LOG-MXMAS3-002",
      condition: "new",
      price: 12800,
      stock: 30,
      lowStockThreshold: 10,
      images: [
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop"
      ],
      specifications: {
        dpi: "200-4000 DPI",
        connectivity: "Bluetooth + USB receiver",
        buttons: "7 buttons",
        batteryLife: "70 days on full charge",
        charging: "USB-C"
      },
      tags: ["mouse", "logitech", "wireless", "mx master", "ergonomic"],
      warranty: "2 years brand warranty",
      isFeatured: true,
      isActive: true
    },
    {
      name: "HyperX Cloud II Gaming Headset",
      slug: "hyperx-cloud-ii-gaming-headset",
      description: "HyperX Cloud II Wired Gaming Headset. 7.1 Virtual Surround Sound, 53mm drivers, noise-canceling microphone, memory foam ear cushions. Compatible with PC, PS4, Xbox.",
      brand: "HyperX",
      sku: "ACC-HXY-CLD2-003",
      condition: "new",
      price: 9500,
      stock: 18,
      lowStockThreshold: 5,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&auto=format&fit=crop"
      ],
      specifications: {
        drivers: "53mm",
        frequencyResponse: "15Hz–25,000Hz",
        impedance: "60 Ohm",
        connectivity: "3.5mm + USB adapter",
        mic: "Noise-canceling, detachable"
      },
      tags: ["headset", "hyperx", "gaming", "7.1 surround", "microphone"],
      warranty: "2 years brand warranty",
      isFeatured: false,
      isActive: true
    },
    {
      name: "Anker 7-in-1 USB-C Hub",
      slug: "anker-7-in-1-usbc-hub",
      description: "Anker 7-in-1 USB-C Hub with 4K HDMI, USB-C Power Delivery (100W), 2 USB-A 3.0 ports, SD/microSD card reader, and ethernet port. Essential for laptops.",
      brand: "Anker",
      sku: "ACC-ANK-HUB7-004",
      condition: "new",
      price: 4500,
      stock: 40,
      lowStockThreshold: 10,
      images: [
        "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop"
      ],
      specifications: {
        ports: "2x USB-A 3.0, HDMI 4K, USB-C PD, SD, microSD, Ethernet",
        hdmi: "4K@30Hz",
        powerDelivery: "100W Pass-through",
        compatibility: "MacBook, Laptops with USB-C"
      },
      tags: ["usb hub", "anker", "usb-c", "docking", "hdmi", "accessories"],
      warranty: "18 months brand warranty",
      isFeatured: false,
      isActive: true
    },
    {
      name: "Logitech C920 HD Pro Webcam",
      slug: "logitech-c920-hd-pro-webcam",
      description: "Logitech C920 HD Pro Webcam with 1080p/30fps video, dual stereo mics with auto noise reduction. Perfect for video calls, streaming, and remote work.",
      brand: "Logitech",
      sku: "ACC-LOG-C920-005",
      condition: "new",
      price: 8200,
      stock: 22,
      lowStockThreshold: 6,
      images: [
        "https://images.unsplash.com/photo-1623520703510-29b16d1be7f3?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&auto=format&fit=crop"
      ],
      specifications: {
        resolution: "1080p Full HD",
        frameRate: "30fps",
        fieldOfView: "78 degrees",
        mic: "Dual stereo with noise reduction",
        connectivity: "USB-A"
      },
      tags: ["webcam", "logitech", "1080p", "streaming", "video call"],
      warranty: "3 years brand warranty",
      isFeatured: true,
      isActive: true
    },
    {
      name: "TP-Link UH720 USB 3.0 Hub",
      slug: "tp-link-uh720-usb30-hub",
      description: "TP-Link UH720 USB 3.0 7-Port Hub with 2 charging ports. Supports up to 5Gbps transfer speed. Individual power switches for each port. Powered via AC adapter.",
      brand: "TP-Link",
      sku: "ACC-TPL-UH720-006",
      condition: "new",
      price: 3200,
      stock: 35,
      lowStockThreshold: 10,
      images: [
        "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop"
      ],
      specifications: {
        ports: "7x USB-A 3.0 + 2 charging",
        speed: "5Gbps",
        power: "12V/4A adapter included",
        switchable: "Individual port switches"
      },
      tags: ["usb hub", "tp-link", "usb 3.0", "powered hub", "accessories"],
      warranty: "2 years brand warranty",
      isFeatured: false,
      isActive: true
    }
  ],

  hardware: [
    {
      name: "NVIDIA GeForce RTX 3060 12GB GDDR6",
      slug: "nvidia-rtx-3060-12gb",
      description: "NVIDIA GeForce RTX 3060 12GB GDDR6 graphics card. Excellent for 1080p gaming, ray tracing, and DLSS. PCIe 4.0 x16. Pulled from a working system.",
      brand: "NVIDIA",
      sku: "HW-GPU-RTX3060-001",
      condition: "used",
      price: 48000,
      stock: 7,
      lowStockThreshold: 2,
      images: [
        "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&auto=format&fit=crop"
      ],
      specifications: {
        vram: "12GB GDDR6",
        coreClock: "1777MHz Boost",
        interface: "PCIe 4.0 x16",
        tdp: "170W",
        outputs: "3x DisplayPort, 1x HDMI 2.1"
      },
      tags: ["gpu", "rtx3060", "nvidia", "graphics card", "gaming"],
      warranty: "1 month seller warranty",
      isFeatured: true,
      isActive: true
    },
    {
      name: "Samsung 970 EVO Plus 1TB NVMe SSD",
      slug: "samsung-970-evo-plus-1tb-nvme",
      description: "Samsung 970 EVO Plus 1TB M.2 NVMe SSD. Read speeds up to 3,500MB/s, write speeds up to 3,300MB/s. Ideal for OS drives and high-performance workloads. Brand new sealed.",
      brand: "Samsung",
      sku: "HW-SSD-970EP1T-002",
      condition: "new",
      price: 18500,
      stock: 20,
      lowStockThreshold: 5,
      images: [
        "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop"
      ],
      specifications: {
        capacity: "1TB",
        interface: "M.2 NVMe PCIe 3.0",
        readSpeed: "3500 MB/s",
        writeSpeed: "3300 MB/s",
        formFactor: "M.2 2280"
      },
      tags: ["ssd", "samsung", "nvme", "m.2", "storage", "1tb"],
      warranty: "5 years brand warranty",
      isFeatured: true,
      isActive: true
    },
    {
      name: "Corsair Vengeance LPX 16GB DDR4 3200MHz",
      slug: "corsair-vengeance-lpx-16gb-ddr4-3200",
      description: "Corsair Vengeance LPX 16GB (2x8GB) DDR4 DRAM 3200MHz C16 Desktop Memory Kit. Compatible with Intel and AMD platforms. XMP 2.0 support.",
      brand: "Corsair",
      sku: "HW-RAM-COR16G-003",
      condition: "new",
      price: 7200,
      stock: 30,
      lowStockThreshold: 8,
      images: [
        "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&auto=format&fit=crop"
      ],
      specifications: {
        capacity: "16GB (2x8GB)",
        type: "DDR4",
        speed: "3200MHz",
        latency: "CL16",
        voltage: "1.35V"
      },
      tags: ["ram", "ddr4", "corsair", "memory", "16gb"],
      warranty: "Lifetime brand warranty",
      isFeatured: false,
      isActive: true
    },
    {
      name: "AMD Ryzen 5 5600X Processor",
      slug: "amd-ryzen-5-5600x-processor",
      description: "AMD Ryzen 5 5600X 6-Core, 12-Thread desktop processor. 3.7GHz base, 4.6GHz boost clock. PCIe 4.0, unlocked for overclocking. Includes Wraith Stealth cooler.",
      brand: "AMD",
      sku: "HW-CPU-R55600X-004",
      condition: "new",
      price: 22000,
      stock: 15,
      lowStockThreshold: 4,
      images: [
        "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop"
      ],
      specifications: {
        cores: "6 Cores / 12 Threads",
        baseClock: "3.7GHz",
        boostClock: "4.6GHz",
        cache: "35MB",
        socket: "AM4",
        tdp: "65W"
      },
      tags: ["cpu", "amd", "ryzen", "processor", "ryzen5", "5600x"],
      warranty: "3 years brand warranty",
      isFeatured: true,
      isActive: true
    },
    {
      name: "Corsair RM750x 750W 80+ Gold PSU",
      slug: "corsair-rm750x-750w-80-gold-psu",
      description: "Corsair RM750x 750W 80+ Gold Certified Fully Modular Power Supply. Zero RPM mode for silent operation, 10-year warranty. Ideal for high-end gaming builds.",
      brand: "Corsair",
      sku: "HW-PSU-RM750X-005",
      condition: "new",
      price: 15500,
      stock: 12,
      lowStockThreshold: 4,
      images: [
        "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&auto=format&fit=crop"
      ],
      specifications: {
        wattage: "750W",
        efficiency: "80+ Gold",
        modular: "Fully Modular",
        fanSize: "135mm",
        protection: "OVP, UVP, SCP, OCP, OTP"
      },
      tags: ["psu", "power supply", "corsair", "750w", "modular", "gold"],
      warranty: "10 years brand warranty",
      isFeatured: false,
      isActive: true
    }
  ],

  monitors: [
    {
      name: "Dell UltraSharp 27\" 4K USB-C Monitor (U2723D)",
      slug: "dell-ultrasharp-27-4k-u2723d",
      description: "Dell UltraSharp 27-inch 4K IPS monitor with USB-C 90W power delivery. 3840x2160 resolution, 100% sRGB, 98% DCI-P3. Ideal for creative professionals.",
      brand: "Dell",
      sku: "MON-DELL-U2723D-001",
      condition: "new",
      price: 72000,
      stock: 6,
      lowStockThreshold: 2,
      images: [
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593640408182-31c228bf27e3?w=600&auto=format&fit=crop"
      ],
      specifications: {
        size: "27 inch",
        resolution: "3840x2160 (4K UHD)",
        panel: "IPS",
        refreshRate: "60Hz",
        ports: "HDMI 2.0, DisplayPort 1.4, USB-C 90W",
        colorGamut: "100% sRGB, 98% DCI-P3"
      },
      tags: ["monitor", "dell", "4k", "ultrasharp", "usb-c", "ips"],
      warranty: "3 years brand warranty",
      isFeatured: true,
      isActive: true
    },
    {
      name: "LG 27GL850 27\" QHD 144Hz IPS Gaming Monitor",
      slug: "lg-27gl850-27-qhd-144hz-gaming",
      description: "LG 27GL850 27-inch QHD (2560x1440) Nano IPS gaming monitor. 144Hz refresh rate, 1ms response time (GTG), NVIDIA G-Sync compatible, AMD FreeSync Premium.",
      brand: "LG",
      sku: "MON-LG-27GL850-002",
      condition: "used",
      price: 42000,
      stock: 5,
      lowStockThreshold: 2,
      images: [
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593640408182-31c228bf27e3?w=600&auto=format&fit=crop"
      ],
      specifications: {
        size: "27 inch",
        resolution: "2560x1440 (QHD)",
        panel: "Nano IPS",
        refreshRate: "144Hz",
        responseTime: "1ms GTG",
        ports: "HDMI, DisplayPort, USB 3.0"
      },
      tags: ["monitor", "lg", "144hz", "qhd", "gaming", "ips", "gsync"],
      warranty: "No warranty",
      isFeatured: true,
      isActive: true
    },
    {
      name: "Samsung 24\" FHD Business Monitor (S24A400)",
      slug: "samsung-24-fhd-s24a400",
      description: "Samsung 24-inch FHD IPS monitor with 75Hz refresh rate, AMD FreeSync, eye care technology. Adjustable stand (tilt, swivel, height). Great value office display.",
      brand: "Samsung",
      sku: "MON-SAM-S24A400-003",
      condition: "new",
      price: 22000,
      stock: 18,
      lowStockThreshold: 5,
      images: [
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593640408182-31c228bf27e3?w=600&auto=format&fit=crop"
      ],
      specifications: {
        size: "24 inch",
        resolution: "1920x1080 (FHD)",
        panel: "IPS",
        refreshRate: "75Hz",
        ports: "HDMI, DisplayPort, VGA",
        eyeCare: "Flicker-free, Eye Saver Mode"
      },
      tags: ["monitor", "samsung", "24 inch", "office", "fhd", "freesync"],
      warranty: "3 years brand warranty",
      isFeatured: false,
      isActive: true
    },
    {
      name: "ASUS TUF Gaming 27\" 165Hz Curved Monitor",
      slug: "asus-tuf-gaming-27-165hz-curved",
      description: "ASUS TUF Gaming VG27VQ 27-inch curved (1500R) FHD gaming monitor. 165Hz refresh rate, 1ms MPRT, FreeSync Premium, Shadow Boost technology.",
      brand: "ASUS",
      sku: "MON-ASUS-VG27VQ-004",
      condition: "new",
      price: 36000,
      stock: 10,
      lowStockThreshold: 3,
      images: [
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593640408182-31c228bf27e3?w=600&auto=format&fit=crop"
      ],
      specifications: {
        size: "27 inch",
        resolution: "1920x1080 (FHD)",
        panel: "VA Curved 1500R",
        refreshRate: "165Hz",
        responseTime: "1ms MPRT",
        ports: "HDMI 2.0, DisplayPort 1.2"
      },
      tags: ["monitor", "asus", "curved", "165hz", "gaming", "tuf"],
      warranty: "3 years brand warranty",
      isFeatured: false,
      isActive: true
    },
    {
      name: "HP 22\" FHD IPS Monitor (22es)",
      slug: "hp-22-fhd-ips-22es",
      description: "HP 22es 22-inch FHD IPS monitor with ultra-slim design. IPS panel for wide viewing angles and accurate colors. Anti-glare coating. Ideal for home and office.",
      brand: "HP",
      sku: "MON-HP-22ES-005",
      condition: "refurbished",
      price: 12500,
      stock: 14,
      lowStockThreshold: 4,
      images: [
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593640408182-31c228bf27e3?w=600&auto=format&fit=crop"
      ],
      specifications: {
        size: "22 inch",
        resolution: "1920x1080 (FHD)",
        panel: "IPS",
        refreshRate: "60Hz",
        ports: "HDMI, VGA",
        brightness: "250 nits"
      },
      tags: ["monitor", "hp", "22 inch", "ips", "fhd", "slim", "office"],
      warranty: "3 months seller warranty",
      isFeatured: false,
      isActive: true
    }
  ],

  networking: [
    {
      name: "TP-Link Archer AX73 AX5400 Wi-Fi 6 Router",
      slug: "tp-link-archer-ax73-wifi6",
      description: "TP-Link Archer AX73 Wi-Fi 6 router with AX5400 speeds (574Mbps + 4804Mbps). 6 antennas, OFDMA, MU-MIMO, OneMesh compatible. Covers up to 250 sq.m.",
      brand: "TP-Link",
      sku: "NET-TPL-AX73-001",
      condition: "new",
      price: 16500,
      stock: 15,
      lowStockThreshold: 5,
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop"
      ],
      specifications: {
        standard: "Wi-Fi 6 (802.11ax)",
        speeds: "574Mbps (2.4GHz) + 4804Mbps (5GHz)",
        ports: "1x WAN GbE, 4x LAN GbE, 1x USB 3.0",
        antennas: "6 external",
        security: "WPA3"
      },
      tags: ["router", "wifi6", "tp-link", "archer", "ax5400"],
      warranty: "2 years brand warranty",
      isFeatured: true,
      isActive: true
    },
    {
      name: "TP-Link TL-SG108 8-Port Gigabit Switch",
      slug: "tp-link-tl-sg108-8-port-switch",
      description: "TP-Link TL-SG108 8-Port Gigabit unmanaged network switch. Plug-and-play, fanless design, supports Jumbo Frames up to 16KB. Ideal for home and small office networks.",
      brand: "TP-Link",
      sku: "NET-TPL-SG108-002",
      condition: "new",
      price: 2800,
      stock: 40,
      lowStockThreshold: 10,
      images: [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop"
      ],
      specifications: {
        ports: "8x RJ-45 Gigabit",
        speed: "10/100/1000Mbps auto-negotiation",
        switching: "16Gbps",
        fanless: "Yes",
        jumboFrames: "Up to 16KB"
      },
      tags: ["switch", "gigabit", "tp-link", "networking", "8 port"],
      warranty: "Lifetime brand warranty",
      isFeatured: false,
      isActive: true
    },
    {
      name: "Huawei 4G LTE USB Dongle (E3372h)",
      slug: "huawei-4g-lte-usb-dongle-e3372h",
      description: "Huawei E3372h-320 4G LTE USB dongle. Supports download speeds up to 150Mbps. Works as HiLink mode (plug-and-play). Compatible with most laptops.",
      brand: "Huawei",
      sku: "NET-HUW-E3372-003",
      condition: "new",
      price: 3500,
      stock: 25,
      lowStockThreshold: 8,
      images: [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop"
      ],
      specifications: {
        technology: "4G LTE Cat 4",
        downloadSpeed: "Up to 150Mbps",
        uploadSpeed: "Up to 50Mbps",
        interface: "USB 2.0",
        simType: "Standard SIM"
      },
      tags: ["dongle", "4g", "lte", "huawei", "usb", "networking", "mobile internet"],
      warranty: "1 year brand warranty",
      isFeatured: false,
      isActive: true
    },
    {
      name: "D-Link DWA-131 Wireless N Nano USB Adapter",
      slug: "d-link-dwa-131-wireless-usb-adapter",
      description: "D-Link DWA-131 Wireless N300 Nano USB adapter. Compact plug-and-play Wi-Fi dongle for desktops and laptops. Supports WPA/WPA2 security.",
      brand: "D-Link",
      sku: "NET-DLK-DWA131-004",
      condition: "new",
      price: 1200,
      stock: 50,
      lowStockThreshold: 15,
      images: [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop"
      ],
      specifications: {
        standard: "IEEE 802.11n/g/b",
        speed: "300Mbps",
        interface: "USB 2.0",
        security: "WPA/WPA2/WEP",
        os: "Windows, Mac, Linux"
      },
      tags: ["wifi adapter", "d-link", "usb", "wireless", "n300", "dongle"],
      warranty: "1 year brand warranty",
      isFeatured: false,
      isActive: true
    },
    {
      name: "Tenda AC6 AC1200 Dual-Band Wi-Fi Router",
      slug: "tenda-ac6-ac1200-dual-band-router",
      description: "Tenda AC6 AC1200 Smart Dual-Band Wi-Fi router. 867Mbps on 5GHz + 300Mbps on 2.4GHz. 5 high-gain antennas, beamforming, Tenda app management. Great for small homes.",
      brand: "Tenda",
      sku: "NET-TND-AC6-005",
      condition: "new",
      price: 4200,
      stock: 22,
      lowStockThreshold: 6,
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop"
      ],
      specifications: {
        standard: "Wi-Fi 5 (802.11ac)",
        speeds: "300Mbps (2.4GHz) + 867Mbps (5GHz)",
        ports: "1x WAN, 3x LAN (100Mbps)",
        antennas: "5 external",
        security: "WPA2"
      },
      tags: ["router", "tenda", "ac1200", "dual-band", "wifi5"],
      warranty: "3 years brand warranty",
      isFeatured: false,
      isActive: true
    }
  ],

  "printers-scanners": [
    {
      name: "HP LaserJet Pro M404dn Monochrome Printer",
      slug: "hp-laserjet-pro-m404dn",
      description: "HP LaserJet Pro M404dn single-function monochrome laser printer. Up to 38ppm, automatic duplex printing, Ethernet + USB, 250-sheet input tray. Built for busy offices.",
      brand: "HP",
      sku: "PRT-HP-M404DN-001",
      condition: "new",
      price: 38000,
      stock: 8,
      lowStockThreshold: 2,
      images: [
        "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop"
      ],
      specifications: {
        type: "Monochrome Laser",
        speed: "38ppm",
        duplex: "Automatic",
        connectivity: "Ethernet, USB 2.0",
        paperCapacity: "250 sheets",
        resolution: "1200x1200 dpi"
      },
      tags: ["printer", "hp", "laser", "monochrome", "duplex", "office"],
      warranty: "1 year brand warranty",
      isFeatured: true,
      isActive: true
    },
    {
      name: "Epson EcoTank L3250 All-in-One Printer",
      slug: "epson-ecotank-l3250-all-in-one",
      description: "Epson EcoTank L3250 wireless all-in-one printer (print, scan, copy). Ink tank system with no cartridges — saves cost. Wi-Fi Direct, print from smartphone. Up to 33ppm black.",
      brand: "Epson",
      sku: "PRT-EPS-L3250-002",
      condition: "new",
      price: 28000,
      stock: 12,
      lowStockThreshold: 3,
      images: [
        "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop"
      ],
      specifications: {
        type: "Inkjet All-in-One (Print/Scan/Copy)",
        speed: "33ppm black, 15ppm colour",
        connectivity: "Wi-Fi, Wi-Fi Direct, USB",
        inkSystem: "EcoTank (refillable)",
        scanResolution: "600x1200 dpi",
        paperSize: "A4"
      },
      tags: ["printer", "epson", "ecotank", "all-in-one", "wireless", "inkjet"],
      warranty: "2 years brand warranty",
      isFeatured: true,
      isActive: true
    },
    {
      name: "Canon PIXMA G3020 Wireless Ink Tank Printer",
      slug: "canon-pixma-g3020-wireless-ink-tank",
      description: "Canon PIXMA G3020 all-in-one (print/scan/copy) wireless ink tank printer. Megatank system delivers ultra-low print cost. Mobile printing with Canon PRINT app.",
      brand: "Canon",
      sku: "PRT-CAN-G3020-003",
      condition: "new",
      price: 24000,
      stock: 10,
      lowStockThreshold: 3,
      images: [
        "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop"
      ],
      specifications: {
        type: "Inkjet All-in-One (Print/Scan/Copy)",
        speed: "11ipm black, 6ipm colour",
        connectivity: "Wi-Fi, USB",
        inkSystem: "Megatank",
        scanResolution: "600x1200 dpi",
        paperSize: "A4"
      },
      tags: ["printer", "canon", "pixma", "ink tank", "wireless", "all-in-one"],
      warranty: "1 year brand warranty",
      isFeatured: false,
      isActive: true
    },
    {
      name: "HP OfficeJet Pro 9015e All-in-One Printer (Used)",
      slug: "hp-officejet-pro-9015e-used",
      description: "HP OfficeJet Pro 9015e wireless all-in-one (print/scan/copy/fax). Automatic duplex, 35-page ADF, supports HP+ and Instant Ink. Excellent for home office use.",
      brand: "HP",
      sku: "PRT-HP-OJP9015-004",
      condition: "used",
      price: 16000,
      stock: 4,
      lowStockThreshold: 1,
      images: [
        "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop"
      ],
      specifications: {
        type: "Inkjet All-in-One (Print/Scan/Copy/Fax)",
        speed: "22ppm black, 18ppm colour",
        connectivity: "Wi-Fi, Ethernet, USB",
        adf: "35-sheet",
        duplex: "Automatic",
        paperSize: "A4"
      },
      tags: ["printer", "hp", "officejet", "all-in-one", "duplex", "used"],
      warranty: "No warranty",
      isFeatured: false,
      isActive: true
    },
    {
      name: "Epson DS-530 Duplex Document Scanner",
      slug: "epson-ds-530-duplex-document-scanner",
      description: "Epson WorkForce DS-530 color duplex document scanner. Up to 35ppm/70ipm, 50-sheet ADF, USB 3.0. Scans business cards, receipts, ID cards. Ideal for offices.",
      brand: "Epson",
      sku: "PRT-EPS-DS530-005",
      condition: "used",
      price: 18500,
      stock: 3,
      lowStockThreshold: 1,
      images: [
        "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop"
      ],
      specifications: {
        type: "Document Scanner",
        speed: "35ppm / 70ipm (duplex)",
        adf: "50 sheets",
        resolution: "600 dpi optical",
        connectivity: "USB 3.0",
        scanTo: "PDF, JPEG, TIFF, BMP"
      },
      tags: ["scanner", "epson", "document scanner", "duplex", "adf", "office"],
      warranty: "No warranty",
      isFeatured: false,
      isActive: true
    }
  ]
};

export default productsByCategory;