const fs = require('fs');
const path = require('path');

const replaceInFile = (filePath, replacements) => {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [search, replace] of replacements) {
    content = content.replace(search, replace);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
};

// --- Home.jsx ---
replaceInFile(path.join(__dirname, 'pages', 'Home.jsx'), [
  [/from-blue-600 via-blue-700 to-blue-800/g, 'from-[#3BAFBF] to-[#2B97A4]'],
  [/text-blue-200/g, 'text-cyan-100'],
  [/text-blue-100/g, 'text-cyan-50'],
  [/text-blue-600/g, 'text-[#3BAFBF]'],
  [/hover:bg-blue-50/g, 'hover:bg-cyan-50'],
  [/bg-blue-500\/20/g, 'bg-[#3BAFBF]/20'],
  [/hover:bg-blue-500\/30/g, 'hover:bg-[#3BAFBF]/30'],
  [/bg-blue-100/g, 'bg-cyan-100'],
  [/bg-green-100 text-green-600/g, 'bg-cyan-100 text-[#3BAFBF]'],
  [/bg-purple-100 text-purple-600/g, 'bg-cyan-100 text-[#3BAFBF]'],
  [/bg-orange-100 text-orange-600/g, 'bg-cyan-100 text-[#3BAFBF]'],
  [/from-blue-600 to-blue-700/g, 'from-[#3BAFBF] to-[#2B97A4]']
]);

// --- Login.jsx ---
replaceInFile(path.join(__dirname, 'pages', 'Login.jsx'), [
  [/from-blue-600 via-blue-700 to-blue-800/g, 'from-[#3BAFBF] to-[#2B97A4]'],
  [/text-blue-200/g, 'text-cyan-100'],
  [/text-blue-100/g, 'text-cyan-50'],
  [/text-blue-600/g, 'text-[#3BAFBF]'],
  [/focus:ring-blue-500/g, 'focus:ring-[#3BAFBF]'],
  [/hover:text-blue-700/g, 'hover:text-[#2B97A4]'],
  [/bg-blue-600/g, 'bg-[#3BAFBF]'],
  [/hover:bg-blue-700/g, 'hover:bg-[#2B97A4]'],
  [/bg-blue-50/g, 'bg-cyan-50'],
  [/border-blue-100/g, 'border-cyan-100']
]);

// --- Register.jsx ---
replaceInFile(path.join(__dirname, 'pages', 'Register.jsx'), [
  [/from-blue-600 via-blue-700 to-blue-800/g, 'from-[#3BAFBF] to-[#2B97A4]'],
  [/text-blue-200/g, 'text-cyan-100'],
  [/text-blue-100/g, 'text-cyan-50'],
  [/text-blue-600/g, 'text-[#3BAFBF]'],
  [/focus:ring-blue-500/g, 'focus:ring-[#3BAFBF]'],
  [/hover:text-blue-700/g, 'hover:text-[#2B97A4]'],
  [/bg-blue-600/g, 'bg-[#3BAFBF]'],
  [/hover:bg-blue-700/g, 'hover:bg-[#2B97A4]']
]);
