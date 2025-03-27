// ==UserScript==
// @name         Sortable Table Example
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Create a sortable table from a list of elements
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Sample data: an array of objects. Each object represents a row.
  const data = [
    { name: "Alice", age: 30, city: "New York" },
    { name: "Bob", age: 25, city: "Los Angeles" },
    { name: "Charlie", age: 35, city: "Chicago" },
  ];

  // Create and insert a container for the table.
  const tableContainer = document.createElement("div");
  tableContainer.id = "sortableTableContainer";
  document.body.prepend(tableContainer);

  // Function to render the table from the data array.
  function renderTable(data) {
    let tableHtml = `<table border="1" id="sortableTable">
            <thead>
                <tr>
                    <th data-key="name">Name</th>
                    <th data-key="age">Age</th>
                    <th data-key="city">City</th>
                </tr>
            </thead>
            <tbody>`;
    data.forEach((item) => {
      tableHtml += `<tr>
                <td>${item.name}</td>
                <td>${item.age}</td>
                <td>${item.city}</td>
            </tr>`;
    });
    tableHtml += `</tbody></table>`;
    tableContainer.innerHTML = tableHtml;

    // Attach event listeners to the headers for sorting.
    document.querySelectorAll("#sortableTable thead th").forEach((header) => {
      header.addEventListener("click", function () {
        const key = this.getAttribute("data-key");
        sortTableByKey(key);
      });
    });
  }

  // Variable to control sort order. A value of 1 indicates ascending; -1 indicates descending.
  let sortOrder = 1;

  // Function to sort the table data based on a specific key.
  function sortTableByKey(key) {
    // Toggle sort order on each click.
    sortOrder = sortOrder * -1;
    data.sort((a, b) => {
      if (a[key] < b[key]) return -1 * sortOrder;
      if (a[key] > b[key]) return 1 * sortOrder;
      return 0;
    });
    renderTable(data);
  }

  // Initial render of the table.
  renderTable(data);
})();
