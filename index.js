var dice = [0,0] // 0 is hunger, 1 is normal
var atrPoints = []
document.getElementById("diceOptions").reset(); 

function randi(max) {
    return Math.floor(Math.random() * max);
  }

function noDice(number, index) { // index - 0 is hunger, 1 is normal
    dice[index] = number
    var normDice = (dice[1] - dice[0] > 0) ? (dice[1] - dice[0]) : 0;
    var hungerDice = Math.min(dice[0], dice[1])

    normDice = Math.min(normDice, 100) // limits no. dice to 100

    clearDiceBox()

    console.log(normDice, hungerDice)
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

    x = numberToRoll(normalDice, 0)
    normalDice = x[0]
    var successes = x[1]
    x = numberToRoll(hungerDice, 1)
    hungerDice = x[0];
    successes += x[1];

    console.log(normalDice, hungerDice)
    for (let type of [[normalDice, 1], [hungerDice, 0]]) {
        console.log(type[0])
        for (let img of type[0]) {
            document.getElementById(['hungerDiceBox','normalDiceBox'][type[1]])
            .innerHTML += `<img src='${img}'>`
            }
        }


}
function rollDice () {
    var no_normal = (dice[1] - dice[0] > 0) ? (dice[1] - dice[0]) : 0;
    var no_hunger = Math.min(dice[0], dice[1])


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
   // dice=[1,0]
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
                `<li 
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

function roll_with_attributes() {

}

function unhideAttributes() {

}
function fiveChecked(attribute,  index, value) {
    console.log(attribute, index, value)
    const collection = document.getElementsByClassName(attribute); 
    var shouldUncheckFirst = collection[1].checked // if second item is also false
    index += 1 // so loop repeats correct number of times

    for (let i=0; i !=collection.length; i++) { // resets checked boxes
        collection[i].checked = false
    }
    for (let i=0; i < index; i++) {  // checks all boxes before clicked
        collection[i].checked = true
    }
    console.log(collection[1].checked)
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