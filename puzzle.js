document.addEventListener('DOMContentLoaded', () => {
    // --- Riddle Logic ---
    const submitBtn = document.getElementById('submit-riddle');
    const riddleInput = document.getElementById('riddle-answer');
    const feedbackFunc = document.getElementById('riddle-feedback');
    const reward = document.getElementById('hidden-reward');
    const questionEl = document.getElementById('riddle-question');
    const showAnswerBtn = document.getElementById('show-answer-btn');
    const answerRevealEl = document.getElementById('answer-reveal');
    const rewardText = document.getElementById('reward-text');

    const riddles = [
        {
            q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
            a: "echo",
            hint: "It repeats back to you..."
        },
        {
            q: "The more of this there is, the less you see. What is it?",
            a: "darkness",
            hint: "Think about the absence of light."
        },
        {
            q: "I have keys but no locks. I have a space but no room. You can enter, but can't go outside. What am I?",
            a: "keyboard",
            hint: "You are likely using one right now!"
        },
        {
            q: "I follow you all the time and copy your every move, but you can’t touch me or catch me. What am I?",
            a: "shadow",
            hint: "I disappear in total darkness."
        },
        {
            q: "I am always hungry, I must always be fed. The finger I touch, will soon turn red. What am I?",
            a: "fire",
            hint: "I give off heat."
        }
    ];

    let currentRiddleIndex = 0;

    if (submitBtn) {
        loadRiddle(currentRiddleIndex);

        submitBtn.addEventListener('click', checkRiddle);
        riddleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkRiddle();
        });

        showAnswerBtn.addEventListener('click', () => {
            answerRevealEl.style.display = 'block';
            answerRevealEl.textContent = `Answer: ${riddles[currentRiddleIndex].a.toUpperCase()}`;
        });
    }

    function loadRiddle(index) {
        if (index < riddles.length) {
            questionEl.textContent = `"${riddles[index].q}"`;
            // Removed: countEl.textContent... (Do not show riddle count as requested)
            riddleInput.value = '';
            feedbackFunc.textContent = '';
            feedbackFunc.className = 'riddle-feedback';
            reward.style.display = 'none';
            answerRevealEl.style.display = 'none';
        } else {
            // All solved
            questionEl.textContent = "🎉 You've solved all the riddles! You are a master of logic.";
            riddleInput.style.display = 'none';
            submitBtn.style.display = 'none';
            showAnswerBtn.style.display = 'none';
            feedbackFunc.textContent = "Great job!";
            feedbackFunc.className = "riddle-feedback success";
        }
    }

    function checkRiddle() {
        if (currentRiddleIndex >= riddles.length) return;

        const answer = riddleInput.value.trim().toLowerCase();
        const correct = riddles[currentRiddleIndex].a;

        if (answer.includes(correct)) {
            feedbackFunc.textContent = "Correct!";
            feedbackFunc.className = "riddle-feedback success";

            reward.style.display = "block";
            rewardText.textContent = "Next riddle loading...";

            // Wait 1.5s then load next
            setTimeout(() => {
                currentRiddleIndex++;
                loadRiddle(currentRiddleIndex);
            }, 1500);

        } else {
            feedbackFunc.textContent = `Not quite. (Hint: ${riddles[currentRiddleIndex].hint})`;
            feedbackFunc.className = "riddle-feedback error";
        }
    }

    // --- Image Clock Logic ---
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        // const seconds = String(now.getSeconds()).padStart(2, '0'); // Optional

        updateDigit('h1', hours[0]);
        updateDigit('h2', hours[1]);
        updateDigit('m1', minutes[0]);
        updateDigit('m2', minutes[1]);
    }

    function updateDigit(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
            el.style.textShadow = `0 0 10px ${getColorForDigit(value)}`;
        }
    }

    function getColorForDigit(val) {
        const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f', '#fa0', '#0af', '#a0f', '#fff'];
        return colors[val] || '#fff';
    }

    setInterval(updateClock, 1000);
    updateClock();

    // --- Theme Switcher Logic ---
    const themeBtns = document.querySelectorAll('.theme-btn');
    const body = document.body;

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            body.classList.remove('light-mode', 'dark-mode', 'retro-mode', 'neon-mode');
            body.classList.add(btn.getAttribute('data-theme'));
        });
    });
});
