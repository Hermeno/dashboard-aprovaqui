import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const criarPergunta = async (req, res) => {
  try {
    const { pergunta, imagem, tipo, opcaoA, opcaoB, opcaoC, opcaoD, correta, exameId } = req.body;
    const perguntas = await prisma.pergunta.create({ 
      data: { pergunta, imagem, tipo, opcaoA, opcaoB, opcaoC, opcaoD, correta, exameId }
     });
    res.status(201).json({ message: "Pergunta criada", perguntas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar pergunta" });
  }
}; 

export const listarPerguntas = async (req, res) => {
  try {
    const perguntas = await prisma.pergunta.findMany();
    res.json(perguntas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar perguntas" });
  }
};

export const obterPergunta = async (req, res) => {
  try {
    const { id } = req.params;
    const pergunta = await prisma.pergunta.findUnique({ where: { id: Number(id) } });
    if (!pergunta) return res.status(404).json({ error: "Pergunta não encontrada" });
    res.json(pergunta);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter pergunta" });
  }
};

export const atualizarPergunta = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;
    const pergunta = await prisma.pergunta.update({ where: { id: Number(id) }, data: dados });
    res.json({ message: "Pergunta atualizada", pergunta });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar pergunta" });
  }
};

export const excluirPergunta = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.pergunta.delete({ where: { id: Number(id) } });
    res.json({ message: "Pergunta excluída" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir pergunta" });
  }
};





export const listarPerguntasPorExame = async (req, res) => {
  try {
    const { exameId } = req.params;
    
    if (!exameId) {
      console.error('ID do exame não fornecido');
      return res.status(400).json({ error: "ID do exame é obrigatório" });
    }
    
    console.log('Buscando perguntas para o exame:', exameId);

    const perguntas = await prisma.pergunta.findMany({ 
      where: { 
        exameId: Number(exameId) 
      },
      orderBy: {
        id: 'asc'
      }
    });

    console.log(`Encontradas ${perguntas.length} perguntas para o exame ${exameId}`);
    res.json(perguntas);
  } catch (error) {
    console.error('Erro ao listar perguntas do exame:', error);
    res.status(500).json({ error: `Erro ao listar perguntas do exame: ${error.message}` });
  }
};




// export const listarPerguntasPorExame = async (req, res) => {
//   try {
//     const { exameId } = req.params;
//     const perguntas = await prisma.pergunta.findMany({ where: { exameId: Number(exameId) } });
//     res.json(perguntas);
//   } catch (error) {
//     res.status(500).json({ error: "Erro ao listar perguntas por exame" });
//   }
// };
