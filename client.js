// @ts-ignore
const fmtEndPoint = 'https://mygarage.rest.server'
async function getYears() {
    const url = fmtEndPoint + '/ftmt/year/'
    return fetch(url)
        .then((response) => {
            return response.json();
        })
}

async function getMakes(year) {
    const url = fmtEndPoint + '/ftmt/brand/?year=' + year;
    return fetch(url)
        .then((response) => {
            return response.json();
        })
}

async function getEquipments(year, make) {
    const url = fmtEndPoint + '/ftmt/equipment/?year=' + year + "&brand=" + make;
    return fetch(url)
        .then((response) => {
            return response.json();
        })
}

async function getModels(year, make, equipment) {
    const url = fmtEndPoint + '/ftmt/model/?year=' + year + "&brand=" + make + "&equipmenttype=" + equipment;
    return fetch(url)
        .then((response) => {
            return response.json();
        })
}