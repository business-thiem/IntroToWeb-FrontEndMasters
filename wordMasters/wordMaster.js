const letterBoxes = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");
const winningBody = document.querySelector("body");
const resetBtn = document.querySelector('#reset');

const ANSWER_LENGTH = 5;
const ROUNDS = 6;
let WORD_OF_DAY = '';
const WORD_API_URL = "https://words.dev-apis.com/word-of-the-day?random=1";
const WORD_VALIDATOR_URL = "https://words.dev-apis.com/validate-word"; //TODO fill the url with post url

let isLoading = true; 

async function getWordOfDay(){
    const promise = await fetch(WORD_API_URL);
    const processedResponse = await promise.json()
    WORD_OF_DAY = processedResponse.word.toUpperCase();
    console.log("the word of the day is: "+WORD_OF_DAY);
}


function setLoading(isLoading){
    loadingDiv.classList.toggle('hidden', !isLoading);
    // isLoading = false;
}

//main function
async function init(){
    getWordOfDay();
    setLoading(false);

    let currentGuess = '';
    let currentRow = 0;
    let done = false;

    function addLetter(letter){
        if (currentGuess.length < ANSWER_LENGTH){
            // add letter to the end
            currentGuess += letter;
        } else {
            // replace the last letter
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
        }
        letterBoxes[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter; //updates boxes of the text with letter
    }
    function backspace(){
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letterBoxes[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
    }

    async function commit(){
        if(currentGuess.length != ANSWER_LENGTH){
            // answer not long enough so do nothing;
            return;
        }
        
        if(currentGuess.length === ANSWER_LENGTH){
            isLoading = true;
            setLoading(true); //stops user from making changes until word is checked

            const response = await fetch(WORD_VALIDATOR_URL, {
                method: "POST",
                body: JSON.stringify({ word: currentGuess }),
            });
            const { validWord } = await response.json();

            isLoading = false;
            setLoading(false); //server has responded, so user can make changes again
        
            if (!validWord){
                markInvalidWord();
                // alert("invalid word");
                return;
            }
        }

        if(currentGuess === WORD_OF_DAY){
            winningBody.classList.add("winner"); //TODO check if this is correct
            done = true;
            alert("you win!");
            return;
        }

        const guessParts = currentGuess.split("");
        const wordParts = WORD_OF_DAY.split("");

        const map = makeMap(wordParts); //keeps track of how many letters are in each word. Can use a letter inside array bracket to get count
        //test functionality with console: x = makeMap("POOLS".split("")) 
        //then: x['L'] 
        //then: x['O']

        for(let i = 0; i < ANSWER_LENGTH; i++){
            //mark as correct
            if(guessParts[i] === wordParts[i]){
                letterBoxes[currentRow * ANSWER_LENGTH + i].classList.add("correct");
                map[guessParts[i]]--;
            }
        }
        
        //separated the loops for simplicity
        for(let i = 0; i < ANSWER_LENGTH; i++){
            //mark as close and wrong
            if(guessParts[i] === wordParts[i]){
                //do nothing
            } else if (wordParts.includes(guessParts[i]) &&  map[guessParts[i]] > 0){
                letterBoxes[currentRow * ANSWER_LENGTH + i].classList.add("close");
                map[guessParts[i]]--;
            } else {
                letterBoxes[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
            }
        }

        currentRow++;
        currentGuess = '';

        if(currentRow === ROUNDS){
            alert(`you lose, the word was ${WORD_OF_DAY}`);
            done = true;
        }

    }

    function markInvalidWord(){
        for (let i= 0; i < ANSWER_LENGTH; i++){
            letterBoxes[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");
    
            setTimeout(function () {
                letterBoxes[currentRow * ANSWER_LENGTH + i].classList.add("invalid")}
                , 5);
        }
    }



    document.addEventListener('keydown', function handleKeyPress(event) {
        if(done || isLoading){
            //do nothing
            return;
        }

        const action = event.key;

        if (action === 'Enter'){
            commit();
        } else if(action === 'Backspace'){
            backspace();
        } else if(isLetter(action)){
            addLetter(action.toUpperCase());
        } else {
            // does nothing if it is not any button or character that is stated above
        }
    });

    resetBtn.addEventListener("click", function(event){
        currentGuess = '';
        currentRow = 0;
        done = false;
        
        winningBody.classList.remove('winner');
        
        for(let i = 0; i < letterBoxes.length; i++){
            letterBoxes[currentRow * ANSWER_LENGTH + i].innerText = '';
            letterBoxes[currentRow * ANSWER_LENGTH + i].classList.remove('invalid');
            letterBoxes[currentRow * ANSWER_LENGTH + i].classList.remove('close');
            letterBoxes[currentRow * ANSWER_LENGTH + i].classList.remove('correct');
            letterBoxes[currentRow * ANSWER_LENGTH + i].classList.remove('wrong');
        }
        
    })
}

//cheat button - shows answer in button text
const cheatButton = document.querySelector('#answer');
let isNotCheatting = true;
cheatButton.addEventListener("click", function(event){
    if(isNotCheatting){
        cheatButton.innerText = WORD_OF_DAY;
        isNotCheatting = false;
    }else{
        cheatButton.innerText = "Here is the word you cheater";
        isNotCheatting = true;
    }
});

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

//keeps track of how many letters are in each word 
function makeMap (array){
    const obj = {} //makes object of each unique letter
    for (let i = 0; i < array.length; i++){
        const letter = array[i];
        if (obj[letter]){ //if you already have object then increment 1
            obj[letter]++;
        } else{
            obj[letter] = 1;
        }
    }
    return obj;
}



init(); //calls main function
isLoading = false;
