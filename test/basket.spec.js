
import { expect } from 'chai';
import sinon from 'sinon';

import Basket from '../src/basket';

describe('basket', () => {

  const fakeProductCode = 'PRODUCT1';

  const fakeOffer1 = {
    operator: '>=',
    quantity: 3,
    discountOperator: '-',
    discount: 0.50
  };

  const fakeOffer2 = {
    operator: '%',
    quantity: 2,
    discountOperator: '/'
  };

  const fakeInitialProduct = {
    code: fakeProductCode,
    price: 1,
    offers: []
  };

  context('increment product count', () => {

    let basket = null

    before(() => basket = new Basket([fakeInitialProduct]));

    it('item does not exist in basket', () => {

      expect(basket.items).to.eql({});

      basket.add(fakeProductCode);

      expect(basket.items).to.eql({
        [fakeProductCode]: 1
      });

    });

    it('item exists in basket', () => {

      expect(basket.items).to.eql({
        [fakeProductCode]: 1
      });

      basket.add(fakeProductCode);

      expect(basket.items).to.eql({
        [fakeProductCode]: 2
      });

    });

  });

  context('determine if offer applies to product in basket by operator', () => {

    let basket = null;

    before(() => {

      const fakeProduct = Object.assign({}, fakeInitialProduct, {
        offers: [ fakeOffer1, fakeOffer2 ]
      });

      basket = new Basket([fakeProduct]);

    });

    context('>=', () => {

      it('applies', () => {

        const result = basket.getOfferByOperator(fakeOffer1, 3);

        expect(result).to.be.true;

      });

      it('does not apply', () => {

        const result = basket.getOfferByOperator(fakeOffer1, 1);

        expect(result).to.be.false;

      });

    });

    context('%', () => {

      it('applies', () => {

        const result = basket.getOfferByOperator(fakeOffer2, 2);

        expect(result).to.be.true;

      });

      it('does not apply', () => {

        const result = basket.getOfferByOperator(fakeOffer2, 1);

        expect(result).to.be.false;

      });

    });

    it('undefined operator handling', () => {

      const fakeOffer = {
        operator: 'UNDEFINED_OPERATOR'
      };

      const result = basket.getOfferByOperator(fakeOffer, 1);

      expect(result).to.be.false;

    });

  });

  it('find offer', () => {

    const fakeProduct = Object.assign({}, fakeInitialProduct, {
      offers: [ fakeOffer1, fakeOffer2 ]
    });

    const basket = new Basket([fakeProduct]);

    basket.items[fakeProductCode] = 2;

    const getOfferByOperatorStub = sinon.spy(basket, 'getOfferByOperator');

    const result = basket.getOffer(fakeProduct);

    expect(getOfferByOperatorStub.callCount).to.equal(2);

    expect(result).to.eql(fakeOffer2);

    getOfferByOperatorStub.restore();

  });

  context('apply offer to product total by discountOperator', () => {

    let fakeProduct = null;

    before(() => {
      fakeProduct = Object.assign({}, fakeInitialProduct, {
        offers: [ fakeOffer1, fakeOffer2 ]
      });
    });

    it('-', () => {

      const basket = new Basket([fakeProduct]);

      basket.items[fakeProductCode] = 3;

      const total = basket.applyOffer(fakeOffer1, fakeProduct);

      expect(total).to.equal(1.50);

    });

    it('/', () => {

      const basket = new Basket([fakeProduct]);

      basket.items[fakeProductCode] = 2;

      const total = basket.applyOffer(fakeOffer2, fakeProduct);

      expect(total).to.equal(1);

    });

  });

  it('find product by product code', () => {

    const basket = new Basket([fakeInitialProduct, {
      code: 'SOME_OTHER_PRODUCT_CODE_1'
    }, {
      code: 'SOME_OTHER_PRODUCT_CODE_2'
    }]);

    const result = basket.getProduct(fakeProductCode);

    expect(basket.products).to.have.lengthOf(3);

    expect(result).to.eql(fakeInitialProduct);

  });

  context('get product total by product code', () => {

    it('if offer exists', () => {

      const fakeProduct = Object.assign({}, fakeInitialProduct, {
        offers: [ fakeOffer1, fakeOffer2 ]
      });

      const basket = new Basket([fakeProduct]);

      basket.items[fakeProductCode] = 2;

      const result = basket.getProductTotal(fakeProductCode);

      expect(result).to.equal(1);

    });

    it('if offer doesn\'t exist', () => {

      const basket = new Basket([fakeInitialProduct]);

      basket.items[fakeProductCode] = 2;

      const result = basket.getProductTotal(fakeProductCode);

      expect(result).to.equal(2);

    });

  });

  context('calculate total', () => {

    it('if no items have been added to basket', () => {

      const basket = new Basket(fakeInitialProduct);

      const result = basket.total();

      expect(result).to.equal('£0.00');

    });

    it('if items have been added to basket', () => {

      const fakeProducts = [
        Object.assign({}, fakeInitialProduct, {
          code: `${fakeProductCode}1`,
          offers: [ fakeOffer1, fakeOffer2 ]
        }),
        Object.assign({}, fakeInitialProduct, {
          code: `${fakeProductCode}2`,
          offers: [ fakeOffer1, fakeOffer2 ]
        })
      ];

      const basket = new Basket(fakeProducts);

      basket.items[`${fakeProductCode}1`] = 2;
      basket.items[`${fakeProductCode}2`] = 3;

      const result = basket.total();

      expect(result).to.equal('£2.50');

    });

  });

});
