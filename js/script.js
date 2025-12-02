// ---------------------------
// MENU MOBILE
// ---------------------------
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// ---------------------------
// FATURAS - SISTEMA COMPLETO
// ---------------------------

// Variável global para edição
let indexEdicao = null;

// Carrega faturas ao abrir a página
document.addEventListener("DOMContentLoaded", () => {
  carregarFaturas();

  document.getElementById("faturaForm").addEventListener("submit", adicionarFatura);
  document.getElementById("buscarFatura").addEventListener("keyup", filtrarTabela);
  document.getElementById("filtroStatus").addEventListener("change", filtrarTabela);
});

// ---------------------------
// Carregar Faturas
// ---------------------------
function carregarFaturas() {
  const faturas = JSON.parse(localStorage.getItem("faturas")) || [];
  mostrarFaturas(faturas);
}

// ---------------------------
// Adicionar ou Editar Fatura
// ---------------------------
function adicionarFatura(e) {
  e.preventDefault();

  const cliente = document.getElementById("cliente").value;
  const numero = document.getElementById("numero").value;
  const valor = document.getElementById("valor").value;
  const vencimento = document.getElementById("vencimento").value;
  const status = document.getElementById("status").value;

  const faturas = JSON.parse(localStorage.getItem("faturas")) || [];

  // Se estamos editando uma fatura existente
  if (indexEdicao !== null) {
    faturas[indexEdicao] = { cliente, numero, valor, vencimento, status };
    indexEdicao = null; // volta para modo adicionar
  } else {
    // Adiciona nova
    faturas.push({ cliente, numero, valor, vencimento, status });
  }

  localStorage.setItem("faturas", JSON.stringify(faturas));

  carregarFaturas();
  e.target.reset();
}

// ---------------------------
// Exibir Faturas na Tabela
// ---------------------------
function mostrarFaturas(faturas) {
  const tbody = document.getElementById("faturasBody");
  tbody.innerHTML = "";

  faturas.forEach((fatura, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${fatura.cliente}</td>
      <td>${fatura.numero}</td>
      <td>${fatura.valor}</td>
      <td>${fatura.vencimento}</td>
      <td class="${fatura.status.toLowerCase()}">${fatura.status}</td>
      <td>
          <button onclick="editarFatura(${index})" class="btn-edit">Editar</button>
          <button onclick="excluirFatura(${index})" class="btn-delete">Excluir</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// ---------------------------
// Excluir Fatura
// ---------------------------
function excluirFatura(index) {
  const faturas = JSON.parse(localStorage.getItem("faturas")) || [];
  faturas.splice(index, 1);

  localStorage.setItem("faturas", JSON.stringify(faturas));
  carregarFaturas();
}

// ---------------------------
// Editar Fatura
// ---------------------------
function editarFatura(index) {
  const faturas = JSON.parse(localStorage.getItem("faturas")) || [];
  const f = faturas[index];

  // Preenche o formulário com os dados da fatura
  document.getElementById("cliente").value = f.cliente;
  document.getElementById("numero").value = f.numero;
  document.getElementById("valor").value = f.valor;
  document.getElementById("vencimento").value = f.vencimento;
  document.getElementById("status").value = f.status;

  // Marca que estamos editando esta linha
  indexEdicao = index;
}

// ---------------------------
// Buscar e Filtrar Faturas
// ---------------------------
function filtrarTabela() {
  const busca = document.getElementById("buscarFatura").value.toLowerCase();
  const filtroStatus = document.getElementById("filtroStatus").value;

  const faturas = JSON.parse(localStorage.getItem("faturas")) || [];

  const filtradas = faturas.filter(f => {
    const correspondeBusca =
      f.cliente.toLowerCase().includes(busca) ||
      f.numero.toLowerCase().includes(busca);

    const correspondeStatus =
      filtroStatus === "" || f.status === filtroStatus;

    return correspondeBusca && correspondeStatus;
  });

  mostrarFaturas(filtradas);
}
