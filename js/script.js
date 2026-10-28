document.addEventListener('DOMContentLoaded', () => {
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

    function updateStats() {
        const occupiedCount = document.querySelectorAll('[data-occupied="true"]').length;
        const freeSeats = 20 - occupiedCount;

        if (countFree) countFree.textContent = freeSeats;
        if (countRevenue) countRevenue.textContent = occupiedCount * 80;
    }
    // if (!cabinGrid) return;

    for (let i = 1; i <= 20; i++) {
        const seatNum = i;
        const savedName = localStorage.getItem(`seat_${seatNum}`);
        const seatCard = document.createElement('div');

        seatCard.setAttribute('data-seat', seatNum);
        if (savedName) {
            seatCard.className = "bg-brand-black text-white border border-brand-border rounded-xl p-1.5 sm:p-3 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-brand-black transition-all shadow-sm";

            seatCard.setAttribute('data-occupied', 'true');
            seatCard.innerHTML = `
        <i class="fa-solid fa-user text-lg"></i>
         <span class="text-xs font-bold">Siège ${seatNum}</span>
        <span class="bg-white/20 text-[10px] font-semibold px-2 py-0.5 rounded-full truncate max-w-[70px]">${savedName}</span>
        `;
            const editOpt = document.createElement('option');
            editOpt.value = seatNum;
            editOpt.textContent = `${savedName} (Siege ${seatNum})`;
            editPassenger.appendChild(editOpt);

            const cancelOpt = document.createElement('option');
            cancelOpt.value = seatNum;
            cancelOpt.textContent = `${savedName} (Siege ${seatNum})`;
            cancelPassenger.appendChild(cancelOpt);

            const tr = document.createElement('tr');
            tr.setAttribute('data-passenger-seat', seatNum);
            tr.innerHTML = `
                         <td class="px-4 py-2.5 rounded-l-lg">${savedName}</td>
                         <td class="px-4 py-2.5">Siège ${seatNum}</td>
                         <td class="px-4 py-2.5">80 DH </td>
        `;
            passengerTableBody.prepend(tr);
        } else {
            seatCard.className = "bg-white border border-brand-border rounded-xl p-1.5 sm:p-3 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-brand-black transition-all shadow-sm";
            seatCard.setAttribute('data-occupied', 'false');
            seatCard.innerHTML = `
                <i class="fa-solid fa-chair text-brand-body text-lg"></i>
                <span class="text-xs font-bold">Siège ${seatNum}</span>
                <span class="bg-brand-soft text-[10px] font-semibold text-brand-body px-2 py-0.5 rounded-full">Libre</span>
            `;
        }

        cabinGrid.appendChild(seatCard);
        if (i % 4 === 2) {
            const aisleSpacer = document.createElement('div');
            cabinGrid.appendChild(aisleSpacer);
        }

    }
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
            tab.className = "flex-1 py-2 text-sm font-medium rounded-full text-brand-body transition-all";
        });
    }

    tabReserver.addEventListener('click', () => {
        hideForms();
        formReserver.classList.remove('hidden');
        tabReserver.className = "flex-1 py-2 text-sm font-medium rounded-full bg-brand-black text-white transition-all";
    });

    tabEdit.addEventListener('click', () => {
        hideForms();
        formEdit.classList.remove('hidden');
        tabEdit.className = "flex-1 py-2 text-sm font-medium rounded-full bg-brand-black text-white transition-all";
    });

    tabCancel.addEventListener('click', () => {
        hideForms();
        formCancel.classList.remove('hidden');
        tabCancel.className = "flex-1 py-2 text-sm font-medium rounded-full bg-brand-black text-white transition-all";
    });


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
            localStorage.setItem(`seat_${selectedSeatId}`, passengerName)

            const option = document.createElement('option');
            option.value = selectedSeatId;
            option.textContent = `${passengerName} (Siège ${selectedSeatId})`;
            editPassenger.appendChild(option);

            const tr = document.createElement('tr');
            tr.setAttribute('data-passenger-seat', selectedSeatId);
            tr.innerHTML = `
                <td class="px-4 py-2.5 rounded-l-lg">${passengerName}</td>
                <td class="px-4 py-2.5">Siège ${selectedSeatId}</td>
                <td class="px-4 py-2.5">80 DH </td>
            `;
            passengerTableBody.prepend(tr);

            const cancelOption = document.createElement('option');
            cancelOption.value = selectedSeatId;
            cancelOption.textContent = `${passengerName} (Siege) ${selectedSeatId}`
            cancelPassenger.appendChild(cancelOption);

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

        // if (!oldSeatId) {
        //     alert("Veuillez sélectionner un passager.");
        //     return;
        // }

        // if (!newName) {
        //     alert("Veuillez entrer un nouveau nom.");
        //     return;
        // }

        let targetSeatId = oldSeatId;

        if (newSeatId !== "" && newSeatId !== oldSeatId) {
            const newSeatCard = document.querySelector(`[data-seat="${newSeatId}"]`);

            if (newSeatCard.getAttribute('data-occupied') === "true") {
                ptoast2.textContent = "Seat Already occupied"
                setTimeout(() => {
                    ptoast2.textContent = "";
                }, 3000);
                formReserver.reset();
                return;
            }

            const oldSeatCard = document.querySelector(`[data-seat="${oldSeatId}"]`);
            oldSeatCard.className = "bg-white border border-brand-border rounded-xl p-1.5 sm:p-3 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-brand-black transition-all shadow-sm";
            oldSeatCard.setAttribute('data-occupied', 'false');
            oldSeatCard.innerHTML = `
                <i class="fa-solid fa-chair text-brand-body text-lg"></i>
                <span class="text-xs font-bold">Siège ${oldSeatId}</span>
                <span class="bg-brand-soft text-[10px] font-semibold text-brand-body px-2 py-0.5 rounded-full">Libre</span>
            `;

            targetSeatId = newSeatId;
            localStorage.removeItem(`seat_${oldSeatId}`)
        }

        const targetSeatCard = document.querySelector(`[data-seat="${targetSeatId}"]`);
        targetSeatCard.className = "bg-brand-black text-white rounded-xl p-3 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all shadow-sm";
        targetSeatCard.setAttribute('data-occupied', 'true');
        targetSeatCard.innerHTML = `
            <i class="fa-solid fa-user text-lg"></i>
            <span class="text-xs font-bold">Siège ${targetSeatId}</span>
            <span class="bg-white/20 text-[10px] font-semibold px-2 py-0.5 rounded-full truncate max-w-[70px]">${newName}</span>
        `;
        localStorage.setItem(`seat_${targetSeatId}`, newName)

        const tableRow = document.querySelector(`tr[data-passenger-seat="${oldSeatId}"]`);
        if (tableRow) {
            tableRow.setAttribute('data-passenger-seat', targetSeatId);
            tableRow.innerHTML = `
                <td class="px-4 py-2.5 rounded-l-lg">${newName}</td>
                <td class="px-4 py-2.5">Siège ${targetSeatId}</td>
                <td class="px-4 py-2.5">80 DH </td>
            `;
        }

        const selectedOption = editPassenger.querySelector(`option[value="${oldSeatId}"]`);
        if (selectedOption) {
            selectedOption.value = targetSeatId;
            selectedOption.textContent = `${newName} (Siège ${targetSeatId})`;
        }

        const selectedCancelOption = cancelPassenger.querySelector(`option[value="${oldSeatId}"]`);
        if (selectedOption) {
            selectedCancelOption.value = targetSeatId;
            selectedCancelOption.textContent = `${newName} (Siège ${targetSeatId})`;
        }

        ptoast2.textContent = "Seat Edited Successfully"
        setTimeout(() => {
            ptoast2.textContent = "";
        }, 3000);
        formReserver.reset();

        formEdit.reset();
    });

    formCancel.addEventListener('submit', (e) => {
        e.preventDefault();

        const deleteSeatId = cancelPassenger.value;

        // if (!deleteSeatId){

        // }

        const seatCard = document.querySelector(`[data-seat="${deleteSeatId}"]`);
        if (seatCard) {
            seatCard.className = "bg-white border border-brand-border rounded-xl p-1.5 sm:p-3 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-brand-black transition-all shadow-sm";
            seatCard.setAttribute('data-occupied', 'false');
            seatCard.innerHTML = `
            <i class="fa-solid fa-chair text-brand-body text-lg"></i>
            <span class="text-xs font-bold">Siège ${deleteSeatId}</span>
            <span class="bg-brand-soft text-[10px] font-semibold text-brand-body px-2 py-0.5 rounded-full">Libre</span>
            `
        }

        localStorage.removeItem(`seat_${deleteSeatId}`)

        const tableRow = document.querySelector(`tr[data-passenger-seat="${deleteSeatId}"]`);
        if (tableRow) {
            tableRow.remove();
        }

        const editOpt = editPassenger.querySelector(`option[value="${deleteSeatId}"]`)
        if (editOpt) {
            editOpt.remove();
        }

        const cancelOpt = cancelPassenger.querySelector(`option[value="${deleteSeatId}"]`)
        if (cancelOpt) {
            cancelOpt.remove();
        }
        ptoast3.textContent = "Seat Deleted Successfully"
        setTimeout(() => {
            ptoast3.textContent = "";
        }, 3000);
        formCancel.reset();
        updateStats();
    });

});

