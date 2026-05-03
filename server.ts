import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("campusvoice.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT,
    status TEXT DEFAULT 'pending',
    cluster_id TEXT,
    tracking_code TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS clusters (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    employee_id TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS resolved_archives (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT,
    status TEXT,
    cluster_id TEXT,
    tracking_code TEXT,
    archived_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS verified_employees (
    employee_id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    is_used INTEGER DEFAULT 0
  );
`);

// Add some sample verified employee IDs if none exist
const employeeCount = db.prepare("SELECT COUNT(*) as count FROM verified_employees").get() as { count: number };
if (employeeCount.count === 0) {
  const sampleEmployees = [
    { id: "WUA-STAFF-101", name: "Dr. Sarah Moyo" },
    { id: "WUA-STAFF-102", name: "Prof. John Dube" },
    { id: "WUA-STAFF-103", name: "Admin Mary Ziba" }
  ];
  const insert = db.prepare("INSERT INTO verified_employees (employee_id, full_name) VALUES (?, ?)");
  sampleEmployees.forEach(emp => insert.run(emp.id, emp.name));
}

// Add a default admin for preview convenience
const adminCount = db.prepare("SELECT COUNT(*) as count FROM admins").get() as { count: number };
if (adminCount.count === 0) {
  db.prepare("INSERT INTO admins (id, username, password, employee_id) VALUES (?, ?, ?, ?)").run(
    crypto.randomUUID(),
    "admin",
    "admin123",
    "SYSTEM-ADMIN"
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Registration Route
  app.post("/api/admin/register", (req, res) => {
    const { username, password, employeeId } = req.body;
    
    try {
      // 1. Check if Employee ID is valid and not used
      const verification = db.prepare("SELECT * FROM verified_employees WHERE employee_id = ?").get(employeeId) as any;
      
      if (!verification) {
        return res.status(400).json({ error: "Invalid Employee ID. Please contact HR." });
      }
      
      if (verification.is_used) {
        return res.status(400).json({ error: "This Employee ID has already been registered." });
      }

      // 2. Create the admin account
      const adminId = crypto.randomUUID();
      db.prepare("INSERT INTO admins (id, username, password, employee_id) VALUES (?, ?, ?, ?)").run(
        adminId, username, password, employeeId
      );

      // 3. Mark Employee ID as used
      db.prepare("UPDATE verified_employees SET is_used = 1 WHERE employee_id = ?").run(employeeId);

      res.json({ success: true, message: "Account created successfully" });
    } catch (error: any) {
      if (error.message.includes("UNIQUE constraint failed: admins.username")) {
        res.status(400).json({ error: "Username already exists." });
      } else {
        res.status(500).json({ error: "Registration failed." });
      }
    }
  });

  // Login Route
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    const admin = db.prepare("SELECT * FROM admins WHERE username = ? AND password = ?").get(username, password) as any;
    if (admin) {
      res.json({ success: true, admin: { username: admin.username } });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  });

  // API Routes
  app.post("/api/reports", (req, res) => {
    const { category, description, location } = req.body;
    const id = crypto.randomUUID();
    const trackingCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    try {
      db.prepare(`
        INSERT INTO reports (id, category, description, location, tracking_code)
        VALUES (?, ?, ?, ?, ?)
      `).run(id, category, description, location || null, trackingCode);
      
      res.json({ success: true, trackingCode, id });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit report" });
    }
  });

  app.get("/api/reports/:code", (req, res) => {
    const report = db.prepare("SELECT * FROM reports WHERE tracking_code = ?").get(req.params.code);
    if (report) {
      res.json(report);
    } else {
      res.status(404).json({ error: "Report not found" });
    }
  });

  // Admin Routes (Simplified for demo, in production use JWT)
  app.get("/api/admin/reports", (req, res) => {
    const reports = db.prepare("SELECT * FROM reports ORDER BY created_at DESC").all();
    res.json(reports);
  });

  app.get("/api/admin/clusters", (req, res) => {
    const clusters = db.prepare("SELECT * FROM clusters ORDER BY created_at DESC").all();
    res.json(clusters);
  });

  app.patch("/api/admin/reports/:id", (req, res) => {
    const { status, cluster_id } = req.body;
    db.prepare("UPDATE reports SET status = ?, cluster_id = ? WHERE id = ?").run(
      status, cluster_id || null, req.params.id
    );
    res.json({ success: true });
  });

  app.post("/api/admin/clusters", (req, res) => {
    const { title, description } = req.body;
    const id = crypto.randomUUID();
    db.prepare("INSERT INTO clusters (id, title, description) VALUES (?, ?, ?)").run(
      id, title, description
    );
    res.json({ id });
  });

  app.delete("/api/admin/reports/:id", (req, res) => {
    try {
      const report = db.prepare("SELECT * FROM reports WHERE id = ?").get(req.params.id) as any;
      
      if (!report) return res.status(404).json({ error: "Report not found" });
      if (report.status !== 'resolved') return res.status(400).json({ error: "Only resolved reports can be archived" });

      const transaction = db.transaction(() => {
        // 1. Copy to archive
        db.prepare(`
          INSERT INTO resolved_archives (id, category, description, location, status, cluster_id, tracking_code)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(report.id, report.category, report.description, report.location, report.status, report.cluster_id, report.tracking_code);

        // 2. Delete from active reports
        db.prepare("DELETE FROM reports WHERE id = ?").run(req.params.id);
      });

      transaction();
      res.json({ success: true, message: "Report archived successfully" });
    } catch (error) {
      res.status(500).json({ error: "Archiving failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
