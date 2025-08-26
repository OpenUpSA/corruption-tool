import * as XLSX from "xlsx";
import { readFileSync, writeFileSync } from "fs";
import { exit } from "process";
import provinces from '../assets/search3.json' with { type: 'json' };

/** * Retrieves the province code based on the province name.
 * @param {string} provinceName - The name of the province.
 * @returns {string} The code of the province.
 * @throws {Error} If the province name is not found.
 */
function getProvinceCode(provinceName) {
    for (const province of provinces.provinces) {
        if (province.name.trim() === provinceName.trim()) {
            return province.code;
        }
    }
    throw new Error(`Province not found: ${provinceName}`);
}

/**
 * Maps municipality codes to their corresponding province codes.
 * @returns {Object} A mapping of municipality codes to province codes.
 */
function mapMuniCodeToProvinceCode() {
    let muniCodeToProvinceCode = {};
    for (const province of provinces.provinces) {
        for (const municipality of province.municipalities) {
            muniCodeToProvinceCode[municipality.parent] = province.code;
        }
    }
    return muniCodeToProvinceCode;
}

/** * Translates the header names from the Excel sheet to the desired JSON keys.
 * @param {string} header - The header name from the Excel sheet.
 * @returns {string} The translated header name.
 */
function translateTableHeader(header) {
    const translations = {
        "Local Municipality Name": "name",
        "Detail": "detail",
        "Link to Webpage": "link_to_webpage",
        "Image": "image",
        "Image Attribution/ reffrence": "image_alt",
    }
    return translations[header.trim()] || header.trim();
}

const muniCodeToProvinceCode = mapMuniCodeToProvinceCode();

/**
 * Converts an Excel file buffer to a JSON object, grouped by sheet name.
 * If a cell contains a hyperlink, its URL is retrieved instead of its text.
 * @param {Buffer} fileBuffer - The file buffer.
 * @returns {Object.<string, Array.<Object>>} An object where keys are sheet names.
 */
function excelFileToJSON(fileBuffer) {
    const workbook = XLSX.read(fileBuffer, {
        type: "buffer",
        cellFormula: false,
        cellHTML: false,
    });
    const result = {};

    workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
        });

        if (jsonData.length === 0) {
            result[sheetName] = [];
            return;
        }
        const headers = jsonData[0];
        const dataRows = jsonData.slice(1);

        const data = dataRows.map((row, rowIndex) => {
            const rowObject = {};
            headers.forEach((header, colIndex) => {
                const cellAddress = XLSX.utils.encode_cell({
                    r: rowIndex + 1,
                    c: colIndex,
                });
                const cell = worksheet[cellAddress];
                header = translateTableHeader(header);
                // Check if the cell exists and has a hyperlink
                if (cell && cell.l && cell.l.Target) {
                    rowObject[header] = cell.l.Target; // Use the link URL
                } else {
                    rowObject[header] = row[colIndex]; // Fallback to the cell value
                }
            });

            // Exclude all records where the name is empty
            if (!rowObject.name || rowObject.name.trim() === "") {
                return null;
            }
            return rowObject;
        });
        // Filter out any null values (rows that were skipped)
        result[sheetName] = data.filter(row => row !== null);
    });

    return result;
}

/**
 * Enriches a primary JSON object with new properties
 *
 * @param {object} primaryJson - The main JSON data to be updated.
 * @param {object} newProperties - The new properties to be added from the features file.
 * @returns {object} The updated JSON object.
 */
function enrichJsonWithFeatures(primaryJson, newProperties) {
    try {

        // Create a deep copy to avoid modifying the original object directly
        let updatedJson = JSON.parse(JSON.stringify(primaryJson));

        for (let i = 0; i < updatedJson.features.length; i++) {
            let newFeatureProps = newProperties[`${updatedJson.features[i].properties.Name.trim()}-${muniCodeToProvinceCode[updatedJson.features[i].properties.Parent_cod]}`];

            // if newFeatureProps is not found, skip to the next feature
            if (!newFeatureProps) {
                console.warn(`No new properties found for feature: ${updatedJson.features[i].properties.Name}-${muniCodeToProvinceCode[updatedJson.features[i].properties.Parent_cod]}`);
                continue;
            }

            updatedJson.features[i].properties["detail"] = newFeatureProps.detail || "";
            updatedJson.features[i].properties["link_to_webpage"] = newFeatureProps.link_to_webpage || "";
            updatedJson.features[i].properties["image"] = newFeatureProps.image || "";
            updatedJson.features[i].properties["image_alt"] = newFeatureProps.image_alt || "";
        }

        return updatedJson;

    } catch (error) {
        console.error(`❌ An error occurred during the JSON enrichment process:`, error);
        // Re-throw the error to be handled by the caller
        throw error;
    }
}

const filePath = "src/assets/LocalMuni_List.xlsx"
const outputPath = "src/assets/MuniDistricts.json"

try {
    console.log(`⏳ Processing file: ${filePath}`);

    const fileBuffer = readFileSync(filePath);
    const jsonData = excelFileToJSON(fileBuffer);
    console.log("✅ Successfully converted Excel to JSON.");


    // for key in jsonData, the key is the sheet name
    for (const sheetName in jsonData) {
        console.log(`Processing sheet: ${sheetName}`);

        const initialMuniJson = JSON.parse(readFileSync(outputPath, 'utf8'));
        const sheetData = jsonData[sheetName];

        const newProperties = {};

        sheetData.forEach((item) => {
            const key = `${item.name.trim()}-${getProvinceCode(sheetName)}`;
            newProperties[key] = item;
        });

        try {
            // Enrich the primary JSON with the new properties
            const updatedJson = enrichJsonWithFeatures(initialMuniJson, newProperties);
            // Write the updated JSON back to the file
            writeFileSync(outputPath, JSON.stringify(updatedJson, null, 2));
        } catch (error) {
            console.error(`❌ Error enriching JSON for sheet ${sheetName}:`, error);
        }
    }

} catch (error) {
    if (error.code === "ENOENT") {
        console.error(`❌ Error: File not found at path: ${filePath}`);
    } else {
        console.error("❌ An error occurred during file processing:", error);
    }
    exit(1);
}
