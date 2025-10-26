import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import {
  COMPLIANCE_STANDARDS,
  COMPANY_SIZES,
  BUSINESS_TYPES,
  LOCATIONS,
  EMPLOYEE_ROLES,
  IMPLEMENTATION_TIMELINES,
  TECH_STACK_OPTIONS,
  SPECIFIC_RISK_OPTIONS,
} from '../constants';
import { loadTemplate, POLICY_NAMES } from '../templates';
import SearchableSelect from './SearchableSelect';
import ChipInput from './ChipInput';
import PolicyLoadingView from './PolicyLoadingView';
import PolicyResultView from './PolicyResultView';
import { ShieldIcon } from './icons/ShieldIcon';

const API_KEY = process.env.API_KEY;
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

type View = 'form' | 'loading' | 'result';

// Helper to convert markdown to a Word-compatible HTML format
const markdownToHtml = (markdown: string, policyType: string, companyName: string): string => {
    const blocks = markdown.replace(/\r\n/g, '\n').split('\n\n');

    const formatInline = (text: string) => text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');

    const processedBlocks = blocks.filter(b => b.trim()).map(block => {
        const lines = block.split('\n');

        if (block.startsWith('#### ')) return `<h4>${formatInline(block.substring(5))}</h4>`;
        if (block.startsWith('### ')) return `<h3>${formatInline(block.substring(4))}</h3>`;
        if (block.startsWith('## ')) return `<h2>${formatInline(block.substring(3))}</h2>`;
        if (block.startsWith('# ')) return `<h1>${formatInline(block.substring(2))}</h1>`;
        
        const trimmedLines = block.trim().split('\n');
        const isTable = trimmedLines.length >= 2 && trimmedLines[0].includes('|') && trimmedLines[1].includes('|') && /^[|:-\s]+$/.test(trimmedLines[1]);

        if (isTable) {
            const headers = trimmedLines[0].replace(/^\||\|$/g, '').split('|').map(h => h.trim());
            const rows = trimmedLines.slice(2).map(line => line.replace(/^\||\|$/g, '').split('|').map(cell => cell.trim()));
            const headerHtml = `<tr>${headers.map(h => `<th style="border: 1px solid #BFBFBF; padding: 8px; text-align: left; background-color: #F2F2F2; font-weight: bold;">${formatInline(h)}</th>`).join('')}</tr>`;
            const bodyHtml = rows.map(row => `<tr>${row.map(cell => `<td style="border: 1px solid #BFBFBF; padding: 8px;">${formatInline(cell)}</td>`).join('')}</tr>`).join('');
            return `<table style="border-collapse: collapse; width: 100%; margin: 1.2em 0; font-size: 11pt;"><thead>${headerHtml}</thead><tbody>${bodyHtml}</tbody></table>`;
        }
        
        const isList = lines.every(line => line.trim().startsWith('- ') || line.trim().startsWith('* '));
        if (isList) {
            return `<ul>${lines.map(line => `<li>${formatInline(line.trim().substring(2))}</li>`).join('')}</ul>`;
        }
        return `<p>${formatInline(lines.join(' '))}</p>`;
    });
    
    const bodyContent = processedBlocks.join('');

    return `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${policyType} for ${companyName}</title>
        <style>
            @page WordSection1 {
                size: 8.5in 11.0in;
                margin: 1.0in 1.0in 1.0in 1.0in;
            }
            div.WordSection1 {
                page: WordSection1;
            }
            body { font-family: Calibri, sans-serif; line-height: 1.5; color: #333; }
            h1 { color: #2F5496; font-size: 20pt; }
            h2 { color: #2F5496; font-size: 16pt; margin-top: 1.5em; border-bottom: 1px solid #BFBFBF; padding-bottom: 0.25em;}
            h3 { color: #4472C4; font-size: 13pt; margin-top: 1.2em; }
            h4 { color: #4F81BD; font-size: 11pt; font-weight: bold; margin-top: 1em; }
            ul { padding-left: 40px; }
            li { margin-bottom: 0.5em; }
            p { margin-bottom: 1.2em; text-align: justify; }
            table { border-collapse: collapse; width: 100%; margin: 1.2em 0; font-size: 11pt; }
            th, td { border: 1px solid #BFBFBF; padding: 8px; text-align: left; }
            th { background-color: #F2F2F2; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="WordSection1">
            <h1>${policyType} for ${companyName}</h1>
            ${bodyContent}
        </div>
      </body>
      </html>
    `;
};

const PolicyGenerator: React.FC = () => {
    // View State
    const [view, setView] = useState<View>('form');
    // FIX: Add a dedicated loading state to prevent race conditions and fix static analysis errors.
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [generatedPolicy, setGeneratedPolicy] = useState('');
    
    // Form State
    const [companyName, setCompanyName] = useState('');
    const [companySize, setCompanySize] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [otherBusinessType, setOtherBusinessType] = useState('');
    const [location, setLocation] = useState('');
    const [policyType, setPolicyType] = useState('');
    const [standards, setStandards] = useState<string[]>([]);
    const [audience, setAudience] = useState<string[]>([]);
    const [techStack, setTechStack] = useState<string[]>([]);
    const [risks, setRisks] = useState<string[]>([]);
    const [timeline, setTimeline] = useState('');
    const [additionalContext, setAdditionalContext] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const validateForm = () => {
            const isBusinessValid = businessType !== 'Other' || (businessType === 'Other' && otherBusinessType.trim() !== '');
            setIsFormValid(
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
                timeline !== ''
            );
        };
        validateForm();
    }, [companyName, companySize, businessType, otherBusinessType, location, policyType, standards, audience, techStack, risks, timeline]);

    const handleStandardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setStandards(prev => (checked ? [...prev, value] : prev.filter(s => s !== value)));
    };

    const handleGeneratePolicy = async () => {
        if (isLoading) return;
        // FIX: isFormValid is a boolean state variable, not a function.
        if (!isFormValid) {
            setError("Please fill in all required fields.");
            return;
        }
        if (!ai) {
            setError("AI service is not configured. Please check your API key.");
            return;
        }
        setError('');
        setIsLoading(true);
        setView('loading');

        try {
            let templateContent = await loadTemplate(policyType);
            templateContent = templateContent.replace(/\r\n/g, '\n');

            const lines = templateContent.split('\n');
            const sections: { heading: string; template_context: string }[] = [];
            let preamble = '';
            let currentSection: { heading: string; template_context: string } | null = null;

            for (const line of lines) {
                if (/^#+ .*/.test(line)) { // Found a heading
                    if (currentSection) {
                        sections.push(currentSection);
                    }
                    currentSection = { heading: line, template_context: '' };
                } else {
                    if (currentSection) {
                        currentSection.template_context += line + '\n';
                    } else {
                        preamble += line + '\n';
                    }
                }
            }
            if (currentSection) {
                sections.push(currentSection);
            }
            
            // Trim context for each section
            sections.forEach(s => s.template_context = s.template_context.trim());
            preamble = preamble.trim();

            const globalContext = `
                - Company Name: ${companyName}
                - Company Size: ${companySize}
                - Business Type/Industry: ${businessType === 'Other' ? otherBusinessType : businessType}
                - Primary Location: ${location}
                - Compliance Standards to align with: ${standards.join(', ')}
                - Target Audience for this policy: ${audience.join(', ')}
                - Technology Stack: ${techStack.join(', ')}
                - Specific Risks to Address: ${risks.join(', ')}
                - Implementation Timeline: ${timeline}
                - Additional Context: ${additionalContext || 'None'}
            `.trim().replace(/^ +/gm, '');

            const prompt = `
                You are an expert cybersecurity policy writer. You will be given a 'global_context' (providing overall company details) and a 'sections_to_generate' JSON array. Each section in the array has a 'heading' and a 'template_context'.

                Your task is to:
                1. Use the "global_context" to tailor all your responses with the specific company details provided.
                2. Iterate through every object in the "sections_to_generate" array.
                3. For each section, write a formal, professional cybersecurity policy paragraph that is appropriate for the given "heading". Ensure the "generated_policy" content is well-formatted markdown, including lists or tables where appropriate.
                4. If the "template_context" contains instructions or existing text, use it as a guide for the tone and content, but rewrite and expand upon it to be specific to the company profile in the global context. If it's empty, generate standard, high-quality content for that heading.
                5. You must return a JSON array of the exact same length as the input array. Each object in your response array must contain two keys: "heading" (copied verbatim from the input) and "generated_policy" (the new policy text you wrote). Do not leave any "generated_policy" fields empty.`;
            
            const requestPayload = {
                global_context: globalContext,
                sections_to_generate: sections.filter(s => !s.heading.toLowerCase().includes('revision history'))
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: [JSON.stringify(requestPayload)],
                config: {
                    systemInstruction: prompt,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                heading: { type: Type.STRING },
                                generated_policy: { type: Type.STRING }
                            },
                            required: ["heading", "generated_policy"]
                        }
                    }
                }
            });

            let jsonString = response.text?.trim();
            if (!jsonString) {
                throw new Error("Received an empty response from the AI model.");
            }

            // Clean up potential markdown wrappers
            if (jsonString.startsWith("```json")) {
                jsonString = jsonString.substring(7, jsonString.length - 3).trim();
            }

            const generatedSections: { heading: string; generated_policy: string }[] = JSON.parse(jsonString);

            if (!Array.isArray(generatedSections) || generatedSections.length !== requestPayload.sections_to_generate.length) {
                throw new Error("AI response did not match the expected structure.");
            }

            let finalPolicy = preamble;
            const generatedMap = new Map(generatedSections.map(item => [item.heading, item.generated_policy]));
            
            sections.forEach(section => {
                finalPolicy += `\n\n${section.heading}\n\n`;
                if (generatedMap.has(section.heading)) {
                    finalPolicy += generatedMap.get(section.heading);
                } else {
                    finalPolicy += section.template_context; // Fallback to original content
                }
            });
            
            setGeneratedPolicy(finalPolicy.trim());
            setView('result');

        } catch (err) {
            console.error("Error generating policy:", err);
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(`Failed to generate policy. ${errorMessage}. Please check the console for more details.`);
            setView('form');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        const htmlContent = markdownToHtml(generatedPolicy, policyType, companyName);
        const blob = new Blob(['\uFEFF', htmlContent], { type: 'application/vnd.ms-word' });

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
        setGeneratedPolicy('');
        setError('');
        setView('form');
    }

    const RequiredLabel: React.FC<{ htmlFor: string, children: React.ReactNode }> = ({ htmlFor, children }) => (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
            {children} <span className="text-red-500">*</span>
        </label>
    );

    if (view === 'loading') return <PolicyLoadingView />;
    if (view === 'result') return <PolicyResultView policyText={generatedPolicy} onBack={handleGenerateNew} onDownload={handleDownload} />;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="p-6 bg-light-accent/50 dark:bg-dark-accent/50 border border-light-border dark:border-dark-border rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-light-text dark:text-dark-text">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <RequiredLabel htmlFor="companyName">Company Name</RequiredLabel>
                        <input id="companyName" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full p-2 border border-light-border dark:border-dark-border bg-light-accent dark:bg-dark-accent rounded-lg focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <RequiredLabel htmlFor="companySize">Company Size</RequiredLabel>
                        <SearchableSelect id="companySize" options={COMPANY_SIZES} value={companySize} onChange={setCompanySize} placeholder="Select a size" />
                    </div>
                    <div>
                        <RequiredLabel htmlFor="businessType">Business Type/Industry</RequiredLabel>
                        <SearchableSelect id="businessType" options={BUSINESS_TYPES} value={businessType} onChange={setBusinessType} placeholder="Select a type" />
                    </div>
                    {businessType === 'Other' && (
                        <div>
                            <RequiredLabel htmlFor="otherBusinessType">Please Specify Industry</RequiredLabel>
                            <input id="otherBusinessType" type="text" value={otherBusinessType} onChange={(e) => setOtherBusinessType(e.target.value)} className="w-full p-2 border border-light-border dark:border-dark-border bg-light-accent dark:bg-dark-accent rounded-lg focus:ring-primary focus:border-primary" />
                        </div>
                    )}
                     <div>
                        <RequiredLabel htmlFor="location">Primary Location</RequiredLabel>
                        <SearchableSelect id="location" options={LOCATIONS} value={location} onChange={setLocation} placeholder="Select a location" />
                    </div>
                </div>
            </div>

            <div className="p-6 bg-light-accent/50 dark:bg-dark-accent/50 border border-light-border dark:border-dark-border rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-light-text dark:text-dark-text">Policy Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <RequiredLabel htmlFor="policyType">Policy Type</RequiredLabel>
                        <SearchableSelect id="policyType" options={POLICY_NAMES} value={policyType} onChange={setPolicyType} placeholder="Search and select a policy type" />
                    </div>
                     <div>
                        <RequiredLabel htmlFor="timeline">Implementation Timeline</RequiredLabel>
                        <SearchableSelect id="timeline" options={IMPLEMENTATION_TIMELINES} value={timeline} onChange={setTimeline} placeholder="Select a timeline" />
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
                    // FIX: Use the `isLoading` state to disable the button during generation. This resolves the static analysis error and prevents race conditions.
                    disabled={!isFormValid || isLoading}
                    className="flex items-center justify-center gap-2 w-full max-w-xs px-6 py-3 font-semibold text-white bg-primary rounded-lg shadow-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ShieldIcon className="w-5 h-5" />
                    {'Generate Secure Policy'}
                </button>
            </div>

            {error && <div className="text-center text-red-500 bg-red-500/10 p-3 rounded-lg">{error}</div>}
        </div>
    );
};

export default PolicyGenerator;
