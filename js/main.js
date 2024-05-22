document.addEventListener("DOMContentLoaded", function() {
    const nombreInput = document.getElementById("nombre");
    const cantidadInput = document.getElementById("cantidad");
    const categoriaSelect = document.getElementById("categoria");
    const sedeSelect = document.getElementById("sede");
    const agregarBtn = document.getElementById("agregar");
    const categoriasContainer = document.getElementById("categorias");
    let contadorProductos = 1;

    function renderCategorias() {
        categorias.forEach(categoria => {
            const categoriaCard = document.createElement("div");
            categoriaCard.className = "categoria-card";

            const imagen = document.createElement("img");
            imagen.src = categoria.imagen;
            imagen.alt = categoria.tipoDeProducto;
            categoriaCard.appendChild(imagen);

            const titulo = document.createElement("h2");
            titulo.textContent = categoria.tipoDeProducto;
            categoriaCard.appendChild(titulo);

            const productosContainer = document.createElement("ul");
            productosContainer.id = `${categoria.tipoDeProducto.toLowerCase()}-productos`;
            categoriaCard.appendChild(productosContainer);

            categoriasContainer.appendChild(categoriaCard);
        });
    }

    function guardarEnLocalStorage() {
        const inventario = [];
        categorias.forEach(categoria => {
            const productosContainer = document.getElementById(`${categoria.tipoDeProducto.toLowerCase()}-productos`);
            const productos = productosContainer.getElementsByTagName("li");
            for (let producto of productos) {
                inventario.push({
                    texto: producto.textContent.replace(" X", ""),
                    categoria: categoria.tipoDeProducto
                });
            }
        });
        localStorage.setItem("inventario", JSON.stringify(inventario));
    }

    function cargarDesdeLocalStorage() {
        const inventario = JSON.parse(localStorage.getItem("inventario")) || [];
        inventario.forEach(producto => {
            agregarProductoDOM(producto);
        });
        contadorProductos = inventario.length ? Math.max(...inventario.map(p => parseInt(p.texto.split(".")[0]))) + 1 : 1;
    }

    function agregarProductoDOM(producto) {
        const nuevoProducto = document.createElement("li");
        nuevoProducto.textContent = producto.texto;

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "X";
        btnEliminar.className = "btn-eliminar";
        btnEliminar.addEventListener("click", function() {
            nuevoProducto.remove();
            guardarEnLocalStorage();
        });

        nuevoProducto.appendChild(btnEliminar);

        const productosContainer = document.getElementById(`${producto.categoria.toLowerCase()}-productos`);
        productosContainer.appendChild(nuevoProducto);
    }

    agregarBtn.addEventListener("click", function() {
        const nombre = nombreInput.value.trim();
        const cantidad = parseInt(cantidadInput.value.trim(), 10);
        const categoria = categoriaSelect.value;
        const sede = sedeSelect.value;

        if (nombre === "" || isNaN(cantidad) || cantidad <= 0 || categoria === "" || sede === "") {
            alert("Por favor, completa todos los campos con datos válidos.");
            return;
        }

        const nuevoProducto = {
            texto: `${contadorProductos}. ${nombre} - Cantidad: ${cantidad} - Categoría: ${categoria} - Sede: ${sede}`,
            categoria
        };

        agregarProductoDOM(nuevoProducto);

        contadorProductos++;

        nombreInput.value = "";
        cantidadInput.value = "";
        categoriaSelect.selectedIndex = 0;
        sedeSelect.selectedIndex = 0;

        guardarEnLocalStorage();
    });

    document.getElementById("buscar").addEventListener("click", function() {
        const nombreFiltro = document.getElementById("buscarNombre").value.toLowerCase();
        const categoriaFiltro = document.getElementById("buscarCategoria").value;

        categorias.forEach(categoria => {
            const productosContainer = document.getElementById(`${categoria.tipoDeProducto.toLowerCase()}-productos`);
            const productos = productosContainer.getElementsByTagName("li");
            for (let producto of productos) {
                const nombreProducto = producto.textContent.toLowerCase();
                const categoriaProducto = categoria.tipoDeProducto;

                if ((nombreFiltro === "" || nombreProducto.includes(nombreFiltro)) &&
                    (categoriaFiltro === "" || categoriaProducto === categoriaFiltro)) {
                    producto.style.display = "";
                } else {
                    producto.style.display = "none";
                }
            }
        });
    });

    renderCategorias();
    cargarDesdeLocalStorage();
});
