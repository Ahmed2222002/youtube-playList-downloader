import { jsx as _jsx } from "react/jsx-runtime";
// ExportExcel.tsx
import React, { useCallback } from "react";
import ExcelJS from "exceljs";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
const ExportExcel = ({ transactions, people, fileName = "transactions.xlsx", title = "Transactions Report", sheetName = "Transactions", }) => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const generateExcel = useCallback(async () => {
        if (!transactions.length) {
            alert(isArabic ? "لا توجد بيانات للتصدير" : "No transactions to export!");
            return;
        }
        const labels = {
            date: isArabic ? "التاريخ" : "Date",
            description: isArabic ? "الوصف" : "Description",
            type: isArabic ? "النوع" : "Type",
            total: isArabic ? "الإجمالي" : "Total",
            income: isArabic ? "دخل" : "Income",
            expense: isArabic ? "مصروف" : "Expense",
            summary: isArabic ? "الإجمالي النهائي" : "Summary",
            generatedOn: isArabic ? "تم الإنشاء بتاريخ" : "Generated on",
        };
        const personTotals = people.map((_, index) => transactions.reduce((sum, t) => sum + (t.shares?.[index] ?? 0), 0));
        const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName);
        if (isArabic) {
            worksheet.properties = { ...worksheet.properties };
        }
        let rowIndex = 1;
        // Header
        const titleRow = worksheet.getRow(rowIndex++);
        titleRow.getCell(1).value = isArabic ? "تقرير المعاملات" : title;
        titleRow.font = { bold: true, size: 16 };
        titleRow.alignment = { horizontal: "center" };
        const generatedRow = worksheet.getRow(rowIndex++);
        generatedRow.getCell(1).value =
            `${labels.generatedOn}: ${new Date().toLocaleDateString()}`;
        rowIndex++;
        // Table Header
        const headerRow = worksheet.getRow(rowIndex++);
        const headers = [
            labels.date,
            labels.description,
            labels.type,
            labels.total,
            ...people,
        ];
        headers.forEach((header, i) => {
            const cell = headerRow.getCell(i + 1);
            cell.value = header;
            cell.font = { bold: true };
            cell.alignment = { horizontal: isArabic ? "right" : "left" };
        });
        // Data Rows
        transactions.forEach((t) => {
            const row = worksheet.getRow(rowIndex++);
            // Date
            row.getCell(1).value = t.date
                ? new Date(t.date)
                : isArabic
                    ? "غير معروف"
                    : "Unknown";
            // Description
            row.getCell(2).value = t.cause;
            // Type
            row.getCell(3).value =
                t.type === "income" ? labels.income : labels.expense;
            // Total Amount
            const totalCell = row.getCell(4);
            totalCell.value = t.amount;
            totalCell.numFmt = "#,##0.00;-#,##0.00"; // ← Fixed: shows minus sign
            // Shares
            people.forEach((_, index) => {
                const value = t.shares?.[index] ?? 0;
                const cell = row.getCell(5 + index);
                cell.value = value;
                cell.numFmt = "#,##0.00;-#,##0.00"; // ← Fixed here too
            });
        });
        // Summary Row
        const summaryRow = worksheet.getRow(rowIndex++);
        summaryRow.getCell(1).value = labels.summary;
        summaryRow.font = { bold: true };
        const totalSummaryCell = summaryRow.getCell(4);
        totalSummaryCell.value = totalAmount;
        totalSummaryCell.numFmt = "#,##0.00;-#,##0.00";
        totalSummaryCell.font = { bold: true };
        personTotals.forEach((total, index) => {
            const cell = summaryRow.getCell(5 + index);
            cell.value = total;
            cell.numFmt = "#,##0.00;-#,##0.00";
            cell.font = { bold: true };
        });
        // Column Widths
        worksheet.columns = [
            { width: 18 },
            { width: 40 },
            { width: 14 },
            { width: 18 },
            ...people.map(() => ({ width: 16 })),
        ];
        // Alignment
        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.alignment = {
                    horizontal: isArabic ? "right" : "left",
                    vertical: "middle",
                };
            });
        });
        // Export
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
    }, [transactions, people, fileName, title, sheetName, isArabic]);
    return (_jsx(Button, { onClick: generateExcel, disabled: !transactions.length, children: t("header.exportExcel") }));
};
export default ExportExcel;
