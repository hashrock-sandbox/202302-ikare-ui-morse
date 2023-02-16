const pushButton = document.getElementById("push")
const input = document.getElementById("input")
//  Morse code app

// play sin wave with web audio api
class SinWaveGen {
  constructor() {
    this.playing = false
  }

  init(isSawTooth) {
    this.context = new AudioContext()
    if(isSawTooth){
      //create 5 sawtooth oscillators
      this.oscillators = []
      for (let i = 0; i < 5; i++) {
        this.oscillators.push(this.context.createOscillator())
        this.oscillators[i].type = "sawtooth"
        this.oscillators[i].detune.value = 50 * i - 50 * 2.5
      }

    }else{
      this.oscillators = []
      const oscillator = this.context.createOscillator()
      oscillator.type = "sine"
      this.oscillators.push(oscillator)
    }
    this.gainNode = this.context.createGain()
    this.gainNode.gain.value = 0.2
    // this.oscillator.connect(this.gainNode)
    for (let i = 0; i < this.oscillators.length; i++) {
      this.oscillators[i].connect(this.gainNode)
    }
    this.gainNode.connect(this.context.destination)
  }

  
  noteOn(freq) {
    if (!this.playing) {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)')
      if(isDark.matches){
        this.init(true)
      }else{
        this.init(false)
      }

      // this.oscillator.start()
      for (let i = 0; i < this.oscillators.length; i++) {
        this.oscillators[i].start()
      }
      this.playing = true
    }
    // this.oscillator.frequency.value = freq
    for (let i = 0; i < this.oscillators.length; i++) {
      this.oscillators[i].frequency.value = freq
    }
  }

  noteOff() {
    // this.oscillator.frequency.value = 0
    for (let i = 0; i < this.oscillators.length; i++) {
      this.oscillators[i].frequency.value = 0
    }
  }
}

const gen = new SinWaveGen()

let lastTime = 0
const downEventItems = []
const currentDownEvents = []
const morseShortLength = 120
const morseLetterGapLength = morseShortLength * 3
const morseWordGapLength = morseShortLength * 7


class MorseInterpreter {
  constructor(downEvent) {
    this.downEvent = downEvent
  }

  interpret() {
    const morse = this.downEvent.map((event) => {
      if (event < morseShortLength) {
        return "."
      } else {
        return "-"
      }
    })
    return morse.join("")
  }

}
const morseToJapaneseList = {
  "--.--": "ア",
  ".-": "イ",
  "..-": "ウ",
  "-.---": "エ",
  ".-...": "オ",
  ".-..": "カ",
  "-.-..": "キ",
  "...-": "ク",
  "-.--": "ケ",
  "----": "コ",
  "-.-.-": "サ",
  "--.-.": "シ",
  "---.-": "ス",
  ".---.": "セ",
  "---.": "ソ",
  "-.": "タ",
  "..-.": "チ",
  ".--.": "ツ",
  ".-.--": "テ",
  "..-..": "ト",
  ".-.": "ナ",
  "-.-.": "ニ",
  "....": "ヌ",
  "--.-": "ネ",
  "..--": "ノ",
  "-...": "ハ",
  "--..-": "ヒ",
  "--..": "フ",
  ".": "ヘ",
  "-..": "ホ",
  "-..-": "マ",
  "..-.-": "ミ",
  "-": "ム",
  "-...-": "メ",
  "-..-.": "モ",
  ".--": "ヤ",
  "-..--": "ユ",
  "--": "ヨ",
  "...": "ラ",
  "--.": "リ",
  "-.--.": "ル",
  "---": "レ",
  ".-.-": "ロ",
  "-.-": "ワ",
  ".-..-": "ヰ",
  ".---": "ヲ",
  ".--..": "ヱ",
  ".-.-.": "ン",
  "..": "゛",
  "..--.": "゜",
  ".--.-": "ー",
  ".-.-.-": "、",
  "-..---": "【本文】",
  "...-.": "【終】",
}
function morseToJapanese(morse) {

  return morseToJapaneseList[morse]
}

function morseToLetter(morse) {
  const morseToLetter = {
    ".-": "a",
    "-...": "b",
    "-.-.": "c",
    "-..": "d",
    ".": "e",
    "..-.": "f",
    "--.": "g",
    "....": "h",
    "..": "i",
    ".---": "j",
    "-.-": "k",
    ".-..": "l",
    "--": "m",
    "-.": "n",
    "---": "o",
    ".--.": "p",
    "--.-": "q",
    ".-.": "r",
    "...": "s",
    "-": "t",
    "..-": "u",
    "...-": "v",
    ".--": "w",
    "-..-": "x",
    "-.--": "y",
    "--..": "z",
    ".----": "1",
    "..---": "2",
    "...--": "3",
    "....-": "4",
    ".....": "5",
    "-....": "6",
    "--...": "7",
    "---..": "8",
    "----.": "9",
    "-----": "0",
  }
  return morseToLetter[morse]
}

const interpreter = new MorseInterpreter(downEventItems)


function onDown(){
  gen.noteOn(440)

  if (letterGapTimer) {
    clearTimeout(letterGapTimer)
  }
  lastTime = Date.now()
}

function onRelease(){
  gen.noteOff()
  const now = Date.now()
  const diff = now - lastTime
  downEventItems.push(diff)


  letterGapTimer = setTimeout(() => {
    const letter = morseToJapanese(interpreter.interpret())
    if (letter) {
      console.log(letter)
      input.innerText += letter

      if("【終】" === letter) {
        alert("回答ありがとうございました！")
        input.innerText = ""
      }
    }
    downEventItems.length = 0
  }, morseLetterGapLength)
}

pushButton.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    e.preventDefault()
    onDown()
  }
})

pushButton.addEventListener("keyup", (e) => {
  if (e.key === " ") {
    e.preventDefault()
    onRelease()
  }
})


pushButton.addEventListener("pointerdown", (e) => {
  e.target.setPointerCapture(e.pointerId)
  onDown()
})

let letterGapTimer = null

pushButton.addEventListener("pointerup", () => {
  onRelease()
})

// add morse code list in div
const morseList = document.getElementById("morse")
for (const key in morseToJapaneseList) {
  const li = document.createElement("li")
  li.innerText = `${key} : ${morseToJapaneseList[key]}`
  morseList.appendChild(li)
}

