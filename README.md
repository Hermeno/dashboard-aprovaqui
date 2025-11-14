# Dashboard AprovAqui - Frontend

Páginas simples em HTML/CSS/JS/jQuery para gerenciar exames e perguntas usando o backend público.

Como rodar localmente (site estático)

O projeto foi configurado para ser um site estático. Para rodar localmente basta servir a pasta com um servidor estático e abrir `index.html` no navegador.

Exemplo rápido (zsh/macOS):

```bash
cd /Users/cash/Desktop/dash
python3 -m http.server 5500
# abra http://localhost:5500/index.html
```

Observações importantes sobre uploads e CORS
- Se você usar chamadas ao backend remoto (https://app-quizz-backend-nodes-express-and.onrender.com), o backend precisa permitir a origem onde o site está hospedado (CORS) — caso contrário o navegador bloqueará as requisições.
- Para que o upload de imagem funcione pelo formulário (`input type=file`), o backend precisa aceitar `multipart/form-data` (por exemplo usando `multer` em Express) e devolver, no objeto da pergunta criada, um campo `imagemPergunta` contendo a URL pública da imagem.

Exemplo de contrato usado pelo frontend:
- POST /perguntas (quando enviando JSON): Content-Type: application/json com body { pergunta, tipo, opcaoA, opcaoB, opcaoC, opcaoD, correta, exameId }
- POST /perguntas (quando enviando arquivo): multipart/form-data com campos texto/pergunta, tipo, opcaoA..D, correta, exameId e arquivo em campo `imagemPergunta`.

Se você quiser que eu atualize o backend para aceitar uploads (multer) e servir a pasta `uploads/`, cole aqui o arquivo do servidor do backend (`server.js` ou `app.js`) e eu faço o patch automático.

Endpoints usados (base): `https://app-quizz-backend-nodes-express-and.onrender.com`
