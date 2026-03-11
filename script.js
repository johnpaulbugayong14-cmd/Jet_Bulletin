// Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
getFirestore, 
collection, 
addDoc, 
onSnapshot, 
deleteDoc, 
doc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyB5CF8k519wiJTFzQ13MRPirTg839TNlIE",
authDomain: "jetkaiwa-2cbb5.firebaseapp.com",
projectId: "jetkaiwa-2cbb5",
storageBucket: "jetkaiwa-2cbb5.firebasestorage.app",
messagingSenderId: "492138220710",
appId: "1:492138220710:web:f900266a2def879756b867",
measurementId: "G-YMFZJJCBZC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Admin Credentials
const ADMIN_USERNAME = "jetkaiwa";
const ADMIN_PASSWORD = "jetkaiwa333";

let announcements = [];
let currentIndex;


// Login Handler
function handleLogin(event) {
event.preventDefault();

let username = document.getElementById("username").value;
let password = document.getElementById("password").value;

if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {

    localStorage.setItem("isLoggedIn","true");

    document.getElementById("loginContainer").style.display="none";
    document.getElementById("mainContent").style.display="block";

    // start listening for announcements immediately and render any overdue ones
    listenAnnouncements();
    // also trigger a render in case announcements array already has data
    renderAnnouncements();

} else {

alert("Invalid username or password!");

}
}


// Logout
function handleLogout(){

localStorage.removeItem("isLoggedIn");

document.getElementById("loginContainer").style.display="flex";
document.getElementById("mainContent").style.display="none";

}


// Check login on startup
window.addEventListener("DOMContentLoaded",function(){

if(localStorage.getItem("isLoggedIn")==="true"){

document.getElementById("loginContainer").style.display="none";
document.getElementById("mainContent").style.display="block";

}else{

document.getElementById("loginContainer").style.display="flex";
document.getElementById("mainContent").style.display="none";

}

listenAnnouncements();

});



/* Tree Positions */

const positions = [

{top:"120px",left:"300px"},
{top:"160px",left:"200px"},
{top:"160px",left:"400px"},
{top:"220px",left:"150px"},
{top:"220px",left:"470px"},
{top:"280px",left:"260px"},
{top:"280px",left:"380px"}

];



function renderAnnouncements(){

const tree=document.getElementById("tree");

document.querySelectorAll(".announcement").forEach(e=>e.remove());

let overdueList=[];

announcements.forEach((ann,i)=>{

let pin=document.createElement("div");

pin.className="announcement";

pin.innerHTML="📌";

let pos=positions[i%positions.length];

pin.style.top=pos.top;

pin.style.left=pos.left;


if(ann.deadline && new Date(ann.deadline)<new Date()){

pin.style.background="#ff5722";

overdueList.push(ann);

}


pin.onclick=function(){

openAnnouncement(ann.title,ann.content,ann.deadline,i);

};


tree.appendChild(pin);

});


if(overdueList.length>0){

showOverdueWarning(overdueList);

}

}



function listenAnnouncements(){

onSnapshot(collection(db,"announcements"),(snapshot)=>{

announcements=[];

snapshot.forEach((doc)=>{

announcements.push({

id:doc.id,

...doc.data()

});

});


renderAnnouncements();

});

}




function openAnnouncement(title,content,deadline,index){

document.getElementById("annTitle").innerText=title;

document.getElementById("annContent").innerText=content;

document.getElementById("annDeadline").innerText=deadline ? "Deadline: "+deadline:"";

currentIndex=index;

document.getElementById("modal").style.display="block";

}



function closeModal(){

document.getElementById("modal").style.display="none";

}



async function deleteAnnouncement(){

let id=announcements[currentIndex].id;

await deleteDoc(doc(db,"announcements",id));

closeModal();

}



function showOverdueWarning(list){

const overdueListDiv=document.getElementById("overdueList");

overdueListDiv.innerHTML="";

list.forEach(ann=>{

let item=document.createElement("div");

item.innerHTML=`${ann.title} - Deadline: ${ann.deadline}`;

overdueListDiv.appendChild(item);

});

document.getElementById("overdueModal").style.display="block";

}



function closeOverdueModal(){

document.getElementById("overdueModal").style.display="none";

}




// Post Announcement

document.getElementById("postForm").addEventListener("submit",async function(e){

e.preventDefault();

let title=document.getElementById("title").value.trim();

let content=document.getElementById("content").value.trim();

let deadline=document.getElementById("deadline").value;


if(!title||!content){

alert("Please fill in title and content");

return;

}


await addDoc(collection(db,"announcements"),{

title:title,

content:content,

deadline:deadline

});


document.getElementById("title").value="";
document.getElementById("content").value="";
document.getElementById("deadline").value="";

});
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.closeModal = closeModal;
window.deleteAnnouncement = deleteAnnouncement;
window.closeOverdueModal = closeOverdueModal;