document.addEventListener('DOMContentLoaded', function() {
    // Grundlegende Datenstrukturen
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
    let familyMembers = [];
    let currentUser = null;
    let currentView = 'login';

    // Login/Register System
    function showLoginScreen() {
        const mainContent = document.querySelector('main');
        mainContent.innerHTML = `
            <div id="login-section">
                <h2>Willkommen beim Haushalts-Questlog</h2>
                <div class="login-options">
                    <select id="user-select">
                        <option value="">Wähle deinen Namen</option>
                        ${familyMembers.map(member => 
                            `<option value="${member.id}">${member.name}</option>`
                        ).join('')}
                    </select>
                    <button id="login-btn">Einloggen</button>
                    <button id="show-register-btn">Neu hier? Registrieren</button>
                </div>
            </div>
        `;

        document.getElementById('show-register-btn').addEventListener('click', showRegisterScreen);
        document.getElementById('login-btn').addEventListener('click', loginUser);
    }

    function showRegisterScreen() {
        const mainContent = document.querySelector('main');
        mainContent.innerHTML = `
            <div id="register-section">
                <h2>Erstelle dein Profil</h2>
                <div class="register-form">
                    <input type="text" id="new-member-name" placeholder="Dein Name">
                    <input type="number" id="new-member-age" placeholder="Dein Alter">
                    <div class="avatar-selection">
                        <h3>Wähle deinen Avatar:</h3>
                        <div class="avatar-grid">
                            ${avatars.map(avatar => `
                                <div class="avatar-option">
                                    <img src="assets/images/${avatar.image}" 
                                         alt="${avatar.name}" 
                                         data-avatar-id="${avatar.id}">
                                    <p>${avatar.name}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <button id="register-btn">Profil erstellen</button>
                    <button id="back-to-login-btn">Zurück zum Login</button>
                </div>
            </div>
        `;

        // Avatar Auswahl
        const avatarImages = document.querySelectorAll('.avatar-option img');
        avatarImages.forEach(img => {
            img.addEventListener('click', function() {
                avatarImages.forEach(i => i.parentElement.classList.remove('selected'));
                this.parentElement.classList.add('selected');
            });
        });

        document.getElementById('register-btn').addEventListener('click', registerNewUser);
        document.getElementById('back-to-login-btn').addEventListener('click', showLoginScreen);
    }

    function registerNewUser() {
        const name = document.getElementById('new-member-name').value;
        const age = document.getElementById('new-member-age').value;
        const selectedAvatar = document.querySelector('.avatar-option.selected img');

        if (!name || !age || !selectedAvatar) {
            alert('Bitte fülle alle Felder aus und wähle einen Avatar!');
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            name: name,
            age: parseInt(age),
            avatar: selectedAvatar.dataset.avatarId,
            exp: 0,
            level: 1,
            completedQuests: 0,
            streak: {
                current: 0,
                best: 0,
                lastCompleted: null,
                multiplier: 1.0
            }
        };

        familyMembers.push(newUser);
        saveData();
        loginUser(newUser.id);
    }

    function loginUser(userId) {
        if (!userId) {
            userId = document.getElementById('user-select').value;
        }
        
        const user = familyMembers.find(m => m.id === userId);
        if (!user) {
            alert('Bitte wähle einen Benutzer aus!');
            return;
        }

        currentUser = user;
        showMainInterface();
    }

    function showMainInterface() {
        // Aktualisiere Header
        const header = document.querySelector('header');
        header.innerHTML = `
            <h1>Haushalts-Questlog</h1>
            <div class="user-info">
                <img src="assets/images/${currentUser.avatar}.png" alt="${currentUser.name}">
                <span>${currentUser.name} - Level ${currentUser.level}</span>
            </div>
            <nav>
                <button id="questlog-btn" class="active">Quests</button>
                <button id="achievements-btn">Erfolge</button>
                <button id="logout-btn">Ausloggen</button>
            </nav>
        `;

        // Zeige Quest-Interface
        showQuestInterface();

        // Event Listener für Navigation
        document.getElementById('questlog-btn').addEventListener('click', showQuestInterface);
        document.getElementById('achievements-btn').addEventListener('click', showAchievementInterface);
        document.getElementById('logout-btn').addEventListener('click', logout);
    }

    function showQuestInterface() {
        const mainContent = document.querySelector('main');
        mainContent.innerHTML = `
            <section id="quest-section">
                <h2>Verfügbare Quests</h2>
                <select id="quest-select">
                    <option value="">Quest auswählen</option>
                    ${quests.map(quest => `
                        <option value="${quest.id}">${quest.name} (${quest.exp} EXP)</option>
                    `).join('')}
                </select>
                <button id="complete-quest">Quest abschließen</button>
            </section>
            <section id="ranking-section">
                <h2>Ranking</h2>
                <ul id="ranking-list"></ul>
            </section>
        `;

        document.getElementById('complete-quest').addEventListener('click', completeQuest);
        updateRanking();
    }

    function completeQuest() {
        const questId = document.getElementById('quest-select').value;
        const quest = quests.find(q => q.id === parseInt(questId));

        if (!quest) {
            alert('Bitte wähle eine Quest aus!');
            return;
        }

        // Berechne EXP mit Streak
        const earnedExp = Math.round(quest.exp * currentUser.streak.multiplier);

        // Update User Stats
        currentUser.exp += earnedExp;
        currentUser.level = Math.floor(Math.sqrt(currentUser.exp / 10));
        currentUser.completedQuests++;

        // Update Streak
        updateStreak();
        
        // Speichern und UI aktualisieren
        saveData();
        updateRanking();

        alert(`Quest abgeschlossen!\nBelohnung: ${quest.reward}\nErhaltene EXP: ${earnedExp}`);
    }

    function updateStreak() {
        const today = new Date().toDateString();
        
        if (currentUser.streak.lastCompleted === today) {
            return;
        }

        if (currentUser.streak.lastCompleted === new Date(Date.now() - 86400000).toDateString()) {
            currentUser.streak.current++;
            currentUser.streak.multiplier = 1 + (currentUser.streak.current * 0.1);
        } else {
            currentUser.streak.current = 1;
            currentUser.streak.multiplier = 1.0;
        }

        currentUser.streak.lastCompleted = today;
        currentUser.streak.best = Math.max(currentUser.streak.current, currentUser.streak.best);
    }

    function updateRanking() {
        const rankingList = document.getElementById('ranking-list');
        if (!rankingList) return;

        rankingList.innerHTML = '';
        
        familyMembers
            .sort((a, b) => b.exp - a.exp)
            .forEach((member, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <img src="assets/images/${member.avatar}.png" alt="${member.name}">
                    <span>${member.name} - Level ${member.level} (${member.exp} EXP)</span>
                    <span class="quests-completed">${member.completedQuests} Quests</span>
                `;
                if (index < 3) li.classList.add(`rank-${index + 1}`);
                rankingList.appendChild(li);
            });
    }

    function logout() {
        currentUser = null;
        showLoginScreen();
    }

    // Daten Management
    function saveData() {
        localStorage.setItem('familyMembers', JSON.stringify(familyMembers));
    }

    function loadData() {
        const savedMembers = localStorage.getItem('familyMembers');
        if (savedMembers) {
            familyMembers = JSON.parse(savedMembers);
        }
    }

    // Initialisierung
    function initialize() {
        loadData();
        showLoginScreen();
    }

    initialize();
});
