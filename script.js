document.addEventListener("DOMContentLoaded", function () {
    const googleTab = document.getElementById("googleTab");
    const geminiTab = document.getElementById("geminiTab");
    const wikipediaTab = document.getElementById("wikipediaTab");
    const voiceSearchBtn = document.getElementById('voiceSearchBtn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById("searchBtn");
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
            alert("Please enter a search query.");
        }
    });

    // Event listener for voice search button click
    voiceSearchBtn.addEventListener('click', startSpeechRecognition);

    // Event listener for switch toggle
    switchInput.addEventListener('change', function () {
        if (this.checked) {
            enableDarkMode();
        } else {
            enableLightMode();
        }
    });

    // Function to enable dark mode
    function enableDarkMode() {
        document.body.classList.add('dark-mode');
    }

    // Function to enable light mode
    function enableLightMode() {
        document.body.classList.remove('dark-mode');
    }

    // Function to start speech recognition
    function startSpeechRecognition() {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.start();

        recognition.onresult = function (event) {
            const speechResult = event.results[0][0].transcript;
            searchInput.value = speechResult;
        };

        recognition.onerror = function (event) {
            console.error('Speech recognition error:', event.error);
        };

        setTimeout(() => {
            recognition.stop();
        }, 10000);
    }

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

    // Function to display Google search results
    function displayGoogleResults(results) {
        localStorage.setItem("searchResults", JSON.stringify(results));
        window.location.href = "results.html";
    }

    // Function to display Gemini search results
    function displayGeminiResults(results) {
        localStorage.setItem("searchResults", JSON.stringify(results));
        window.location.href = "results.html";
    }

    // Function to display Wikipedia search results
    function displayWikipediaResults(results) {
        localStorage.setItem("searchResults", JSON.stringify(results));
        window.location.href = "results.html";
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
            alert(`Error: ${error.message}`);
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
            body: JSON.stringify({
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
            })
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
            alert(`Error: ${error.message}`);
        }
    }

    async function fetchWikipediaResults(query) {
        const apiEndpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`;
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        return data.query.search.map(result => ({
            title: result.title,
            link: `https://en.wikipedia.org/wiki/${result.title.replace(/ /g, '_')}`,
            snippet: stripHtmlTags(result.snippet), // Modify to strip HTML tags
        }));
    }

    function stripHtmlTags(html) {
        return html.replace(/<[^>]*>?/gm, ''); // Use regex to remove HTML tags
    }

    async function searchWikipedia(query) {
        try {
            const results = await fetchWikipediaResults(query);
            displayWikipediaResults(results);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

});
