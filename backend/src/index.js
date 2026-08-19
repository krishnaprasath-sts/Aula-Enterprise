const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./config/db');
const multer = require('multer');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'aula_super_secure_jwt_secret_2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('mediaFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Return clean relative path for uploads
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

app.post('/api/upload-multiple', upload.array('mediaFiles', 50), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
  res.json({ urls: fileUrls });
});

// In-Memory fallback store if MySQL is not running
let isDbConnected = false;

// Test DB Connection and Initialize Tables
const initDb = async () => {
  try {
    const conn = await pool.getConnection();
    isDbConnected = true;
    console.log('✅ Connected to MySQL Database.');

    // Create Tables if not exist
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS hero_banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        ctaText VARCHAR(100) DEFAULT 'Schedule Consultation',
        ctaLink VARCHAR(255) DEFAULT '/contact',
        mediaType VARCHAR(50) DEFAULT 'video',
        mediaUrl VARCHAR(255) DEFAULT '/src/assets/home.mp4',
        trustRate VARCHAR(50) DEFAULT '100%',
        trustLabel VARCHAR(255) DEFAULT 'Customs Compliance Rate',
        status VARCHAR(50) DEFAULT 'Active',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) DEFAULT 'Permits',
        shortDesc TEXT,
        iconName VARCHAR(100) DEFAULT 'FileCheck',
        image VARCHAR(255),
        processingTime VARCHAR(100) DEFAULT 'Within 2 Hours',
        featured BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'Active',
        order_index INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    try {
      await conn.query('ALTER TABLE services ADD COLUMN image VARCHAR(255)');
    } catch (err) {
      // Ignore if column already exists
    }

    await conn.query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        serviceNeeded VARCHAR(255),
        urgency VARCHAR(50) DEFAULT 'Medium',
        status VARCHAR(50) DEFAULT 'New',
        message TEXT,
        attachments TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    try {
      await conn.query('ALTER TABLE enquiries ADD COLUMN attachments TEXT');
    } catch (err) {
      // Ignore if column already exists
    }

    await conn.query(`
      CREATE TABLE IF NOT EXISTS contact_info (
        id INT DEFAULT 1 PRIMARY KEY,
        companyName VARCHAR(255),
        uenNumber VARCHAR(100),
        phone VARCHAR(100),
        whatsapp VARCHAR(100),
        email VARCHAR(255),
        address TEXT,
        operatingHours TEXT,
        emergencySupport TEXT,
        googleMapsUrl TEXT
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        serviceNeeded VARCHAR(255),
        urgency VARCHAR(50) DEFAULT 'Normal',
        status VARCHAR(50) DEFAULT 'New',
        message TEXT,
        attachments TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    try {
      await conn.query('ALTER TABLE contact_submissions ADD COLUMN attachments TEXT');
    } catch (err) {
      // Ignore if column already exists
    }

    await conn.query(`
      CREATE TABLE IF NOT EXISTS permit_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Active',
        order_index INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Seed default admin if table is empty
    const [users] = await conn.query('SELECT * FROM users WHERE email = ?', ['admin@aula.sg']);
    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await conn.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [
        'Master Admin', 'admin@aula.sg', hashedPassword, 'superadmin'
      ]);
      console.log('Seeded default admin: admin@aula.sg / Admin@123');
    }

    // Seed hero banners if empty
    const [banners] = await conn.query('SELECT * FROM hero_banners');
    if (banners.length === 0) {
      for (const b of memoryStore.heroBanners) {
        await conn.query(
          'INSERT INTO hero_banners (title, subtitle, ctaText, ctaLink, mediaType, mediaUrl, trustRate, trustLabel, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [b.title, b.subtitle, b.ctaText, b.ctaLink, b.mediaType, b.mediaUrl, b.trustRate, b.trustLabel, b.status]
        );
      }
      console.log('Seeded hero_banners table with default data.');
    }

    // Seed services if empty
    const [svcs] = await conn.query('SELECT * FROM services');
    if (svcs.length === 0) {
      for (const s of memoryStore.services) {
        await conn.query(
          'INSERT INTO services (title, category, shortDesc, iconName, image, processingTime, order_index, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [s.title, s.category, s.shortDesc, s.iconName, s.image, s.processingTime, s.order_index, s.status]
        );
      }
      console.log('Seeded services table with default data.');
    }

    // Seed contact_info if empty
    const [contact] = await conn.query('SELECT * FROM contact_info');
    if (contact.length === 0) {
      const c = memoryStore.contact;
      await conn.query(
        'INSERT INTO contact_info (id, companyName, uenNumber, phone, whatsapp, email, address, operatingHours, emergencySupport, googleMapsUrl) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [c.companyName, c.uenNumber, c.phone, c.whatsapp, c.email, c.address, c.operatingHours, c.emergencySupport, c.googleMapsUrl]
      );
      console.log('Seeded contact_info table with default data.');
    }

    // Seed permit_types if empty
    const [pts] = await conn.query('SELECT * FROM permit_types');
    if (pts.length === 0) {
      for (const p of memoryStore.permitTypes) {
        await conn.query(
          'INSERT INTO permit_types (title, description, image, order_index, status) VALUES (?, ?, ?, ?, ?)',
          [p.title, p.description, p.image, p.order_index, p.status]
        );
      }
      console.log('Seeded permit_types table with default data.');
    }

    conn.release();
  } catch (err) {
    isDbConnected = false;
    console.warn('⚠️ MySQL not reachable. Falling back to persistent In-Memory / File storage mode.', err.message);
  }
};

// In-Memory store for fast fallback
const memoryStore = {
  permitTypes: [
    { id: 1, code: 'IN', title: 'Import Permit', description: 'Required for bringing commercial goods into Singapore customs territory, verifying GST, duties, and controlling agency permits.', image: '/assets/import.jpg', order_index: 1, status: 'Active' },
    { id: 2, code: 'OUT', title: 'Export Permit', description: 'Official authorization for outbound shipments, strategic items, re-exports, or outward processed goods leaving Singapore.', image: '/assets/export.jpg', order_index: 2, status: 'Active' },
    { id: 3, code: 'GST', title: 'GST Permit', description: 'Goods and Services Tax declaration, exemption filings, temporary import relief, and MES scheme reporting.', image: '/assets/gst.jpg', order_index: 3, status: 'Active' },
    { id: 4, code: 'TR', title: 'Transhipment Permit', description: 'Documentation for cargo moving through Singapore ports to third-country destinations without entering local commerce.', image: '/assets/transhipment.jpg', order_index: 4, status: 'Active' },
    { id: 5, code: 'STR', title: 'Strategic Goods Permit', description: 'Strict compliance for dual-use technology, military hardware, or controlled items under Strategic Goods Control Act.', image: '/assets/strategic goods image.png', order_index: 5, status: 'Active' },
    { id: 6, code: 'COO', title: 'Certificate of Origin', description: 'Preferential & Non-Preferential COO documentation under Singapore Free Trade Agreements (FTAs).', image: '/assets/Certificate of Origin (COO) Support.png', order_index: 6, status: 'Active' },
    { id: 7, code: 'SO', title: 'Shut-Out Permit', description: 'Declarations for export cargo cancelled, rejected at port terminals, or returned to local warehouses.', image: '/assets/shut out permit image.png', order_index: 7, status: 'Active' },
    { id: 8, code: 'HC', title: 'Hand Carry Permit', description: 'Customs declaration for high-value components, jewelry, or prototypes carried via passenger baggage.', image: '/assets/hand carry permit image.png', order_index: 8, status: 'Active' },
    { id: 9, code: 'RX', title: 'Re-Export Permit', description: 'Permits for foreign-origin goods imported temporarily for warehousing or re-packing prior to export.', image: '/assets/re-export permit image.jpg', order_index: 9, status: 'Active' },
    { id: 10, code: 'MES', title: 'Major Exporter Scheme', description: 'IRAS-approved GST suspension management for major Singapore export and manufacturing enterprises.', image: '/assets/major export permit image.jpg', order_index: 10, status: 'Active' },
    { id: 11, code: 'TMD', title: 'Transport Mode Declarations', description: 'Customized permits for Sea Freight, Air Cargo, Land Trucking (Causeway/Tuas), and Parcel Post.', image: '/assets/transportation image.png', order_index: 11, status: 'Active' }
  ],
  heroBanners: [
    {
      id: 1,
      title: 'Navigate Global Trade With Absolute Confidence.',
      subtitle: 'Smart permit declaration, customs clearance and trade compliance solutions that help Singapore businesses move goods faster, accurately and compliantly.',
      ctaText: 'Schedule Consultation',
      ctaLink: 'modal',
      mediaType: 'video',
      mediaUrl: '/assets/home.mp4',
      trustRate: '100%',
      trustLabel: 'Customs Compliance Rate',
      status: 'Active',
      updatedAt: '2026-08-14'
    },
    {
      id: 2,
      title: 'Fast-Track Singapore Customs & Trade Permits.',
      subtitle: 'Expert declaring agents handling complex cargo clearance, transhipment, and GST exemptions with zero delays.',
      ctaText: 'Apply Permits',
      ctaLink: 'modal',
      mediaType: 'image',
      mediaUrl: '/assets/hero.png',
      trustRate: '99.8%',
      trustLabel: 'Same-Day Permit Clearance',
      status: 'Inactive',
      updatedAt: '2026-08-10'
    }
  ],
  services: [
    {
      id: 1,
      title: 'Customs Support & Rulings',
      category: 'Compliance',
      shortDesc: 'Expert representation for Singapore Customs tariff classification rulings, valuation disputes, and advance ruling applications.',
      iconName: 'Shield',
      image: '/assets/service_1_customs.png',
      processingTime: 'Same Day',
      order_index: 1,
      status: 'Active'
    },
    {
      id: 2,
      title: 'Import Clearance Services',
      category: 'Permits',
      shortDesc: 'End-to-end import documentation for sea freight, air cargo, and land checkpoints entering Singapore customs territory.',
      iconName: 'Anchor',
      image: '/assets/service_2_import.png',
      processingTime: 'Within 2 Hours',
      order_index: 2,
      status: 'Active'
    },
    {
      id: 3,
      title: 'Export Documentation & Permits',
      category: 'Permits',
      shortDesc: 'Fast declaration of outbound shipments, strategic items, re-exports, or outward processing trade.',
      iconName: 'Truck',
      image: '/assets/service_3_export.png',
      processingTime: 'Within 2 Hours',
      order_index: 3,
      status: 'Active'
    },
    {
      id: 4,
      title: 'Trade Documentation Verification',
      category: 'Documentation',
      shortDesc: 'Meticulous audit of Commercial Invoices, Packing Lists, Certificates of Analysis, and Transport Documents prior to filing.',
      iconName: 'FileCheck',
      image: '/assets/service_4_docs.png',
      processingTime: '2-4 Hours',
      order_index: 4,
      status: 'Active'
    },
    {
      id: 5,
      title: 'Compliance & Scheme Audits',
      category: 'Compliance',
      shortDesc: 'Comprehensive review of your company’s trade operations to maintain IRAS Major Exporter Scheme (MES) eligibility.',
      iconName: 'Layers',
      image: '/assets/service_5_compliance.png',
      processingTime: '24-48 Hours',
      order_index: 5,
      status: 'Active'
    },
    {
      id: 6,
      title: 'Certificate of Origin (COO) Support',
      category: 'Documentation',
      shortDesc: 'Application and issuance of Preferential and Non-Preferential COOs under Singapore’s extensive network of FTAs.',
      iconName: 'Globe',
      image: '/assets/service_7_coo.png',
      processingTime: 'Within 4 Hours',
      order_index: 6,
      status: 'Active'
    }
  ],
  contact: {
    companyName: 'AULA Permits Pte. Ltd.',
    uenNumber: '202028266G',
    phone: '+65 6123 4567',
    whatsapp: '+65 6123 4567',
    email: 'contact@aulapermits.sg',
    address: '26 Upper Dickson Road, Singapore 207478',
    operatingHours: 'Mon - Fri: 08:30 AM - 06:30 PM | Sat: 09:00 AM - 01:00 PM',
    emergencySupport: '24/7 Urgent Permit Standby Available',
    googleMapsUrl: 'https://maps.google.com/?q=26+Upper+Dickson+Road+Singapore+207478'
  },
  enquiries: [],
  contactSubmissions: []
};

// Initialize DB after memoryStore is available
initDb();

// ==================== JWT AUTH MIDDLEWARE ====================
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Token expired or invalid.' });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ error: 'Authorization header with Bearer token is required.' });
  }
};

// ==================== AUTH ROUTES ====================
// Login with JWT
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    let user = null;

    if (isDbConnected) {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length > 0) {
        user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) user = null;
      }
    }

    // Default admin fallback if DB is not connected or user is demo admin
    if (!user && (email === 'admin@aula.sg' || email === 'admin@admin.com') && (password === 'Admin@123' || password === 'admin123' || password === 'admin')) {
      user = { id: 1, name: 'AULA Master Admin', email: email, role: 'superadmin' };
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify Current User Token
app.get('/api/auth/me', authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

// ==================== HERO BANNERS CRUD ====================
// Get all banners
app.get('/api/hero-banners', async (req, res) => {
  try {
    if (isDbConnected) {
      const [rows] = await pool.query('SELECT * FROM hero_banners ORDER BY id DESC');
      return res.json(rows);
    }
    res.json(memoryStore.heroBanners);
  } catch (err) {
    res.json(memoryStore.heroBanners);
  }
});

// Create banner
app.post('/api/hero-banners', authenticateJWT, async (req, res) => {
  const { title, subtitle, ctaText, ctaLink, mediaType, mediaUrl, trustRate, trustLabel, status } = req.body;
  try {
    if (status === 'Active') {
      // Inactive others
      if (isDbConnected) {
        await pool.query('UPDATE hero_banners SET status = "Inactive"');
      } else {
        memoryStore.heroBanners = memoryStore.heroBanners.map(b => ({ ...b, status: 'Inactive' }));
      }
    }

    if (isDbConnected) {
      const [result] = await pool.query(
        'INSERT INTO hero_banners (title, subtitle, ctaText, ctaLink, mediaType, mediaUrl, trustRate, trustLabel, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [title, subtitle, ctaText, ctaLink, mediaType, mediaUrl, trustRate, trustLabel, status || 'Inactive']
      );
      const [created] = await pool.query('SELECT * FROM hero_banners WHERE id = ?', [result.insertId]);
      return res.status(201).json(created[0]);
    }

    const newBanner = {
      id: Date.now(),
      title, subtitle, ctaText, ctaLink, mediaType, mediaUrl, trustRate, trustLabel,
      status: status || 'Inactive',
      updatedAt: new Date().toISOString().split('T')[0]
    };
    memoryStore.heroBanners.unshift(newBanner);
    res.status(201).json(newBanner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update banner
app.put('/api/hero-banners/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, ctaText, ctaLink, mediaType, mediaUrl, trustRate, trustLabel, status } = req.body;

  try {
    if (status === 'Active') {
      if (isDbConnected) {
        await pool.query('UPDATE hero_banners SET status = "Inactive" WHERE id != ?', [id]);
      } else {
        memoryStore.heroBanners = memoryStore.heroBanners.map(b => b.id != id ? { ...b, status: 'Inactive' } : b);
      }
    }

    if (isDbConnected) {
      await pool.query(
        'UPDATE hero_banners SET title = ?, subtitle = ?, ctaText = ?, ctaLink = ?, mediaType = ?, mediaUrl = ?, trustRate = ?, trustLabel = ?, status = ? WHERE id = ?',
        [title, subtitle, ctaText, ctaLink, mediaType, mediaUrl, trustRate, trustLabel, status, id]
      );
      const [updated] = await pool.query('SELECT * FROM hero_banners WHERE id = ?', [id]);
      return res.json(updated[0]);
    }

    memoryStore.heroBanners = memoryStore.heroBanners.map(b => {
      if (b.id == id) {
        return { ...b, title, subtitle, ctaText, ctaLink, mediaType, mediaUrl, trustRate, trustLabel, status, updatedAt: new Date().toISOString().split('T')[0] };
      }
      return b;
    });
    res.json(memoryStore.heroBanners.find(b => b.id == id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete banner
app.delete('/api/hero-banners/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  try {
    if (isDbConnected) {
      await pool.query('DELETE FROM hero_banners WHERE id = ?', [id]);
    } else {
      memoryStore.heroBanners = memoryStore.heroBanners.filter(b => b.id != id);
    }
    res.json({ message: 'Banner deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== SERVICES CRUD ====================
// Get all services
app.get('/api/services', async (req, res) => {
  try {
    if (isDbConnected) {
      const [rows] = await pool.query('SELECT * FROM services ORDER BY order_index ASC, id DESC');
      return res.json(rows);
    }
    // Sort memory store by order_index ASC, then id DESC
    const sorted = [...memoryStore.services].sort((a, b) => {
      const orderA = a.order_index || 0;
      const orderB = b.order_index || 0;
      if (orderA !== orderB) return orderA - orderB;
      return b.id - a.id;
    });
    res.json(sorted);
  } catch (err) {
    res.json(memoryStore.services);
  }
});

// Create service
app.post('/api/services', authenticateJWT, async (req, res) => {
  const { title, category, shortDesc, iconName, image, processingTime, order_index, status } = req.body;
  try {
    if (isDbConnected) {
      const [result] = await pool.query(
        'INSERT INTO services (title, category, shortDesc, iconName, image, processingTime, order_index, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [title, category, shortDesc, iconName || 'FileCheck', image, processingTime, order_index || 0, status || 'Active']
      );
      const [created] = await pool.query('SELECT * FROM services WHERE id = ?', [result.insertId]);
      return res.status(201).json(created[0]);
    }

    const newService = {
      id: Date.now(),
      title, category, shortDesc, iconName: iconName || 'FileCheck', image,
      processingTime, order_index: order_index || 0, status: status || 'Active'
    };
    memoryStore.services.unshift(newService);
    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update service
app.put('/api/services/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { title, category, shortDesc, iconName, image, processingTime, order_index, status } = req.body;

  try {
    if (isDbConnected) {
      await pool.query(
        'UPDATE services SET title = ?, category = ?, shortDesc = ?, iconName = ?, image = ?, processingTime = ?, order_index = ?, status = ? WHERE id = ?',
        [title, category, shortDesc, iconName, image, processingTime, order_index || 0, status, id]
      );
      const [updated] = await pool.query('SELECT * FROM services WHERE id = ?', [id]);
      return res.json(updated[0]);
    }

    memoryStore.services = memoryStore.services.map(s => {
      if (s.id == id) {
        return { ...s, title, category, shortDesc, iconName, image, processingTime, order_index: order_index || 0, status };
      }
      return s;
    });
    res.json(memoryStore.services.find(s => s.id == id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete service
app.delete('/api/services/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  try {
    if (isDbConnected) {
      await pool.query('DELETE FROM services WHERE id = ?', [id]);
    } else {
      memoryStore.services = memoryStore.services.filter(s => s.id != id);
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Permit Types Routes ---
app.get('/api/permit-types', async (req, res) => {
  if (isDbConnected) {
    try {
      const [rows] = await pool.query('SELECT * FROM permit_types ORDER BY order_index ASC');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.json(memoryStore.permitTypes.sort((a, b) => a.order_index - b.order_index));
  }
});

app.post('/api/permit-types', authenticateJWT, async (req, res) => {
  const { title, description, image, status, order_index } = req.body;
  if (isDbConnected) {
    try {
      const [result] = await pool.query(
        'INSERT INTO permit_types (title, description, image, status, order_index) VALUES (?, ?, ?, ?, ?)',
        [title, description, image, status, order_index]
      );
      res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    const newPt = { id: Date.now(), ...req.body };
    memoryStore.permitTypes.push(newPt);
    res.status(201).json(newPt);
  }
});

app.put('/api/permit-types/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { title, description, image, status, order_index } = req.body;
  if (isDbConnected) {
    try {
      await pool.query(
        'UPDATE permit_types SET title = ?, description = ?, image = ?, status = ?, order_index = ? WHERE id = ?',
        [title, description, image, status, order_index, id]
      );
      res.json({ id, ...req.body });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    const idx = memoryStore.permitTypes.findIndex(p => p.id == id);
    if (idx !== -1) {
      memoryStore.permitTypes[idx] = { id: Number(id), ...req.body };
      res.json(memoryStore.permitTypes[idx]);
    } else {
      res.status(404).json({ error: 'Permit type not found' });
    }
  }
});

app.delete('/api/permit-types/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  if (isDbConnected) {
    try {
      await pool.query('DELETE FROM permit_types WHERE id = ?', [id]);
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    memoryStore.permitTypes = memoryStore.permitTypes.filter(p => p.id != id);
    res.json({ message: 'Deleted successfully' });
  }
});

// ==================== CONTACT & ENQUIRIES ====================
// Get contact
app.get('/api/contact', async (req, res) => {
  try {
    if (isDbConnected) {
      const [rows] = await pool.query('SELECT * FROM contact_info WHERE id = 1');
      if (rows.length > 0) return res.json(rows[0]);
    }
    res.json(memoryStore.contact);
  } catch (err) {
    res.json(memoryStore.contact);
  }
});

// Update contact
app.put('/api/contact', authenticateJWT, async (req, res) => {
  const data = req.body;
  try {
    if (isDbConnected) {
      await pool.query(
        `INSERT INTO contact_info (id, companyName, uenNumber, phone, whatsapp, email, address, operatingHours, emergencySupport, googleMapsUrl)
         VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         companyName = VALUES(companyName), uenNumber = VALUES(uenNumber), phone = VALUES(phone), 
         whatsapp = VALUES(whatsapp), email = VALUES(email), address = VALUES(address), 
         operatingHours = VALUES(operatingHours), emergencySupport = VALUES(emergencySupport), googleMapsUrl = VALUES(googleMapsUrl)`,
        [data.companyName, data.uenNumber, data.phone, data.whatsapp, data.email, data.address, data.operatingHours, data.emergencySupport, data.googleMapsUrl]
      );
    }
    memoryStore.contact = { ...memoryStore.contact, ...data };
    res.json({ message: 'Contact info updated', data: memoryStore.contact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get enquiries
app.get('/api/enquiries', authenticateJWT, async (req, res) => {
  try {
    if (isDbConnected) {
      const [rows] = await pool.query('SELECT * FROM enquiries ORDER BY id DESC');
      return res.json(rows);
    }
    res.json(memoryStore.enquiries);
  } catch (err) {
    res.json(memoryStore.enquiries);
  }
});

// Submit enquiry from public website
app.post('/api/enquiries', async (req, res) => {
  const { name, company, email, phone, serviceNeeded, message, attachments } = req.body;
  try {
    if (isDbConnected) {
      const [result] = await pool.query(
        'INSERT INTO enquiries (name, company, email, phone, serviceNeeded, message, attachments) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, company, email, phone, serviceNeeded, message, attachments || null]
      );
      return res.status(201).json({ id: result.insertId, message: 'Enquiry submitted successfully' });
    }
    const newEnquiry = {
      id: Date.now(),
      name, company, email, phone, serviceNeeded, message, attachments: attachments || null,
      urgency: 'Medium', status: 'New', date: new Date().toLocaleString()
    };
    memoryStore.enquiries.unshift(newEnquiry);
    res.status(201).json({ message: 'Enquiry submitted successfully', enquiry: newEnquiry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete enquiry
app.delete('/api/enquiries/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  try {
    if (isDbConnected) {
      await pool.query('DELETE FROM enquiries WHERE id = ?', [id]);
    } else {
      memoryStore.enquiries = memoryStore.enquiries.filter(e => e.id != id);
    }
    res.json({ message: 'Enquiry deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update enquiry status
app.put('/api/enquiries/:id/status', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    if (isDbConnected) {
      await pool.query('UPDATE enquiries SET status = ? WHERE id = ?', [status, id]);
    } else {
      memoryStore.enquiries = memoryStore.enquiries.map(e => e.id == id ? { ...e, status } : e);
    }
    res.json({ message: 'Enquiry status updated', status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== CONTACT SUBMISSIONS ====================
// Get all contact submissions
app.get('/api/contact-submissions', authenticateJWT, async (req, res) => {
  try {
    if (isDbConnected) {
      const [rows] = await pool.query('SELECT * FROM contact_submissions ORDER BY id DESC');
      return res.json(rows);
    }
    res.json(memoryStore.contactSubmissions || []);
  } catch (err) {
    res.json(memoryStore.contactSubmissions || []);
  }
});

// Submit contact form from public website
app.post('/api/contact-submissions', async (req, res) => {
  const { name, company, email, phone, serviceNeeded, message, attachments } = req.body;
  try {
    if (isDbConnected) {
      const [result] = await pool.query(
        'INSERT INTO contact_submissions (name, company, email, phone, serviceNeeded, message, attachments) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, company, email, phone, serviceNeeded, message, attachments || null]
      );
      return res.status(201).json({ id: result.insertId, message: 'Message submitted successfully' });
    }
    if (!memoryStore.contactSubmissions) memoryStore.contactSubmissions = [];
    const newSub = {
      id: Date.now(),
      name, company, email, phone, serviceNeeded, message, attachments: attachments || null,
      urgency: 'Normal', status: 'New', date: new Date().toLocaleString()
    };
    memoryStore.contactSubmissions.unshift(newSub);
    res.status(201).json({ message: 'Message submitted successfully', submission: newSub });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete contact submission
app.delete('/api/contact-submissions/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  try {
    if (isDbConnected) {
      await pool.query('DELETE FROM contact_submissions WHERE id = ?', [id]);
    } else {
      memoryStore.contactSubmissions = (memoryStore.contactSubmissions || []).filter(s => s.id != id);
    }
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update contact submission status
app.put('/api/contact-submissions/:id/status', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    if (isDbConnected) {
      await pool.query('UPDATE contact_submissions SET status = ? WHERE id = ?', [status, id]);
    } else {
      memoryStore.contactSubmissions = (memoryStore.contactSubmissions || []).map(s => s.id == id ? { ...s, status } : s);
    }
    res.json({ message: 'Message status updated', status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==================== CAREERS / JOB VACANCIES ====================

app.get('/api/jobs', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM job_vacancies ORDER BY id DESC');
    if (rows && rows.length > 0) {
      const openRows = rows.filter(r => !r.status || r.status.toLowerCase() === 'open' || r.status.toLowerCase() === 'active');
      return res.json(openRows.length > 0 ? openRows : rows);
    }
  } catch (err) {
    console.warn('Query to job_vacancies failed, using fallback:', err.message);
  }
  res.json(memoryStore.jobs || []);
});

app.get('/api/jobs/all', authenticateJWT, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM job_vacancies ORDER BY id DESC');
    if (rows && rows.length > 0) {
      return res.json(rows);
    }
  } catch (err) {
    console.warn('Query to job_vacancies all failed, using fallback:', err.message);
  }
  res.json(memoryStore.jobs || []);
});

app.post('/api/jobs', authenticateJWT, async (req, res) => {
  const { title, department, location, employment_type, description, requirements, responsibilities, status } = req.body;
  try {
    try {
      const [result] = await pool.query(
        'INSERT INTO job_vacancies (title, department, location, employment_type, description, requirements, responsibilities, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [title, department, location, employment_type, description, requirements, responsibilities, status || 'Open']
      );
      return res.status(201).json({ id: result.insertId, message: 'Job created successfully' });
    } catch (dbErr) {
      console.warn('DB insert failed, using fallback:', dbErr.message);
    }
    if (!memoryStore.jobs) memoryStore.jobs = [];
    const newJob = { id: Date.now(), title, department, location, employment_type, description, requirements, responsibilities, status: status || 'Open' };
    memoryStore.jobs.unshift(newJob);
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/jobs/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { title, department, location, employment_type, description, requirements, responsibilities, status } = req.body;
  try {
    if (isDbConnected) {
      await pool.query(
        'UPDATE job_vacancies SET title=?, department=?, location=?, employment_type=?, description=?, requirements=?, responsibilities=?, status=? WHERE id=?',
        [title, department, location, employment_type, description, requirements, responsibilities, status, id]
      );
      return res.json({ message: 'Job updated successfully' });
    }
    if (memoryStore.jobs) {
      memoryStore.jobs = memoryStore.jobs.map(j => j.id == id ? { ...j, title, department, location, employment_type, description, requirements, responsibilities, status } : j);
    }
    res.json({ message: 'Job updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/jobs/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  try {
    if (isDbConnected) {
      await pool.query('DELETE FROM job_vacancies WHERE id = ?', [id]);
    } else if (memoryStore.jobs) {
      memoryStore.jobs = memoryStore.jobs.filter(j => j.id != id);
    }
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== JOB APPLICATIONS ====================

app.post('/api/applications', upload.single('resume'), async (req, res) => {
  const { job_id, name, email, phone, experience_years, current_company, linkedin, cover_message } = req.body;
  
  if (!name || !email || !phone || !experience_years || !req.file) {
    return res.status(400).json({ error: 'Missing required fields or resume file.' });
  }

  const resumeUrl = `/uploads/${req.file.filename}`;

  try {
    if (isDbConnected) {
      await pool.query(
        'INSERT INTO job_applications (job_id, name, email, phone, experience_years, current_company, linkedin, resume_url, cover_message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [job_id, name, email, phone, experience_years, current_company || null, linkedin || null, resumeUrl, cover_message || null]
      );
      return res.status(201).json({ message: 'Application submitted successfully' });
    }
    
    if (!memoryStore.applications) memoryStore.applications = [];
    memoryStore.applications.unshift({
      id: Date.now(),
      job_id, name, email, phone, experience_years, current_company, linkedin, resume_url: resumeUrl, cover_message,
      status: 'New', created_at: new Date().toISOString()
    });
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/applications', authenticateJWT, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.*, j.title as job_title 
      FROM job_applications a 
      LEFT JOIN job_vacancies j ON a.job_id = j.id 
      ORDER BY a.id DESC
    `);
    return res.json(rows);
  } catch (err) {
    console.warn('Query to job_applications failed, using fallback:', err.message);
    res.json(memoryStore.applications || []);
  }
});

app.put('/api/applications/:id/status', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    if (isDbConnected) {
      await pool.query('UPDATE job_applications SET status = ? WHERE id = ?', [status, id]);
    } else if (memoryStore.applications) {
      memoryStore.applications = memoryStore.applications.map(a => a.id == id ? { ...a, status } : a);
    }
    res.json({ message: 'Application status updated', status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/applications/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  try {
    if (isDbConnected) {
      await pool.query('DELETE FROM job_applications WHERE id = ?', [id]);
    } else if (memoryStore.applications) {
      memoryStore.applications = memoryStore.applications.filter(a => a.id != id);
    }
    res.json({ message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 AULA Corporate Backend Server running on port ${PORT}`);
});
