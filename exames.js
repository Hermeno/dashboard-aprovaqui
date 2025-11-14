const API_URL = "https://app-quizz-backend-nodes-express-and.onrender.com";
const token = localStorage.getItem('token');

function showAlert(msg, type='red'){
  const el = $('#alert');
  el.removeClass('hidden').text(msg);
  if(type==='green') el.attr('class','bg-green-500 text-white p-3 rounded mb-4');
  else el.attr('class','bg-red-500 text-white p-3 rounded mb-4');
}

if(!token) window.location.href = 'login.html';

$(function(){
  $('#logoutBtn').on('click', ()=>{ localStorage.removeItem('token'); window.location.href='login.html'; });

  async function loadExams(){
    try{
      const res = await $.ajax({ url: `${API_URL}/exames`, method: 'GET', headers: { Authorization: `Bearer ${token}` } });
      renderExams(res);
    }catch(err){
      console.error(err); showAlert('Erro ao carregar exames');
    }
  }

  function renderExams(list){
    const container = $('#examsList'); container.empty();
    if(!list || list.length===0) return container.append('<div class="text-gray-600">Nenhum exame.</div>');
    list.forEach(ex => {
      const card = $(
        `<div class="p-3 border rounded flex justify-between items-center">
          <div>
            <div class="font-semibold">${ex.titulo || ex.nome || 'Sem título'}</div>
            <div class="text-sm text-gray-600">${ex.descricao || ''}</div>
            <div class="text-xs text-gray-500">Duração: ${ex.duracao || '-'} min • Perguntas: ${ex.numeroPerguntas || '-'} • Preço: ${ex.preco || 0}</div>
          </div>
          <div class="space-x-2">
            <button class="viewQuestionsBtn bg-blue-500 text-white px-3 py-1 rounded" data-id="${ex.id}">Perguntas</button>
            <button class="editExamBtn bg-yellow-400 text-white px-3 py-1 rounded" data-id="${ex.id}">Editar</button>
            <button class="deleteExamBtn bg-red-500 text-white px-3 py-1 rounded" data-id="${ex.id}">Excluir</button>
          </div>
        </div>`);
      container.append(card);
    });
  }

  $('#createExamForm').on('submit', async function(e){
    e.preventDefault();
    const titulo = $('#titulo').val();
    const descricao = $('#descricao').val();
    const duracao = parseInt($('#duracao').val() || 0, 10);
    const preco = parseFloat($('#preco').val() || 0);
    const numeroPerguntas = parseInt($('#numeroPerguntas').val() || 0, 10);
    try{
      const res = await $.ajax({ url: `${API_URL}/exames`, method: 'POST', contentType: 'application/json', data: JSON.stringify({ titulo, descricao, duracao, preco, numeroPerguntas }), headers: { Authorization: `Bearer ${token}` } });
      showAlert('Exame criado', 'green'); $('#titulo').val(''); $('#descricao').val(''); $('#duracao').val(''); $('#preco').val(''); $('#numeroPerguntas').val(''); loadExams();
    }catch(err){ console.error(err); showAlert('Erro ao criar exame'); }
  });

  $('#examsList').on('click', '.deleteExamBtn', async function(){
    const id = $(this).data('id');
    if(!confirm('Confirmar exclusão do exame?')) return;
    try{
      await $.ajax({ url: `${API_URL}/exames/${id}`, method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      showAlert('Exame excluído', 'green'); loadExams();
    }catch(err){ console.error(err); showAlert('Erro ao excluir'); }
  });

  $('#examsList').on('click', '.viewQuestionsBtn', function(){
    const id = $(this).data('id');
    window.location.href = `perguntas.html?exameId=${id}`;
  });

  // edição simples (prompt)
  $('#examsList').on('click', '.editExamBtn', async function(){
    const id = $(this).data('id');
    const novoTitulo = prompt('Novo título:');
    if(novoTitulo===null) return;
    try{
      await $.ajax({ url: `${API_URL}/exames/${id}`, method: 'PUT', contentType: 'application/json', data: JSON.stringify({ titulo: novoTitulo }), headers: { Authorization: `Bearer ${token}` } });
      showAlert('Exame atualizado', 'green'); loadExams();
    }catch(err){ console.error(err); showAlert('Erro ao atualizar'); }
  });

  loadExams();
});
