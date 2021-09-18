function Boards(){
    this.Boards = [];
    this.form = document.getElementById("form");
    this.listing = document.getElementsByClassName("board-ul");
};
var boards = Boards.prototype;

boards.addEvents = function(){
    this.form.addEventListener("submit",(e)=>{
        e.preventDefault();
        var data = document.getElementsByClassName('add-item-input')[0].value;
        var assignedTo = document.getElementsByClassName('add-assign-input')[0].value;
        this.createBoard(data, assignedTo);
    });
    this.listing[0].addEventListener("click", (e)=>{ //OnClick we use target to get reference of the element
        if(e.target.classList.contains("edit-button")){ //search element by class name
            if(e.target.closest('.board-li').querySelector(".editMode").classList.contains("hide")){
                e.target.closest('.board-li').querySelector(".editMode").classList.remove("hide");
                e.target.closest('.board-li').querySelector("label").classList.add("hide");
            }else{
                e.target.closest('.board-li').querySelector(".editMode").classList.add("hide");
                e.target.closest('.board-li').querySelector("label").classList.remove("hide");
            }
        }
        if(e.target.classList.contains("delete-button")){
            const id = e.target.closest('.board-li').dataset.id;
            this.deleteBoards(id);
        }
    });

    this.listing[0].addEventListener("change", (e)=>{
        if(e.target.classList.contains("editMode")){
            const val = e.target.value; 
            const id = e.target.closest('.board-li').dataset.id; 
            this.updateBoards(id, val);
        }
    });
}
boards.deleteBoards = async function(id){
    const userDetails = JSON.parse(window.sessionStorage.getItem("user-details"));
    const accessToken = JSON.parse(window.sessionStorage.getItem("token-details"));
    const userId = userDetails.id;

    if(userDetails.role.id == 105){
        alert("only admin can delete boards");
        return;
    }
    try {
        const rawPromise = fetch(`http://localhost:8080/api/v1/boards/${id}`,{
            method: 'DELETE',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json;charset=UTF-8",
              authorization : `Bearer ${accessToken}`
            }
        })
        const rawResponse = await rawPromise;

      if(rawResponse.ok){
          this.getBoards();
      }else{
          const error = new Error();
          error.message = error.message ?  error.message : "something happened";
          throw error;
      }

      } catch (e) {
        alert(`Error: ${e.message}`);
      }
}
boards.updateBoards = async function(id, data){
    const userDetails = JSON.parse(window.sessionStorage.getItem("user-details"));
    const accessToken = JSON.parse(window.sessionStorage.getItem("token-details"));
    const userId = userDetails.id;
    if(userDetails.role.id == 105){
        alert("only admin can update boards");
        return;
    }
    const params = {
        "description": "",
        "name": data,
        "owner_id": userId
    }

    try {
        const rawPromise = fetch(`http://localhost:8080/api/v1/boards/${id}`,{
            method: 'PUT',
            body: JSON.stringify(params),
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json;charset=UTF-8",
              authorization : `Bearer ${accessToken}`
            }
        })
        const rawResponse = await rawPromise;

      if(rawResponse.ok){
          this.getBoards();
      }else{
          const error = new Error();
          error.message = error.message ?  error.message : "something happened";
          throw error;
      }

      } catch (e) {
        alert(`Error: ${e.message}`);
      }
}
boards.createBoard = async function(data, assigned){
    const userDetails = JSON.parse(window.sessionStorage.getItem("user-details"));
    const accessToken = JSON.parse(window.sessionStorage.getItem("token-details"));
    const userId = userDetails.id;
    if(userDetails.role.id == 105){
        alert("only admin can create boards");
        return;
    }
    const params = {
        "description": assigned,
        "name": data,
        "owner_id": userId
    }

    try {
        const rawPromise = fetch('http://localhost:8080/api/v1/boards',{
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json;charset=UTF-8",
              authorization : `Bearer ${accessToken}`
            }
        })
        const rawResponse = await rawPromise;
        result = await rawResponse.json();
        
      if(rawResponse.ok){
          this.getBoards();
      }else{
          const error = new Error();
          error.message = error.message ?  error.message : "something happened";
          throw error;
      }

      } catch (e) {
        alert(`Error: ${e.message}`);
      }
}
boards.getBoards = async function(){
    const userDetails = JSON.parse(window.sessionStorage.getItem("user-details"));
    const accessToken = JSON.parse(window.sessionStorage.getItem("token-details"));
    try {
        const rawPromise = fetch('http://localhost:8080/api/v1/boards',{
            method: 'GET',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json;charset=UTF-8",
              authorization : `Bearer ${accessToken}`
            }
        })
        const rawResponse = await rawPromise;
        result = await rawResponse.json();
        
      if(rawResponse.ok){
          this.boards = result.boards.filter((element)=>{
                return element.status != "DELETED";
          });
          this.renderListing();
      }else{
          const error = new Error();
          error.message = error.message ?  error.message : "something happened";
          throw error;
      }

      } catch (e) {
        alert(`Error: ${e.message}`);
      }
}
boards.renderBoards = function(){
    this.getBoards();
}
Boards.prototype.renderListing = function () {
    this.listing[0].innerHTML = "";
    if (this.boards.length === 0) {
      const template = `
                <h1 class="no-data">
                    No board items found.
                </h1>`;
      const element = document.createElement("div");
      element.innerHTML = template;
      this.listing[0].innerHTML = template;
      return;
    }else{
        const template = ` <li class="board-li">
            <div class="item-title">
                <h5>Task</h3>
            </div>
            <div class="user-title">
                 <h5>Assigned By</h3>
            </div>
            <div class="assigned-title">
                <h5>Assigned To</h3>
            </div>
            </div>
            <div class="item-actions">
                <div class="edit-button">
                </div>
                <div class="delete-button">
                </div>
            </div>
         </li>`
          const element = document.createElement("div");
          element.innerHTML = template;
          this.listing[0].appendChild(element);
    }
  
    this.boards.forEach((boardItem) => {
      const { owner, name, id, status, description } = boardItem;
  
      const template = `
            <li class="board-li" data-id=${id}>
              <div class="item-title">
                  <label>${name}</label> </input>
                  <input class="text-input editMode hide" type="text" value="${name}" />
              </div>
              <div class="user-title">
              <label>${owner.first_name}</label>
              <label>${owner.last_name}</label>
             </div>
             <div class="assigned-title">
             <label>${description}</label>
            </div>
              <div class="item-actions">
                  <div class="edit-button">
                      Edit
                  </div>
                  <div class="delete-button">
                      Delete
                  </div>
              </div>
          </li>`;
      const element = document.createElement("div");
      element.innerHTML = template;
      this.listing[0].appendChild(element);
    });
};

var instance = new Boards();
instance.addEvents();
instance.renderBoards();