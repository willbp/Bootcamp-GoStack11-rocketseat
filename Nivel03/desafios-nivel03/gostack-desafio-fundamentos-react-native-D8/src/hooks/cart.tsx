import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const cart = await AsyncStorage.getItem('@GoMarketplace:cart');

      if (cart) {
        setProducts(JSON.parse(cart));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      // pego a cópia dos produtos adiciono na var cart
      const cart = [...products];

      const productIndex = cart.findIndex(item => item.id === product.id);
      // se o index n existir
      if (productIndex === -1) {
        // adiciono novo item na lista com quantidade 1
        cart.push({ ...product, quantity: 1 });
      } else {
        // caso exista na lista adiciono +1 a qtd '+1 item no carrinho'
        cart[productIndex].quantity += 1;
      }
      setProducts(cart);
      await AsyncStorage.setItem('@GoMarketplace:cart', JSON.stringify(cart));
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const cart = [...products];

      const productIndex = cart.findIndex(item => item.id === id);

      // se o productIndex existir
      if (productIndex !== -1) {
        cart[productIndex].quantity += 1;

        setProducts(cart);
      }
      await AsyncStorage.setItem('@GoMarketplace:cart', JSON.stringify(cart));
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      const cart = [...products];

      const productIndex = cart.findIndex(item => item.id === id);

      // se o productIndex existir e a quantidade for >1
      if (productIndex !== -1 && cart[productIndex].quantity > 1) {
        cart[productIndex].quantity -= 1;
      }
      // se o index existir e a quantidade do produto chegar a 0 ele vai excluir do carrinho
      else if (cart[productIndex].quantity === 1) {
        // array, remover/qual index, quantos itens serão deletados
        cart.splice(productIndex, 1);
      }
      setProducts(cart);
      await AsyncStorage.setItem('@GoMarketplace:cart', JSON.stringify(cart));
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
