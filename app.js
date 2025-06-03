
document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("patentList");
    const search = document.getElementById("search");
    const universityFilter = document.getElementById("universityFilter");
    const yearFilter = document.getElementById("yearFilter");

    function renderPatents(data) {
        list.innerHTML = "";
        const filtered = data.filter(p => {
            const searchText = search.value.toLowerCase();
            const university = universityFilter.value;
            const year = yearFilter.value;
            return (
                (!university || p["Universidad de Origen:"].includes(university)) &&
                (!year || p["Año solicitud:"].toString() === year) &&
                Object.values(p).some(val => val?.toString().toLowerCase().includes(searchText))
            );
        });

        filtered.forEach((p, index) => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <h2>${p["Título:"]}</h2>
                <p><strong>Universidad:</strong> ${p["Universidad de Origen:"]}</p>
                <p><strong>Año:</strong> ${p["Año solicitud:"]}</p>
                <p><strong>Palabras clave:</strong> ${p["Palabras Clave:"]}</p>
                <p><strong>Número de referencia:</strong> ${p["Nº referencia de la solicitud:"]}</p>
                <button class="toggle-button" data-index="${index}">Ver materiales educativos</button>
                <div class="details hidden" id="details-${index}">
                    <div class="section"><strong>📘 Resumen educativo:</strong><br>${p["Breve Descripción/Resumen:"] || "Resumen no disponible."}</div>
                    <div class="section"><strong>📚 Aplicaciones:</strong><br>${p["Posible aplicación industrial:"] || "No especificadas."}</div>
                    <div class="section"><strong>📑 Ficha didáctica:</strong><br>
                        <em>Nivel sugerido:</em> Bachillerato / FP<br>
                        <em>Competencias:</em> Innovación, Ciencia aplicada, Pensamiento crítico<br>
                        <em>Objetivos:</em> Comprender el funcionamiento e impacto de la innovación presentada
                    </div>
                    <div class="section"><strong>📚 Glosario técnico:</strong><br>
                        - <b>Innovación:</b> Proceso de crear o mejorar un producto o idea.<br>
                        - <b>Patente:</b> Derecho que protege una invención para su uso exclusivo.<br>
                        - <b>Aplicación industrial:</b> Uso práctico de una tecnología en un sector productivo.
                    </div>
                    <div class="section"><strong>❓ Test de comprensión:</strong><br>
                        <p>¿Cuál es el objetivo principal de esta invención?</p>
                        <form id="quiz-${index}">
                            <label><input type="radio" name="q${index}" value="a"> a) Mejorar la docencia</label><br>
                            <label><input type="radio" name="q${index}" value="b"> b) Aplicar tecnología a un problema concreto</label><br>
                            <label><input type="radio" name="q${index}" value="c"> c) Reforzar leyes de propiedad intelectual</label><br>
                            <label><input type="radio" name="q${index}" value="d"> d) Ninguna de las anteriores</label><br>
                            <button type="submit">Comprobar respuesta</button>
                            <p id="result-${index}" class="quiz-result"></p>
                        </form>
                    </div>
                    <div class="section"><strong>🧭 Guía de vigilancia tecnológica:</strong><br>
                        - Buscar patentes similares en Espacenet o Google Patents.<br>
                        - Investigar empresas del sector vinculado.<br>
                        - Observar tendencias emergentes relacionadas con la invención.
                    </div>
                </div>
            `;
            list.appendChild(card);
        });

        setTimeout(() => {
            document.querySelectorAll(".toggle-button").forEach(btn => {
                btn.addEventListener("click", e => {
                    const idx = e.target.getAttribute("data-index");
                    const detail = document.getElementById("details-" + idx);
                    detail.classList.toggle("hidden");
                    detail.style.display = detail.classList.contains("hidden") ? "none" : "block";
                });
            });

            document.querySelectorAll("form[id^='quiz-']").forEach(form => {
                form.addEventListener("submit", e => {
                    e.preventDefault();
                    const index = form.id.split("-")[1];
                    const selected = form.querySelector("input[name='q" + index + "']:checked");
                    const result = document.getElementById("result-" + index);
                    if (!selected) {
                        result.textContent = "Por favor, selecciona una opción.";
                        result.style.color = "orange";
                    } else if (selected.value === "b") {
                        result.textContent = "✅ ¡Correcto!";
                        result.style.color = "green";
                    } else {
                        result.textContent = "❌ Incorrecto. La opción correcta es la b.";
                        result.style.color = "red";
                    }
                });
            });
        }, 0);
    }

    function populateFilters(data) {
        const universities = [...new Set(data.map(p => p["Universidad de Origen:"]))];
        universities.sort().forEach(uni => {
            const option = document.createElement("option");
            option.value = uni;
            option.textContent = uni;
            universityFilter.appendChild(option);
        });

        const years = [...new Set(data.map(p => p["Año solicitud:"]))];
        years.sort().forEach(year => {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
    }

    search.addEventListener("input", () => renderPatents(patentes));
    universityFilter.addEventListener("change", () => renderPatents(patentes));
    yearFilter.addEventListener("change", () => renderPatents(patentes));

    populateFilters(patentes);
    renderPatents(patentes);
});
