// ==========================================
// CONFIGURATION
// ==========================================
const APP_ID = 000000000; // ⚠️ REPLACE WITH YOUR ZEGO APP ID (Number)
const SERVER_SECRET = "YOUR_SERVER_SECRET"; // ⚠️ REPLACE WITH YOUR ZEGO SERVER SECRET (String)

// ==========================================
// GLOBAL VARIABLES
// ==========================================
let zp = null; // Zego Instance

// Function to generate a random User ID
function getUrlParams(url) {
    let urlStr = url.split('?')[1];
    const urlSearchParams = new URLSearchParams(urlStr);
    const result = Object.fromEntries(urlSearchParams.entries());
    return result;
}

// Generate a random user ID for this session
const userID = Math.floor(Math.random() * 10000) + "";
const userName = "Stranger-" + userID;

// ==========================================
// CORE LOGIC
// ==========================================

function startRandomChat() {
    // 1. Show Loader, Hide Welcome
    document.getElementById("welcome-screen").style.display = "none";
    document.getElementById("loader").classList.remove("hidden");
    
    // 2. Simulate "Matching" delay (Optional UI effect)
    setTimeout(() => {
        // 3. Generate a Random Room ID
        // Logic: To match with someone, you need to be in the same room.
        // For a demo/test, we use a small pool (1-10) to increase chances of collision.
        // In a real production app, you would use a backend to queue users.
        const randomRoomID = Math.floor(Math.random() * 10) + 1; 
        const roomID = "exploremeet-" + randomRoomID;

        joinRoom(roomID);
    }, 1500);
}

function joinRoom(roomID) {
    console.log("Joining Room: " + roomID);
    
    // 4. Generate Kit Token
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        APP_ID, 
        SERVER_SECRET, 
        roomID, 
        userID, 
        userName
    );

    // 5. Create Instance
    zp = ZegoUIKitPrebuilt.create(kitToken);

    // 6. Join the Room
    zp.joinRoom({
        container: document.querySelector("#root"),
        scenario: {
            mode: ZegoUIKitPrebuilt.OneONOneCall, // Important for 1-v-1
        },
        sharedLinks: [], // Hide shared links for random chat feel
        showPreJoinView: false, // Jump straight in
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showTextChat: true, // Allow chatting
        showUserList: false, 
        maxUsers: 2, // Limit to 2 people
        layout: "Auto",
        showLayoutButton: false,
        
        // Event: When call starts
        onJoinRoom: () => {
            document.getElementById("loader").classList.add("hidden");
            document.getElementById("video-area").style.display = "block";
            document.getElementById("status-text").innerText = "Connected to Stranger";
            document.querySelector(".dot").style.backgroundColor = "red"; // Busy status
        },

        // Event: When user leaves
        onLeaveRoom: () => {
            resetUI();
        }
    });
}

function nextPartner() {
    // 1. Destroy current instance
    if(zp) {
        zp.destroy();
    }
    
    // 2. Hide Video Area, Show Loader
    document.getElementById("video-area").style.display = "none";
    document.getElementById("loader").classList.remove("hidden");
    document.getElementById("status-text").innerText = "Finding new partner...";

    // 3. Find new room (Recursion)
    setTimeout(() => {
        const randomRoomID = Math.floor(Math.random() * 10) + 1; 
        const roomID = "exploremeet-" + randomRoomID;
        joinRoom(roomID);
    }, 1000);
}

function stopChat() {
    if(zp) {
        zp.destroy();
    }
    resetUI();
}

function resetUI() {
    document.getElementById("video-area").style.display = "none";
    document.getElementById("welcome-screen").style.display = "flex";
    document.getElementById("loader").classList.add("hidden");
    document.getElementById("status-text").innerText = "Ready to connect";
    document.querySelector(".dot").style.backgroundColor = "#28a745";
}