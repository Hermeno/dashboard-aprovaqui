const API_URL = "http://192.168.43.184:3000";

document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "process.html";
    } else {
      alert(data.error || "Erro ao fazer login");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao conectar com o servidor");
  }
});
