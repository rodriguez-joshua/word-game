new Sortable(document.getElementById('sortable-list'), {
    animation: 300, // Set animation duration (in milliseconds)
    swapThreshold: 1,
   // ghostClass: 'highlight-bg',
     swap: true,
     swapClass: 'highlight-bg',
});

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

let easyWords;
let mediumWords;
let hardWords;

const easyBtn = document.getElementById('easyLevel');
const midBtn = document.getElementById('midLevel');
const hardBtn = document.getElementById('hardLevel');

const introGame = document.getElementById('introGame');
const playGame = document.getElementById('playGame');

const container = document.getElementById('sortable-list');
const submitBtn = document.getElementById('submitButton');
const letterList = document.getElementById('sortable-list').childNodes;
const scoreText = document.getElementById('countdown');

let dict;
let score = 0;

let originalWord;
let scrabbledWord;

let selectedWord
let wordDef

let selectedElements = [];

let strikes = 0;

// Function to fetch words data
function fetchWordsData() {
    fetch('./dict2.json')
        .then((response) => response.json())
        .then((data) => {
            easyWords = data.easy;
            mediumWords = data.medium;
            hardWords = data.hard;
        })
        .catch((error) => {
            console.error('Error fetching JSON:', error);
        });
}

window.onload = fetchWordsData;

function startGame() {
    // originalWord = getRandomElementFromArray(dict).toUpperCase();
    selectedWord = getRandomElementFromArray(dict);
    originalWord = selectedWord.word.toUpperCase()
    wordDef = selectedWord.definition;
    fetchWordDefinition(wordDef);
    scrabbledWord = scrabbleWord(originalWord).toUpperCase();
    splitStringAndCreateElements(scrabbledWord, container);
}

function scrabbleWord(word) {
    let shuffledWord = word;

    while (shuffledWord === word) {
        let letters = word.split('');

        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }

        shuffledWord = letters.join('');
    }

    return shuffledWord;
}

function getRandomElementFromArray(arr) {
    const availableElements = arr.filter(
        (element) => !selectedElements.includes(element)
    );

    if (availableElements.length === 0) {
        // Reset selectedElements if all elements have been selected
        selectedElements = [];
        return null;
    }

    const randomIndex = Math.floor(Math.random() * availableElements.length);
    const randomElement = availableElements[randomIndex];

    // Add the selected element to the selectedElements array
    selectedElements.push(randomElement);
    console.log(randomElement);

    return randomElement;
}

fetchWordDefinition(originalWord);

function splitStringAndCreateElements(str, parentElement) {
    const letters = str.split('');

    letters.forEach((letter) => {
        const letterElement = document.createElement('li');
        letterElement.textContent = letter;

        parentElement.appendChild(letterElement);
    });
}

function getTextFromUl() {
    const ulId = 'sortable-list';
    const ulElement = document.getElementById(ulId);
    if (!ulElement) {
        console.error('UL element not found');
        return '';
    }

    let textString = '';

    ulElement.querySelectorAll('li').forEach((li) => {
        textString += li.textContent.trim();
    });

    textString = textString.trim();

    console.log(textString);
    console.log(originalWord);

    const timeline3 = gsap.timeline({
        onComplete: () => {
            timeline3.reverse();
        },
    });

    timeline3.to(submitBtn, {
        scale: 0.9,
        backgroundColor: '#5983FF',
        color: '#071013',
        duration: 0.1,
        ease: 'expo.Out',
    });

    timeline3.play();

    if (textString == originalWord) {
        const timeline = gsap.timeline({
            onComplete: () => {
                getNewWord();
                // Reverse the animation after a delay

                gsap.delayedCall(0.25, () => {
                    timeline.reverse();
                });
            },
        });

        timeline.to(letterList, {
            borderColor: '#5EFC8D',
            backgroundColor: '#071013',
            color: '#5EFC8D',
            y: -30,
            duration: 0.25,
            stagger: 0.05,
            ease: 'expo.Out',
        });

        timeline.play();
    } else {
        const timeline2 = gsap.timeline({
            onComplete: () => {
                // Reverse the animation after a delay

                gsap.delayedCall(0.25, () => {
                    timeline2.reverse();
                });
            },
        });

        timeline2.to(letterList, {
            borderColor: '#D72638',
            color: '#D72638',
            duration: 0.25,
            stagger: 0.05,
            ease: 'expo.Out',
        });

        timeline2.play();

        strikes += 1;

        switch (strikes) {
            case 1:
                gsap.to('#strike-1', {
                    borderColor: '#D72638',
                    color: '#D72638',
                    ease: 'expo.out',
                });
                break;
            case 2:
                gsap.to('#strike-2', {
                    borderColor: '#D72638',
                    color: '#D72638',
                    ease: 'expo.out',
                });
                break;
            case 3:
                gsap.to('#strike-3', {
                    borderColor: '#D72638',
                    color: '#D72638',
                    ease: 'expo.out',
                });
                break;
            default:
                return;
        }
    }
}

letterList.forEach((item) => {
    item.addEventListener('pointerenter', () => {
        gsap.to(item, {
            color: '#5983FF',
            backgroundColor: '#e5e5f7',

            duration: 0.25,
            ease: 'expo.Out',
        });
    });

    item.addEventListener('pointerleave', () => {
        gsap.to(item, {
            backgroundColor: '#5983FF',
            color: '#e5e5f7',
            duration: 0.25,
            ease: 'expo.Out',
        });
    });
});

function fetchWordDefinition(definition) {
    const word = definition;
    const clueP = document.getElementById('clueP');

    clueP.textContent = word;
}

function getNewWord() {
    const timeline4 = gsap.timeline({
        onComplete: () => {
            container.innerHTML = '';
            splitStringAndCreateElements(scrabbledWord, container);

            const clueTimeline = gsap.timeline({
                onComplete: () => {
                    wordDef = selectedWord.definition;
                    fetchWordDefinition(wordDef);
                    clueTimeline.reverse();
                },
            });

            clueTimeline.to('#clueP', {
                opacity: 0,
                duration: 0.5,
                ease: 'expo.Out',
            });

            clueTimeline.play();

            gsap.fromTo(
                letterList,
                {
                    scale: 0,
                    duration: 0.25,
                    stagger: 0.05,
                    ease: 'expo.Out',
                    delay: 1.5,
                },
                { scale: 1, duration: 0.25, stagger: 0.05, ease: 'expo.out' }
            );
        },
    });

    timeline4.to(letterList, {
        scale: 0,
        duration: 0.25,
        stagger: 0.05,
        ease: 'expo.Out',
        delay: 1.5,
    });

    timeline4.play();



    selectedWord = getRandomElementFromArray(dict);
    originalWord = selectedWord.word.toUpperCase()
    console.log(originalWord);
    console.log(selectedElements);
    scrabbledWord = scrabbleWord(originalWord).toUpperCase();

    const scoreTimeline = gsap.timeline({
        onComplete: () => {
            scoreText.textContent = `${(score += 1)}`;
            scoreTimeline.reverse();
        },
    });

    scoreTimeline.to(scoreText, {
        scale: 1.4,
        color: '#5EFC8D',
        duration: 0.5,
        ease: 'expo.out',
    });

    scoreTimeline.play();
}

function easyLevel() {
    transition();
    dict = easyWords;
    console.log(dict);
    startGame();
}

function transition() {
    const transitionTimeline = gsap.timeline();
    transitionTimeline.fromTo(
        introGame,
        { opacity: 1, display: 'flex', ease: 'expo.out' },
        { x: -200, opacity: 0, display: 'none', ease: 'expo.out' }
    );
    transitionTimeline.fromTo(
        playGame,
        { display: 'none', x: 200, opacity: 0, ease: 'expo.out' },
        { display: 'flex', x: 0, opacity: 1, ease: 'expo.out' }
    );
}

function midLevel() {
    transition();
    dict = mediumWords;
    console.log(dict);
    startGame();
}

function hardLevel() {
    transition();
    dict = hardWords;
    console.log(dict);
    startGame();
}









const lvlBtn0 = document.querySelectorAll('.lvlBtn')[0];
const lvlBtn1 = document.querySelectorAll('.lvlBtn')[1];
const lvlBtn2 = document.querySelectorAll('.lvlBtn')[2];







lvlBtn0.addEventListener('pointerdown', () => {
    pointer0();
});

lvlBtn1.addEventListener('pointerdown', () => {
    pointer1();
});

lvlBtn2.addEventListener('pointerdown', () => {
    pointer2();
});













function pointer0() {
    const timeline3 = gsap.timeline({
        onComplete: () => {
            timeline3.reverse();
            easyLevel();
        },
    });

    timeline3.to(lvlBtn0, {
        scale: 0.9,
        backgroundColor: '#5983FF',
        color: '#071013',
        duration: 0.1,
        ease: 'expo.Out',
    });

    timeline3.play();
}










function pointer1() {
    const timeline3 = gsap.timeline({
        onComplete: () => {
            timeline3.reverse();
            midLevel();
        },
    });

    timeline3.to(lvlBtn1, {
        scale: 0.9,
        backgroundColor: '#5983FF',
        color: '#071013',
        duration: 0.1,
        ease: 'expo.Out',
    });

    timeline3.play();
}








function pointer2() {
    const timeline3 = gsap.timeline({
        onComplete: () => {
            timeline3.reverse();
            hardLevel();
        },
    });

    timeline3.to(lvlBtn2, {
        scale: 0.9,
        backgroundColor: '#5983FF',
        color: '#071013',
        duration: 0.1,
        ease: 'expo.Out',
    });

    timeline3.play();
}










const intialAni = gsap.timeline();
intialAni.from('#title', { y: -100, opacity: 0, ease: 'expo.out' });
intialAni.from('#introGame', { y: -100, opacity: 0, ease: 'expo.out' }, '<.25');
intialAni.from(
    '.ins',
    { y: -50, opacity: 0, ease: 'expo.out', stagger: 0.1 },
    '<.5'
);
intialAni.from(
    '.lvlBtn',
    { y: -100, opacity: 0, ease: 'expo.out', stagger: 0.1 },
    '<.5'
);

gsap.to('.fa-spinner', {
    rotation: 360,
    duration: 1,
    repeat: -1,
    ease: 'none',
});
