const fs = require('fs');
const path = require('path');

/**
 * Decodes MySQL hex BLOB strings (0x5b7b...) into JavaScript JSON objects
 */
function decodeHexProducts(hexStr) {
  if (!hexStr || !hexStr.startsWith('0x')) return [];
  try {
    const cleanHex = hexStr.slice(2); // Remove leading '0x'
    const jsonString = Buffer.from(cleanHex, 'hex').toString('utf-8');
    return JSON.parse(jsonString);
  } catch (err) {
    console.warn('Could not parse decoded hex BLOB:', err.message);
    return [];
  }
}

/**
 * Tokenizes SQL INSERT VALUES block into row arrays
 */
function parseSqlTuples(sqlText, tableName) {
  const regex = new RegExp(`INSERT INTO \`${tableName}\`[\\s\\S]*?VALUES\\s*([\\s\\S]*?);`, 'gi');
  let match;
  const rows = [];

  while ((match = regex.exec(sqlText)) !== null) {
    const valuesBlob = match[1];
    const rowRegex = /\(([\s\S]*?)\)(?:,\s*|\s*$)/g;
    let rowMatch;

    while ((rowMatch = rowRegex.exec(valuesBlob)) !== null) {
      const rowContent = rowMatch[1];
      // Regex to extract single tokens (quoted strings, hex numbers, floats, integers, or empty strings)
      const tokenRegex = /'(?:\\.|[^'\\])*'|0x[0-9a-fA-F]+|-?\d+(?:\.\d+)?|''/g;
      const tokens = [];
      let tokenMatch;

      while ((tokenMatch = tokenRegex.exec(rowContent)) !== null) {
        tokens.push(tokenMatch[0]);
      }

      rows.push(tokens);
    }
  }
  return rows;
}

function convertSqlToFirebaseJson(sqlFilePath, outputJsonPath) {
  const absolutePath = path.resolve(sqlFilePath);
  console.log(absolutePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`Error: File '${sqlFilePath}' not found.`);
    return;
  }

  const sqlText = fs.readFileSync(absolutePath, 'utf-8');

  const firebaseData = {
    clients: {},
    invoices: {}
  };

  const cleanString = (val) => val.replace(/^'|'$/g, '').replace(/\\r\\n/g, ' ').replace(/\\n/g, ' ').trim();

  // 1. Process 'clients' table
  const clientRows = parseSqlTuples(sqlText, 'clients');
  clientRows.forEach((tokens) => {
    if (tokens.length >= 6) {
      const clientId = tokens[0];
      firebaseData.clients[clientId] = {
        client_id: parseInt(clientId, 10),
        client_name: cleanString(tokens[1]),
        client_gst_no: cleanString(tokens[2]),
        client_address: cleanString(tokens[3]),
        client_email: cleanString(tokens[4]),
        client_phone: cleanString(tokens[5])
      };
    }
  });

  // 2. Process 'invoice' table
  const invoiceRows = parseSqlTuples(sqlText, 'invoice');
  invoiceRows.forEach((tokens) => {
    if (tokens.length >= 10) {
      const invoiceId = tokens[0];
      const products = decodeHexProducts(tokens[6]);

      firebaseData.invoices[invoiceId] = {
        invoice_id: parseInt(invoiceId, 10),
        client_id: parseInt(tokens[1], 10),
        invoice_date: cleanString(tokens[2]),
        invoice_number: parseInt(tokens[3], 10),
        invoice_vat: parseFloat(tokens[4]),
        invoice_discount: parseFloat(tokens[5]),
        products_object: products,
        invoice_total: parseFloat(tokens[7]),
        invoice_pdf_path: cleanString(tokens[8]),
        invoice_timestamp: cleanString(tokens[9])
      };
    }
  });

  fs.writeFileSync(outputJsonPath, JSON.stringify(firebaseData, null, 2), 'utf-8');
  console.log(`Conversion complete! Output saved to '${outputJsonPath}'.`);
  console.log(`Converted ${Object.keys(firebaseData.clients).length} clients and ${Object.keys(firebaseData.invoices).length} invoices.`);
}

// Execute conversion
convertSqlToFirebaseJson('./legacy-php-code/invoice_app.sql', 'data_scripts/firebase_import.json');