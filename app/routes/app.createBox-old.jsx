import { useState, useEffect } from 'react';
import { Page, FormLayout, TextField, Button, Select, ChoiceList } from '@shopify/polaris';
import { fetchActiveProducts } from './fetchProducts';

export default function CreateBox() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [maxItems, setMaxItems] = useState(3);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  
  useEffect(() => {
    const fetchProducts = async () => {
      const products = await fetchActiveProducts();
      setProducts(products);
    };
    fetchProducts();
  }, []);

  const handleProductSelection = (itemIndex, selected) => {
    setSelectedProducts({
      ...selectedProducts,
      [itemIndex]: selected,
    });
  };

  return (
    <Page title="Create Mix-and-Match Box">
      <FormLayout>
        <TextField label="Box Name" value={name} onChange={setName} autoComplete="off" />
        <TextField label="Price" type="number" value={price} onChange={setPrice} autoComplete="off" />

        <Select
          label="Max Items"
          options={[
            { label: '2 items', value: '2' },
            { label: '3 items', value: '3' },
            { label: '4 items', value: '4' },
          ]}
          value={maxItems}
          onChange={setMaxItems}
        />

        {[...Array(parseInt(maxItems))].map((_, index) => (
          <ChoiceList
            key={index}
            title={`Select products and variants for item ${index + 1}`}
            choices={products.map((product) => ({
              label: product.label,
              value: product.value,
              variants: product.variants, // Nested choice for variants
            }))}
            selected={selectedProducts[index] || []}
            onChange={(selected) => handleProductSelection(index, selected)}
            allowMultiple
          />
        ))}

        <Button onClick={() => console.log(selectedProducts)}>Create Box</Button>
      </FormLayout>
    </Page>
  );
}
