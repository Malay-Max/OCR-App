const testMarkdown = `## William Shakespeare
- Hamlet (1603)
- Macbeth (1606)
- The Tempest (1611)

## Jane Austen
- Sense and Sensibility (1811)
- Pride and Prejudice (1813)
- Emma (1815)

## T.S. Eliot
- The Waste Land (1922)
- Murder in the Cathedral (1935)
`;

async function testParse() {
    try {
        console.log('Testing /api/parse...');
        const response = await fetch('http://localhost:3000/api/parse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ markdown: testMarkdown }),
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testParse();
