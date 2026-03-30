let currentUser = null;

// Register
async function registerUser() {
  const username = document.getElementById("username")?.value;
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  const res = await fetch("http://localhost:5000/api/users/register", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({username, email, password})
  });
const msg = await res.text();
document.getElementById("message").innerText = msg;

// register hone ke baad login page par bhej do
if(msg.toLowerCase().includes("success")){
  window.location.href = "login.html";
}
}



// Login
async function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:5000/api/users/login", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({email, password})
  });
  const data = await res.json();
  if(data.message === "Login Successful"){
    currentUser = data.user;
    localStorage.setItem("userId", currentUser._id);
    window.location.href = "index.html";
  } else {
    document.getElementById("message").innerText = data;
  }
}
function logout(){
  localStorage.removeItem("userId");
  window.location.href="login.html";
}

// Create Post
async function createPost(){
  const content = document.getElementById("postContent").value;
  const userId = localStorage.getItem("userId");
  if(!userId) return alert("Login first");

  await fetch("http://localhost:5000/api/posts/create",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({userId, content})
  });
  loadPosts();
}

// Load Posts
async function loadPosts(){
  const res = await fetch("http://localhost:5000/api/posts/all");
  const posts = await res.json();

  let html = "";
  posts.forEach(post => {
    html += `<div>
      <p>${post.content}</p>
      <button onclick="likePost('${post._id}')">Like (${post.likes.length})</button>
      <button onclick="commentPost('${post._id}')">Comment</button>
      <div id="comments-${post._id}">
        ${post.comments.map(c=>`<p>${c.text} (by ${c.userId})</p>`).join('')}
      </div>
    </div>`;
  });

  document.getElementById("posts").innerHTML = html;
}

// Like
async function likePost(postId){
  const userId = localStorage.getItem("userId");
  await fetch(`http://localhost:5000/api/posts/like/${postId}`,{
    method:"PUT",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({userId})
  });
  loadPosts();
}

// Comment
async function commentPost(postId){
  const text = prompt("Enter comment:");
  const userId = localStorage.getItem("userId");
  if(!text) return;

  await fetch(`http://localhost:5000/api/posts/comment/${postId}`,{
    method:"PUT",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({userId, text})
  });
  loadPosts();
}

// Auto-load posts if on index.html
if(document.getElementById("posts")) loadPosts();