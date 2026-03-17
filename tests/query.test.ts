import { describe, it, expect } from 'vitest';
import { query, createWhere, createSort, createGroupBy, createHaving } from '../src/query';
import { Group } from '../src/types/transforms'; // <-- ИМПОРТИРУЕМ ТИП

type User = {
  id: number;
  name: string;
  surname: string;
  age: number;
  city: string;
};

const testUsers: User[] = [
  { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
  { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
  { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
  { id: 4, name: "Mike", surname: "Doe", age: 35, city: "LA" },
  { id: 5, name: "Anna", surname: "Smith", age: 28, city: "NY" },
];

describe('Query pipeline', () => {
  const where = createWhere<User>();
  const sort = createSort<User>();
  const groupBy = createGroupBy<User>();
  const having = createHaving<User>();

  // === 1. ФИЛЬТРАЦИЯ ===
  it('should filter by condition', () => {
    const pipeline = query<User>(where("city", "NY"));
    const result = pipeline(testUsers);
    
    expect(result).toHaveLength(3);
    expect(result.every(u => u.city === "NY")).toBe(true);
  });

  // === 2. СОРТИРОВКА ===
  it('should sort by age', () => {
    const pipeline = query<User>(sort("age"));
    const result = pipeline(testUsers);
    
    expect(result[0].age).toBe(28);
    expect(result[1].age).toBe(33);
    expect(result[2].age).toBe(34);
    expect(result[3].age).toBe(35);
  });

  // === 3. ФИЛЬТРАЦИЯ + СОРТИРОВКА ===
  it('should filter then sort', () => {
    const pipeline = query<User>(
      where("name", "John"),
      sort("age")
    );
    const result = pipeline(testUsers);
    
    expect(result).toHaveLength(3);
    expect(result[0].age).toBe(33);
    expect(result[1].age).toBe(34);
    expect(result[2].age).toBe(35);
  });

  // === 4. ГРУППИРОВКА (исправлено) ===
  it('should group by city', () => {
    const pipeline = query<User>(groupBy("city"));
    const result = pipeline(testUsers) as unknown as Group<User, "city">[]; // <-- ИСПРАВЛЕНО
    
    expect(result).toHaveLength(2);
    
    const nyGroup = result.find(g => g.key === "NY");
    expect(nyGroup?.items).toHaveLength(3);
    
    const laGroup = result.find(g => g.key === "LA");
    expect(laGroup?.items).toHaveLength(2);
  });

  // === 5. HAVING (исправлено) ===
  it('should filter groups with more than 1 item', () => {
    const pipeline = query<User>(
      groupBy("city"),
      having<User>((group) => group.items.length > 1)
    );
    const result = pipeline(testUsers) as unknown as Group<User, "city">[]; // <-- ИСПРАВЛЕНО
    
    expect(result).toHaveLength(2);
  });

  // === 6. КОМБИНИРОВАННЫЙ (исправлено) ===
  it('should filter, group, then filter groups', () => {
    const pipeline = query<User>(
      where("surname", "Doe"),
      groupBy("city"),
      having<User>((group) => group.items.length > 1)
    );
    const result = pipeline(testUsers) as unknown as Group<User, "city">[]; // <-- ИСПРАВЛЕНО
    
    expect(result).toHaveLength(2);
  });

  // === 7. ПУСТОЙ КОНВЕЙЕР ===
  it('should handle empty pipeline', () => {
    const pipeline = query<User>();
    const result = pipeline(testUsers);
    
    expect(result).toEqual(testUsers);
  });
});