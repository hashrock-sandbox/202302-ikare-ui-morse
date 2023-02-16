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
      this.oscillators.push(this.context.createOscillator())
      this.oscillator.type = "sine"
  
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
      this.init(true)
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
function morseToJapanese(morse) {
  const morseToJapanese = {
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
  return morseToJapanese[morse]
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


pushButton.addEventListener("pointerdown", (e) => {
  e.target.setPointerCapture(e.pointerId)
  gen.noteOn(440)

  if (letterGapTimer) {
    clearTimeout(letterGapTimer)
  }
  lastTime = Date.now()
})

let letterGapTimer = null

pushButton.addEventListener("pointerup", () => {
  gen.noteOff()
  const now = Date.now()
  const diff = now - lastTime
  downEventItems.push(diff)


  letterGapTimer = setTimeout(() => {
    // const letter = morseToLetter(interpreter.interpret())
    const letter = morseToJapanese(interpreter.interpret())
    if (letter) {
      console.log(letter)
      input.innerText += letter
    }
    downEventItems.length = 0
  }, morseLetterGapLength)


  // const letter = morseToLetter(interpreter.interpret())
  // if(letter) {
  //   downEventItems.length = 0
  // }
})
