export function sauvegarder(trips){
    localStorage.setItem('trips',JSON.stringify(trips));
}


export async function initialiser() {
    const savedData = localStorage.getItem('trips');
    if (savedData) {
            return JSON.parse(savedData);
    }
    const response = await fetch ('./data/trips.json');
    const trips = await response.json();

    sauvegarder(trips);
    return trips;
}