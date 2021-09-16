var input = require('readline-sync')
let word_data = require('./words.json');

class words {
    constructor(word, m) {
        this.word = word
        this.mean = m
    }
    getmean() {
        return this.mean
    }
}
class wordCollection {
    constructor() {
        this.category = 0
        this.wordarr = []
        this.guessedwords = []
        this.alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
        this.positions = [
            "",
            "|   |\n|   |______\n|          |\n|__________|",
            "   ____\n  |    | \n  | \n  | \n  | \n  | \n _|_\n|   |______\n|          |\n|__________|",
            "   ____\n  |    | \n  |    0 \n  | \n  | \n  | \n _|_\n|   |______\n|          |\n|__________|",
            "   ____\n  |    | \n  |    0 \n  |    | \n  |    | \n  | \n _|_\n|   |______\n|          |\n|__________|",
            "   ____\n  |    | \n  |    0 \n  |   /| \n  |    | \n  | \n _|_\n|   |______\n|          |\n|__________|",
            "   ____\n  |    | \n  |    0 \n  |   /|\\ \n  |    | \n  | \n _|_\n|   |______\n|          |\n|__________|",
            "   ____\n  |    | \n  |    0 \n  |   /|\\ \n  |    | \n  |   / \n _|_\n|   |______\n|          |\n|__________|",
            "   ____\n  |    | \n  |    0 \n  |   /|\\ \n  |    | \n  |   / \\ \n _|_\n|   |______\n|          |\n|__________|"

        ];
        this.pastscores = []
        this.notchosen = false
        this.displayspace = ""
    }
    gamestart() {
        var time = 3
        var timer = setInterval(
            function () {
                console.log("game starting in " + time--)
                if (time == 0) {
                    game.started()
                    clearInterval(timer)
                }
            }, 1000)
    }
    started() {
        var abc = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
        var wronglettertxt = ""
        var repeatedchar = ""
        var lifeline_skip = 1
        var lifeline_vowels = 1
        var lifeline_clue = 1
        var fails = 0
        var score = 0
        var usedletter = ""
        var displayedKeyword = ""
        var guessedword = false
        this.capped_selected_word = ""
        var categoryname = ""
        var lifelinetxt = ""
        var randnumarr = []
        var indexnum = 0
        var wordwintxt = ""
        var wordfound = false
        //choose category 
        if (this.category == 1) {
            for (var i = 0; i < word_data.sports.length; i++) {
                this.wordarr.push(new words(word_data.sports[i].Word, word_data.sports[i].Mean))
            }
            categoryname = "Sports"
        } else if (this.category == 2) {
            for (var i = 0; i < word_data.pubhol.length; i++) {
                this.wordarr.push(new words(word_data.pubhol[i].Word, word_data.pubhol[i].Mean))
            }
            categoryname = "Public Holiday"
        } else if (this.category == 3) {
            for (var i = 0; i < word_data.country.length; i++) {
                this.wordarr.push(new words(word_data.country[i].Word, word_data.country[i].Mean))
            }
            categoryname = "Country"
        } else if (this.category == 4) {
            for (var i = 0; i < word_data["Essential Workers"].length; i++) {
                this.wordarr.push(new words(word_data["Essential Workers"][i].Word, word_data["Essential Workers"][i].Mean))
            }
            categoryname = "Essential Workers"
        }
        //loop through to generate random words (12 is the limit of the length of words in words.json)
        do {
            let num = Math.floor(Math.random() * 12);
            randnumarr.push(num);
            randnumarr = randnumarr.filter((item, index) => {
                return randnumarr.indexOf(item) === index
            });
        } while (randnumarr.length < 12);

        //loop till win/lose
        while (score <= 10 || fails >= 8) {
            //if word is correct,
            if (guessedword) {
                var abc = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
                if (displayedKeyword != "") {
                    wordwintxt = "You got it!, the word is: " + displayedKeyword
                    fails = 0
                    indexnum++
                    score++
                }
                //reset vars 
                guessedword = false
                var sword = this.wordarr[randnumarr[indexnum]].word
                this.capped_selected_word = sword.toUpperCase()
                displayedKeyword = ""
                //make keywords from word to _ _ _ _ _
                for (var i = 0; i < this.capped_selected_word.length; i++) {
                    if (this.capped_selected_word.charAt(i) == " " || this.capped_selected_word.charAt(i) == "_") {
                        displayedKeyword += this.capped_selected_word.charAt(i);
                    } else {
                        displayedKeyword += "_";
                    }
                }
            }
            //loop until word is correct
            while (displayedKeyword != this.capped_selected_word) {
                //to display all text/messages to player--------------------------
                console.log(`~~=== Welcome to Hangman ==~~ \n\nHello ${this.name}, your Score is ${score}/10\n`)
                if (wronglettertxt != "") {
                    console.log(`\nsorry, the letter ${wronglettertxt} is wrong`)
                    wronglettertxt = ""
                } else if (usedletter != "") {
                    console.log(`\nThe Letter ${usedletter} has been used before, try another letter or use a lifeline`)
                    usedletter = ""
                } else if (repeatedchar != "") {
                    console.log(repeatedchar)
                    repeatedchar = ""
                }
                if (wordfound) {
                    console.log(wordwintxt)
                    wordwintxt = ""
                }
                if (lifelinetxt != "") {
                    console.log("\n" + lifelinetxt)
                    lifelinetxt = ""
                }
                if (fails >= 1) {
                    console.log(`\n${this.positions[fails]}`)
                }
                this.displayspace = displayedKeyword.split('').join(' ');
                console.log(`\nThe category is: ${categoryname} \n\n ${this.displayspace} \n`)

                //to display letters -----------------------------------------------------
                var displayletter1 = ""
                var displayletter2 = ""
                for (var i = 0; i < abc.length; i++) {
                    if (displayletter1.length == 26) {
                        if (abc[i] == " ") {
                            displayletter2 += " " + " "
                        } else {
                            displayletter2 += abc[i] + " "
                        }
                    } else {
                        if (abc[i] == " ") {
                            displayletter1 += " " + " "
                        } else {
                            displayletter1 += abc[i] + " "
                        }
                    }
                }
                console.log(displayletter1)
                console.log(displayletter2)
                var ans = input.question("Type a Letter or lifeline(8),(9),(0)")
                ans = ans.toUpperCase()

                //if player type 8,9 or 0 (lifelines)
                if (ans == 8) {
                    //shows all lifeline_vowels
                    if (lifeline_vowels != 1) {
                        lifelinetxt = ("You cannot use lifeline_vowels lifeline, since you have used it already")
                    } else {
                        var lifeline_vowels = ["A", "E", "I", "O", "U"]
                        var originaldisplaykeyword = displayedKeyword
                        for (this.q = 0; this.q < lifeline_vowels.length; this.q++) {
                            for (this.p = 0; this.p < this.capped_selected_word.length; this.p++) {
                                if (this.capped_selected_word.charAt(this.p) == lifeline_vowels[this.q]) {
                                    displayedKeyword = setCharAt(displayedKeyword, this.p, lifeline_vowels[this.q]);
                                    this.guessedwords.push(this.q)
                                }
                            }
                            for (var i = 0; i < abc.length; i++) {
                                if (abc[i] == lifeline_vowels[this.q]) {
                                    abc.splice(i, 1, " ")
                                }
                            }
                        }
                        if (originaldisplaykeyword == displayedKeyword) {
                            lifelinetxt = ("All lifeline vowels have been used, please try again at the next letter")
                        } else {
                            lifeline_vowels--
                        }
                    }
                } else if (ans == 9) {

                    //give clues to the word
                    if (lifeline_clue != 1) {
                        lifelinetxt = ("You cannot use hints, since you have used it")
                    } else {
                        lifeline_clue = 0
                        lifelinetxt = ("The clue is : " + this.wordarr[randnumarr[indexnum]].getmean())
                    }
                } else if (ans == 0) {

                    //skip word lifeline
                    if (lifeline_skip != 1) {
                        lifelinetxt = ("You cannot skip, since you have already used it")
                    } else {
                        lifeline_skip = 0
                        fails = 0
                        score++
                        indexnum++
                        displayedKeyword = this.capped_selected_word
                        guessedword = true
                        wordfound = true
                    }
                } else if (ans == "" || ans == " ") {

                    //nothing here because if someone types blank, it will give an error
                    break;
                } else if (ans.length > 1) {

                    //stop players from typing 2 or more keywords
                    repeatedchar = `Please type only 1 letter or number`
                } else {
                    //find the letter
                    var found = false

                    //check if letter is used
                    for (var i = 0; i < abc.length; i++) {
                        if (abc[i] != " ") {
                            if (ans == abc[i]) {
                                abc.splice(i, 1, " ")
                            }
                        } else {
                            if (this.alphabets[i] == ans) {
                                usedletter = ans
                                found = true
                            }
                        }
                    }
                    //if letter is found,
                    for (var i = 0; i < this.capped_selected_word.length; i++) {
                        if (this.capped_selected_word.charAt(i) == ans) {
                            displayedKeyword = setCharAt(displayedKeyword, i, ans);
                            this.guessedwords.push(ans)
                            found = true;
                        }
                    }
                    //if no letter
                    if (!found) {
                        fails++
                        wronglettertxt = ans

                        if (fails >= 8) {
                            //if the man is hanged, basically lose 
                            this.pastscores.push(score)
                            console.log("\ngame over \n\n\n")
                            var selected_input = false
                            var user_scores = {
                                name: this.name,
                                scores: score
                            }
                            //save score to json file
                            var fs = require('fs');
                            var data = JSON.parse(fs.readFileSync(`${__dirname}\\score.json`));
                            data.score.push(user_scores.scores);
                            data.name.push(user_scores.name)
                            fs.writeFile(`${__dirname}\\score.json`, JSON.stringify(data), () => {});
                            return
                        }
                    }
                }
                //clear console to make it look clean
                console.clear()
            }
            //if keywords are the same
            if (displayedKeyword == this.capped_selected_word) {
                wordfound = true
                guessedword = true
            }
            //clear the console
            console.clear()
            if (score >= 10) {
                //if you score 10, you win
                var user_scores = {
                    name: this.name,
                    scores: score
                }
                //save score to JSON file
                var fs = require('fs');
                var data = JSON.parse(fs.readFileSync(`${__dirname}\\score.json`));
                data.score.push(user_scores.scores);
                data.name.push(user_scores.name)
                fs.writeFile(`${__dirname}\\score.json`, JSON.stringify(data), () => {});

                console.log("Congrats You beat the game (forn now ~[hehe intensifies]~)")
                this.pastscores.push(score)
                return
            }
        }
    }

    //the game's landing page
    gameland() {
        console.log("~~=== Welcome to Hangman ==~~ \n")
        console.log("Please pull up your console tab, to have a better view on the game.\n")
        this.name = input.question("Enter your name:")
        var gamestarted = false
        var gs = 0

        // repeat forever until the game starts
        while (gamestarted == false) {
            console.log("~~=== Welcome to Hangman ==~~\n\n Greetings, " + this.name + "! \n\nTo play the game, type (1) \nTo read instructions of the game, type (2)\nTo view the scoreboard, type (3)\n\n")
            gs = input.questionInt('Select (1), (2) or (3) to continue:')

            if (gs == 1) {
                return game.catchoose()

            } else if (gs == 2) {
                console.log("The game will start when you type (1), upon typing \"1\" you have exactly 3 seconds to prepare yourself before the game starts.\n\nDuring the game, you have 3 lifelines, type (8), (9), (0) to use. *You can only use it ONCE, use it wisely!\n1) Reveal all vowels, works only IF NOT all vowels have been shown. (8)\n2) Show the definition of the word (9)\n3) Skip the word and get a score. (0)\n\n")
                input.question("Enter any key and click \"Enter\" to return to main menu")
            } else if (gs == 3) {
                //scorez
                console.log("\n-----Score-----")
                var fs = require('fs');
                let data = fs.readFileSync(`${__dirname}\\score.json`);
                let scores = JSON.parse(data);
                let namearr = scores.name
                let scorearr = scores.score
                var txt = ""
                namearr.forEach((item, index) => {
                    txt += `Name: ${item} \t Score: ${scorearr[index]}\n`
                });
                console.log(txt)
                input.question("Enter any key and click \"Enter\" to return to main menu")
            }
        }
    }

    //category choosing menu
    catchoose() {
        var cats = 0
        if (this.notchosen) {
            console.log("Error, please input a valid number from 1-4 ONLY")
        } else {
            console.log("Please Choose a category in the list below: \n\n1)Sports\n2)Public Holidays (Holidays may not only be Singapore)\n3)Country\n4)Essential Workers \n")
        }
        cats = input.questionInt("Please Choose a category: ")

        if (cats == 1) {
            this.category = 1
            game.gamestart()
        } else if (cats == 2) {
            this.category = 2
            game.gamestart()
        } else if (cats == 3) {
            this.category = 3
            game.gamestart()
        } else if (cats == 4) {
            this.category = 4
            game.gamestart()
        } else {
            game.catchoose()
        }
    }
}
//to start the game
var game = new wordCollection()
game.gameland()

// game word searching function -------------------------------------------------------------
function setCharAt(str, index, chr) {
    if (index > str.length - 1) {
        return str;
    }
    return str.substr(0, index) + chr + str.substr(index + 1);
}