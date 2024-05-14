document.addEventListener("DOMContentLoaded", function () {
    const googleTab = document.getElementById("googleTab");
    const geminiTab = document.getElementById("geminiTab");
    const wikipediaTab = document.getElementById("wikipediaTab");
    const voiceSearchBtn = document.getElementById('voiceSearchBtn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById("searchBtn");
    const searchResults = document.getElementById("searchResults");
    const switchInput = document.querySelector('.input');
    

    // Event listener for search button click
    searchBtn.addEventListener("click", function () {
        const query = searchInput.value.trim();
        if (query) {
            if (googleTab.classList.contains("active")) {
                searchGoogle(query);
            } else if (geminiTab.classList.contains("active")) {
                searchGemini(query);
            } else if (wikipediaTab.classList.contains("active")) {
                searchWikipedia(query);
            }
        } else {
            displayError("Please enter a search query.");
        }
    });

    // Event listener for voice search button click
    voiceSearchBtn.addEventListener('click', () => {
        // Initialize SpeechRecognition object
        const recognition = new webkitSpeechRecognition(); // for Webkit browsers
        // Set properties for speech recognition
        recognition.lang = 'en-US'; // Language for speech recognition
        recognition.interimResults = false; // Disable interim results

        // Start speech recognition
        recognition.start();

        // Event listener for when speech is recognized
        recognition.onresult = function (event) {
            // Get recognized speech result
            const speechResult = event.results[0][0].transcript;
            // Populate search input field with recognized speech
            searchInput.value = speechResult;
        };

        // Event listener for speech recognition errors
        recognition.onerror = function (event) {
            console.error('Speech recognition error:', event.error);
        };
    });

    // Event listener for switch toggle
    switchInput.addEventListener('change', function () {
        if (this.checked) {
            // Dark mode
            enableDarkMode();
        } else {
            // Light mode
            enableLightMode();
        }
    });

    // Function to enable dark mode
    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    }

    // Function to enable light mode
    function enableLightMode() {
        document.body.classList.remove('dark-mode');
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
    }

    // Function to set active tab
    function setActiveTab(tab) {
        const tabs = [googleTab, geminiTab, wikipediaTab];
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
    }

    googleTab.addEventListener("click", function () {
        setActiveTab(googleTab);
    });

    geminiTab.addEventListener("click", function () {
        setActiveTab(geminiTab);
    });

    wikipediaTab.addEventListener("click", function () {
        setActiveTab(wikipediaTab);
    });

    // Function to start speech recognition
function startSpeechRecognition() {
    // Initialize SpeechRecognition object
    const recognition = new webkitSpeechRecognition(); // for Webkit browsers
    // Set properties for speech recognition
    recognition.lang = 'en-US'; // Language for speech recognition
    recognition.interimResults = false; // Disable interim results

    // Start speech recognition
    recognition.start();

    // Event listener for when speech is recognized
    recognition.onresult = function(event) {
        // Get recognized speech result
        const speechResult = event.results[0][0].transcript;
        // Populate search input field with recognized speech
        searchInput.value = speechResult;
    };

    // Event listener for speech recognition errors
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
    };

    // Stop speech recognition after 10 seconds (adjust duration as needed)
    setTimeout(() => {
        recognition.stop();
    }, 10000); // 10000 milliseconds = 10 seconds
}

// Add event listener to voice search button
voiceSearchBtn.addEventListener('click', startSpeechRecognition);

    function setActiveTab(tab) {
        const tabs = [googleTab, geminiTab, wikipediaTab];
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
    }

    // Function to display Google search results
    function displayGoogleResults(results) {
        searchResults.innerHTML = ""; // Clear loading indicator
        if (results && results.length > 0) {
            results.forEach(result => {
                const resultDiv = document.createElement("div");
                resultDiv.classList.add("searchResult");

                // Display title, snippet, and URL
                const title = document.createElement("h2");
                title.textContent = result.title;
                const snippet = document.createElement("p");
                snippet.textContent = result.snippet;
                const url = document.createElement("a");
                url.textContent = result.url;
                url.href = result.url;
                url.target = "_blank"; // Open link in a new tab
                resultDiv.appendChild(title);
                resultDiv.appendChild(snippet);
                resultDiv.appendChild(url);

                searchResults.appendChild(resultDiv);
            });
            searchResults.scrollIntoView({ behavior: 'smooth' }); // Smooth scrolling to results
        } else {
            displayError("No results found.");
        }
    }

    // Function to display Gemini search results
    function displayGeminiResults(results) {
        searchResults.innerHTML = ""; // Clear loading indicator
        if (results && results.length > 0) {
            results.forEach(result => {
                const resultDiv = document.createElement("div");
                resultDiv.classList.add("searchResult");

                // Check if the result contains image (optional)
                if (result.image) {
                    const image = document.createElement("img");
                    image.src = result.image;
                    resultDiv.appendChild(image);
                }

                // Display text
                const text = document.createElement("p");
                text.textContent = result.text;
                resultDiv.appendChild(text);

                searchResults.appendChild(resultDiv);
            });
            searchResults.scrollIntoView({ behavior: 'smooth' }); // Smooth scrolling to results
        } else {
            displayError("No results found.");
        }
    }

    // Function to display Wikipedia search results
    function displayWikipediaResults(results) {
        searchResults.innerHTML = ""; // Clear loading indicator
        if (results && results.length > 0) {
            results.forEach(result => {
                const resultDiv = document.createElement("div");
                resultDiv.classList.add("searchResult");

                // Display title and snippet
                const title = document.createElement("h2");
                title.textContent = result.title;
                const snippet = document.createElement("p");
                snippet.textContent = result.snippet;
                resultDiv.appendChild(title);
                resultDiv.appendChild(snippet);

                searchResults.appendChild(resultDiv);
            });
            searchResults.scrollIntoView({ behavior: 'smooth' }); // Smooth scrolling to results
        } else {
            displayError("No results found.");
        }
    }

    async function searchGoogle(query) {
        const url = `https://google-search74.p.rapidapi.com/?query=${encodeURIComponent(query)}&limit=10&related_keywords=true`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'acf7360db2mshd6af464ba7a95f2p157a14jsn5b5224300c9c',
                'X-RapidAPI-Host': 'google-search74.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Failed to fetch search results from ${url}`);
            }
            const data = await response.json();
            if (!data || !data.results) {
                throw new Error('Invalid response format');
            }
            displayGoogleResults(data.results);
        } catch (error) {
            displayError(`Error: ${error.message}`);
        }
    }

    async function searchGemini(query) {
        const url = 'https://gemini-pro-vision-ai1.p.rapidapi.com/';
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': 'acf7360db2mshd6af464ba7a95f2p157a14jsn5b5224300c9c',
                'X-RapidAPI-Host': 'gemini-pro-vision-ai1.p.rapidapi.com'
            },
            body: {
                contents: [
                    {
                        parts: [
                            {
                                inline_data: {
                                    mime_type: 'image/png',
                                    data: 'https://i.imgur.com/BntoGKk.png'
                                }
                            },
                            {
                                text: query
                            }
                        ]
                    }
                ]
            }
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Failed to fetch search results from ${url}`);
            }
            const data = await response.json();
            if (!data || !data.contents) {
                throw new Error('Invalid response format');
            }
            displayGeminiResults(data.contents);
        } catch (error) {
            displayError(`Error: ${error.message}`);
        }
    }

    async function searchWikipedia(query) {
        const url = `https://wikipedia-api1.p.rapidapi.com/search?q=${encodeURIComponent(query)}&lang=en`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'acf7360db2mshd6af464ba7a95f2p157a14jsn5b5224300c9c',
                'X-RapidAPI-Host': 'wikipedia-api1.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Failed to fetch search results from ${url}`);
            }
            const data = await response.json();
            if (!data || !data.data || data.data.length === 0) {
                throw new Error('No results found.');
            }
            const results = data.data.map(item => ({
                title: item.title,
                snippet: item.snippet
            }));
            displayWikipediaResults(results);
        } catch (error) {
            displayError(`Error: ${error.message}`);
        }
    }

    function displayError(message) {
        searchResults.innerHTML = `<p>${message}</p>`;
    }
});
