import React, { useState } from 'react';

const SearchBar = ({ products, onFilteredProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === '') {
      onFilteredProducts(products);
    } else {
      const filteredProducts = products.filter(product => {
        // Asegurarse de que referenceNumbers sea una cadena
        const referenceNumbersString = typeof product.referenceNumbers === 'string'
          ? product.referenceNumbers
          : '';

        return product.title.toLowerCase().includes(term) ||
          referenceNumbersString.split(',').some(num => num.trim().toLowerCase().includes(term));
      });

      onFilteredProducts(filteredProducts);
    }
  };

  return (
    <div className="mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Buscar por título o número de referencia"
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
