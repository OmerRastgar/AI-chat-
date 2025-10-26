import { Standard } from './types';

export const STANDARDS: Standard[] = ["General", "NIST", "ISO", "SOC2", "CIS", "OWASP", "MITRE"];

export const MOCK_MESSAGES: [] = [];

// Constants for Policy Generator
export const COMPANY_SIZES = ["Small (1-50 employees)", "Medium (51-500)", "Large (501+)", "Enterprise (5000+)"];
export const BUSINESS_TYPES = ["E-commerce", "Finance", "Healthcare", "Technology", "Manufacturing", "Education", "Non-Profit", "Other"];
export const LOCATIONS = ["United States", "European Union", "United Kingdom", "Canada", "Australia", "Other"];
export const TECH_STACK_OPTIONS = ["AWS", "Azure", "GCP", "React", "Node.js", "Python/Django", "Java/Spring", "Kubernetes", "Docker", "Salesforce"];
export const SPECIFIC_RISK_OPTIONS = ["Phishing", "Ransomware", "Data Breaches", "Insider Threats", "DDoS Attacks", "Malware Infections", "Supply Chain Attacks"];
export const COMPLIANCE_STANDARDS = ["NIST", "ISO 27001", "SOC 2", "CIS Controls", "OWASP", "MITRE ATT&CK", "HIPAA", "None"];
export const POLICY_TYPES = ["Data Privacy Policy", "Incident Response Plan", "Access Control Policy", "Acceptable Use Standard", "Business Continuity Plan", "Vendor Management Policy", "Other"];
export const EMPLOYEE_ROLES = ["IT Staff", "Executives", "All Employees", "Contractors", "HR", "Finance"];
export const IMPLEMENTATION_TIMELINES = ["Immediate (within 1 month)", "Short-term (1-3 months)", "Medium-term (3-6 months)", "Long-term (6+ months)"];

// Constants for ChatArea
export const CHAT_PLACEHOLDER = "Your cyber companion awaits. Ask away...";
export const AI_THINKING = "AI is thinking...";
export const FEEDBACK_MESSAGE = "Your quick feedback makes us smarter! 👍👎";
export const DISCLAIMER_MESSAGE = "AI can make mistakes. Consider checking important information.";
export const CHAT_HEADER_TITLE = "Cybersecurity Chat";
export const EXPERT_BUTTON_TEXT = "Talk to an Expert";
