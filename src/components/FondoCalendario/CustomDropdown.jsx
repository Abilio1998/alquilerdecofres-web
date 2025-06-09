import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de que el CSS de Bootstrap esté incluido

const CustomDropdown = ({ selectedValue, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar la apertura/cierre

  const handleToggle = () => setIsOpen(!isOpen); // Alternar el estado de abierto/cerrado

  return (
    <Dropdown show={isOpen} onToggle={handleToggle}>
      <Dropdown.Toggle variant="secondary" onClick={handleToggle} className="w-100 text-left">
        {selectedValue || 'Selecciona una opción'}
      </Dropdown.Toggle>
      <Dropdown.Menu className="custom-dropdown-menu">
        {options.map(option => (
          <Dropdown.Item key={option} onClick={() => onSelect(option)}>
            {option}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CustomDropdown;
