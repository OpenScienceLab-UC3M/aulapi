document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("patentList");
    const search = document.getElementById("search");
    const universityFilter = document.getElementById("universityFilter");
    const startDate = document.getElementById("startDate");
    const endDate = document.getElementById("endDate");
    const typeFilter = document.getElementById("typeFilter");  // Filtro de tipo agregado

    function renderPatents(data) {
        list.innerHTML = "";

        // Mostrar los valores de los filtros en la consola para depuración
        console.log("Filtro de búsqueda: ", search.value.toLowerCase());
        console.log("Filtro de universidad: ", universityFilter.value);
        console.log("Fecha inicio: ", startDate.value);
        console.log("Fecha fin: ", endDate.value);
        console.log("Filtro de tipo: ", typeFilter.value);

        const filtered = data.filter(p => {
            const searchText = search.value.toLowerCase();
            const university = universityFilter.value;
            const type = typeFilter.value;

            // Filtrado por rango de fechas
            let fechaValida = false;
            const fechaStr = p["Fecha de solicitud"];
            if (fechaStr) {
                const [dia, mes, anio] = fechaStr.split("/"); // formato DD/MM/YYYY
                const fechaObj = new Date(`${anio}-${mes}-${dia}`);
                const start = startDate.value ? new Date(startDate.value) : new Date("1990-01-01");
                const end = endDate.value ? new Date(endDate.value) : new Date("2022-12-31");
                fechaValida = (fechaObj >= start && fechaObj <= end);
            }

            return (
                // Filtrado por búsqueda de texto
                (!searchText || Object.values(p).some(val => val?.toString().toLowerCase().includes(searchText))) &&

                // Filtrado por universidad
                (!university || (p["Universidad de origen"] || "").toLowerCase().includes(university.toLowerCase())) &&

                // Filtrado por fecha
                fechaValida &&

                // Filtrado por tipo de propiedad intelectual
                (!type || (p["Tipo"] || "").toLowerCase().includes(type.toLowerCase()))
            );
        });

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
        const universities = [...new Set(data.map(p => p["Universidad de origen"]))];
        universities.sort().forEach(uni => {
            const option = document.createElement("option");
            option.value = uni;
            option.textContent = uni;
            universityFilter.appendChild(option);
        });

        // Quitamos el llenado de años porque ahora usamos fechas

        const types = [...new Set(data.map(p => p["Tipo"]))];
        types.sort().forEach(type => {
            const option = document.createElement("option");
            option.value = type;
            option.textContent = type;
            typeFilter.appendChild(option);
        });
    }

    function capitalizeText(text) {
        if (!text || typeof text !== "string") return text;
        const exceptions = ["de","del","la","las","el","los","y","en","para","por","con","a","un","una","unos","unas","o","u","e","que","como","su","sus","al"];
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

    patentes.forEach(p => {
        Object.keys(p).forEach(key => {
            if (typeof p[key] === "string") {
                p[key] = capitalizeText(p[key]);
            }
        });
    });

    populateFilters(patentes);
    renderPatents(patentes);

    search.addEventListener("input", () => renderPatents(patentes));
    universityFilter.addEventListener("change", () => renderPatents(patentes));
    startDate.addEventListener("change", () => renderPatents(patentes));
    endDate.addEventListener("change", () => renderPatents(patentes));
    typeFilter.addEventListener("change", () => renderPatents(patentes));  // Filtro de tipo
});
