let display = document.querySelector("#display");

let buttons = Array.from(document.querySelectorAll('.button'));

//console.log(buttons);

buttons.map( button => {
    button.addEventListener('click', (event) => {
        switch(event.target.innerText){
            case 'C':
                display.innerText = '';
                break;
            case '←':
                if(display.innerText){
                    //removes one character from the end
                    display.innerText = display.innerText.slice(0, -1);
                }
                break;
            /* contains regex to replace malicious code. But never use eval(), only use here for brevity*/
            case '=': 
                try{
                    display.innerText = eval(display.innerText.replace(/[^-+/*\d]/g, ''));
                    // display.innerText = eval(display.innerText);
                } catch{
                    display.innerText = "Error Invalid Input";
                }
                break;
            default:
                display.innerText += event.target.innerText;

        }
    });
});