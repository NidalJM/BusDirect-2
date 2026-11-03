import { initialiser } from "./store.js";
import { placesLibres, estVIP, prixSiege, recetteTrajet } from "./reservations.js";

document.addEventListener('DOMContentLoaded', async () => {
    const alltrips = await initialiser();
    const urlParams = new URLSearchParams(window.location.search);
    const tripId = Number(urlParams.get("id"));
    const trip = alltrips.find(e => e.id === tripId);
    const bodyMain = document.getElementById('no-route')
    const cabinGrid = document.getElementById('cabin-grid');

    //Tabs
    const tabReserver = document.getElementById('tab-reserve');
    const tabEdit = document.getElementById('tab-edit');
    const tabCancel = document.getElementById('tab-cancel');

    const passengerTableBody = document.getElementById('passenger-table-body');

    //Forms

    const formReserver = document.getElementById('form-reserve');
    const formEdit = document.getElementById('form-edit');
    const formCancel = document.getElementById('form-cancel');

    //Inputs

    const reserveName = document.getElementById('reserve-name');
    const reserveSeat = document.getElementById('reserve-seat');

    const editPassenger = document.getElementById('edit-passenger');
    const editName = document.getElementById('edit-name');
    const editSeat = document.getElementById('edit-seat');

    const cancelPassenger = document.getElementById('cancel-passenger');

    //Toasts
    const ptoast = document.getElementById('toast1');
    const ptoast2 = document.getElementById('toast2');
    const ptoast3 = document.getElementById('toast3');

    //Stats
    const countFree = document.getElementById('count-free');
    const countRevenue = document.getElementById('count-revenue');

    if (!trip) {
        bodyMain.innerHTML = `
        <div class="flex h-screen justify-center items-center"><p class="p-4 border-2 rounded-2xl font-bold">No route founded</p></div>
        `
        return
    }

    function updateStats() {
        if (countFree) { countFree.textContent = placesLibres(trip) }
        if (countRevenue) { countRevenue.textContent = recetteTrajet(trip) }
    }
    updateStats()

    function renderCabin() {
        // if (!renderCabin) return;

        cabinGrid.innerHTML = ``;



        for (let i = 1; i <= 20; i++) {
            const seatNum = i;
            const reservations = trip.reservations.find(r => Number(r.seat) === seatNum)
            const seatCard = document.createElement('div');

            if (reservations) {
                seatCard.className = "bg-brand-black text-white border border-brand-border rounded-xl p-1.5 sm:p-3 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-brand-black transition-all shadow-sm";
                seatCard.innerHTML = `
                    <i class="fa-solid fa-user text-lg"></i>
                    <span class="text-xs font-bold">Siège ${seatNum}</span>
                    <span class="bg-white/20 text-[10px] font-semibold px-2 py-0.5 rounded-full truncate max-w-[70px]">${reservations.name}</span>
                `;
            } else  {

                seatCard.className = "bg-brand-black text-white border border-brand-border rounded-xl p-1.5 sm:p-3 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-brand-black transition-all shadow-sm";
            seatCard.setAttribute('data-seat', seatNum);
            seatCard.innerHTML = `
        <i class="fa-solid fa-user text-lg"></i>
         <span class="text-xs font-bold">Siège ${seatNum}</span>
        <span class="bg-white/20 text-[10px] font-semibold px-2 py-0.5 rounded-full truncate max-w-[70px]"></span>
        `;
            }
            cabinGrid.appendChild(seatCard)
            if (i % 4 === 2) {
                const aisleSpacer = document.createElement('div');
                cabinGrid.appendChild(aisleSpacer)
            }

        }
    }
    renderCabin()
})