## Voter intention KNN stack

Este repositorio contiene todo lo necesario para entrenar, evaluar y desplegar como servicio un modelo de K vecinos más cercanos que predice la intención de voto de electores usando el dataset `voter_intentions_3000.csv`.

### Estructura

- `src/train_knn.py`: script principal de entrenamiento/evaluación.
- `src/custom_transformers.py`: imputador personalizado para `secondary_choice`.
- `artifacts/knn_voter_intentions.joblib`: paquete serializado (pipeline + LabelEncoder).
- `reports/`: métricas, matriz de confusión (`.png`/`.csv`) y reporte detallado (`.json`).
- `ml_service/`: API FastAPI dockerizable (`app.py`, `Dockerfile`, `requirements.txt`).
- `frontend/`: SPA React (Vite) junto con su `Dockerfile`.
- `notebooks/colab_template.ipynb`: plantilla lista para subir a Google Colab.
- `docker-compose.yml`: orquesta API y frontend en contenedores separados.

### Cómo entrenar el modelo

1. **Entorno Python**
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\activate
   pip install --upgrade pip
   pip install -r requirements.txt  # usa Python 3.11 para evitar builds nativos en Windows/py3.13
   ```
   > Nota: En esta máquina `pip install` falló porque Python 3.13 todavía no tiene wheels para `pydantic-core` y pandas requiere VS Build Tools. Con Anaconda o Python 3.11 el procedimiento funciona sin pasos extra.

2. **Ejecutar entrenamiento**
   ```powershell
   python src/train_knn.py
   ```
   El script:
   - Imputa variables numéricas con `IterativeImputer`+`LinearRegression`.
   - Completa `secondary_choice` usando un `RandomForestClassifier`.
   - Ajusta un pipeline `ColumnTransformer + KNeighborsClassifier` con búsqueda en malla (5xCV).
   - Guarda modelo (`artifacts/knn_voter_intentions.joblib`) y métricas (`reports/*`).

3. **Resultados clave**
   - Accuracy de referencia: 0.798
   - `reports/knn_metrics.json`: accuracy y f1 (macro/weighted).
   - `reports/knn_classification_report.json`: métricas por clase.
   - `reports/knn_confusion_matrix.png`: matriz visual.

4. **Google Colab**
   - Abre `notebooks/colab_template.ipynb` en Colab, sube `voter_intentions_3000.csv`, ejecuta todas las celdas y descarga el joblib generado para publicarlo.

### Servicio de ML

1. **Variables esperadas**: coincide con las 30 columnas numéricas + `primary_choice`/`secondary_choice`.
2. **Ejecutar local**
   ```powershell
   set PYTHONPATH=src
   uvicorn ml_service.app:app --reload --port 8000
   ```
3. **Endpoint principal**
   - `POST /predict` → JSON con el perfil del votante, responde `{ intended_vote, confidence_note }`.
   - `GET /health` → comprobación.
4. **Contenedor**
   ```powershell
   docker build -f ml_service/Dockerfile -t voter-knn-api .
   docker run -p 8000:8000 voter-knn-api
   ```

### Frontend (React + Vite)

1. **Uso local**
   ```powershell
   cd frontend
   npm install
   npm run dev  # http://localhost:4173
   ```
   Ajusta `VITE_API_URL` en `.env` si el servicio de ML vive en otra URL.

2. **Build/contenerización**
   ```powershell
   docker build -f frontend/Dockerfile -t voter-knn-frontend .
   docker run -p 4173:80 voter-knn-frontend
   ```

### Orquestación rápida

Con Docker Desktop basta con:
```powershell
docker compose up --build
```
- API: http://localhost:8000
- Frontend: http://localhost:4173 (consume la API publicada en el host)

### Procedimientos finales para ti

1. **Google Colab**: sube `notebooks/colab_template.ipynb`, ejecuta todo, publica el notebook y comparte el link público según las instrucciones del curso.
2. **Reentrenar si cambian los datos**: corre `python src/train_knn.py` y sube el nuevo `artifacts/knn_voter_intentions.joblib` al contenedor de la API.
3. **ML Service**: construye y publica la imagen `voter-knn-api` en el registry o nube que prefieras; asegúrate de exponer el puerto 8000 y de añadir health checks.
4. **Frontend**: ejecuta `npm run build`, sube la carpeta `dist/` a tu hosting preferido o usa el `frontend/Dockerfile` y enlaza la variable `VITE_API_URL` al dominio del API (p. ej. `https://midominio.com/api`).
5. **Entrega final**: levanta ambos contenedores (`docker compose up`), graba la demo para la presentación presencial y documenta las credenciales o endpoints en el aula virtual.
