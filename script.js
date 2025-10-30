// Estado de la aplicación
const state = {
  aciertos: 0,
  fallos: 0,
  aciertosVisual: 0, // Agregando contador para opción 1
  fallosVisual: 0,
  aciertosKeyboard: 0,
  fallosKeyboard: 0,
  aciertosWrite: 0,
  fallosWrite: 0,
  aciertosConnect: 0,
  fallosConnect: 0,
  currentMode: "visual",
  currentLetter: "",
  userRating: 0,
  targetLetterConnect: "",
  isDragging: false,
  dragStartElement: null,
  currentWriteInput: null,
  usedLettersKeyboard: new Set(),
  usedLettersWrite: new Set(),
  usedLettersConnect: new Set(),
  usedLettersVisual: new Set(),
  difficulty: "medium",
  startTime: null,
  sessionStats: {
    easy: {
      visual: { aciertos: 0, fallos: 0 }, // Agregando estadísticas para opción 1
      keyboard: { aciertos: 0, fallos: 0 },
      write: { aciertos: 0, fallos: 0 },
      connect: { aciertos: 0, fallos: 0 },
    },
    medium: {
      visual: { aciertos: 0, fallos: 0 },
      keyboard: { aciertos: 0, fallos: 0 },
      write: { aciertos: 0, fallos: 0 },
      connect: { aciertos: 0, fallos: 0 },
    },
    hard: {
      visual: { aciertos: 0, fallos: 0 },
      keyboard: { aciertos: 0, fallos: 0 },
      write: { aciertos: 0, fallos: 0 },
      connect: { aciertos: 0, fallos: 0 },
    },
  },
}

// Abecedario español
const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("")

// Función para mostrar feedback
function showFeedback(message, type) {
  const feedbackElement = document.getElementById("feedbackMessage")
  feedbackElement.textContent = message
  feedbackElement.className = `feedback-message ${type} show`
  setTimeout(() => {
    feedbackElement.classList.remove("show")
  }, 3000)
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  setupMenuButtons()
  setupModalButtons()
  setupRatingSystem()
  setupResetButtons()
  setupHamburgerMenu()
  setupDifficultySelector()
  setupStatsButton()
  loadProgress()
  loadStats()
  initializeVisualMode()
  initializeKeyboardMode()
  initializeWriteMode()
  initializeConnectMode()
  loadUserRating()
}

function setupHamburgerMenu() {
  const hamburgerBtn = document.getElementById("hamburgerBtn")
  const menuNav = document.getElementById("menuNav")

  if (hamburgerBtn && menuNav) {
    hamburgerBtn.addEventListener("click", () => {
      hamburgerBtn.classList.toggle("active")
      menuNav.classList.toggle("active")
    })

    // Cerrar menú al hacer clic en una opción
    const menuButtons = document.querySelectorAll(".menu-btn")
    menuButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          hamburgerBtn.classList.remove("active")
          menuNav.classList.remove("active")
        }
      })
    })

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 768 &&
        !menuNav.contains(e.target) &&
        !hamburgerBtn.contains(e.target) &&
        menuNav.classList.contains("active")
      ) {
        hamburgerBtn.classList.remove("active")
        menuNav.classList.remove("active")
      }
    })
  }
}

// ===== MENÚ DE NAVEGACIÓN =====
function setupMenuButtons() {
  const menuButtons = document.querySelectorAll(".menu-btn")

  menuButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode
      resetOtherModes(mode)
      switchMode(mode)

      // Actualizar botones activos
      menuButtons.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      hideHeaderShowInicio()
    })
  })

  const btnInicio = document.getElementById("btnInicio")
  if (btnInicio) {
    btnInicio.addEventListener("click", () => {
      showHeaderHideInicio()
    })
  }
}

function resetOtherModes(currentMode) {
  if (currentMode !== "keyboard") {
    state.aciertosKeyboard = 0
    state.fallosKeyboard = 0
    state.currentLetter = ""
    const currentLetterEl = document.getElementById("currentLetter")
    if (currentLetterEl) currentLetterEl.textContent = "?"
    state.usedLettersKeyboard.clear()
  }

  if (currentMode !== "write") {
    state.aciertosWrite = 0
    state.fallosWrite = 0
    state.usedLettersWrite.clear()
  }

  if (currentMode !== "connect") {
    state.aciertosConnect = 0
    state.fallosConnect = 0
    state.usedLettersConnect.clear()
  }

  if (currentMode !== "visual") {
    state.aciertosVisual = 0
    state.fallosVisual = 0
    state.usedLettersVisual.clear()
  }

  updateCounters()
}

function switchMode(mode) {
  state.currentMode = mode

  // Ocultar todos los modos
  document.querySelectorAll(".game-mode").forEach((m) => {
    m.classList.remove("active")
  })

  // Mostrar modo seleccionado
  const modeMap = {
    visual: "modeVisual",
    keyboard: "modeKeyboard",
    write: "modeWrite",
    connect: "modeConnect",
  }

  document.getElementById(modeMap[mode]).classList.add("active")

  if (mode === "connect") {
    generateNewTargetLetter()
  }
}

function setupResetButtons() {
  const btnResetVisual = document.getElementById("btnResetVisual")
  const btnResetKeyboard = document.getElementById("btnResetKeyboard")
  const btnResetWrite = document.getElementById("btnResetWrite")
  const btnResetConnect = document.getElementById("btnResetConnect")

  if (btnResetVisual) {
    btnResetVisual.addEventListener("click", () => {
      resetVisualMode()
    })
  }

  if (btnResetKeyboard) {
    btnResetKeyboard.addEventListener("click", () => {
      resetKeyboardMode()
    })
  }

  if (btnResetWrite) {
    btnResetWrite.addEventListener("click", () => {
      resetWriteMode()
    })
  }

  if (btnResetConnect) {
    btnResetConnect.addEventListener("click", () => {
      resetConnectMode()
    })
  }
}

function resetVisualMode() {
  state.aciertosVisual = 0
  state.fallosVisual = 0
  state.usedLettersVisual.clear()
  updateCounters()
  updateProgressBars()
  saveProgress()

  // Rehabilitar todas las letras
  const letterCards = document.querySelectorAll(".letter-card")
  letterCards.forEach((card) => {
    card.classList.remove("disabled")
  })

  showFeedback("¡Juego reiniciado! Haz clic en las letras para comenzar 🎮", "success")
}

function resetKeyboardMode() {
  state.aciertosKeyboard = 0
  state.fallosKeyboard = 0
  state.usedLettersKeyboard.clear()
  updateCounters()
  updateProgressBars() // Resetear barra de progreso
  saveProgress()

  state.currentLetter = ""
  document.getElementById("currentLetter").textContent = "?"
  showFeedback("¡Juego reiniciado! Presiona 'Escuchar Letra' para comenzar 🎮", "success")
}

function resetWriteMode() {
  state.aciertosWrite = 0
  state.fallosWrite = 0
  state.usedLettersWrite.clear()
  updateCounters()
  updateProgressBars() // Resetear barra de progreso
  saveProgress()

  // Reinicializar el grid con nuevas letras aleatorias
  const grid = document.getElementById("writeGrid")
  grid.innerHTML = ""

  // Crear array de índices y mezclarlos para posiciones aleatorias
  const indices = Array.from({ length: alphabet.length }, (_, i) => i)
  const randomIndices = []

  // Seleccionar aleatoriamente qué letras mostrar como pista (aproximadamente 1/3)
  while (randomIndices.length < Math.floor(alphabet.length / 3)) {
    const randomIndex = Math.floor(Math.random() * alphabet.length)
    if (!randomIndices.includes(randomIndex)) {
      randomIndices.push(randomIndex)
    }
  }

  alphabet.forEach((letter, index) => {
    const item = document.createElement("div")
    item.className = "write-item"

    // Mostrar letra como pista si está en los índices aleatorios
    if (randomIndices.includes(index)) {
      const label = document.createElement("div")
      label.className = "write-label"
      label.textContent = letter
      item.appendChild(label)

      const placeholder = document.createElement("div")
      placeholder.style.height = "50px"
      item.appendChild(placeholder)
    } else {
      const label = document.createElement("div")
      label.className = "write-label"
      label.textContent = "?"
      item.appendChild(label)

      const input = document.createElement("input")
      input.type = "text"
      input.className = "write-input"
      input.maxLength = 1
      input.dataset.correct = letter
      input.addEventListener("input", (e) => {
        const value = e.target.value.toUpperCase()
        if (value && !alphabet.includes(value)) {
          showFeedback("Solo se admite letras del abecedario y no otro tipo de caracteres", "error")
          playErrorSound()
          e.target.value = ""
        } else {
          e.target.value = value
        }
      })
      input.addEventListener("focus", () => {
        state.currentWriteInput = input
      })
      item.appendChild(input)
    }

    grid.appendChild(item)
  })

  showFeedback("¡Ejercicio reiniciado con nuevas letras! 🎲", "success")
}

function resetConnectMode() {
  state.aciertosConnect = 0
  state.fallosConnect = 0
  state.usedLettersConnect.clear()
  updateCounters()
  updateProgressBars() // Resetear barra de progreso
  saveProgress()

  // Generar nueva letra objetivo
  generateNewTargetLetter()

  // Limpiar canvas
  const canvas = document.getElementById("connectCanvas")
  const ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Reinicializar grid
  initializeConnectMode()

  showFeedback("¡Juego reiniciado! Encuentra la nueva letra 🎮", "success")
}

// ===== MODO 1: VISUAL Y FONÉTICO =====
function initializeVisualMode() {
  const grid = document.getElementById("alphabetGrid")
  grid.innerHTML = ""

  alphabet.forEach((letter) => {
    const card = document.createElement("button")
    card.className = "letter-card"
    card.textContent = letter
    if (state.usedLettersVisual.has(letter)) {
      card.classList.add("disabled")
    }
    card.addEventListener("click", () => {
      if (!card.classList.contains("disabled")) {
        playLetterSound(letter, card)
      }
    })
    grid.appendChild(card)
  })
}

function playLetterSound(letter, cardElement) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(letter)
    utterance.lang = "es-ES"
    utterance.rate = 0.8 * getDifficultySpeed()
    utterance.pitch = 1.2
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)

    showFeedback(`¡Letra ${letter}!`, "success")
    playSuccessSound()

    // Agregar a letras usadas y deshabilitar
    state.usedLettersVisual.add(letter)
    state.aciertosVisual++
    state.sessionStats[state.difficulty].visual.aciertos++
    cardElement.classList.add("disabled")
    updateCounters()
    updateProgressBars()
    saveProgress()
    saveStats()

    // Verificar si completó todo el abecedario
    if (state.usedLettersVisual.size === alphabet.length) {
      setTimeout(() => {
        launchConfetti()
        showFeedback("¡Felicidades! Has terminado. Completaste todo el abecedario 🌟🎊", "success")
      }, 500)
    }
  } else {
    alert("Tu navegador no soporta síntesis de voz")
  }
}

// ===== MODO 2: IDENTIFICAR CON TECLADO =====
function initializeKeyboardMode() {
  const playBtn = document.getElementById("playSoundBtn")

  playBtn.addEventListener("click", startKeyboardGame)

  // Escuchar eventos de teclado
  document.addEventListener("keydown", handleKeyPress)

  initializeVirtualKeyboard()
}

function initializeVirtualKeyboard() {
  const virtualKeyboard = document.getElementById("virtualKeyboard")
  virtualKeyboard.innerHTML = ""

  alphabet.forEach((letter) => {
    const key = document.createElement("button")
    key.className = "virtual-key"
    key.textContent = letter
    key.addEventListener("click", () => {
      handleVirtualKeyPress(letter, key)
    })
    virtualKeyboard.appendChild(key)
  })
}

function handleVirtualKeyPress(letter, keyElement) {
  if (state.currentMode !== "keyboard" || !state.currentLetter) return

  // Efecto visual de presión
  keyElement.classList.add("pressed")
  setTimeout(() => {
    keyElement.classList.remove("pressed")
  }, 200)

  checkKeyboardAnswer(letter)
}

function startKeyboardGame() {
  // Obtener letras disponibles (no usadas)
  const availableLetters = alphabet.filter((letter) => !state.usedLettersKeyboard.has(letter))

  // Si no hay letras disponibles, reiniciar automáticamente
  if (availableLetters.length === 0) {
    setTimeout(() => {
      launchConfetti()
      showFeedback("¡Felicidades! Completaste todo el abecedario 🌟🎊", "success")
      setTimeout(() => {
        resetKeyboardMode()
      }, 2000)
    }, 500)
    return
  }

  // Seleccionar letra aleatoria de las disponibles
  state.currentLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)]

  // Mostrar ? en la pantalla
  document.getElementById("currentLetter").textContent = "?"

  // Reproducir sonido de la letra sin mostrar la letra en el feedback
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(state.currentLetter)
    utterance.lang = "es-ES"
    utterance.rate = 0.8 * getDifficultySpeed()
    utterance.pitch = 1.2
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }
}

function handleKeyPress(e) {
  // Solo procesar si estamos en modo keyboard
  if (state.currentMode !== "keyboard" || !state.currentLetter) return

  const pressedKey = e.key.toUpperCase()

  // Verificar si la tecla presionada es una letra
  if (alphabet.includes(pressedKey)) {
    checkKeyboardAnswer(pressedKey)
  }
}

function checkKeyboardAnswer(pressedKey) {
  // Validar que sea una letra del abecedario
  if (!alphabet.includes(pressedKey)) {
    showFeedback("Solo se admite letras del abecedario y no otro tipo de caracteres", "error")
    playErrorSound()
    return
  }

  const currentLetterDisplay = document.getElementById("currentLetter")

  if (pressedKey === state.currentLetter) {
    state.aciertos++
    state.aciertosKeyboard++
    state.sessionStats[state.difficulty].keyboard.aciertos++
    state.usedLettersKeyboard.add(state.currentLetter)
    updateCounters()
    updateProgressBars()
    saveProgress()
    saveStats()
    currentLetterDisplay.textContent = state.currentLetter
    showFeedback(`¡Correcto! Era la letra ${state.currentLetter} 🎉`, "success")
    playSuccessSound()

    // Verificar si completó todo el abecedario
    if (state.usedLettersKeyboard.size === alphabet.length) {
      setTimeout(() => {
        launchConfetti()
        showFeedback("¡Felicidades! Completaste todo el abecedario 🌟🎊", "success")
        setTimeout(() => {
          resetKeyboardMode()
        }, 2000)
      }, 2000)
    } else {
      // Continuar con la siguiente letra
      setTimeout(() => {
        startKeyboardGame()
      }, 2000)
    }
  } else {
    state.fallos++
    state.fallosKeyboard++
    state.sessionStats[state.difficulty].keyboard.fallos++
    updateCounters()
    saveProgress()
    saveStats()
    currentLetterDisplay.textContent = state.currentLetter
    currentLetterDisplay.style.background = "var(--error-color)"
    currentLetterDisplay.style.color = "var(--white)"
    showFeedback(`Incorrecto. La letra correcta era: ${state.currentLetter} 🤔`, "error")
    playErrorSound()

    // Restaurar estilo después de 2 segundos
    setTimeout(() => {
      currentLetterDisplay.style.background = "var(--bg-color)"
      currentLetterDisplay.style.color = "var(--primary-color)"
      startKeyboardGame()
    }, 2000)
  }
}

// ===== MODO 3: ESCRIBIR/RELLENAR =====
function initializeWriteMode() {
  const grid = document.getElementById("writeGrid")
  grid.innerHTML = ""

  // Obtener letras disponibles (no usadas)
  const availableLetters = alphabet.filter((letter) => !state.usedLettersWrite.has(letter))

  // Si no hay letras disponibles, mostrar mensaje de completado
  if (availableLetters.length === 0) {
    launchConfetti()
    showFeedback("¡Felicidades! Completaste todo el abecedario 🌟🎊", "success")
    setTimeout(() => {
      resetWriteMode()
    }, 2000)
    return
  }

  const numInputs = Math.min(availableLetters.length, getEmptyLettersCount())
  const randomIndices = []

  // Seleccionar aleatoriamente qué letras mostrar como input
  while (randomIndices.length < numInputs && randomIndices.length < availableLetters.length) {
    const randomIndex = Math.floor(Math.random() * availableLetters.length)
    if (!randomIndices.includes(randomIndex)) {
      randomIndices.push(randomIndex)
    }
  }

  // Crear grid con letras disponibles
  availableLetters.forEach((letter, index) => {
    const item = document.createElement("div")
    item.className = "write-item"

    // Mostrar letra como pista o como input
    if (!randomIndices.includes(index)) {
      const label = document.createElement("div")
      label.className = "write-label"
      label.textContent = letter
      item.appendChild(label)

      const placeholder = document.createElement("div")
      placeholder.style.height = "50px"
      item.appendChild(placeholder)
    } else {
      const label = document.createElement("div")
      label.className = "write-label"
      label.textContent = "?"
      item.appendChild(label)

      const input = document.createElement("input")
      input.type = "text"
      input.className = "write-input"
      input.maxLength = 1
      input.dataset.correct = letter
      input.addEventListener("input", (e) => {
        const value = e.target.value.toUpperCase()
        if (value && !alphabet.includes(value)) {
          showFeedback("Solo se admite letras del abecedario y no otro tipo de caracteres", "error")
          playErrorSound()
          e.target.value = ""
        } else {
          e.target.value = value
        }
      })
      input.addEventListener("focus", () => {
        state.currentWriteInput = input
      })
      item.appendChild(input)
    }

    grid.appendChild(item)
  })

  // Botón de verificar
  const checkBtn = document.getElementById("btnCheckWrite")
  checkBtn.addEventListener("click", checkWriteAnswers)

  initializeVirtualKeyboardWrite()
}

function initializeVirtualKeyboardWrite() {
  const virtualKeyboard = document.getElementById("virtualKeyboardWrite")
  virtualKeyboard.innerHTML = ""

  alphabet.forEach((letter) => {
    const key = document.createElement("button")
    key.className = "virtual-key"
    key.textContent = letter
    key.addEventListener("click", () => {
      handleVirtualKeyPressWrite(letter, key)
    })
    virtualKeyboard.appendChild(key)
  })
}

function handleVirtualKeyPressWrite(letter, keyElement) {
  if (state.currentMode !== "write") return

  // Efecto visual de presión
  keyElement.classList.add("pressed")
  setTimeout(() => {
    keyElement.classList.remove("pressed")
  }, 200)

  if (!alphabet.includes(letter)) {
    showFeedback("Solo se admite letras del abecedario y no otro tipo de caracteres", "error")
    return
  }

  // Insertar letra en el input activo
  if (state.currentWriteInput) {
    state.currentWriteInput.value = letter
    // Mover al siguiente input
    const inputs = Array.from(document.querySelectorAll(".write-input"))
    const currentIndex = inputs.indexOf(state.currentWriteInput)
    if (currentIndex < inputs.length - 1) {
      inputs[currentIndex + 1].focus()
    }
  }
}

function checkWriteAnswers() {
  const inputs = document.querySelectorAll(".write-input")
  let correct = 0
  let incorrect = 0

  inputs.forEach((input) => {
    const userAnswer = input.value.toUpperCase()
    const correctAnswer = input.dataset.correct

    if (userAnswer && !alphabet.includes(userAnswer)) {
      showFeedback("Solo se admite letras del abecedario y no otro tipo de caracteres", "error")
      playErrorSound()
      input.value = ""
      return
    }

    input.classList.remove("correct", "incorrect")

    if (userAnswer === correctAnswer) {
      input.classList.add("correct")
      correct++
      state.usedLettersWrite.add(correctAnswer)
    } else if (userAnswer !== "") {
      input.classList.add("incorrect")
      incorrect++
    }
  })

  state.aciertos += correct
  state.fallos += incorrect
  state.aciertosWrite += correct
  state.fallosWrite += incorrect
  state.sessionStats[state.difficulty].write.aciertos += correct
  state.sessionStats[state.difficulty].write.fallos += incorrect
  updateCounters()
  updateProgressBars()
  saveProgress()
  saveStats()

  const totalInputs = inputs.length
  if (state.usedLettersWrite.size === totalInputs && incorrect === 0) {
    launchConfetti()
    showFeedback(`¡Perfecto! Completaste todo el abecedario correctamente 🌟🎊`, "success")
    playSuccessSound()
    setTimeout(() => {
      resetWriteMode()
    }, 3000)
  } else if (incorrect === 0 && correct === inputs.length) {
    showFeedback(`¡Perfecto! Todas las respuestas son correctas 🌟`, "success")
    playSuccessSound()
  } else {
    showFeedback(`${correct} correctas, ${incorrect} incorrectas. ¡Sigue intentando! 💪`, "error")
    if (incorrect > 0) playErrorSound()
  }
}

// ===== MODO 4: CONECTAR =====
function initializeConnectMode() {
  const grid = document.getElementById("connectGrid")
  grid.innerHTML = ""

  // Crear canvas para dibujar líneas
  const canvas = document.getElementById("connectCanvas")
  const gameArea = document.querySelector(".game-area")
  canvas.width = gameArea.offsetWidth
  canvas.height = gameArea.offsetHeight

  // Generar letra objetivo aleatoria
  generateNewTargetLetter()

  // Crear grid de letras
  alphabet.forEach((letter) => {
    const letterDiv = document.createElement("div")
    letterDiv.className = "connect-letter"
    letterDiv.textContent = letter
    letterDiv.dataset.letter = letter

    letterDiv.addEventListener("click", () => {
      checkConnectAnswer(letter)
    })

    // Eventos de arrastre para desktop
    letterDiv.draggable = true
    letterDiv.addEventListener("dragstart", handleDragStart)
    letterDiv.addEventListener("dragend", handleDragEnd)
    letterDiv.addEventListener("dragover", handleDragOver)
    letterDiv.addEventListener("drop", handleDrop)

    // Eventos táctiles para móviles
    letterDiv.addEventListener("touchstart", handleTouchStart)
    letterDiv.addEventListener("touchmove", handleTouchMove)
    letterDiv.addEventListener("touchend", handleTouchEnd)

    grid.appendChild(letterDiv)
  })
}

function generateNewTargetLetter() {
  // Obtener letras disponibles (no usadas)
  const availableLetters = alphabet.filter((letter) => !state.usedLettersConnect.has(letter))

  // Si no hay letras disponibles, reiniciar automáticamente
  if (availableLetters.length === 0) {
    setTimeout(() => {
      launchConfetti()
      showFeedback("¡Felicidades! Completaste todo el abecedario 🌟🎊", "success")
      setTimeout(() => {
        resetConnectMode()
      }, 2000)
    }, 500)
    return
  }

  // Seleccionar letra aleatoria de las disponibles
  state.targetLetterConnect = availableLetters[Math.floor(Math.random() * availableLetters.length)]
  document.getElementById("targetLetter").textContent = state.targetLetterConnect
}

function handleDragStart(e) {
  state.isDragging = true
  state.dragStartElement = e.target
  e.target.classList.add("dragging")
  e.dataTransfer.effectAllowed = "move"
  e.dataTransfer.setData("text/html", e.target.innerHTML)
}

function handleDragEnd(e) {
  state.isDragging = false
  e.target.classList.remove("dragging")
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault()
  }
  e.dataTransfer.dropEffect = "move"
  return false
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation()
  }

  if (state.dragStartElement !== e.target) {
    checkConnectAnswer(e.target.dataset.letter)
  }

  return false
}

// Soporte táctil para móviles
function handleTouchStart(e) {
  state.isDragging = true
  state.dragStartElement = e.target
  e.target.classList.add("dragging")
}

function handleTouchMove(e) {
  e.preventDefault()
}

function handleTouchEnd(e) {
  state.isDragging = false
  e.target.classList.remove("dragging")

  const touch = e.changedTouches[0]
  const element = document.elementFromPoint(touch.clientX, touch.clientY)

  if (element && element.classList.contains("connect-letter")) {
    checkConnectAnswer(element.dataset.letter)
  }
}

function checkConnectAnswer(selectedLetter) {
  if (selectedLetter === state.targetLetterConnect) {
    state.aciertosConnect++
    state.sessionStats[state.difficulty].connect.aciertos++
    state.usedLettersConnect.add(state.targetLetterConnect)
    updateCounters()
    updateProgressBars()
    saveProgress()
    saveStats()
    showFeedback(`¡Correcto! Encontraste la letra ${state.targetLetterConnect} 🎉`, "success")
    playSuccessSound()

    const letters = document.querySelectorAll(".connect-letter")
    letters.forEach((letter) => {
      if (letter.dataset.letter === selectedLetter) {
        letter.classList.add("correct")
        setTimeout(() => {
          letter.classList.remove("correct")
        }, 1000)
      }
    })

    // Verificar si completó todo el abecedario
    if (state.usedLettersConnect.size === alphabet.length) {
      setTimeout(() => {
        launchConfetti()
        showFeedback("¡Felicidades! Completaste todo el abecedario 🌟🎊", "success")
        setTimeout(() => {
          resetConnectMode()
        }, 2000)
      }, 1500)
    } else {
      // Generar nueva letra objetivo
      setTimeout(() => {
        generateNewTargetLetter()
      }, 1500)
    }
  } else {
    state.fallosConnect++
    state.sessionStats[state.difficulty].connect.fallos++
    updateCounters()
    saveProgress()
    saveStats()
    showFeedback(`Incorrecto. Intenta de nuevo 🤔`, "error")
    playErrorSound()

    const letters = document.querySelectorAll(".connect-letter")
    letters.forEach((letter) => {
      if (letter.dataset.letter === selectedLetter) {
        letter.classList.add("incorrect")
        setTimeout(() => {
          letter.classList.remove("incorrect")
        }, 500)
      }
    })
  }
}

// ===== SISTEMA DE PUNTUACIÓN =====
function updateCounters() {
  const aciertosVisual = document.getElementById("aciertosVisual")
  const fallosVisual = document.getElementById("fallosVisual")
  const aciertosKeyboard = document.getElementById("aciertosKeyboard")
  const fallosKeyboard = document.getElementById("fallosKeyboard")
  const aciertosWrite = document.getElementById("aciertosWrite")
  const fallosWrite = document.getElementById("fallosWrite")
  const aciertosConnect = document.getElementById("aciertosConnect")
  const fallosConnect = document.getElementById("fallosConnect")

  if (aciertosVisual) aciertosVisual.textContent = state.aciertosVisual
  if (fallosVisual) fallosVisual.textContent = state.fallosVisual
  if (aciertosKeyboard) aciertosKeyboard.textContent = state.aciertosKeyboard
  if (fallosKeyboard) fallosKeyboard.textContent = state.fallosKeyboard
  if (aciertosWrite) aciertosWrite.textContent = state.aciertosWrite
  if (fallosWrite) fallosWrite.textContent = state.fallosWrite
  if (aciertosConnect) aciertosConnect.textContent = state.aciertosConnect
  if (fallosConnect) fallosConnect.textContent = state.fallosConnect
}

// ===== MODALES (MISIÓN Y VISIÓN) =====
function setupModalButtons() {
  const btnProposito = document.getElementById("btnProposito")
  const propositoMenu = document.getElementById("propositoMenu")

  btnProposito.addEventListener("click", (e) => {
    e.stopPropagation()
    propositoMenu.classList.toggle("show")
  })

  // Cerrar menú al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (!propositoMenu.contains(e.target) && e.target !== btnProposito) {
      propositoMenu.classList.remove("show")
    }
  })

  // Botones para abrir modales
  document.getElementById("btnMision").addEventListener("click", () => {
    openModal("modalMision")
    propositoMenu.classList.remove("show")
  })

  document.getElementById("btnVision").addEventListener("click", () => {
    openModal("modalVision")
    propositoMenu.classList.remove("show")
  })

  document.getElementById("btnVideo").addEventListener("click", () => {
    openModal("modalVideo")
  })

  document.getElementById("btnRegistro").addEventListener("click", () => {
    openModal("modalRegistro")
  })

  document.getElementById("registroForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const nombre = document.getElementById("nombreUsuario").value
    const email = document.getElementById("emailUsuario").value

    // Guardar datos de forma segura (solo en localStorage, respetando privacidad)
    localStorage.setItem("abc_user", JSON.stringify({ nombre, email }))

    showFeedback(`¡Bienvenido ${nombre}! Registro exitoso 🎉`, "success")
    closeModal("modalRegistro")

    // Limpiar formulario
    document.getElementById("registroForm").reset()
  })

  // Botones para cerrar modales
  document.querySelectorAll(".modal-close").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const modalId = e.target.dataset.modal
      closeModal(modalId)
    })
  })

  // Cerrar modal al hacer clic fuera
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal.id)
      }
    })
  })
}

function openModal(modalId) {
  document.getElementById(modalId).classList.add("show")

  if (modalId === "modalVideo") {
    const videoFrame = document.getElementById("videoFrame")
    if (videoFrame && !videoFrame.src) {
      videoFrame.src = "https://www.youtube.com/embed/YkJY7PqXLgg"
    }
  }
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("show")

  if (modalId === "modalVideo") {
    const videoFrame = document.getElementById("videoFrame")
    if (videoFrame) {
      videoFrame.src = ""
    }
  }
}

// ===== SISTEMA DE CALIFICACIÓN =====
function setupRatingSystem() {
  const stars = document.querySelectorAll(".star")
  const ratingText = document.getElementById("ratingText")

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const rating = Number.parseInt(star.dataset.rating)
      state.userRating = rating

      // Actualizar estrellas visuales
      stars.forEach((s, index) => {
        if (index < rating) {
          s.classList.add("active")
        } else {
          s.classList.remove("active")
        }
      })

      // Actualizar texto
      const messages = [
        "",
        "Necesitamos mejorar 😢",
        "Podemos hacerlo mejor 🤔",
        "Está bien 😊",
        "¡Muy bueno! 😄",
        "¡Excelente! 🌟",
      ]
      ratingText.textContent = messages[rating]

      // Guardar calificación (localStorage para privacidad)
      saveUserRating(rating)

      // Mostrar agradecimiento
      setTimeout(() => {
        showFeedback("¡Gracias por tu calificación! 💖", "success")
      }, 500)
    })

    // Efecto hover
    star.addEventListener("mouseenter", () => {
      const rating = Number.parseInt(star.dataset.rating)
      stars.forEach((s, index) => {
        if (index < rating) {
          s.style.filter = "grayscale(0%)"
        }
      })
    })

    star.addEventListener("mouseleave", () => {
      stars.forEach((s, index) => {
        if (index >= state.userRating) {
          s.style.filter = "grayscale(100%)"
        }
      })
    })
  })
}

function saveUserRating(rating) {
  // Guardar en localStorage (respetando privacidad del usuario)
  localStorage.setItem("abc_rating", rating)
}

function loadUserRating() {
  const savedRating = localStorage.getItem("abc_rating")
  if (savedRating) {
    const rating = Number.parseInt(savedRating)
    state.userRating = rating

    // Actualizar estrellas
    const stars = document.querySelectorAll(".star")
    stars.forEach((s, index) => {
      if (index < rating) {
        s.classList.add("active")
      }
    })

    // Actualizar texto
    const messages = [
      "",
      "Necesitamos mejorar 😢",
      "Podemos hacerlo mejor 🤔",
      "Está bien 😊",
      "¡Muy bueno! 😄",
      "¡Excelente! 🌟",
    ]
    document.getElementById("ratingText").textContent = messages[rating]
  }
}

// ===== UTILIDADES =====
// Prevenir que el espacio baje la página
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && e.target === document.body) {
    e.preventDefault()
  }
})

function hideHeaderShowInicio() {
  const header = document.getElementById("mainHeader")
  const btnInicio = document.getElementById("btnInicio")
  const mainContainer = document.querySelector(".main-container")
  const hamburgerBtn = document.getElementById("hamburgerBtn")

  if (header && btnInicio) {
    header.classList.add("hidden")
    btnInicio.style.display = "flex"
    if (mainContainer) {
      mainContainer.classList.add("content-up")
    }
    if (hamburgerBtn) {
      hamburgerBtn.classList.add("btn-up")
    }
  }
}

function showHeaderHideInicio() {
  const header = document.getElementById("mainHeader")
  const btnInicio = document.getElementById("btnInicio")
  const mainContainer = document.querySelector(".main-container")
  const hamburgerBtn = document.getElementById("hamburgerBtn")

  if (header && btnInicio) {
    header.classList.remove("hidden")
    btnInicio.style.display = "none"
    if (mainContainer) {
      mainContainer.classList.remove("content-up")
    }
    if (hamburgerBtn) {
      hamburgerBtn.classList.remove("btn-up")
    }
  }
}

// ===== NUEVAS FUNCIONES =====
function playSuccessSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = 523.25 // C5
  oscillator.type = "sine"

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.5)
}

function playErrorSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = 200 // Lower frequency for error
  oscillator.type = "sawtooth"

  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.3)
}

function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas")
  const ctx = canvas.getContext("2d")
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const particles = []
  const particleCount = 150
  const colors = ["#ff6b9d", "#4ecdc4", "#ffe66d", "#51cf66", "#ff6b6b"]

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 2,
      d: Math.random() * particleCount,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0,
    })
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < particleCount; i++) {
      const p = particles[i]
      ctx.beginPath()
      ctx.lineWidth = p.r / 2
      ctx.strokeStyle = p.color
      ctx.moveTo(p.x + p.tilt + p.r, p.y)
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r)
      ctx.stroke()
    }

    update()
  }

  function update() {
    let remaining = 0
    for (let i = 0; i < particleCount; i++) {
      const p = particles[i]
      p.tiltAngle += p.tiltAngleIncremental
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2
      p.tilt = Math.sin(p.tiltAngle - i / 3) * 15

      if (p.y <= canvas.height) remaining++
    }

    if (remaining > 0) {
      requestAnimationFrame(draw)
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  draw()
}

function setupDifficultySelector() {
  const difficultySelect = document.getElementById("difficultyLevel")
  const difficultyIndicator = document.getElementById("difficultyIndicator")

  if (difficultySelect) {
    difficultySelect.addEventListener("change", (e) => {
      state.difficulty = e.target.value
      if (difficultyIndicator) {
        difficultyIndicator.textContent = getDifficultyName(state.difficulty)
      }
      saveProgress()
      showFeedback(`Nivel cambiado a: ${getDifficultyName(state.difficulty)}`, "success")

      applyDifficultyToCurrentMode()
    })

    // Cargar dificultad guardada
    const savedDifficulty = localStorage.getItem("abc_difficulty")
    if (savedDifficulty) {
      state.difficulty = savedDifficulty
      difficultySelect.value = savedDifficulty
      if (difficultyIndicator) {
        difficultyIndicator.textContent = getDifficultyName(savedDifficulty)
      }
    }
  }
}

function applyDifficultyToCurrentMode() {
  switch (state.currentMode) {
    case "keyboard":
      // La velocidad de pronunciación ya se aplica automáticamente en playLetterSound
      showFeedback(`Velocidad de pronunciación ajustada a nivel ${getDifficultyName(state.difficulty)}`, "success")
      break
    case "write":
      // Reiniciar el modo escribir con nueva dificultad
      resetWriteMode()
      showFeedback(`Cantidad de letras ajustada a nivel ${getDifficultyName(state.difficulty)}`, "success")
      break
    case "connect":
      // La dificultad en conectar se puede ajustar con tiempo o cantidad
      showFeedback(`Dificultad ajustada a nivel ${getDifficultyName(state.difficulty)}`, "success")
      break
  }
}

function getDifficultyName(difficulty) {
  const names = {
    easy: "Fácil",
    medium: "Medio",
    hard: "Difícil",
  }
  return names[difficulty] || "Medio"
}

function getDifficultySpeed() {
  const speeds = {
    easy: 0.7, // Más lento para fácil
    medium: 1.0,
    hard: 1.3, // Más rápido para difícil
  }
  return speeds[state.difficulty] || 1.0
}

function getEmptyLettersCount() {
  const counts = {
    easy: Math.floor(alphabet.length / 4), // 25% vacías (fácil)
    medium: Math.floor(alphabet.length / 3), // 33% vacías (medio)
    hard: Math.floor(alphabet.length / 2), // 50% vacías (difícil)
  }
  return counts[state.difficulty] || counts.medium
}

function setupStatsButton() {
  const btnStats = document.getElementById("btnStats")
  if (btnStats) {
    btnStats.addEventListener("click", () => {
      openStatsModal()
    })
  }

  const btnResetStats = document.getElementById("btnResetStats")
  if (btnResetStats) {
    btnResetStats.addEventListener("click", () => {
      resetStats()
    })
  }

  const statsDifficultySelect = document.getElementById("statsDifficultyLevel")
  if (statsDifficultySelect) {
    statsDifficultySelect.addEventListener("change", () => {
      updateStatsDisplay()
    })
  }
}

function openStatsModal() {
  const statsDifficultySelect = document.getElementById("statsDifficultyLevel")
  if (statsDifficultySelect) {
    statsDifficultySelect.value = state.difficulty
  }
  updateStatsDisplay()
  openModal("modalStats")
}

function updateStatsDisplay() {
  const statsDifficultySelect = document.getElementById("statsDifficultyLevel")
  const selectedDifficulty = statsDifficultySelect ? statsDifficultySelect.value : "all"

  let stats
  if (selectedDifficulty === "all") {
    // Sumar estadísticas de todos los niveles
    stats = {
      visual: { aciertos: 0, fallos: 0 }, // Agregando estadísticas para opción 1
      keyboard: { aciertos: 0, fallos: 0 },
      write: { aciertos: 0, fallos: 0 },
      connect: { aciertos: 0, fallos: 0 },
    }
    for (const difficulty of ["easy", "medium", "hard"]) {
      stats.visual.aciertos += state.sessionStats[difficulty].visual.aciertos
      stats.visual.fallos += state.sessionStats[difficulty].visual.fallos
      stats.keyboard.aciertos += state.sessionStats[difficulty].keyboard.aciertos
      stats.keyboard.fallos += state.sessionStats[difficulty].keyboard.fallos
      stats.write.aciertos += state.sessionStats[difficulty].write.aciertos
      stats.write.fallos += state.sessionStats[difficulty].write.fallos
      stats.connect.aciertos += state.sessionStats[difficulty].connect.aciertos
      stats.connect.fallos += state.sessionStats[difficulty].connect.fallos
    }
  } else {
    // Mostrar estadísticas del nivel seleccionado
    stats = state.sessionStats[selectedDifficulty]
  }

  // Modo Visual
  document.getElementById("statAciertosVisual").textContent = stats.visual.aciertos
  document.getElementById("statFallosVisual").textContent = stats.visual.fallos
  const precisionVisual =
    stats.visual.aciertos + stats.visual.fallos > 0
      ? Math.round((stats.visual.aciertos / (stats.visual.aciertos + stats.visual.fallos)) * 100)
      : 0
  document.getElementById("statPrecisionVisual").textContent = `${precisionVisual}%`
  document.getElementById("chartVisual").style.width = `${precisionVisual}%`

  // Modo Keyboard
  document.getElementById("statAciertosKeyboard").textContent = stats.keyboard.aciertos
  document.getElementById("statFallosKeyboard").textContent = stats.keyboard.fallos
  const precisionKeyboard =
    stats.keyboard.aciertos + stats.keyboard.fallos > 0
      ? Math.round((stats.keyboard.aciertos / (stats.keyboard.aciertos + stats.keyboard.fallos)) * 100)
      : 0
  document.getElementById("statPrecisionKeyboard").textContent = `${precisionKeyboard}%`
  document.getElementById("chartKeyboard").style.width = `${precisionKeyboard}%`

  // Modo Write
  document.getElementById("statAciertosWrite").textContent = stats.write.aciertos
  document.getElementById("statFallosWrite").textContent = stats.write.fallos
  const precisionWrite =
    stats.write.aciertos + stats.write.fallos > 0
      ? Math.round((stats.write.aciertos / (stats.write.aciertos + stats.write.fallos)) * 100)
      : 0
  document.getElementById("statPrecisionWrite").textContent = `${precisionWrite}%`
  document.getElementById("chartWrite").style.width = `${precisionWrite}%`

  // Modo Connect
  document.getElementById("statAciertosConnect").textContent = stats.connect.aciertos
  document.getElementById("statFallosConnect").textContent = stats.connect.fallos
  const precisionConnect =
    stats.connect.aciertos + stats.connect.fallos > 0
      ? Math.round((stats.connect.aciertos / (stats.connect.aciertos + stats.connect.fallos)) * 100)
      : 0
  document.getElementById("statPrecisionConnect").textContent = `${precisionConnect}%`
  document.getElementById("chartConnect").style.width = `${precisionConnect}%`
}

function resetStats() {
  state.sessionStats = {
    easy: {
      visual: { aciertos: 0, fallos: 0 }, // Agregando reset para opción 1
      keyboard: { aciertos: 0, fallos: 0 },
      write: { aciertos: 0, fallos: 0 },
      connect: { aciertos: 0, fallos: 0 },
    },
    medium: {
      visual: { aciertos: 0, fallos: 0 },
      keyboard: { aciertos: 0, fallos: 0 },
      write: { aciertos: 0, fallos: 0 },
      connect: { aciertos: 0, fallos: 0 },
    },
    hard: {
      visual: { aciertos: 0, fallos: 0 },
      keyboard: { aciertos: 0, fallos: 0 },
      write: { aciertos: 0, fallos: 0 },
      connect: { aciertos: 0, fallos: 0 },
    },
  }
  saveStats()
  updateStatsDisplay()
  showFeedback("Estadísticas reiniciadas", "success")
}

function saveStats() {
  localStorage.setItem("abc_stats", JSON.stringify(state.sessionStats))
}

function loadStats() {
  const savedStats = localStorage.getItem("abc_stats")
  if (savedStats) {
    state.sessionStats = JSON.parse(savedStats)
  }
}

function saveProgress() {
  const progress = {
    difficulty: state.difficulty,
    usedLettersKeyboard: Array.from(state.usedLettersKeyboard),
    usedLettersWrite: Array.from(state.usedLettersWrite),
    usedLettersConnect: Array.from(state.usedLettersConnect),
    usedLettersVisual: Array.from(state.usedLettersVisual),
    aciertosVisual: state.aciertosVisual, // Guardando progreso de opción 1
    fallosVisual: state.fallosVisual,
    aciertosKeyboard: state.aciertosKeyboard,
    fallosKeyboard: state.fallosKeyboard,
    aciertosWrite: state.aciertosWrite,
    fallosWrite: state.fallosWrite,
    aciertosConnect: state.aciertosConnect,
    fallosConnect: state.fallosConnect,
  }
  localStorage.setItem("abc_progress", JSON.stringify(progress))
}

function loadProgress() {
  const savedProgress = localStorage.getItem("abc_progress")
  if (savedProgress) {
    const progress = JSON.parse(savedProgress)
    state.difficulty = progress.difficulty || "medium"
    state.usedLettersKeyboard = new Set(progress.usedLettersKeyboard || [])
    state.usedLettersWrite = new Set(progress.usedLettersWrite || [])
    state.usedLettersConnect = new Set(progress.usedLettersConnect || [])
    state.usedLettersVisual = new Set(progress.usedLettersVisual || [])
    state.aciertosVisual = progress.aciertosVisual || 0 // Cargando progreso de opción 1
    state.fallosVisual = progress.fallosVisual || 0
    state.aciertosKeyboard = progress.aciertosKeyboard || 0
    state.fallosKeyboard = progress.fallosKeyboard || 0
    state.aciertosWrite = progress.aciertosWrite || 0
    state.fallosWrite = progress.fallosWrite || 0
    state.aciertosConnect = progress.aciertosConnect || 0
    state.fallosConnect = progress.fallosConnect || 0

    updateCounters()
    updateProgressBars()
  }
}

function updateProgressBars() {
  // Modo Visual
  const progressVisual = state.usedLettersVisual.size
  document.getElementById("progressVisual").textContent = `${progressVisual}/27`
  document.getElementById("progressBarVisual").style.width = `${(progressVisual / 27) * 100}%`

  // Modo Keyboard
  const progressKeyboard = state.usedLettersKeyboard.size
  document.getElementById("progressKeyboard").textContent = `${progressKeyboard}/27`
  document.getElementById("progressBarKeyboard").style.width = `${(progressKeyboard / 27) * 100}%`

  // Modo Write
  const progressWrite = state.usedLettersWrite.size
  document.getElementById("progressWrite").textContent = `${progressWrite}/27`
  document.getElementById("progressBarWrite").style.width = `${(progressWrite / 27) * 100}%`

  // Modo Connect
  const progressConnect = state.usedLettersConnect.size
  document.getElementById("progressConnect").textContent = `${progressConnect}/27`
  document.getElementById("progressBarConnect").style.width = `${(progressConnect / 27) * 100}%`
}
