import {useEffect,useState } from "react";
import "./App.css";
import { supabase } from "./lib/supabaseClient";
function App() {
  const [usuario, setUsuario] = useState(null);
const [mostrarLogin, setMostrarLogin] = useState(false);
useEffect(() => {
  async function verificarUsuario() {
    const { data } = await supabase.auth.getSession();
    setUsuario(data.session?.user ?? null);
  }

  verificarUsuario();
}, []);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
const [profissionais, setProfissionais] = useState([]);
const [avaliacoes, setAvaliacoes] = useState([]);
useEffect(() => {
  async function carregarAvaliacoes() {
    const { data, error } = await supabase
      .from("avaliacoes")
      .select("*");

    if (error) {
      console.error("Erro ao carregar avaliações:", error);
      return;
    }

    setAvaliacoes(data);
  }

  carregarAvaliacoes();
}, []);
const [notaSelecionada, setNotaSelecionada] = useState("5");
const [profissionalSelecionado, setProfissionalSelecionado] = useState(null);
const [busca, setBusca] = useState("");
const [resultadosBusca, setResultadosBusca] = useState(null);
  useEffect(() => {
    async function carregarProfissionais() {
      const { data, error } = await supabase
        .from("profissionais")
        .select("*");

      if (error) {
        console.error("Erro ao carregar profissionais:", error);
        return;
      }

      setProfissionais(data);
    }

    carregarProfissionais();
  }, []);
  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span>🔎</span> Achei Serviço
        </div>

        <nav>
          <a href="#inicio">Início</a>
          <a href="#categorias">Categorias</a>
          <a href="#como-funciona">Como funciona</a>
        </nav>

        <div className="header-buttons">
         <button
  className="login"
  onClick={() => {
    alert("ENTRAR FOI CLICADO");
    setMostrarLogin(true);
  }}
>
  Entrar
</button>
          <button className="register">Criar conta</button>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-content">
            <span className="tag">
              ✨ Encontre profissionais perto de você
            </span>

            <h1>
              Precisou de um serviço?
              <strong> Achei!</strong>
            </h1>

            <p>
              Encontre profissionais de confiança ou ofereça seu trabalho
              para novos clientes.
            </p>

            <div className="search-box">
              <div className="search-field">
                <span>🔍</span>
                <input
  type="text"
  placeholder="Qual serviço você procura?"
  value={busca}
  onChange={(e) => setBusca(e.target.value)}
/>
              </div>

              <div className="location-field">
                <span>📍</span>
                <input
                  type="text"
                  placeholder="Cidade ou região"
                />
              </div>

             <button
  className="search-button"
  onClick={() => {
    const resultados = profissionais.filter((profissional) =>
      profissional.servico
        .toLowerCase()
        .includes(busca.toLowerCase())
    );

    setResultadosBusca(resultados);
   
  }}
>
  Encontrar serviço
</button>
            </div>

            <div className="hero-actions">
           <button
  className="primary-action"
  onClick={() => {
    document
      .querySelector(".search-box")
      .scrollIntoView({ behavior: "smooth" });
  }}
>
                🔎 Procurar um serviço
              </button>

<button
  className="secondary-action"
  onClick={() =>setMostrarFormulario(true)}
>
  👨‍💼 Oferecer meu serviço
</button>
            </div>
          </div>
        </section>
{mostrarLogin && (
  <section className="professional-details">
    <h2>Entrar no Achei Serviço</h2>

    <form
      onSubmit={async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const senha = formData.get("senha");

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });

        if (error) {
          alert("❌ Erro ao entrar: " + error.message);
          return;
        }

        setUsuario(data.user);
        setMostrarLogin(false);
        alert("✅ Login realizado com sucesso!");
      }}
    >
      <input
        type="email"
        name="email"
        placeholder="Seu e-mail"
        required
      />

      <input
        type="password"
        name="senha"
        placeholder="Sua senha"
        required
      />

      <button type="submit">
        Entrar
      </button>
    </form>

    <button
      onClick={async () => {
        const email = prompt("Digite seu e-mail:");
        const senha = prompt("Crie uma senha:");

        if (!email || !senha) return;

        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
        });

        if (error) {
          alert("❌ Erro ao criar conta: " + error.message);
          return;
        }

        alert(
          "✅ Conta criada! Verifique seu e-mail para confirmar o cadastro."
        );
      }}
    >
      Criar minha conta
    </button>

    <button onClick={() => setMostrarLogin(false)}>
      Fechar
    </button>
  </section>
)}
        {mostrarFormulario && (
          <section className="professional-form">
            <div className="form-container">
              <button
                className="close-form"
                onClick={() => setMostrarFormulario(false)}
              >
                ✕
              </button>

              <span>CADASTRO PROFISSIONAL</span>

              <h2>Ofereça seu serviço</h2>

              <p>
                Cadastre seus dados para começar a receber novos clientes.
              </p>

              <form
  onSubmit={async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const { error } = await supabase
      .from("profissionais")
      .insert({
        nome: formData.get("nome"),
        whatsapp: formData.get("whatsapp"),
        servico: formData.get("servico"),
        cidade: formData.get("cidade"),
        preco: formData.get("preco"),
        descricao: formData.get("descricao"),
      });

    if (error) {
      alert("❌ Erro ao cadastrar: " + error.message);
      return;
    }

    alert("✅ Serviço cadastrado com sucesso!");
    e.currentTarget.reset();
  }}
>
                <input
                  type="text"
                  name="nome"
                  placeholder="Seu nome"
                />

                <input
                  type="tel"
                   name="whatsapp"
                  placeholder="WhatsApp"
                />

                <input
                  type="text"
                   name="servico"
                  placeholder="Qual serviço você oferece?"
                />

                <input
                  type="text"
                  name="cidade"
                  placeholder="Cidade ou região"
                />

                <input
                  type="number"
                  name="preco"
                  placeholder="Preço inicial (R$)"
                />

                <textarea
                 name="descricao"
                  placeholder="Conte um pouco sobre seu serviço..."
                  rows="4"
                ></textarea>

                <button type="submit" className="form-button">
                  Cadastrar meu serviço
                </button>
              </form>
            </div>
          </section>
        )}

       <section className="professionals-list">
  <div className="section-title">
    <span>PROFISSIONAIS</span>
    <h2>Profissionais cadastrados</h2>
    <p>Encontre quem pode ajudar você.</p>
  </div>

  <div className="category-grid">
  {(resultadosBusca !== null ? resultadosBusca : profissionais).map((profissional) => (
      <div
  className="category-card"
  key={profissional.id}
 onClick={() => setProfissionalSelecionado(profissional)}
  style={{ cursor: "pointer" }}
>
        <div className="category-icon">🧑‍🔧</div>
        <h3>{profissional.servico}</h3>
        <p><strong>{profissional.nome}</strong></p>
        <p>📍 {profissional.cidade}</p>
       
        <p>💰 A partir de R$ {profissional.preco}</p>
        <p>{profissional.descricao}</p>
        <p>📱 {profissional.whatsapp}</p>
      </div>
    ))}
  </div>
</section> 
{profissionalSelecionado && (
  <section className="professional-details">
    <h2>{profissionalSelecionado.nome}</h2>
   <div className="avaliacao">
  <label>Deixe sua avaliação:</label>

  <select
  value={notaSelecionada}
  onChange={(e) => setNotaSelecionada(e.target.value)}
>
    <option value="5">⭐⭐⭐⭐⭐ Excelente</option>
    <option value="4">⭐⭐⭐⭐ Muito bom</option>
    <option value="3">⭐⭐⭐ Bom</option>
    <option value="2">⭐⭐ Regular</option>
    <option value="1">⭐ Ruim</option>
  </select><textarea
  name="comentario"
  placeholder="Escreva um comentário..."
  rows="3"
/>

<button
  onClick={async () => {
    const { error } = await supabase
      .from("avaliacoes")
       .insert({
  profissional_id: profissionalSelecionado.id,
  nota: Number(notaSelecionada),
  comentario: document.querySelector(
    'textarea[name="comentario"]'
  ).value,
})

    if (error) {
      alert("❌ Erro ao enviar avaliação: " + error.message);
      return;
    }

    alert("✅ Avaliação enviada com sucesso!");
    setNotaSelecionada("5");
  }}
>
  Enviar avaliação
</button>
</div>
    <p>🔧 {profissionalSelecionado.servico}</p>
    <p>📍 {profissionalSelecionado.cidade}</p>
    <p>💰 A partir de R$ {profissionalSelecionado.preco}</p>
    <p>
  ⭐ {(
    avaliacoes
      .filter((a) => a.profissional_id === profissionalSelecionado.id)
      .reduce((soma, a) => soma + a.nota, 0) /
    avaliacoes.filter(
      (a) => a.profissional_id === profissionalSelecionado.id
    ).length || 0
  ).toFixed(1)}

  {" "}
  ({avaliacoes.filter(
    (a) => a.profissional_id === profissionalSelecionado.id
  ).length} avaliações)
</p>
    <p>{profissionalSelecionado.descricao}</p>
    {avaliacoes
  .filter(
    (a) => a.profissional_id === profissionalSelecionado.id
  )
  .map((a) => (
    <div
      key={a.id}
      style={{
        marginTop: "15px",
        padding: "15px",
        background: "#f7f7f7",
        borderRadius: "12px",
        textAlign: "left",
      }}
    >
      <p>⭐ {a.nota}/5</p>

      {a.comentario && (
        <p>💬 "{a.comentario}"</p>
      )}
    </div>
  ))}

    <a
      href={`https://wa.me/55${profissionalSelecionado.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      📱 Chamar no WhatsApp
    </a>
<button onClick={() => setProfissionalSelecionado(null)}>
  Fechar
</button>
    
  </section>
)}
        <section className="categories" id="categorias">
          <div className="section-title">
            <span>EXPLORE</span>
            <h2>O que você está procurando?</h2>
            <p>
              Encontre profissionais para diferentes tipos de serviços.
            </p>
          </div>

          <div className="category-grid">
            <div className="category-card">
              <div className="category-icon">🔧</div>
              <h3>Manutenção</h3>
              <p>Eletricista, encanador e mais</p>
            </div>

            <div className="category-card">
              <div className="category-icon">💇</div>
              <h3>Beleza</h3>
              <p>Cabelo, unhas, estética e mais</p>
            </div>

            <div className="category-card">
              <div className="category-icon">🏠</div>
              <h3>Casa</h3>
              <p>Limpeza, organização e reformas</p>
            </div>

            <div className="category-card">
              <div className="category-icon">🚗</div>
              <h3>Automotivo</h3>
              <p>Mecânicos, lavagem e serviços</p>
            </div>

            <div className="category-card">
              <div className="category-icon">💻</div>
              <h3>Tecnologia</h3>
              <p>Informática, design e programação</p>
            </div>

            <div className="category-card">
              <div className="category-icon">📚</div>
              <h3>Aulas</h3>
              <p>Professores e aulas particulares</p>
            </div>

            <div className="category-card">
              <div className="category-icon">🐶</div>
              <h3>Pet</h3>
              <p>Banho, passeio e cuidados</p>
            </div>

            <div className="category-card">
              <div className="category-icon">➕</div>
              <h3>Ver tudo</h3>
              <p>Explore todas as categorias</p>
            </div>
          </div>
        </section>

        <section className="how-it-works" id="como-funciona">
          <div className="section-title">
            <span>SIMPLES E RÁPIDO</span>
            <h2>Como funciona?</h2>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Encontre</h3>
              <p>
                Pesquise o serviço que você precisa e encontre profissionais
                próximos.
              </p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Compare</h3>
              <p>
                Veja avaliações, preços, experiência e informações dos
                profissionais.
              </p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Contrate</h3>
              <p>
                Entre em contato, combine os detalhes e contrate o
                profissional.
              </p>
            </div>
          </div>
        </section>

        <section className="professional-banner">
          <div>
            <span>É PROFISSIONAL?</span>

            <h2>
              Transforme seu trabalho em novas oportunidades.
            </h2>

            <p>
              Crie seu perfil gratuitamente e seja encontrado por pessoas
              que precisam dos seus serviços.
            </p>
          </div>

          <button onClick={() => setMostrarFormulario(true)}>
            Começar agora →
          </button>
        </section>
      </main>

      <footer>
        <div className="footer-logo">🔎 Achei Serviço</div>

        <p>
          Quem precisa, acha. Quem trabalha, é encontrado.
        </p>

        <small>© 2026 Achei Serviço</small>
      </footer>
    </div>
  );
}

export default App;