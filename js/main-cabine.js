import { initialiser, sauvegarder } from "./store.js";
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
    const cityStats = document.getElementById('city-stats');
    const countFree = document.getElementById('count-free');
    const countRevenue = document.getElementById('count-revenue');

    //List
    const listAttente = document.getElementById('attente-table-body')

    if (!trip) {
        bodyMain.innerHTML = `
        <div class="flex h-screen justify-center items-center"><p class="p-4 border-2 rounded-2xl font-bold">No route founded</p></div>
        `
        return
    }

    function updateStats() {
        if (countFree) { countFree.textContent = placesLibres(trip) }
        if (countRevenue) { countRevenue.textContent = recetteTrajet(trip) }
        if (cityStats) { cityStats.textContent = `${trip.departure} ➔ ${trip.destination}` }
    }
    updateStats()

    function renderCabin() {
        // if (!renderCabin) return;

        cabinGrid.innerHTML = ``;
        passengerTableBody.innerHTML = ``;
        if (listAttente) listAttente.innerHTML = ``;
        editPassenger.innerHTML = `<option value="">Sélectionner un passager</option>`;
        cancelPassenger.innerHTML = `<option value="">Sélectionner une réservation</option>`


        for (let i = 1; i <= 20; i++) {
            const seatNum = i;
            const isVip = estVIP(seatNum)
            const reservations = trip.reservations.find(r => Number(r.seat) === seatNum)
            const seatCard = document.createElement('div');

            if (reservations) {

                seatCard.className = isVip ? "bg-purple-300 text-black border-2 border-pink-900 rounded-xl p-1.5 sm:p-3 flex flex-col items-center justify-center gap-1 cursor-pointer shadow-sm"
                    : "bg-brand-black text-white border border-brand-border rounded-xl p-1.5 sm:p-3 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-brand-black transition-all shadow-sm";
                // "bg-brand-black text-white border border-brand-border rounded-xl p-1.5 sm:p-3 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-brand-black transition-all shadow-sm";
                seatCard.setAttribute('data-seat', seatNum);
                seatCard.setAttribute('data-occupied', 'true');
                seatCard.innerHTML = `
                    <i class="fa-solid fa-user text-lg"></i>
                    <span class="text-xs font-bold">Siège ${seatNum}</span>
                    <span class="bg-white/20 text-[10px] font-semibold px-2 py-0.5 rounded-full truncate max-w-[70px]">${reservations.name}</span>
                `;

                const editOpt = document.createElement('option');
                editOpt.value = seatNum;
                editOpt.textContent = `${reservations.name} (Siege ${seatNum})`;
                editPassenger.appendChild(editOpt);

                const cancelOpt = document.createElement('option');
                cancelOpt.value = seatNum;
                cancelOpt.textContent = `${reservations.name} (Siege ${seatNum})`;
                cancelPassenger.appendChild(cancelOpt);

                const tr = document.createElement('tr');
                tr.setAttribute('data-passenger-seat', seatNum);
                tr.innerHTML = `
                         <td class="px-4 py-2.5 rounded-l-lg">${reservations.name}</td>
                         <td class="px-4 py-2.5">Siège ${seatNum}</td>
                         <td class="px-4 py-2.5">${prixSiege(trip.price, seatNum)} DH </td>
        `;
                passengerTableBody.prepend(tr)
            } else {
                seatCard.className = isVip
                    ? "bg-purple-300 text-black border-2 border-pink-900 rounded-xl p-1.5 sm:p-3 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-amber-600 transition-all shadow-sm"
                    : "bg-white text-black border border-brand-border rounded-xl p-1.5 sm:p-3 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-brand-black transition-all shadow-sm";
                // seatCard.className = "bg-white text-black border border-brand-border rounded-xl p-1.5 sm:p-3 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-brand-black transition-all shadow-sm";
                seatCard.setAttribute('data-seat', seatNum);
                seatCard.setAttribute('data-occupied', 'false');
                seatCard.innerHTML = `
        <i class="fa-solid fa-chair text-lg"></i>
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
        if (listAttente && trip.waitingList) {
            trip.waitingList.forEach(e => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td class="px-4 py-2.5">${e.name}</td>`
                listAttente.appendChild(tr);
            })

        }

    }
    renderCabin()
    updateStats();

    for (let i = 1; i <= 20; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Siège ${i}`;
        reserveSeat.appendChild(option);
    }

    for (let i = 1; i <= 20; i++) {
        const optionEdit = document.createElement('option');
        optionEdit.value = i;
        optionEdit.textContent = `Siège ${i}`;
        editSeat.appendChild(optionEdit);
    }

    function hideForms() {
        formReserver.classList.add('hidden');
        formEdit.classList.add('hidden');
        formCancel.classList.add('hidden');

        [tabReserver, tabEdit, tabCancel].forEach(tab => {
            tab.className = "flex-1 py-2 text-sm font-medium rounded-full text-brand-body transition-all"
        });
    }

    tabReserver.addEventListener('click', () => {
        hideForms();
        formReserver.classList.remove('hidden');
        tabReserver.className = "flex-1 py-2 text-sm font-medium rounded-full bg-brand-black text-white transition-all"
    })

    tabEdit.addEventListener('click', () => {
        hideForms();
        formEdit.classList.remove('hidden');
        tabEdit.className = "flex-1 py-2 text-sm font-medium rounded-full bg-brand-black text-white transition-all"
    })

    tabCancel.addEventListener('click', () => {
        hideForms();
        formCancel.classList.remove('hidden');
        tabCancel.className = "flex-1 py-2 text-sm font-medium rounded-full bg-brand-black text-white transition-all"
    })

    editPassenger.addEventListener('change', () => {
        const seatId = editPassenger.value;
        if (!seatId) {
            editName.value = '';
            return;
        }
        const seatCard = document.querySelector(`[data-seat="${seatId}"]`);
        if (seatCard) {
            const nameSpan = seatCard.querySelector('span:nth-child(3)');
            if (nameSpan) {
                editName.value = nameSpan.textContent;
            }
        }
    });


    formReserver.addEventListener('submit', (e) => {
        e.preventDefault();

        const passengerName = reserveName.value.trim();
        let selectedSeatId = reserveSeat.value;
        let seatCard = document.querySelector(`[data-seat="${selectedSeatId}"]`);

        if (!passengerName) {
            ptoast.textContent = "Veuiller entrer le nom du passager.";
            setTimeout(() => {
                ptoast.textContent = "";
            }, 3000);
            // alert("Veuillez entrer le nom du passager.");
            return;
        }

        if (placesLibres(trip) === 0) {
            if (!trip.waitingList) trip.waitingList = [];

            trip.waitingList.push({ name: passengerName, phone: "" });
            sauvegarder(alltrips);
            renderCabin();

            ptoast.textContent = "Bus Complet. Passager ajoute a la liste d'attente"
            setTimeout(() => {
                ptoast.textContent = "";
            }, 3000);
            formReserver.reset();
            return;

        }

        if (selectedSeatId === "") {
            seatCard = document.querySelector('[data-occupied="false"]');
            selectedSeatId = seatCard.getAttribute('data-seat');
        }

        if (seatCard.getAttribute('data-occupied') === "true") {
            ptoast.textContent = "Seat Already Reserved"
            setTimeout(() => {
                ptoast.textContent = "";
            }, 3000);
            // alert("Seat Already Reserved");
            return;
        }


        if (seatCard) {
            seatCard.className = "bg-brand-black text-white rounded-xl p-1.5 sm:p-3 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all shadow-sm";
            seatCard.setAttribute('data-occupied', 'true');
            seatCard.innerHTML = `
                <i class="fa-solid fa-user text-lg"></i>
                <span class="text-xs font-bold">Siège ${selectedSeatId}</span>
                <span class="bg-white/20 text-[10px] font-semibold px-2 py-0.5 rounded-full truncate max-w-[70px]">${passengerName}</span>
            `;
            // localStorage.setItem(`seat_${selectedSeatId}`, passengerName)
            const newReservation = {
                seat: selectedSeatId,
                name: passengerName,
                phone: ""
            }
            trip.reservations = [...trip.reservations, newReservation];
            sauvegarder(alltrips);
            renderCabin();

            // const option = document.createElement('option');
            // option.value = selectedSeatId;
            // option.textContent = `${passengerName} (Siège ${selectedSeatId})`;
            // editPassenger.appendChild(option);

            // const tr = document.createElement('tr');
            // tr.setAttribute('data-passenger-seat', selectedSeatId);
            // tr.innerHTML = `
            //     <td class="px-4 py-2.5 rounded-l-lg">${passengerName}</td>
            //     <td class="px-4 py-2.5">Siège ${selectedSeatId}</td>
            //     <td class="px-4 py-2.5">80 DH </td>
            // `;
            // passengerTableBody.prepend(tr);

            // const cancelOption = document.createElement('option');
            // cancelOption.value = selectedSeatId;
            // cancelOption.textContent = `${passengerName} (Siege) ${selectedSeatId}`
            // cancelPassenger.appendChild(cancelOption);

        }
        ptoast.textContent = "Seat Reserved Successfully"
        setTimeout(() => {
            ptoast.textContent = "";
        }, 3000);
        formReserver.reset();
        updateStats();

    });



    formEdit.addEventListener('submit', (e) => {
        e.preventDefault();

        const oldSeatId = editPassenger.value;
        const newName = editName.value.trim();
        const newSeatId = editSeat.value;
        let targetSeatId = oldSeatId;

        if (newSeatId !== "" && newSeatId !== oldSeatId) {
            const newSeatCard = document.querySelector(`[data-seat="${newSeatId}"]`);

            if (newSeatCard.getAttribute('data-occupied') === "true") {
                ptoast2.textContent = "Seat Already occupied"
                setTimeout(() => {
                    ptoast2.textContent = "";
                }, 3000);
                formEdit.reset();
                return;
            }

            // const oldSeatCard = document.querySelector(`[data-seat="${oldSeatId}"]`);
            // oldSeatCard.className = "bg-white border border-brand-border rounded-xl p-1.5 sm:p-3 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-brand-black transition-all shadow-sm";
            // oldSeatCard.setAttribute('data-occupied', 'false');
            // oldSeatCard.innerHTML = `
            //     <i class="fa-solid fa-chair text-brand-body text-lg"></i>
            //     <span class="text-xs font-bold">Siège ${oldSeatId}</span>
            //     <span class="bg-brand-soft text-[10px] font-semibold text-brand-body px-2 py-0.5 rounded-full">Libre</span>
            // `;

            targetSeatId = newSeatId;

        }
        const reservation = trip.reservations.find(r => Number(r.seat) === Number(oldSeatId));
        if (reservation) {
            reservation.name = newName;
            reservation.seat = Number(targetSeatId);
        }
        sauvegarder(alltrips)
        renderCabin()

        ptoast2.textContent = "Seat Edited Successfully"
        setTimeout(() => {
            ptoast2.textContent = "";
        }, 3000);

        formEdit.reset();
    });


    formCancel.addEventListener('submit', (e) => {
        e.preventDefault();

        const deleteSeatId = Number(cancelPassenger.value);

        // if (!deleteSeatId){

        // }

        trip.reservations = trip.reservations.filter(r => Number(r.seat) !== deleteSeatId)

        sauvegarder(alltrips)
        renderCabin()
        ptoast3.textContent = "Seat Deleted Successfully"
        setTimeout(() => {
            ptoast3.textContent = "";
        }, 3000);
        formCancel.reset();
    });


});


