/** vehicle.js **/
const vehicleTemplate = document.createElement('template');
vehicleTemplate.innerHTML = `
<style>
#vehicle-searchbox {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
    overflow: hidden;
    transition: height 0.33s ease-in-out, opacity 0.33s ease-in-out;
}
.vehicle-select {
    appearance: menulist-button;
    -webkit-appearance: menulist-button;
    font-size: 1rem;
    color: #555555;
}
@media screen and (max-width: 768px) {
    #vehicle-searchbox {
        gap: .5rem;
    }
    .vehicle-select {
        min-width: 100%;
    }
}
.vehicle-select:disabled {
    color: #888888;
    background-color: #BBBBBB;
}
  .action-btn {
    line-height: 1rem;
    appearance: none;
    -webkit-appearance: none;
    background-color: #ffffff;
    border: 1px solid #aaaaaa;
    border-radius: 2px;
    padding: 4px;
    color: #999999;
    font-size: .8rem;
  }
  .action-btn:hover {
    cursor:pointer;
    color: #555555;
    border-color: #555555;
  }
</style>
<div id="vehicle-searchbox" class="vehicle-rolled">
    <select id="year-select" class="vehicle-select">
        <option>Select Year</option>
    </select>
    <select id="make-select" class="vehicle-select" disabled="disabled">
        <option>Select Make</option>
    </select>
    <select id="equipment-select" class="vehicle-select" disabled="disabled">
        <option>Select Equipment Type</option>
    </select>
    <select id="model-select" class="vehicle-select" disabled="disabled">
        <option>Select Model</option>
    </select>
    <div id="vehicle-actions-panel">
        <button id="add-action" class="action-btn" disabled="disabled" data-link="">
            ADD
        </button>
    </div>
</div>
`;
vehicleTemplate.id = "vehicle-select-template";

class Vehicle extends HTMLElement {
    constructor() {
        super();
        this.fmtEndPoint = GarageConfig.endPoint;
        let tmpl = vehicleTemplate.content;
        this.attachShadow({mode: "open"}).appendChild(tmpl.cloneNode(true));
        this.year = "";
        this.make = "";
        this.equipmenttype = "";
        this.model = "";
        this.getYears().then((response) => {
            let years = response.filter(y => y.length > 0);
            const container = this.shadowRoot.getElementById("year-select");
            years.forEach(year => {
                let yearOption = document.createElement("option");
                yearOption.innerHTML = `${year}`;
                container.appendChild(yearOption);
            });
        });
        this.yearObserve();
        this.makeObserve();
        this.equipmentObserve();
        this.modelObserve();
        this.addObserve();
    }

    yearObserve() {
        //years observer
        const YearSelect = this.shadowRoot.getElementById("year-select");
        YearSelect.addEventListener('change', (event) => {
            event.target.dataset.year = event.target.value;
        });
        const yselconfig = {attributes: true, characterData: true, attributeFilter: ['data-year']};
        const yearMutProc = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === 'attributes') {
                    if (mutation.target.dataset.year.length > 0) {
                        this.clearMakes();
                        this.clearEquipments();
                        this.clearModels();
                        this.clearAddBtn();
                        this.buildMakes(mutation.target.value);
                    }
                }
            }
        };
        const yearObserver = new MutationObserver(yearMutProc);
        yearObserver.observe(YearSelect, yselconfig);
    }

    build() {
    }

    stringify() {
        return JSON.stringify(this, ["year", "make", "equipmenttype", "model", "handle"]);
    }

    async getYears() {
        const url = this.fmtEndPoint + '/ftmt/year/'
        const response = await fetch(url);
        return await response.json();
    }

    clearMakes() {
        const makes = this.shadowRoot.getElementById("make-select");
        while (makes.firstChild) {
            makes.removeChild(makes.firstChild);
        }
        makes.dataset.make = '';
        let stub = document.createElement("option");
        stub.innerText = 'Select Make';
        makes.appendChild(stub);
        makes.disabled = true;
    }

    async getMakes(year) {
        const url = this.fmtEndPoint + '/ftmt/brand/?year=' + year;
        return fetch(url)
            .then((response) => {
                return response.json();
            })
    }

    async buildMakes(year) {
        try {
            let data = await this.getMakes(year);
            let makes = [];
            makes = data.filter(m => m.length > 0);
            const container = this.shadowRoot.getElementById("make-select");
            makes.forEach(make => {
                let makeOption = document.createElement("option");
                makeOption.innerHTML = `${make}`;
                container.appendChild(makeOption);
            });
            container.disabled = false;
        } catch (error) {
            console.info("Error fetching brands: ", error);
        }
    }

    makeObserve() {
        //makes observer
        const MakeSelect = this.shadowRoot.getElementById("make-select");
        MakeSelect.addEventListener('change', (event) => {
            event.target.dataset.make = event.target.value;
        });
        const mselconfig = {attributes: true, characterData: true, attributeFilter: ['data-make']};
        const makeMutProc = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === 'attributes') {
                    if (mutation.target.dataset.make.length > 0) {
                        this.clearEquipments();
                        this.clearModels();
                        this.clearAddBtn();
                        const yearselect = this.shadowRoot.getElementById("year-select");
                        this.buildEquipmets(yearselect.dataset.year, mutation.target.value);
                    }
                }
            }
        };
        const makeObserver = new MutationObserver(makeMutProc);
        makeObserver.observe(MakeSelect, mselconfig);
    }

    clearEquipments() {
        const equipments = this.shadowRoot.getElementById("equipment-select");
        while (equipments.firstChild) {
            equipments.removeChild(equipments.firstChild);
        }
        equipments.dataset.equipment = '';
        let stub = document.createElement("option");
        stub.innerText = 'Select Equipment Type';
        equipments.appendChild(stub);
        equipments.disabled = true;
    }

    clearModels() {
        const models = this.shadowRoot.getElementById("model-select");
        while (models.firstChild) {
            models.removeChild(models.firstChild);
        }
        models.dataset.model = '';
        models.dataset.handle = '';
        let stub = document.createElement("option");
        stub.innerText = 'Select Model';
        models.appendChild(stub);
        models.disabled = true;
    }

    clearAddBtn() {
        let btn = this.shadowRoot.getElementById("add-action");
        btn.dataset.link = '';
        btn.disabled = true;
    }

    async buildEquipmets(year, make) {
        try {
            let data = await this.getEquipments(year, make);
            let eqps = [];
            eqps = data.filter(eqp => eqp.length > 0);
            const container = this.shadowRoot.getElementById("equipment-select");
            eqps.forEach(eqp => {
                let eqOption = document.createElement("option");
                eqOption.innerHTML = `${eqp}`;
                container.appendChild(eqOption);
            });
            container.disabled = false;
        } catch (error) {
            console.info("Error fetching equipments: ", error);
        }
    }

    async getEquipments(year, make) {
        const url = this.fmtEndPoint + '/ftmt/equipment/?year=' + year + "&brand=" + make;
        return fetch(url)
            .then((response) => {
                return response.json();
            })
    }

    equipmentObserve() {
        //equipments observer
        const EqmtSelect = this.shadowRoot.getElementById("equipment-select");
        EqmtSelect.addEventListener('change', (event) => {
            event.target.dataset.equipment = event.target.value;
        });
        const eqconfig = {attributes: true, characterData: true, attributeFilter: ['data-equipment']};
        const eqMutProc = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === 'attributes') {
                    if (mutation.target.dataset.equipment.length > 0) {
                        this.clearModels();
                        this.clearAddBtn();
                        const yearselect = this.shadowRoot.getElementById("year-select");
                        const makeselect = this.shadowRoot.getElementById("make-select");
                        this.buildModels(yearselect.dataset.year, makeselect.dataset.make, mutation.target.value);
                    }
                }
            }
        };
        const eqObserver = new MutationObserver(eqMutProc);
        eqObserver.observe(EqmtSelect, eqconfig);
    }

    async getModels(year, make, equipment) {
        const url = this.fmtEndPoint + '/ftmt/model/?year=' + year + "&brand=" + make + "&equipmenttype=" + equipment;
        return fetch(url)
            .then((response) => {
                return response.json();
            })
    }

    async buildModels(year, make, equipment) {
        try {
            let data = await this.getModels(year, make, equipment);
            let models = [];
            models = data.filter(m => m.handle.length > 0);
            const container = this.shadowRoot.getElementById("model-select");
            models.forEach(model => {
                let modelOption = document.createElement("option");
                modelOption.dataset.handle = model.handle;
                modelOption.dataset.model = model.model;
                let showtext = `${model.model}`.substring(0, 32);
                if (showtext.length === 32) {
                    showtext = showtext + '...'
                }
                modelOption.innerText = showtext;
                modelOption.value = model.model;
                container.appendChild(modelOption);
            });
            container.disabled = false;
        } catch (error) {
            console.info("Error fetching brands: ", error);
        }
    }

    modelObserve() {
        //model observer
        const ModelSelect = this.shadowRoot.getElementById("model-select");
        ModelSelect.addEventListener('change', (event) => {
            const option = event.target.querySelector("[data-model='" + event.target.value + "']");
            event.target.dataset.model = event.target.value;
            event.target.dataset.handle = option.dataset.handle;
        });
        const modselconfig = {attributes: true, characterData: true, attributeFilter: ['data-model']};
        const modelMutProc = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === 'attributes') {
                    if (mutation.target.dataset.model.length > 0) {
                        this.enableAddBtn();
                    }
                }
            }
        };
        const modelObserver = new MutationObserver(modelMutProc);
        modelObserver.observe(ModelSelect, modselconfig);
    }

    enableAddBtn() {
        let btn = this.shadowRoot.getElementById("add-action");
        btn.disabled = false;

    }

    addObserve() {
        const addBtn = this.shadowRoot.getElementById("add-action");
        addBtn.addEventListener('click', () => {
            const yearselect = this.shadowRoot.getElementById("year-select");
            const makeselect = this.shadowRoot.getElementById("make-select");
            const eqselect = this.shadowRoot.getElementById("equipment-select");
            const modelselect = this.shadowRoot.getElementById("model-select");
            this.year = yearselect.dataset.year;
            this.make = makeselect.dataset.make;
            this.equipmenttype = eqselect.dataset.equipment;
            this.model = modelselect.dataset.model;
            this.handle = modelselect.dataset.handle;
            const v = {
                year: this.year,
                make: this.make,
                equipmenttype: this.equipmenttype,
                model: this.model,
                handle: this.handle
            }
            let parent = this.getRootNode().host;
            if (!parent.isInGarage(v)) {
                parent.myGarage.garage.unshift(v);
                if (parent.myGarage.garage.length === 1) {
                    parent.myGarage.current = parent.myGarage.garage[0];
                    parent.showCurrentVehicle();
                }
                parent.saveGarageToStorage();
                parent.storeGarageinShop().then(() => {
                    parent.addVehicleToGarageContainer(v);
                    if (!Debug) {
                        window.location = `/collections/${v.handle}`;
                    }
                });
            }
        });
    }
}

