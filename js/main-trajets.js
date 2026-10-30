import { initialiser } from "./store.js";
import { placesLibres, estComplet } from "./reservations.js";
import { renderTrajets } from "./render.js";

let alltrips = [];
let currentPage = 1;
const itemsPerPage = 6

    document.addEventListener('DOMContentLoaded', async () => {
        const alltrips = await initialiser();

        function afficher() {
            const totalpages = Math.ceil(alltrips.length / itemsPerPage) || 1;

            const start = (currentPage - 1) * itemsPerPage;
            const pageTrips = alltrips.slice(start, start + itemsPerPage);
            const container = document.getElementById('liste-trajets');
            if (container) {
                container.innerHTML = renderTrajets(pageTrips);
            }


        }

        afficher()
    });