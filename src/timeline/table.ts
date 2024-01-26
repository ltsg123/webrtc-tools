export function createTable(data: any[], tableContainer: HTMLElement) {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // 创建表头
  const headerRow = document.createElement("tr");
  Object.keys(data[0]).forEach((key) => {
    const th = document.createElement("th");
    th.textContent = key;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // 创建表格内容
  data.forEach((rowData) => {
    const tr = document.createElement("tr");
    tr.className = "table";
    tr.id = "tab_" + rowData[""];
    Object.values(rowData).forEach((value: any) => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  tableContainer.appendChild(table);
}
