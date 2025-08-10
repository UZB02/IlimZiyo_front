// src/utils/formatToExcel.js
import * as XLSX from 'xlsx'

export function exportToExcel(data, fileName = 'export.xlsx') {
  if (!data || !data.length) {
    console.warn('Eksport qilinadigan maʼlumot yo‘q')
    return
  }

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Ma'lumotlar")
  XLSX.writeFile(workbook, fileName)
}
