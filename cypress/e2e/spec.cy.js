
describe('PDF Test', () => {
    it('Find Duplicates', () => {
        const jsonFilePath = 'cypress/pdfs/json/output.json';

        
        cy.readFile(jsonFilePath).then((jsonData) => {
            const paragraphs = jsonData.paragraphs;
            const paragraphsByDoctor = splitParagraphsByDoctor(paragraphs);

            Object.entries(paragraphsByDoctor).forEach(([doctor, doctorParagraphs]) => {
                const duplicateTwitterLinks = findDuplicateLinks(doctorParagraphs, 'Twitter');
                const duplicateFacebookLinks = findDuplicateLinks(doctorParagraphs, 'Facebook');
                const duplicateInstagramLinks = findDuplicateLinks(doctorParagraphs, 'Instagram');

                if (duplicateTwitterLinks.length > 0 || duplicateFacebookLinks.length > 0) {
                    cy.log(`Duplicate Twitter links under ${doctor}:`);
                    cy.log(duplicateTwitterLinks);
                    cy.log(`Duplicate Facebook links under ${doctor}:`);
                    cy.log(duplicateFacebookLinks);
                    cy.log(`Duplicate Instagram links under ${doctor}:`);
                    cy.log(duplicateInstagramLinks);

                    const twitterOutputFilePath = `cypress/pdfs/text/${doctor}_twitter_output.pdf`;
                    const facebookOutputFilePath = `cypress/pdfs/text/${doctor}_facebook_output.txt`;
                    const instagramOutputFilePath = `cypress/pdfs/text/${doctor}_instagram_output.txt`;

                    cy.writeFile(twitterOutputFilePath, duplicateTwitterLinks.join('\n'));
                    cy.log(`Duplicated Twitter links saved to ${twitterOutputFilePath}`);
                    cy.writeFile(facebookOutputFilePath, duplicateFacebookLinks.join('\n'));
                    cy.log(`Duplicated Facebook links saved to ${facebookOutputFilePath}`);
                    cy.writeFile(instagramOutputFilePath, duplicateInstagramLinks.join('\n'));
                    cy.log(`Duplicated Instagram links saved to ${instagramOutputFilePath}`);


                    /* cy.readFile(twitterOutputFilePath).then((content) => {
                        cy.log(`Content of ${doctor}'s Twitter output file:`);
                        cy.log(content);
                    }); */
                }
            });
        });
    });
});


function findDuplicateLinks(paragraphs, linkType) {
    const linkRegex = new RegExp(`${linkType}: (.+?)$`, 'i');
    const links = paragraphs.map(paragraph => (paragraph.match(linkRegex) || [])[1]).filter(Boolean);
    const linkCounts = links.reduce((counts, link) => {
        counts[link] = (counts[link] || 0) + 1;
        return counts;
    }, {});
    const duplicateLinks = Object.keys(linkCounts).filter((link) => linkCounts[link] > 1);
    return duplicateLinks;
}




function splitParagraphsByDoctor(paragraphs) {
    const result = {};
    let currentDoctor = null;
    paragraphs.forEach((paragraph) => {
        const doctorMatch = paragraph.match(/^Dr\. (.+?) /);
        if (doctorMatch) {
            currentDoctor = doctorMatch[1];
            result[currentDoctor] = [];
        }
        if (currentDoctor) {
            result[currentDoctor].push(paragraph);
        }
    });

    return result;
}


