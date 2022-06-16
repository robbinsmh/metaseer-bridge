import { TokenPair } from 'src/config/ConfigInterface';

describe('Crypto Bridge', () => {
  it('get bsc tokens config', async () => {
    const bscTokens: TokenPair[] = [
      // production
      // {
      //   decimals: 18,
      //   bepToken: '0xfa1e1754bd2896d467930c97d07af799c531cb7d',
      //   slpTokenAddress: '0xEe33A178F09C5326141313f9bB7b275298A03705',
      //   smAddress: '0x34ffC27670fd6127AC5878E2d46383B06302914f',
      // },
      // staging
      {
        bsc: {
          decimals: 18,
          token: '0x2b759AB9495C5767cF775845A6246e405a87517C',
          slpTokenAddress: '0xEe33A178F09C5326141313f9bB7b275298A03705',
        },
        sol: {
          decimals: 9,
          token: '6JMenadSsShX5gdyfK4RKzBFTGgLvj3QLNTnkwES7H1j',
          wallet: '63Nfg5RFdu2MZpbgtz7ERJZK37auwDfRQoUeg7PbAETx',
        },
      },
      {
        bsc: {
          decimals: 18,
          token: '0xDF3FE6Ac04e0e03270e6F4E6E30dF73Ad5d8f330',
          slpTokenAddress: '0xd559e668ba6cc36e26e75a51b5668cfc6407d8d5',
        },
        sol: {
          decimals: 9,
          token: '2WHNoAUxrd4T7y6oV64XHo38oo5tsdggiU71kbidKj7J',
          wallet: 'AnaXKwUk3EXeJZd8GwspefVsCtKnueaaLRdx5UHHYhU2',
        },
      },
    ];
    console.log('output:', JSON.stringify(bscTokens));
  });
});
