import { placesLibres, estComplet, prixSiege } from './reservations.js';


export function renderTrajets(trips) {
    return trips.map(trip => {
        const isFull = estComplet(trip);
        const free = placesLibres(trip);

        
        return `
        <div class="bg-white rounded-2xl border border-brand-border p-5 shadow-sm flex flex-col justify-between gap-4">
    <div class="flex justify-between items-start">
        <div>
            <h3 class="text-base font-bold">${trip.departure} -> ${trip.destination}</h3>
            <p class="text-xs text-brand-body">${trip.departureTime} -> ${trip.arrivalTime}</p>
        </div>
        <span class="px-2.5 py-1 rounded-full text-xs font-semibold">
            ${isFull ? 'Complet' : 'Disponible'}
        </span>
    </div>
    
    <div class="flex justify-between items-end pt-3 border-t border-brand-border">
        <div>
            <span class="text-lg font-bold">${trip.price} DH</span>
            <p class="text-xs text-brand-body mt-0.5">${free} / ${trip.capacity} places libres</p>
            <p class="text-xs text-brand-body">Attente :</p>
        </div>
    </div>
</div>

        `}).join('');
}