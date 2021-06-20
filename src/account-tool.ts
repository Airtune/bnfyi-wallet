import * as bananojs from '@bananocoin/bananojs';
import * as accountUI from './account-ui';

const DEFAULT_REPRESENTATIVE = 'ban_1bananobh5rat99qfgt1ptpieie5swmoth87thi74qgbfrij7dcgjiij94xr';

export const update = async () => {
  const response = await receiveDeposits();
  await updateHistory();
  await accountUI.addHistory();
  accountUI.updateLoop();
}

const updateHistory = async () => {
  const bananoAccountInfo = (window as any).bananoAccountInfo;
  const accountHistory = await bananojs.getAccountHistory(bananoAccountInfo.account, 10, bananoAccountInfo.paginationHead);
  bananoAccountInfo.accountHistory = accountHistory;
}

export const lazyRefresh = async () => {
  const response = await receiveDeposits();
  if (typeof(response.receiveCount) !== 'undefined' && response.receiveCount > 0) {
    await updateHistory();
    await accountUI.addHistory();
  }
}

export const receiveDeposits = async () => {
  const bananoAccountInfo = (window as any).bananoAccountInfo;
  const account = bananoAccountInfo.account;
  const seed = bananoAccountInfo.seed;
  const seedIndex = bananoAccountInfo.seedIndex;
  const response = await bananojs.receiveBananoDepositsForSeed(seed, seedIndex, DEFAULT_REPRESENTATIVE);
  return response;
}