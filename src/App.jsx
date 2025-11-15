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
  { name: "wa_groups", label: "Participa en WA grupos (0-5)", min: 0, max: 5, step: 1 },
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
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
          gender: Number(formData.gender),
          education: Number(formData.education),
          employment_status: Number(formData.employment_status),
          employment_sector: Number(formData.employment_sector),
          income_bracket: Number(formData.income_bracket),
          marital_status: Number(formData.marital_status),
          household_size: Number(formData.household_size),
          has_children: Number(formData.has_children),
          urbanicity: Number(formData.urbanicity),
          region: Number(formData.region),
          voted_last: Number(formData.voted_last),
          party_id_strength: Number(formData.party_id_strength),
          union_member: Number(formData.union_member),
          public_sector: Number(formData.public_sector),
          home_owner: Number(formData.home_owner),
          small_biz_owner: Number(formData.small_biz_owner),
          owns_car: Number(formData.owns_car),
          wa_groups: Number(formData.wa_groups),
          refused_count: Number(formData.refused_count),
          attention_check: Number(formData.attention_check),
          will_turnout: Number(formData.will_turnout),
          undecided: Number(formData.undecided),
          preference_strength: Number(formData.preference_strength),
          survey_confidence: Number(formData.survey_confidence),
          tv_news_hours: Number(formData.tv_news_hours),
          social_media_hours: Number(formData.social_media_hours),
          trust_media: Number(formData.trust_media),
          civic_participation: Number(formData.civic_participation),
          job_tenure_years: Number(formData.job_tenure_years),
        }),
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

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Predicción electoral · KNN</p>
          <h1>Vincula nuevos votantes y conoce su afinidad.</h1>
          <p className="sub">
            Registra los indicadores sociodemográficos y políticos. El servicio de
            Machine Learning calculará la intención de voto usando el modelo
            entrenado sobre 3,000 casos reales.
          </p>
        </div>
        <div className="cta-block">
          <p>
            API en vivo: <a href="https://voterintentionsbackend.onrender.com" target="_blank" rel="noreferrer">Render</a>
          </p>
          <p>
            Frontend: <a href="https://voterintentions.vercel.app" target="_blank" rel="noreferrer">Vercel</a>
          </p>
        </div>
      </header>

      <section className="layout">
        <div className="form-column">
          <h2>Ficha del votante</h2>
          <p className="hint">
            Completa cada campo numérico según las escalas indicadas (0 a 5, 0/1, etc.).
            Las preferencias deben coincidir con las opciones visibles.
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
                <span>Preferencia principal (partido/candidato)</span>
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
                <span>Preferencia secundaria (respaldo)</span>
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
          <h3>Resultado y notas</h3>
          <ul>
            <li>El modelo KNN utiliza distancia Manhattan/Euclidiana + PCA opcional.</li>
            <li>Incluye balanceo en el set de entrenamiento y evaluación macro F1.</li>
            <li>Recuerda que la indecisión se controla con umbrales de probabilidad.</li>
          </ul>

          {result ? (
            <div className="result-card">
              <p>Intención estimada</p>
              <strong>{result.intended_vote}</strong>
              <small>{result.confidence_note}</small>
            </div>
          ) : (
            <div className="result-card ghost">
              Completa la ficha y presiona “Predecir intención” para ver la estimación.
            </div>
          )}
        </aside>
      </section>

      <footer>
        By Andres Melo &amp; Thomas Cristancho – Universidad de Cundinamarca 2025
      </footer>
    </main>
  );
}
