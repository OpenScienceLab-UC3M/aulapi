document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("patentList");
    const search = document.getElementById("search");
    const universityFilter = document.getElementById("universityFilter");
    const yearFilter = document.getElementById("yearFilter");
    const typeFilter = document.getElementById("typeFilter");  // Filtro de tipo agregado

    function renderPatents(data) {
        list.innerHTML = "";

        // Mostrar los valores de los filtros en la consola para depuración
        console.log("Filtro de búsqueda: ", search.value.toLowerCase());
        console.log("Filtro de universidad: ", universityFilter.value);
        console.log("Filtro de año: ", yearFilter.value);
        console.log("Filtro de tipo: ", typeFilter.value);

        const filtered = data.filter(p => {
            const searchText = search.value.toLowerCase();
            const university = universityFilter.value;
            const year = yearFilter.value;
            const type = typeFilter.value;

            // Mostrar los valores de cada patente para depuración
            console.log("Evaluando patente:", p["Titulo de la patente"]);

            return (
                // Filtrado por búsqueda de texto
                (!searchText || Object.values(p).some(val => val?.toString().toLowerCase().includes(searchText))) &&

                // Filtrado por universidad
                (!university || (p["Universidad de origen"] || "").toLowerCase().includes(university.toLowerCase())) &&

                // Filtrado por año
                (!year || (p["Fecha de solicitud"] || "").slice(-4) === year) &&

                // Filtrado por tipo de propiedad intelectual
                (!type || (p["Tipo"] || "").toLowerCase().includes(type.toLowerCase()))
            );
        });

        // Mostrar cuántos registros se han filtrado
        console.log("Registros filtrados: ", filtered.length);

        filtered.forEach((p, index) => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <div style="display: flex; flex-wrap: wrap;"><h2>${p["Titulo de la patente"] || "Sin titulo"}</h2></div>
                <div style="display: flex; flex-wrap: wrap;"><p style="margin-right: 15px;"><strong>Resumen:</strong> ${p["Breve descripción/Resumen"] || "No disponible"}</p></div>
                <div style="display: flex; flex-wrap: wrap;"><p style="margin-right: 15px;"><strong>Palabras clave:</strong> ${p["Palabras Clave"] || "No disponible"}</p></div>
                <div style="display: flex; flex-wrap: wrap;">
                    <p style="margin-right: 15px;"><strong>Tipo:</strong> ${p["Tipo"] || "No disponible"}</p>
                    <p style="margin-right: 15px;"><strong>N° de la solicitud:</strong> ${p["Numero de referencia de la solicitud"] || "No disponible"}</p>
                    <p style="margin-right: 15px;"><strong>Fecha de solicitud:</strong> ${p["Fecha de solicitud"] || "No disponible"}</p>
                    <p style="margin-right: 15px;"><strong>Universidad:</strong> ${p["Universidad de origen"] || "No disponible"}</p>
                    <p style="margin-right: 15px;"><strong>Titular de los derechos:</strong> ${p["Titular de los derechos"] || "No disponible"}</p>
                </div>
                <p style="margin-right: 15px;"><strong>Autores:</strong> ${p["Autores"] || "No disponible"}</p>

                <button class="toggle-button" data-index="${index}">Más información</button>
                <div class="details hidden" id="details-${index}">
                    <div class="section"><strong>País de prioridad:</strong> ${p["Pais de prioridad"] || "No disponible"}</div>
                    <div class="section">
                        <strong>Áreas:</strong>
                        <table class="info-table">
                          <tr><td>Nacional</td><td>${p["Area Nacional"] || "No disponible"}</td></tr>
                          <tr><td>Europea</td><td>${p["Area Europea"] || "No disponible"}</td></tr>
                          <tr><td>PCT</td><td>${p["Area PCT"] || "No disponible"}</td></tr>
                          <tr><td>Otros</td><td>${p["Otros"] || "No disponible"}</td></tr>
                        </table>
                    </div>
                    <div class="section">
                        <strong>Estado:</strong>
                        <table class="info-table">
                          <tr><td>Denegada</td><td>${p["Denegada"] || "No disponible"}</td></tr>
                          <tr><td>Concedida</td><td>${p["Concedida"] || "No disponible"}</td></tr>
                          <tr><td>Abandonada</td><td>${p["Abandonada"] || "No disponible"}</td></tr>
                        </table>
                    </div>
                    <div class="section">
                        <strong>Planes:</strong>
                        <table class="info-table">
                          <tr><td>Estudio previo</td><td>${p["Estudio previo"] || "No disponible"}</td></tr>
                          <tr><td>Comercialización</td><td>${p["Plan de comercializacion"] || "No disponible"}</td></tr>
                          <tr><td>Negocio</td><td>${p["Plan de negocio"] || "No disponible"}</td></tr>
                        </table>
                    </div>
                </div>
            `;
            list.appendChild(card);
        });

        // Mostrar cuántos registros se han mostrado en la UI
        console.log("Registros mostrados: ", filtered.length);

        setTimeout(() => {
            document.querySelectorAll(".toggle-button").forEach(btn => {
                btn.addEventListener("click", e => {
                    const idx = e.target.getAttribute("data-index");
                    const detail = document.getElementById("details-" + idx);
                    detail.classList.toggle("hidden");
                    detail.style.display = detail.classList.contains("hidden") ? "none" : "block";
                });
            });
        }, 0);
    }

    function populateFilters(data) {
        // Filtro de universidades
        const universities = [...new Set(data.map(p => p["Universidad de origen"]))];
        universities.sort().forEach(uni => {
            const option = document.createElement("option");
            option.value = uni;
            option.textContent = uni;
            universityFilter.appendChild(option);
        });

        // Filtro de años
        const years = [...new Set(data.map(p => (p["Fecha de solicitud"] || "").slice(-4)))];
        years.sort().forEach(year => {
            if (year) {
                const option = document.createElement("option");
                option.value = year;
                option.textContent = year;
                yearFilter.appendChild(option);
            }
        });

        // Filtro de tipos de propiedad intelectual (generado dinámicamente)
        const types = [...new Set(data.map(p => p["Tipo"]))];
        types.sort().forEach(type => {
            const option = document.createElement("option");
            option.value = type;
            option.textContent = type;
            typeFilter.appendChild(option);
        });
    }

    // Función para capitalizar texto (por ejemplo, para el título)
    function capitalizeText(text) {
        if (!text || typeof text !== "string") return text;

        const exceptions = [
            "de", "del", "la", "las", "el", "los", "y", "en", "para", "por",
            "con", "a", "un", "una", "unos", "unas", "o", "u", "e", "que",
            "como", "su", "sus", "al"
        ];

        return text
            .toLocaleLowerCase("es-ES")
            .split(/\s+/)
            .map((word, i) => {
                if (i > 0 && exceptions.includes(word)) {
                    return word;
                }
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
    }

    // Normalizar los datos de las patentes
    patentes.forEach(p => {
        Object.keys(p).forEach(key => {
            if (typeof p[key] === "string") {
                p[key] = capitalizeText(p[key]);
            }
        });
    });

    // Llenar los filtros con los datos y renderizar las patentes
    populateFilters(patentes);
    renderPatents(patentes);

    // Agregar eventos para los filtros
    search.addEventListener("input", () => renderPatents(patentes));
    universityFilter.addEventListener("change", () => renderPatents(patentes));
    yearFilter.addEventListener("change", () => renderPatents(patentes));
    typeFilter.addEventListener("change", () => renderPatents(patentes));  // Filtro de tipo
});
