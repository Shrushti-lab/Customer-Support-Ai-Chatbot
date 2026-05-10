import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Support Engine Logic ---
interface KnowledgeBase {
  [key: string]: string;
}

class SupportEngine {
  private kb: KnowledgeBase = {
    shipping: "We offer worldwide shipping! Standard shipping takes 5-7 business days, while express delivery takes 1-3 business days. You'll receive a tracking number as soon as your order leaves our warehouse.",
    refunds: "Our refund policy is simple: You have 30 days to return any item in its original condition. Once we receive your return, we'll process your refund within 3-5 business days to your original payment method.",
    technical: "For technical issues, please ensure your software is up to date. If you're experiencing login problems, try resetting your password. For deep-dives, our technical documentation is available 24/7 at docs.support-ai.com.",
    login: "To log in, click the profile icon in the sidebar. If you've forgotten your password, use the 'Forgot Password' link on the login page to receive a reset code via email. For SSO users, ensure your workspace domain is whitelisted.",
    security: "We take security seriously. Your data is encrypted at rest and in transit. We recommend enabling Two-Factor Authentication (2FA) in your account settings for an extra layer of protection.",
    pricing: "We offer three plans: Starter (Free), Pro ($19/mo), and Enterprise (Custom). You can upgrade or downgrade at any time from your billing dashboard. Annual subscriptions receive a 20% discount.",
    deletion: "To delete your account, navigate to your account settings area. Once requested, your account will be permanently deactivated after a 14-day grace period for safety.",
    coupon: "You can use code 'WELCOME10' for 10% off your first subscription. Enter it in the billing section of your dashboard.",
    contact: "You can reach our human team directly at help@supporthub.io or via our 24/7 hotline at 1-888-SUPPORT.",
    jobs: "We are currently hiring for AI Research and Full-Stack Engineering roles! Visit our careers page for more details.",
    privacy: "We are fully GDPR and CCPA compliant. Your conversations are encrypted and we maintain a zero-log policy for sensitive data.",
    greeting: "Hello! I'm your Support assistant. How can I help you today? I can answer questions about logins, shipping, pricing, and more.",
  };

  public getResponse(query: string): { response: string; status: 'bot' | 'human' } {
    const lowerQuery = query.toLowerCase();
    
    // 1. Direct Keyword Matching (Priority)
    if (lowerQuery.includes("ship") || lowerQuery.includes("deliver")) {
      return { response: this.kb.shipping, status: 'bot' };
    }
    if (lowerQuery.includes("refund") || lowerQuery.includes("return") || lowerQuery.includes("money back")) {
      return { response: this.kb.refunds, status: 'bot' };
    }
    if (lowerQuery.includes("login") || lowerQuery.includes("password") || lowerQuery.includes("sign in") || lowerQuery.includes("access")) {
      return { response: this.kb.login, status: 'bot' };
    }
    if (lowerQuery.includes("security") || lowerQuery.includes("safe") || lowerQuery.includes("encrypt") || lowerQuery.includes("2fa")) {
      return { response: this.kb.security, status: 'bot' };
    }
    if (lowerQuery.includes("price") || lowerQuery.includes("cost") || lowerQuery.includes("plan") || lowerQuery.includes("bill")) {
      return { response: this.kb.pricing, status: 'bot' };
    }
    if (lowerQuery.includes("delete") || lowerQuery.includes("close account") || lowerQuery.includes("deactivate")) {
      return { response: this.kb.deletion, status: 'bot' };
    }
    if (lowerQuery.includes("coupon") || lowerQuery.includes("discount") || lowerQuery.includes("promo") || lowerQuery.includes("offer")) {
      return { response: this.kb.coupon, status: 'bot' };
    }
    if (lowerQuery.includes("contact") || lowerQuery.includes("email") || lowerQuery.includes("phone") || lowerQuery.includes("call")) {
      return { response: this.kb.contact, status: 'bot' };
    }
    if (lowerQuery.includes("job") || lowerQuery.includes("career") || lowerQuery.includes("hiring") || lowerQuery.includes("work")) {
      return { response: this.kb.jobs, status: 'bot' };
    }
    if (lowerQuery.includes("privacy") || lowerQuery.includes("data") || lowerQuery.includes("gdpr")) {
      return { response: this.kb.privacy, status: 'bot' };
    }
    if (lowerQuery.includes("tech") || lowerQuery.includes("support") || lowerQuery.includes("help") || lowerQuery.includes("fix")) {
      if (lowerQuery.includes("tech")) return { response: this.kb.technical, status: 'bot' };
      return { response: "I can help with technical issues, shipping, or refunds. What specifically is on your mind?", status: 'bot' };
    }
    if (lowerQuery.includes("hello") || lowerQuery.includes("hi")) {
      return { response: this.kb.greeting, status: 'bot' };
    }

    // 2. Broad Search Fallback
    const results: string[] = [];
    const searchTerms = lowerQuery.split(/\s+/).filter(t => t.length > 3);
    
    for (const [key, value] of Object.entries(this.kb)) {
      if (key === 'greeting') continue;
      const content = (key + " " + value).toLowerCase();
      if (searchTerms.some(term => content.includes(term))) {
        results.push(key.charAt(0).toUpperCase() + key.slice(1));
      }
    }

    if (results.length > 0) {
      return { 
        response: `I couldn't find an exact match, but I found some related information in our knowledge base: ${results.join(", ")}. Would you like to know more about any of these?`, 
        status: 'bot' 
      };
    }

    return { 
      response: "I'm sorry, I couldn't find any information on that topic in our knowledge base. Would you like to connect with a live assistant?", 
      status: 'human' 
    };
  }
}

const engine = new SupportEngine();

// --- Server Setup ---
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/chat", (req, res) => {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    
    // Simulate thinking delay
    setTimeout(() => {
      const result = engine.getResponse(message);
      res.json(result);
    }, 1000);
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
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SupportAI Server running on http://localhost:${PORT}`);
  });
}

startServer();
