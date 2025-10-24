import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import {
  COMPANY_SIZES,
  BUSINESS_TYPES,
  LOCATIONS,
  TECH_STACK_OPTIONS,
  SPECIFIC_RISK_OPTIONS,
  COMPLIANCE_STANDARDS,
  POLICY_TYPES,
  EMPLOYEE_ROLES,
  IMPLEMENTATION_TIMELINES,
} from '../constants';
import ChipInput from './ChipInput';
import PolicyLoadingView from './PolicyLoadingView';
import PolicyResultView from './PolicyResultView';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Helper to convert basic markdown to HTML for .doc export
const markdownToHtml = (markdown: string, policyType: string, companyName: string): string => {
    const blocks = markdown.replace(/\r\n/g, '\n').split('\n\n');

    const formatInline = (text: string) => text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');

    const processedBlocks = blocks.filter(b => b.trim()).map(block => {
        const lines = block.split('\n');

        // Heading logic
        if (block.startsWith('#### ')) {
            return `<h4>${formatInline(block.substring(5))}</h4>`;
        }
        if (block.startsWith('### ')) {
            return `<h3>${formatInline(block.substring(4))}</h3>`;
        }
        if (block.startsWith('## ')) {
            return `<h2>${formatInline(block.substring(3))}</h2>`;
        }
        if (block.startsWith('# ')) {
            // Main title is already added, so treat this as a secondary main header
            return `<h2>${formatInline(block.substring(2))}</h2>`;
        }
        
        // Table logic
        const trimmedLines = block.trim().split('\n');
        const isTable =
          trimmedLines.length >= 2 &&
          trimmedLines[0].includes('|') &&
          trimmedLines[1].includes('|') &&
          /^[|:-\s]+$/.test(trimmedLines[1]);

        if (isTable) {
            const headers = trimmedLines[0].replace(/^\||\|$/g, '').split('|').map(h => h.trim());
            const rows = trimmedLines.slice(2).map(line => line.replace(/^\||\|$/g, '').split('|').map(cell => cell.trim()));

            const headerHtml = `<tr>${headers.map(h => `<th style="border: 1px solid #BFBFBF; padding: 8px; text-align: left; background-color: #F2F2F2; font-weight: bold;">${formatInline(h)}</th>`).join('')}</tr>`;
            const bodyHtml = rows.map(row => `<tr>${row.map(cell => `<td style="border: 1px solid #BFBFBF; padding: 8px;">${formatInline(cell)}</td>`).join('')}</tr>`).join('');
            
            return `<table style="border-collapse: collapse; width: 100%; margin: 1.2em 0; font-size: 11pt;"><thead>${headerHtml}</thead><tbody>${bodyHtml}</tbody></table>`;
        }
        
        const isList = lines.every(line => line.trim().startsWith('- ') || line.trim().startsWith('* '));
        
        if (isList) {
            const listItems = lines.map(line => `<li>${formatInline(line.trim().substring(2))}</li>`).join('');
            return `<ul>${listItems}</ul>`;
        }
        return `<p>${formatInline(lines.join(' '))}</p>`;
    });
    
    const bodyContent = processedBlocks.join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <title>${policyType} for ${companyName}</title>
        <style>
            body { font-family: Calibri, sans-serif; line-height: 1.5; color: #333; max-width: 800px; margin: 40px auto; padding: 20px; }
            h1 { color: #2F5496; font-size: 24pt; }
            h2 { color: #2F5496; font-size: 18pt; margin-top: 1.5em; border-bottom: 1px solid #BFBFBF; padding-bottom: 0.25em;}
            h3 { color: #4472C4; font-size: 14pt; margin-top: 1.2em; }
            h4 { color: #4F81BD; font-size: 12pt; font-weight: bold; margin-top: 1em; }
            ul { padding-left: 40px; }
            li { margin-bottom: 0.5em; }
            p { margin-bottom: 1.2em; text-align: justify; }
            strong { font-weight: bold; }
            em { font-style: italic; }
            table { border-collapse: collapse; width: 100%; margin: 1.2em 0; font-size: 11pt; }
            th, td { border: 1px solid #BFBFBF; padding: 8px; text-align: left; }
            th { background-color: #F2F2F2; font-weight: bold; }
        </style>
        </head>
        <body>
            <h1>${policyType} for ${companyName}</h1>
            ${bodyContent}
        </body>
        </html>
    `;
};


const PolicyGenerator: React.FC = () => {
    // View State
    const [view, setView] = useState<'form' | 'loading' | 'result'>('form');

    // Company Info State
    const [companyName, setCompanyName] = useState('');
    const [companySize, setCompanySize] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [otherBusinessType, setOtherBusinessType] = useState('');
    const [location, setLocation] = useState('');

    // Policy Details State
    const [policyType, setPolicyType] = useState('');
    const [standards, setStandards] = useState<string[]>([]);
    const [audience, setAudience] = useState<string[]>([]);
    const [techStack, setTechStack] = useState<string[]>([]);
    const [risks, setRisks] = useState<string[]>([]);
    const [timeline, setTimeline] = useState('');
    const [additionalContext, setAdditionalContext] = useState('');
    
    // UI State
    const [generatedPolicy, setGeneratedPolicy] = useState('');
    const [error, setError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const validateForm = () => {
            const isBusinessValid = businessType !== 'Other' || (businessType === 'Other' && otherBusinessType.trim() !== '');
            const isValid =
                companyName.trim() !== '' &&
                companySize !== '' &&
                businessType !== '' &&
                isBusinessValid &&
                location !== '' &&
                policyType !== '' &&
                standards.length > 0 &&
                audience.length > 0 &&
                techStack.length > 0 &&
                risks.length > 0 &&
                timeline !== '';
            setIsFormValid(isValid);
        };
        validateForm();
    }, [companyName, companySize, businessType, otherBusinessType, location, policyType, standards, audience, techStack, risks, timeline]);

    const handleStandardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setStandards(prev => [...prev, value]);
        } else {
            setStandards(prev => prev.filter(standard => standard !== value));
        }
    };

    const handleGeneratePolicy = async () => {
        if (!isFormValid) return;

        setView('loading');
        setGeneratedPolicy('');
        setError('');

        const prompt = `
            Act as a senior cybersecurity policy expert. Generate a comprehensive and professional ${policyType} for ${companyName}, a ${companySize} ${businessType === 'Other' ? otherBusinessType : businessType} company located in ${location}.
            
            The company's technology stack includes: ${techStack.join(', ')}.
            Key risks to address are: ${risks.join(', ')}.
            The policy must align with the following compliance standards: ${standards.join(', ')}.
            This policy is intended for the following target audience: ${audience.join(', ')}.
            The implementation timeline is ${timeline}.
            ${additionalContext ? `Additional context to consider: ${additionalContext}` : ''}

            Please provide a well-structured policy document that includes:
            1.  Policy Statement: A clear declaration of the policy's purpose.
            2.  Scope: Who and what this policy applies to.
            3.  Key Policy Principles: The core rules and guidelines.
            4.  Roles and Responsibilities: Specific duties for different roles.
            5.  Enforcement and Compliance: Consequences of non-compliance.
            6.  Related Standards and Procedures: Links to other relevant documents.
            7.  If applicable, include data tables to present information clearly.

            Format the output using Markdown for clear readability, including headings (using ## for main sections and ### for subsections), bullet points, bold text for emphasis, and tables.

            IMPORTANT: Your response should contain ONLY the Markdown for the policy itself. Do not include any introductory phrases like "Here is the policy..." or any concluding remarks or signatures like "End of Policy". The output must start directly with the policy's first heading.
        `;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
            });

            const today = new Date();
            const nextYear = new Date();
            nextYear.setFullYear(today.getFullYear() + 1);
            
            // Format dates as YYYY-MM-DD for consistency
            const approvalDate = today.toLocaleDateString('en-CA');
            const reviewDate = nextYear.toLocaleDateString('en-CA');

            const documentControlTable = `| Document Control      |                                                      |
| :-------------------- | :--------------------------------------------------- |
| **Document Version**  | 1.0                                                  |
| **Approval Date**     | ${approvalDate}                                      |
| **Next Review Date**  | ${reviewDate}                                        |
| **Policy Owner**      | Head of Technology / Designated Security Officer     |

`;
            
            const finalPolicy = documentControlTable + '\n' + response.text;
            
            setGeneratedPolicy(finalPolicy);
            setView('result');
        } catch (err) {
            console.error("Error generating policy:", err);
            setError("Failed to generate policy. The model may be overloaded or your API key might be invalid. Please try again later.");
            setView('form');
        }
    };

    const handleDownload = () => {
        const htmlContent = markdownToHtml(generatedPolicy, policyType, companyName);
        const blob = new Blob([htmlContent], { type: 'application/msword' });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const policyFileName = policyType.replace(/\s+/g, '_');
        a.download = `${companyName.replace(/\s+/g, '_')}_${policyFileName}.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleGenerateNew = () => {
        // Optionally reset form state here if desired
        // setCompanyName(''); ... etc.
        setGeneratedPolicy('');
        setError('');
        setView('form');
    }
    
    const RequiredLabel: React.FC<{ htmlFor: string, children: React.ReactNode }> = ({ htmlFor, children }) => (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
            {children} <span className="text-red-500">*</span>
        </label>
    );

    if (view === 'loading') {
        return <PolicyLoadingView />;
    }

    if (view === 'result') {
        return <PolicyResultView 
            policyText={generatedPolicy}
            onBack={handleGenerateNew}
            onDownload={handleDownload}
        />;
    }

    return (
        <div className="space-y-8">
            <div className="p-6 bg-light-accent/50 dark:bg-dark-accent/50 border border-light-border dark:border-dark-border rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-light-text dark:text-dark-text">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <RequiredLabel htmlFor="companyName">Company Name</RequiredLabel>
                        <input id="companyName" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full p-2 border border-light-border dark:border-dark-border bg-light-accent dark:bg-dark-accent rounded-lg focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <RequiredLabel htmlFor="companySize">Company Size</RequiredLabel>
                        <select id="companySize" value={companySize} onChange={(e) => setCompanySize(e.target.value)} className="w-full p-2 border border-light-border dark:border-dark-border bg-light-accent dark:bg-dark-accent rounded-lg focus:ring-primary focus:border-primary">
                            <option value="" disabled>Select a size</option>
                            {COMPANY_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
                        </select>
                    </div>
                    <div>
                        <RequiredLabel htmlFor="businessType">Business Type/Industry</RequiredLabel>
                        <select id="businessType" value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="w-full p-2 border border-light-border dark:border-dark-border bg-light-accent dark:bg-dark-accent rounded-lg focus:ring-primary focus:border-primary">
                            <option value="" disabled>Select a type</option>
                            {BUSINESS_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    {businessType === 'Other' && (
                        <div>
                            <RequiredLabel htmlFor="otherBusinessType">Please Specify Industry</RequiredLabel>
                            <input id="otherBusinessType" type="text" value={otherBusinessType} onChange={(e) => setOtherBusinessType(e.target.value)} className="w-full p-2 border border-light-border dark:border-dark-border bg-light-accent dark:bg-dark-accent rounded-lg focus:ring-primary focus:border-primary" />
                        </div>
                    )}
                     <div>
                        <RequiredLabel htmlFor="location">Primary Location</RequiredLabel>
                        <select id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2 border border-light-border dark:border-dark-border bg-light-accent dark:bg-dark-accent rounded-lg focus:ring-primary focus:border-primary">
                            <option value="" disabled>Select a location</option>
                            {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-light-accent/50 dark:bg-dark-accent/50 border border-light-border dark:border-dark-border rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-light-text dark:text-dark-text">Policy Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <RequiredLabel htmlFor="policyType">Policy Type</RequiredLabel>
                        <select id="policyType" value={policyType} onChange={(e) => setPolicyType(e.target.value)} className="w-full p-2 border border-light-border dark:border-dark-border bg-light-accent dark:bg-dark-accent rounded-lg focus:ring-primary focus:border-primary">
                            <option value="" disabled>Select a policy type</option>
                            {POLICY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                     <div>
                        <RequiredLabel htmlFor="timeline">Implementation Timeline</RequiredLabel>
                        <select id="timeline" value={timeline} onChange={(e) => setTimeline(e.target.value)} className="w-full p-2 border border-light-border dark:border-dark-border bg-light-accent dark:bg-dark-accent rounded-lg focus:ring-primary focus:border-primary">
                            <option value="" disabled>Select a timeline</option>
                            {IMPLEMENTATION_TIMELINES.map(time => <option key={time} value={time}>{time}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <RequiredLabel htmlFor="standards">Compliance Standard(s)</RequiredLabel>
                        <div id="standards" className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 mt-2 p-3 border border-light-border dark:border-dark-border rounded-lg bg-light-accent/50 dark:bg-dark-accent/50">
                            {COMPLIANCE_STANDARDS.map(standard => (
                                <div key={standard} className="flex items-center">
                                    <input id={`standard-${standard}`} type="checkbox" value={standard} checked={standards.includes(standard)} onChange={handleStandardChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                    <label htmlFor={`standard-${standard}`} className="ml-2 block text-sm text-light-text dark:text-dark-text">{standard}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-2">
                         <ChipInput id="audience" label={<>Target Audience <span className="text-red-500">*</span></>} chips={audience} setChips={setAudience} suggestions={EMPLOYEE_ROLES} placeholder="e.g., All Employees" />
                    </div>
                    <div className="md:col-span-2">
                         <ChipInput id="techStack" label={<>Technology Stack <span className="text-red-500">*</span></>} chips={techStack} setChips={setTechStack} suggestions={TECH_STACK_OPTIONS} placeholder="e.g., AWS, React" />
                    </div>
                    <div className="md:col-span-2">
                        <ChipInput id="risks" label={<>Specific Risks to Address <span className="text-red-500">*</span></>} chips={risks} setChips={setRisks} suggestions={SPECIFIC_RISK_OPTIONS} placeholder="e.g., Phishing" />
                    </div>
                     <div className="md:col-span-2">
                        <label htmlFor="additionalContext" className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">Additional Comments and Context (Optional)</label>
                        <textarea id="additionalContext" value={additionalContext} onChange={(e) => setAdditionalContext(e.target.value)} rows={3} className="w-full p-2 border border-light-border dark:border-dark-border bg-light-accent dark:bg-dark-accent rounded-lg focus:ring-primary focus:border-primary" placeholder="Add any other relevant details..."></textarea>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <button 
                    onClick={handleGeneratePolicy} 
                    disabled={!isFormValid || view === 'loading'}
                    className="flex items-center justify-center gap-2 w-full max-w-xs px-6 py-3 font-semibold text-white bg-primary rounded-lg shadow-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {view === 'loading' ? (<><span>Generating...</span></>) : ('Generate Secure Policy')}
                </button>
            </div>

            {error && <div className="text-center text-red-500 bg-red-500/10 p-3 rounded-lg">{error}</div>}

        </div>
    );
};

export default PolicyGenerator;