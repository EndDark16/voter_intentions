import { useMemo, useState } from "react";

const numericFields = [
  { name: "age", label: "Edad", min: 18, max: 120, step: 1 },
  { name: "gender", label: "Género (0=femenino,1=masculino)", min: 0, max: 1, step: 1 },
  { name: "education", label: "Educación (escala 0-5)", min: 0, max: 5, step: 1 },
  { name: "employment_status", label: "Estatus laboral", min: 0, max: 5, step: 1 },
  { name: "employment_sector", label: "Sector laboral", min: 0, max: 5, step: 1 },
  { name: "income_bracket", label: "Ingreso (escala 0-6)", min: 0, max: 6, step: 1 },
  { name: "marital_status", label: "Estado civil", min: 0, max: 4, step: 1 },
  { name: "household_size", label: "Tamaño del hogar", min: 1, max: 10, step: 1 },
  { name: "has_children", label: "Tiene hijos (0/1)", min: 0, max: 1, step: 1 },
  { name: "urbanicity", label: "Urbanicidad", min: 0, max: 3, step: 1 },
  { name: "region", label: "Región", min: 0, max: 5, step: 1 },
  { name: "voted_last", label: "Votó última vez (0/1)", min: 0, max: 1, step: 1 },
  { name: "party_id_strength", label: "Fuerza partidista (0-5)", min: 0, max: 5, step: 1 },
  { name: "union_member", label: "Sindicalizado (0/1)", min: 0, max: 1, step: 1 },
  { name: "public_sector", label: "Sector público (0/1)", min: 0, max: 1, step: 1 },
  { name: "home_owner", label: "Propietario (0/1)", min: 0, max: 1, step: 1 },
  { name: "small_biz_owner", label: "Micronegocio (0/1)", min: 0, max: 1, step: 1 },
  { name: "owns_car", label: "Tiene auto (0/1)", min: 0, max: 1, step: 1 },
  { name: "wa_groups", label: "Participa en grupos (0-5)", min: 0, max: 5, step: 1 },
  { name: "refused_count", label: "Respuestas rehusadas", min: 0, max: 10, step: 1 },
  { name: "attention_check", label: "Atención (0/1)", min: 0, max: 1, step: 1 },
  { name: "will_turnout", label: "Dice que votará (0/1)", min: 0, max: 1, step: 1 },
  { name: "undecided", label: "Indeciso (0/1)", min: 0, max: 1, step: 1 },
  { name: "preference_strength", label: "Fuerza preferencia (0-5)", min: 0, max: 5, step: 1 },
  { name: "survey_confidence", label: "Confianza encuesta (0-5)", min: 0, max: 5, step: 1 },
  { name: "tv_news_hours", label: "Horas TV noticias", min: 0, max: 10, step: 1 },
  { name: "social_media_hours", label: "Horas redes sociales", min: 0, max: 10, step: 1 },
  { name: "trust_media", label: "Confianza medios (0-5)", min: 0, max: 5, step: 1 },
  { name: "civic_participation", label: "Participación cívica (0-5)", min: 0, max: 5, step: 1 },
  { name: "job_tenure_years", label: "Antigüedad laboral (años)", min: 0, max: 45, step: 1 },
];

const candidateOptions = [
  "CAND_Azon",
  "CAND_Boreal",
  "CAND_Civico",
  "CAND_Demetra",
  "CAND_Electra",
  "CAND_Frontera",
  "CAND_Gaia",
  "CAND_Halley",
  "CAND_Icaro",
  "CAND_Jade",
];

const API_URL =
  import.meta.env.VITE_API_URL ?? "https://voterintentionsbackend.onrender.com";

const formatNumber = (value) => (value * 100).toFixed(1) + "%";

export default function App() {
  const initialState = useMemo(() => {
    return numericFields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: field.min ?? 0,
      }),
      {
        primary_choice: candidateOptions[0],
        secondary_choice: candidateOptions[1],
      },
    );
  }, []);

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [key, Number.isNaN(Number(value)) ? value : Number(value)]),
          ),
        ),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const payload = await response.json();
      setResult(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const topCandidates = result?.top_candidates ?? [];

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Predicción electoral · KNN</p>
          <h1>Vincula nuevos votantes y conoce su afinidad.</h1>
          <p className="sub">
            Registra los indicadores sociodemográficos y políticos. El servicio de ML calcula la intención de voto con un
            KNN calibrado en 3,000 casos reales.
          </p>
        </div>
        <div className="cta-block">
          <p>
            API en vivo:
            <a href="https://voterintentionsbackend.onrender.com" target="_blank" rel="noreferrer">
              Render
            </a>
          </p>
          <p>
            Frontend:
            <a href="https://voterintentions.vercel.app" target="_blank" rel="noreferrer">
              Vercel
            </a>
          </p>
        </div>
      </header>

      <section className="layout">
        <div className="form-column">
          <h2>Ficha del votante</h2>
          <p className="hint">
            Completa cada campo numérico según su escala y selecciona las preferencias que correspondan a las opciones
            visibles.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid">
              {numericFields.map((field) => (
                <label key={field.name}>
                  <span>{field.label}</span>
                  <input
                    type="number"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={formData[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                </label>
              ))}
              <label>
                <span>Preferencia principal</span>
                <select
                  value={formData.primary_choice}
                  onChange={(e) => handleChange("primary_choice", e.target.value)}
                >
                  {candidateOptions.map((candidate) => (
                    <option key={candidate} value={candidate}>
                      {candidate}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Preferencia secundaria</span>
                <select
                  value={formData.secondary_choice}
                  onChange={(e) => handleChange("secondary_choice", e.target.value)}
                >
                  {[...candidateOptions, "Unknown"].map((candidate) => (
                    <option key={candidate} value={candidate}>
                      {candidate}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Consultando modelo..." : "Predecir intención"}
            </button>
            {error && <p className="error">⚠️ {error}</p>}
          </form>
        </div>

        <aside className="result-pane">
          <h3>Resultado y métricas</h3>
          <ul>
            <li>Entrenamiento balanceado + validación GroupKFold (macro F1 / balanced accuracy).</li>
            <li>Normalización fila + PCA opcional para distancias Manhattan/Coseno.</li>
            <li>Control de indecisos mediante umbral y análisis top‑2.</li>
          </ul>

          {result ? (
            <div className="insights">
              <div className="confidence-card">
                <p>Confianza de la predicción</p>
                <strong>{formatNumber(result.confidence ?? 0)}</strong>
                {result.runner_up && (
                  <span>
                    2.º lugar: {result.runner_up.candidate} ({formatNumber(result.runner_up.probability)})
                  </span>
                )}
              </div>

              <div className="bars">
                {topCandidates.map((item) => (
                  <div key={item.candidate} className="bar-row">
                    <span>{item.candidate}</span>
                    <div className="bar">
                      <div className="bar-fill" style={{ width: `${item.probability * 100}%` }} />
                      <span className="value">{formatNumber(item.probability)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="result-card">
                <p>Intención estimada</p>
                <strong>{result.intended_vote}</strong>
                <small>{result.confidence_note}</small>
              </div>
            </div>
          ) : (
            <div className="result-card ghost">
              Completa la ficha para visualizar la predicción del modelo y las probabilidades asociadas.
            </div>
          )}
        </aside>
      </section>

      <footer>By Andres Melo &amp; Thomas Cristancho – Universidad de Cundinamarca 2025</footer>
    </main>
  );
}
