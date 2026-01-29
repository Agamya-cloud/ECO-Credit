import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const usersFile = path.join(dataDir, "users.json");
const billingFile = path.join(dataDir, "billing.json");
const sessionsFile = path.join(dataDir, "sessions.json");

// Types
export interface StoredUser {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  carbon_credits: number;
  created_at: string;
  updated_at: string;
}

export interface BillingEntry {
  id: number;
  user_id: number;
  energy_type: string;
  units_consumed: number;
  carbon_emissions: number;
  credits_earned: number;
  date: string;
  created_at: string;
}

export interface Session {
  user_id: number;
  token: string;
  expires_at: string;
}

// Initialize storage
function initializeStorage() {
  // Initialize users file
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify({ users: [], nextId: 1 }));
  }

  // Initialize billing file
  if (!fs.existsSync(billingFile)) {
    fs.writeFileSync(billingFile, JSON.stringify({ entries: [], nextId: 1 }));
  }

  // Initialize sessions file
  if (!fs.existsSync(sessionsFile)) {
    fs.writeFileSync(sessionsFile, JSON.stringify({ sessions: {} }));
  }
}

// Users storage
export const usersStorage = {
  getAll(): StoredUser[] {
    try {
      const data = JSON.parse(fs.readFileSync(usersFile, "utf-8")) as {
        users: StoredUser[];
      };
      return data.users;
    } catch {
      return [];
    }
  },

  getById(id: number): StoredUser | undefined {
    return this.getAll().find((u) => u.id === id);
  },

  getByEmail(email: string): StoredUser | undefined {
    return this.getAll().find((u) => u.email === email);
  },

  getByUsername(username: string): StoredUser | undefined {
    return this.getAll().find((u) => u.username === username);
  },

  save(user: StoredUser): void {
    const data = JSON.parse(fs.readFileSync(usersFile, "utf-8")) as {
      users: StoredUser[];
      nextId: number;
    };
    const existingIndex = data.users.findIndex((u) => u.id === user.id);

    if (existingIndex >= 0) {
      data.users[existingIndex] = user;
    } else {
      data.users.push(user);
    }

    fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));
  },

  getNextId(): number {
    const data = JSON.parse(fs.readFileSync(usersFile, "utf-8")) as {
      nextId: number;
    };
    const nextId = data.nextId;
    data.nextId++;
    fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));
    return nextId;
  },
};

// Billing storage
export const billingStorage = {
  getByUserId(userId: number): BillingEntry[] {
    try {
      const data = JSON.parse(fs.readFileSync(billingFile, "utf-8")) as {
        entries: BillingEntry[];
      };
      return data.entries.filter((e) => e.user_id === userId);
    } catch {
      return [];
    }
  },

  getAll(): BillingEntry[] {
    try {
      const data = JSON.parse(fs.readFileSync(billingFile, "utf-8")) as {
        entries: BillingEntry[];
      };
      return data.entries;
    } catch {
      return [];
    }
  },

  save(entry: BillingEntry): void {
    const data = JSON.parse(fs.readFileSync(billingFile, "utf-8")) as {
      entries: BillingEntry[];
      nextId: number;
    };
    data.entries.push(entry);
    fs.writeFileSync(billingFile, JSON.stringify(data, null, 2));
  },

  getNextId(): number {
    const data = JSON.parse(fs.readFileSync(billingFile, "utf-8")) as {
      nextId: number;
    };
    const nextId = data.nextId;
    data.nextId++;
    fs.writeFileSync(billingFile, JSON.stringify(data, null, 2));
    return nextId;
  },
};

// Sessions storage
export const sessionsStorage = {
  get(token: string): Session | undefined {
    try {
      const data = JSON.parse(fs.readFileSync(sessionsFile, "utf-8")) as {
        sessions: Record<string, Session>;
      };
      return data.sessions[token];
    } catch {
      return undefined;
    }
  },

  set(token: string, session: Session): void {
    const data = JSON.parse(fs.readFileSync(sessionsFile, "utf-8")) as {
      sessions: Record<string, Session>;
    };
    data.sessions[token] = session;
    fs.writeFileSync(sessionsFile, JSON.stringify(data, null, 2));
  },

  delete(token: string): void {
    const data = JSON.parse(fs.readFileSync(sessionsFile, "utf-8")) as {
      sessions: Record<string, Session>;
    };
    delete data.sessions[token];
    fs.writeFileSync(sessionsFile, JSON.stringify(data, null, 2));
  },
};

// Initialize on module load
initializeStorage();
