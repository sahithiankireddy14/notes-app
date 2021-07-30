var userglobal;
let count = 0;

window.onload = event => {
  // Firebase authentication goes here.
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // Console log the user to confirm they are logged in
      console.log("Logged in as: " + user.displayName);
      const googleUserId = user.uid;
      userglobal = user.uid;
      getNotes(googleUserId);
      document.getElementById("name").innerHTML = "Welcome " +user.displayName +"(" +user.email +")" + "<br>"
    } else {
      // If not logged in, navigate back to login page.
      window.location = "index.html";
    }
  });
};

const getNotes = userId => {
  const notesRef = firebase.database().ref(`users/${userId}`)
  notesRef.orderByChild("title").on("value", snapshot => {
    renderDataAsHtml(snapshot);
  });
};

//Given a list of notes, render them in HTML
const renderDataAsHtml = (data) => {
  let cards = "";
  data.forEach((child) => {
    const note = child.val();
    const noteItem = child.key
    cards += createCard(note, noteItem);

  })

  document.querySelector("#app").innerHTML = cards;
};

function deleteNote(noteItem)
{
  console.log(noteItem +"noteItem")
  console.log(`users/${userglobal}/${noteItem}`)
  count++;
  if (count < 2){
     document.querySelector('#warning').style.display = "block"
  }
  else{
    firebase.database().ref(`users/${userglobal}/${noteItem}`).remove();
    count = 0;
    document.querySelector('#warning').style.display = "none"
  }
}
function likeNote(noteItem){
  console.log(`users/${userglobal}/${noteItem}`);
  // count++;
  // if (count < 2){
  //    document.querySelector('#warning').style.display = "block"
  // }
  // else{
  //   firebase.database().ref(`users/${userglobal}/${noteItem}`).remove();
  //   count = 0;
  //   document.querySelector('#warning').style.display = "none"
  // }
  [...document.getElementsByClassName("like")]
        .forEach(function (card) {
          card.addEventListener("click", cardClicked);
          function cardClicked() {
            firebase.database().ref(`users/${userglobal}/${noteItem}`+`likes/`).push({
              user:userglobal
            });
          }
        });
}
var whatEditNote
const editNote = (noteId) => {
  const editNoteModal = document.querySelector('#editNoteModal');
  editNoteModal.classList.toggle('is-active');
  whatEditNote = noteId
  const notesRef = firebase.database().ref(`users/${userglobal}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    const noteDetails = data[noteId];
    document.querySelector('#editTitleInput').value = noteDetails.title;
    document.querySelector('#editTextInput').value = noteDetails.text;

  });
  

  
};

function saveEditedNote(){
   
  const noteTitle = document.querySelector('#editTitleInput').value;
  const noteText = document.querySelector('#editTextInput').value;
  const noteEdits = {
    title: noteTitle,
    text: noteText
  };
  firebase.database().ref(`users/${userglobal}/${whatEditNote}`).update(noteEdits);
  
  closeEditModal()
  
  
}
  
  
 
  const closeEditModal = () => {
  const editNoteModal = document.querySelector('#editNoteModal');
  editNoteModal.classList.toggle('is-active');
};

 const archive = (noteId) => {
     
  
};
  





  

// Return a note object converted into an HTML card
const createCard = (note, noteItem) => {
  const colors = ["has-background-primary-light", "has-background-link-light", "has-background-info-light", "has-background-success-light", "has-background-warning-light", "has-background-danger-light","has-background-primary-dark","has-background-link-dark","has-background-info-dark","has-background-success-dark","has-background-warning-dark","has-background-danger-dark"]
  var bk_color = colors[Math.floor(Math.random()*colors.length)]
  
  return `
         <div class="column is-one-quarter">
         <div class="card ${bk_color}">
           <header class="card-header">
             <p class="card-header-title">${note.title}</p>
           </header>
           <div class="card-content">
             <div class="content">${note.text}</div>
             <button class="button" id="${noteItem}" onclick="deleteNote(this.id)"> Delete </button>
             <button class="button like" id="${noteItem}" onclick="likeNote(this.id)"> Like </button>
              <a id="${noteItem}" class="card-footer-item" onclick="editNote('${noteItem}')">
              
  Edit
 </a>

 <a id="${noteItem}" class="card-footer-item" onclick="archive('${noteItem}')">
              
  Archive
 </a>

 

           
           
           </div>
         </div>
       </div> `;
};



