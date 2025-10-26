declare module '*.md' {
  const content: string;
  export default content;
}

// Type declarations for image imports
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';