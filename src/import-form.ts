import * as accountTool from './account-tool';
import * as accountUI from './account-ui';
import * as bananojs from '@bananocoin/bananojs';
bananojs.setBananodeApiUrl('https://kaliumapi.appditto.com/api');

const importButton: HTMLButtonElement = document.getElementById("importButton") as HTMLButtonElement;
const seedInput: HTMLInputElement = document.getElementById("seedInput") as HTMLInputElement;
const seedIndexInput: HTMLInputElement = document.getElementById("seedIndexInput") as HTMLInputElement;
const importSeedForm: HTMLDivElement = document.getElementById("importSeedForm") as HTMLDivElement;
const sendForm: HTMLFormElement = document.getElementById("sendForm") as HTMLFormElement;

importButton.onclick = async (event) => {
  event.preventDefault();
  importButton.disabled = true;

  try {
    const seed = seedInput.value;
    const seedIndex = parseInt(seedIndexInput.value);
    const privateKey = bananojs.getPrivateKey(seed, seedIndex);
    const publicKey = await bananojs.getPublicKey(privateKey);
    const account = bananojs.getBananoAccount(publicKey);
    if (typeof(publicKey) !== 'string') {
      throw "Unexpected publicKey";
    }

    if (typeof(account) !== 'string') {
      throw "Unexpected publicKey";
    }
    
    importSeedForm.classList.add('hidden');
    sendForm.classList.remove('hidden');

    (window as any).bananoAccountInfo = {
      "seed": seed,
      "seedIndex": seedIndex,
      "privateKey": privateKey,
      "publicKey": publicKey,
      "account": account,
      "accountHistory": []
    }

    await accountTool.update();
    accountUI.updateLoop();

  } catch (error) {
    seedInput.classList.remove('border-green-300', 'hover:border-green-400', 'focus:ring-green-400');
    seedInput.classList.add('border-red-400', 'hover:border-red-500', 'focus:ring-gray-500');
    seedIndexInput.classList.remove('border-green-300', 'hover:border-green-400', 'focus:ring-green-400');
    seedIndexInput.classList.add('border-red-400', 'hover:border-red-500', 'focus:ring-gray-500');
    importButton.disabled = false;
  }
  
};
