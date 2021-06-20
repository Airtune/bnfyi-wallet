import * as bananojs from '@bananocoin/bananojs';
import * as bnfyi from 'bnfyi';
import * as accountTool from './account-tool';
import * as DOMPurify from 'dompurify';

// Limit lookback to 6 blocks for the sake of keep the wallet lightweight.
const LOOKBACK_BLOCK_COUNT = 7;

// TODO: Set up socket instead of polling the node.
(window as Window).addEventListener('focus', () => {
  (window as any).bananoRefreshRate = 1000;
});

(window as Window).addEventListener('blur', () => {
  (window as any).bananoRefreshRate = 6000;
});

export const addHistory = async () => {
  const bananoAccountInfo = (window as any).bananoAccountInfo;

  let innerHTML = "";
  for (const block of bananoAccountInfo.accountHistory.history.reverse()) {
    const bananoParts = await bananojs.getBananoPartsFromRaw(block.amount);
    let humanAmount = bananoParts.banano + '.' + bananoParts.banoshi.padStart(2, '0');
    let note = "";
    switch (block.type) {
      case "send":
        note = "";
        try {
          let bnfyiData = await bnfyi.decodeFromSend(bananoAccountInfo.account, block.hash, LOOKBACK_BLOCK_COUNT);
          if (typeof(bnfyiData) !== 'undefined' && typeof(bnfyiData.note) === 'string') {
            note = bnfyiData.note;
          }
        } catch (error) {
          console.log("addHistory send");
          console.log(error);
        }
        innerHTML += createSendHTML(block.account, "-" + humanAmount, note);
        break;

      case "receive":
        note = "";
        try {
          const accountHistory = await bananojs.getAccountHistory(bananoAccountInfo.account, 1, block.hash, true);
          let rawBlock = accountHistory.history[0];
          console.log("rawBlock");
          console.log(rawBlock);
          let bnfyiData = await bnfyi.decodeFromReceive(rawBlock.link, LOOKBACK_BLOCK_COUNT);
          if (typeof(bnfyiData) !== 'undefined' && typeof(bnfyiData.note) === 'string') {
            note = bnfyiData.note;
          }
        } catch (error) {
          console.log("addHistory receive");
          console.log(error);
        }
        innerHTML += createReceiveHTML(block.account, "+" + humanAmount, note);
        break;

      default:
        break;
    }
  }

  innerHTML = DOMPurify.sanitize(innerHTML, {USE_PROFILES: {html: true}});
  document.getElementById("accountHistory").innerHTML = innerHTML;
}

export let updateLoop;
updateLoop = async () => {
  await accountTool.lazyRefresh();
  setTimeout(updateLoop, (window as any).bananoRefreshRate);
}

const createSendHTML = (account, amount, text) => {
  return `
    <div class="col-span-11 bg-yellow-100 shadow border border-yellow-200 rounded-lg m-1 p-2 grid grid-cols-8">
      <div class="col-span-6">
        <a href="https://creeper.banano.cc/explorer/account/${encodeURIComponent(account)}/history" class="text-gray-800 hover:underline flex"><span class="flex-initial truncate">${account.slice(0,56)}</span><span class="flex-initial">${account.slice(56,64)}</span></a>
        <i class="text-gray-600">${text}</i>
      </div>
      <div class="text-red-700 flex-right text-right m-1 col-span-2">${amount}<span class="hidden md:inline"> Banano</span></div>
    </div>
    <div class="col-span-1"></div>
  `;
}

const createReceiveHTML = (account, amount, text) => {
  return `
    <div class="col-span-1"></div>
    <div class="col-span-11 bg-green-100 shadow border border-green-200 rounded-lg m-1 p-2 grid grid-cols-8">
      <div class="col-span-6">
        <a href="https://creeper.banano.cc/explorer/account/${encodeURIComponent(account)}/history" class="text-gray-900 hover:underline flex"><span class="flex-initial truncate">${account.slice(0,56)}</span><span class="flex-initial">${account.slice(56,64)}</span></a>
        <i class="text-gray-600">${text}</i>
      </div>
      <div class="text-green-900 text-right m-1 col-span-2">${amount}<span class="hidden md:inline"> Banano</span></div>
    </div>
  `;
}