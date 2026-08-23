const CIYALOO_PRODUCTS_KEY = 'ciyalooAdminProducts';

const DEFAULT_CIYALOO_PRODUCTS = [
  {
    name: 'MIREA',
    price: 109,
    discount: 0,
    image: 'mirea.png',
    desc: 'Luxury floral fragrance with lasting elegance.',
  },
  {
    name: 'ZARAH',
    price: 79,
    discount: 0,
    image: 'zarah.png',
    desc: 'Warm and exotic perfume blend.',
  },
  {
    name: 'EZRA',
    price: 79,
    discount: 0,
    image: 'ezraa.jpeg',
    desc: 'Fresh citrus and musk harmony.',
  },
  {
    name: 'ESPOIR',
    price: 109,
    discount: 15,
    image: 'espoir.png',
    desc: 'Sophisticated amber and vanilla notes.',
  },
];

function getStoredProducts() {
  const storedProducts = localStorage.getItem(CIYALOO_PRODUCTS_KEY);

  if (!storedProducts) {
    localStorage.setItem(
      CIYALOO_PRODUCTS_KEY,
      JSON.stringify(DEFAULT_CIYALOO_PRODUCTS),
    );
    return DEFAULT_CIYALOO_PRODUCTS;
  }

  try {
    const products = JSON.parse(storedProducts);
    return Array.isArray(products)
      ? products.map(normalizeProductImage)
      : DEFAULT_CIYALOO_PRODUCTS;
  } catch (error) {
    console.warn('Unable to load CIYALOO products.', error);
    return DEFAULT_CIYALOO_PRODUCTS;
  }
}

function normalizeProductImage(product) {
  const safeProduct = product || {};
  return {
    ...safeProduct,
    image: String(safeProduct.image || '').replace(/^css\/img\//, ''),
  };
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getVisibleProducts(grid) {
  const products = getStoredProducts();
  const limit = Number(grid.dataset.limit || products.length);
  return products.slice(0, limit);
}

function renderProductGrid(grid) {
  const products = getVisibleProducts(grid);
  const columnClass = grid.dataset.columnClass || 'col-md-3';

  if (!products.length) {
    grid.innerHTML =
      '<div class="col-12"><p class="text-center text-muted mb-0">No products available right now.</p></div>';
    return;
  }

  grid.innerHTML = products
    .map(function (product, index) {
      const name = escapeHtml(product.name);
      const price = Number(product.price) || 0;
      const image = escapeHtml(product.image || 'favicon.ico');
      const desc = escapeHtml(product.desc || '');
      const priceLabel = product.discount
        ? '<p class="product-price mb-1">AED ' +
          price +
          '</p><p class="product-discount mb-3">' +
          Number(product.discount) +
          '% OFF</p>'
        : '<p class="product-price">AED ' + price + '</p>';

      return (
        '<div class="' +
        columnClass +
        '">' +
        '<div class="card product-card h-100">' +
        '<img src="' +
        image +
        '" class="card-img-top" alt="' +
        name +
        ' perfume bottle" loading="lazy" />' +
        '<div class="card-body text-center">' +
        '<h5>' +
        name +
        '</h5>' +
        (desc ? '<p class="product-desc">' + desc + '</p>' : '') +
        priceLabel +
        '<button type="button" class="btn btn-dark add-product-btn" data-product-index="' +
        index +
        '">Add to Cart</button>' +
        '</div></div></div>'
      );
    })
    .join('');

  grid.querySelectorAll('.add-product-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      const product = products[Number(this.dataset.productIndex)];
      if (!product || typeof addToCart !== 'function') return;

      addToCart({
        name: product.name,
        price: Number(product.price) || 0,
        image: product.image || 'favicon.ico',
      });
      window.location.href = 'cart.html';
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-product-grid]').forEach(renderProductGrid);
});
