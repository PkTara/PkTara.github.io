var atrPoints = []

function randi(max) {
    return Math.floor(Math.random() * max);
  }

function getDicePools() { // Into normDice, hungerDice
    var totalDice = getTotalDice_fromAttributes()
    var hunger = parseInt(document.getElementById("hunger").value)

    var normDice = (totalDice - hunger > 0) ? (totalDice - hunger) : 0; // normal dice is leftover dice after hunger dice taken, but this can't go below zero
    var hungerDice = Math.min(hunger, totalDice) // if hunger is 3 but totalDice is 2, can only show 2 hunger dice
 
    normDice = Math.min(normDice, 100) // limits no. dice to 100
 
    return([normDice, hungerDice])
}

function printPotentialDice(clear=true) {
    var [normDice, hungerDice] = getDicePools() 

    if (clear) {clearDiceBox()}

    for (const [index, dicePool] of [hungerDice, normDice].entries()){
        for (let i=0; i < dicePool; i++) {
            document.getElementById(['hungerDiceBox','normalDiceBox'][index])
            .innerHTML += `<img src='img/rolls/${ ["red-fail.png", "normal-fail.png"][index]}'>`
            }
        }
}

function clearDiceBox(clearHunger=true, clearNormal=true) {
    for (let [index, box] of ["hungerDiceBox" , "normalDiceBox"].entries()) {
        if ([clearHunger, clearNormal][index]) {console.log(box);document.getElementById(box).innerHTML = ""}
        console.log(clearHunger)
    }

}
function printDice(normalDice, hungerDice, clear=true) {
    if (clear) {clearDiceBox()}

    var [normalDice, normalSuccesses] = evaluateDicePool(normalDice, 0)
    var [hungerDice, hungerSuccesses] = evaluateDicePool(hungerDice, 1)

    for (const [index, dicePoolIMG] of [hungerDice, normalDice].entries()) {
        for (let img of dicePoolIMG) {
            document.getElementById(['hungerDiceBox','normalDiceBox'][index])
            .innerHTML += `<img class=${["hungerIMG", "normalIMG"][index]} src='${img}'>`
            }
        }

    printResultText(normalSuccesses, hungerSuccesses)
}

function printResultText(normalSuccesses, hungerSuccesses) { // [success, crit, bestial]
    console.log(normalSuccesses["crit"])
    var totalSuccesses = normalSuccesses["success"] + hungerSuccesses["success"] + normalSuccesses["crit"] + hungerSuccesses["crit"]
    var totalPairs = (Math.floor((normalSuccesses["crit"] + hungerSuccesses["crit"]) / 2)) * 2
    totalSuccesses += (Math.floor((normalSuccesses["crit"] + hungerSuccesses["crit"]) / 2)) * 2
   
    var difficulty = parseInt(document.getElementById("diffOpt").value )
    var notFail = totalSuccesses >= difficulty // Did roll succeed? (but that word is used way too much here...)

    var addToHTML = ``
    addToHTML += 
    `<h4>Successes: ${totalSuccesses}</h4>`
    if (hungerSuccesses["bestial"] && (difficulty == 0 || !notFail)) {
        addToHTML += `<p> ${difficulty ? "" : "Possible"} Bestial Failure</p>`
    }
    if (totalPairs && hungerSuccesses["crit"] && (difficulty == 0 || notFail)) {
        addToHTML += `<p>${difficulty ? "" : "Possible"} Messy Critical</p>`
    }
    if (difficulty) { 
        addToHTML += `<p><strong>${notFail ? "Roll Succeeded!" : "Roll Failed"}</strong></p>`
    }


    document.getElementById("result").innerHTML = addToHTML
}


function rollDice (noDice) {
    var [no_normal, no_hunger] = noDice ? [noDice, 0] : getDicePools()  // if noDice was passed as parameter, use it, else find out from user options


    var normalDice = []
    var hungerDice = []
    for (let dicePool of [[no_normal, normalDice], [no_hunger, hungerDice]]) {
        for (let i = 0; i < dicePool[0]; i++) {
            dicePool[1].push(randi(10) + 1)
        }
    }

    printDice(normalDice, hungerDice, noDice ? false : true)
    
}
function evaluateDicePool(diceList, isHunger) {
    var successes = {"success" : 0, "crit" : 0, "bestial" : 0, "isHunger": isHunger}
    var diceIMGlist = []
    for (let dice of diceList) {
        if (dice==1 && isHunger) {
            diceIMGlist.push("img/rolls/bestial-fail.png")
            successes["bestial"] += 1
        }
        else if (dice < 6) {
            diceIMGlist.push(`img/rolls/${["normal", "red"][isHunger]}-fail.png`)
        }
        else if (dice==10) {
            diceIMGlist.push(`img/rolls/${["normal", "red"][isHunger]}-crit.png`)
            successes["crit"] += 1
        }
        else if (dice < 10) {
            diceIMGlist.push(`img/rolls/${["normal", "red"][isHunger]}-success.png`)
            successes["success"] += 1
        }
        else {
            console.log("ERROR:", dice)
        }
        }

    return([diceIMGlist, successes])
    }

function willpower() {
    console.log("I GOT THE POWER!")
    var normalDice = Object.values(document.getElementsByClassName("normalIMG"))
    if (normalDice.length) { // If there are any normal dice,
        var addToHTML = `<div id="willpower-dice">`
        for (var ankh of normalDice) {
            addToHTML += `<btn class="will" onclick=selectDie(this)><img src=${ankh.src}></btn>`
        }
        addToHTML += `</div>`
        document.getElementById("normalDiceBox").innerHTML = addToHTML
    
        document.getElementById("willpower").innerHTML = "Reroll"
        document.getElementById("willpower").onclick = willpowerReroll

}
}
function selectDie(button) {
    if (Object.values(button.classList).includes("will-selected")) {
        button.classList.remove("will-selected")
    } 
    else if (document.getElementsByClassName("will-selected").length < 3){
        button.classList.add("will-selected")
    }
    }
function willpowerReroll() {
    var selected = document.getElementsByClassName("will-selected")
    rollDice(selected.length)
    while(selected.length > 0){
        selected[0].parentNode.removeChild(selected[0]);
        }
    

    var addToHTML = ""
    var willDice = Object.values(document.getElementsByClassName("will"))
    console.log(willDice)
    if (willDice.length) { // If there are any will dice left,
        for (var ankh of willDice) {
            addToHTML += `<img class="normalIMG" src=${ankh.children[0].src}>`
        }}
        document.getElementById("normalDiceBox").innerHTML += addToHTML
    
    
    willDice = document.getElementsByClassName("will")
    while(willDice.length > 0){
        willDice[0].parentNode.removeChild(willDice[0]);
        }

       
    document.getElementById("willpower").innerHTML = "Willpower"
    document.getElementById("willpower").onclick = willpower
}



function rouseCheck() {
    clearDiceBox()
   
    document.getElementById("diffOpt").value = 1
    printDice([randi(10) + 1], [])
}

fetch('./attributesList.json')
    .then((response) => response.json())
    .then((json) => {
        for (let attr of [[Object.entries(json.attributes), "attribute"], [Object.entries(json.skills), "skill"]]) {
            for (let attribute of attr[0]) {
                var addtoHTML = ``
                addtoHTML += "<div class='attribute-div'>"

                for (let i=0; i<5; i++) {
                    addtoHTML += 
                    `<input type="checkbox" 
                    oninput="fiveChecked('${attribute[0]}', ${i}, this.checked)"
                    class="atrPoints ${attribute[0]}"
                    >`
                }

                addtoHTML += 
                `<li class="attrText"
                title="${attribute[1].tooltip}">
                ${attribute[0]}</li>
                </div> 
                `;
                
                document.getElementById(`${attr[1]}Ul`)
                .innerHTML += addtoHTML

                // For Dropdown Selection

                document.getElementById(`select_${attr[1]}`)
                .innerHTML += 
                `<option value="${attribute[0]}">${attribute[0]}</option> `

            
            }
            
        }
    });

function getTotalDice_fromAttributes() {
    const attribute = document.getElementById("select_attribute").value
    const skill = document.getElementById("select_skill").value
    var totalDice = parseInt(document.getElementById("addDice").value)
    
    if (attribute != "none"){
        var collection = document.getElementsByClassName(attribute)
        totalDice += [...collection].filter(x => x.checked).length
    }
    if (skill != "none") {
        var collection2 = document.getElementsByClassName(skill)
        totalDice += [...collection2].filter(x => x.checked).length
    }

    return(totalDice)
}




function fiveChecked(attribute,  index, value) {
    const collection = document.getElementsByClassName(attribute); 
    var shouldUncheckFirst = collection[1].checked // if second item is also false
    index += 1 // so loop repeats correct number of times

    for (let i=0; i !=collection.length; i++) { // resets checked boxes
        collection[i].checked = false
    }
    for (let i=0; i < index; i++) {  // checks all boxes before clicked
        collection[i].checked = true
    }
    if (index == 1 && !shouldUncheckFirst) { // allows unchecking of first box
        collection[0].checked = value
    }

    var no_checked = 0  // collecting no_checked for attributes
    for (let i=0; i < collection.length; i++) {
        if (collection[i].checked) {
            no_checked += 1
        }
    }
    atrPoints.push([attribute, no_checked])
    
}