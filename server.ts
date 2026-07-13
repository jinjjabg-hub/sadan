import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import fs from "fs";

const db = new Database("database.sqlite", { timeout: 10000 });
db.pragma("journal_mode = WAL");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    birthdate TEXT,
    amount INTEGER NOT NULL,
    payment_day TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    account_holder TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Ensure columns exist (migration for older databases)
try {
  db.prepare("ALTER TABLE posts ADD COLUMN image_url TEXT").run();
} catch (e) {}
try {
  db.prepare("ALTER TABLE posts ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP").run();
} catch (e) {}

// Seed initial data if empty or has old content
const postCount = db.prepare("SELECT COUNT(*) as count FROM posts").get() as { count: number };
if (postCount.count === 0) {
  let seeded = false;
  try {
    if (fs.existsSync("seed_posts.json")) {
      const seedData = JSON.parse(fs.readFileSync("seed_posts.json", "utf8"));
      if (Array.isArray(seedData) && seedData.length > 0) {
        const insertPost = db.prepare("INSERT INTO posts (title, content, category, image_url, created_at) VALUES (?, ?, ?, ?, ?)");
        const dbtx = db.transaction(() => {
          for (const post of seedData) {
            insertPost.run(
              post.title || "",
              post.content || "",
              post.category || "공지사항",
              post.image_url || null,
              post.created_at || new Date().toISOString()
            );
          }
        });
        dbtx();
        console.log(`Seeded ${seedData.length} posts from seed_posts.json`);
        seeded = true;
      }
    }
  } catch (err) {
    console.error("Failed to seed from seed_posts.json:", err);
  }

  if (!seeded) {
    const insertPost = db.prepare("INSERT INTO posts (title, content, category, image_url) VALUES (?, ?, ?, ?)");
    insertPost.run(
      "사단법인 마음지키미 공식 홈페이지 개설 안내", 
      "안녕하십니까. 사단법인 마음지키미의 공식 홈페이지가 개설되었습니다. 본 소식 공간을 통해 앞으로 다양한 공지사항과 행사 소식을 전달해 드리겠습니다. 생명 존중 문화를 선도하는 마음지키미의 발걸음에 많은 격려와 동행을 부탁드립니다. 감사합니다.", 
      "공지사항", 
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&h=500&q=80"
    );
    insertPost.run(
      "제3회 생명존중 생명사랑 자원봉사자 워크숍 현장", 
      "마음지키미 소속 전문 강사진과 자원봉사자분들이 한자리에 모여 제3회 생명존중 자원봉사자 워크숍을 진행했습니다. 서로의 활동 소감을 나누고 따뜻한 지지와 연대를 확인하는 소중한 시간이었습니다.", 
      "행사사진", 
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&h=500&q=80"
    );
    insertPost.run(
      "부산 청소년 생명존중 게이트키퍼 교육 강사 활동", 
      "지난 주간 부산 관내 중고등학교를 대상으로 '청소년 생명존중 게이트키퍼 양성 교육'을 다녀왔습니다. 청소년들의 마음에 귀 기울이고, 위기 신호를 빠르게 포착하여 전문 기관으로 연계하는 생명지킴이 역할을 충실히 수행할 수 있도록 유익한 교육을 펼쳤습니다.", 
      "강사활동", 
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&h=500&q=80"
    );
  }
}

const settingsCount = db.prepare("SELECT COUNT(*) as count FROM settings").get() as { count: number };
if (settingsCount.count === 0) {
  const insertSetting = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
  insertSetting.run("site_name", "사단법인 마음지키미");
  insertSetting.run("primary_color", "#EC4899"); // Pink-500
  insertSetting.run("bg_color", "#F9FAFB"); // Gray-50
}

// Clean up legacy bloated base64 images (>5MB characters) in database to restore API capacity
try {
  const posts = db.prepare("SELECT id, category, image_url FROM posts").all() as any[];
  const updateStmt = db.prepare("UPDATE posts SET image_url = ? WHERE id = ?");
  for (const post of posts) {
    if (!post.image_url) continue;

    let defaultUrl = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"; // Default
    if (post.category === "행사사진") {
      defaultUrl = "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80";
    } else if (post.category === "강사활동") {
      defaultUrl = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80";
    }

    let images: string[] = [];
    let isJson = false;
    try {
      if (post.image_url.startsWith("[") && post.image_url.endsWith("]")) {
        images = JSON.parse(post.image_url);
        isJson = true;
      } else {
        images = [post.image_url];
      }
    } catch (e) {
      images = [post.image_url];
    }

    let changed = false;
    const sanitizedUrls = images.map(url => {
      // If image is an extremely bloated base64 string (>5MB characters), replace with clean unsplash stock photo
      if (url && url.startsWith("data:") && url.length > 5000000) {
        changed = true;
        return defaultUrl;
      }
      return url;
    });

    if (changed) {
      const finalVal = isJson ? JSON.stringify(sanitizedUrls) : sanitizedUrls[0];
      updateStmt.run(finalVal, post.id);
    }
  }
  console.log("Successfully ran aggressive image size optimization on startup.");
} catch (e) {
  console.error("Failed to optimize bloated base64 images:", e);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "150mb" }));
  app.use(express.urlencoded({ limit: "150mb", extended: true }));

  // API Routes
  app.get("/api/posts", (req, res) => {
    const posts = db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
    res.json(posts);
  });

  app.post("/api/posts", (req, res) => {
    try {
      const { title, content, category, image_url } = req.body;
      const info = db.prepare("INSERT INTO posts (title, content, category, image_url) VALUES (?, ?, ?, ?)")
        .run(title || "", content || "", category || "", image_url || null);
      res.json({ id: Number(info.lastInsertRowid) });
    } catch (err: any) {
      console.error("Error creating post:", err);
      res.status(500).json({ error: err.message || "Failed to create post" });
    }
  });

  app.put("/api/posts/:id", (req, res) => {
    try {
      const { title, content, category, image_url } = req.body;
      const id = parseInt(req.params.id, 10);
      db.prepare("UPDATE posts SET title = ?, content = ?, category = ?, image_url = ? WHERE id = ?")
        .run(title || "", content || "", category || "", image_url || null, id);
      res.json({ success: true });
    } catch (err: any) {
      console.error("Error updating post:", err);
      res.status(500).json({ error: err.message || "Failed to update post" });
    }
  });

  app.delete("/api/posts/:id", (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      db.prepare("DELETE FROM posts WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (err: any) {
      console.error("Error deleting post:", err);
      res.status(500).json({ error: err.message || "Failed to delete post" });
    }
  });

  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    const settingsMap = (settings as any[]).reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsMap);
  });

  app.post("/api/settings", (req, res) => {
    const updates = req.body;
    const upsert = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    for (const [key, value] of Object.entries(updates)) {
      upsert.run(key, value);
    }
    res.json({ success: true });
  });

  app.get("/api/contacts", (req, res) => {
    const contacts = db.prepare("SELECT * FROM contacts ORDER BY created_at DESC").all();
    res.json(contacts);
  });

  app.post("/api/contacts", (req, res) => {
    const { name, phone, message } = req.body;
    db.prepare("INSERT INTO contacts (name, phone, message) VALUES (?, ?, ?)").run(name, phone, message);
    res.json({ success: true });
  });

  app.delete("/api/contacts/:id", (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      db.prepare("DELETE FROM contacts WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (err: any) {
      console.error("Error deleting contact:", err);
      res.status(500).json({ error: err.message || "Failed to delete contact" });
    }
  });

  app.get("/api/donations", (req, res) => {
    const donations = db.prepare("SELECT * FROM donations ORDER BY created_at DESC").all();
    res.json(donations);
  });

  app.post("/api/donations", (req, res) => {
    const { name, phone, email, birthdate, amount, payment_day, bank_name, account_number, account_holder } = req.body;
    db.prepare(`
      INSERT INTO donations (name, phone, email, birthdate, amount, payment_day, bank_name, account_number, account_holder)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, phone, email, birthdate, amount, payment_day, bank_name, account_number, account_holder);
    res.json({ success: true });
  });

  app.delete("/api/donations/:id", (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      db.prepare("DELETE FROM donations WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (err: any) {
      console.error("Error deleting donation:", err);
      res.status(500).json({ error: err.message || "Failed to delete donation" });
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
    const distPath = path.join(process.cwd(), "dist");
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
