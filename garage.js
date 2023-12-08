/** garage.js **/
const Debug = false;
const MAXCOUNTVEHICLES = 5;
const garageTemplate = document.createElement('template');
garageTemplate.innerHTML = `
<style>
#my-garage-button {
    display: grid;
    align-content: center;
    justify-items: stretch;
    grid-template-columns: 1.5rem 1fr;
    padding: 0.5rem;
    appearance: none;
    -webkit-appearance: none;
    border: none;
    max-width: 960px;
    align-items: center;
    font-size: 1rem;
    background-color: #00000000;
    color: #ffffff;
    gap: 1rem;
  }
  #my-garage-button:hover {
    cursor: pointer;
  }
  #my-garage-button-bottom-text {
    font-size: 1rem;
    font-weight: bold;
  }
  #my-garage-icon {
    height: auto;
    width: auto;
    object-fit:contain;
  }
  #my-garage-icon svg {
    fill: #FFFFFF;
    width: 32px;
    display: block;
  }
  #my-garage-button-arrow {
    height: 8px;
    width: auto;
  }
  #my-garage-button-label {
    font-size: .75rem;
  }
  #my-garage-button-header {
    text-align: end;
  }
  #my-garage-button-arrow {
    transition: transform 0.33s ease-in-out;
  }
  .hidden {
    display: none!important;
    opacity:0!important;
    transform: rotateX(-90deg);

  }
  .rotated {
    transform: rotate(-180deg);
  }
  #my-garage-container {
    position: absolute;
    z-index: 1000;
    border: 1px solid #c8c8c8;
    padding: 1rem;
    right: 0;
    background-color: #ffffff;
    transition-duration: 400ms;
    transform: rotateX(0deg);
    opacity:1;
  }
  #my-garage-container-main {
    min-height: 3rem;
    display: grid;
    align-content: center;
    justify-items: stretch;
    grid-template-columns: 1fr;
  }
  #vehicles-panel {
    display: grid;
    gap: 1rem;
  }
  #vehicles-panel p {
    font-weight:800;
  }
  #my-garage-container-header {
    font-weight: 800;
    margin-top: 1rem;
    display: block;
    color: #555555;
  }
  .my-garage-container-main-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  .my-garage-collection-button,
  .action-btn {
    line-height: 1.5rem;
    appearance: none;
    -webkit-appearance: none;
    background-color: #ffffff;
    border: 1px solid #aaaaaa;
    border-radius: 2px;
    padding: 8px;
    color: #999999;
    font-size: 1rem;
  }
  .my-garage-collection-button:hover,
  .action-btn:hover {
    cursor:pointer;
    color: #555555;
    border-color: #555555;
  }
  .my-garage-collection-row-actions {
    display: grid;
    place-items: center;
    grid-template-columns: 1fr 36px;
    gap: 2rem;
  }
  .current-btn {
    display:grid;
    place-items: center;
    appearance: none;
    -webkit-appearance: none;
    border: none;
    background-color: #ffffff00;
    width: 24px;
    height: 24px;
    background-size: contain;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='40' viewBox='0 96 960 960' width='40'%3E%3Cpath d='m379.333 838.666-252-251.999 75.333-75.333 176.667 176.667 377.334-377.334L832 386 379.333 838.666Z'/%3E%3C/svg%3E");
  }

  .current-btn:hover {
    cursor:pointer;
  }
  .current-btn svg{
    fill: #555555;
  }
  .current-btn svg:hover {
    color: #000000;
    cursor: pointer;
  }
  .current-vehicle {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='40' viewBox='0 96 960 960' width='40' fill='%231aa263'%3E%3Cpath d='m379.333 838.666-252-251.999 75.333-75.333 176.667 176.667 377.334-377.334L832 386 379.333 838.666Z'/%3E%3C/svg%3E");
  }
  .my-garage-collection-row-link {
    text-decoration: none;
    color:#555555;
  }
  .my-garage-collection-row-link:hover {
    cursor: pointer;
    color:#000000;
  }
  .my-garage-collection-row-link:visited {
    text-decoration: none;
    color:#555555;
  }
  #my-garage-main {
    z-index: 1000;
  }
  .delete-button-container {
    display:grid;
    place-items: center;
    appearance: none;
    -webkit-appearance: none;
    border: none;
    background-color: #ffffff00;
    width: 24px;
    height: 24px;
    background-size: contain;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='48' viewBox='0 96 960 960' width='48' fill='%23fa0000'%3E%3Cpath d='M261 936q-24.75 0-42.375-17.625T201 876V306h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438V306ZM367 790h60V391h-60v399Zm166 0h60V391h-60v399ZM261 306v570-570Z'/%3E%3C/svg%3E");
  }
  .delete-button-container:hover {
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    #vehicle-searchbox {
        gap: .5rem;
    }
    .vehicle-select {
        min-width: 100%;
    }
    #my-garage-button {
      width:100%;
      justify-items: flex-end;
    }
}
</style>
<div id="my-garage-main">
<button id="my-garage-button">
    <div id="my-garage-icon"></div>
    <div id="my-garage-button-container">
        <div id="my-garage-button-header">
            <span id="my-garage-button-label">Shop by Vehicle</span>
            <svg id="my-garage-button-arrow" viewBox='0 0 16 16'>
              <path fill='none' stroke='#FFFFFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/>
              </svg>
        </div>
        <div id="my-garage-button-bottom-text">
        </div>
    </div>
</button>
<div id="my-garage-container" class="hidden">
  <div>
    <vehicle-select class="vehicle-select"></vehicle-select>
  </div>
</div>
</div>
`;
garageTemplate.id = "garage-template";

const Icons = {
  "atv": `<svg id="atv" version="1.1" viewBox="0 0 100 67.97" xmlns="http://www.w3.org/2000/svg">
  <path d="m77.252 12.292v-10.782c-4.0973 0-7.4398 2.426-7.4398 5.3911 0 2.9651 3.3425 5.3911 7.4398 5.3911z" stroke-width="1.797"/>
  <path d="m89.058 32.652 2.4979-12.472-23.236-7.5476-2.9651-6.667a8.2125 8.2125 0 0 0-4.4567-4.0434 2.7135 2.7135 0 0 0-2.5698-1.9228h-11.303a2.7495 2.7495 0 0 0 0 5.499h11.303a2.6956 2.6956 0 0 0 1.9947-0.86258 5.3911 5.3911 0 0 1 2.5518 2.444l2.4979 5.6068-8.2484 11.681-55.223-7.889v5.8045l12.13 6.1998 0.75476 2.9112a18.474 18.474 0 1 0 22.086 19.768h26.291a18.456 18.456 0 1 0 25.895-18.51zm-70.588 25.41a8.5539 8.5539 0 1 1 8.5539-8.536 8.536 8.536 0 0 1-8.5539 8.536zm63.076 0a8.5539 8.5539 0 1 1 8.5539-8.536 8.536 8.536 0 0 1-8.5539 8.536z" stroke-width="1.797"/>
 </svg>`,
  "motorcycle": `<svg version="1.1" viewBox="0 0 100 59.24" xmlns="http://www.w3.org/2000/svg">
  <path d="m16.139 58.881a16.103 16.103 0 0 0 15.916-13.613l-7.0478 1.867a9.8949 9.8949 0 1 1-0.7779-10.082l-8.977 2.4893a3.3916 3.3916 0 0 0-2.4115 4.1695 3.4228 3.4228 0 0 0 4.1851 2.4115l19.074-5.1186v9.926h22.108c3.2516 0 6.0676-1.2602 6.0676-6.3943 0-9.3348 3.3294-14.251 8.4169-17.798l8.7747 17.363a2.8627 2.8627 0 0 0 3.8273 1.2446 2.8004 2.8004 0 0 0 1.2446-3.8117l-4.294-8.4947a9.9105 9.9105 0 1 1-7.6234 5.6476l-3.1116-6.4721a16.274 16.274 0 1 0 7.8724-4.9319l-1.5558-3.1116a19.556 19.556 0 0 1 18.141 3.1116h2.7071a19.976 19.976 0 0 0-23.446-8.308l-0.49786-0.9646c2.676-1.1357 3.2205-4.5118 1.7581-7.2967-1.4625-2.7849-4.3407-4.0762-6.8611-2.8004l-3.2205-6.4099a3.0027 3.0027 0 0 0-3.9517-1.1824l-5.5542 2.1314h-1.8358a2.2715 2.2715 0 0 0 0 4.5429h2.6137l4.2473-1.5558 4.6674 9.3348a8.4324 8.4324 0 0 0-7.1256-1.6803 3.4539 3.4539 0 0 0-2.6915-1.3224h-1.4625a3.4694 3.4694 0 0 0-3.4228 3.9051c-2.4115 1.0891-4.6674 2.3648-6.6433 3.4694a2.4271 2.4271 0 0 0-2.5048-2.2559l-22.808-1.7269a2.4271 2.4271 0 0 0-2.5204 2.3181v1.1669h-11.933v7.6545a19.588 19.588 0 0 1 28.425 8.1524l-3.4228 0.91792a16.134 16.134 0 1 0-14.344 23.508z" stroke-width="1.5558"/>
 </svg>`,
  "scooter": `<svg version="1.1" viewBox="0 0 100 60.79" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(-20 -20)" fill-rule="evenodd">
   <path d="m91.012 23.432-6.9713-3.3646c-0.44341-0.14874-0.9378-0.04629-1.2852 0.26634-0.6088 0.54591-0.57738 1.5068 0.0782 2.0012l6.2107 3.0696z"/>
   <path d="m92.824 31.085v2.2064c2.1697 3.0499 4.523 7.0169 5.7747 10.349 1.0438 2.7767 1.7659 5.6096 2.1409 8.4841 0.99722-0.13397 2.0225-0.20333 3.0679-0.20333 3.1832 0 6.1794 0.63903 8.7796 1.7908l-24.369 19.646c-1.6014-2.1204-2.6779-5.5349-2.6779-8.1675l-36.194-0.0065 3.4831-2.731 25.206-0.0019c4.0218 0.0077 8.4132-4.2272 8.4162-8.3323l0.0394-18.067 6.3334-4.9664z"/>
   <path d="m65.658 48.86v-11.45h-36.037l-0.92713 1.07-2.1169 3.4145-1.3166 3.1264-1.1328 3.6018-0.5762 2.8567-0.39243 3.0446-0.3705 4.1134-0.04562 2.7974-2.7429-0.0077v2.67l2.7358 4.75e-4v1.0884l26.628 0.0059 16.295-16.332z"/>
   <path d="m64.728 30.63c0.4938 0 0.92772 0.43333 0.92772 0.92713v3.0256h-33.201l0.80383-0.8637 1.8288-1.5863 1.1933-0.80324 1.1927-0.4938 1.1743-0.18317h0.05987z"/>
   <path d="m95.808 74.249 4.5472-4.5473c0.82262 2.9207 3.5151 5.101 6.7054 5.101 3.826 0 6.952-3.1264 6.952-6.9523 0-3.3321-2.3856-6.152-5.5308-6.81l4.5658-4.5438c4.0321 2.1993 6.9526 6.4585 6.9526 11.354 0 7.139-5.8 12.94-12.94 12.94-4.813 0-9.0089-2.6326-11.253-6.5409z"/>
   <path d="m104.33 36.731c-2.902 0-5.2883-2.3854-5.2883-5.2877 0-2.9017 2.3862-5.2877 5.2883-5.2877z"/>
   <path d="m52.007 67.766c-0.16558 3.0452-1.3487 6.0466-3.641 8.339-5.0481 5.0481-13.25 5.0484-18.299 0-2.3186-2.3186-3.5683-5.2994-3.7587-8.339h6.0159c0.17369 1.5018 0.82796 2.9574 1.9757 4.1051 2.7054 2.7054 7.1267 2.7053 9.8321 0 1.1442-1.1442 1.8007-2.6014 1.9766-4.1051z"/>
   <path d="m91.012 29.241-6.9713-3.3646c-0.44341-0.14874-0.9378-0.04628-1.2852 0.26634-0.6088 0.54591-0.57738 1.5068 0.0782 2.0012l6.2107 3.0696z"/>
  </g>
 </svg>`,
  "side by side": `<svg id="atv" version="1.1" viewBox="0 0 100 67.97" xmlns="http://www.w3.org/2000/svg">
  <path d="m77.252 12.292v-10.782c-4.0973 0-7.4398 2.426-7.4398 5.3911 0 2.9651 3.3425 5.3911 7.4398 5.3911z" stroke-width="1.797"/>
  <path d="m89.058 32.652 2.4979-12.472-23.236-7.5476-2.9651-6.667a8.2125 8.2125 0 0 0-4.4567-4.0434 2.7135 2.7135 0 0 0-2.5698-1.9228h-11.303a2.7495 2.7495 0 0 0 0 5.499h11.303a2.6956 2.6956 0 0 0 1.9947-0.86258 5.3911 5.3911 0 0 1 2.5518 2.444l2.4979 5.6068-8.2484 11.681-55.223-7.889v5.8045l12.13 6.1998 0.75476 2.9112a18.474 18.474 0 1 0 22.086 19.768h26.291a18.456 18.456 0 1 0 25.895-18.51zm-70.588 25.41a8.5539 8.5539 0 1 1 8.5539-8.536 8.536 8.536 0 0 1-8.5539 8.536zm63.076 0a8.5539 8.5539 0 1 1 8.5539-8.536 8.536 8.536 0 0 1-8.5539 8.536z" stroke-width="1.797"/>
 </svg>`,
  "snowmobile": `<svg id="shape-snowmobile" version="1.1" viewBox="0 0 100 62.234" xmlns="http://www.w3.org/2000/svg">
  <path d="m1.0703 51.186a7.0301 7.0301 0 0 0-1.0702 3.7702 6.9643 6.9643 0 0 0 6.9478 6.9643h41.357a6.9643 6.9643 0 0 0 6.9478-6.9643 6.8819 6.8819 0 0 0-1.0537-3.6879zm98.372 0.85613a1.8769 1.8769 0 0 0-2.6672 0c-2.4531 2.5354-8.232 6.5856-12.299 6.4045h-4.9392l-7.9356-11.245h9.0716v-0.11525l9.5326-9.7961c-4.9392-7.9027-19.757-19.757-32.319-23.955l-7.6722-13.336-3.5891 1.9592 7.096 16.085-10.916 14.093h-17.32l-4.5605-8.3308h-8.232l-10.455 23.395h61.641l7.9356 11.245h-10.669a1.8934 1.8934 0 0 0 0 3.7867h23.329c6.0917-0.09878 11.969-4.5934 14.966-7.5076a1.8934 1.8934 0 0 0 0-2.6836z" stroke-width="1.6464"/>
 </svg>`,
  "watercraft": `<svg id="watercraft" version="1.1" viewBox="0 0 100 52.967" xmlns="http://www.w3.org/2000/svg">
  <g stroke-width="1.3896">
   <path d="m58.88 8.3373 1.6814-4.1687-16.897-4.1687-0.84763 2.5429s6.7671 5.0719 7.6148 5.9056 8.4485-0.11116 8.4485-0.11116z"/>
   <path d="m97.746 26.082h-2.5429s-7.6009-15.202-29.57-17.745l-2.529 4.2381h-11.839l-0.83373 4.1687-4.1687 6.7532h-3.6128v-2.5012s-5.9056 0.84763-6.7532-0.84763c-0.84763-1.6953-19.454-3.3766-23.622-2.529-2.932 0.58361-3.0848 3.9185-2.8347 5.9334h-1.2645l-2.529 2.529h-3.4044s-5.0441 5.0024 0 7.5453h95.504s5.0719-5.0024 0-7.5453z"/>
   <path d="m12.399 52.219s52.386 1.6814 54.929 0c2.5429-1.6814 13.52-3.321 24.498-14.299h-85.332z"/>
  </g></svg>`,
  "car": `<svg width="28.046mm" height="9.4215mm" version="1.1" viewBox="0 0 28.046 9.4215" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(-134.19 -151.37)">
   <g transform="matrix(-.089376 0 0 .089376 164.23 148.57)">
    <path transform="scale(.26458)" d="m777.71 118.51c-74.651-0.81158-131.1 10.487-194.6 39.736-45.842 21.203-86.882 53.747-135.23 68.346-39.253 11.851-81.545 8.817-122.15 14.541-44.74 6.3074-89.688 11.954-133.78 21.812-28.802 7.1681-71.38 13.693-87.248 37.807-15.637 24.759-19.696 56.52-18.904 85.793 0.24479 9.0518 7.2001 17.121 7.2715 26.176 0.09082 11.521-8.7246 33.445-8.7246 33.445 33.325 11.414 79.977 15.994 79.977 15.994-1.5152-27.956-5.5747-60.62 6.1543-83.252 18.928-36.523 44.933-58.156 87.008-58.156 41.51 0 60.419 9.1046 87.273 38.768 21.56 32.187 21.57 53.601 21.689 102.64 185.19-5.0312 415.13-4.3613 545.3-4.3613 1.6506-29.106 3.894-66.246 24.865-97.027 16.362-21.242 47.113-40.844 83.873-40.607 36.76 0.23646 57.436 15.437 82.586 47.572 7.1592 17.548 19.311 33.263 16.617 82.791 61.57-11.386 104.5-15.133 139.6-21.812 10.858-2.066 6.991-21.074 8.7246-31.99 5.4227-54.636 3.9038-144.3-31.992-173.04-7.408-5.4714-18.451 0.78524-27.627 0-28.424-2.4324-56.426-8.6558-84.34-14.543-7.822-1.6497-15.794-2.9784-23.268-5.8164-23.511-8.9283-44.316-23.809-66.889-34.898-73.657-42.38-153.85-49.916-256.18-49.916zm4.2062 27.568c12.499 0.12539 24.669 0.33123 36.512 0.74024 11.843 0.40901 23.36 1.0204 34.549 1.959 16.257 1.3828 33.34 3.7075 48.152 6.8418 5.1064 1.097 10.132 2.3217 15.076 3.6894l-8.5996 80.043-134.29 3.3086zm-29.166 0.54297-35.289 99.828-246.53 18.035c14.262-11.422 28.527-22.172 42.508-31.945 19.09-13.296 39.933-26.203 58.908-36.439 17.551-9.3922 36.66-18.088 53.912-24.635 16.369-6.1469 34.06-11.399 49.857-15.049 15.499-3.5243 32.074-6.1219 46.738-7.6777 10.241-1.0485 20.321-1.7257 29.891-2.1172zm177.35 17.979c13.496 7.3728 22.909 13.927 33.549 20.746 9.9878 6.4669 19.595 12.856 28.367 19.832 5.3731 4.4511 10.307 8.6249 14.408 13.662 2.0643 2.6122 3.9103 5.3402 4.9824 8.293 0.8534 2.4921 1.1176 5.1317 0.4434 7.4902-0.3444 1.1747-0.9074 2.3115-1.7051 3.4062l-87.32 0.66016z" fill-rule="evenodd"/>
    <circle cx="69.555" cy="113.97" r="22.794"/>
    <circle cx="268.9" cy="113.97" r="22.794"/>
   </g></g></svg>`
}

class Garage extends HTMLElement {
  constructor(api_url = 'http://localhost') {
    super();
    this.myGarage = {
      "current": {
        "year": "",
        "make": "",
        "equipmenttype": "",
        "model": "",
        "handle": ""
      },
      "garage": []
    }
    this.myGarageId = "";
    this.EndPoint = GarageConfig.endPoint;
    let gcont = garageTemplate.content;
    this.attachShadow({ mode: "open" })
      .appendChild(gcont.cloneNode(true));
    this.mainContainer = this.shadowRoot.querySelector('#my-garage-main');
    this.container = this.shadowRoot.querySelector('#my-garage-container');
    this.buttonArrow = this.shadowRoot.querySelector('#my-garage-button-arrow');
    this.button = this.shadowRoot.querySelector('button');
    this.button.addEventListener('click', () => {
      this.container.classList.toggle('hidden');
      this.buttonArrow.classList.toggle('rotated');
      if (!this.isMobile()) {
        if (window.innerWidth > 1024) {
          let btnRect = this.button.getBoundingClientRect();
          this.container.style.right = (window.innerWidth - (btnRect.x + btnRect.width)) + "px";
        }
      }
    })
    // if (!Debug) {
    //   this.mainContainer.addEventListener('mouseover', () => {
    //     if (this.container.classList.contains('hidden')) {
    //       this.container.classList.remove('hidden');
    //     }
    //     this.buttonArrow.classList.toggle('rotated');
    //     if (!this.isMobile()) {
    //       if (window.innerWidth > 1024) {
    //         const btnRect = this.button.getBoundingClientRect();
    //         this.container.style.right = (window.innerWidth - (btnRect.x + btnRect.width)) + "px";
    //       }
    //     }
    //   });
    //   this.mainContainer.addEventListener('mouseleave', () => {
    //     this.container.style.right = '0';
    //     if (!this.container.classList.contains('hidden')) {
    //       this.container.classList.add('hidden');
    //     }
    //     this.buttonArrow.classList.toggle('rotated');
    //   })
    // }
    if (Debug) {
      console.debug("load data into ...")
    }
    // get MyGarage
    this.myGarage = this.getGarageFromStorage();
    if (Debug) {
      console.debug("MyGarage from local storage: ", this.myGarage);
    }
    // get customer id
    if (typeof CustomerId === 'undefined') {
      if (Debug) {
        console.debug("defined cid:", typeof CustomerId);
      }
      this.buildGarageContainer();
      return
    }
    if (Debug) {
      console.debug("cid:", CustomerId);
    }
    if (CustomerId !== null && CustomerId !== undefined) {
      this.getGarageAPI(CustomerId).then(r => {
        if (r.hasOwnProperty('id')) {
          this.myGarageId = r.id;
        }
        if (r.hasOwnProperty('value') && r.value.length > 0) {
          this.myGarage = JSON.parse(r.value);
        }

        if (this.garageIsEmpty()) {
          this.myGarage = this.getGarageFromStorage();
        }
        let modelText = `${this.myGarage.current.model}`.substring(0, 17);
        if (modelText.length > 16) {
          modelText += '...'
        }
        this.buildGarageContainer();
      })
    }
  }

  showCurrentVehicle() {
    const icon = this.getIcon(this.myGarage.current.equipmenttype);
    const iconContainer = this.shadowRoot.getElementById("my-garage-icon");
    iconContainer.innerHTML = icon;
    let modelText = `${this.myGarage.current.model}`.substring(0, 17);
    if (modelText.length > 16) {
      modelText = modelText + '...'
    }
    const mt = this.shadowRoot.getElementById("my-garage-button-bottom-text");
    mt.dataset.vhash = this.hashStr(JSON.stringify(this.myGarage.current));
    mt.innerText = modelText;
    const vehiclesCurBtns = this.shadowRoot.querySelectorAll('.current-btn');
    for (const btn of vehiclesCurBtns) {
      if (mt.dataset.vhash === btn.dataset.for) {
        btn.classList.add('current-vehicle');
      } else {
        btn.classList.remove('current-vehicle');
      }
    }
  }

  getIcon(eqp) {
    const eqtype = eqp.toLowerCase();
    for (const icon in Icons) {
      if (eqtype.toLowerCase().includes(icon)) {
        return Icons[icon]
      }
    }
    return null
  }

  garageIsEmpty() {
    return this.myGarage.current.year === "" &&
        this.myGarage.current.make === "" &&
        this.myGarage.current.equipmenttype === "" &&
        this.myGarage.current.model === "";

  }

  getGarageFromStorage() {
    const mgRaw = localStorage.getItem('MyGarage');
    if (mgRaw === null || mgRaw === undefined) {
      return {
        "current": {
          "year": "",
          "make": "",
          "equipmenttype": "",
          "model": "",
          "handle": ""
        },
        "garage": []
      };
    }
    return JSON.parse(mgRaw);
  }

  async getGarageAPI(cid) {
    const url = this.EndPoint + '/garage/get?cid=' + cid;
    return fetch(url)
      .then((response) => {
        return response.json();
      })
  }

  saveGarageToStorage() {
    localStorage.setItem('MyGarage', JSON.stringify(this.myGarage));
  }

  async saveGarageAPI() {
    if (CustomerId.length === 0) {
      console.error("CustomerId empty");
      return
    }
    const input = {
      "input": {
        "metafields": [
          {
            "namespace": "equipments",
            "key": "garage",
            "type": "json",
            "value": JSON.stringify(this.myGarage)
          }
        ],
        "id": "gid://shopify/Customer/" + CustomerId
      }
    }
    //fetch POST
    this.postData(input).then((r) => {
      this.myGarageId = r.Response.data.customerUpdate.customer.metafields.edges[0].node.id;
    });
  }

  async postData(data = {}) {
    const response = await fetch(this.EndPoint + "/garage/set/", {
      method: 'POST',
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response.json()
  }

  async updateGarageAPI() {
    if (CustomerId.length === 0) {
      console.error("CustomerId empty");
      return
    }
    const input = {
      "input": {
        "metafields": [
          {
            "id": this.myGarageId,
            "value": JSON.stringify(this.myGarage)

          }
        ],
        "id": "gid://shopify/Customer/" + CustomerId
      }
    }
    //fetch POST
    this.postData(input).then((r) => {
      this.myGarageId = r.Response.data.customerUpdate.customer.metafields.edges[0].node.id;
    });
  }

  async storeGarageinShop() {
    if (typeof CustomerId === 'undefined') {
      console.info("CustomerId empty");
      return
    }
    if (CustomerId.length === 0) {
      console.info("CustomerId empty");
      return
    }
    if (this.myGarageId.length === 0) {
      await this.saveGarageAPI();
    } else {
      await this.updateGarageAPI();
    }
  }

  buildGarageContainer() {
    let container = this.shadowRoot.getElementById("my-garage-container");
    let container_header = document.createElement("span");
    container_header.id = "my-garage-container-header";
    container_header.innerText = "My saved vehicles:";
    let container_main = document.createElement("div");
    container_main.id = "my-garage-container-main";
    let vehicles_panel = document.createElement("div");
    let control_panel = document.createElement("div");
    vehicles_panel.id = "vehicles-panel";
    control_panel.id = "control-panel";
    //table of vehicles
    this.myGarage.garage.forEach((v) => {
      if (Debug) {
        console.info("vehicle: ", v);
      }
      let vp = document.createElement("div");
      vp.classList.add("my-garage-container-main-row");
      vp.dataset.vhash = this.hashStr(JSON.stringify(v));
      let colHeader = document.createElement("a");
      colHeader.href = `/collections/${v.handle}`;
      colHeader.classList.add("my-garage-collection-row-link");
      colHeader.innerText = v.year + " " + v.make + " " + v.model.replaceAll("-", " ").toUpperCase();
      vp.appendChild(colHeader);
      let actionColumn = document.createElement("div");
      actionColumn.classList.add("my-garage-collection-row-actions");
      this.buildActionButtons(vp, actionColumn, v);
      vp.appendChild(actionColumn);
      vehicles_panel.appendChild(vp);
    });
    container_main.appendChild(vehicles_panel);
    container_main.appendChild(control_panel);
    container.appendChild(container_header);
    container.appendChild(container_main);
    let container_footer = document.createElement("div");
    container_footer.id = "my-garage-container-footer";
    container.appendChild(container_footer);
    this.showCurrentVehicle();
  }

  addVehicleToGarageContainer(v) {
    let v_panel = this.shadowRoot.getElementById("vehicles-panel");
    let vp = document.createElement("div");
    vp.classList.add("my-garage-container-main-row");
    vp.dataset.vhash = this.hashStr(JSON.stringify(v));
    let colHeader = document.createElement("a");
    colHeader.href = `/collections/${v.handle}`;
    colHeader.classList.add("my-garage-collection-row-link");
    colHeader.innerText = v.year + " " + v.make + " " + v.model.replaceAll("-", " ").toUpperCase();
    vp.appendChild(colHeader);
    let actionColumn = document.createElement("div");
    actionColumn.classList.add("my-garage-collection-row-actions");
    this.buildActionButtons(vp, actionColumn, v);
    vp.appendChild(actionColumn);
    if (v_panel.hasChildNodes()) {
      v_panel.insertBefore(vp, v_panel.childNodes[0]);
    } else {
      v_panel.appendChild(vp);
    }
    if (Debug) {
      console.info("addVehicleToGarageContainer: ", v);
      console.info("garage length: ", this.myGarage.garage.length);
    }
    if (this.myGarage.garage.length > MAXCOUNTVEHICLES) {
      const vOut = this.myGarage.garage.pop();
      this.removeFromGarageContainer(vOut);
    }
  }

  removeFromGarageContainer(v) {
    this.myGarage.garage = this.myGarage.garage.filter((value) => {
      const excludeItemHash = this.hashStr(JSON.stringify(v));
      const inHash = this.hashStr(JSON.stringify(value));
      return inHash !== excludeItemHash
    });
    if (this.myGarage.garage.length === 1) {
      this.myGarage.current = this.myGarage.garage[0];
    }
    if (this.hashStr(JSON.stringify(v)) === this.hashStr(JSON.stringify(this.myGarage.current))) {
      this.myGarage.current = this.myGarage.garage[0];
    }
    if (this.myGarage.garage.length === 0) {
      this.myGarage.current = {
        "year": "",
        "make": "",
        "equipmenttype": "",
        "model": ""
      };
    }
    this.saveGarageToStorage();
    this.storeGarageinShop().then(() => {
      this.showCurrentVehicle();
    });
    if (Debug) {
      console.info("removeFromGarageContainer: ", v);
      console.info("garage length: ", this.myGarage.garage.length);
      console.info("garage: ", this.myGarage.garage);
    }
    let v_panel = this.shadowRoot.getElementById("vehicles-panel");
    if (v_panel.hasChildNodes()) {
      v_panel.childNodes.forEach((vp) => {
        if (Debug) {
          console.info("vehicle in panel: ", vp);
          console.info("vehicle in panel hash: ", vp.dataset.vhash);
          console.info("vehicle to remove hash: ", this.hashStr(JSON.stringify(v)));
        }
        if (vp.dataset.vhash === this.hashStr(JSON.stringify(v))) {
          vp.remove();
        }
      });
    }
  }

  buildActionButtons(vp, actionsbox, v) {
    // set current button
    let curButton = document.createElement("button");
    curButton.dataset.for = this.hashStr(JSON.stringify(v));
    curButton.classList.add('current-btn');
    if (this.hashStr(JSON.stringify(v)) === this.hashStr(JSON.stringify(this.myGarage.current))) {
      curButton.classList.add("current-vehicle");
    }
    curButton.addEventListener("click", () => {
      this.myGarage.current = v;
      this.saveGarageToStorage();
      this.storeGarageinShop().then(() => {
        this.showCurrentVehicle();
        if (!Debug) {
          window.location = `/collections/${v.handle}`;
        }
      });
    })
    actionsbox.appendChild(curButton);
    // delete button
    let delButton = document.createElement("button");
    delButton.classList.add("delete-button-container");
    delButton.dataset.for = this.hashStr(JSON.stringify(v));
    delButton.dataset.for = this.hashStr(JSON.stringify(v));
    delButton.addEventListener("click", (ev) => {
      this.removeFromGarage(ev);
      vp.remove();
    }, true);
    actionsbox.appendChild(delButton);
  }

  removeFromGarage(ev) {
    this.myGarage.garage = this.myGarage.garage.filter((value) => {
      const excludeItemHash = ev.target.dataset.for;
      const inHash = this.hashStr(JSON.stringify(value));
      return inHash !== excludeItemHash
    });
    if (Debug) {
      console.debug("removeFromGarage function - myGarage: ", this.myGarage);
    }
    if (this.myGarage.garage.length === 1) {
      this.myGarage.current = this.myGarage.garage[0];
    }
    if (ev.target.dataset.for === this.hashStr(JSON.stringify(this.myGarage.current))) {
      this.myGarage.current = this.myGarage.garage[0];
    }
    if (this.myGarage.garage.length === 0) {
      this.myGarage.current = {
        "year": "",
        "make": "",
        "equipmenttype": "",
        "model": ""
      };
    }
    this.saveGarageToStorage();
    this.storeGarageinShop().then(() => {
      this.showCurrentVehicle();
    });
  }

  hashStr(s) {
    let h =0;
    for (let i = 0; i < s.length; i++) {
      h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    }
    return h;
  }

  isInGarage(m) {
    for (let i = 0; i < this.myGarage.garage.length; i++) {
      const mexists = this.myGarage.garage[i];
      if (m.handle === mexists.handle) {
        return true
      }
    }
    return false
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
}

