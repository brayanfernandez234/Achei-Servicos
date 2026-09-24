import {useEffect,useState } from "react";
import "./App.css";
import { supabase } from "./lib/supabaseClient";
function App() {
  const [usuario, setUsuario] = useState(null);

const [mostrarLogin, setMostrarLogin] = useState(false);
const [mostrarCadastro, setMostrarCadastro] = useState(false);
const [mostrarPerfil, setMostrarPerfil] = useState(false);
const [mostrarMeusServicos, setMostrarMeusServicos] = useState(false);
const [mostrarSolicitacoes, setMostrarSolicitacoes] = useState(false);
const [meusServicos, setMeusServicos] = useState([]);
const [solicitacoes, setSolicitacoes] = useState([]);
const [minhasSolicitacoes, setMinhasSolicitacoes] = useState([]);
const [mostrarMinhasSolicitacoes, setMostrarMinhasSolicitacoes] = useState(false);
const [servicoEditando, setServicoEditando] = useState(null);
useEffect(() => {
  async function verificarUsuario() {
    const { data } = await supabase.auth.getSession();
    setUsuario(data.session?.user ?? null);
  }

  verificarUsuario();

  const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setUsuario(session?.user ?? null);
    }
  );

  return () => {
    listener.subscription.unsubscribe();
  };
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
const [localizacaoBusca, setLocalizacaoBusca] = useState("");
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
  useEffect(() => {
  async function carregarMeusServicos() {
    if (!usuario) return;

    const { data, error } = await supabase
      .from("profissionais")
      .select("*")
      .eq("usuario_id", usuario.id);

    if (!error) {
      setMeusServicos(data || []);
    }
  }

  carregarMeusServicos();
}, [usuario, mostrarMeusServicos]);
useEffect(() => {
  async function carregarSolicitacoes() {
    if (!usuario) return;

    const { data: meusDados } = await supabase
      .from("profissionais")
      .select("id")
      .eq("usuario_id", usuario.id);

    if (!meusDados || meusDados.length === 0) {
      setSolicitacoes([]);
      return;
    }

    const idsProfissionais = meusDados.map((item) => item.id);

    const { data, error } = await supabase
      .from("solicitacoes")
      .select("*")
      .in("profissional_id", idsProfissionais)
      .order("created_at", { ascending: false });

    if (!error) {
      setSolicitacoes(data || []);
    }
  }

  carregarSolicitacoes();
}, [usuario]);
useEffect(() => {
  async function carregarMinhasSolicitacoes() {
    if (!usuario) return;

    const { data, error } = await supabase
      .from("solicitacoes")
      .select("*, profissionais(whatsapp, nome, servico, cidade)")
      .eq("cliente_id", usuario.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setMinhasSolicitacoes(data || []);
    }
  }

  carregarMinhasSolicitacoes();
}, [usuario]);
  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span>🔎</span> Achei Serviço
        </div>
<details className="mobile-menu">
  <summary>☰ Menu</summary>
  <div className="mobile-menu-links">
    <a href="#inicio">Início</a>
    <a href="#categorias">Categorias</a>
    <a href="#como-funciona">Como funciona</a>
  </div>
</details>

<nav>
  <a href="#inicio">Início</a>
  <a href="#categorias">Categorias</a>
  <a href="#como-funciona">Como funciona</a>
</nav>
        <div className="header-buttons">
  {usuario ? (
    <>
      <button
  className="profile-button"
  onClick={() => setMostrarPerfil(true)}
>
  Olá, {usuario?.user_metadata?.nome || "usuário"}! 👋
</button>

      <button
        className="login"
        onClick={async () => {
          await supabase.auth.signOut();
          setUsuario(null);
        }}
      >
        Sair
      </button>
    </>
  ) : (
    <>
      <button
        className="login"
        onClick={() => setMostrarLogin(true)}
      >
        Entrar
      </button>

      <button
        className="register"
        onClick={() => {
          setMostrarLogin(false);
          setMostrarCadastro(true);
        }}
      >
        Criar conta
      </button>
    </>
  )}
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
  value={localizacaoBusca}
  onChange={(e) => setLocalizacaoBusca(e.target.value)}
/>
              </div>

             <button
  className="search-button"
  onClick={() => {
   const resultados = profissionais.filter((profissional) => {
  const combinaServico = profissional.servico
    .toLowerCase()
    .includes(busca.toLowerCase());

  const combinaCidade = profissional.cidade
    .toLowerCase()
    .includes(localizacaoBusca.toLowerCase());

  return combinaServico && combinaCidade;
});
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
        {mostrarMeusServicos && (
  <section className="professional-details">
    <h2>🛠️ Meus serviços</h2>

   {meusServicos.length === 0 ? (
  <p>Você ainda não cadastrou nenhum serviço.</p>
) : (
  meusServicos.map((servico) => (
    <div key={servico.id}>
      <h3>{servico.servico}</h3>
      <p><strong>Cidade:</strong> {servico.cidade}</p>
      <p><strong>Preço:</strong> R$ {servico.preco}</p>
      <p>{servico.descricao}</p>
      <button
  onClick={async () => {
    const confirmar = window.confirm("Deseja excluir este serviço?");
    if (!confirmar) return;

    const { error } = await supabase
      .from("profissionais")
      .delete()
      .eq("id", servico.id)
      .eq("usuario_id", usuario.id);

    if (error) {
      alert("❌ Erro ao excluir: " + error.message);
      return;
    }

    setMeusServicos(
      meusServicos.filter((item) => item.id !== servico.id)
    );

    alert("✅ Serviço excluído!");
  }}
>
  🗑️ Excluir
</button>

<button
  onClick={() => setServicoEditando(servico)}
>
  ✏️ Editar
</button>
{servicoEditando?.id === servico.id && (
  <form
    onSubmit={async (e) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);

      const { error } = await supabase
        .from("profissionais")
        .update({
          nome: formData.get("nome"),
          whatsapp: formData.get("whatsapp"),
          servico: formData.get("servico"),
          cidade: formData.get("cidade"),
          preco: formData.get("preco"),
          descricao: formData.get("descricao"),
        })
        .eq("id", servico.id)
        .eq("usuario_id", usuario.id);

      if (error) {
        alert("❌ Erro ao editar: " + error.message);
        return;
      }

      alert("✅ Serviço atualizado!");

      setServicoEditando(null);

      setMeusServicos(
        meusServicos.map((item) =>
          item.id === servico.id
            ? {
                ...item,
                nome: formData.get("nome"),
                whatsapp: formData.get("whatsapp"),
                servico: formData.get("servico"),
                cidade: formData.get("cidade"),
                preco: formData.get("preco"),
                descricao: formData.get("descricao"),
              }
            : item
        )
      );
    }}
  >
    <input
      type="text"
      name="nome"
      defaultValue={servico.nome}
      placeholder="Seu nome"
      required
    />

    <input
      type="text"
      name="whatsapp"
      defaultValue={servico.whatsapp}
      placeholder="WhatsApp"
      required
    />

    <input
      type="text"
      name="servico"
      defaultValue={servico.servico}
      placeholder="Serviço"
      required
    />

    <input
      type="text"
      name="cidade"
      defaultValue={servico.cidade}
      placeholder="Cidade"
      required
    />

    <input
      type="number"
      name="preco"
      defaultValue={servico.preco}
      placeholder="Preço"
      required
    />

    <textarea
      name="descricao"
      defaultValue={servico.descricao}
      placeholder="Descrição"
      required
    />

    <button type="submit">
      💾 Salvar alterações
    </button>

    <button
      type="button"
      onClick={() => setServicoEditando(null)}
    >
      Cancelar
    </button>
  </form>
)}
    </div>
  ))
)}

    <button onClick={() => setMostrarMeusServicos(false)}>
      Voltar ao perfil
    </button>
  </section>
)}
        {mostrarPerfil && (
  <section className="professional-details">
    <h2>👤 Meu perfil</h2>
  <button onClick={() => setMostrarSolicitacoes(!mostrarSolicitacoes)}>
  📩 Solicitações recebidas
</button>

{mostrarSolicitacoes && (
  <div>
    <h3>Solicitações recebidas</h3>

    {solicitacoes.length === 0 ? (
      <p>Você ainda não recebeu nenhuma solicitação.</p>
    ) : (
      solicitacoes.map((solicitacao) => (
        <div key={solicitacao.id}>
          <p>
            <strong>Mensagem:</strong> {solicitacao.mensagem}
          </p>
          <p>
            <strong>Status:</strong> {solicitacao.status}
          </p>
          <button
          disabled={solicitacao.status !== "pendente"}

  onClick={async () => {
    const { error } = await supabase
      .from("solicitacoes")
      .update({ status: "aceita" })
      .eq("id", solicitacao.id);

    if (error) {
      alert("❌ Erro ao aceitar: " + error.message);
      return;
    }

    setSolicitacoes(
      solicitacoes.map((item) =>
        item.id === solicitacao.id
          ? { ...item, status: "aceita" }
          : item
      )
    );

    alert("✅ Solicitação aceita!");
  }}
>
  ✅ Aceitar
</button>

<button
disabled={solicitacao.status !== "pendente"}
  onClick={async () => {
    const { error } = await supabase
      .from("solicitacoes")
      .update({ status: "recusada" })
      .eq("id", solicitacao.id);

    if (error) {
      alert("❌ Erro ao recusar: " + error.message);
      return;
    }

    setSolicitacoes(
      solicitacoes.map((item) =>
        item.id === solicitacao.id
          ? { ...item, status: "recusada" }
          : item
      )
    );

    alert("❌ Solicitação recusada.");
  }}
>
  ❌ Recusar
</button>
          <hr />
        </div>
      ))
    )}
  </div>
)}
   <button onClick={() => setMostrarMeusServicos(true)}>
  🛠️ Meus serviços
</button>

    <p>
      <strong>Nome:</strong>{" "}
     {usuario?.user_metadata?.nome || usuario?.email?.split("@")[0] || "Não informado"}
    </p>

    <p>
      <strong>E-mail:</strong> {usuario?.email}
    </p>
<button onClick={() => setMostrarMinhasSolicitacoes(!mostrarMinhasSolicitacoes)}>
  📋 Minhas solicitações
</button>
{mostrarMinhasSolicitacoes && (
  <div>
    <h3>📋 Minhas solicitações</h3>

    {minhasSolicitacoes.length === 0 ? (
      <p>Você ainda não fez nenhuma solicitação.</p>
    ) : (
      minhasSolicitacoes.map((solicitacao) => (
        <div key={solicitacao.id}>
          <p>
  <strong>🛠️ Serviço:</strong>{" "}
  {solicitacao.profissionais?.servico || "Não informado"}
</p>

<p>
  <strong>📍 Cidade:</strong>{" "}
  {solicitacao.profissionais?.cidade || "Não informada"}
</p>
          <p>
            <strong>💬 Mensagem:</strong> {solicitacao.mensagem}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {solicitacao.status === "pendente"
              ? "🟡 Pendente"
              : solicitacao.status === "aceita"
              ? "🟢 Aceita"
              : "🔴 Recusada"}
          </p>

         {solicitacao.status === "aceita" && (
  <p>
    ✅ O profissional aceitou sua solicitação.
    <br />
    <button
  onClick={() => {
    const whatsapp = solicitacao.profissionais?.whatsapp;

    if (!whatsapp) {
      alert("WhatsApp do profissional não encontrado.");
      return;
    }

    let numero = whatsapp.replace(/\D/g, "");

    if (!numero.startsWith("55")) {
      numero = "55" + numero;
    }

  window.open(
  `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(
    "Olá! Entrei em contato pelo Achei Serviço sobre a solicitação de serviço que fiz. Podemos conversar?"
  )}`,
  "_blank"
);
  }}
>
      💬 Contactar por WhatsApp
    </button>
  </p>
)}

          <hr />
        </div>
      ))
    )}
  </div>
)}

    <button onClick={() => setMostrarPerfil(false)}>
      Fechar perfil
    </button>
  </section>
)}
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
  onClick={() => {
    setMostrarLogin(false);
    setMostrarCadastro(true);
  }}
>
  Criar minha conta
</button>
    <button onClick={() => setMostrarLogin(false)}>
      Fechar
    </button>
  </section>
)}
{mostrarCadastro && (
  <section className="professional-details">
    <h2>Criar minha conta</h2>

    <form
      onSubmit={async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const nome = formData.get("nome");
        const senha = formData.get("senha");

        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: {
  data: {
    nome: nome,
  },
},
        });

        if (error) {
          alert("❌ Erro ao criar conta: " + error.message);
          return;
        }

        alert("✅ Conta criada! Verifique seu e-mail.");
        setMostrarCadastro(false);
      }}
    ><input
  type="text"
  name="nome"
  placeholder="Seu nome"
  required
/>
      <input
        type="email"
        name="email"
        placeholder="Seu e-mail"
        required
      />

      <input
        type="password"
        name="senha"
        placeholder="Crie uma senha"
        minLength="6"
        required
      />

      <button type="submit">
        Criar conta
      </button>
    </form>

    <button onClick={() => setMostrarCadastro(false)}>
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
        usuario_id: usuario.id,
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
    if (!usuario) {
  alert("Faça login para avaliar o profissional.");
  setMostrarLogin(true);
  return;
}
    const { error } = await supabase
      .from("avaliacoes")
       .insert({
  profissional_id: profissionalSelecionado.id,
  usuario_id: (await supabase.auth.getUser()).data.user.id,
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
    <button
  onClick={async () => {
    if (!usuario) {
      alert("Faça login para solicitar um orçamento.");
      setMostrarLogin(true);
      return;
    }

    const mensagem = window.prompt(
      "Escreva sua mensagem para o profissional:"
    );

    if (!mensagem) return;

    const { error } = await supabase
      .from("solicitacoes")
      .insert({
        profissional_id: profissionalSelecionado.id,
        cliente_id: usuario.id,
        cliente_nome: usuario?.user_metadata?.nome || "Cliente",
        mensagem: mensagem,
      });

    if (error) {
      alert("❌ Erro ao enviar solicitação: " + error.message);
      return;
    }

    alert("✅ Solicitação enviada ao profissional!");
  }}
>
  📩 Solicitar orçamento
</button>
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
