const API_URL = "http://192.168.43.184:3000";

document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registro concluído. Agora você pode fazer login.");
      window.location.href = "login.html";
    } else {
      alert(data.error || "Erro ao registrar");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao conectar com o servidor");
  }
});
