// PAGElOAD
let show = [];

async function product() {
    // await loading();

    let load = document.querySelector(".loader");
    load.classList.add("display");
    let data1 = await fetch("https://dummyjson.com/products")
        .then(response => {
            // console.log(response);
            if (!response.ok) {
                throw `Error ${response.status}`;
            }
            return response.json();
        })
        .then(data => {
            sessionStorage.setItem("product", JSON.stringify(data.products));
            load.classList.remove("display");
        })
        .catch(e => {
            load.classList.remove("display");
            console.log(e);
        });
    let data = JSON.parse(sessionStorage.getItem("product"));
    // console.log(data);
    return data;
}
// CAROUSEL
function carajs(a) {
    let box = document.querySelectorAll(".box");
    let curr = document.querySelector(`.box${a}`);
    let allbtn = document.querySelectorAll(".page-btn");
    let thisbtn = document.querySelector(`.page-btn${a}`);
    allbtn[0].style.backgroundColor = "rgba(68, 62, 62, 0.5) !important";
    for (let i of allbtn) {
        i.style.backgroundColor = "rgba(68, 62, 62, 0.5)";
    }
    for (let i of box) {
        i.classList.remove("active");
    }
    curr.classList.add("active");
    thisbtn.style.backgroundColor = "blue";
    thisbtn.style.outline = "none";
}
// fetch product data from json api
let hi = product();

let data = JSON.parse(sessionStorage.getItem("product"));
console.log(data);
class Product {
    constructor(data) {
        this.data = data;
    }
    getCategory = () => {
        let gcate = this.data.map(a => a.category);
        return gcate.filter((dt, ind) => {
            return gcate.indexOf(dt) == ind;
        })
    }
    allcate = () => {
        return this.data;
    }
    getProduct = (z) => {
        return this.data.filter(f => f.category == z);

    }
    getIdProduct = (p) => {
        return this.data.filter(s => s.id == p);
    }

}
// console.log(pdata);
let prodata = new Product(data);

let cate = prodata.getCategory();

// heading of category ...

function showCategory() {
    let filterProduct = document.querySelector(".filter-product");
    let cateBody = document.querySelector(".category-body");

    let ul = document.createElement("ul");
    filterProduct.appendChild(ul);

    ul.innerHTML += `<li><button id = "sall" class = "cate-btn active-cate">Show All</button></li>`;

    for (let i of cate) {
        ul.innerHTML += `<li><button id = "${i}" class = "cate-btn">${i}</button></li>`;

    }
    let allbtn = document.querySelectorAll(".cate-btn");

    for (let but of allbtn) {
        but.addEventListener("click", function () {
            showProduct(this);
        });
    }
    prodata.allcate().forEach(p => displayItem(p));
}

showCategory();

// category body...

function showProduct(e) {
    let curr = document.querySelector(`#${e.id}`);
    let allbtn = document.querySelectorAll(`.cate-btn`);
    for (let b of allbtn) {
        b.classList.remove("active-cate");
    }
    curr.classList.add("active-cate");

    // let show = prodata.getProduct(e.id);
    document.querySelector(".product-row").innerHTML = "";
    if (e.id == "sall") {
        prodata.allcate().forEach(p => displayItem(p));
    } else {
        prodata.getProduct(e.id).forEach(p => displayItem(p));
    }

}

function displayItem(show) {

    // console.log(show);
    let cateBody = document.querySelector(".product-row");

    let col = document.createElement("div");
    col.className = "col";
    col.id = "each-product";
    cateBody.appendChild(col);

    // console.log(cateBody);

    let dprice = show.price - ((show.price * show.discountPercentage) / 100);
    // console.log(dprice);

    col.innerHTML = `
                            <div class="product-img" onmouseover = "changeImg(this)">
                                <img  src="${show.thumbnail}" alt="" >
                                <div class = "hoverBox">
                                    <img src = "${show.images[0]}" class = "hoverImg">
                                    <div class = "hoverIcon">
                                        <button><i class="fa-regular fa-heart" onclick = "wishlist(this)"></i></button>
                                        <button  onclick = "viewDetails(${show.id})"><i class="fa-regular fa-eye"></i></button>
                                        <button><i class="fa-solid fa-code-compare"></i></button>
                                    </div>
                                </div>
                            </div>
                                <span id = "brand">${show.brand}</span>

                                <h6 id="descri">${show.title}</h6>

                                $  <span id="old-price">${show.price}</span>
                                <span id="discount-price">${dprice}</span>
                                <br>

                            <button class = "addToCart" onclick = "cartCanvas(${show.id})">
                                Add To Cart
                                <i class="fa-solid fa-cart-shopping"></i>
                            </button>
                                            
        `;
}

// CHANGE THE IMAGE OF PRODUCT ON MOUSE
function changeImg(a) {
    var defaultImg = a.querySelector("img");
    const defaultSrc = defaultImg.src;

    var hbox = a.querySelector(".hoverBox");
    var newImg = hbox.querySelector(".hoverImg");
    const newSrc = newImg.src;

    defaultImg.addEventListener('mouseover', function () {
        defaultImg.src = newSrc;
    });

    defaultImg.addEventListener('onmouseout', function () {
        // Change the image source back to the default image
        defaultImg.src = defaultSrc;
    });

}

//  WISHLIST
var count = 0;
function wishlist(a) {
    let wishItem = document.querySelector("#wishlist");
    count = wishItem.innerHTML.trim();

    if (a.className.match("fa-regular")) {
        count++;
        a.classList.remove("fa-regular");
        a.classList.add("fa-solid");
        // a.style.color = "red";
    } else {
        count--;
        a.classList.add("fa-regular");
        a.classList.remove("fa-solid");
    }
    wishItem.innerHTML = count;
}

// OPEN MODAL FOR PRODUCT DETAILS
function viewDetails(a) {
    let productArr = prodata.getIdProduct(a);

    let modalDescri = document.querySelector("#modal-descri");
    let modalHead = document.querySelector("#modal-head");
    let modalPrice = document.querySelector("#modal-price");
    let modalDetails = document.querySelector("#modal-product-detail");

    let modalAv = document.querySelector("#stock");
    let modalct = document.querySelector("#modal-cate");

    modalDescri.parentElement.parentElement.style.display = "flex";
    console.log(productArr);


    for (s of productArr) {
        let ddprice = s.price - ((s.price * s.discountPercentage) / 100);
        modalHead.innerHTML += s.title;
        modalPrice.innerHTML += "$" + ddprice;
        modalDetails.innerHTML += s.description;

        if (s.stock >= 0) {
            modalAv.innerHTML = "In Stock";
        } else {
            modalAv.innerHTML = "Out Of The Stock";
            modalAv.style.color = "red";
        }

        modalct.innerHTML = s.category;
    }

}
// CLOSE MODAL
function closeModal() {
    let pmodal = document.querySelector("#product-modal");
    pmodal.style.display = "none";
    // console.log(pmodal);
}

// MODAL CAROUSEL
function modalCara(a) {
    let slide = document.querySelector(".cara-modal-box");
    let maxwidth = document.querySelector(".cara-modal-box .modal-cara-slide").clientWidth;
    // console.log(maxwidth);
    let b = slide.scrollLeft;
    let sum = b + a;
    // console.log(sum);

    if (sum < maxwidth && sum > 0) {
        slide.scroll({
            left: sum,
            top: 0,
            behavior: "smooth"
        });
    } else if (sum < 0) {
        slide.scroll({
            left: maxwidth - 1,
            top: 0,
            behavior: "smooth"
        });
    }
}

// Qantity of product
function qantity(a) {
    let numVar = document.querySelector(".numItem");
    let minus = document.querySelector("#minus");
    // let par = minus.parentElement;
    // let numVar = par.querySelector("span");
    // console.log(minus.parentElement);
    let numItem = parseInt(numVar.innerHTML);
    if (a == -1) {
        if (numItem > 0) {
            numVar.innerHTML = numItem - 1;
        } else {
            minus.style.disabled;
        }
    } else {
        numVar.innerHTML = numItem + 1;
    }

}

// OFCANVAS FOR VIEW IN CART
var wcount = 0;
function cartCanvas(cid) {

    let productArr = prodata.getIdProduct(cid);

    let myCanvas = document.querySelector("#cartOffcanvas");
    let myCart = document.querySelector("#myCart");

    myCanvas.classList.add('active1');

    wcount = bag.innerHTML.trim();
    if (typeof (cid) === "number") {

        for (p of productArr) {

            let ddprice = p.price - ((p.price * p.discountPercentage) / 100);

            myCart.innerHTML += `
            <div id = "cartNum">
                    <div class="cart-img">
                    <img src="${p.thumbnail}" alt="" srcset="">
                </div>

                <div class="cart-details">
                    <h6>${p.title}</h6>
                    <p>$ <span id = "cart-price"> ${ddprice} </span></p>
                    <div class="cart-quantity">
                        <button onclick = "qantity(-1)" id = "minus">-</button>
                        <span class="numOfItems numItem">1</span>
                        <button onclick = "qantity(1)" id = "plus">+</button>
                    </div>
                </div>

                <button id="cancelItem" onclick = "cancelItem(this)"><i class="fa-regular fa-trash-can"></i></button> 
            </div>
                
            `;
        }
    }
    // bag.innerHTML = wcount;
    calculateTotalPrice();
}

function cancelItem(item) {
    item.parentElement.remove();
    calculateTotalPrice();
}

// close offcanvas
function closeCanvas() {
    let myCanvas = document.querySelector("#cartOffcanvas");
    myCanvas.classList.remove("active1")
    console.log(myCanvas);
}
// offcanvas footer
function calculateTotalPrice() {
    let cartItems = document.querySelectorAll("#cartNum");
    let total = document.querySelector("#total");
    let bag = document.querySelector("#bag");

    let totalPrice = 0;
    for (i of cartItems) {
        let priceTag = i.querySelector("#cart-price");
        let cPrice = parseFloat(priceTag.innerHTML);
        totalPrice += cPrice;
    }

    wcount = cartItems.length;

    total.innerHTML = "$ " + totalPrice.toFixed(2);
    bag.innerHTML = wcount;
}

let loginInterval;

// Function to show the login popup
function showLoginPopup() {
    const popup = document.getElementById('loginPopup');
    popup.classList.add('show');
}

// Function to hide the login popup
function hideLoginPopup() {
    const popup = document.getElementById('loginPopup');
    popup.classList.remove('show');
}

// Function to show the user profile
function showUserProfile(imageUrl) {
    // const profileDiv = document.getElementById('profile');
    const userImage = document.getElementById('userImage');
    const userimg = document.getElementById('userimg');
    userImage.src = imageUrl;
    userImage.style.display = 'block';
    userimg.style.display = 'none';
}

// Function to handle the login button click
function handleLogin() {

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch("https://api.escuelajs.co/api/v1/users")
        .then(response => {
            console.log(response);
            if (!response.ok) {
                throw `Error - ${response.status}`;
            }
            return response.json();
        })
        .then(user => {
            // console.log(user);
            sessionStorage.setItem("userdata", JSON.stringify(user));
        })
        .catch(e => console.log(e));

        let user = JSON.parse(sessionStorage.getItem("userdata"));
        console.log(user);

        
        const loginPopup = document.querySelector("#loginPopup");

        for(let i of user){
            if ((username === i.email || username === i.name) && password === i.password) {
                hideLoginPopup();
                clearInterval(loginInterval);

                confirm("Logged in successfully Welcome " + username +"!");

                showUserProfile(i.avatar);
                // sessionStorage.setItem('loggedIn');
                sessionStorage.setItem("userimg",JSON.stringify(i.avatar));
                break;
            } else {
                confirm('Invalid credentials. Please try again.');
                console.log('Invalid credentials. Please try again.');
                showLoginPopup();
                break;
            }
        }
       
}
// Function to handle the cancel button click
function handleCancel() {
    hideLoginPopup();
    
}

// Show login popup every minute
function showLoginPopupInterval() {
    loginInterval = setInterval(showLoginPopup, 6000);
}

// Add event listeners to login and cancel buttons
const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', handleLogin);

const cancelBtn = document.getElementById('cancelBtn');
cancelBtn.addEventListener('click', handleCancel);

// Check login status and show login popup every minute if not logged in
function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('loggedIn');

    if (!isLoggedIn) {
        showLoginPopup();
    } else {
        const userImageUrl = localStorage.getItem('userimg');
        
            showUserProfile(userImageUrl);
    }
}
// Initial call to show login popup
showLoginPopupInterval();