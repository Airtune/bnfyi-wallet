import * as accountTool from './account-tool';
import * as accountUI from './account-ui';
import * as bnfyi from 'bnfyi';
import * as bananojs from '@bananocoin/bananojs';

const sendButton: HTMLButtonElement = document.getElementById("sendButton") as HTMLButtonElement;
const sendRecipientInput: HTMLInputElement = document.getElementById("sendRecipientInput") as HTMLInputElement;
const sendAmountInput: HTMLInputElement = document.getElementById("sendAmountInput") as HTMLInputElement;
const sendNoteInput: HTMLInputElement = document.getElementById("sendNoteInput") as HTMLInputElement;

export const sendWithNote = async (destAccount, amountRaw, note) => {
  const bananoAccountInfo = (window as any).bananoAccountInfo;

  await bnfyi.sendWithNote(bananoAccountInfo.seed, bananoAccountInfo.seedIndex, destAccount, amountRaw, note);
}

sendButton.onclick = async (event) => {
  event.preventDefault();
  sendButton.disabled = true;

  try {
    const destAccount = sendRecipientInput.value;
    const amountRaw = bananojs.bananoUtil.getRawStrFromMajorAmountStr(sendAmountInput.value, "ban_");
    const note = sendNoteInput.value;
    await sendWithNote(destAccount, amountRaw, note);
    sendRecipientInput.value = '';
    sendAmountInput.value = '';
    sendNoteInput.value = '';

  } catch (error) {
    sendRecipientInput.classList.remove('border-green-300', 'hover:border-green-400', 'focus:ring-green-400');
    sendRecipientInput.classList.add('border-red-400', 'hover:border-red-500', 'focus:ring-gray-500');
    sendAmountInput.classList.remove('border-green-300', 'hover:border-green-400', 'focus:ring-green-400');
    sendAmountInput.classList.add('border-red-400', 'hover:border-red-500', 'focus:ring-gray-500');
    sendButton.disabled = false;
    throw(error.message);
  }
  
};
