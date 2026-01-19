//REFORMERS Training
//Author : Lorenzo Cane, Deep Blue S.r.l.

//Last Version : 19/01/2026
//=========================================================
//CONST & GLOBAL VAR
const exportCSVBtn = document.querySelector("#CSVexport");
const exportPDFBtn = document.querySelector("#PDFexport");
const addIndicatorBtn = document.querySelector(".addIndicatorBtn");
const defaultBtn = document.querySelector(".defaultBtn");

const projectTitleInput = document.querySelector(".projectTitleInput");
const investmentCost = document.querySelector('#investmentValue');

const ratioUnit = document.querySelector("#ratioType");
const ratioValueInput = document.querySelector("#ratioValue");

//Default Example
const defaultSetup = [
    {
        id: 1,
        name: 'Youth Unemployment',
        weight: 2,
        proxies: [
            { id: 1, name: 'State subsidy savings', value: 15000 },
            { id: 2, name: 'New taxes paid', value: 5000 },
            { id: 3, name: 'Healthcare savings', value: 1000 }
        ]
    },
    {
        id: 2,
        name: 'Higher skills in existing workforce',
        weight: 5,
        proxies: [
            { id: 1, name: 'Training value', value: 10000 }
        ]
    },
    {
        id: 3,
        name: 'Lower air pollution',
        weight: 7,
        proxies: [
            { id: 1, name: 'Healthcare savings', value: 7000 }
        ]
    }
];


var indicators = JSON.parse(JSON.stringify(defaultSetup));

var projectName = projectTitleInput.value;
var ratioType = '';
var ratioValue = 0;
//=========================================================
//FUNCTIONS

//General Utils
function getMaxId(arr, prop) {
    //Get the number of higher Indicator or proxy. To assign the correct one to the next
    var max = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][prop] > max) {
            max = arr[i][prop];
        }
    }
    return max;
}

//Create a generic element in HTML with a class and a content
function createElement(tag, className, content) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content;
    return element;
}

function updateInvestmentCost(value) {
    let checkedValue = Math.max(1, parseInt(value));
    investmentCost.value = checkedValue;
    renderAll();
}

function updateRatioUnit(unit) {
    ratioType = unit;
    renderAll();
}

function updateRatioValue(value) {
    let checkedValue = Math.max(0, parseInt(value));
    ratioValue = checkedValue;
    renderAll();
}

//--------------------------------------------------------
// LOGIC IMPLEMENTATION

// Implement Multipliers logic based on selected Stakeholder Weight. No (1-10) check here because it is done in the code
function getMultiplier(weight) {
    if (weight >= 4 && weight <= 7) return 1.25;
    if (weight >= 8 && weight <= 10) return 1.5;

    return 1;
}

//Raw value as some of proxy value
function calculateRawValue(proxies) {
    let rawValue = proxies.reduce(function (sum, proxy) {
        return sum + (parseFloat(proxy.value) || 0);
    }, 0);

    return rawValue;
}

//Results for a single indicators
function calculateResult(indictor) {
    const rawValue = calculateRawValue(indictor.proxies);
    const multiplier = getMultiplier(indictor.weight);

    return rawValue * multiplier;
}

//Total impact as sum of indicators results
function getTotalImpact() {
    let impact = indicators.reduce(function (sum, ind) {
        return sum + calculateResult(ind);
    }, 0);

    return impact;
}

//SROI calculation 
function calculateSROI() {
    var totalImpact = getTotalImpact();

    return totalImpact / investmentCost.value;
}

//Obtain impact normalizaed per selected unit or total impact
function getValueWithRatio(value) {
    if (ratioType && ratioValue > 0) {
        var normalizedValue = value / ratioValue;
        return '€' + normalizedValue.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }) + ' / ' + ratioUnit.value;
    }

    return '€' + value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

//--------------------------------------------------------
//Indicators Functions

//To find
function findIndicatorById(id) {
    return indicators.find(function (ind) {
        return ind.id === id;
    });
}

//Update every possible field with input value
function updateIndicator(id, field, value) {
    let indicator = findIndicatorById(id);

    if (indicator) {
        if (field === 'weight') {
            indicator[field] = Math.min(10, Math.max(1, parseInt(value) || 1));
        } else {
            indicator[field] = value;
        }
        renderAll();
    }
}

//To remove indicator
function removeIndicatorById(id) {
    indicators = indicators.filter(function (ind) {
        return ind.id !== id;
    });
    renderAll();
}

//New indicator creation, as lat one. Use max ID to assign number
function addNewIndicator() {
    var newId = getMaxId(indicators, 'id') + 1;
    indicators.push({
        id: newId,
        name: 'New Indicator ' + newId,
        weight: 5,
        proxies: [{ id: 1, name: 'Proxy 1', value: 0 }]
    });
    renderAll();
}

//Update indicators
function updateIndicatorField(id, field, value) {
    var indicator = findIndicatorById(id);
    if (indicator) {
        if (field === 'weight') {
            indicator[field] = Math.min(10, Math.max(1, parseInt(value) || 1));
        } else {
            indicator[field] = value;
        }
        renderAll();
    }
}

//Indicator header with name and info
function createIndicatorHeader(indicator) {
    var header = createElement('div', 'indicatorHeader');

    var nameGroup = createElement('div', 'formGroup');
    nameGroup.innerHTML = '<label>Indicator Name</label>';
    var nameInput = createElement('input');
    nameInput.type = 'text';
    nameInput.value = indicator.name;
    nameInput.placeholder = 'Type indicator name'
    nameInput.addEventListener('change', function (e) {
        var newName = e.target.value === '' ? 'Indicator name undefined' : e.target.value;
        updateIndicatorField(indicator.id, 'name', newName);
    });
    nameGroup.appendChild(nameInput);

    var weightGroup = createElement('div', 'formGroup weightGroup');
    weightGroup.innerHTML = '<label>Stakeholder Weight (1-10)</label>';
    var weightInput = createElement('input');
    weightInput.type = 'number';
    weightInput.min = '1';
    weightInput.max = '10';
    weightInput.value = indicator.weight;
    weightInput.placeholder = 'Insert valid weight (1-10)'
    weightInput.addEventListener('change', function (e) {
        updateIndicatorField(indicator.id, 'weight', e.target.value);
    });
    weightGroup.appendChild(weightInput);

    var deleteBtn = createElement('button', 'deleteIndicatorBtn', '🗑️ Delete Indicator');
    deleteBtn.addEventListener('click', function () {
        removeIndicatorById(indicator.id);
    });

    header.appendChild(nameGroup);
    header.appendChild(weightGroup);
    header.appendChild(deleteBtn);

    return header;
}

//Note section for each indicator
function createNoteSection(indicator) {
    var section = createElement('div', 'noteSection');
    var label = createElement('label', 'noteLabel');
    var textArea = createElement('textarea', 'noteText');

    label.textContent = 'Notes (3 rows limit)';
    label.style.display = 'block';

    textArea.value = indicator.notes || '';
    textArea.addEventListener('change', function (e) {
        updateIndicatorField(indicator.id, 'notes', e.target.value);
    });


    section.appendChild(label);
    section.appendChild(textArea);

    return section;
}

//Create the whole indicator box
function createIndicatorCard(indicator) {
    var card = createElement('div', 'indicatorCard');

    card.appendChild(createIndicatorHeader(indicator));
    card.appendChild(createProxiesSection(indicator));
    card.appendChild(createNoteSection(indicator));
    card.appendChild(createResultsGrid(indicator));

    return card;
}

//--------------------------------------------------------
//Proxies Function

//Select the correct indicator and add proxy
function addProxyToIndicator(indicatorId) {
    let indicator = findIndicatorById(indicatorId);
    if (indicator) {
        let newProxyId = Math.max.apply(Math, indicator.proxies.map(function (p) { return p.id; })) + 1;
        indicator.proxies.push({ id: newProxyId, name: 'Proxy ' + newProxyId, value: 0 });
        renderAll();
    }
}

function removeProxyFromIndicator(indicatorId, proxyId) {
    var indicator = findIndicatorById(indicatorId);
    if (indicator && indicator.proxies.length > 1) {
        indicator.proxies = indicator.proxies.filter(function (p) {
            return p.id !== proxyId;
        });
        renderAll();
    }
}

function updateProxyField(indicatorId, proxyId, field, value) {
    var indicator = findIndicatorById(indicatorId);
    if (indicator) {
        var proxy = indicator.proxies.find(function (p) {
            return p.id === proxyId;
        });
        if (proxy) {
            proxy[field] = field === 'value' ? (parseFloat(value) || 0) : value;
            renderAll();
        }
    }
}

//Create the proxy into the HTML file with all its class and listeners
function createProxyRow(indicatorId, proxy, isOnlyProxy) {
    var row = createElement('div', 'proxyRow');

    var nameDiv = createElement('div', 'proxyName');
    var nameInput = createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Type proxy name';
    nameInput.value = proxy.name;
    nameInput.addEventListener('change', function (e) {
        var newName = e.target.value === '' ? 'Proxy name undefined' : e.target.value;
        updateProxyField(indicatorId, proxy.id, 'name', newName);
    });
    nameDiv.appendChild(nameInput);

    var valueDiv = createElement('div', 'proxyValue');
    var valueInput = createElement('input');
    valueInput.type = 'number';
    valueInput.placeholder = 'Insert value';
    valueInput.value = proxy.value;
    valueInput.addEventListener('change', function (e) {
        updateProxyField(indicatorId, proxy.id, 'value', e.target.value);
    });
    valueDiv.appendChild(valueInput);

    var deleteBtn = createElement('button', 'deleteProxyBtn', '🗑️ Delete proxy');
    deleteBtn.disabled = isOnlyProxy;
    deleteBtn.addEventListener('click', function () {
        removeProxyFromIndicator(indicatorId, proxy.id);
    });

    row.appendChild(nameDiv);
    row.appendChild(valueDiv);
    row.appendChild(deleteBtn);

    return row;
}

//Create the global Proxies section of an indicator
function createProxiesSection(indicator) {
    var section = createElement('div', 'proxiesSection');

    var header = createElement('h4');
    header.textContent = 'Proxies ';
    var addBtn = createElement('button', 'addProxyBtn', '➕ Add new proxy');
    addBtn.addEventListener('click', function () {
        addProxyToIndicator(indicator.id);
    });
    header.appendChild(addBtn);
    section.appendChild(header);

    indicator.proxies.forEach(function (proxy) {
        var proxyRow = createProxyRow(indicator.id, proxy, indicator.proxies.length === 1);
        section.appendChild(proxyRow);
    });

    return section;
}

//--------------------------------------------------------
//Results function
function createResultsGrid(indicator) {
    var rawValue = calculateRawValue(indicator.proxies);
    var multiplier = getMultiplier(indicator.weight);
    var result = calculateResult(indicator);

    var grid = createElement('div', 'resultsGrid');

    var rawItem = createElement('div', 'resultItem');
    rawItem.innerHTML = '<div class="resultLabel">Raw Value</div>' +
        '<div class="resultValue">€' + rawValue.toLocaleString() + '</div>';

    var multItem = createElement('div', 'resultItem');
    multItem.innerHTML = '<div class="resultLabel">Multiplier</div>' +
        '<div class="resultValue">' + multiplier + 'x</div>';

    var resItem = createElement('div', 'resultItem');
    resItem.innerHTML = '<div class="resultLabel">Result</div>' +
        '<div class="resultValue">€' + result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</div>';

    grid.appendChild(rawItem);
    grid.appendChild(multItem);
    grid.appendChild(resItem);

    return grid;
}

//--------------------------------------------------------
// RENDER FUNCTIONS 

//Update indicatos
function renderIndicators() {
    var container = document.querySelector(".indicatorsContainer");
    container.innerHTML = '';

    indicators.forEach(function (indicator) {
        var card = createIndicatorCard(indicator);
        container.appendChild(card);
    });
}

//Update total impact & SROI as a consecuence => SROI update all the time
function renderTotalImpact() {
    var totalElement = document.querySelector('.impactValue');
    var totalImpact = getTotalImpact();

    //Impact (normalized or total)
    totalElement.textContent = getValueWithRatio(totalImpact);

    //SROI
    var sroi = calculateSROI();
    console.log(sroi);
    var sroiElement = document.getElementById('SROIValue');
    sroiElement.textContent = sroi.toFixed(2) + ':1';

}

function renderAll() {
    document.title = projectName;
    renderIndicators();
    renderTotalImpact();
}

//--------------------------------------------------------
//Export function

function exportToCSV() {
    var csv = 'Analysis Name: ' + projectName + '\n\n';
    csv += 'Indicator,Stakeholder Weight (1-10),Proxy,Proxy Value,Raw Value,Multiplier,Result\n';

    for (var i = 0; i < indicators.length; i++) {
        var ind = indicators[i];
        var rawValue = calculateRawValue(ind.proxies);
        var multiplier = getMultiplier(ind.weight);
        var result = calculateResult(ind);

        for (var j = 0; j < ind.proxies.length; j++) {
            var proxy = ind.proxies[j];
            if (j === 0) {
                csv += '"' + ind.name + '",' + ind.weight + ',"' + proxy.name + '",€' + proxy.value + ',€' + rawValue + ',' + multiplier + ',€' + result.toFixed(2) + '\n';
            } else {
                csv += ',,"' + proxy.name + '",€' + proxy.value + ',,,\n';
            }
        }
    }

    //csv += '\n Impact,,,,,,€' + getValueWithRatio(getTotalImpact());
    //csv += '\nInvestment Cost,,,,,,€' + investmentCost.value;
    //csv += '\nSROI Ratio,,,,,,' + sroi.toFixed(2) + ':1';

    var blob = new Blob([csv], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = projectName + '.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

//Print screen info without btns (button must be query here because new one could be created)
function exportToPDF() {
    document.title = projectName;
    window.print();
}

//--------------------------------------------------------
//Reset function
function resetToDefault() {
    var container = document.querySelector('.indicatorsContainer');
    container.innerHTML = '';
    indicators = defaultSetup;
    renderAll();
}


//=========================================================
//Buttons actions

//New indicator
addIndicatorBtn.addEventListener("click", addNewIndicator);
//Default reset
defaultBtn.addEventListener("click", () => {
    window.location.reload();
});
//Export to CSV
exportCSVBtn.addEventListener("click", exportToCSV);
//Export to PDF
exportPDFBtn.addEventListener("click", exportToPDF);

//Change title
projectTitleInput.addEventListener("change", (e) => {
    projectName = e.target.value;
    renderAll();
});

//Change investment cost
investmentCost.addEventListener("change", function (e) {
    updateInvestmentCost(e.target.value);
});

//Change Ratio
ratioUnit.addEventListener("change", function (e) {
    updateRatioUnit(e.target.value);
});
ratioValueInput.addEventListener("change", function (e) {
    updateRatioValue(e.target.value);
});
//=========================================================
renderAll();