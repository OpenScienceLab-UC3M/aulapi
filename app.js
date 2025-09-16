document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("patentList");
    const search = document.getElementById("search");
    const universityFilter = document.getElementById("universityFilter");
    const startDate = document.getElementById("startDate");
    const endDate = document.getElementById("endDate");
    const typeFilter = document.getElementById("typeFilter");
    const pagination = document.getElementById("pagination");

    let currentPage = 1;
    const itemsPerPage = 10;

    function renderPagination(totalPages, data) {
        pagination.innerHTML = "";

        function createLink(label, page, isActive = false, disabled = false) {
            const link = document.createElement("span");
            link.textContent = label;
            link.className = "page-link";
            if (isActive) link.classList.add("active");
            if (!disabled) {
                link.addEventListener("click", () => {
                    currentPage = page;
                    renderPatents(data);
                });
            } else {
                link.classList.add("disabled");
            }
            pagination.appendChild(link);
        }

        // Botón "Anterior"
        if (currentPage > 1) {
            createLink("Anterior", currentPage - 1);
        } else {
            createLink("Anterior", null, false, true);
        }

        // Mostrar la primera página solo si está más lejos de la página actual
        if (currentPage > 3) {
            createLink("1", 1);
            createLink("...", null, false, true);
        } else if (currentPage === 3) {
            createLink("1", 1);
        }

        // Mostrar las páginas cercanas: página anterior, actual, y página siguiente
        if (currentPage > 1) createLink(currentPage - 1, currentPage - 1);
        createLink(currentPage, currentPage, true);
        if (currentPage < totalPages) createLink(currentPage + 1, currentPage + 1);

        // Mostrar la última página solo si está más de una página después de la actual
        if (currentPage < totalPages - 2) {
            createLink("...", null, false, true);
            createLink(totalPages, totalPages);
        } else if (currentPage === totalPages - 2) {
            createLink(totalPages, totalPages);
        }

        // Botón "Siguiente"
        if (currentPage < totalPages) {
            createLink("Siguiente", currentPage + 1);
        } else {
            createLink("Siguiente", null, false, true);
        }
    }

    function renderPatents(data) {
        list.innerHTML = "";
        pagination.innerHTML = "";

        const filtered = data.filter(p => {
            const searchText = search.value.toLowerCase();
            const university = universityFilter.value;
            const type = typeFilter.value;

            let fechaValida = true;
            const fechaStr = p["Fecha de solicitud"];
            if (fechaStr) {
                const partes = fechaStr.split("/");
                if (partes.length === 3) {
                    const [dia, mes, anio] = partes;
                    const fechaObj = new Date(`${anio}-${mes}-${dia}`);
                    if (!isNaN(fechaObj)) {
                        const start = startDate.value ? new Date(startDate.value) : new Date("1990-01-01");
                        const end = endDate.value ? new Date(endDate.value) : new Date("2022-12-31");
                        fechaValida = (fechaObj >= start && fechaObj <= end);
                    }
                }
            }

            return (
                (!searchText || Object.values(p).some(val => val?.toString().toLowerCase().includes(searchText))) &&
                (!university || (p["Universidad de origen"] || "").toLowerCase().includes(university.toLowerCase())) &&
                fechaValida &&
                (!type || (p["Tipo"] || "").toLowerCase().includes(type.toLowerCase()))
            );
        });

        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        if (currentPage > totalPages) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const itemsToShow = filtered.slice(startIndex, endIndex);

        itemsToShow.forEach((p, index) => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <div class="resultado">
                    <h2>${p["Titulo de la patente"] || "Sin titulo"}</h2>
                    
                    <p><strong>Resumen:</strong> ${p["Breve descripción/Resumen"] || "No disponible"}</p>
                    
                    <p><strong>Palabras clave:</strong> ${p["Palabras Clave"] || "No disponible"}</p>
                    
                    <div class="flex">
                        <p><strong>Tipo:</strong> ${p["Tipo"] || "No disponible"}</p>
                        <p><strong>N° de la solicitud:</strong> ${p["Numero de referencia de la solicitud"] || "No disponible"}</p>
                        <p><strong>Fecha de solicitud:</strong> ${p["Fecha de solicitud"] || "No disponible"}</p>
                        <p><strong>Universidad:</strong> ${p["Universidad de origen"] || "No disponible"}</p>
                        <p><strong>Titular de los derechos:</strong> ${p["Titular de los derechos"] || "No disponible"}</p>
                    </div>
                    
                    <p><strong>Autores:</strong> ${p["Autores"] || "No disponible"}</p>

                    <button class="toggle-button" data-index="${index}">Más información</button>

                    <div class="details hidden" id="details-${index}">
                        <div class="section">
                            <strong>País de prioridad:</strong> ${p["Pais de prioridad"] || "No disponible"}
                        </div>
                        
                        <div class="section">
                            <strong>Áreas:</strong>
                            <table class="info-table">
                                <tr>
                                    <td>Nacional</td>
                                    <td>${p["Area Nacional"] || "No disponible"}</td>
                                </tr>
                                <tr>
                                    <td>Europea</td>
                                    <td>${p["Area Europea"] || "No disponible"}</td>
                                </tr>
                                <tr>
                                    <td>PCT</td>
                                    <td>${p["Area PCT"] || "No disponible"}</td>
                                </tr>
                                <tr>
                                    <td>Otros</td>
                                    <td>${p["Otros"] || "No disponible"}</td>
                                </tr>
                            </table>
                        </div>

                        <div class="section">
                            <strong>Estado:</strong>
                            <table class="info-table">
                                <tr>
                                    <td>Denegada</td>
                                    <td>${p["Denegada"] || "No disponible"}</td>
                                </tr>
                                <tr>
                                    <td>Concedida</td>
                                    <td>${p["Concedida"] || "No disponible"}</td>
                                </tr>
                                <tr>
                                    <td>Abandonada</td>
                                    <td>${p["Abandonada"] || "No disponible"}</td>
                                </tr>
                            </table>
                        </div>

                        <div class="section">
                            <strong>Planes:</strong>
                            <table class="info-table">
                                <tr>
                                    <td>Estudio previo</td>
                                    <td>${p["Estudio previo"] || "No disponible"}</td>
                                </tr>
                                <tr>
                                    <td>Comercialización</td>
                                    <td>${p["Plan de comercializacion"] || "No disponible"}</td>
                                </tr>
                                <tr>
                                    <td>Negocio</td>
                                    <td>${p["Plan de negocio"] || "No disponible"}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            list.appendChild(card);
        });

        if (totalPages > 1) {
            renderPagination(totalPages, data);
        }

        // Botones de toggle detalles
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
        const exceptions = [
            "de","del","la","las","el","los","y","en","para","por","con","a",
            "un","una","unos","unas","o","u","e","que","como","su","sus","al"
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

    patentes.forEach(p => {
        Object.keys(p).forEach(key => {
            if (typeof p[key] === "string") {
                p[key] = capitalizeText(p[key]);
            }
        });
    });

    populateFilters(patentes);
    renderPatents(patentes);

    // Resetear a página 1 al aplicar filtros
    search.addEventListener("input", () => { currentPage = 1; renderPatents(patentes); });
    universityFilter.addEventListener("change", () => { currentPage = 1; renderPatents(patentes); });
    startDate.addEventListener("change", () => { currentPage = 1; renderPatents(patentes); });
    endDate.addEventListener("change", () => { currentPage = 1; renderPatents(patentes); });
    typeFilter.addEventListener("change", () => { currentPage = 1; renderPatents(patentes); });
});
