import "./App.css";

function App() {
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
          <button className="login">Entrar</button>
          <button className="register">Criar conta</button>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-content">
            <span className="tag">✨ Encontre profissionais perto de você</span>

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
                />
              </div>

              <div className="location-field">
                <span>📍</span>
                <input
                  type="text"
                  placeholder="Cidade ou região"
                />
              </div>

              <button className="search-button">
                Encontrar serviço
              </button>
            </div>

            <div className="hero-actions">
              <button className="primary-action">
                🔎 Procurar um serviço
              </button>

              <button className="secondary-action">
                🧑‍🔧 Oferecer meu serviço
              </button>
            </div>
          </div>
        </section>

        <section className="categories" id="categorias">
          <div className="section-title">
            <span>EXPLORE</span>
            <h2>O que você está procurando?</h2>
            <p>Encontre profissionais para diferentes tipos de serviços.</p>
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
                Entre em contato, combine os detalhes e contrate o profissional.
              </p>
            </div>
          </div>
        </section>

        <section className="professional-banner">
          <div>
            <span>É PROFISSIONAL?</span>
            <h2>Transforme seu trabalho em novas oportunidades.</h2>
            <p>
              Crie seu perfil gratuitamente e seja encontrado por pessoas que
              precisam dos seus serviços.
            </p>
          </div>

          <button>Começar agora →</button>
        </section>
      </main>

      <footer>
        <div className="footer-logo">🔎 Achei Serviço</div>
        <p>Quem precisa, acha. Quem trabalha, é encontrado.</p>
        <small>© 2026 Achei Serviço</small>
      </footer>
    </div>
  );
}

export default App;