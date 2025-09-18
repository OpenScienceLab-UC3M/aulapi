Aula PI – Aplicación web
========================

Descripción
-----------
Esta aplicación web es un espacio multirecurso sobre propiedad intelectual e industrial en Castilla y León, que incluye:

- Un asistente educativo (Duero) para resolver dudas y apoyar el aprendizaje.
- Un buscador de patentes y registros de universidades de Castilla y León.
- Una sección de legislación y material didáctico.

La aplicación utiliza como base de datos el conjunto de patentes y registros de universidades de Castilla y León (1990–2022), disponible en el Portal de Datos Abiertos de la Junta de Castilla y León.

Este dataset se transforma en el archivo `patentes.js` a través de un notebook de Jupyter (.ipynb) que no está incluido en este repositorio. Dicho notebook realiza la limpieza y conversión del dataset original (`patentes-limpio-v4.xlsx`) al formato JSON embebido en `patentes.js`.

Estructura de archivos
----------------------
- index.html → Página principal del Aula PI.
- asistente-educativo.html → Asistente “Duero” para apoyo educativo.
- buscador-de-propiedad-intelectual.html → Buscador interactivo de patentes y registros.
- legislacion-y-material-didactico.html → Recursos legales y materiales de formación.
- patentes.js → Conjunto de datos en formato JSON (generado a partir del dataset original mediante notebook).
- app.js → Lógica principal del buscador (búsqueda, filtros, paginación).
- script.js → Scripts comunes (navegación, menú, FAQ).
- styles.css → Estilos generales de la aplicación.
- patentes-limpio-v4.xlsx → Dataset limpio de base (input para la conversión a `patentes.js`).

Requisitos
----------
- Navegador web moderno (Chrome, Firefox, Edge, Safari).
- Conexión a Internet para cargar recursos externos (Google Fonts, Chatbase, Flourish).

Uso
---
1. Abrir `index.html` en el navegador.
2. Navegar por el menú superior para acceder a las distintas secciones:
   - Asistente educativo (interfaz conversacional).
   - Buscador de propiedad intelectual (filtros por universidad, fechas, tipos de registro).
   - Legislación y material didáctico.
3. El buscador utiliza los datos cargados en `patentes.js`.