import { CURRENCIES, formatCurrency, fromDkk, toDkk } from './format';

test('DKK conversion round-trips for every currency', () => {
  CURRENCIES.forEach((c) => {
    expect(fromDkk(toDkk(100, c), c)).toBeCloseTo(100, 6);
  });
  // A non-DKK amount must actually change when normalised.
  expect(toDkk(100, 'EUR')).toBeGreaterThan(100);
  expect(toDkk(100, 'DKK')).toBe(100);
});

test('formatting uses the given currency, not a fixed one', () => {
  expect(formatCurrency(100, 'USD')).toContain('$');
  expect(formatCurrency(100, 'EUR')).toContain('€');
  expect(formatCurrency(100, 'DKK')).toContain('kr');
});
