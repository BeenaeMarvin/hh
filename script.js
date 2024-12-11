document.addEventListener('DOMContentLoaded', function() {
    // Ursprüngliche Datenstrukturen
    const avatars = [
        { id: 'knight', name: 'Ritter', image: 'knight.png' },
        { id: 'wizard', name: 'Magier', image: 'wizard.png' },
        { id: 'healer', name: 'Heiler', image: 'healer.png' },
        { id: 'warrior', name: 'Krieger', image: 'warrior.png' }
    ];

    const quests = [
        { id: 1, name: 'Spülen', exp: 10, reward: '15 min Gaming' },
        { id: 2, name: 'Staubsaugen', exp: 15, reward: 'Snack' },
        { id: 3, name: 'Wäsche waschen', exp: 20, reward: '30 min Gaming' }
    ];

    // Zustandsvariablen
    let selectedAvatar = null;
    let familyMembers = [];
    let currentQuest = null;
    let currentUser = null;  // Neue Variable für Login

    // Login-System (NEU)
    function checkLogin() {
        const loginSection = document.getElementById('login-section');
        const mainContent = document.getElementById('main-content');
        
        if (!currentUser) {
            loginSection.style.display = 'block';
            mainContent.style.display = 'none';
        } else {
            loginSection.style.display = 'none';
            mainContent.style.display = 'block';
        }
    }

    function handleLogin() {
        const userId = document.getElementById('user-select').value;
        currentUser = familyMembers.find(m => m.id === userId);
        checkLogin();
    }

    // Ursprüngliche Funktionen
    function initialize() {
        const avatarGrid = document.getElementById('avatar-grid');
        avatars.forEach(avatar => {
            const img = document.createElement('img');
            img.src = avatar.image;
            img.alt = avatar.name;
            img.title = avatar.name;
            img.addEventListener('click', () => selectAvatar(avatar));
            avatarGrid.appendChild(img);
        });

        populateQuestList();
        updateRanking();
        loadData();     // Lädt gespeicherte Daten
        checkLogin();   // Prüft Login-Status
    }

    function selectAvatar(avatar) {
        selectedAvatar = avatar;
        document.getElementById('selected-avatar').textContent = `Ausgewählter Avatar: ${avatar.name}`;
    }

    function populateQuestList() {
        const questSelect = document.getElementById('quest-select');
        quests.forEach(quest => {
            const option = document.createElement('option');
            option.value = quest.name;
            option.textContent = quest.name;
            questSelect.appendChild(option);
        });
    }

    function completeQuest() {
        if (!selectedAvatar) {
            alert('Bitte wähle einen Avatar aus.');
            return;
        }

        const questSelect = document.getElementById('quest-select');
        const selectedQuest = questSelect.value;
        const quest = quests.find(q => q.name === selectedQuest);

        if (!quest) {
            alert('Ungültige Quest ausgewählt.');
            return;
        }

        const member = familyMembers.find(m => m.avatar === selectedAvatar.name);
        if (member) {
            member.exp += quest.exp;
            member.level = calculateLevel(member.exp);
        } else {
            familyMembers.push({
                avatar: selectedAvatar.name,
                exp: quest.exp,
                level: calculateLevel(quest.exp)
            });
        }

        updateRanking();
        resetQuest();
        saveData();  // Speichert Fortschritt
    }

    function calculateLevel(exp) {
        return Math.floor(Math.sqrt(exp / 10));
    }

    function updateRanking() {
        const rankingList = document.getElementById('ranking-list');
        rankingList.innerHTML = '';
        familyMembers.sort((a, b) => b.exp - a.exp).forEach(member => {
            const li = document.createElement('li');
            li.innerHTML = `<img src="${member.avatar.toLowerCase()}.png" alt="${member.avatar}"> ${member.avatar} - Level ${member.level} - EXP ${member.exp}`;
            rankingList.appendChild(li);
        });
    }

    function resetQuest() {
        document.getElementById('quest-select').value = '';
        currentQuest = null;
    }

    // Daten speichern/laden
    function saveData() {
        localStorage.setItem('familyMembers', JSON.stringify(familyMembers));
    }

    function loadData() {
        const savedMembers = localStorage.getItem('familyMembers');
        if (savedMembers) {
            familyMembers = JSON.parse(savedMembers);
            updateRanking();
        }
    }

    // Event Listener
    document.getElementById('complete-quest').addEventListener('click', completeQuest);
    document.getElementById('login-button').addEventListener('click', handleLogin);

    initialize();
});
