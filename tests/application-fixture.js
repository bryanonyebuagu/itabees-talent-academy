export function applicationFixture(overrides = {}) {
  return {
    playerFirstName: 'Test', playerLastName: 'Athlete', guardianFirstName: 'Test', guardianLastName: 'Guardian',
    birthDate: `${new Date().getUTCFullYear() - 10}-01-01`, gender: 'Girl', club: 'Test FC', playingLevel: 'Competitive', positions: ['Forward','Midfielder'], goals: 'Build confidence', existingParticipant: 'No', comments: 'Peanut allergy',
    email: 'guardian@example.com', secondaryEmail: '', phone: '5028074444', secondaryPhone: '', address: 'Test address', city: 'Charlotte', state: 'NC', zip: '28269',
    jerseySize: 'M', financialAssistance: 'No', waiverAccepted: true, photoPermission: false,
    ...overrides,
  };
}
export function responseFixture() { return { setHeader() {}, status(code) { this.code = code; return this; }, json(value) { this.value = value; return this; } }; }
export function databaseFixture() {
  const records = new Map();
  const database = {
    collection: name => ({ doc: id => `${name}/${id}` }),
    runTransaction: async callback => {
      const pending = [];
      const result = await callback({ get: async ref => ({ exists: records.has(ref), data: () => records.get(ref) }), set: (ref,value) => pending.push([ref,value]), create: (ref,value) => pending.push([ref,value]) });
      pending.forEach(([key,value]) => records.set(key,value));
      return result;
    },
  };
  return { database, records };
}
