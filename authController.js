import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const registrar = async (req, res) => {
  console.log("Dados recebidos para registro:", req.body);
  try {
    const tipo = "aluno";
    const { nome, email, senha } = req.body; // tipo: 'aluno' ou 'professor'

    const existente = await prisma.usuario.findUnique({ where: { email } });
    if (existente) return res.status(400).json({ error: "Email já cadastrado" });
    const hashed = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.usuario.create({
      data: { nome, email, senha: hashed, tipo },
    });
    res.status(201).json({ message: "Usuário cadastrado com sucesso", usuario: novoUsuario });
  } catch (error) {
    console.error("Erro detalhado no registro:", error);
    res.status(500).json({ error: "Erro ao registrar" });
  }
};

export const login = async (req, res) => {
  try { 
    const { email, senha } = req.body;
    console.log("Tentativa de login para o email:", email);
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(400).json({ error: "Credenciais inválidas" });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(400).json({ error: "Credenciais inválidas" });

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );


    console.log("Login bem-sucedido para o usuário:", usuario.email);
    console.log("Token gerado:", token);

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        avatar: usuario.avatar || ""
      }
    });
  } catch (error) {
    console.error("Erro detalhado no login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};






// export const obterPerfil = async (req, res) => {
//   try {
//     const usuarioId = req.usuario.id;

//     const usuario = await prisma.usuario.findUnique({
//       where: { id: usuarioId },
//       select: { id: true, nome: true, email: true, tipo: true },
//     });

//     res.json(usuario);
//   } catch (error) {
//     res.status(500).json({ error: "Erro ao obter perfil" });
//   }
// };

// export const atualizarPerfil = async (req, res) => {
//   try {
//     const usuarioId = req.usuario.id;
//     const { nome, email } = req.body;

//     const atualizado = await prisma.usuario.update({
//       where: { id: usuarioId },
//       data: { nome, email },
//       select: { id: true, nome: true, email: true, tipo: true },
//     });

//     res.json(atualizado);
//   } catch (error) {
//     res.status(500).json({ error: "Erro ao atualizar perfil" });
//   }
// }         