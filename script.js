const menuIcon = document.getElementById('menu-icon');
const navLinks = document.querySelector('.nav-links');

menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll(".faq-question").forEach(button => {
  button.addEventListener("click", () => {
    const faqItem = button.parentElement;

    // Cierra los demás
    document.querySelectorAll(".faq-item").forEach(item => {
      if (item !== faqItem) item.classList.remove("active");
    });

    // Alterna este
    faqItem.classList.toggle("active");

    // Ajusta altura del contenido
    const answer = button.nextElementSibling;
    if (faqItem.classList.contains("active")) {
      answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
      answer.style.maxHeight = null;
    }
  });
});
