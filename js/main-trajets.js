import { initialiser } from "./store.js";
import { placesLibres, estComplet } from "./reservations.js";
import { renderTrajets } from "./render.js";

let alltrips = [];
let filteredTrips = []
let currentPage = 1;
const itemsPerPage = 6
let totalpages = 1

document.addEventListener('DOMContentLoaded', async () => {
    alltrips = await initialiser();
    filteredTrips = [...alltrips];
    // const totalpages = Math.ceil(filteredTrips.length / itemsPerPage) || 1;
    const searchInput = document.getElementById('site-search');
    const filterInput = document.getElementById('site-filter');

    function handleTrips(e) {

        const city = searchInput.value.toLocaleLowerCase().trim();
        const filter = filterInput.value;

        filteredTrips = alltrips.filter((trips) => {
            const matchCity = trips.departure.toLowerCase().includes(city) || trips.destination.toLowerCase().includes(city);

            let matchFilter = false;
            if (filter === "tous") { matchFilter = true; }
            else if (filter === "disponible") { matchFilter = trips.capacity > trips.reservations.length; }
            else if (filter === "complet") { matchFilter = trips.capacity === trips.reservations.length }
            return matchCity && matchFilter;
        })
        currentPage = 1;
        afficher();
    }

    function afficher() {

        totalpages = Math.ceil(filteredTrips.length / itemsPerPage) || 1;
        const start = (currentPage - 1) * itemsPerPage;
        const container = document.getElementById('liste-trajets');
        const pageCounter = document.getElementById('page-info');
        if (filteredTrips.length === 0) {
            if (container)  {
                container.innerHTML = `<div class = "col-span-full text-center">
                    No trip matches
                </div>`

                pageCounter.textContent = `No route available`
            }
            return
        }
        const pageTrips = filteredTrips.slice(start, start + itemsPerPage);

        if (container) {
            container.innerHTML = renderTrajets(pageTrips);
        }
        
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


    // console.log(alltrips);
    searchInput.addEventListener('input', handleTrips);
    filterInput.addEventListener('change', handleTrips);
});
