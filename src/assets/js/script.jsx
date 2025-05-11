export const toggleMenu = () => {
  const nav = document.querySelector('.nav-lateral');
  nav.classList.toggle('expanded');
}

export const addRow = () => {
  // Obtener los valores de los campos de entrada
  const item = document.getElementById("item").value;
  const itemSelect = document.getElementById("item");
  const itemText = itemSelect.selectedOptions[0].text;
  const quantity = document.getElementById("quantity").value;
  const description = document.getElementById("description").value;
  const rate = parseFloat(document.getElementById("rate").value);
  const tax = parseFloat(document.getElementById("tax").value);

  if (!item || !description || isNaN(rate) || isNaN(tax) || isNaN(quantity)) {
    alert("Por favor, complete todos los campos obligatorios.");
    return;
  }
  const amountTotal = rate + (rate * tax / 100);

  // Crear una nueva fila
  const table = document.getElementById("itemsTable").getElementsByTagName('tbody')[0];
  const newRow = table.insertRow();

  // Insertar las celdas en la fila
  const cellItem = newRow.insertCell(0);
  const cellQuantity = newRow.insertCell(1);
  const cellDescription = newRow.insertCell(2);
  const cellRate = newRow.insertCell(3);
  const cellTax = newRow.insertCell(4);
  const cellAmountTotal = newRow.insertCell(5);
  const cellDelete = newRow.insertCell(6);

  // Asignar los valores a cada celda
  cellItem.textContent = `${item} ${itemText}`;
  cellQuantity.textContent = quantity;
  cellDescription.textContent = description;
  cellRate.textContent = rate.toFixed(2);
  cellTax.textContent = tax.toFixed(2) + "%";
  cellAmountTotal.textContent = amountTotal.toFixed(2);
  const deleteLink = document.createElement("a");
  deleteLink.className = "a"; 
  deleteLink.textContent = "Eliminar"; 
  deleteLink.onclick = (e) => { deleteRow(e.target); };

  cellDelete.appendChild(deleteLink);
  // Limpiar los campos de entrada
  document.getElementById("item").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("description").value = "";
  document.getElementById("rate").value = "";
  document.getElementById("tax").value = "";
}

export const cancelRow = () => {
  document.getElementById("item").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("description").value = "";
  document.getElementById("rate").value = "";
  document.getElementById("tax").value = "";
}
const deleteRow = (params) => {
  const row = params.parentNode.parentNode
  row.remove();
}