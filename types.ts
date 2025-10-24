
export type Sender = 'user' | 'ai';

export interface Message {
  id: number;
  text: string;
  sender: Sender;
  timestamp: string;
  references?: { title: string; link: string }[];
  feedback?: 'like' | 'dislike' | null;
}

export type Standard = "General" | "NIST" | "ISO" | "SOC2" | "CIS" | "OWASP" | "MITRE";

export type Tab = "Chat" | "Policy Generation";

export type CompanySize = "Small" | "Medium" | "Large";

export type BusinessType = "E-commerce" | "Finance" | "Healthcare" | "Tech Startup";