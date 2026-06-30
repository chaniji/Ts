import { useRef } from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";
import * as XLSX from "xlsx";

registerAllModules();

const colHeaders = [
  "S.NO",
  "Material Name",
  "Vendor",
  "Lot No",
  "Received Date",
  "QC Date",
  "Qty Ordered",
  "Qty Received",
  "Qty Inspected",
  "Qty Accepted",
  "Qty Rejected",
  "Reason for Rejection",
  "Store In-charge Signature",
  "Remarks",
];

const initialData = [
  [1, "MAX232CSE SOIC", "ROBU", "INV2627/83586-1", "08.06.2026", "10.06.2026", 12, 12, 5, 5, "", "", "", ""],
  [2, "SN72HC1G04DBVR SOT-23-5", "ROBU", "INV2627/83586-2", "08.06.2026", "10.06.2026", 10, 10, 5, 5, "", "", "", ""],
];

export default function StockGrid() {
  const hotRef = useRef<any>(null);

  function getData() {
    return hotRef.current?.hotInstance.getData() as (string | number)[][];
  }

  function handleComplete() {
    const data = getData();
    console.log("Saved (local):", data);
    // TODO: send `data` to backend API here later
    alert("Saved " + data.length + " rows (local only for now).");
  }

  function handleExport() {
    const data = getData();

    const aoa = [
      ["DOC ID: EML_TPL_NC_007_V1", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["DOC TITLE: QC INSPECTION CARD FOR NON-CRITICAL COMPONENTS", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["CREATED ON:", "", "RELEASED ON:", "", "", "", "", "", "", "", "", "", "", ""],
      ["PRODUCT NAME:", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["PREPARED BY:", "MONESH", "", "POLYDIAL", "", "", "", "", "", "", "", "", "", ""],
      ["DESIGNATION:", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["REC ID:", "POLYDIAL-NC-2026-033", "", "", "", "", "", "", "", "", "", "", "", ""],
      [],
      ["S.NO", "MATERIAL NAME", "VENDOR", "LOT NO", "RECEIVED DATE", "QC DATE",
        "VISUAL INSPECTION", "", "", "", "", "INTERN", "STORE IN-CHARGE SIGNATURE", "REMARKS"],
      ["", "", "", "", "", "",
        "QTY ORDERED", "QTY RECEIVED", "QTY INSPECTED", "QTY ACCEPTED", "QTY REJECTED", "REASON FOR REJECTION", "", ""],
      ...data,
    ];

    const ws = XLSX.utils.aoa_to_sheet(aoa);

    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 13 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 13 } },
      { s: { r: 8, c: 6 }, e: { r: 8, c: 11 } }, // VISUAL INSPECTION group
      { s: { r: 8, c: 0 }, e: { r: 9, c: 0 } }, // S.NO
      { s: { r: 8, c: 1 }, e: { r: 9, c: 1 } },
      { s: { r: 8, c: 2 }, e: { r: 9, c: 2 } },
      { s: { r: 8, c: 3 }, e: { r: 9, c: 3 } },
      { s: { r: 8, c: 4 }, e: { r: 9, c: 4 } },
      { s: { r: 8, c: 5 }, e: { r: 9, c: 5 } },
      { s: { r: 8, c: 12 }, e: { r: 9, c: 12 } },
      { s: { r: 8, c: 13 }, e: { r: 9, c: 13 } },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "QC Inspection");
    XLSX.writeFile(wb, "qc_inspection_export.xlsx");
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "16px", fontSize: "14px", lineHeight: "1.8" }}>
        <div><b>Doc ID:</b> EML_TPL_NC_007_V1</div>
        <div><b>Doc Title:</b> QC Inspection Card for Non-Critical Components</div>
        <div><b>Product Name:</b> POLYDIAL</div>
        <div><b>Product Version:</b> </div>
        <div><b>Prepared By:</b> MONESH</div>
        <div><b>Designation:</b> </div>
        <div><b>Rec ID:</b> POLYDIAL-NC-2026-033</div>
      </div>
      <h2>QC Inspection Card</h2>
      <HotTable
        ref={hotRef}
        data={initialData}
        colHeaders={colHeaders}
        rowHeaders={true}
        contextMenu={true}
        minSpareRows={1}
        width="100%"
        height="auto"
        licenseKey="non-commercial-and-evaluation"
      />
      <div style={{ marginTop: "12px" }}>
        <button onClick={handleComplete}>Complete</button>
        <button onClick={handleExport} style={{ marginLeft: "8px" }}>
          Export Excel
        </button>
      </div>
    </div>
  );
}
