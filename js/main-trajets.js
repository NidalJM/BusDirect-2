import { initialiser } from "./store.js";
import { placesLibres, estComplet } from "./reservations.js";
import { renderTrajets } from "./render.js";

let alltrips = [];
let currentPage = 1;
const itemsPerPage = 6


document.addEventListener('DOMContentLoaded', async () => {
    const alltrips = await initialiser();
    const totalpages = Math.ceil(alltrips.length / itemsPerPage) || 1;
    function afficher() {

        const start = (currentPage - 1) * itemsPerPage;
        const pageTrips = alltrips.slice(start, start + itemsPerPage);
        const container = document.getElementById('liste-trajets');
        if (container) {
            container.innerHTML = renderTrajets(pageTrips);
        }
        const pageCounter = document.getElementById('page-info');
        pageCounter.textContent = `Page ${currentPage} sur ${totalpages}`
    }

    afficher()

    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');


    btnNext.addEventListener('click', () => {
        if (currentPage === totalpages) {
            btnNext.disabled = true;

        }
        if (currentPage !== totalpages) {
        currentPage += 1;
        btnPrev.disabled = false;
        afficher();
        }

        
    })

    if (currentPage === 1) {
        btnPrev.disabled = true;
    }

    btnPrev.addEventListener('click', () => {

        // return
        if (currentPage !== 1) {
            currentPage -= 1;
            btnNext.disabled = false;
            afficher();
        }

    })
});
