import { createWriteStream, readFileSync } from 'fs';
import { jsPDF } from "jspdf";
import './Rubik-Regular-normal';



export function createPdfDocument() {


    const doc = new jsPDF();
    doc.setFont("Rubik-Regular");

    doc.text("שלום לכם! 1234", 100, 10,{
    //    isInputVisual: true,
    //    isSymmetricSwapping: true,
        isInputRtl: false,
        isOutputRtl: true,
        align:'right'
    });
    doc.save("c:/temp/output.pdf");


}



const data = {
    "id": 3014874415,
    "name": "משה אופניק",
    "hospitalName": null,
    "city": "תל אביב",
    "street": "ככה וככה 13",
    "notes": "נא לתאם עם בני לפני שמגיעים - הציוד נמצא במחסן. קומה 2 יש מעלית",
    "contact": "בני",
    "contactPhone": "0507330590",
    "driverName": "נועם",
    "driverSign": null,
    "contactSign": null,
    "items": [
        {
            "id": "3014874467",
            "name": "מחשב נייח",
            "quantity": "2",
            "notes": null,
            "actualQuantity": "2"
        },
        {
            "id": "3014874518",
            "name": "מסך",
            "quantity": "3",
            "notes": null,
            "actualQuantity": "3"
        },
        {
            "id": "3014874616",
            "name": "מחשב נייד",
            "quantity": "0",
            "notes": null,
            "actualQuantity": "0"
        },
        {
            "id": "3014874697",
            "name": "מדפסת/סורק",
            "quantity": "0",
            "notes": null,
            "actualQuantity": "0"
        },
        {
            "id": "3014874810",
            "name": "מקלדת/עכבר",
            "quantity": "0",
            "notes": null,
            "actualQuantity": "0"
        },
        {
            "id": "3014874948",
            "name": "שרת",
            "quantity": "0",
            "notes": null,
            "actualQuantity": "0"
        },
        {
            "id": "3014875242",
            "name": "קורא בר קוד",
            "quantity": "0",
            "notes": null,
            "actualQuantity": "0"
        }
    ],
    "signatureCounter": 0,
    "tempSmsResult": ""
}