
import Basket from './basket';

import products from './resource/products';

const basket = new Basket(products);

basket.add('SR1');
basket.add('SR1');
basket.add('FR1');
basket.add('SR1');

const price = basket.total();

console.log(price);
