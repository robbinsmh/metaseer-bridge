export default {
  type: "object",
  properties: {
    txId: { type: 'string' },
    address: { type: 'string' },
    timestamp: { type: 'number' }
  },
  required: ['address', 'txId']
} as const;
