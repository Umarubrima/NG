// Sample data for different tabs
const chatData = {
    chats: [],
    unread: [],
    favorites: [],
    groups: [],
    status: [
        {
            name: "My Status",
            preview: "Tap to add status update",
            time: "Add Status",
            unread: 0,
            isFavorite: false,
            isGroup: false,
            isOnline: true
        }
    ],
    calls: []
};

let currentTab = 'chats';

// Initialize the app
function init() {
    updateChatData();
    renderChatList();
}

// Update chat data for different tabs
function updateChatData() {
    chatData.unread = chatData.chats.filter(chat => chat.unread > 0);
    chatData.favorites = chatData.chats.filter(chat => chat.isFavorite);
    chatData.groups = chatData.chats.filter(chat => chat.isGroup);
}

// Render chat list based on current tab
function renderChatList() {
    const chatList = document.getElementById('chatList');
    const data = chatData[currentTab] || [];

    chatList.innerHTML = '';

    if (data.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.style.textAlign = 'center';
        emptyState.style.padding = '40px 20px';
        emptyState.style.color = '#8696a0';
        emptyState.innerHTML = `<p>No ${currentTab} found</p>`;
        chatList.appendChild(emptyState);
        return;
    }

    data.forEach(chat => {
        const chatItem = createChatItem(chat);
        chatList.appendChild(chatItem);
    });
}

// Create individual chat item
function createChatItem(chat) {
    const chatItem = document.createElement('div');
    chatItem.className = 'chat-item';
    
    const initials = chat.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const avatarClass = chat.isGroup ? 'chat-avatar group-indicator' : 'chat-avatar';
    
    chatItem.innerHTML = `
        <div class="${avatarClass}">
            ${initials}
            ${chat.isOnline ? '<div class="status-indicator"></div>' : ''}
        </div>
        <div class="chat-content">
            <div class="chat-header">
                <div class="chat-name">${chat.name}</div>
                <div class="chat-meta">
                    ${chat.isFavorite ? '<svg class="favorite-icon" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' : ''}
                    <div class="chat-time">${chat.time}</div>
                </div>
            </div>
            <div class="chat-preview">${chat.preview}</div>
        </div>
        ${chat.unread > 0 ? `<div class="unread-count">${chat.unread}</div>` : ''}
    `;

    chatItem.addEventListener('click', () => openChat(chat));
    return chatItem;
}

// Switch between tabs
function switchTab(tabName) {
    currentTab = tabName;
    
    // Update tab appearance
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderChatList();
}

// Header functions
function openCamera() {
    document.getElementById('cameraOverlay').classList.add('show');
}

function closeCamera() {
    document.getElementById('cameraOverlay').classList.remove('show');
}

function focusSearch() {
    document.getElementById('searchInput').focus();
}

function toggleDropdown() {
    const dropdown = document.getElementById('dropdownMenu');
    dropdown.classList.toggle('show');
}

// Dropdown menu functions
function newGroup() {
    alert('New Group functionality would be implemented here');
    document.getElementById('dropdownMenu').classList.remove('show');
}

function newBroadcast() {
    alert('New Broadcast functionality would be implemented here');
    document.getElementById('dropdownMenu').classList.remove('show');
}

function linkDevice() {
    alert('Link Device functionality would be implemented here');
    document.getElementById('dropdownMenu').classList.remove('show');
}

function markAllRead() {
    // Mark all chats as read
    chatData.chats.forEach(chat => chat.unread = 0);
    updateChatData();
    renderChatList();
    document.getElementById('dropdownMenu').classList.remove('show');
}

function openSettings() {
    alert('Settings would be implemented here');
    document.getElementById('dropdownMenu').classList.remove('show');
}

// Other functions
function newChat() {
    alert('New Chat functionality would be implemented here');
}

function openChat(chat) {
    alert(`Opening chat with ${chat.name}`);
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const chatItems = document.querySelectorAll('.chat-item');
        
        chatItems.forEach(item => {
            const chatName = item.querySelector('.chat-name').textContent.toLowerCase();
            const chatPreview = item.querySelector('.chat-preview').textContent.toLowerCase();
            
            if (chatName.includes(searchTerm) || chatPreview.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
            document.getElementById('dropdownMenu').classList.remove('show');
        }
    });

    // Initialize the app when the page loads
    init();
});