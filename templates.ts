// This file now exports the list of policy names and a function to load them dynamically.

export const POLICY_NAMES = [
  "Acceptable Encryption Standard",
  "Acceptable Use Standard",
  "Access Management Policy",
  "Acquisition Assessment Standard",
  "Artificial Intelligence Standard",
  "Asset Management Policy",
  "Audit and Compliance Policy",
  "Business Continuity Policy",
  "Change Management Policy",
  "Cloud Service Provider Management Policy",
  "Configuration Management Policy",
  "Database Credentials Standard",
  "Data Classification Policy",
  "Data Inventory Management Policy",
  "Education Management Policy",
  "Email Management Policy",
  "HR Policy",
  "Identity Management Policy",
  "Incident Response Policy",
  "Information Security Policy",
  "Internal Network Access Management Policy",
  "Internet Usage Standard",
  "Log Management Policy",
  "Mobile Device Management Policy",
  "Network Device Management Policy",
  "Password Construction Standard",
  "Perimeter Network Access Management Policy",
  "Physical Security Management Policy",
  "Privacy Management Policy",
  "Privileged Account Management Policy",
  "Program Management Policy",
  "Remote Work & Teleworking Policy",
  "Resilience Management Policy",
  "Risk Communication Management Policy",
  "Safeguard Implementation Management Policy",
  "Safeguard Selection Management Policy",
  "Safeguard Validation Management Policy",
  "Software Development Management Policy",
  "Software Development Vulnerability Management Policy",
  "Software Management Policy",
  "System Protection Management Policy",
  "Technology Equipment Disposal Standard",
  "Third Party Management Policy",
  "Vulnerability Management Policy",
];

const FILENAME_MAP: { [key: string]: string } = {
  "Acceptable Encryption Standard": "Acceptable_Encryption_Standard.md",
  "Acceptable Use Standard": "Acceptable_Use_Standard.md",
  "Access Management Policy": "Access_Management_Policy.md",
  "Acquisition Assessment Standard": "Acquisition_Assessment_Standard.md",
  "Artificial Intelligence Standard": "Artificial_Intelligence_Standard.md",
  "Asset Management Policy": "Asset_Management_Policy.md",
  "Audit and Compliance Policy": "Audit_and_Compliance_Policy.md",
  "Business Continuity Policy": "Business_Continuity_Policy.md",
  "Change Management Policy": "Change_Management_Policy.md",
  "Cloud Service Provider Management Policy": "Cloud_Service_Provider_Management_Policy.md",
  "Configuration Management Policy": "Configuration_Management_Policy.md",
  "Database Credentials Standard": "Database_Credentials_Standard.md",
  "Data Classification Policy": "Data_Classification_Policy.md",
  "Data Inventory Management Policy": "Data_Inventory_Management_Policy.md",
  "Education Management Policy": "Education_Management_Policy.md",
  "Email Management Policy": "Email_Management_Policy.md",
  "HR Policy": "HR_Policy.md",
  "Identity Management Policy": "Identity_Management_Policy.md",
  "Incident Response Policy": "Incident_Response_Policy.md",
  "Information Security Policy": "Information_Security_Policy.md",
  "Internal Network Access Management Policy": "Internal_Network_Access_Management_Policy.md",
  "Internet Usage Standard": "Internet_Usage_Standard.md",
  "Log Management Policy": "Log_Management_Policy.md",
  "Mobile Device Management Policy": "Mobile_Device_Management_Policy.md",
  "Network Device Management Policy": "Network_Device_Management_Policy.md",
  "Password Construction Standard": "Password_Construction_Standard.md",
  "Perimeter Network Access Management Policy": "Perimeter_Network_Access_Management_Policy.md",
  "Physical Security Management Policy": "Physical_Security_Management_Policy.md",
  "Privacy Management Policy": "Privacy_Management_Policy.md",
  "Privileged Account Management Policy": "Privileged_Account_Management_Policy.md",
  "Program Management Policy": "Program_Management_Policy.md",
  "Remote Work & Teleworking Policy": "Remote_Work_&_Teleworking_Policy.md",
  "Resilience Management Policy": "Resilience_Management_Policy.md",
  "Risk Communication Management Policy": "Risk_Communication_Management_Policy.md",
  "Safeguard Implementation Management Policy": "Safeguard_Implementation_Management_Policy.md",
  "Safeguard Selection Management Policy": "Safeguard_Selection_Management_Policy.md",
  "Safeguard Validation Management Policy": "Safeguard_Validation_Management_Policy.md",
  "Software Development Management Policy": "Software_Development_Management_Policy.md",
  "Software Development Vulnerability Management Policy": "Software_Development_Vulnerability_Management_Policy.md",
  "Software Management Policy": "Software_Management_Policy.md",
  "System Protection Management Policy": "System_Protection_Management_Policy.md",
  "Technology Equipment Disposal Standard": "Technology_Equipment_Disposal_Standard.md",
  "Third Party Management Policy": "Third_Party_Management_Policy.md",
  "Vulnerability Management Policy": "Vulnerability_Management_Policy.md",
};


/**
 * Dynamically loads the content of a policy template based on its name.
 * This uses dynamic import() which tells webpack to code-split the templates,
 * loading them on-demand.
 * @param templateName The user-friendly name of the template.
 * @returns A promise that resolves to the string content of the markdown file.
 */
export async function loadTemplate(templateName: string): Promise<string> {
  const filename = FILENAME_MAP[templateName];
  if (!filename) {
    throw new Error(`Template not found: ${templateName}`);
  }

  // Webpack will see this and create a context for all .md files in ./Templates
  const module = await import(`./Templates/${filename}`);
  
  // The 'asset/source' loader in webpack makes the default export the raw content
  return module.default;
}