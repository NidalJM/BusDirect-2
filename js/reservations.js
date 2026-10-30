export function placesLibres(trip){
    return trip.capacity - trip.reservations.length;
}

export function estComplet(trip){
    return placesLibres(trip) === 0;
}

export function estVIP(siege){
    const num= Number(siege)
    return num>=1 && num<=4;
}

export function prixSiege(prixBase, siege)  {
    return estVIP(siege) ? Math.round(prixBase *1.1) : prixBase;
}

export function recetteTrajet(trip)    {
    return trip.reservations.reduce((total, res) =>{
        return total + prixSiege(trip.price, res.seat);
    }, 0);
}