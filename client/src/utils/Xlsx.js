import * as XLSX from 'xlsx/xlsx.mjs';

class Xlsx {
    static getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    }
    static exportExcel = async (data, nameSheet,nameFile) => {
       return new Promise((resolve, reject) => {
            var ws = XLSX.utils.json_to_sheet(data);
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, nameSheet);
            XLSX.writeFile(wb, `${nameFile}.xlsx`);
            resolve(true)
        })
    }
}

export default Xlsx