let LS_KEY = 'insuracare-claims';

function readAll() {
  const raw = localStorage.getItem(LS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeAll(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

export default {
  async createClaim(payload) {
    const list = readAll();
    const id = list.length ? (Math.max(...list.map(c => c.id)) + 1) : 1;
    const record = {
      id,
      ...payload,
      status: 'SUBMITTED',
      submissionDate: todayDate()
    };
    list.push(record);
    writeAll(list);
    return record;
  },

  async getAll() {
    return readAll();
  },

  async getById(id) {
    return readAll().find(c => c.id === Number(id)) || null;
  },

  async updateStatus(id, status) {
    const list = readAll();
    const idx = list.findIndex(c => c.id === Number(id));
    if (idx === -1) throw new Error('not found');
    list[idx].status = status;
    writeAll(list);
    return list[idx];
  }
};

