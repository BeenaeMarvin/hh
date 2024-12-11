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
    let selectedAvatar = null;
    let familyMembers = [];
    let currentView = 'questlog';
    let streak = {
        current: 0,
        best: 0,
        lastCompleted: null,
        multiplier: 1.0
    };

    // Element Referenzen
    const avatarGrid = document.getElementById('avatar-grid');
    const questSelect = document.getElementById('quest-select');
    const rankingList = document.getElementById('ranking-list');
    const navigationButtons = {
        questlog: document.getElementById('questlog-btn'),
        achievements: document.getElementById('achievements-btn'),
        admin: document.getElementById('admin-btn')
    };
    const sections = {
        questlog: document.getElementById('quest-section'),
        achievements: document.getElementById('achievement-section'),
        admin: document.getElementById('admin-section')
    };

    // Initialisierung
    function initialize() {
        setupAvatars();
        setupQuests();
        setupEventListeners();
        updateRanking();
        loadData();
    }

    // Daten laden und speichern
    function loadData() {
        const savedMembers = localStorage.getItem('familyMembers');
        const savedStreak = localStorage.getItem('streak');
        if (savedMembers) familyMembers = JSON.parse(savedMembers);
        if (savedStreak) streak = JSON.parse(savedStreak);
        updateUI();
    }

    function saveData() {
        localStorage.setItem('familyMembers', JSON.stringify(familyMembers));
        localStorage.setItem('streak', JSON.stringify(streak));
    }

    // UI Setup
    function setupAvatars() {
        avatars.forEach(avatar => {
            const img = document.createElement('img');
            img.src = `assets/images/${avatar.image}`;
            img.alt = avatar.name;
            img.title = avatar.name;
            img.addEventListener('click', () => selectAvatar(avatar));
            avatarGrid.appendChild(img);
        });
    }

    function setupQuests() {
        questSelect.innerHTML = '<option value="">Quest auswählen</option>';
        quests.forEach(quest => {
            const option = document.createElement('option');
            option.value = quest.id;
            option.textContent = `${quest.name} (${quest.exp} EXP)`;
            questSelect.appendChild(option);
        });
    }

    function setupEventListeners() {
        // Navigation
        Object.keys(navigationButtons).forEach(key => {
            navigationButtons[key].addEventListener('click', () => setActiveView(key));
        });

        // Quest Completion
        document.getElementById('complete-quest').addEventListener('click', completeQuest);

        // Admin Controls
        document.getElementById('add-quest').addEventListener('click', addNewQuest);
        document.getElementById('add-member').addEventListener('click', addNewMember);
    }

    // Navigation
    function setActiveView(view) {
        currentView = view;
        Object.values(navigationButtons).forEach(btn => btn.classList.remove('active'));
        navigationButtons[view].classList.add('active');
        Object.values(sections).forEach(section => section.classList.add('hidden'));
        sections[view].classList.remove('hidden');
    }

    // Avatar Selection
    function selectAvatar(avatar) {
        selectedAvatar = avatar;
        document.getElementById('selected-avatar').textContent = 
            `Ausgewählter Avatar: ${avatar.name}`;
    }

    // Quest Management
    function completeQuest() {
        if (!selectedAvatar) {
            alert('Bitte wähle erst einen Avatar aus!');
            return;
        }

        const selectedQuestId = parseInt(questSelect.value);
        const selectedQuest = quests.find(q => q.id === selectedQuestId);
        
        if (!selectedQuest) {
            alert('Bitte wähle eine Quest aus!');
            return;
        }

        // Berechne EXP mit Streak-Multiplikator
        const earnedExp = Math.round(selectedQuest.exp * streak.multiplier);

        // Finde oder erstelle Familienmitglied
        let member = familyMembers.find(m => m.avatar === selectedAvatar.id);
        if (!member) {
            member = {
                avatar: selectedAvatar.id,
                name: selectedAvatar.name,
                exp: 0,
                level: 1,
                completedQuests: 0
            };
            familyMembers.push(member);
        }

        // Update Member Stats
        member.exp += earnedExp;
        member.level = Math.floor(Math.sqrt(member.exp / 10));
        member.completedQuests++;

        // Update Streak
        updateStreak();

        // UI Updates
        updateRanking();
        saveData();
        alert(`Quest abgeschlossen!\nBelohnung: ${selectedQuest.reward}\nErhaltene EXP: ${earnedExp} (${streak.multiplier}x Multiplikator)`);
    }

    // Streak Management
    function updateStreak() {
        const today = new Date().toDateString();
        
        if (streak.lastCompleted === today) {
            // Bereits heute eine Quest abgeschlossen
            return;
        }

        if (streak.lastCompleted === new Date(Date.now() - 86400000).toDateString()) {
            // Gestern eine Quest abgeschlossen - Streak fortsetzen
            streak.current++;
            streak.multiplier = 1 + (streak.current * 0.1); // 10% Bonus pro Streak-Tag
        } else {
            // Streak unterbrochen
            streak.current = 1;
            streak.multiplier = 1.0;
        }

        streak.lastCompleted = today;
        streak.best = Math.max(streak.current, streak.best);
        
        // Update UI
        document.getElementById('current-streak').textContent = streak.current;
        document.getElementById('exp-multiplier').textContent = `x${streak.multiplier.toFixed(1)}`;
    }

    // Admin Functions
    function addNewQuest() {
        const name = document.getElementById('new-quest-name').value;
        const exp = parseInt(document.getElementById('new-quest-exp').value);
        const reward = document.getElementById('new-quest-reward').value;

        if (name && exp && reward) {
            quests.push({
                id: quests.length + 1,
                name,
                exp,
                reward
            });
            setupQuests();
            alert('Quest hinzugefügt!');
        } else {
            alert('Bitte fülle alle Felder aus!');
        }
    }

    function addNewMember() {
        const name = document.getElementById('new-member-name').value;
        const age = document.getElementById('new-member-age').value;
        const character = document.getElementById('new-member-character').value;

        if (name && age && character) {
            familyMembers.push({
                name,
                age,
                avatar: character,
                exp: 0,
                level: 1,
                completedQuests: 0
            });
            updateRanking();
            saveData();
            alert('Familienmitglied hinzugefügt!');
        } else {
            alert('Bitte fülle alle Felder aus!');
        }
    }

    // Ranking Update
    function updateRanking() {
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

    // Starte die Anwendung
    initialize();
});
