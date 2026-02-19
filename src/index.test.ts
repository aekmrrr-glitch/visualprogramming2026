import { describe, it, expect } from 'vitest';
import {
  createUser,
  createBook,
  calculateArea,
  getStatusColor,
  capitalizeFirst,
  getFirstElement,
  findById,
} from './index';

describe('Test 1 - createUser', () => {
  it('should create a user ', () => {
    const user = createUser(54, 'Mira');
    expect(user).toEqual({ id: 54, name: 'Mira', isActive: true });
  });
});

describe('Test 2 - createBook', () => {
  it('should create a book', () => {
    const book = createBook({ 
      title: 'Love of Life, and Other Stories', 
      author: 'Jack London', 
      genre: 'non-fiction' 
    });
    expect(book).toEqual({
      title: 'Love of Life, and Other Stories',
      author: 'Jack London',
      genre: 'non-fiction'
    });
  });

    it('should create a book with year', () => {
    const book = createBook({ 
      title: 'Love of Life, and Other Stories', 
      author: 'Jack London', 
      year: 1905,
      genre: 'non-fiction' 
    });
    expect(book).toEqual({
      title: 'Love of Life, and Other Stories',
      author: 'Jack London',
      year: 1905,
      genre: 'non-fiction'
    });
  });
});

describe('Test 3 - calculateArea', () => {
  it('should calculate circle area', () => {
    expect(calculateArea('circle', 10)).toBeCloseTo(314.159, 2);
  });
});

describe('Test 4 - getStatusColor', () => {
  it('should return green for active', () => {
    expect(getStatusColor('active')).toBe('green');
  });
});

describe('Test 5 - capitalizeFirst', () => {
  it('should capitalize first letter', () => {
    expect(capitalizeFirst('hello')).toBe('Hello');
  });
});

describe('Test 6 - getFirstElement', () => {
  it('should return first element number', () => {
    expect(getFirstElement([10, 20, 30])).toBe(10);
  });

   it('should return first element string', () => {
    expect(getFirstElement(['tata', 'pampam', 'tyty'])).toBe('tata');
  });
});

describe('Test 7 - findById', () => {
  it('should find object by id', () => {
    const items = [{ id: 1, name: 'Item 1' }];
    expect(findById(items, 1)).toEqual({ id: 1, name: 'Item 1' });
  });
});