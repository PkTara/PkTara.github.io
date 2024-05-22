var dice = [0,0] // 0 is hunger, 1 is normal
var atrPoints = []

function randi(max) {
    return Math.floor(Math.random() * max);
  }

function calcDiceType() {
    var totalDice = getTotalDice_fromAttributes()
    var hunger = parseInt(document.getElementById("hunger").value)

    var normDice = (totalDice - hunger > 0) ? (totalDice - hunger) : 0; // normal dice is leftover dice after hunger dice taken, but this can't go below zero
    var hungerDice = Math.min(hunger, totalDice) // if hunger is 3 but totalDice is 2, can only show 2 hunger dice
 
    normDice = Math.min(normDice, 100) // limits no. dice to 100
 
    return([normDice, hungerDice])
}

function noDice() { // index - 0 is hunger, 1 is normal
    
   // dice[index] = number
  //  var normDice = (dice[1] - dice[0] > 0) ? (dice[1] - dice[0]) : 0;
   // var hungerDice = Math.min(dice[0], dice[1])

    var [normDice, hungerDice] = calcDiceType() 

    clearDiceBox()

    for (let type of [[normDice, 1], [hungerDice, 0]]) {
        for (let i=0; i < type[0]; i++) {
            document.getElementById(['hungerDiceBox','normalDiceBox'][type[1]])
            .innerHTML += `<img src='img/rolls/${ ["red-fail.png", "normal-fail.png"][type[1]]}'>`
            }
        }
}

function clearDiceBox() {
    for (let box of ["hungerDiceBox" , "normalDiceBox"]) {
        document.getElementById(box).innerHTML = ""
    }
}
function printDice(normalDice, hungerDice) {
    clearDiceBox()

    var [normalDice, normalSuccesses] = numberToRoll(normalDice, 0)
    var [hungerDice, hungerSuccesses] = numberToRoll(hungerDice, 1)

    for (let type of [[normalDice, 1], [hungerDice, 0]]) {
        for (let img of type[0]) {
            document.getElementById(['hungerDiceBox','normalDiceBox'][type[1]])
            .innerHTML += `<img src='${img}'>`
            }
        }

    printSuccesses(normalSuccesses, hungerSuccesses)
}

function printSuccesses(normalSuccesses, hungerSuccesses) { // success, crit, bestial
    var totalSuccesses = normalSuccesses[0] + hungerSuccesses[0] + normalSuccesses[1] + hungerSuccesses[1]
    var totalPairs = (Math.floor((normalSuccesses[1] + hungerSuccesses[1]) / 2)) * 2
    totalSuccesses += (Math.floor((normalSuccesses[1] + hungerSuccesses[1]) / 2)) * 2
   
    var difficulty = parseInt(document.getElementById("diffOpt").value )
    console.log(difficulty)

    var addToHTML = ``
    addToHTML += 
    `<h4>Successes: ${totalSuccesses}</h4>`
    if (hungerSuccesses[2]) {
        addToHTML += " <p> Possible bestial failure</p>"
    }
    if (totalPairs && hungerSuccesses[1]) {
        addToHTML += "<p>Possible Messy Critical</p>"
    }


    document.getElementById("result").innerHTML = addToHTML
}

function willpower() {
    document.getElementById()
}
function rollDice () {
    var [no_normal, no_hunger] = calcDiceType()


    var normalDice = []
    var hungerDice = []
    for (let dicePool of [[no_normal, normalDice], [no_hunger, hungerDice]]) {
        for (let i = 0; i < dicePool[0]; i++) {
            dicePool[1].push(randi(10) + 1)
        }
    }
    printDice(normalDice, hungerDice)
}
function numberToRoll(diceList, isHunger) {
    var successes = [0,0,0] // normal, critical, bestial
    var diceIMGlist = []
    for (let dice of diceList) {
        if (dice==1 && isHunger) {
            diceIMGlist.push("img/rolls/bestial-fail.png")
            successes[2] += 1
        }
        else if (dice < 6) {
            diceIMGlist.push(`img/rolls/${["normal", "red"][isHunger]}-fail.png`)
        }
        else if (dice==10) {
            diceIMGlist.push(`img/rolls/${["normal", "red"][isHunger]}-crit.png`)
            successes[1] += 1
        }
        else if (dice < 10) {
            diceIMGlist.push(`img/rolls/${["normal", "red"][isHunger]}-success.png`)
            successes[0] += 1
        }
        else {
            console.log("ERROR:", dice)
        }
        }

    return([diceIMGlist, successes])
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