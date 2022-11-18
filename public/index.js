const socket = io();

// Envia mensajes al backend

function enviarMsg() {
    const msgParaEnvio = document.getElementById("inputMsg").value;
    const email = document.getElementById("input-email").value;
    socket.emit("msg", { email: email, mensaje: msgParaEnvio });
    return false;
}

// Recibe mensajes del back y los renderiza en el DOM

socket.on("msg-list", (data) => {
    let html = '';
    data.forEach(item => {
        html +=
            `
        <div class="msj-container" >
        <p class="p-email">${item.timestamp} ${item.email} dice: <br> <span> ${item.mensaje}</span> </p>
        </div> 
        `
    })
    document.getElementById("mgs-area").innerHTML = html;

});


// Funcion para enviar productos el backend

function postProducto() {
    const producto = document.getElementById("producto").value;
    const precio = document.getElementById("precio").value;
    const imagen = document.getElementById("imagen").value;
    socket.emit("product", { name: producto, price: precio, thumbnail: imagen });
    console.log(producto);
    return false;
}   

socket.on("product-list", (data) => {
    let html = '';
	
    data.forEach(item => {
        html +=
            `
            <tr>
            <td>${item.id} </th>
            <td>${item.name} </td>
            <td>$${item.price} </td>
            <td><img src="${item.thumbnail}" class="product-img"/></td>
        `
    })
    document.getElementById("tbodyProd").innerHTML = html;

});


