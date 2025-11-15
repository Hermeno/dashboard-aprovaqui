const API_URL = "https://app-quizz-backend-nodes-express-and.onrender.com";
const token = localStorage.getItem('token');

function showAlert(msg, type='red'){
  const el = $('#alert');
  el.removeClass('hidden').text(msg);
  if(type==='green') el.attr('class','bg-green-500 text-white p-3 rounded mb-4');
  else el.attr('class','bg-red-500 text-white p-3 rounded mb-4');
}

if(!token) window.location.href = 'login.html';

function getQueryParam(name){
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

$(function(){
  $('#logoutBtn').on('click', ()=>{ localStorage.removeItem('token'); window.location.href='login.html'; });

  const exameId = getQueryParam('exameId');
  if(!exameId){ showAlert('ID do exame não informado'); return; }

  async function loadQuestions(){
    try{
      const res = await $.ajax({ url: `${API_URL}/perguntas/exame/${exameId}`, method: 'GET', headers: { Authorization: `Bearer ${token}` } });
      renderQuestions(res);
    }catch(err){ console.error(err); showAlert('Erro ao carregar perguntas'); }
  }

  // carregar textos narrativos do exame
  async function loadTextos(){
    try{
      const res = await $.ajax({ url: `${API_URL}/textos/exame/${exameId}`, method: 'GET', headers: { Authorization: `Bearer ${token}` } });
      renderTextos(res);
    }catch(err){ console.error('Erro ao carregar textos', err); $('#textosList').empty().append('<div class="text-gray-600">Erro ao carregar textos</div>'); }
  }

  function renderTextos(list){
    const c = $('#textosList'); c.empty();
    if(!list || list.length===0) return c.append('<div class="text-gray-600">Nenhum texto.</div>');
    list.forEach(t => {
      const card = $(
        `<div class="p-3 border rounded">
          <div class="flex justify-between items-start">
            <div>
              <div class="font-semibold">${t.titulo || 'Sem título'}</div>
              <div class="text-sm text-gray-700 mt-2">${(t.texto || '').replace(/\n/g, '<br/>')}</div>
            </div>
            <div class="ml-4">
              <button class="delTextBtn bg-red-500 text-white px-3 py-1 rounded" data-id="${t.id}">Excluir</button>
            </div>
          </div>
        </div>`);
      c.append(card);
    });
  }

  function renderQuestions(list){
    const c = $('#questionsList'); c.empty();
    if(!list || list.length===0) return c.append('<div class="text-gray-600">Nenhuma pergunta.</div>');
    list.forEach(q => {
      const imageHtml = q.imagemPergunta ? `<div class="mt-2"><img src="${q.imagemPergunta}" alt="imagem" class="max-w-xs border rounded"/></div>` : '';
      const card = $(
        `<div class="p-3 border rounded flex justify-between items-start">
          <div>
            <div class="font-semibold">${q.pergunta || (q.imagemPergunta ? 'Pergunta (imagem)' : 'Sem texto')}</div>
            <div class="text-sm text-gray-600">Tipo: ${q.tipo || '-'} • Correta: ${q.correta || '-'}</div>
            <div class="text-xs text-gray-600 mt-2">Opções: A:${q.opcaoA || '-'} | B:${q.opcaoB || '-'} | C:${q.opcaoC || '-'} | D:${q.opcaoD || '-'}</div>
            ${imageHtml}
          </div>
          <div class="space-x-2">
            <button class="editQBtn bg-yellow-400 text-white px-3 py-1 rounded" data-id="${q.id}">Editar</button>
            <button class="delQBtn bg-red-500 text-white px-3 py-1 rounded" data-id="${q.id}">Excluir</button>
          </div>
        </div>`);
      c.append(card);
    });
  }

  $('#createQuestionForm').on('submit', async function(e){
    e.preventDefault();
    const pergunta = $('#pergunta').val();
    const tipo = $('#tipo').val();
    const imagemPergunta = $('#imagemPergunta').val();
    const opcaoA = $('#opcaoA').val();
    const opcaoB = $('#opcaoB').val();
    const opcaoC = $('#opcaoC').val();
    const opcaoD = $('#opcaoD').val();
    const correta = $('#correta').val();
    // validação: permite criar pergunta com texto e/ou imagem; pelo menos um dos dois deve estar preenchido
    if ((!pergunta || pergunta.trim() === '') && (!imagemPergunta || imagemPergunta.trim() === '')) {
      showAlert('Preencha o enunciado ou informe a URL da imagem (pelo menos um).');
      return;
    }

    try{
      await $.ajax({ url: `${API_URL}/perguntas`, method: 'POST', contentType: 'application/json', data: JSON.stringify({ pergunta, imagemPergunta, tipo, opcaoA, opcaoB, opcaoC, opcaoD, correta, exameId }), headers: { Authorization: `Bearer ${token}` } });
      showAlert('Pergunta criada', 'green'); $('#pergunta').val(''); $('#imagemPergunta').val(''); $('#opcaoA').val(''); $('#opcaoB').val(''); $('#opcaoC').val(''); $('#opcaoD').val(''); $('#correta').val(''); loadQuestions();
    }catch(err){ console.error(err); showAlert('Erro ao criar pergunta'); }
  });

  // criar texto vinculado ao exame
  $('#createTextoForm').on('submit', async function(e){
    e.preventDefault();
    const titulo = $('#textoTitulo').val();
    const texto = $('#textoConteudo').val();
    try{
      await $.ajax({ url: `${API_URL}/textos`, method: 'POST', contentType: 'application/json', data: JSON.stringify({ exameId, titulo, texto }), headers: { Authorization: `Bearer ${token}` } });
      showAlert('Texto criado', 'green'); $('#textoTitulo').val(''); $('#textoConteudo').val('');
      // atualizar lista
      loadTextos();
    }catch(err){ console.error(err); showAlert('Erro ao criar texto'); }
  });

  // exclusão de texto
  $('#textosList').on('click', '.delTextBtn', async function(){
    const id = $(this).data('id'); if(!confirm('Confirmar exclusão do texto?')) return;
    try{
      await $.ajax({ url: `${API_URL}/textos/${id}`, method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      showAlert('Texto excluído', 'green'); loadTextos();
    }catch(err){ console.error(err); showAlert('Erro ao excluir texto'); }
  });

  $('#questionsList').on('click', '.delQBtn', async function(){
    const id = $(this).data('id'); if(!confirm('Confirmar exclusão?')) return;
    try{ await $.ajax({ url: `${API_URL}/perguntas/${id}`, method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); showAlert('Pergunta excluída', 'green'); loadQuestions(); } catch(err){ console.error(err); showAlert('Erro ao excluir'); }
  });

  $('#questionsList').on('click', '.editQBtn', async function(){
    const id = $(this).data('id');
    const novoTexto = prompt('Novo texto da pergunta:');
    if(novoTexto===null) return;
    const novaResposta = prompt('Nova resposta (deixe em branco para manter):');
    try{
      const payload = { texto: novoTexto };
      if(novaResposta !== null && novaResposta !== '') payload.resposta = novaResposta;
      await $.ajax({ url: `${API_URL}/perguntas/${id}`, method: 'PUT', contentType: 'application/json', data: JSON.stringify(payload), headers: { Authorization: `Bearer ${token}` } });
      showAlert('Pergunta atualizada', 'green'); loadQuestions();
    }catch(err){ console.error(err); showAlert('Erro ao atualizar'); }
  });

  loadQuestions();
  loadTextos();
});
