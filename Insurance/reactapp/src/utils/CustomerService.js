let LS_KEY = 'insuracare_customers';

function readAll() {
  const raw = localStorage.getItem(LS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeAll(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

export default {
  async createCustomer(payload) {
    const list = readAll();
    const id = list.length ? (Math.max(...list.map(c => c.id)) + 1) : 1;
    const record = { id, ...payload };
    list.push(record);
    writeAll(list);
    return record;
  },
  async getAll() { return readAll(); },
  async getById(id) {
    return readAll().find(c => c.id === Number(id)) || null;
  },
  async update(id, payload) {
    const list = readAll();
    const idx = list.findIndex(c => c.id === Number(id));
    if (idx === -1) throw new Error('not found');
    list[idx] = { ...list[idx], ...payload };
    writeAll(list);
    return list[idx];
  }
};


