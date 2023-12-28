const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const pdfDirectory = 'cypress/pdfs';
const outputJsonPath = 'cypress/pdfs/json/output.json'; 
const pdfFiles = fs.readdirSync(pdfDirectory).filter(file => path.extname(file).toLowerCase() === '.pdf');
if (pdfFiles.length === 0) {
    console.error('No PDF files found in the specified directory:', pdfDirectory);
} else {
    
    const pdfPath = path.join(pdfDirectory, pdfFiles[0]);
    const pdfBuffer = fs.readFileSync(pdfPath);
 
    pdf(pdfBuffer).then((data) => {
        const paragraphs = data.text.split('\n').map(paragraph => paragraph.trim());
        const containsAmpCharacter = paragraphs.some(paragraph => paragraph.includes('&amp;'));

                    if (containsAmpCharacter) {
                        console.log('The PDF contains the character sequence "&amp;".');
                    } else {
                        console.log('The PDF does not contain the character sequence "&amp;".');
                    }
        const jsonData = {
            paragraphs: paragraphs,
        };
 
        const outputDir = path.dirname(outputJsonPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(outputJsonPath, JSON.stringify(jsonData, null, 2));
        console.log('PDF content has been saved to JSON:', outputJsonPath);
    }).catch((error) => {
        console.error('Error reading PDF:', error.message);
    });
}
