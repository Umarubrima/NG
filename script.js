// Global Variables
let currentStream = null;
let isRecording = false;
let mediaRecorder = null;
let recordingTimer = null;
let recordingStartTime = 0;
let currentTab = 'chats';
let currentChatId = null;
let isVoiceRecording = false;
let voiceRecorder = null;

// Empty chat data
const chats = [];

// Status and call history can also be empty if you want
const statusUpdates = [];
const callHistory = [];

// Utility Functions
function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function formatTime(date) {
    const now = new Date();
    const messageDate = new Date(date);
    const diffTime = Math.abs(now - messageDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return messageDate.toLocaleDateString();
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function getMessagePreview(message) {
    if (!message) return '';
    if (message.includes('📷')) return '<span class="message-type photo">📷</span>Photo';
    if (message.includes('🎥')) return '<span class="message-type video">🎥</span>Video';
    if (message.includes('🎵')) return '<span class="message-type audio">🎵</span>Audio';
    if (message.includes('📄')) return '<span class="message-type document">📄</span>Document';
    return message;
}

function getCallIcon(type) {
    switch (type) {
        case 'incoming':
            return '<svg class="call-icon" viewBox="0 0 24 24"><path d="M20,15.5C18.8,15.5 17.5,15.3 16.4,14.9C16.1,14.8 15.7,14.9 15.4,15.1L13.2,17.3C10.4,15.9 8,13.4 6.7,10.6L8.9,8.4C9.1,8.1 9.2,7.6 9,7.3C8.7,6.2 8.5,4.9 8.5,3.7C8.5,3.2 8.1,2.8 7.6,2.8H4.1C3.6,2.8 3.2,3.2 3.2,3.7C3.2,13.6 10.9,21.3 20.8,21.3C21.3,21.3 21.7,20.9 21.7,20.4V16.9C21.7,16.4 21.3,16 20.8,16H20.5Z"/></svg>';
        case 'outgoing':
            return '<svg class="call-icon" viewBox="0 0 24 24"><path d="M9,5A1,1 0 0,1 8,4A1,1 0 0,1 9,3H15A1,1 0 0,1 16,4A1,1 0 0,1 15,5H9M6,7V19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6Z"/></svg>';
        case 'missed':
            return '<svg class="call-icon" viewBox="0 0 24 24"><path d="M19.95,21L18.54,19.58L15.41,16.46L12.29,13.34L8.59,9.64L5.64,6.69L2.39,3.44L3.81,2.03L21.36,19.58L19.95,21M17.34,14.95L15.93,13.54C17.65,11.29 17.65,7.95 15.93,5.7L17.34,4.29C19.88,7.39 19.88,12.85 17.34,14.95M6.66,9.05L8.07,10.46C6.35,12.71 6.35,16.05 8.07,18.3L6.66,19.71C4.12,16.61 4.12,11.15 6.66,9.05Z"/></svg>';
        default:
            return '';
    }
}

// Render Functions
function renderChats() {
    const chatList = document.getElementById('chatList');
    let content = '';
    let dataToRender = [];

    switch (currentTab) {
        case 'chats': dataToRender = chats; break;
        case 'unread': dataToRender = chats.filter(chat => chat.unread > 0); break;
        case 'favorites': dataToRender = chats.filter(chat => chat.favorite); break;
        case 'groups': dataToRender = chats.filter(chat => chat.type === 'group'); break;
        case 'status': dataToRender = statusUpdates; break;
        case 'calls': dataToRender = callHistory; break;
    }

    if (content === '' && dataToRender.length === 0) {
        content = `
            <div class="chat-item">
                <div class="avatar">📭</div>
                <div class="chat-info">
                    <div class="chat-name">No chats yet</div>
                    <div class="chat-message">Start a conversation</div>
                </div>
            </div>
        `;
    }

    chatList.innerHTML = content;
}

// Call once at start
renderChats();
// Global Variables
let currentStream = null;
let isRecording = false;
let mediaRecorder = null;
let recordingTimer = null;
let recordingStartTime = 0;
let currentTab = 'chats';
let currentChatId = null;
let isVoiceRecording = false;
let voiceRecorder = null;

// Sample chat data
const chats = [
    {
        id: 1,
        name: "John Doe",
        message: "Hey! How are you doing?",
        time: "10:30 AM",
        unread: 2,
        favorite: true,
        status: "online",
        type: "chat",
        lastSeen: "online",
        messages: [
            {
                id: 1,
                text: "Hey there! How's your day going?",
                time: "10:25 AM",
                sent: false,
                status: "read"
            },
            {
                id: 2,
                text: "Pretty good! Just working on some projects. How about you?",
                time: "10:27 AM",
                sent: true,
                status: "read"
            },
            {
                id: 3,
                text: "Same here! Been busy with work. Want to grab coffee later?",
                time: "10:28 AM",
                sent: false,
                status: "read"
            },
            {
                id: 4,
                text: "That sounds great! What time works for you?",
                time: "10:30 AM",
                sent: true,
                status: "delivered"
            }
        ]
    },
    {
        id: 2,
        name: "Family Group",
        message: "Mom: Don't forget dinner tonight",
        time: "9:45 AM",
        unread: 5,
        favorite: false,
        status: "active",
        type: "group",
        participants: ["Mom", "Dad", "Sarah"],
        messages: [
            {
                id: 1,
                text: "Don't forget we have family dinner tonight at 7 PM",
                time: "9:40 AM",
                sent: false,
                sender: "Mom",
                status: "read"
            },
            {
                id: 2,
                text: "Thanks for the reminder! I'll be there",
                time: "9:42 AM",
                sent: true,
                status: "read"
            },
            {
                id: 3,
                text: "Should I bring anything?",
                time: "9:43 AM",
                sent: false,
                sender: "Sarah",
                status: "read"
            },
            {
                id: 4,
                text: "Just bring yourself! I've got everything covered",
                time: "9:45 AM",
                sent: false,
                sender: "Mom",
                status: "delivered"
            }
        ]
    },
    {
        id: 3,
        name: "Work Team",
        message: "Sarah: Meeting at 3 PM",
        time: "Yesterday",
        unread: 0,
        favorite: true,
        status: "active",
        type: "group",
        participants: ["Sarah", "Mike", "Alex", "Lisa"],
        messages: [
            {
                id: 1,
                text: "Team meeting scheduled for 3 PM today. Please join the video call.",
                time: "Yesterday",
                sent: false,
                sender: "Sarah",
                status: "read"
            },
            {
                id: 2,
                text: "Got it! I'll be there",
                time: "Yesterday",
                sent: true,
                status: "read"
            }
        ]
    },
    {
        id: 4,
        name: "Alice Smith",
        message: "Thanks for your help!",
        time: "Yesterday",
        unread: 0,
        favorite: false,
        status: "offline",
        type: "chat",
        lastSeen: "yesterday at 5:30 PM",
        messages: [
            {
                id: 1,
                text: "Could you help me with the presentation?",
                time: "Yesterday",
                sent: false,
                status: "read"
            },
            {
                id: 2,
                text: "Of course! I'll send you the template",
                time: "Yesterday",
                sent: true,
                status: "read"
            },
            {
                id: 3,
                text: "Thanks for your help! Really appreciate it",
                time: "Yesterday",
                sent: false,
                status: "read"
            }
        ]
    },
    {
        id: 5,
        name: "Mark Johnson",
        message: "📷 Photo",
        time: "2 days ago",
        unread: 1,
        favorite: false,
        status: "offline",
        type: "chat",
        lastSeen: "2 days ago",
        messages: [
            {
                id: 1,
                text: "Check out this amazing sunset!",
                time: "2 days ago",
                sent: false,
                status: "delivered",
                type: "photo",
                media: "sunset.jpg"
            }
        ]
    },
    {
        id: 6,
        name: "Emma Wilson",
        message: "🎵 Audio",
        time: "3 days ago",
        unread: 0,
        favorite: true,
        status: "online",
        type: "chat",
        lastSeen: "online",
        messages: [
            {
                id: 1,
                text: "Voice message",
                time: "3 days ago",
                sent: false,
                status: "read",
                type: "audio",
                duration: "0:15"
            }
        ]
    }
];

const statusUpdates = [
    {
        id: 1,
        name: "My Status",
        message: "Tap to add status update",
        time: "",
        type: "status",
        isMyStatus: true
    },
    {
        id: 2,
        name: "John Doe",
        message: "2 photos",
        time: "30m ago",
        type: "status",
        viewed: false
    },
    {
        id: 3,
        name: "Alice Smith",
        message: "1 video",
        time: "2h ago",
        type: "status",
        viewed: true
    },
    {
        id: 4,
        name: "Emma Wilson",
        message: "3 photos",
        time: "5h ago",
        type: "status",
        viewed: false
    }
];

const callHistory = [
    {
        id: 1,
        name: "John Doe",
        type: "incoming",
        time: "Today, 2:30 PM",
        duration: "5:23",
        missed: false
    },
    {
        id: 2,
        name: "Mom",
        type: "outgoing",
        time: "Today, 1:15 PM",
        duration: "12:45",
        missed: false
    },
    {
        id: 3,
        name: "Work Team",
        type: "missed",
        time: "Yesterday, 3:00 PM",
        duration: null,
        missed: true,
        isGroup: true
    },
    {
        id: 4,
        name: "Alice Smith",
        type: "incoming",
        time: "Yesterday, 10:20 AM",
        duration: "3:12",
        missed: false
    }
];

// Utility Functions
function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function formatTime(date) {
    const now = new Date();
    const messageDate = new Date(date);
    const diffTime = Math.abs(now - messageDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return messageDate.toLocaleDateString();
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Render Functions
function renderChats() {
    const chatList = document.getElementById('chatList');
    let content = '';
    let dataToRender = [];

    switch (currentTab) {
        case 'chats':
            dataToRender = chats;
            break;
        case 'unread':
            dataToRender = chats.filter(chat => chat.unread > 0);
            break;
        case 'favorites':
            dataToRender = chats.filter(chat => chat.favorite);
            break;
        case 'groups':
            dataToRender = chats.filter(chat => chat.type === 'group');
            break;
        case 'status':
            dataToRender = statusUpdates;
            break;
        case 'calls':
            dataToRender = callHistory;
            break;
    }

    if (currentTab === 'status') {
        dataToRender.forEach(status => {
            const initial = getInitials(status.name);
            const ringClass = status.isMyStatus ? 'my-status' : (status.viewed ? 'viewed' : '');
            
            content += `
                <div class="chat-item status-item" onclick="viewStatus('${status.name}')">
                    <div class="avatar status">
                        <div class="status-ring ${ringClass}"></div>
                        ${initial}
                    </div>
                    <div class="chat-info">
                        <div class="chat-name">${status.name}</div>
                        <div class="chat-message">${status.message}</div>
                    </div>
                    <div class="chat-meta">
                        <div class="chat-time">${status.time}</div>
                    </div>
                </div>
            `;
        });
    } else if (currentTab === 'calls') {
        dataToRender.forEach(call => {
            const initial = getInitials(call.name);
            const callIcon = getCallIcon(call.type);
            const callClass = call.missed ? 'missed' : call.type;
            
            content += `
                <div class="chat-item call-item" onclick="makeCall('${call.name}')">
                    <div class="avatar">${initial}</div>
                    <div class="chat-info">
                        <div class="chat-name">
                            ${call.name}
                            ${call.isGroup ? '<span class="group-info">(group)</span>' : ''}
                        </div>
                        <div class="chat-message">
                            <div class="call-type ${callClass}">
                                ${callIcon}
                                ${call.duration || 'Missed call'}
                            </div>
                        </div>
                    </div>
                    <div class="chat-meta">
                        <div class="chat-time">${call.time}</div>
                    </div>
                </div>
            `;
        });
    } else {
        dataToRender.forEach(chat => {
            const initial = getInitials(chat.name);
            const statusDot = chat.status === 'online' ? '<span class="status-indicator"></span>' : '';
            const favoriteStar = chat.favorite ? '<span class="favorite-star">⭐</span>' : '';
            const unreadBadge = chat.unread > 0 ? `<div class="unread-badge">${chat.unread}</div>` : '';
            const avatarClass = chat.type === 'group' ? 'group' : '';
            const messageClass = chat.unread > 0 ? 'unread' : '';
            const timeClass = chat.unread > 0 ? 'unread' : '';
            const itemClass = chat.unread > 0 ? 'unread' : '';
            
            content += `
                <div class="chat-item ${itemClass}" onclick="openChat(${chat.id})">
                    <div class="avatar ${avatarClass}">
                        ${initial}
                        ${chat.status === 'online' ? '<div class="online-indicator"></div>' : ''}
                    </div>
                    <div class="chat-info">
                        <div class="chat-name">
                            ${chat.name}
                            ${statusDot}
                            ${favoriteStar}
                            ${chat.type === 'group' ? '<span class="verified-badge">✓</span>' : ''}
                        </div>
                        <div class="chat-message ${messageClass}">
                            ${getMessagePreview(chat.message)}
                        </div>
                    </div>
                    <div class="chat-meta">
                        <div class="chat-time ${timeClass}">${chat.time}</div>
                        ${unreadBadge}
                    </div>
                </div>
            `;
        });
    }

    if (content === '') {
        content = `
            <div class="chat-item">
                <div class="avatar">📭</div>
                <div class="chat-info">
                    <div class="chat-name">No items found</div>
                    <div class="chat-message">Try switching to a different tab</div>
                </div>
            </div>
        `;
    }

    chatList.innerHTML = content;
}

function getMessagePreview(message) {
    if (message.includes('📷')) return '<span class="message-type photo">📷</span>Photo';
    if (message.includes('🎥')) return '<span class="message-type video">🎥</span>Video';
    if (message.includes('🎵')) return '<span class="message-type audio">🎵</span>Audio';
    if (message.includes('📄')) return '<span class="message-type document">📄</span>Document';
    return message;
}

function getCallIcon(type) {
    switch (type) {
        case 'incoming':
            return '<svg class="call-icon" viewBox="0 0 24 24"><path d="M20,15.5C18.8,15.5 17.5,15.3 16.4,14.9C16.1,14.8 15.7,14.9 15.4,15.1L13.2,17.3C10.4,15.9 8,13.4 6.7,10.6L8.9,8.4C9.1,8.1 9.2,7.6 9,7.3C8.7,6.2 8.5,4.9 8.5,3.7C8.5,3.2 8.1,2.8 7.6,2.8H4.1C3.6,2.8 3.2,3.2 3.2,3.7C3.2,13.6 10.9,21.3 20.8,21.3C21.3,21.3 21.7,20.9 21.7,20.4V16.9C21.7,16.4 21.3,16 20.8,16H20.5Z"/></svg>';
        case 'outgoing':
            return '<svg class="call-icon" viewBox="0 0 24 24"><path d="M9,5A1,1 0 0,1 8,4A1,1 0 0,1 9,3H15A1,1 0 0,1 16,4A1,1 0 0,1 15,5H9M6,7V19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6Z"/></svg>';
        case 'missed':
            return '<svg class="call-icon" viewBox="0 0 24 24"><path d="M19.95,21L18.54,19.58L15.41,16.46L12.29,13.34L8.59,9.64L5.64,6.69L2.39,3.44L3.81,2.03L21.36,19.58L19.95,21M17.34,14.95L15.93,13.54C17.65,11.29 17.65,7.95 15.93,5.7L17.34,4.29C19.88,7.39 19.88,12.85 17.34,14.95M6.66,9.05L8.07,10.46C6.35,12.71 6.35,16.05 8.07,18.3L6.66,19.71C4.12,16.61 4.12,11.15 6.66,9.05Z"/></svg>';
        default:
            return '';
    }
}

function renderChatMessages(chatId) {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    const messagesContainer = document.getElementById('chatMessages');
    let content = '';

    chat.messages.forEach(message => {
        const messageClass = message.sent ? 'sent' : 'received';
        const statusIcon = message.sent ? getMessageStatusIcon(message.status) : '';
        const senderName = message.sender && chat.type === 'group' ? 
            `<div style="font-size: 12px; color: #00a884; margin-bottom: 2px;">${message.sender}</div>` : '';
        
        if (message.type === 'photo') {
            content += `
                <div class="message ${messageClass}">
                    <div class="message-bubble">
                        ${senderName}
                        <div class="media-message">
                            <img src="https://via.placeholder.com/250x200/00a884/ffffff?text=Photo" alt="Photo">
                            <div class="media-overlay">
                                <div class="message-meta">
                                    <span class="message-time">${message.time}</span>
                                    ${statusIcon}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>