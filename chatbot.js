document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const messagesContainer = document.getElementById('chat-messages');

    // Toggle Chat Window
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
    });

    closeChat.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    // Send Message Logic
    // Send Message Logic
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (message === "") return;

        // Add User Message
        appendMessage(message, 'user-message');
        chatInput.value = "";

        // Show Typing Indicator
        showTypingIndicator();

        // Get Bot Response
        try {
            const botResponse = await getBotResponse(message);
            // Simulate delay for realism if response is instant (like simple text)
            // If it was an API call, the await already adds delay.
            // We can add a minimum delay to ensure the typing indicator is seen.
            setTimeout(() => {
                removeTypingIndicator();
                appendMessage(botResponse, 'bot-message');
            }, 500);
        } catch (error) {
            removeTypingIndicator();
            appendMessage("Sorry, I'm having trouble connecting to my brain right now! 🧠💥", 'bot-message');
        }
    }

    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Suggestion Chips Logic
    // Suggestion Chips Logic
    const suggestions = [
        { text: "My Skills 💻", value: "skills" },
        { text: "Experience 💼", value: "experience" },
        { text: "Projects 🚀", value: "projects" },
        { text: "Weather ☀️", value: "weather" },
        { text: "Global News 📰", value: "news" }
    ];

    function renderSuggestions() {
        // Remove existing suggestions if any
        const existing = document.querySelector('.suggestions-container');
        if (existing) existing.remove();

        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'suggestions-container';

        suggestions.forEach(suggestion => {
            const btn = document.createElement('button');
            btn.className = 'suggestion-chip';
            btn.textContent = suggestion.text;
            btn.onclick = () => {
                // Use value for cleaner logic interaction if needed, or text
                // For now just send the text
                chatInput.value = suggestion.value;
                sendMessage();
            };
            suggestionsContainer.appendChild(btn);
        });

        messagesContainer.appendChild(suggestionsContainer);
        scrollToBottom();
    }

    // Call suggestions on load
    renderSuggestions();

    // Helper: Append Message
    function appendMessage(text, className) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', className);
        messageDiv.innerHTML = text; // Allow HTML in responses
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    // Helper: Typing Indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'message bot-message typing';
        typingDiv.innerHTML = '<span>.</span><span>.</span><span>.</span>';
        messagesContainer.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typingDiv = document.getElementById('typing-indicator');
        if (typingDiv) typingDiv.remove();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Helper: Mock AI Logic & API Calls
    async function getBotResponse(input) {
        input = input.toLowerCase();

        // 1. Weather Logic
        if (input.includes('weather')) {
            // Check if a city is mentioned "weather in [city]"
            const cityMatch = input.match(/weather in (.+)/i);
            if (cityMatch && cityMatch[1]) {
                const city = cityMatch[1].trim();
                return await fetchWeather(city);
            } else {
                return "I can check the weather for you! 🌤️<br>Try typing <strong>'Weather in [City Name]'</strong> (e.g., 'Weather in New York').";
            }
        }

        // 2. News Logic
        else if (input.includes('news')) {
            return await fetchNews();
        }

        // 3. Existing Portfolio Logic
        else if (input.includes('hello') || input.includes('hi')) {
            return "Hi there! I can answer questions about Vaishali's resume, skills, or projects. Try clicking a suggestion below! 👇";
        } else if (input.includes('contact') || input.includes('email') || input.includes('phone')) {
            return "You can reach Vaishali at <a href='mailto:vaishalishah9582@gmail.com'>vaishalishah9582@gmail.com</a> or <a href='tel:9739681754'>(973) 968-1754</a>.";
        } else if (input.includes('skill') || input.includes('python') || input.includes('java')) {
            return "Here are her top skills:<br>• <strong>Languages:</strong> Python, Java, SQL, HTML/CSS<br>• <strong>Tools:</strong> Excel, Access, Tableau, Bloomberg Terminal";
        } else if (input.includes('experience') || input.includes('work')) {
            return "Professional Experience:<br>• <strong>IT Help Desk</strong> @ Caldwell University<br>• <strong>Account Executive Intern</strong> @ NL30<br>• <strong>IT Extern</strong> @ West Essex YMCA";
        } else if (input.includes('project')) {
            return "Top Projects:<br>1. <strong>Business Analytics:</strong> Regression analysis on real-world data.<br>2. <strong>Database Management:</strong> Designed complex SQL schemas.<br>Check the <a href='#projects'>Projects Section</a> for details!";
        } else if (input.includes('education') || input.includes('school') || input.includes('gpa')) {
            return "She is pursuing a B.S. in <strong>Supply Chain Management & CIS</strong> at Caldwell University with a <strong>3.59 GPA</strong>.";
        } else {
            return "I'm still learning! Try asking about 'skills', 'contact', 'experience', 'projects', 'weather' or 'news'.";
        }
    }

    // API Functions
    async function fetchWeather(city) {
        try {
            // Geocoding
            const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
            const geoData = await geoResponse.json();

            if (!geoData.results || geoData.results.length === 0) {
                return `Sorry, I couldn't find a city named "${city}". 🌍`;
            }

            const { latitude, longitude, name, country } = geoData.results[0];

            // Weather
            const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit`);
            const weatherData = await weatherResponse.json();

            const temp = weatherData.current_weather.temperature;
            const wind = weatherData.current_weather.windspeed;

            return `Current weather in <strong>${name}, ${country}</strong>: <br>🌡️ <strong>${temp}°F</strong> <br>💨 Wind: ${wind} km/h`;

        } catch (error) {
            console.error(error);
            return "Oops! I couldn't fetch the weather right now. Please try again later. ☁️";
        }
    }

    async function fetchNews() {
        // Mock News for demo purposes
        const headlines = [
            "Supply Chain Optimization: AI's Role in 2026 🚛",
            "Tech Trends: Python Remains Top Choice for Data Science 🐍",
            "Global Markets: Sustainable Logistics on the Rise 🌱",
            "Innovation: New Database Technologies Transforming Business 💾",
            "Cybersecurity: Key Focus for IT Departments in 2026 🔒"
        ];

        // Randomly select 3
        const selected = headlines.sort(() => 0.5 - Math.random()).slice(0, 3);

        let response = "<strong>Latest Global Headlines:</strong><br><br>";
        selected.forEach(headline => {
            response += `📰 ${headline}<br>`;
        });

        return response + "<br><em>(Live news feed simulation)</em>";
    }
});
